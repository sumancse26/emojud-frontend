import React from 'react';
import {
    Package,
    Plus,
    Edit3,
    Save,
    RefreshCw,
    AlertCircle,
    Loader2,
    Search,
    Barcode,
    Layers,
    Boxes
} from 'lucide-react';
import {
    SliderDrawer,
    FormField,
    inputClasses,
    PageHeader,
    Pagination,
    Skeleton,
    Dropdown,
    type DropdownOption
} from '@/shared';
import type { ProductItem, CreateUpdateProductPayload } from '../../types/product.types';

export interface ProductsPresenterProps {
    products: ProductItem[];
    filteredProducts: ProductItem[];
    isLoading: boolean;
    isError: boolean;
    error: string | null;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    activeTab: 'all' | 'shopWise';
    onTabChange: (tab: 'all' | 'shopWise') => void;
    isDrawerOpen: boolean;
    onCloseDrawer: () => void;
    editingProduct: ProductItem | null;
    formState: CreateUpdateProductPayload;
    onFormFieldChange: <K extends keyof CreateUpdateProductPayload>(
        field: K,
        value: CreateUpdateProductPayload[K]
    ) => void;
    onOpenCreate: () => void;
    onOpenEdit: (item: ProductItem) => void;
    onSave: (e?: React.FormEvent) => void;
    isSaving: boolean;
    saveError: string | null;
    onRefetch: () => void;
    categoryOptions: DropdownOption[];
    subCategoryOptions: DropdownOption[];
    brandOptions: DropdownOption[];
    unitOptions: DropdownOption[];
    isLoadingCategories?: boolean;
}

