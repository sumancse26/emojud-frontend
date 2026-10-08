import React from 'react';
import {
    Plus,
    Tag,
    Layers,
    Edit3,
    Save,
    Search,
    Loader2,
    AlertCircle,
    RefreshCw,
    FolderTree
} from 'lucide-react';
import { SliderDrawer, FormField, inputClasses, PageHeader, Pagination, Skeleton } from '@/shared';
import type { ProductCategoryItem, CreateUpdateCategoryPayload } from '../../types/category.types';

export interface ProductCategoryPresenterProps {
    categories: ProductCategoryItem[];
    filteredCategories: ProductCategoryItem[];
    isLoading: boolean;
    isError: boolean;
    error: string | null;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onOpenCreate: () => void;
    onOpenCreateSubcategory: (parentCat: ProductCategoryItem) => void;
    onOpenEdit: (cat: ProductCategoryItem, parent?: ProductCategoryItem) => void;
    drawerOpen: boolean;
    onCloseDrawer: () => void;
    editingId: string | null;
    parentCategoryForSub: ProductCategoryItem | null;
    formData: CreateUpdateCategoryPayload;
    onFormFieldChange: <K extends keyof CreateUpdateCategoryPayload>(
        field: K,
        value: CreateUpdateCategoryPayload[K]
    ) => void;
    onSubmit: (e?: React.FormEvent) => void;
    isSaving: boolean;
    saveError: string | null;
    onRefetch: () => void;
}

