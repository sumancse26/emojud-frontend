import React from 'react';
import { Plus, Tag, Edit3, Trash2, Save, X as XIcon, Search } from 'lucide-react';
import { SliderDrawer, FormField, inputClasses, selectClasses, PageHeader } from '@/shared';
import type { CategoryItem, CategoryFormData } from '../ProductCategoryPage';

export interface ProductCategoryPresenterProps {
    categories: CategoryItem[];
    filteredCategories: CategoryItem[];
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onOpenCreate: () => void;
    onOpenEdit: (cat: CategoryItem) => void;
    onDelete: (id: string) => void;
    drawerOpen: boolean;
    onCloseDrawer: () => void;
    editingId: string | null;
    formData: CategoryFormData;
    onFormFieldChange: <K extends keyof CategoryFormData>(field: K, value: CategoryFormData[K]) => void;
    onAddSubcategory: () => void;
    onRemoveSubcategory: (idx: number) => void;
    onSubmit: (e?: React.FormEvent) => void;
    colorOptions: Array<{ label: string; value: string }>;
}

export const ProductCategoryPresenter: React.FC<ProductCategoryPresenterProps> = ({
    filteredCategories,
    searchQuery,
    onSearchChange,
    onOpenCreate,
    onOpenEdit,
    onDelete,
    drawerOpen,
    onCloseDrawer,
    editingId,
    formData,
    onFormFieldChange,
    onAddSubcategory,
    onRemoveSubcategory,
    onSubmit,
    colorOptions
}) => {
    return (
        <section className="space-y-6">
            <PageHeader>
                <PageHeader.Header>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                Product Categories & Subcategories
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Hierarchical product classification, default VAT/Tax slabs, and inventory mapping.
                            </p>
                        </div>

                        <button
                            onClick={onOpenCreate}
                            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer self-start sm:self-auto">
                            <Plus className="w-4 h-4" />
                            <span>Create New Category</span>
                        </button>
                    </div>
                </PageHeader.Header>

                <PageHeader.Bottom>
                    <div className="relative max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search category name or code..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#080d1a] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                        />
                    </div>
                </PageHeader.Bottom>
            </PageHeader>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredCategories.map((cat) => (
                    <div
                        key={cat.id}
                        className="bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl p-5 shadow-xs space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/10`}>
                                    <Tag className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                                            {cat.name}
                                        </h3>
                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold">
                                            {cat.code}
                                        </span>
                                    </div>
                                    <span className="text-[11px] text-slate-400 font-medium">
                                        VAT Slab: <strong>{cat.vatRate}%</strong> • Total Items:{' '}
                                        <strong className="text-emerald-600 dark:text-emerald-400">
                                            {cat.productCount} SKUs
                                        </strong>
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => onOpenEdit(cat)}
                                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition">
                                    <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => onDelete(cat.id)}
                                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer transition">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* Subcategories pill badges */}
                        <div className="space-y-1.5 pt-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Subcategory Taxonomies ({cat.subcategories.length})
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {cat.subcategories.map((sub, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                        <span>{sub}</span>
                                    </span>
                                ))}
                                <button
                                    onClick={() => onOpenEdit(cat)}
                                    className="px-2 py-1 rounded-lg text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition cursor-pointer">
                                    + Add Sub
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Slider Drawer for Create / Edit */}
            <SliderDrawer
                isOpen={drawerOpen}
                onClose={onCloseDrawer}
                title={editingId ? 'Edit Category' : 'Create New Category'}
                subtitle={
                    editingId
                        ? `Editing: ${formData.name || 'Untitled'}`
                        : 'Add a new product category to your catalog'
                }
                icon={<Tag className="w-4 h-4" />}
                footer={
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onCloseDrawer}
                            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => onSubmit()}
                            disabled={!formData.name || !formData.code}
                            className="flex-[2] py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition cursor-pointer">
                            <Save className="w-3.5 h-3.5" />
                            <span>{editingId ? 'Update Category' : 'Create Category'}</span>
                        </button>
                    </div>
                }>
                <div className="space-y-5">
                    {/* Basic Information */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Basic Information
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="Category Code" required>
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="e.g. CAT-APP"
                                        value={formData.code}
                                        onChange={(e) =>
                                            onFormFieldChange('code', e.target.value.toUpperCase())
                                        }
                                    />
                                </FormField>
                                <FormField label="VAT Rate (%)" required>
                                    <input
                                        type="number"
                                        step="0.5"
                                        className={inputClasses}
                                        placeholder="e.g. 7.5"
                                        value={formData.vatRate}
                                        onChange={(e) => onFormFieldChange('vatRate', e.target.value)}
                                    />
                                </FormField>
                            </div>

                            <FormField label="Category Name" required>
                                <input
                                    type="text"
                                    className={inputClasses}
                                    placeholder="e.g. Apparel & Menswear"
                                    value={formData.name}
                                    onChange={(e) => onFormFieldChange('name', e.target.value)}
                                />
                            </FormField>

                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="Theme Color">
                                    <select
                                        className={selectClasses}
                                        value={formData.color}
                                        onChange={(e) => onFormFieldChange('color', e.target.value)}>
                                        {colorOptions.map((c) => (
                                            <option key={c.value} value={c.value}>
                                                {c.label}
                                            </option>
                                        ))}
                                    </select>
                                </FormField>
                                <FormField label="Status">
                                    <select
                                        className={selectClasses}
                                        value={formData.status}
                                        onChange={(e) =>
                                            onFormFieldChange('status', e.target.value as 'Active' | 'Inactive')
                                        }>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </FormField>
                            </div>

                            {/* Color Preview */}
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60">
                                <div
                                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${formData.color} shadow-md`}
                                />
                                <div className="text-xs">
                                    <p className="font-bold text-slate-700 dark:text-slate-200">Theme Preview</p>
                                    <p className="text-slate-400 text-[10px]">
                                        This color will be used for the category card icon
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subcategories */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                            Subcategories ({formData.subcategories.length})
                        </h3>

                        {/* Add subcategory input */}
                        <div className="flex items-center gap-2 mb-3">
                            <input
                                type="text"
                                className={inputClasses}
                                placeholder="Type subcategory name..."
                                value={formData.newSubcategory}
                                onChange={(e) => onFormFieldChange('newSubcategory', e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && onAddSubcategory()}
                            />
                            <button
                                type="button"
                                onClick={onAddSubcategory}
                                disabled={!formData.newSubcategory.trim()}
                                className="shrink-0 px-3 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition cursor-pointer">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Subcategory chips */}
                        {formData.subcategories.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {formData.subcategories.map((sub, idx) => (
                                    <span
                                        key={idx}
                                        className="group px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition">
                                        {sub}
                                        <button
                                            type="button"
                                            onClick={() => onRemoveSubcategory(idx)}
                                            className="text-slate-400 hover:text-rose-500 transition cursor-pointer">
                                            <XIcon className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-slate-400 text-xs border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                                No subcategories added yet. Type above and press Enter.
                            </div>
                        )}
                    </div>
                </div>
            </SliderDrawer>
        </section>
    );
};

export default ProductCategoryPresenter;
