import React, { useState, useMemo } from 'react';
import { useToast } from '@/shared/components/Toast';
import { tokenStorage } from '@/shared';
import type { User } from '@/app/modules/auth/types/auth.types';
import { useRole } from '../hooks/useRole';
import { RolesPresenter } from './presenters/RolesPresenter';
import type { RoleItem, CreateRolePayload } from '../types/role.types';

const defaultFormState: CreateRolePayload = {
    id: 0,
    role_name: '',
    status: 1
};

export const RolesPage: React.FC = () => {
    const toast = useToast();

    const {
        roles,
        isLoading,
        isError,
        error,
        refetch,
        createOrUpdateRole,
        isSaving,
        saveError
    } = useRole({ immediate: true });

    const [searchQuery, setSearchQuery] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
    const [formState, setFormState] = useState<CreateRolePayload>(defaultFormState);

    const filteredRoles = useMemo(() => {
        if (!searchQuery.trim()) return roles;
        const q = searchQuery.toLowerCase();
        return roles.filter(
            (role) =>
                role.role_name?.toLowerCase().includes(q) ||
                role.short_code?.toLowerCase().includes(q)
        );
    }, [roles, searchQuery]);

    const handleOpenCreate = () => {
        setEditingRole(null);
        setFormState(defaultFormState);
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (role: RoleItem) => {
        setEditingRole(role);
        setFormState({
            id: Number(role.id),
            role_name: role.role_name,
            status: role.status !== undefined ? Number(role.status) : 1
        });
        setIsDrawerOpen(true);
    };

    const handleFormFieldChange = <K extends keyof CreateRolePayload>(
        field: K,
        value: CreateRolePayload[K]
    ) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!formState.role_name.trim()) {
            toast.warning('Role name is required.');
            return;
        }

        const isUpdating = Boolean(editingRole);
        const user = tokenStorage.getUser<User>();

        try {
            await createOrUpdateRole({
                id: isUpdating && editingRole ? Number(editingRole.id) : 0,
                role_name: formState.role_name.trim(),
                status: Number(formState.status ?? 1),
                company_id: user?.branchId ? Number(user.branchId) : 1,
                user_id: user?.id ? Number(user.id) : 1
            });

            toast.success(
                isUpdating
                    ? `Role "${formState.role_name}" updated successfully!`
                    : `Role "${formState.role_name}" created successfully!`
            );
            setIsDrawerOpen(false);
            setEditingRole(null);
            setFormState(defaultFormState);
        } catch (err: unknown) {
            const errorMsg =
                err instanceof Error ? err.message : 'Failed to save role. Please try again.';
            toast.error(errorMsg);
        }
    };

    return (
        <RolesPresenter
            roles={roles}
            filteredRoles={filteredRoles}
            isLoading={isLoading}
            isError={isError}
            error={error}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isDrawerOpen={isDrawerOpen}
            onCloseDrawer={() => setIsDrawerOpen(false)}
            editingRole={editingRole}
            formState={formState}
            onFormFieldChange={handleFormFieldChange}
            onOpenCreate={handleOpenCreate}
            onOpenEdit={handleOpenEdit}
            onSave={handleSave}
            isSaving={isSaving}
            saveError={saveError}
            onRefetch={() => void refetch()}
        />
    );
};

export default RolesPage;
