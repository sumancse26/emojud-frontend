import { useMemo, useCallback, useState, useEffect } from 'react';
import { useApi } from '@/shared/hooks/useApi';
import { productService } from '../services/productService';
import type {
    ProductItem,
    ShopWiseProductItem,
    ProductCategoryEntry,
    ProductLookupItem,
    ProductListParams,
    ProductListResponse,
    ShopWiseProductListResponse,
    CreateUpdateProductPayload,
    ProductMutationResponse
} from '../types/product.types';

export interface UseProductOptions {
    initialParams?: ProductListParams;
    immediate?: boolean;
    autoRefetchOnMutation?: boolean;
    onSuccess?: (data: ProductListResponse) => void;
    onError?: (error: string) => void;
}

export function parseProductLookups(raw: unknown): {
    brands: ProductLookupItem[];
    units: ProductLookupItem[];
} {
    const brands: ProductLookupItem[] = [];
    const units: ProductLookupItem[] = [];

    if (!raw) return { brands, units };

    const payload =
        typeof raw === 'object' && raw !== null && 'data' in raw
            ? (raw as { data: unknown }).data
            : raw;

    const toLookup = (item: unknown): ProductLookupItem | null => {
        if (!item || typeof item !== 'object') return null;
        const rec = item as Record<string, unknown>;
        if (rec.id === undefined) return null;
        return {
            id: String(rec.id),
            lookup_code: String(rec.lookup_code ?? ''),
            lookup_value: String(rec.lookup_value ?? rec.lookup_code ?? rec.id),
            lookup_type_id: rec.lookup_type_id ? String(rec.lookup_type_id) : undefined
        };
    };

    if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
        const record = payload as Record<string, unknown>;
        const rawBrands = record['3'] ?? record.brand ?? record.brands;
        const rawUnits = record['4'] ?? record.uom ?? record.unit ?? record.units;

        if (Array.isArray(rawBrands)) {
            rawBrands.forEach((it) => {
                const parsed = toLookup(it);
                if (parsed) brands.push(parsed);
            });
        }
        if (Array.isArray(rawUnits)) {
            rawUnits.forEach((it) => {
                const parsed = toLookup(it);
                if (parsed) units.push(parsed);
            });
        }
    } else if (Array.isArray(payload)) {
        payload.forEach((entry) => {
            if (!entry || typeof entry !== 'object') return;
            const rec = entry as Record<string, unknown>;
            const groupId = String(rec.lookup_type_id ?? rec.lookup_id ?? rec.type_id ?? rec.id ?? '');
            const items = rec.items ?? rec.data ?? rec.lookups;
            if (Array.isArray(items)) {
                items.forEach((it) => {
                    const parsed = toLookup(it);
                    if (parsed) {
                        if (groupId === '3') brands.push(parsed);
                        else if (groupId === '4') units.push(parsed);
                    }
                });
            } else {
                const parsed = toLookup(rec);
                if (parsed) {
                    if (groupId === '3' || parsed.lookup_type_id === '3') brands.push(parsed);
                    else if (groupId === '4' || parsed.lookup_type_id === '4') units.push(parsed);
                }
            }
        });
    }

    return { brands, units };
}

function extractList<T>(res: unknown): T[] {
    if (!res) return [];
    if (Array.isArray(res)) return res as T[];
    if (typeof res === 'object' && res !== null && 'data' in res && Array.isArray((res as { data: unknown }).data)) {
        return (res as { data: T[] }).data;
    }
    return [];
}

export interface UseProductReturn {
    products: ProductItem[];
    shopWiseProducts: ShopWiseProductItem[];
    categories: ProductCategoryEntry[];
    brands: ProductLookupItem[];
    units: ProductLookupItem[];
    rawProductsResponse: ProductListResponse | null;
    rawShopWiseResponse: ShopWiseProductListResponse | null;
    isLoading: boolean;
    isLoadingShopWise: boolean;
    isLoadingMasters: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: string | null;
    mastersError: string | null;
    refetch: () => Promise<ProductListResponse>;
    refetchShopWise: () => Promise<ShopWiseProductListResponse>;
    fetchMasters: () => Promise<void>;
    fetchSubCategories: (categoryId: string | number) => Promise<ProductCategoryEntry[]>;
    createOrUpdateProduct: (payload: CreateUpdateProductPayload) => Promise<ProductMutationResponse>;
    isSaving: boolean;
    isSaveSuccess: boolean;
    isSaveError: boolean;
    saveError: string | null;
}