export const ProductsPresenter: React.FC<ProductsPresenterProps> = ({
    products: _products,
    filteredProducts,
    isLoading,
    isError,
    error,
    searchQuery,
    onSearchChange,
    activeTab,
    onTabChange,
    isDrawerOpen,
    onCloseDrawer,
    editingProduct,
    formState,
    onFormFieldChange,
    onOpenCreate,
    onOpenEdit,
    onSave,
    isSaving,
    saveError,
    onRefetch,
    categoryOptions,
    subCategoryOptions,
    brandOptions,
    unitOptions,
    isLoadingCategories
}) => {
    return (
        <section className="space-y-6">
            <PageHeader>
                <PageHeader.Header
                    title="Product Catalog & Inventory"
                    description="Manage barcode SKUs, wholesale purchase cost, retail prices, and safety stock levels."
                    actions={
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onRefetch}
                                disabled={isLoading}
                                title="Refresh products"
                                className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition cursor-pointer disabled:opacity-50">
                                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            </button>
                            <button
                                onClick={onOpenCreate}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-emerald-600/20 transition cursor-pointer">
                                <Plus className="w-4 h-4" />
                                <span>Add New Product</span>
                            </button>
                        </div>
                    }
                />

                <PageHeader.Bottom>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="relative w-full sm:w-80">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, SKU, code, or category..."
                                    value={searchQuery}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/50 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition"
                                />
                            </div>

                            {/* View Tabs */}
                            <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl text-xs">
                                <button
                                    onClick={() => onTabChange('all')}
                                    className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                                        activeTab === 'all'
                                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                                    }`}>
                                    <Boxes className="w-3.5 h-3.5" />
                                    <span>Master Catalog</span>
                                </button>
                                <button
                                    onClick={() => onTabChange('shopWise')}
                                    className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                                        activeTab === 'shopWise'
                                            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                                    }`}>
                                    <Layers className="w-3.5 h-3.5" />
                                    <span>Branch Stock</span>
                                </button>
                            </div>
                        </div>

                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            Total Records:{' '}
                            <strong className="text-slate-900 dark:text-white font-bold">
                                {filteredProducts.length}
                            </strong>
                        </div>
                    </div>
                </PageHeader.Bottom>
            </PageHeader>

            {/* Error Notification */}
            {isError && (
                <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-xs">
                    <div className="flex items-center gap-2.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error || 'Failed to load products. Please try again.'}</span>
                    </div>
                    <button
                        onClick={onRefetch}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg font-medium hover:bg-red-500 transition cursor-pointer">
                        Retry
                    </button>
                </div>
            )}

            {/* Loading Skeleton */}
            {isLoading && <Skeleton.Table rows={6} columns={7} />}

            {/* Empty State */}
            {!isLoading && !isError && filteredProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#0a1020] border border-slate-200/80 dark:border-slate-800/70 rounded-2xl text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <Package className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {searchQuery ? 'No matching products found' : 'No products found'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                        {searchQuery
                            ? `No product items matched "${searchQuery}". Try modifying your search term.`
                            : 'Register products to start tracking inventory, retail prices, and sales.'}
                    </p>
                    {!searchQuery && (
                        <button
                            onClick={onOpenCreate}
                            className="mt-2 flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer">
                            <Plus className="w-4 h-4" />
                            <span>Add New Product</span>
                        </button>
                    )}
                </div>
            )}

            {/* Products Data Table */}
            {!isLoading && !isError && filteredProducts.length > 0 && (
                <div className="bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/70 rounded-2xl shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50/80 dark:bg-slate-900/60 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 text-[10px]">
                                <tr>
                                    <th className="px-5 py-3">Product Name & Code</th>
                                    <th className="px-4 py-3">Category & Brand</th>
                                    <th className="px-4 py-3 text-right">Purchase (Cost)</th>
                                    <th className="px-4 py-3 text-right">Retail Rate</th>
                                    <th className="px-4 py-3 text-right">Sales Rate</th>
                                    <th className="px-4 py-3 text-center">Available Stock</th>
                                    <th className="px-4 py-3 text-center">Stock Health</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {filteredProducts.map((p) => {
                                    const stockNum =
                                        p.avail_stock !== undefined && p.avail_stock !== null && p.avail_stock !== '—'
                                            ? Number(p.avail_stock)
                                            : null;
                                    const minStock = Number(p.min_stock_qty ?? 0);

                                    let healthBadge = (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                                            Normal
                                        </span>
                                    );

                                    if (stockNum !== null) {
                                        if (stockNum === 0) {
                                            healthBadge = (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                                    Out of Stock
                                                </span>
                                            );
                                        } else if (minStock > 0 && stockNum <= minStock) {
                                            healthBadge = (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                                    Low Stock
                                                </span>
                                            );
                                        } else {
                                            healthBadge = (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                                    Healthy Stock
                                                </span>
                                            );
                                        }
                                    }

                                    return (
                                        <tr
                                            key={p.id}
                                            className="hover:bg-slate-50/70 dark:hover:bg-slate-900/30 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
                                                        <Package className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white">
                                                            {p.product_name}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="font-mono text-[10px] text-slate-400">
                                                                {p.product_code}
                                                            </span>
                                                            {p.barcode && (
                                                                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                                                                    <Barcode className="w-3 h-3" />
                                                                    {p.barcode}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3.5">
                                                <p className="text-slate-700 dark:text-slate-200 font-medium">
                                                    {p.category?.category_name ?? '—'}
                                                </p>
                                                {p.brand?.lookup_value && (
                                                    <span className="text-[10px] text-slate-400">
                                                        Brand: {p.brand.lookup_value}
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-4 py-3.5 font-mono text-right text-slate-600 dark:text-slate-300">
                                                ৳ {Number(p.purchase_rate || 0).toLocaleString()}
                                            </td>

                                            <td className="px-4 py-3.5 font-mono font-bold text-right text-emerald-600 dark:text-emerald-400">
                                                ৳ {Number(p.retail_rate || 0).toLocaleString()}
                                            </td>

                                            <td className="px-4 py-3.5 font-mono text-right text-slate-700 dark:text-slate-200">
                                                ৳ {Number(p.sales_rate || 0).toLocaleString()}
                                            </td>

                                            <td className="px-4 py-3.5 text-center font-mono">
                                                <span
                                                    className={`font-bold ${
                                                        stockNum === 0
                                                            ? 'text-rose-500'
                                                            : 'text-slate-800 dark:text-slate-200'
                                                    }`}>
                                                    {p.avail_stock ?? '—'}
                                                </span>
                                                {p.units?.lookup_value && (
                                                    <span className="text-[10px] text-slate-400 ml-1">
                                                        {p.units.lookup_value}
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-4 py-3.5 text-center">{healthBadge}</td>

                                            <td className="px-4 py-3.5 text-right">
                                                <button
                                                    onClick={() => onOpenEdit(p)}
                                                    className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition"
                                                    title="Edit Product">
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <Pagination
                        totalItems={filteredProducts.length}
                        pageSize={10}
                        itemLabel="products"
                    />
                </div>
            )}

            {/* Global Modal (SliderDrawer format matching Shop/Employee) */}
            <SliderDrawer isOpen={isDrawerOpen} onClose={onCloseDrawer} width="max-w-xl">
                <SliderDrawer.Header onClose={onCloseDrawer}>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                            <Package className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                                {editingProduct ? 'Edit Product Item' : 'Register New Product Item'}
                            </h2>
                            <p className="text-[10px] text-slate-400">
                                {editingProduct
                                    ? `Editing: ${editingProduct.product_name} (${editingProduct.product_code})`
                                    : 'Configure product SKU code, pricing tiers, and specifications'}
                            </p>
                        </div>
                    </div>
                </SliderDrawer.Header>

                <SliderDrawer.Body>
                    <form id="product-form" onSubmit={onSave} className="space-y-4 text-xs">
                        {saveError && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{saveError}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <FormField label="Product Name" required>
                                <input
                                    type="text"
                                    placeholder="e.g. Vivo Y55, Cotton Polo Shirt"
                                    value={formState.product_name}
                                    onChange={(e) => onFormFieldChange('product_name', e.target.value)}
                                    className={inputClasses}
                                    required
                                />
                            </FormField>

                            <FormField label="Product Code / SKU" required>
                                <input
                                    type="text"
                                    placeholder="e.g. PRD-00009"
                                    value={formState.product_code}
                                    onChange={(e) => onFormFieldChange('product_code', e.target.value)}
                                    className={`${inputClasses} font-mono`}
                                    required
                                />
                            </FormField>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <FormField label="Category" required>
                                <Dropdown
                                    options={categoryOptions}
                                    value={formState.category_id !== undefined ? String(formState.category_id) : ''}
                                    onChange={(val) => onFormFieldChange('category_id', val ? Number(val) : '')}
                                    placeholder="Select Category"
                                    searchable={true}
                                    isLoading={isLoadingCategories}
                                />
                            </FormField>

                            <FormField label="Sub Category">
                                <Dropdown
                                    options={subCategoryOptions}
                                    value={formState.sub_category_id !== undefined ? String(formState.sub_category_id) : ''}
                                    onChange={(val) => onFormFieldChange('sub_category_id', val ? Number(val) : '')}
                                    placeholder="Select Subcategory"
                                    searchable={true}
                                />
                            </FormField>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <FormField label="Brand">
                                <Dropdown
                                    options={brandOptions}
                                    value={formState.brand_id !== undefined ? String(formState.brand_id) : ''}
                                    onChange={(val) => onFormFieldChange('brand_id', val ? Number(val) : '')}
                                    placeholder="Select Brand"
                                    searchable={true}
                                />
                            </FormField>

                            <FormField label="Unit of Measure">
                                <Dropdown
                                    options={unitOptions}
                                    value={formState.unit_id !== undefined ? String(formState.unit_id) : ''}
                                    onChange={(val) => onFormFieldChange('unit_id', val ? Number(val) : '')}
                                    placeholder="Select Unit (PCS, BOX)"
                                    searchable={true}
                                />
                            </FormField>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <FormField label="Purchase Rate (৳)" required>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={formState.purchase_rate}
                                    onChange={(e) => onFormFieldChange('purchase_rate', e.target.value)}
                                    className={`${inputClasses} font-mono`}
                                    required
                                />
                            </FormField>

                            <FormField label="Retail Rate (৳)" required>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={formState.retail_rate}
                                    onChange={(e) => onFormFieldChange('retail_rate', e.target.value)}
                                    className={`${inputClasses} font-mono`}
                                    required
                                />
                            </FormField>

                            <FormField label="Sales Rate (৳)" required>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={formState.sales_rate}
                                    onChange={(e) => onFormFieldChange('sales_rate', e.target.value)}
                                    className={`${inputClasses} font-mono`}
                                    required
                                />
                            </FormField>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <FormField label="Barcode">
                                <input
                                    type="text"
                                    placeholder="e.g. 8901234567890"
                                    value={formState.barcode ?? ''}
                                    onChange={(e) => onFormFieldChange('barcode', e.target.value)}
                                    className={`${inputClasses} font-mono`}
                                />
                            </FormField>

                            <FormField label="Min Safety Stock Qty">
                                <input
                                    type="number"
                                    placeholder="e.g. 10"
                                    value={formState.min_stock_qty ?? ''}
                                    onChange={(e) => onFormFieldChange('min_stock_qty', e.target.value)}
                                    className={`${inputClasses} font-mono`}
                                />
                            </FormField>
                        </div>

                        <FormField label="Specifications & Notes">
                            <textarea
                                rows={2}
                                placeholder="Product description, physical dimensions, material composition..."
                                value={formState.specifications ?? ''}
                                onChange={(e) => onFormFieldChange('specifications', e.target.value)}
                                className={inputClasses}
                            />
                        </FormField>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                            <label className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 rounded-xl cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={Number(formState.is_batch_wise) === 1}
                                    onChange={(e) => onFormFieldChange('is_batch_wise', e.target.checked ? 1 : 0)}
                                    className="w-4 h-4 text-emerald-600 rounded accent-emerald-600 cursor-pointer"
                                />
                                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                    Batch-wise
                                </span>
                            </label>

                            <label className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 rounded-xl cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={Number(formState.is_expire_wise) === 1}
                                    onChange={(e) => onFormFieldChange('is_expire_wise', e.target.checked ? 1 : 0)}
                                    className="w-4 h-4 text-emerald-600 rounded accent-emerald-600 cursor-pointer"
                                />
                                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                    Expiry Tracking
                                </span>
                            </label>

                            <div>
                                <Dropdown
                                    options={[
                                        { value: '1', label: 'Active' },
                                        { value: '0', label: 'Inactive' }
                                    ]}
                                    value={String(formState.status)}
                                    onChange={(val) => onFormFieldChange('status', Number(val))}
                                    placeholder="Select Status"
                                    searchable={true}
                                />
                            </div>
                        </div>
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
                            form="product-form"
                            disabled={
                                isSaving ||
                                !formState.product_name?.trim() ||
                                !formState.product_code?.trim() ||
                                !formState.purchase_rate ||
                                !formState.retail_rate ||
                                !formState.sales_rate
                            }
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer">
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>{editingProduct ? 'Update Product' : 'Save Product'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </SliderDrawer.Footer>
            </SliderDrawer>
        </section>
    );
};

export default ProductsPresenter;
