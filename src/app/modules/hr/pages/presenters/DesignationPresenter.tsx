import React from 'react';
import { Award, Plus, Edit3, Save, RefreshCw, AlertCircle, Loader2, Search } from 'lucide-react';
import { SliderDrawer, FormField, inputClasses, PageHeader, Pagination, Skeleton, Dropdown } from '@/shared';
import type { DesignationItem, CreateDesignationPayload } from '../../types/designation.types';

export interface DesignationPresenterProps {
    designations: DesignationItem[];
    filteredDesignations: DesignationItem[];
    isLoading: boolean;
    isError: boolean;
    error: string | null;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    isDrawerOpen: boolean;
    onCloseDrawer: () => void;
    editingItem: DesignationItem | null;
    formState: CreateDesignationPayload;
    onFormFieldChange: <K extends keyof CreateDesignationPayload>(field: K, value: CreateDesignationPayload[K]) => void;
    onOpenCreate: () => void;
    onOpenEdit: (item: DesignationItem) => void;
    onSave: (e?: React.FormEvent) => void;
    isSaving: boolean;
    saveError: string | null;
    onRefetch: () => void;
}

export const DesignationPresenter: React.FC<DesignationPresenterProps> = ({
    designations: _designations,
    filteredDesignations,
    isLoading,
    isError,
    error,
    searchQuery,
    onSearchChange,
    isDrawerOpen,
    onCloseDrawer,
    editingItem,
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
                    title="Designations & Job Titles"
                    description="Corporate job designations, role hierarchies, and standard position titles."
                    actions={
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onRefetch}
                                disabled={isLoading}
                                title="Refresh designations"
                                className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition cursor-pointer disabled:opacity-50">
                                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            </button>
                            <button
                                onClick={onOpenCreate}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-emerald-600/20 transition cursor-pointer">
                                <Plus className="w-4 h-4" />
                                <span>Create Designation</span>
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
                                placeholder="Search designation by title or code..."
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/50 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition"
                            />
                        </div>

                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            Total Designations:{' '}
                            <strong className="text-slate-900 dark:text-white font-bold">
                                {filteredDesignations.length}
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
                        <span>{error || 'Failed to load designations. Please try again.'}</span>
                    </div>
                    <button
                        onClick={onRefetch}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg font-medium hover:bg-red-500 transition cursor-pointer">
                        Retry
                    </button>
                </div>
            )}

            {/* Loading Skeleton */}
            {isLoading && <Skeleton.Table rows={5} columns={4} />}

            {/* Empty State */}
            {!isLoading && !isError && filteredDesignations.length === 0 && (
                <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#0a1020] border border-slate-200/80 dark:border-slate-800/70 rounded-2xl text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <Award className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {searchQuery ? 'No matching designations found' : 'No designations configured yet'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                        {searchQuery
                            ? `No results matched "${searchQuery}". Try a different keyword.`
                            : 'Create job title designations to standardize employee roles across branches.'}
                    </p>
                    {!searchQuery && (
                        <button
                            onClick={onOpenCreate}
                            className="mt-2 flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer">
                            <Plus className="w-4 h-4" />
                            <span>Create Designation</span>
                        </button>
                    )}
                </div>
            )}

            {/* Designations Table */}
            {!isLoading && !isError && filteredDesignations.length > 0 && (
                <div className="bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50/80 dark:bg-slate-900/40 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80 text-[11px]">
                                <tr>
                                    <th className="px-5 py-3">Designation Title</th>
                                    <th className="px-4 py-3">Display Code</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {filteredDesignations.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center">
                                                    <Award className="w-4 h-4" />
                                                </div>
                                                <p className="font-bold text-slate-900 dark:text-white">
                                                    {item.designation_name}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 font-mono text-slate-600 dark:text-slate-300">
                                            {item.display_code ? (
                                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
                                                    {item.display_code}
                                                </span>
                                            ) : (
                                                '—'
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            <button
                                                onClick={() => onOpenEdit(item)}
                                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition"
                                                title="Edit Designation">
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination footer */}
                    <Pagination totalItems={filteredDesignations.length} pageSize={10} itemLabel="designations" />
                </div>
            )}

            {/* Slider Drawer (Global Modal Format matching Shop/Employee) */}
            <SliderDrawer isOpen={isDrawerOpen} onClose={onCloseDrawer}>
                <SliderDrawer.Header onClose={onCloseDrawer}>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                            <Award className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                                {editingItem ? 'Edit Designation' : 'Create New Designation'}
                            </h2>
                            <p className="text-[10px] text-slate-400">
                                {editingItem
                                    ? `Editing: ${editingItem.designation_name}`
                                    : 'Enter job designation details to configure corporate positions'}
                            </p>
                        </div>
                    </div>
                </SliderDrawer.Header>

                <SliderDrawer.Body>
                    <form id="designation-form" onSubmit={onSave} className="space-y-4">
                        {saveError && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{saveError}</span>
                            </div>
                        )}

                        <FormField label="Designation Name" required>
                            <input
                                type="text"
                                placeholder="e.g. Team Lead, Store Manager, Cashier"
                                value={formState.designation_name}
                                onChange={(e) => onFormFieldChange('designation_name', e.target.value)}
                                className={inputClasses}
                                required
                            />
                        </FormField>

                        <FormField label="Status" required>
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
                            form="designation-form"
                            disabled={isSaving || !formState.designation_name.trim()}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer">
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>{editingItem ? 'Update Designation' : 'Save Designation'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </SliderDrawer.Footer>
            </SliderDrawer>
        </section>
    );
};

export default DesignationPresenter;
