import React, { useState } from 'react';
import { RolesPresenter } from './presenters/RolesPresenter';

export interface SystemRole {
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

export interface SystemRoleFormData {
    name: string;
    code: string;
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
        description:
            'Unrestricted root access to all system configurations, financials, user permissions and audit logs.',
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
        description:
            'Goods received notes (GRN), purchase order fulfillment, stock audits, and inter-branch transfers.',
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

    const [formState, setFormState] = useState<SystemRoleFormData>({
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
            moduleAccess: {
                pos: true,
                inventory: false,
                hr: false,
                accounts: false,
                reports: false,
                configurations: false
            }
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

    const handleFormFieldChange = <K extends keyof SystemRoleFormData>(
        field: K,
        value: SystemRoleFormData[K]
    ) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleModuleAccessToggle = (moduleKey: keyof SystemRoleFormData['moduleAccess']) => {
        setFormState((prev) => ({
            ...prev,
            moduleAccess: {
                ...prev.moduleAccess,
                [moduleKey]: !prev.moduleAccess[moduleKey]
            }
        }));
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
        <RolesPresenter
            roles={roles}
            isDrawerOpen={isDrawerOpen}
            onCloseDrawer={() => setIsDrawerOpen(false)}
            editingRole={editingRole}
            formState={formState}
            onFormFieldChange={handleFormFieldChange}
            onModuleAccessToggle={handleModuleAccessToggle}
            onOpenCreate={handleOpenCreate}
            onOpenEdit={handleOpenEdit}
            onSave={handleSave}
            onDelete={handleDelete}
        />
    );
};

export default RolesPage;