export function useProduct(options: UseProductOptions = {}): UseProductReturn {
    const {
        initialParams,
        immediate = true,
        autoRefetchOnMutation = true,
        onSuccess,
        onError
    } = options;

    // ─── 1. Query: Master Products List (/api/products) ────────────────
    const {
        data: rawProductsResponse,
        isLoading,
        isSuccess,
        isError,
        error,
        execute: executeFetchProducts
    } = useApi<ProductListResponse, ProductListParams | void>(
        (params) => productService.getProducts(params ?? initialParams),
        {
            immediate,
            initialParams,
            onSuccess,
            onError
        }
    );

    // ─── 2. Query: Shop-Wise Products List (/api/shop-wise-products) ───
    const {
        data: rawShopWiseResponse,
        isLoading: isLoadingShopWise,
        execute: executeFetchShopWise
    } = useApi<ShopWiseProductListResponse, ProductListParams | void>(
        (params) => productService.getShopWiseProducts(params ?? initialParams),
        {
            immediate,
            initialParams
        }
    );

    // ─── 3. Query: Master Dropdown Data (Categories & Common Lookups) ──
    const [categories, setCategories] = useState<ProductCategoryEntry[]>([]);
    const [brands, setBrands] = useState<ProductLookupItem[]>([]);
    const [units, setUnits] = useState<ProductLookupItem[]>([]);
    const [isLoadingMasters, setIsLoadingMasters] = useState(false);
    const [mastersError, setMastersError] = useState<string | null>(null);

    const fetchMasters = useCallback(async () => {
        setIsLoadingMasters(true);
        setMastersError(null);
        try {
            const [catRes, lookupRes] = await Promise.all([
                productService.getCategories().catch(() => []),
                productService.getLookups().catch(() => null)
            ]);
            setCategories(extractList<ProductCategoryEntry>(catRes));
            const { brands: parsedBrands, units: parsedUnits } = parseProductLookups(lookupRes);
            setBrands(parsedBrands);
            setUnits(parsedUnits);
        } catch (err) {
            setMastersError(err instanceof Error ? err.message : 'Failed to load product form masters');
        } finally {
            setIsLoadingMasters(false);
        }
    }, []);

    useEffect(() => {
        if (immediate) {
            void fetchMasters();
        }
    }, [immediate, fetchMasters]);

    // ─── 4. Query: Subcategories On Demand (/api/product-sub-category/:id)
    const fetchSubCategories = useCallback(async (categoryId: string | number): Promise<ProductCategoryEntry[]> => {
        if (!categoryId) return [];
        try {
            const res = await productService.getSubCategories(categoryId);
            return extractList<ProductCategoryEntry>(res);
        } catch {
            return [];
        }
    }, []);

    // ─── 5. Mutation: Create or Update (/api/products) ────────────────
    const {
        isLoading: isSaving,
        isSuccess: isSaveSuccess,
        isError: isSaveError,
        error: saveError,
        execute: executeMutation
    } = useApi<ProductMutationResponse, CreateUpdateProductPayload>((payload) =>
        productService.createOrUpdateProduct(payload)
    );

    // ─── Parse raw shop-wise list ─────────────────────────────────────
    const shopWiseProducts = useMemo<ShopWiseProductItem[]>(() => {
        return extractList<ShopWiseProductItem>(rawShopWiseResponse);
    }, [rawShopWiseResponse]);

    // ─── Map shop-wise stock by product_code and id ────────────────────
    const stockMap = useMemo<Map<string, string | number>>(() => {
        const map = new Map<string, string | number>();
        shopWiseProducts.forEach((item) => {
            if (item.product_code) {
                map.set(item.product_code.toLowerCase(), item.avail_stock);
            }
            if (item.id) {
                map.set(String(item.id), item.avail_stock);
            }
        });
        return map;
    }, [shopWiseProducts]);

    // ─── Parse master products and merge avail_stock ──────────────────
    const products = useMemo<ProductItem[]>(() => {
        const list = extractList<ProductItem>(rawProductsResponse);
        return list.map((item) => {
            const stock =
                stockMap.get(item.product_code?.toLowerCase()) ??
                stockMap.get(String(item.id)) ??
                item.avail_stock;

            return {
                ...item,
                avail_stock: stock !== undefined ? stock : '—'
            };
        });
    }, [rawProductsResponse, stockMap]);

    // ─── Mutation wrapper with auto-refetch ───────────────────────────
    const createOrUpdateProduct = useCallback(
        async (payload: CreateUpdateProductPayload): Promise<ProductMutationResponse> => {
            const res = await executeMutation(payload);
            if (autoRefetchOnMutation) {
                await Promise.allSettled([
                    executeFetchProducts(initialParams),
                    executeFetchShopWise(initialParams)
                ]);
            }
            return res;
        },
        [executeMutation, autoRefetchOnMutation, executeFetchProducts, executeFetchShopWise, initialParams]
    );

    return {
        products,
        shopWiseProducts,
        categories,
        brands,
        units,
        rawProductsResponse,
        rawShopWiseResponse,
        isLoading,
        isLoadingShopWise,
        isLoadingMasters,
        isSuccess,
        isError,
        error,
        mastersError,
        refetch: () => executeFetchProducts(initialParams),
        refetchShopWise: () => executeFetchShopWise(initialParams),
        fetchMasters,
        fetchSubCategories,
        createOrUpdateProduct,
        isSaving,
        isSaveSuccess,
        isSaveError,
        saveError
    };
}

export default useProduct;
