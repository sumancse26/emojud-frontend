import React from 'react';
import {
    Warehouse as WarehouseIcon,
    Plus,
    MapPin,
    Phone,
    Store,
    Save,
    Edit3,
    Search,
    Loader2,
    AlertCircle,
    RefreshCw
} from 'lucide-react';
import { SliderDrawer, FormField, inputClasses, selectClasses, PageHeader, Pagination, Skeleton } from '@/shared';
import type { WarehouseItem, CreateUpdateWarehousePayload } from '../../types/warehouse.types';
import type { ShopItem } from '../../types/shop.types';

export interface WarehousePresenterProps {
    warehouses: WarehouseItem[];
    filteredWarehouses: WarehouseItem[];
    shops: ShopItem[];
    isLoading: boolean;
    isError: boolean;
    error: string | null;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onOpenCreate: () => void;
    onOpenEdit: (wh: WarehouseItem) => void;
    drawerOpen: boolean;
    onCloseDrawer: () => void;
    editingId: string | null;
    formData: CreateUpdateWarehousePayload;
    onFormFieldChange: <K extends keyof CreateUpdateWarehousePayload>(
        field: K,
        value: CreateUpdateWarehousePayload[K]
    ) => void;
    onSubmit: (e?: React.FormEvent) => void;
    isSaving: boolean;
    saveError: string | null;
    onRefetch: () => void;
}

export const WarehousePresenter: React.FC<WarehousePresenterProps> = ({
    filteredWarehouses,
    shops,
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
}) => {
    return (
        <section className="space-y-6">
            <PageHeader>
                <PageHeader.Header
                    title="Warehouse & Storage Hubs"
                    description="Configure central warehouses, regional storage locations, and linked branch outlets."
                    actions={
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onRefetch}
                                disabled={isLoading}
                                title="Refresh warehouses"
                                className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition cursor-pointer disabled:opacity-50">
                                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            </button>
                            <button
                                onClick={onOpenCreate}
                                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer">
                                <Plus className="w-4 h-4" />
                                <span>Add Warehouse</span>
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
                                placeholder="Search warehouse by name, address, or shop..."
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/50 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium transition"
                            />
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            Total Warehouses: <strong className="text-slate-900 dark:text-white font-bold">{filteredWarehouses.length}</strong>
                        </div>
                    </div>
                </PageHeader.Bottom>
            </PageHeader>

            {/* Error Notification */}
            {isError && (
                <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-xs">
                    <div className="flex items-center gap-2.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error || 'Failed to load warehouses. Please try again.'}</span>
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
                    count={3}
                    gridCols="grid-cols-1 md:grid-cols-3"
                    hasIcon={true}
                    hasBadge={true}
                    lines={2}
                    hasFooter={true}
                />
            )}

            {/* Empty State */}
            {!isLoading && !isError && filteredWarehouses.length === 0 && (
                <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#0a1020] border border-slate-200/80 dark:border-slate-800/70 rounded-2xl text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <WarehouseIcon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {searchQuery ? 'No matching warehouses found' : 'No warehouses configured yet'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                        {searchQuery
                            ? `No results matched "${searchQuery}". Try a different search term.`
                            : 'Set up your central or regional warehouses to track inventory and stock transfers.'}
                    </p>
                    {!searchQuery && (
                        <button
                            onClick={onOpenCreate}
                            className="mt-2 flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer">
                            <Plus className="w-4 h-4" />
                            <span>Add Warehouse</span>
                        </button>
                    )}
                </div>
            )}

            {/* Storage Summary Cards */}
            {!isLoading && filteredWarehouses.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {filteredWarehouses.map((wh) => (
                        <div
                            key={wh.id}
                            className="bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl p-5 shadow-xs space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between">
                            <div>
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
                                            <WarehouseIcon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                                                {wh.warehouse_name}
                                            </h3>
                                            {wh.shop && (
                                                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                                                    <Store className="w-3 h-3" />
                                                    <span>{wh.shop.shop_name}</span>
                                                    {wh.shop.short_code && (
                                                        <span className="text-[10px] font-mono font-bold px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                                                            {wh.shop.short_code}
                                                        </span>
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                            onClick={() => onOpenEdit(wh)}
                                            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition">
                                            <Edit3 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/60 space-y-2 text-xs">
                                    {wh.address && (
                                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span className="truncate">{wh.address}</span>
                                        </div>
                                    )}
                                    {wh.shop?.phone && (
                                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span className="font-mono">{wh.shop.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-end text-xs">
                                <button
                                    onClick={() => onOpenEdit(wh)}
                                    className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer">
                                    <Edit3 className="w-3.5 h-3.5" />
                                    <span>Edit Details</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Footer */}
            {!isLoading && filteredWarehouses.length > 0 && (
                <Pagination
                    totalItems={filteredWarehouses.length}
                    pageSize={6}
                    itemLabel="warehouses"
                    className="rounded-2xl border border-slate-200/80 dark:border-slate-800/70 bg-white dark:bg-[#0a1020]"
                />
            )}

            {/* Slider Drawer for Create / Edit */}
            <SliderDrawer isOpen={drawerOpen} onClose={onCloseDrawer}>
                <SliderDrawer.Header onClose={onCloseDrawer}>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold">
                            <WarehouseIcon className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                                {editingId ? 'Edit Warehouse' : 'Add New Warehouse'}
                            </h2>
                            <p className="text-[10px] text-slate-400">
                                {editingId
                                    ? `Editing: ${formData.warehouse_name || 'Untitled'}`
                                    : 'Configure warehouse details and link with a shop outlet'}
                            </p>
                        </div>
                    </div>
                </SliderDrawer.Header>
                <SliderDrawer.Body>
                    <form id="warehouse-form" onSubmit={onSubmit} className="space-y-5">
                        {saveError && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{saveError}</span>
                            </div>
                        )}

                        <FormField label="Warehouse Name" required>
                            <input
                                type="text"
                                required
                                className={inputClasses}
                                placeholder="e.g. Main Warehouse"
                                value={formData.warehouse_name || ''}
                                onChange={(e) => onFormFieldChange('warehouse_name', e.target.value)}
                            />
                        </FormField>

                        <FormField label="Linked Shop Outlet" required>
                            <select
                                required
                                className={selectClasses}
                                value={formData.shop_id !== undefined && formData.shop_id !== null ? String(formData.shop_id) : ''}
                                onChange={(e) => onFormFieldChange('shop_id', Number(e.target.value) || e.target.value)}>
                                <option value="" disabled>Select a shop outlet</option>
                                {shops.map((shop) => (
                                    <option key={shop.id} value={shop.id}>
                                        {shop.shop_name} ({shop.short_code || shop.display_code || `#${shop.id}`})
                                    </option>
                                ))}
                            </select>
                        </FormField>

                        <FormField label="Address / Location">
                            <input
                                type="text"
                                className={inputClasses}
                                placeholder="e.g. House 12, Road 5, Dhaka"
                                value={formData.address || ''}
                                onChange={(e) => onFormFieldChange('address', e.target.value)}
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
                            form="warehouse-form"
                            disabled={isSaving || !formData.warehouse_name || !formData.shop_id}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer">
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>{editingId ? 'Update Warehouse' : 'Create Warehouse'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </SliderDrawer.Footer>
            </SliderDrawer>
        </section>
    );
};

export default WarehousePresenter;
