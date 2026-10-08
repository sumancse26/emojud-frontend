import React, { useState, useMemo } from 'react';
import { useWarehouse } from '../hooks/useWarehouse';
import { useShop } from '../hooks/useShop';
import { WarehousePresenter } from './presenters/WarehousePresenter';
import { tokenStorage } from '@/shared/services/tokenStorage';
import { useToast } from '@/shared/components/Toast';
import type { User } from '@/app/modules/auth/types/auth.types';
import type { WarehouseItem, CreateUpdateWarehousePayload } from '../types/warehouse.types';

const getDefaultWarehouseFormData = (
    companyId: number = 1,
    defaultShopId: string | number = '',
    userId: number = 1
): CreateUpdateWarehousePayload => ({
    id: null,
    shop_id: defaultShopId,
    warehouse_name: '',
    company_id: companyId,
    address: '',
    created_by: userId
});

export const WarehousePage: React.FC = () => {
    const user = tokenStorage.getUser<User>();
    const userCompanyId = Number(user?.branchId ?? 1);
    const userId = Number(user?.id ?? 1);

    const {
        warehouses,
        isLoading,
        isError,
        error,
        createOrUpdateWarehouse,
        isSaving,
        saveError,
        refetch
    } = useWarehouse();

    const { shops } = useShop();

    const [searchQuery, setSearchQuery] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingWarehouse, setEditingWarehouse] = useState<WarehouseItem | null>(null);
    const [formData, setFormData] = useState<CreateUpdateWarehousePayload>(() =>
        getDefaultWarehouseFormData(userCompanyId, shops[0]?.id ?? '', userId)
    );

    const filteredWarehouses = useMemo(() => {
        if (!searchQuery.trim()) return warehouses;
        const q = searchQuery.toLowerCase();
        return warehouses.filter(
            (wh) =>
                wh.warehouse_name?.toLowerCase().includes(q) ||
                wh.address?.toLowerCase().includes(q) ||
                wh.shop?.shop_name?.toLowerCase().includes(q) ||
                wh.shop?.display_code?.toLowerCase().includes(q)
        );
    }, [warehouses, searchQuery]);

    const openCreate = () => {
        setEditingWarehouse(null);
        setFormData(getDefaultWarehouseFormData(userCompanyId, shops[0]?.id ?? '', userId));
        setDrawerOpen(true);
    };

    const openEdit = (wh: WarehouseItem) => {
        setEditingWarehouse(wh);
        setFormData({
            id: wh.id,
            shop_id: wh.shop_id,
            warehouse_name: wh.warehouse_name ?? '',
            company_id: Number(wh.company_id ?? userCompanyId),
            address: wh.address ?? '',
            created_by: Number(wh.created_by ?? userId)
        });
        setDrawerOpen(true);
    };

    const handleFormFieldChange = <K extends keyof CreateUpdateWarehousePayload>(
        field: K,
        value: CreateUpdateWarehousePayload[K]
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const toast = useToast();

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!formData.warehouse_name?.trim()) {
            toast.warning('Warehouse name is required.');
            return;
        }
        if (!formData.shop_id) {
            toast.warning('Please select an associated shop outlet.');
            return;
        }

        const isUpdating = Boolean(editingWarehouse);

        try {
            await createOrUpdateWarehouse({
                ...formData,
                shop_id: Number(formData.shop_id),
                company_id: Number(formData.company_id || userCompanyId),
                created_by: Number(formData.created_by || userId)
            });
            toast.success(
                isUpdating
                    ? `Warehouse "${formData.warehouse_name}" updated successfully!`
                    : `Warehouse "${formData.warehouse_name}" created successfully!`
            );
            setDrawerOpen(false);
            setEditingWarehouse(null);
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to save warehouse. Please try again.';
            toast.error(errorMsg);
            console.error('Failed to create/update warehouse:', err);
        }
    };

    return (
        <WarehousePresenter
            warehouses={warehouses}
            filteredWarehouses={filteredWarehouses}
            shops={shops}
            isLoading={isLoading}
            isError={isError}
            error={error}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenCreate={openCreate}
            onOpenEdit={openEdit}
            drawerOpen={drawerOpen}
            onCloseDrawer={() => setDrawerOpen(false)}
            editingId={editingWarehouse ? String(editingWarehouse.id) : null}
            formData={formData}
            onFormFieldChange={handleFormFieldChange}
            onSubmit={handleSubmit}
            isSaving={isSaving}
            saveError={saveError}
            onRefetch={() => refetch()}
        />
    );
};

export default WarehousePage;
