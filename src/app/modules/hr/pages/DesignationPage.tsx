import React, { useState, useMemo } from 'react';
import { useToast } from '@/shared/components/Toast';
import { useDesignation } from '../hooks/useDesignation';
import { DesignationPresenter } from './presenters/DesignationPresenter';
import type { DesignationItem, CreateDesignationPayload } from '../types/designation.types';

const defaultFormState: CreateDesignationPayload = {
    id: 0,
    designation_name: '',
    status: 1
};

export const DesignationPage: React.FC = () => {
    const toast = useToast();

    const {
        designations,
        isLoading,
        isError,
        error,
        refetch,
        createOrUpdateDesignation,
        isSaving,
        saveError
    } = useDesignation({ immediate: true });

    const [searchQuery, setSearchQuery] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<DesignationItem | null>(null);
    const [formState, setFormState] = useState<CreateDesignationPayload>(defaultFormState);

    const filteredDesignations = useMemo(() => {
        if (!searchQuery.trim()) return designations;
        const q = searchQuery.toLowerCase();
        return designations.filter(
            (item) =>
                item.designation_name?.toLowerCase().includes(q) ||
                item.display_code?.toLowerCase().includes(q)
        );
    }, [designations, searchQuery]);

    const handleOpenCreate = () => {
        setEditingItem(null);
        setFormState(defaultFormState);
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (item: DesignationItem) => {
        setEditingItem(item);
        setFormState({
            id: Number(item.id),
            designation_name: item.designation_name,
            status: item.status !== undefined ? Number(item.status) : 1
        });
        setIsDrawerOpen(true);
    };

    const handleFormFieldChange = <K extends keyof CreateDesignationPayload>(
        field: K,
        value: CreateDesignationPayload[K]
    ) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!formState.designation_name.trim()) {
            toast.warning('Designation name is required.');
            return;
        }

        const isUpdating = Boolean(editingItem);

        try {
            await createOrUpdateDesignation({
                id: isUpdating && editingItem ? Number(editingItem.id) : 0,
                designation_name: formState.designation_name.trim(),
                status: Number(formState.status ?? 1)
            });

            toast.success(
                isUpdating
                    ? `Designation "${formState.designation_name}" updated successfully!`
                    : `Designation "${formState.designation_name}" created successfully!`
            );
            setIsDrawerOpen(false);
            setEditingItem(null);
            setFormState(defaultFormState);
        } catch (err: unknown) {
            const errorMsg =
                err instanceof Error ? err.message : 'Failed to save designation. Please try again.';
            toast.error(errorMsg);
        }
    };

    return (
        <DesignationPresenter
            designations={designations}
            filteredDesignations={filteredDesignations}
            isLoading={isLoading}
            isError={isError}
            error={error}
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
            isSaving={isSaving}
            saveError={saveError}
            onRefetch={() => void refetch()}
        />
    );
};

export default DesignationPage;