export const ProductCategoryPresenter: React.FC<ProductCategoryPresenterProps> = ({
    filteredCategories,
    isLoading,
    isError,
    error,
    searchQuery,
    onSearchChange,
    onOpenCreate,
    onOpenCreateSubcategory,
    onOpenEdit,
    drawerOpen,
    onCloseDrawer,
    editingId,
    parentCategoryForSub,
    formData,
    onFormFieldChange,
    onSubmit,
    isSaving,
    saveError,
    onRefetch
}) => {
    const isSubcategoryMode = Boolean(formData.parent_category_id || parentCategoryForSub);

    return (
        <section className="space-y-6">
            <PageHeader>
                <PageHeader.Header
                    title="Product Categories & Subcategories"
                    description="Organize your catalog with parent product categories and child subcategory classifications."
                    actions={
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onRefetch}
                                disabled={isLoading}
                                title="Refresh categories"
                                className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition cursor-pointer disabled:opacity-50">
                                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            </button>
                            <button
                                onClick={onOpenCreate}
                                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer">
                                <Plus className="w-4 h-4" />
                                <span>Add Category</span>
                            </button>
                        </div>
                    }
                />

                <PageHeader.Bottom>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="relative w-full sm:w-80">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search category or subcategory..."
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/50 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium transition"
                            />
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            Total Categories: <strong className="text-slate-900 dark:text-white font-bold">{filteredCategories.length}</strong>
                        </div>
                    </div>
                </PageHeader.Bottom>
            </PageHeader>

            {/* Error Notification */}
            {isError && (
                <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-xs">
                    <div className="flex items-center gap-2.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error || 'Failed to load categories. Please try again.'}</span>
                    </div>
                    <button
                        onClick={onRefetch}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg font-medium hover:bg-red-500 transition cursor-pointer">
                        Retry
                    </button>
                </div>
            )}

            {/* Loading Skeletons */}
            {isLoading && (
                <Skeleton.Card
                    count={4}
                    gridCols="grid-cols-1 md:grid-cols-2"
                    hasIcon={true}
                    hasBadge={true}
                    lines={2}
                    hasFooter={true}
                />
            )}

            {/* Empty State */}
            {!isLoading && !isError && filteredCategories.length === 0 && (
                <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#0a1020] border border-slate-200/80 dark:border-slate-800/70 rounded-2xl text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                        <Layers className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {searchQuery ? 'No matching categories found' : 'No product categories configured'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                        {searchQuery
                            ? `No categories or subcategories matched "${searchQuery}".`
                            : 'Create your primary product categories to begin classifying your inventory items.'}
                    </p>
                    {!searchQuery && (
                        <button
                            onClick={onOpenCreate}
                            className="mt-2 flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer">
                            <Plus className="w-4 h-4" />
                            <span>Add Category</span>
                        </button>
                    )}
                </div>
            )}

            {/* Category Cards Grid */}
            {!isLoading && filteredCategories.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredCategories.map((cat) => {
                        const subs = cat.subcategories || [];
                        return (
                            <div
                                key={cat.id}
                                className="bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl p-5 shadow-xs space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between">
                                <div>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center font-bold shrink-0">
                                                <Tag className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                                                    {cat.category_name}
                                                </h3>
                                                <span className="text-[10px] font-mono text-slate-400 font-semibold">
                                                    ID #{cat.id}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <button
                                                onClick={() => onOpenEdit(cat)}
                                                title="Edit main category"
                                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition">
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Subcategories */}
                                    <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                                <FolderTree className="w-3 h-3" />
                                                <span>Subcategories ({subs.length})</span>
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 items-center">
                                            {subs.map((sub) => (
                                                <span
                                                    key={sub.id}
                                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50">
                                                    <span>{sub.category_name}</span>
                                                    <button
                                                        onClick={() => onOpenEdit(sub, cat)}
                                                        title="Edit subcategory"
                                                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-100 transition cursor-pointer">
                                                        <Edit3 className="w-2.5 h-2.5" />
                                                    </button>
                                                </span>
                                            ))}
                                            <button
                                                onClick={() => onOpenCreateSubcategory(cat)}
                                                className="px-2 py-1 rounded-lg text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition cursor-pointer">
                                                + Add Sub
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-end text-xs">
                                    <button
                                        onClick={() => onOpenCreateSubcategory(cat)}
                                        className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold hover:text-emerald-500 text-xs cursor-pointer">
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Add Subcategory</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Pagination Footer */}
            {!isLoading && filteredCategories.length > 0 && (
                <Pagination
                    totalItems={filteredCategories.length}
                    pageSize={6}
                    itemLabel="categories"
                    className="rounded-2xl border border-slate-200/80 dark:border-slate-800/70 bg-white dark:bg-[#0a1020]"
                />
            )}

            {/* Slider Drawer for Create / Edit */}
            <SliderDrawer isOpen={drawerOpen} onClose={onCloseDrawer}>
                <SliderDrawer.Header onClose={onCloseDrawer}>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-violet-500 text-white flex items-center justify-center font-bold">
                            <Tag className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                                {editingId
                                    ? isSubcategoryMode
                                        ? 'Edit Subcategory'
                                        : 'Edit Category'
                                    : isSubcategoryMode
                                    ? `Add Subcategory to ${parentCategoryForSub?.category_name || ''}`
                                    : 'Create New Category'}
                            </h2>
                            <p className="text-[10px] text-slate-400">
                                {editingId
                                    ? `Editing: ${formData.category_name || 'Untitled'}`
                                    : isSubcategoryMode
                                    ? `Enter the subcategory name under "${parentCategoryForSub?.category_name}"`
                                    : 'Enter the category details to create a primary catalog group'}
                            </p>
                        </div>
                    </div>
                </SliderDrawer.Header>
                <SliderDrawer.Body>
                    <form id="category-form" onSubmit={onSubmit} className="space-y-5">
                        {saveError && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{saveError}</span>
                            </div>
                        )}

                        {isSubcategoryMode && parentCategoryForSub && (
                            <div className="p-3.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-xs flex items-center gap-2.5">
                                <FolderTree className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
                                <div>
                                    <span className="text-slate-400 text-[10px] block font-semibold uppercase">
                                        Parent Category
                                    </span>
                                    <span className="font-bold text-slate-900 dark:text-white">
                                        {parentCategoryForSub.category_name} (ID #{parentCategoryForSub.id})
                                    </span>
                                </div>
                            </div>
                        )}

                        <FormField
                            label={isSubcategoryMode ? 'Subcategory Name' : 'Category Name'}
                            required>
                            <input
                                type="text"
                                required
                                className={inputClasses}
                                placeholder={isSubcategoryMode ? 'e.g. Smart Watches' : 'e.g. Mobile Phones'}
                                value={formData.category_name || ''}
                                onChange={(e) => onFormFieldChange('category_name', e.target.value)}
                            />
                        </FormField>
                    </form>
                </SliderDrawer.Body>
                <SliderDrawer.Footer>
                    <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={onCloseDrawer}
                            disabled={isSaving}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer disabled:opacity-50">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="category-form"
                            disabled={isSaving || !formData.category_name}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer">
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>
                                        {editingId
                                            ? isSubcategoryMode
                                                ? 'Update Subcategory'
                                                : 'Update Category'
                                            : isSubcategoryMode
                                            ? 'Create Subcategory'
                                            : 'Create Category'}
                                    </span>
                                </>
                            )}
                        </button>
                    </div>
                </SliderDrawer.Footer>
            </SliderDrawer>
        </section>
    );
};

export default ProductCategoryPresenter;
