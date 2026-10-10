import React, { useState, useMemo } from 'react';
import { useApp } from '@/app/providers';
import { useToast } from '@/shared/components/Toast';
import { tokenStorage } from '@/shared';
import type { User } from '@/app/modules/auth/types/auth.types';
import { useSupplier } from '../hooks/useSupplier';
import { SuppliersPresenter } from './presenters/SuppliersPresenter';
import type { SupplierItem, CreateUpdateSupplierPayload } from '../types/supplier.types';

const defaultFormState: CreateUpdateSupplierPayload = {
    id: null,
    shop_id: 1,
    supplier_name: '',
    phone: '',
    email: '',
    address: '',
    previous_due: 0,
    created_by: 1
};

export const SuppliersPage: React.FC = () => {
    const { selectedBranch } = useApp();
    const toast = useToast();

    // ─── Query Params ─────────────────────────────────────────────────
    const supplierParams = useMemo(
        () => ({ shop_id: selectedBranch }),
        [selectedBranch]
    );

    // ─── Supplier Hook ────────────────────────────────────────────────
    const {
        suppliers,
        isLoading,
        isError,
        error,
        refetch,
        createOrUpdateSupplier,
        isSaving,
        saveError
    } = useSupplier({
        immediate: true,
        initialParams: supplierParams
    });

    // ─── UI States ────────────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<SupplierItem | null>(null);
    const [formState, setFormState] = useState<CreateUpdateSupplierPayload>(defaultFormState);

    // ─── Search Filtering ─────────────────────────────────────────────
    const filteredSuppliers = useMemo(() => {
        if (!searchQuery.trim()) return suppliers;
        const q = searchQuery.toLowerCase();
        return suppliers.filter(
            (s) =>
                s.supplier_name?.toLowerCase().includes(q) ||
                s.supplier_code?.toLowerCase().includes(q) ||
                s.phone?.toLowerCase().includes(q) ||
                s.email?.toLowerCase().includes(q) ||
                s.address?.toLowerCase().includes(q)
        );
    }, [suppliers, searchQuery]);

    // ─── Form Actions ─────────────────────────────────────────────────
    const handleOpenCreate = () => {
        setEditingSupplier(null);
        setFormState({
            ...defaultFormState,
            shop_id: Number(selectedBranch)
        });
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (item: SupplierItem) => {
        setEditingSupplier(item);
        setFormState({
            id: Number(item.id),
            shop_id: Number(item.shop_id || selectedBranch),
            supplier_name: item.supplier_name,
            phone: item.phone ?? '',
            email: item.email ?? '',
            address: item.address ?? '',
            previous_due: item.previous_due !== undefined ? Number(item.previous_due) : 0,
            created_by: item.created_by ? Number(item.created_by) : 1
        });
        setIsDrawerOpen(true);
    };

    const handleFormFieldChange = <K extends keyof CreateUpdateSupplierPayload>(
        field: K,
        value: CreateUpdateSupplierPayload[K]
    ) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!formState.supplier_name?.trim()) {
            toast.warning('Supplier name is required.');
            return;
        }
        if (!formState.phone?.trim()) {
            toast.warning('Phone number is required.');
            return;
        }

        const isUpdating = Boolean(editingSupplier);
        const user = tokenStorage.getUser<User>();

        const payload: CreateUpdateSupplierPayload = {
            id: isUpdating && editingSupplier ? Number(editingSupplier.id) : null,
            shop_id: Number(selectedBranch),
            supplier_name: formState.supplier_name.trim(),
            phone: formState.phone.trim(),
            email: formState.email?.trim() || null,
            address: formState.address?.trim() || null,
            previous_due: Number(formState.previous_due || 0),
            created_by: user?.id ? Number(user.id) : 1
        };

        try {
            await createOrUpdateSupplier(payload);
            toast.success(
                isUpdating
                    ? `Supplier "${formState.supplier_name}" updated successfully!`
                    : `Supplier "${formState.supplier_name}" registered successfully!`
            );
            setIsDrawerOpen(false);
            setEditingSupplier(null);
            setFormState(defaultFormState);
        } catch (err: unknown) {
            const errorMsg =
                err instanceof Error ? err.message : 'Failed to save supplier. Please try again.';
            toast.error(errorMsg);
        }
    };

    return (
        <SuppliersPresenter
            suppliers={suppliers}
            filteredSuppliers={filteredSuppliers}
            isLoading={isLoading}
            isError={isError}
            error={error}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isDrawerOpen={isDrawerOpen}
            onCloseDrawer={() => setIsDrawerOpen(false)}
            editingSupplier={editingSupplier}
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

export default SuppliersPage;
