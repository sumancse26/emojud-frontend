import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '@/app/providers';
import { useToast } from '@/shared/components/Toast';
import { useProduct } from '../hooks/useProduct';
import { useCategory } from '@/app/modules/configurations/hooks/useCategory';
import { ProductsPresenter } from './presenters/ProductsPresenter';
import type { DropdownOption } from '@/shared';
import type { ProductItem, CreateUpdateProductPayload } from '../types/product.types';

const defaultFormState: CreateUpdateProductPayload = {
    product_name: '',
    product_code: '',
    specifications: '',
    barcode: '',
    category_id: '',
    sub_category_id: '',
    brand_id: '',
    unit_id: '',
    purchase_rate: '',
    retail_rate: '',
    sales_rate: '',
    min_stock_qty: 10,
    image: '',
    is_batch_wise: 0,
    is_expire_wise: 0,
    status: 1
};

export const ProductsPage: React.FC = () => {
    const { selectedBranch } = useApp();
    const toast = useToast();

    // ─── Query Params ─────────────────────────────────────────────────
    const productParams = useMemo(
        () => ({ shop_id: selectedBranch }),
        [selectedBranch]
    );

    // ─── Products Hook ────────────────────────────────────────────────
    const {
        products,
        shopWiseProducts,
        isLoading,
        isError,
        error,
        refetch,
        refetchShopWise,
        createOrUpdateProduct,
        isSaving,
        saveError
    } = useProduct({
        immediate: true,
        initialParams: productParams
    });

    // ─── Category Hook ────────────────────────────────────────────────
    const {
        categories,
        isLoading: isLoadingCategories,
        fetchSubCategories
    } = useCategory({ immediate: true, loadSubcategories: false });

    // ─── Local UI States ──────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'shopWise'>('all');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
    const [formState, setFormState] = useState<CreateUpdateProductPayload>(defaultFormState);
    const [subCategoriesList, setSubCategoriesList] = useState<{ id: string | number; category_name: string }[]>([]);

    // ─── Fetch Subcategories on Category Change ───────────────────────
    useEffect(() => {
        if (!formState.category_id) {
            setSubCategoriesList([]);
            return;
        }

        let isMounted = true;
        fetchSubCategories(formState.category_id)
            .then((subs) => {
                if (isMounted) {
                    setSubCategoriesList(subs || []);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setSubCategoriesList([]);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [formState.category_id, fetchSubCategories]);

    // ─── Dropdown Options ─────────────────────────────────────────────
    const categoryOptions = useMemo<DropdownOption[]>(() => {
        return categories.map((c) => ({
            value: String(c.id),
            label: c.category_name,
            subLabel: c.display_code
        }));
    }, [categories]);

    const subCategoryOptions = useMemo<DropdownOption[]>(() => {
        return subCategoriesList.map((s) => ({
            value: String(s.id),
            label: s.category_name
        }));
    }, [subCategoriesList]);

    // Collect Brands & Units dynamically from products with fallbacks
    const brandOptions = useMemo<DropdownOption[]>(() => {
        const map = new Map<string, string>();
        products.forEach((p) => {
            if (p.brand?.id && p.brand?.lookup_value) {
                map.set(String(p.brand.id), p.brand.lookup_value);
            }
        });
        if (map.size === 0) {
            // default standard brand choices if none in product list yet
            return [
                { value: '1', label: 'General / No Brand' },
                { value: '12', label: 'Vivo' },
                { value: '13', label: 'Samsung' },
                { value: '14', label: 'Infinix' },
                { value: '15', label: 'Apple' }
            ];
        }
        return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
    }, [products]);

    const unitOptions = useMemo<DropdownOption[]>(() => {
        const map = new Map<string, string>();
        products.forEach((p) => {
            if (p.units?.id && p.units?.lookup_value) {
                map.set(String(p.units.id), p.units.lookup_value);
            }
        });
        if (map.size === 0) {
            return [
                { value: '17', label: 'PCS (Pieces)' },
                { value: '18', label: 'BOX (Boxes)' },
                { value: '19', label: 'KG (Kilograms)' },
                { value: '20', label: 'PACK (Packs)' }
            ];
        }
        return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
    }, [products]);

    // ─── Filtering based on tab and search query ──────────────────────
    const filteredProducts = useMemo(() => {
        let baseList: ProductItem[] = [];

        if (activeTab === 'shopWise') {
            // Map shop-wise product items into ProductItem structure
            baseList = shopWiseProducts.map((sp) => ({
                id: sp.id,
                product_code: sp.product_code,
                product_name: sp.product_name,
                purchase_rate: sp.purchase_rate,
                retail_rate: sp.retail_rate,
                sales_rate: sp.sales_rate,
                avail_stock: sp.avail_stock
            }));
        } else {
            baseList = products;
        }

        if (!searchQuery.trim()) return baseList;
        const q = searchQuery.toLowerCase();

        return baseList.filter((item) => {
            return (
                item.product_name?.toLowerCase().includes(q) ||
                item.product_code?.toLowerCase().includes(q) ||
                (item.barcode && String(item.barcode).toLowerCase().includes(q)) ||
                (item.category?.category_name && item.category.category_name.toLowerCase().includes(q)) ||
                (item.brand?.lookup_value && item.brand.lookup_value.toLowerCase().includes(q))
            );
        });
    }, [products, shopWiseProducts, activeTab, searchQuery]);

    // ─── Handlers ─────────────────────────────────────────────────────
    const handleOpenCreate = () => {
        setEditingProduct(null);
        setFormState({
            ...defaultFormState,
            product_code: `PRD-${Date.now().toString().slice(-5)}`
        });
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (item: ProductItem) => {
        setEditingProduct(item);
        setFormState({
            id: Number(item.id),
            product_name: item.product_name,
            product_code: item.product_code,
            specifications: item.specifications ?? '',
            barcode: item.barcode ?? '',
            category_id: item.category?.id ? Number(item.category.id) : '',
            sub_category_id: (item as Record<string, unknown>).sub_category_id
                ? Number((item as Record<string, unknown>).sub_category_id)
                : '',
            brand_id: item.brand?.id ? Number(item.brand.id) : '',
            unit_id: item.units?.id ? Number(item.units.id) : '',
            purchase_rate: item.purchase_rate ?? '',
            retail_rate: item.retail_rate ?? '',
            sales_rate: item.sales_rate ?? '',
            min_stock_qty: item.min_stock_qty ?? 10,
            image: (item as Record<string, unknown>).image ? Number((item as Record<string, unknown>).image) : '',
            is_batch_wise: Number(item.is_batch_wise ?? 0),
            is_expire_wise: Number(item.is_expire_wise ?? 0),
            status: item.status !== undefined ? Number(item.status) : 1
        });
        setIsDrawerOpen(true);
    };

    const handleFormFieldChange = <K extends keyof CreateUpdateProductPayload>(
        field: K,
        value: CreateUpdateProductPayload[K]
    ) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!formState.product_name?.trim()) {
            toast.warning('Product name is required.');
            return;
        }
        if (!formState.product_code?.trim()) {
            toast.warning('Product code / SKU is required.');
            return;
        }
        if (formState.purchase_rate === '' || isNaN(Number(formState.purchase_rate))) {
            toast.warning('Valid purchase rate is required.');
            return;
        }
        if (formState.retail_rate === '' || isNaN(Number(formState.retail_rate))) {
            toast.warning('Valid retail rate is required.');
            return;
        }
        if (formState.sales_rate === '' || isNaN(Number(formState.sales_rate))) {
            toast.warning('Valid sales rate is required.');
            return;
        }

        const isUpdating = Boolean(editingProduct);

        const payload: CreateUpdateProductPayload = {
            ...(isUpdating && editingProduct ? { id: Number(editingProduct.id) } : {}),
            product_name: formState.product_name.trim(),
            product_code: formState.product_code.trim(),
            specifications: formState.specifications?.trim() || undefined,
            barcode: formState.barcode?.trim() || undefined,
            category_id: formState.category_id ? Number(formState.category_id) : undefined,
            sub_category_id: formState.sub_category_id ? Number(formState.sub_category_id) : undefined,
            brand_id: formState.brand_id ? Number(formState.brand_id) : undefined,
            unit_id: formState.unit_id ? Number(formState.unit_id) : undefined,
            purchase_rate: Number(formState.purchase_rate),
            retail_rate: Number(formState.retail_rate),
            sales_rate: Number(formState.sales_rate),
            min_stock_qty: formState.min_stock_qty !== '' ? Number(formState.min_stock_qty) : 0,
            image: formState.image ? Number(formState.image) : undefined,
            is_batch_wise: Number(formState.is_batch_wise || 0),
            is_expire_wise: Number(formState.is_expire_wise || 0),
            status: Number(formState.status ?? 1),
            shop_id: Number(selectedBranch)
        };

        try {
            await createOrUpdateProduct(payload);
            toast.success(
                isUpdating
                    ? `Product "${formState.product_name}" updated successfully!`
                    : `Product "${formState.product_name}" registered successfully!`
            );
            setIsDrawerOpen(false);
            setEditingProduct(null);
            setFormState(defaultFormState);
        } catch (err: unknown) {
            const errorMsg =
                err instanceof Error ? err.message : 'Failed to save product. Please try again.';
            toast.error(errorMsg);
        }
    };

    const handleRefetch = () => {
        void Promise.allSettled([refetch(), refetchShopWise()]);
    };

    return (
        <ProductsPresenter
            products={products}
            filteredProducts={filteredProducts}
            isLoading={isLoading}
            isError={isError}
            error={error}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            isDrawerOpen={isDrawerOpen}
            onCloseDrawer={() => setIsDrawerOpen(false)}
            editingProduct={editingProduct}
            formState={formState}
            onFormFieldChange={handleFormFieldChange}
            onOpenCreate={handleOpenCreate}
            onOpenEdit={handleOpenEdit}
            onSave={handleSave}
            isSaving={isSaving}
            saveError={saveError}
            onRefetch={handleRefetch}
            categoryOptions={categoryOptions}
            subCategoryOptions={subCategoryOptions}
            brandOptions={brandOptions}
            unitOptions={unitOptions}
            isLoadingCategories={isLoadingCategories}
        />
    );
};

export default ProductsPage;
