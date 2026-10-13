import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useApp } from '@/app/providers';
import { useToast } from '@/shared/components/Toast';
import { useProduct } from '../hooks/useProduct';
import { ProductsPresenter } from './presenters/ProductsPresenter';
import type { DropdownOption } from '@/shared';
import type { ProductItem, CreateUpdateProductPayload, ProductCategoryEntry } from '../types/product.types';

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
    image: null,
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
        categories,
        brands,
        units,
        isLoading,
        isLoadingMasters,
        isError,
        error,
        refetch,
        refetchShopWise,
        fetchMasters,
        fetchSubCategories,
        createOrUpdateProduct,
        isSaving,
        saveError
    } = useProduct({
        immediate: true,
        initialParams: productParams
    });

    // ─── Local UI States ──────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'shopWise'>('all');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
    const [formState, setFormState] = useState<CreateUpdateProductPayload>(defaultFormState);
    const [subCategoriesList, setSubCategoriesList] = useState<ProductCategoryEntry[]>([]);
    const [isLoadingSubCategories, setIsLoadingSubCategories] = useState(false);

    // ─── Fetch Subcategories on Category Change ───────────────────────
    useEffect(() => {
        if (!formState.category_id) {
            setSubCategoriesList([]);
            return;
        }

        let isMounted = true;
        setIsLoadingSubCategories(true);
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
            })
            .finally(() => {
                if (isMounted) {
                    setIsLoadingSubCategories(false);
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
            subLabel: c.display_code ? String(c.display_code) : undefined
        }));
    }, [categories]);

    const subCategoryOptions = useMemo<DropdownOption[]>(() => {
        return subCategoriesList.map((s) => ({
            value: String(s.id),
            label: s.category_name,
            subLabel: s.display_code ? String(s.display_code) : undefined
        }));
    }, [subCategoriesList]);

    const brandOptions = useMemo<DropdownOption[]>(() => {
        return brands.map((b) => ({
            value: String(b.id),
            label: b.lookup_value,
            subLabel: b.lookup_code !== b.lookup_value ? b.lookup_code : undefined
        }));
    }, [brands]);

    const unitOptions = useMemo<DropdownOption[]>(() => {
        return units.map((u) => ({
            value: String(u.id),
            label: u.lookup_value,
            subLabel: u.lookup_code !== u.lookup_value ? u.lookup_code : undefined
        }));
    }, [units]);

    // ─── Filtering based on tab and search query ──────────────────────
    const filteredProducts = useMemo(() => {
        let baseList: ProductItem[] = [];

        if (activeTab === 'shopWise') {
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
    const handleOpenCreate = useCallback(() => {
        setEditingProduct(null);
        setFormState({
            ...defaultFormState,
            product_code: `PRD-${Date.now().toString().slice(-5)}`
        });
        setSubCategoriesList([]);
        void fetchMasters();
        setIsDrawerOpen(true);
    }, [fetchMasters]);

    const handleOpenEdit = useCallback(
        (item: ProductItem) => {
            setEditingProduct(item);
            void fetchMasters();

            const catId = item.category?.id ? Number(item.category.id) : '';
            const subCatId = (item as Record<string, unknown>).sub_category_id
                ? Number((item as Record<string, unknown>).sub_category_id)
                : '';

            setFormState({
                id: Number(item.id),
                product_name: item.product_name,
                product_code: item.product_code,
                specifications: item.specifications ?? '',
                barcode: item.barcode ?? '',
                category_id: catId,
                sub_category_id: subCatId,
                brand_id: item.brand?.id ? Number(item.brand.id) : '',
                unit_id: item.units?.id ? Number(item.units.id) : '',
                purchase_rate: item.purchase_rate ?? '',
                retail_rate: item.retail_rate ?? '',
                sales_rate: item.sales_rate ?? '',
                min_stock_qty: item.min_stock_qty ?? 10,
                image: (item as Record<string, unknown>).image ? Number((item as Record<string, unknown>).image) : null,
                is_batch_wise: Number(item.is_batch_wise ?? 0),
                is_expire_wise: Number(item.is_expire_wise ?? 0),
                status: item.status !== undefined ? Number(item.status) : 1
            });

            if (catId) {
                fetchSubCategories(catId)
                    .then((subs) => setSubCategoriesList(subs || []))
                    .catch(() => setSubCategoriesList([]));
            } else {
                setSubCategoriesList([]);
            }

            setIsDrawerOpen(true);
        },
        [fetchMasters, fetchSubCategories]
    );

    const handleFormFieldChange = <K extends keyof CreateUpdateProductPayload>(
        field: K,
        value: CreateUpdateProductPayload[K]
    ) => {
        setFormState((prev) => {
            const next = { ...prev, [field]: value };
            if (field === 'category_id' && value !== prev.category_id) {
                next.sub_category_id = '';
            }
            return next;
        });
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
            specifications: formState.specifications?.trim() || null,
            barcode: formState.barcode?.trim() || null,
            category_id: formState.category_id ? Number(formState.category_id) : null,
            sub_category_id: formState.sub_category_id ? Number(formState.sub_category_id) : null,
            brand_id: formState.brand_id ? Number(formState.brand_id) : null,
            unit_id: formState.unit_id ? Number(formState.unit_id) : null,
            purchase_rate: Number(formState.purchase_rate),
            retail_rate: Number(formState.retail_rate),
            sales_rate: Number(formState.sales_rate),
            min_stock_qty: formState.min_stock_qty !== '' && formState.min_stock_qty !== null ? Number(formState.min_stock_qty) : 10,
            image: formState.image ? Number(formState.image) : null,
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
        void Promise.allSettled([refetch(), refetchShopWise(), fetchMasters()]);
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
            isLoadingCategories={isLoadingMasters}
            isLoadingSubCategories={isLoadingSubCategories}
        />
    );
};

export default ProductsPage;
