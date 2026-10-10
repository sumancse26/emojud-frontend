import React from 'react';
import { Building2, Plus, Edit3, Save, RefreshCw, AlertCircle, Loader2, Search } from 'lucide-react';
import { SliderDrawer, FormField, inputClasses, PageHeader, Pagination, Skeleton, Dropdown } from '@/shared';
import type { DepartmentItem, CreateDepartmentPayload } from '../../types/department.types';

export interface DepartmentsPresenterProps {
    departments: DepartmentItem[];
    filteredDepartments: DepartmentItem[];
    isLoading: boolean;
    isError: boolean;
    error: string | null;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    isDrawerOpen: boolean;
    onCloseDrawer: () => void;
    editingDept: DepartmentItem | null;
    formState: CreateDepartmentPayload;
    onFormFieldChange: <K extends keyof CreateDepartmentPayload>(field: K, value: CreateDepartmentPayload[K]) => void;
    onOpenCreate: () => void;
    onOpenEdit: (dept: DepartmentItem) => void;
    onSave: (e?: React.FormEvent) => void;
    isSaving: boolean;
    saveError: string | null;
    onRefetch: () => void;
}

export const DepartmentsPresenter: React.FC<DepartmentsPresenterProps> = ({
    departments: _departments,
    filteredDepartments,
    isLoading,
    isError,
    error,
    searchQuery,
    onSearchChange,
    isDrawerOpen,
    onCloseDrawer,
    editingDept,
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
                    title="Company Departments"
                    description="Organizational structure, department display codes, and operational divisions."
                    actions={
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onRefetch}
                                disabled={isLoading}
                                title="Refresh departments"
                                className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition cursor-pointer disabled:opacity-50">
                                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            </button>
                            <button
                                onClick={onOpenCreate}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-emerald-600/20 transition cursor-pointer">
                                <Plus className="w-4 h-4" />
                                <span>Create Department</span>
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
                                placeholder="Search department by name or code..."
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/50 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition"
                            />
                        </div>

                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            Total Departments:{' '}
                            <strong className="text-slate-900 dark:text-white font-bold">
                                {filteredDepartments.length}
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
                        <span>{error || 'Failed to load departments. Please try again.'}</span>
                    </div>
                    <button
                        onClick={onRefetch}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg font-medium hover:bg-red-500 transition cursor-pointer">
                        Retry
                    </button>
                </div>
            )}

            {/* Loading Skeleton */}
            {isLoading && (
                <Skeleton.Card
                    count={4}
                    gridCols="grid-cols-1 md:grid-cols-2"
                    hasIcon={true}
                    hasBadge={true}
                    lines={1}
                    hasFooter={false}
                />
            )}

            {/* Empty State */}
            {!isLoading && !isError && filteredDepartments.length === 0 && (
                <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#0a1020] border border-slate-200/80 dark:border-slate-800/70 rounded-2xl text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {searchQuery ? 'No matching departments found' : 'No departments configured yet'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                        {searchQuery
                            ? `No results matched "${searchQuery}". Try a different keyword.`
                            : 'Create organizational departments to categorize staff roles and branch allocations.'}
                    </p>
                    {!searchQuery && (
                        <button
                            onClick={onOpenCreate}
                            className="mt-2 flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer">
                            <Plus className="w-4 h-4" />
                            <span>Create Department</span>
                        </button>
                    )}
                </div>
            )}

            {/* Department Grid */}
            {!isLoading && !isError && filteredDepartments.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredDepartments.map((dept) => (
                        <div
                            key={dept.id}
                            className="bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl p-5 shadow-xs space-y-3 hover:border-emerald-500/30 transition flex flex-col justify-between">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold shrink-0">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                                                {dept.department_name}
                                            </h3>
                                            {dept.display_code && (
                                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                                    {dept.display_code}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => onOpenEdit(dept)}
                                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition"
                                        title="Edit Department">
                                        <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!isLoading && !isError && filteredDepartments.length > 0 && (
                <Pagination
                    totalItems={filteredDepartments.length}
                    pageSize={6}
                    itemLabel="departments"
                    className="rounded-2xl border border-slate-200/80 dark:border-slate-800/70 bg-white dark:bg-[#0a1020]"
                />
            )}

            {/* Slider Drawer (Global Modal Format matching Shop/Employee) */}
            <SliderDrawer isOpen={isDrawerOpen} onClose={onCloseDrawer}>
                <SliderDrawer.Header onClose={onCloseDrawer}>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                            <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                                {editingDept ? 'Edit Department' : 'Create New Department'}
                            </h2>
                            <p className="text-[10px] text-slate-400">
                                {editingDept
                                    ? `Editing: ${editingDept.department_name}`
                                    : 'Enter department details to configure organizational structure'}
                            </p>
                        </div>
                    </div>
                </SliderDrawer.Header>

                <SliderDrawer.Body>
                    <form id="department-form" onSubmit={onSave} className="space-y-4">
                        {saveError && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{saveError}</span>
                            </div>
                        )}

                        <FormField label="Department Name" required>
                            <input
                                type="text"
                                placeholder="e.g. Distribution, Store Operations"
                                value={formState.department_name}
                                onChange={(e) => onFormFieldChange('department_name', e.target.value)}
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
                            form="department-form"
                            disabled={isSaving || !formState.department_name.trim()}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer">
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>{editingDept ? 'Update Department' : 'Save Department'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </SliderDrawer.Footer>
            </SliderDrawer>
        </section>
    );
};

export default DepartmentsPresenter;
