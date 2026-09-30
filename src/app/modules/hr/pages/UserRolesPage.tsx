import React, { useState } from 'react';
import { UserRolesPresenter } from './presenters/UserRolesPresenter';

export interface UserRoleAssignment {
    id: string;
    userName: string;
    email: string;
    assignedRole: string;
    roleBadgeColor: string;
    assignedBranch: string;
    lastActive: string;
    status: 'Active' | 'Suspended';
}

export interface UserRoleFormData {
    userName: string;
    email: string;
    assignedRole: string;
    assignedBranch: string;
    status: 'Active' | 'Suspended';
}

const INITIAL_USER_ROLES: UserRoleAssignment[] = [
    {
        id: '1',
        userName: 'Suman Roy',
        email: 'suman.admin@emojud.com',
        assignedRole: 'Super Administrator',
        roleBadgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
        assignedBranch: 'All Outlets (Global)',
        lastActive: 'Just Now',
        status: 'Active'
    },
    {
        id: '2',
        userName: 'Tanvir Hossain',
        email: 'tanvir@emojud.com',
        assignedRole: 'Branch Store Manager',
        roleBadgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        assignedBranch: 'Dhanmondi Flagship Outlet',
        lastActive: '5 mins ago',
        status: 'Active'
    },
    {
        id: '3',
        userName: 'Sadia Afreen',
        email: 'sadia.cash@emojud.com',
        assignedRole: 'POS Cashier / Sales Rep',
        roleBadgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        assignedBranch: 'Dhanmondi Flagship Outlet',
        lastActive: '12 mins ago',
        status: 'Active'
    },
    {
        id: '4',
        userName: 'Kamrul Islam',
        email: 'kamrul.wh@emojud.com',
        assignedRole: 'Warehouse & Inventory Officer',
        roleBadgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        assignedBranch: 'Central Warehouse (Savar)',
        lastActive: '1 hour ago',
        status: 'Active'
    }
];

export const UserRolesPage: React.FC = () => {
    const [userRoles, setUserRoles] = useState<UserRoleAssignment[]>(INITIAL_USER_ROLES);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<UserRoleAssignment | null>(null);

    const [formState, setFormState] = useState<UserRoleFormData>({
        userName: '',
        email: '',
        assignedRole: 'POS Cashier / Sales Rep',
        assignedBranch: 'Dhanmondi Flagship Outlet',
        status: 'Active'
    });

    const getRoleColor = (role: string) => {
        if (role.includes('Super Admin'))
            return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
        if (role.includes('Manager'))
            return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
        if (role.includes('Cashier'))
            return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    };

    const handleOpenCreate = () => {
        setEditingItem(null);
        setFormState({
            userName: '',
            email: '',
            assignedRole: 'POS Cashier / Sales Rep',
            assignedBranch: 'Dhanmondi Flagship Outlet',
            status: 'Active'
        });
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (item: UserRoleAssignment) => {
        setEditingItem(item);
        setFormState({
            userName: item.userName,
            email: item.email,
            assignedRole: item.assignedRole,
            assignedBranch: item.assignedBranch,
            status: item.status
        });
        setIsDrawerOpen(true);
    };

    const handleFormFieldChange = <K extends keyof UserRoleFormData>(
        field: K,
        value: UserRoleFormData[K]
    ) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            setUserRoles((prev) =>
                prev.map((u) =>
                    u.id === editingItem.id
                        ? { ...u, ...formState, roleBadgeColor: getRoleColor(formState.assignedRole) }
                        : u
                )
            );
        } else {
            const newItem: UserRoleAssignment = {
                id: Date.now().toString(),
                ...formState,
                roleBadgeColor: getRoleColor(formState.assignedRole),
                lastActive: 'Just registered'
            };
            setUserRoles((prev) => [newItem, ...prev]);
        }
        setIsDrawerOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to remove this user role assignment?')) {
            setUserRoles((prev) => prev.filter((u) => u.id !== id));
        }
    };

    const filteredUserRoles = userRoles.filter(
        (u) =>
            u.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.assignedRole.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <UserRolesPresenter
            userRoles={userRoles}
            filteredUserRoles={filteredUserRoles}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isDrawerOpen={isDrawerOpen}
            onCloseDrawer={() => setIsDrawerOpen(false)}
            editingItem={editingItem}
            formState={formState}
            onFormFieldChange={handleFormFieldChange}
            onOpenCreate={handleOpenCreate}
            onOpenEdit={handleOpenEdit}
            onSave={handleSave}
            onDelete={handleDelete}
        />
    );
};

export default UserRolesPage;
