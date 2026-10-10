import { useMemo, useCallback } from 'react';
import { useApi } from '@/shared/hooks/useApi';
import { productService } from '../services/productService';
import type {
    ProductItem,
    ShopWiseProductItem,
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

export interface UseProductReturn {
    products: ProductItem[];
    shopWiseProducts: ShopWiseProductItem[];
    rawProductsResponse: ProductListResponse | null;
    rawShopWiseResponse: ShopWiseProductListResponse | null;
    isLoading: boolean;
    isLoadingShopWise: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: string | null;
    refetch: () => Promise<ProductListResponse>;
    refetchShopWise: () => Promise<ShopWiseProductListResponse>;
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

    // ─── 3. Mutation: Create or Update (/api/products) ────────────────
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
        if (!rawShopWiseResponse) return [];
        if (Array.isArray(rawShopWiseResponse)) return rawShopWiseResponse;
        if (typeof rawShopWiseResponse === 'object' && 'data' in rawShopWiseResponse && Array.isArray(rawShopWiseResponse.data)) {
            return rawShopWiseResponse.data;
        }
        return [];
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
        let list: ProductItem[] = [];
        if (rawProductsResponse) {
            if (Array.isArray(rawProductsResponse)) {
                list = rawProductsResponse;
            } else if (typeof rawProductsResponse === 'object' && 'data' in rawProductsResponse && Array.isArray(rawProductsResponse.data)) {
                list = rawProductsResponse.data;
            }
        }

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
        rawProductsResponse,
        rawShopWiseResponse,
        isLoading,
        isLoadingShopWise,
        isSuccess,
        isError,
        error,
        refetch: () => executeFetchProducts(initialParams),
        refetchShopWise: () => executeFetchShopWise(initialParams),
        createOrUpdateProduct,
        isSaving,
        isSaveSuccess,
        isSaveError,
        saveError
    };
}

export default useProduct;
