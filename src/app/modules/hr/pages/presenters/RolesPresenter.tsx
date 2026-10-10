import React from 'react';
import { ShieldCheck, Plus, Edit3, Save, RefreshCw, AlertCircle, Loader2, Search } from 'lucide-react';
import { SliderDrawer, FormField, inputClasses, PageHeader, Pagination, Skeleton, Dropdown } from '@/shared';
import type { RoleItem, CreateRolePayload } from '../../types/role.types';

export interface RolesPresenterProps {
    roles: RoleItem[];
    filteredRoles: RoleItem[];
    isLoading: boolean;
    isError: boolean;
    error: string | null;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    isDrawerOpen: boolean;
    onCloseDrawer: () => void;
    editingRole: RoleItem | null;
    formState: CreateRolePayload;
    onFormFieldChange: <K extends keyof CreateRolePayload>(field: K, value: CreateRolePayload[K]) => void;
    onOpenCreate: () => void;
    onOpenEdit: (role: RoleItem) => void;
    onSave: (e?: React.FormEvent) => void;
    isSaving: boolean;
    saveError: string | null;
    onRefetch: () => void;
}

export const RolesPresenter: React.FC<RolesPresenterProps> = ({
    roles: _roles,
    filteredRoles,
    isLoading,
    isError,
    error,
    searchQuery,
    onSearchChange,
    isDrawerOpen,
    onCloseDrawer,
    editingRole,
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
                    title="System Security Roles & RBAC"
                    description="Define role privilege sets, short codes, and access permissions."
                    actions={
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onRefetch}
                                disabled={isLoading}
                                title="Refresh roles"
                                className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition cursor-pointer disabled:opacity-50">
                                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            </button>
                            <button
                                onClick={onOpenCreate}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-emerald-600/20 transition cursor-pointer">
                                <Plus className="w-4 h-4" />
                                <span>Create Role</span>
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
                                placeholder="Search role by name or code..."
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/50 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition"
                            />
                        </div>

                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            Total Roles:{' '}
                            <strong className="text-slate-900 dark:text-white font-bold">
                                {filteredRoles.length}
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
                        <span>{error || 'Failed to load roles. Please try again.'}</span>
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
                    count={6}
                    gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    hasIcon={true}
                    hasBadge={true}
                    lines={1}
                    hasFooter={false}
                />
            )}

            {/* Empty State */}
            {!isLoading && !isError && filteredRoles.length === 0 && (
                <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#0a1020] border border-slate-200/80 dark:border-slate-800/70 rounded-2xl text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {searchQuery ? 'No matching roles found' : 'No roles configured yet'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                        {searchQuery
                            ? `No results matched "${searchQuery}". Try a different keyword.`
                            : 'Define system security roles to establish authorization levels and user scopes.'}
                    </p>
                    {!searchQuery && (
                        <button
                            onClick={onOpenCreate}
                            className="mt-2 flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer">
                            <Plus className="w-4 h-4" />
                            <span>Create Role</span>
                        </button>
                    )}
                </div>
            )}

            {/* Role Grid */}
            {!isLoading && !isError && filteredRoles.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRoles.map((role) => (
                        <div
                            key={role.id}
                            className="bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl p-5 shadow-xs space-y-3 hover:border-emerald-500/30 transition flex flex-col justify-between">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shrink-0">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                                                {role.role_name}
                                            </h3>
                                            {role.short_code && (
                                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                                    {role.short_code}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => onOpenEdit(role)}
                                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition"
                                        title="Edit Role">
                                        <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!isLoading && !isError && filteredRoles.length > 0 && (
                <Pagination
                    totalItems={filteredRoles.length}
                    pageSize={6}
                    itemLabel="roles"
                    className="rounded-2xl border border-slate-200/80 dark:border-slate-800/70 bg-white dark:bg-[#0a1020]"
                />
            )}

            {/* Slider Drawer (Global Modal Format) */}
            <SliderDrawer isOpen={isDrawerOpen} onClose={onCloseDrawer}>
                <SliderDrawer.Header onClose={onCloseDrawer}>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                                {editingRole ? 'Edit Role' : 'Create New Role'}
                            </h2>
                            <p className="text-[10px] text-slate-400">
                                {editingRole
                                    ? `Editing: ${editingRole.role_name}`
                                    : 'Enter role details to configure access privilege set'}
                            </p>
                        </div>
                    </div>
                </SliderDrawer.Header>

                <SliderDrawer.Body>
                    <form id="role-form" onSubmit={onSave} className="space-y-4">
                        {saveError && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{saveError}</span>
                            </div>
                        )}

                        <FormField label="Role Name" required>
                            <input
                                type="text"
                                placeholder="e.g. Administrator, Store Manager"
                                value={formState.role_name}
                                onChange={(e) => onFormFieldChange('role_name', e.target.value)}
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
                            form="role-form"
                            disabled={isSaving || !formState.role_name.trim()}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer">
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>{editingRole ? 'Update Role' : 'Save Role'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </SliderDrawer.Footer>
            </SliderDrawer>
        </section>
    );
};

export default RolesPresenter;
