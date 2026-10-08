import React, { useState, useMemo } from 'react';
import { useCategory } from '../hooks/useCategory';
import { ProductCategoryPresenter } from './presenters/ProductCategoryPresenter';
import { tokenStorage } from '@/shared/services/tokenStorage';
import { useToast } from '@/shared/components/Toast';
import type { User } from '@/app/modules/auth/types/auth.types';
import type { ProductCategoryItem, CreateUpdateCategoryPayload } from '../types/category.types';

const getDefaultCategoryFormData = (
    companyId: number = 1,
    userId: number = 1,
    parentId: string | number | null = null
): CreateUpdateCategoryPayload => ({
    id: null,
    parent_category_id: parentId,
    category_name: '',
    company_id: companyId,
    created_by: userId
});

export const ProductCategoryPage: React.FC = () => {
    const user = tokenStorage.getUser<User>();
    const userCompanyId = Number(user?.branchId ?? 1);
    const userId = Number(user?.id ?? 1);

    const {
        categories,
        isLoading,
        isError,
        error,
        createOrUpdateCategory,
        isSaving,
        saveError,
        refetch
    } = useCategory();

    const toast = useToast();

    const [searchQuery, setSearchQuery] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ProductCategoryItem | null>(null);
    const [parentCategoryForSub, setParentCategoryForSub] = useState<ProductCategoryItem | null>(null);
    const [formData, setFormData] = useState<CreateUpdateCategoryPayload>(() =>
        getDefaultCategoryFormData(userCompanyId, userId)
    );

    const filteredCategories = useMemo(() => {
        if (!searchQuery.trim()) return categories;
        const q = searchQuery.toLowerCase();
        return categories.filter(
            (cat) =>
                cat.category_name?.toLowerCase().includes(q) ||
                cat.subcategories?.some((sub) => sub.category_name?.toLowerCase().includes(q))
        );
    }, [categories, searchQuery]);

    const openCreate = () => {
        setEditingCategory(null);
        setParentCategoryForSub(null);
        setFormData(getDefaultCategoryFormData(userCompanyId, userId, null));
        setDrawerOpen(true);
    };

    const openCreateSubcategory = (parentCat: ProductCategoryItem) => {
        setEditingCategory(null);
        setParentCategoryForSub(parentCat);
        setFormData(getDefaultCategoryFormData(userCompanyId, userId, parentCat.id));
        setDrawerOpen(true);
    };

    const openEdit = (cat: ProductCategoryItem, parent?: ProductCategoryItem) => {
        setEditingCategory(cat);
        setParentCategoryForSub(parent ?? null);
        setFormData({
            id: cat.id,
            parent_category_id: cat.parent_category_id ?? (parent ? parent.id : null),
            category_name: cat.category_name ?? '',
            company_id: Number(cat.company_id ?? userCompanyId),
            created_by: Number(cat.created_by ?? userId)
        });
        setDrawerOpen(true);
    };

    const handleFormFieldChange = <K extends keyof CreateUpdateCategoryPayload>(
        field: K,
        value: CreateUpdateCategoryPayload[K]
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!formData.category_name?.trim()) {
            toast.warning('Category name is required.');
            return;
        }

        const isUpdating = Boolean(editingCategory);
        const isSubcategory = Boolean(formData.parent_category_id || parentCategoryForSub);

        try {
            await createOrUpdateCategory({
                ...formData,
                parent_category_id: formData.parent_category_id ? Number(formData.parent_category_id) : null,
                company_id: Number(formData.company_id || userCompanyId),
                created_by: Number(formData.created_by || userId)
            });

            toast.success(
                isUpdating
                    ? `${isSubcategory ? 'Subcategory' : 'Category'} "${formData.category_name}" updated successfully!`
                    : `${isSubcategory ? 'Subcategory' : 'Category'} "${formData.category_name}" created successfully!`
            );
            setDrawerOpen(false);
            setEditingCategory(null);
            setParentCategoryForSub(null);
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to save category. Please try again.';
            toast.error(errorMsg);
            console.error('Failed to create/update category:', err);
        }
    };

    return (
        <ProductCategoryPresenter
            categories={categories}
            filteredCategories={filteredCategories}
            isLoading={isLoading}
            isError={isError}
            error={error}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenCreate={openCreate}
            onOpenCreateSubcategory={openCreateSubcategory}
            onOpenEdit={openEdit}
            drawerOpen={drawerOpen}
            onCloseDrawer={() => setDrawerOpen(false)}
            editingId={editingCategory ? String(editingCategory.id) : null}
            parentCategoryForSub={parentCategoryForSub}
            formData={formData}
            onFormFieldChange={handleFormFieldChange}
            onSubmit={handleSubmit}
            isSaving={isSaving}
            saveError={saveError}
            onRefetch={() => refetch()}
        />
    );
};

export default ProductCategoryPage;
