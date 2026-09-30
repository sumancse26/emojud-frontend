import React from 'react';
import { Shield, Plus, Edit3, Trash2, Save, Search } from 'lucide-react';
import { SliderDrawer, FormField, inputClasses, PageHeader } from '@/shared';
import type { UserRoleAssignment, UserRoleFormData } from '../UserRolesPage';

export interface UserRolesPresenterProps {
    userRoles: UserRoleAssignment[];
    filteredUserRoles: UserRoleAssignment[];
    searchQuery: string;
    onSearchChange: (query: string) => void;
    isDrawerOpen: boolean;
    onCloseDrawer: () => void;
    editingItem: UserRoleAssignment | null;
    formState: UserRoleFormData;
    onFormFieldChange: <K extends keyof UserRoleFormData>(field: K, value: UserRoleFormData[K]) => void;
    onOpenCreate: () => void;
    onOpenEdit: (item: UserRoleAssignment) => void;
    onSave: (e: React.FormEvent) => void;
    onDelete: (id: string) => void;
}

export const UserRolesPresenter: React.FC<UserRolesPresenterProps> = ({
    filteredUserRoles,
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
    onDelete
}) => {
    return (
        <section className="space-y-6">
            <PageHeader>
                <PageHeader.Header
                    title="User Role Assignments"
                    description="Map system user logins to role profiles and operational store branches."
                    actions={
                        <button
                            onClick={onOpenCreate}
                            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer">
                            <Plus className="w-4 h-4" />
                            <span>Assign Role to User</span>
                        </button>
                    }
                />

                <PageHeader.Bottom>
                    <div className="relative max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Filter by name, email, or role..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/50 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium transition"
                        />
                    </div>
                </PageHeader.Bottom>
            </PageHeader>

            <div className="bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/80 dark:bg-slate-900/40 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80 text-[11px]">
                            <tr>
                                <th className="px-5 py-3">User & Email</th>
                                <th className="px-4 py-3">Assigned Security Role</th>
                                <th className="px-4 py-3">Branch Outlet Access</th>
                                <th className="px-4 py-3">Last Active</th>
                                <th className="px-4 py-3 text-center">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {filteredUserRoles.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                                    <td className="px-5 py-3.5">
                                        <p className="font-bold text-slate-900 dark:text-white">{u.userName}</p>
                                        <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span
                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${u.roleBadgeColor}`}>
                                            <Shield className="w-3 h-3" />
                                            <span>{u.assignedRole}</span>
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 font-medium">
                                        {u.assignedBranch}
                                    </td>
                                    <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400">{u.lastActive}</td>
                                    <td className="px-4 py-3.5 text-center">
                                        <span
                                            className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                                u.status === 'Active'
                                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                                    : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                                            }`}>
                                            {u.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => onOpenEdit(u)}
                                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                                title="Edit Assignment">
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                            {u.id !== '1' && (
                                                <button
                                                    onClick={() => onDelete(u.id)}
                                                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
                                                    title="Remove Assignment">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Slider Drawer */}
            <SliderDrawer
                isOpen={isDrawerOpen}
                onClose={onCloseDrawer}
                title={editingItem ? 'Edit User Assignment' : 'Assign Security Role'}
                subtitle="Map operator identity to role credentials and physical branch"
                width="max-w-lg">
                <form onSubmit={onSave} className="space-y-4">
                    <FormField label="Staff Member Name" required>
                        <input
                            type="text"
                            placeholder="e.g. Arif Chowdhury"
                            value={formState.userName}
                            onChange={(e) => onFormFieldChange('userName', e.target.value)}
                            className={inputClasses}
                            required
                        />
                    </FormField>

                    <FormField label="Email Login Address" required>
                        <input
                            type="email"
                            placeholder="e.g. arif.chowdhury@emojud.com"
                            value={formState.email}
                            onChange={(e) => onFormFieldChange('email', e.target.value)}
                            className={inputClasses}
                            required
                        />
                    </FormField>

                    <FormField label="Security Role Profile" required>
                        <select
                            value={formState.assignedRole}
                            onChange={(e) => onFormFieldChange('assignedRole', e.target.value)}
                            className={inputClasses}>
                            <option value="Super Administrator">Super Administrator</option>
                            <option value="Branch Store Manager">Branch Store Manager</option>
                            <option value="POS Cashier / Sales Rep">POS Cashier / Sales Rep</option>
                            <option value="Warehouse & Inventory Officer">Warehouse & Inventory Officer</option>
                            <option value="Chief Financial Accountant">Chief Financial Accountant</option>
                        </select>
                    </FormField>

                    <FormField label="Primary Branch Outlet" required>
                        <select
                            value={formState.assignedBranch}
                            onChange={(e) => onFormFieldChange('assignedBranch', e.target.value)}
                            className={inputClasses}>
                            <option value="All Outlets (Global)">All Outlets (Global)</option>
                            <option value="Dhanmondi Flagship Outlet">Dhanmondi Flagship Outlet</option>
                            <option value="Gulshan Branch Outlet">Gulshan Branch Outlet</option>
                            <option value="Uttara Sector 3 Branch">Uttara Sector 3 Branch</option>
                            <option value="Central Warehouse (Savar)">Central Warehouse (Savar)</option>
                        </select>
                    </FormField>

                    <FormField label="Account Status">
                        <select
                            value={formState.status}
                            onChange={(e) =>
                                onFormFieldChange('status', e.target.value as 'Active' | 'Suspended')
                            }
                            className={inputClasses}>
                            <option value="Active">Active</option>
                            <option value="Suspended">Suspended</option>
                        </select>
                    </FormField>

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
                            <span>{editingItem ? 'Update Assignment' : 'Save Assignment'}</span>
                        </button>
                    </div>
                </form>
            </SliderDrawer>
        </section>
    );
};

export default UserRolesPresenter;
