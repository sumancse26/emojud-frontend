import React, { useState, useMemo } from 'react';
import { useToast } from '@/shared/components/Toast';
import { useDepartment } from '../hooks/useDepartment';
import { DepartmentsPresenter } from './presenters/DepartmentsPresenter';
import type { DepartmentItem, CreateDepartmentPayload } from '../types/department.types';

const defaultFormState: CreateDepartmentPayload = {
    id: 0,
    department_name: '',
    status: 1
};

export const DepartmentsPage: React.FC = () => {
    const toast = useToast();

    const {
        departments,
        isLoading,
        isError,
        error,
        refetch,
        createOrUpdateDepartment,
        isSaving,
        saveError
    } = useDepartment({ immediate: true });

    const [searchQuery, setSearchQuery] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingDept, setEditingDept] = useState<DepartmentItem | null>(null);
    const [formState, setFormState] = useState<CreateDepartmentPayload>(defaultFormState);

    const filteredDepartments = useMemo(() => {
        if (!searchQuery.trim()) return departments;
        const q = searchQuery.toLowerCase();
        return departments.filter(
            (dept) =>
                dept.department_name?.toLowerCase().includes(q) ||
                dept.display_code?.toLowerCase().includes(q)
        );
    }, [departments, searchQuery]);

    const handleOpenCreate = () => {
        setEditingDept(null);
        setFormState(defaultFormState);
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (dept: DepartmentItem) => {
        setEditingDept(dept);
        setFormState({
            id: Number(dept.id),
            department_name: dept.department_name,
            status: dept.status !== undefined ? Number(dept.status) : 1
        });
        setIsDrawerOpen(true);
    };

    const handleFormFieldChange = <K extends keyof CreateDepartmentPayload>(
        field: K,
        value: CreateDepartmentPayload[K]
    ) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!formState.department_name.trim()) {
            toast.warning('Department name is required.');
            return;
        }

        const isUpdating = Boolean(editingDept);

        try {
            await createOrUpdateDepartment({
                id: isUpdating && editingDept ? Number(editingDept.id) : 0,
                department_name: formState.department_name.trim(),
                status: Number(formState.status ?? 1)
            });

            toast.success(
                isUpdating
                    ? `Department "${formState.department_name}" updated successfully!`
                    : `Department "${formState.department_name}" created successfully!`
            );
            setIsDrawerOpen(false);
            setEditingDept(null);
            setFormState(defaultFormState);
        } catch (err: unknown) {
            const errorMsg =
                err instanceof Error ? err.message : 'Failed to save department. Please try again.';
            toast.error(errorMsg);
        }
    };

    return (
        <DepartmentsPresenter
            departments={departments}
            filteredDepartments={filteredDepartments}
            isLoading={isLoading}
            isError={isError}
            error={error}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isDrawerOpen={isDrawerOpen}
            onCloseDrawer={() => setIsDrawerOpen(false)}
            editingDept={editingDept}
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

export default DepartmentsPage;
