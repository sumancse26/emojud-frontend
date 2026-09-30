import React from 'react';
import { ShieldCheck, Plus, Edit3, Trash2, Save } from 'lucide-react';
import { SliderDrawer, FormField, inputClasses, PageHeader, Pagination } from '@/shared';
import type { SystemRole, SystemRoleFormData } from '../RolesPage';

export interface RolesPresenterProps {
    roles: SystemRole[];
    isDrawerOpen: boolean;
    onCloseDrawer: () => void;
    editingRole: SystemRole | null;
    formState: SystemRoleFormData;
    onFormFieldChange: <K extends keyof SystemRoleFormData>(field: K, value: SystemRoleFormData[K]) => void;
    onModuleAccessToggle: (moduleKey: keyof SystemRoleFormData['moduleAccess']) => void;
    onOpenCreate: () => void;
    onOpenEdit: (role: SystemRole) => void;
    onSave: (e: React.FormEvent) => void;
    onDelete: (id: string) => void;
}

export const RolesPresenter: React.FC<RolesPresenterProps> = ({
    roles,
    isDrawerOpen,
    onCloseDrawer,
    editingRole,
    formState,
    onFormFieldChange,
    onModuleAccessToggle,
    onOpenCreate,
    onOpenEdit,
    onSave,
    onDelete
}) => {
    return (
        <section className="space-y-6">
            <PageHeader>
                <PageHeader.Header
                    title="System Security Roles & RBAC"
                    description="Define role privilege sets, permission boundaries, and access clearance levels."
                    actions={
                        <button
                            onClick={onOpenCreate}
                            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer">
                            <Plus className="w-4 h-4" />
                            <span>Define Custom Role</span>
                        </button>
                    }
                />
            </PageHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {roles.map((role) => (
                    <div
                        key={role.id}
                        className="bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-500/30 transition">
                        <div className="space-y-3">
                            <div className="flex items-start justify-between">
                                <div
                                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${role.color} text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/10`}>
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                                        {role.code}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{role.name}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                    {role.description}
                                </p>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
                            <span className="text-slate-400 font-medium">
                                <strong>{role.usersCount}</strong> Users • <strong>{role.permissionsCount}</strong>{' '}
                                Permissions
                            </span>
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => onOpenEdit(role)}
                                    className="p-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded cursor-pointer"
                                    title="Edit Scope">
                                    <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                {role.id !== '1' && (
                                    <button
                                        onClick={() => onDelete(role.id)}
                                        className="p-1 text-slate-400 hover:text-rose-500 rounded cursor-pointer"
                                        title="Delete Role">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination Footer */}
            <Pagination
                totalItems={roles.length}
                pageSize={6}
                itemLabel="roles"
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800/70 bg-white dark:bg-[#0a1020]"
            />

            {/* Slider Drawer */}
            <SliderDrawer
                isOpen={isDrawerOpen}
                onClose={onCloseDrawer}
                title={editingRole ? 'Edit Security Role' : 'Define New Security Role'}
                subtitle="Configure Role permissions, module access, and scope"
                width="max-w-lg">
                <form onSubmit={onSave} className="space-y-4">
                    <FormField label="Role Name" required>
                        <input
                            type="text"
                            placeholder="e.g. Regional Store Supervisor"
                            value={formState.name}
                            onChange={(e) => onFormFieldChange('name', e.target.value)}
                            className={inputClasses}
                            required
                        />
                    </FormField>

                    <FormField label="Role Unique Code (Uppercase)" required>
                        <input
                            type="text"
                            placeholder="e.g. ROLE_SUPERVISOR"
                            value={formState.code}
                            onChange={(e) => onFormFieldChange('code', e.target.value.toUpperCase())}
                            className={inputClasses}
                            required
                        />
                    </FormField>

                    <FormField label="Role Description & Scope">
                        <textarea
                            rows={3}
                            placeholder="Detail authorization boundaries for this role..."
                            value={formState.description}
                            onChange={(e) => onFormFieldChange('description', e.target.value)}
                            className={inputClasses}
                        />
                    </FormField>

                    {/* Permissions / Module Access matrix */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">
                            Module Access Privileges
                        </label>
                        <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                            {[
                                { key: 'pos', label: 'POS & Billing' },
                                { key: 'inventory', label: 'Inventory & Stock' },
                                { key: 'hr', label: 'HR & Staffing' },
                                { key: 'accounts', label: 'Accounts & Expense' },
                                { key: 'reports', label: 'Financial Reports' },
                                { key: 'configurations', label: 'System Configurations' }
                            ].map((mod) => {
                                const k = mod.key as keyof typeof formState.moduleAccess;
                                return (
                                    <label
                                        key={mod.key}
                                        className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formState.moduleAccess[k]}
                                            onChange={() => onModuleAccessToggle(k)}
                                            className="w-4 h-4 text-emerald-600 rounded accent-emerald-600 cursor-pointer"
                                        />
                                        <span>{mod.label}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={onCloseDrawer}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer">
                            <Save className="w-4 h-4" />
                            <span>{editingRole ? 'Update Role' : 'Save Security Role'}</span>
                        </button>
                    </div>
                </form>
            </SliderDrawer>
        </section>
    );
};

export default RolesPresenter;
