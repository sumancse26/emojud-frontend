import React from 'react';
import {
    Store,
    Plus,
    MapPin,
    Phone,
    Search,
    Save,
    Edit3,
    ShoppingCart,
    Loader2,
    AlertCircle,
    RefreshCw,
    Sparkles
} from 'lucide-react';
import { SliderDrawer, FormField, inputClasses, selectClasses, Pagination, Skeleton } from '@/shared';
import PageHeader from '@/shared/components/PageHeader/PageHeader';
import type { ShopItem, CreateUpdateShopPayload } from '../../types/shop.types';

export interface ShopPresenterProps {
    shops: ShopItem[];
    filteredShops: ShopItem[];
    isLoading: boolean;
    isError: boolean;
    error: string | null;
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onOpenCreate: () => void;
    onOpenEdit: (shop: ShopItem) => void;
    drawerOpen: boolean;
    onCloseDrawer: () => void;
    editingId: string | null;
    formData: CreateUpdateShopPayload;
    onFormFieldChange: <K extends keyof CreateUpdateShopPayload>(
        field: K,
        value: CreateUpdateShopPayload[K]
    ) => void;
    onSubmit: (e?: React.FormEvent) => void;
    isSaving: boolean;
    saveError: string | null;
    onRefetch: () => void;
}

