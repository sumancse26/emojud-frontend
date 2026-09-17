import React, { useState } from 'react';
import { ShieldCheck, Plus, Edit3, Trash2, Save } from 'lucide-react';
import { SliderDrawer, FormField, inputClasses } from '@/shared';

interface SystemRole {
    id: string;
    name: string;
    code: string;
    usersCount: number;
    permissionsCount: number;
    description: string;
    color: string;
    moduleAccess: {
        pos: boolean;
        inventory: boolean;
        hr: boolean;
        accounts: boolean;
        reports: boolean;
        configurations: boolean;
    };
}

const INITIAL_ROLES: SystemRole[] = [
    {
        id: '1',
        name: 'Super Administrator',
        code: 'ROLE_SUPER_ADMIN',
        usersCount: 2,
        permissionsCount: 48,
        description: 'Unrestricted root access to all system configurations, financials, user permissions and audit logs.',
        color: 'from-rose-500 to-red-600',
        moduleAccess: { pos: true, inventory: true, hr: true, accounts: true, reports: true, configurations: true }
    },
    {
        id: '2',
        name: 'Branch Store Manager',
        code: 'ROLE_BRANCH_MGR',
        usersCount: 4,
        permissionsCount: 32,
        description: 'Outlet POS supervision, discount authorizations, daily sales closing, and cashier audits.',
        color: 'from-blue-500 to-indigo-600',
        moduleAccess: { pos: true, inventory: true, hr: true, accounts: true, reports: true, configurations: false }
    },
    {
        id: '3',
        name: 'POS Cashier / Sales Rep',
        code: 'ROLE_CASHIER',
        usersCount: 16,
        permissionsCount: 14,
        description: 'Invoice generation, barcode scanning, customer due collections, and return requests.',
        color: 'from-emerald-500 to-teal-600',
        moduleAccess: { pos: true, inventory: false, hr: false, accounts: false, reports: false, configurations: false }
    },
    {
        id: '4',
        name: 'Warehouse & Inventory Officer',
        code: 'ROLE_INVENTORY_OFFICER',
        usersCount: 6,
        permissionsCount: 22,
        description: 'Goods received notes (GRN), purchase order fulfillment, stock audits, and inter-branch transfers.',
        color: 'from-amber-500 to-orange-600',
        moduleAccess: { pos: false, inventory: true, hr: false, accounts: false, reports: true, configurations: false }
    },
    {
        id: '5',
        name: 'Chief Financial Accountant',
        code: 'ROLE_ACCOUNTANT',
        usersCount: 3,
        permissionsCount: 28,
        description: 'Expense vouchers, supplier payments, cash flow ledgers, and profit & loss analytics.',
        color: 'from-purple-500 to-violet-600',
        moduleAccess: { pos: false, inventory: false, hr: true, accounts: true, reports: true, configurations: false }
    }
];

export const RolesPage: React.FC = () => {
    const [roles, setRoles] = useState<SystemRole[]>(INITIAL_ROLES);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<SystemRole | null>(null);

    const [formState, setFormState] = useState({
        name: '',
        code: '',
        description: '',
        color: 'from-emerald-500 to-teal-600',
        moduleAccess: {
            pos: true,
            inventory: false,
            hr: false,
            accounts: false,
            reports: false,
            configurations: false
        }
    });

    const handleOpenCreate = () => {
        setEditingRole(null);
        setFormState({
            name: '',
            code: `ROLE_CUSTOM_${Math.floor(100 + Math.random() * 900)}`,
            description: '',
            color: 'from-emerald-500 to-teal-600',
            moduleAccess: { pos: true, inventory: false, hr: false, accounts: false, reports: false, configurations: false }
        });
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (role: SystemRole) => {
        setEditingRole(role);
        setFormState({
            name: role.name,
            code: role.code,
            description: role.description,
            color: role.color,
            moduleAccess: role.moduleAccess
        });
        setIsDrawerOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const countActivePermissions = Object.values(formState.moduleAccess).filter(Boolean).length * 6;
        if (editingRole) {
            setRoles((prev) =>
                prev.map((r) =>
                    r.id === editingRole.id
                        ? { ...r, ...formState, permissionsCount: countActivePermissions }
                        : r
                )
            );
        } else {
            const newRole: SystemRole = {
                id: Date.now().toString(),
                ...formState,
                usersCount: 0,
                permissionsCount: countActivePermissions
            };
            setRoles((prev) => [newRole, ...prev]);
        }
        setIsDrawerOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this custom security role?')) {
            setRoles((prev) => prev.filter((r) => r.id !== id));
        }
    };

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        System Security Roles & RBAC
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Define role privilege sets, permission boundaries, and access clearance levels.
                    </p>
                </div>

                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer">
                    <Plus className="w-4 h-4" />
                    <span>Define Custom Role</span>
                </button>
            </div>

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
                                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                                    {role.name}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                    {role.description}
                                </p>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
                            <span className="text-slate-400 font-medium">
                                <strong>{role.usersCount}</strong> Users • <strong>{role.permissionsCount}</strong> Permissions
                            </span>
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => handleOpenEdit(role)}
                                    className="p-1 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded cursor-pointer"
                                    title="Edit Scope">
                                    <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                {role.id !== '1' && (
                                    <button
                                        onClick={() => handleDelete(role.id)}
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

            {/* Slider Drawer */}
            <SliderDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title={editingRole ? 'Edit Security Role' : 'Define New Security Role'}
                subtitle="Configure Role permissions, module access, and scope"
                width="max-w-lg">
                <form onSubmit={handleSave} className="space-y-4">
                    <FormField label="Role Name" required>
                        <input
                            type="text"
                            placeholder="e.g. Regional Store Supervisor"
                            value={formState.name}
                            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                            className={inputClasses}
                            required
                        />
                    </FormField>

                    <FormField label="Role Unique Code (Uppercase)" required>
                        <input
                            type="text"
                            placeholder="e.g. ROLE_SUPERVISOR"
                            value={formState.code}
                            onChange={(e) => setFormState({ ...formState, code: e.target.value.toUpperCase() })}
                            className={inputClasses}
                            required
                        />
                    </FormField>

                    <FormField label="Role Description & Scope">
                        <textarea
                            rows={3}
                            placeholder="Detail authorization boundaries for this role..."
                            value={formState.description}
                            onChange={(e) => setFormState({ ...formState, description: e.target.value })}
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
                                    <label key={mod.key} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formState.moduleAccess[k]}
                                            onChange={(e) =>
                                                setFormState({
                                                    ...formState,
                                                    moduleAccess: {
                                                        ...formState.moduleAccess,
                                                        [k]: e.target.checked
                                                    }
                                                })
                                            }
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
                            onClick={() => setIsDrawerOpen(false)}
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
