import React from 'react';
import {
    Truck,
    Plus,
    Edit3,
    Save,
    RefreshCw,
    AlertCircle,
    Loader2,
    Search,
    Phone,
    Mail,
    MapPin
} from 'lucide-react';
import {
    SliderDrawer,
    FormField,
    inputClasses,
    PageHeader,
    Pagination,
    Skeleton
} from '@/shared';
import type { SupplierItem, CreateUpdateSupplierPayload } from '../../types/supplier.types';

export interface SuppliersPresenterProps {
    suppliers: SupplierItem[];
    filteredSuppliers: SupplierItem[];
    isLoading: boolean;
    isError: boolean;
    error: string | null;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    isDrawerOpen: boolean;
    onCloseDrawer: () => void;
    editingSupplier: SupplierItem | null;
    formState: CreateUpdateSupplierPayload;
    onFormFieldChange: <K extends keyof CreateUpdateSupplierPayload>(
        field: K,
        value: CreateUpdateSupplierPayload[K]
    ) => void;
    onOpenCreate: () => void;
    onOpenEdit: (supplier: SupplierItem) => void;
    onSave: (e?: React.FormEvent) => void;
    isSaving: boolean;
    saveError: string | null;
    onRefetch: () => void;
}

export const SuppliersPresenter: React.FC<SuppliersPresenterProps> = ({
    suppliers: _suppliers,
    filteredSuppliers,
    isLoading,
    isError,
    error,
    searchQuery,
    onSearchChange,
    isDrawerOpen,
    onCloseDrawer,
    editingSupplier,
    formState,
    onFormFieldChange,
    onOpenCreate,
    onOpenEdit,
    onSave,
    isSaving,
    saveError,
    onRefetch
}) => {
    return (
        <section className="space-y-6">
            <PageHeader>
                <PageHeader.Header
                    title="Suppliers & Vendor Network"
                    description="Manage wholesale distributor accounts, contact points, and outstanding payable dues."
                    actions={
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onRefetch}
                                disabled={isLoading}
                                title="Refresh suppliers"
                                className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition cursor-pointer disabled:opacity-50">
                                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            </button>
                            <button
                                onClick={onOpenCreate}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-emerald-600/20 transition cursor-pointer">
                                <Plus className="w-4 h-4" />
                                <span>Add New Supplier</span>
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
                                placeholder="Search by name, code, phone, or address..."
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/50 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition"
                            />
                        </div>

                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            Total Suppliers:{' '}
                            <strong className="text-slate-900 dark:text-white font-bold">
                                {filteredSuppliers.length}
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
                        <span>{error || 'Failed to load suppliers. Please try again.'}</span>
                    </div>
                    <button
                        onClick={onRefetch}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg font-medium hover:bg-red-500 transition cursor-pointer">
                        Retry
                    </button>
                </div>
            )}

            {/* Loading Skeleton */}
            {isLoading && <Skeleton.Table rows={6} columns={6} />}

            {/* Empty State */}
            {!isLoading && !isError && filteredSuppliers.length === 0 && (
                <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#0a1020] border border-slate-200/80 dark:border-slate-800/70 rounded-2xl text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <Truck className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {searchQuery ? 'No matching suppliers found' : 'No suppliers registered yet'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                        {searchQuery
                            ? `No records matched "${searchQuery}". Try a different name or phone number.`
                            : 'Register wholesale vendors and suppliers to record purchases and track payable ledgers.'}
                    </p>
                    {!searchQuery && (
                        <button
                            onClick={onOpenCreate}
                            className="mt-2 flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer">
                            <Plus className="w-4 h-4" />
                            <span>Add New Supplier</span>
                        </button>
                    )}
                </div>
            )}

            {/* Supplier Data Table */}
            {!isLoading && !isError && filteredSuppliers.length > 0 && (
                <div className="bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/70 rounded-2xl shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50/80 dark:bg-slate-900/60 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 text-[10px]">
                                <tr>
                                    <th className="px-5 py-3">Supplier Name & Code</th>
                                    <th className="px-4 py-3">Phone</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Address</th>
                                    <th className="px-4 py-3 text-right">Previous Due (৳)</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {filteredSuppliers.map((supplier) => {
                                    const dueAmount = Number(supplier.previous_due || 0);

                                    return (
                                        <tr
                                            key={supplier.id}
                                            className="hover:bg-slate-50/70 dark:hover:bg-slate-900/30 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shrink-0">
                                                        <Truck className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white">
                                                            {supplier.supplier_name}
                                                        </p>
                                                        {supplier.supplier_code && (
                                                            <span className="font-mono text-[10px] text-slate-400">
                                                                {supplier.supplier_code}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3.5">
                                                {supplier.phone ? (
                                                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-mono">
                                                        <Phone className="w-3 h-3 text-slate-400" />
                                                        <span>{supplier.phone}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400">—</span>
                                                )}
                                            </td>

                                            <td className="px-4 py-3.5">
                                                {supplier.email ? (
                                                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                                                        <Mail className="w-3 h-3 text-slate-400" />
                                                        <span>{supplier.email}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400">—</span>
                                                )}
                                            </td>

                                            <td className="px-4 py-3.5">
                                                {supplier.address ? (
                                                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                                                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                                        <span className="truncate">{supplier.address}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400">—</span>
                                                )}
                                            </td>

                                            <td className="px-4 py-3.5 text-right font-mono">
                                                {dueAmount > 0 ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                                        ৳ {dueAmount.toLocaleString()}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                                        ৳ 0
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-4 py-3.5 text-right">
                                                <button
                                                    onClick={() => onOpenEdit(supplier)}
                                                    className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition"
                                                    title="Edit Supplier">
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
                        totalItems={filteredSuppliers.length}
                        pageSize={10}
                        itemLabel="suppliers"
                    />
                </div>
            )}

            {/* Global Modal (SliderDrawer format matching current standard) */}
            <SliderDrawer isOpen={isDrawerOpen} onClose={onCloseDrawer} width="max-w-lg">
                <SliderDrawer.Header onClose={onCloseDrawer}>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                            <Truck className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                                {editingSupplier ? 'Edit Supplier Details' : 'Register New Supplier'}
                            </h2>
                            <p className="text-[10px] text-slate-400">
                                {editingSupplier
                                    ? `Editing: ${editingSupplier.supplier_name}`
                                    : 'Add wholesale distributor or vendor contact point'}
                            </p>
                        </div>
                    </div>
                </SliderDrawer.Header>

                <SliderDrawer.Body>
                    <form id="supplier-form" onSubmit={onSave} className="space-y-4 text-xs">
                        {saveError && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{saveError}</span>
                            </div>
                        )}

                        <FormField label="Supplier / Company Name" required>
                            <input
                                type="text"
                                placeholder="e.g. ABC Traders, Vivo Dealer"
                                value={formState.supplier_name}
                                onChange={(e) => onFormFieldChange('supplier_name', e.target.value)}
                                className={inputClasses}
                                required
                            />
                        </FormField>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <FormField label="Phone Number" required>
                                <input
                                    type="text"
                                    placeholder="e.g. 01800000000"
                                    value={formState.phone}
                                    onChange={(e) => onFormFieldChange('phone', e.target.value)}
                                    className={`${inputClasses} font-mono`}
                                    required
                                />
                            </FormField>

                            <FormField label="Email Address">
                                <input
                                    type="email"
                                    placeholder="e.g. supplier@example.com"
                                    value={formState.email ?? ''}
                                    onChange={(e) => onFormFieldChange('email', e.target.value)}
                                    className={inputClasses}
                                />
                            </FormField>
                        </div>

                        <FormField label="Previous Opening Due (৳)" required>
                            <input
                                type="number"
                                placeholder="0"
                                value={formState.previous_due}
                                onChange={(e) => onFormFieldChange('previous_due', e.target.value)}
                                className={`${inputClasses} font-mono`}
                                required
                            />
                        </FormField>

                        <FormField label="Office / Warehouse Address">
                            <textarea
                                rows={3}
                                placeholder="e.g. 11/A Tejgaon Industrial Area, Dhaka"
                                value={formState.address ?? ''}
                                onChange={(e) => onFormFieldChange('address', e.target.value)}
                                className={inputClasses}
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
                            form="supplier-form"
                            disabled={
                                isSaving ||
                                !formState.supplier_name?.trim() ||
                                !formState.phone?.trim()
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
                                    <span>{editingSupplier ? 'Update Supplier' : 'Save Supplier'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </SliderDrawer.Footer>
            </SliderDrawer>
        </section>
    );
};

export default SuppliersPresenter;