export const ShopPresenter: React.FC<ShopPresenterProps> = (props) => {
    const {
        filteredShops,
        isLoading,
        isError,
        error,
        searchQuery,
        onSearchChange,
        onOpenCreate,
        onOpenEdit,
        drawerOpen,
        onCloseDrawer,
        editingId,
        formData,
        onFormFieldChange,
        onSubmit,
        isSaving,
        saveError,
        onRefetch
    } = props;

    return (
        <section className="space-y-6">
            <PageHeader>
                <PageHeader.Header
                    title="Shop & Outlet Configurations"
                    description="Configure physical store branches, display codes, and contact details."
                    actions={
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onRefetch}
                                disabled={isLoading}
                                title="Refresh shops"
                                className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition cursor-pointer disabled:opacity-50">
                                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            </button>
                            <button
                                onClick={onOpenCreate}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-emerald-600/20 transition cursor-pointer">
                                <Plus className="w-4 h-4" />
                                <span>Add New Shop</span>
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
                                placeholder="Search by name, code, phone, address..."
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/50 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition"
                            />
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            Total Shops: <strong className="text-slate-900 dark:text-white font-bold">{filteredShops.length}</strong>
                        </div>
                    </div>
                </PageHeader.Bottom>
            </PageHeader>

            {/* Error Notification */}
            {isError && (
                <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-xs">
                    <div className="flex items-center gap-2.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error || 'Failed to load shops. Please try again.'}</span>
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
            {!isLoading && !isError && filteredShops.length === 0 && (
                <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#0a1020] border border-slate-200/80 dark:border-slate-800/70 rounded-2xl text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <Store className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {searchQuery ? 'No matching shops found' : 'No shops configured yet'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                        {searchQuery
                            ? `No results matched "${searchQuery}". Try a different keyword.`
                            : 'Create your first physical branch or outlet to begin managing inventories and sales.'}
                    </p>
                    {!searchQuery && (
                        <button
                            onClick={onOpenCreate}
                            className="mt-2 flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer">
                            <Plus className="w-4 h-4" />
                            <span>Add New Shop</span>
                        </button>
                    )}
                </div>
            )}

            {/* Outlets Grid */}
            {!isLoading && filteredShops.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredShops.map((shop) => {
                        const isActive = shop.status === 1 || shop.status === undefined;
                        return (
                            <div
                                key={shop.id}
                                className="group relative bg-white dark:bg-[#0a1020] border border-slate-200/80 dark:border-slate-800/70 hover:border-slate-300 dark:hover:border-slate-700/90 rounded-2xl p-5 shadow-2xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold shrink-0 group-hover:scale-105 transition-transform">
                                                <Store className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                                                        {shop.shop_name}
                                                    </h3>
                                                    {shop.display_code && (
                                                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
                                                            {shop.display_code}
                                                        </span>
                                                    )}
                                                    {shop.short_code && (
                                                        <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50">
                                                            {shop.short_code}
                                                        </span>
                                                    )}
                                                </div>
                                                {shop.slogan && (
                                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5 italic">
                                                        <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                                                        <span>"{shop.slogan}"</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <button
                                                onClick={() => onOpenEdit(shop)}
                                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition">
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                                    isActive
                                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                                        : 'bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20'
                                                }`}>
                                                {isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/60 space-y-2 text-xs">
                                        {(shop.address || shop.address_2) && (
                                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                <span className="truncate">
                                                    {[shop.address, shop.address_2].filter(Boolean).join(', ')}
                                                </span>
                                            </div>
                                        )}
                                        {shop.phone && (
                                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                <span className="font-mono">{shop.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-end text-xs">
                                    <button
                                        onClick={() => onOpenEdit(shop)}
                                        className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold hover:text-emerald-500 text-xs cursor-pointer group/btn">
                                        <Edit3 className="w-3.5 h-3.5" />
                                        <span>Edit Details</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Outlets Grid Pagination */}
            {!isLoading && filteredShops.length > 0 && (
                <Pagination
                    totalItems={filteredShops.length}
                    pageSize={6}
                    itemLabel="shops"
                    className="rounded-2xl border border-slate-200/80 dark:border-slate-800/70 bg-white dark:bg-[#0a1020]"
                />
            )}

            {/* Slider Drawer for Create / Edit */}
            <SliderDrawer isOpen={drawerOpen} onClose={onCloseDrawer}>
                <SliderDrawer.Header onClose={onCloseDrawer}>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                            <ShoppingCart className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                                {editingId ? 'Edit Shop Outlet' : 'Add New Shop'}
                            </h2>
                            <p className="text-[10px] text-slate-400">
                                {editingId
                                    ? `Editing: ${formData.shop_name || 'Untitled'}`
                                    : 'Enter the details to create a new shop'}
                            </p>
                        </div>
                    </div>
                </SliderDrawer.Header>
                <SliderDrawer.Body>
                    <form id="shop-form" onSubmit={onSubmit} className="space-y-5">
                        {saveError && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{saveError}</span>
                            </div>
                        )}

                        {/* Basic Info */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Shop Information
                            </h3>
                            <div className="space-y-4">
                                <FormField label="Shop Name" required>
                                    <input
                                        type="text"
                                        required
                                        className={inputClasses}
                                        placeholder="e.g. Dhaka Main Branch"
                                        value={formData.shop_name || ''}
                                        onChange={(e) => onFormFieldChange('shop_name', e.target.value)}
                                    />
                                </FormField>

                                <div className="grid grid-cols-2 gap-3">
                                    <FormField label="Display Code">
                                        <input
                                            type="text"
                                            className={inputClasses}
                                            placeholder="e.g. SHP-001"
                                            value={formData.display_code || ''}
                                            onChange={(e) =>
                                                onFormFieldChange('display_code', e.target.value.toUpperCase())
                                            }
                                        />
                                    </FormField>

                                    <FormField label="Short Code">
                                        <input
                                            type="text"
                                            className={inputClasses}
                                            placeholder="e.g. DHK-01"
                                            value={formData.short_code || ''}
                                            onChange={(e) =>
                                                onFormFieldChange('short_code', e.target.value.toUpperCase())
                                            }
                                        />
                                    </FormField>
                                </div>

                                <FormField label="Slogan / Tagline">
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="e.g. Quality you can trust"
                                        value={formData.slogan || ''}
                                        onChange={(e) => onFormFieldChange('slogan', e.target.value)}
                                    />
                                </FormField>

                                <FormField label="Status">
                                    <select
                                        className={selectClasses}
                                        value={formData.status !== undefined ? String(formData.status) : '1'}
                                        onChange={(e) =>
                                            onFormFieldChange('status', Number(e.target.value))
                                        }>
                                        <option value="1">Active</option>
                                        <option value="0">Inactive</option>
                                    </select>
                                </FormField>
                            </div>
                        </div>

                        {/* Location & Contact */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                Location & Contact
                            </h3>
                            <div className="space-y-4">
                                <FormField label="Phone Number">
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="e.g. +8801700000000"
                                        value={formData.phone || ''}
                                        onChange={(e) => onFormFieldChange('phone', e.target.value)}
                                    />
                                </FormField>

                                <FormField label="Address (Line 1)">
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="e.g. House 12, Road 5, Dhanmondi"
                                        value={formData.address || ''}
                                        onChange={(e) => onFormFieldChange('address', e.target.value)}
                                    />
                                </FormField>

                                <FormField label="Address (Line 2 / City / Postal)">
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="e.g. Dhaka - 1205"
                                        value={formData.address_2 || ''}
                                        onChange={(e) => onFormFieldChange('address_2', e.target.value)}
                                    />
                                </FormField>
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
                            form="shop-form"
                            disabled={isSaving || !formData.shop_name}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer">
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>{editingId ? 'Update Shop' : 'Create Shop'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </SliderDrawer.Footer>
            </SliderDrawer>
        </section>
    );
};

export default ShopPresenter;
