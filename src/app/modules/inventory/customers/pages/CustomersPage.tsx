import React, { useState, useMemo } from 'react';
import { useApp } from '@/app/providers';
import { useToast } from '@/shared/components/Toast';
import { tokenStorage } from '@/shared';
import type { User } from '@/app/modules/auth/types/auth.types';
import { useCustomer } from '../hooks/useCustomer';
import { CustomersPresenter } from './presenters/CustomersPresenter';
import type {
    CustomerItem,
    CreateUpdateCustomerPayload,
    CustomerDetailResponse
} from '../types/customer.types';

const defaultFormState: CreateUpdateCustomerPayload = {
    id: null,
    shop_id: 1,
    customer_name: '',
    phone: '',
    email: '',
    address: '',
    previous_due: 0,
    created_by: 1
};

export const CustomersPage: React.FC = () => {
    const { selectedBranch } = useApp();
    const toast = useToast();

    // ─── Query Params ─────────────────────────────────────────────────
    const customerParams = useMemo(
        () => ({ shop_id: selectedBranch }),
        [selectedBranch]
    );

    // ─── Customer Hook ────────────────────────────────────────────────
    const {
        customers,
        isLoading,
        isError,
        error,
        refetch,
        getCustomerByPhone,
        createOrUpdateCustomer,
        isSaving,
        saveError
    } = useCustomer({
        immediate: true,
        initialParams: customerParams
    });

    // ─── UI States ────────────────────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<CustomerItem | null>(null);
    const [formState, setFormState] = useState<CreateUpdateCustomerPayload>(defaultFormState);

    // ─── Search Filtering ─────────────────────────────────────────────
    const filteredCustomers = useMemo(() => {
        if (!searchQuery.trim()) return customers;
        const q = searchQuery.toLowerCase();
        return customers.filter(
            (c) =>
                c.customer_name?.toLowerCase().includes(q) ||
                c.customer_code?.toLowerCase().includes(q) ||
                c.phone?.toLowerCase().includes(q) ||
                c.email?.toLowerCase().includes(q) ||
                c.address?.toLowerCase().includes(q)
        );
    }, [customers, searchQuery]);

    // ─── Form Handlers ────────────────────────────────────────────────
    const handleOpenCreate = () => {
        setEditingCustomer(null);
        setFormState({
            ...defaultFormState,
            shop_id: Number(selectedBranch || 1)
        });
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (item: CustomerItem) => {
        setEditingCustomer(item);
        setFormState({
            id: Number(item.id),
            shop_id: Number(item.shop_id || selectedBranch || 1),
            customer_name: item.customer_name,
            phone: item.phone ?? '',
            email: item.email ?? '',
            address: item.address ?? '',
            previous_due: item.previous_due !== undefined ? Number(item.previous_due) : 0,
            created_by: item.created_by ? Number(item.created_by) : 1
        });
        setIsDrawerOpen(true);
    };

    const handleFormFieldChange = <K extends keyof CreateUpdateCustomerPayload>(
        field: K,
        value: CreateUpdateCustomerPayload[K]
    ) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!formState.customer_name?.trim()) {
            toast.warning('Customer name is required.');
            return;
        }
        if (!formState.phone?.trim()) {
            toast.warning('Phone number is required.');
            return;
        }

        const isUpdating = Boolean(editingCustomer);
        const user = tokenStorage.getUser<User>();

        const payload: CreateUpdateCustomerPayload = {
            id: isUpdating && editingCustomer ? Number(editingCustomer.id) : null,
            shop_id: Number(selectedBranch || 1),
            customer_name: formState.customer_name.trim(),
            phone: formState.phone.trim(),
            email: formState.email?.trim() || null,
            address: formState.address?.trim() || null,
            previous_due: Number(formState.previous_due || 0),
            created_by: user?.id ? Number(user.id) : 1
        };

        try {
            await createOrUpdateCustomer(payload);
            toast.success(
                isUpdating
                    ? `Customer "${formState.customer_name}" updated successfully!`
                    : `Customer "${formState.customer_name}" registered successfully!`
            );
            setIsDrawerOpen(false);
            setEditingCustomer(null);
            setFormState(defaultFormState);
        } catch (err: unknown) {
            const errorMsg =
                err instanceof Error ? err.message : 'Failed to save customer. Please try again.';
            toast.error(errorMsg);
        }
    };

    const handleLookupPhone = async (phone: string): Promise<CustomerDetailResponse> => {
        return getCustomerByPhone(phone);
    };

    return (
        <CustomersPresenter
            customers={customers}
            filteredCustomers={filteredCustomers}
            isLoading={isLoading}
            isError={isError}
            error={error}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isDrawerOpen={isDrawerOpen}
            onCloseDrawer={() => setIsDrawerOpen(false)}
            editingCustomer={editingCustomer}
            formState={formState}
            onFormFieldChange={handleFormFieldChange}
            onOpenCreate={handleOpenCreate}
            onOpenEdit={handleOpenEdit}
            onSave={handleSave}
            isSaving={isSaving}
            saveError={saveError}
            onRefetch={() => void refetch()}
            onLookupPhone={handleLookupPhone}
        />
    );
};

export default CustomersPage;
