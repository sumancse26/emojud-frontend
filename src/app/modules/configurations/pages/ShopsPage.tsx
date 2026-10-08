import React, { useState, useMemo } from 'react';
import { useShop } from '../hooks/useShop';
import { ShopPresenter } from './presenters/ShopPresenter';
import { tokenStorage } from '@/shared/services/tokenStorage';
import type { User } from '@/app/modules/auth/types/auth.types';
import type { ShopItem, CreateUpdateShopPayload } from '../types/shop.types';

const getDefaultShopFormData = (companyId: number = 1): CreateUpdateShopPayload => ({
    company_id: companyId,
    display_code: '',
    short_code: '',
    shop_name: '',
    address: '',
    address_2: '',
    phone: '',
    image: null,
    slogan: '',
    status: 1
});

export const ShopsPage: React.FC = () => {
    const user = tokenStorage.getUser<User>();
    const userCompanyId = Number(user?.branchId ?? 1);

    const {
        shops,
        isLoading,
        isError,
        error,
        createOrUpdateShop,
        isSaving,
        saveError,
        refetch
    } = useShop();

    const [searchQuery, setSearchQuery] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingShop, setEditingShop] = useState<ShopItem | null>(null);
    const [formData, setFormData] = useState<CreateUpdateShopPayload>(() =>
        getDefaultShopFormData(userCompanyId)
    );

    const filteredShops = useMemo(() => {
        if (!searchQuery.trim()) return shops;
        const q = searchQuery.toLowerCase();
        return shops.filter(
            (shop) =>
                shop.shop_name?.toLowerCase().includes(q) ||
                shop.display_code?.toLowerCase().includes(q) ||
                shop.short_code?.toLowerCase().includes(q) ||
                shop.phone?.toLowerCase().includes(q) ||
                shop.address?.toLowerCase().includes(q) ||
                shop.address_2?.toLowerCase().includes(q) ||
                shop.slogan?.toLowerCase().includes(q)
        );
    }, [shops, searchQuery]);

    const openCreate = () => {
        setEditingShop(null);
        setFormData(getDefaultShopFormData(userCompanyId));
        setDrawerOpen(true);
    };

    const openEdit = (shop: ShopItem) => {
        setEditingShop(shop);
        setFormData({
            id: shop.id,
            company_id: Number(shop.company_id ?? userCompanyId),
            display_code: shop.display_code ?? '',
            short_code: shop.short_code ?? '',
            shop_name: shop.shop_name ?? '',
            address: shop.address ?? '',
            address_2: shop.address_2 ?? '',
            phone: shop.phone ?? '',
            image: shop.image ?? null,
            slogan: shop.slogan ?? '',
            status: shop.status !== undefined ? Number(shop.status) : 1
        });
        setDrawerOpen(true);
    };

    const handleFormFieldChange = <K extends keyof CreateUpdateShopPayload>(
        field: K,
        value: CreateUpdateShopPayload[K]
    ) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!formData.shop_name?.trim()) return;

        try {
            await createOrUpdateShop({
                ...formData,
                company_id: Number(formData.company_id || userCompanyId),
                status: Number(formData.status ?? 1)
            });
            setDrawerOpen(false);
            setEditingShop(null);
        } catch (err) {
            console.error('Failed to create/update shop:', err);
        }
    };

    return (
        <ShopPresenter
            shops={shops}
            filteredShops={filteredShops}
            isLoading={isLoading}
            isError={isError}
            error={error}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenCreate={openCreate}
            onOpenEdit={openEdit}
            drawerOpen={drawerOpen}
            onCloseDrawer={() => setDrawerOpen(false)}
            editingId={editingShop ? String(editingShop.id) : null}
            formData={formData}
            onFormFieldChange={handleFormFieldChange}
            onSubmit={handleSubmit}
            isSaving={isSaving}
            saveError={saveError}
            onRefetch={() => refetch()}
        />
    );
};

export default ShopsPage;
