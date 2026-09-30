import React, { useState } from 'react';
import { ShopPresenter } from './presenters/ShopPresenter';

export interface ShopOutlet {
    id: string;
    code: string;
    name: string;
    branchType: 'Flagship Outlet' | 'Branch Store' | 'Distribution Hub';
    city: string;
    address: string;
    phone: string;
    manager: string;
    countersCount: number;
    activeStaff: number;
    status: 'Active' | 'Under Maintenance';
}

export interface ShopFormData {
    code: string;
    name: string;
    branchType: 'Flagship Outlet' | 'Branch Store' | 'Distribution Hub';
    city: string;
    address: string;
    phone: string;
    manager: string;
    countersCount: string;
    activeStaff: string;
    status: 'Active' | 'Under Maintenance';
}

const INITIAL_SHOPS: ShopOutlet[] = [
    {
        id: '1',
        code: 'OUTLET-001',
        name: 'Dhanmondi Flagship Outlet',
        branchType: 'Flagship Outlet',
        city: 'Dhaka',
        address: 'House 42, Road 27, Dhanmondi',
        phone: '+880 1711-234567',
        manager: 'Tanvir Hossain',
        countersCount: 4,
        activeStaff: 12,
        status: 'Active'
    },
    {
        id: '2',
        code: 'OUTLET-002',
        name: 'Gulshan Premium Outlet',
        branchType: 'Branch Store',
        city: 'Dhaka',
        address: 'Plot 12, Avenue 3, Gulshan-1',
        phone: '+880 1819-876543',
        manager: 'Nusrat Jahan',
        countersCount: 3,
        activeStaff: 8,
        status: 'Active'
    },
    {
        id: '3',
        code: 'OUTLET-003',
        name: 'Uttara Mega Store',
        branchType: 'Branch Store',
        city: 'Dhaka',
        address: 'Sector 7, Rabindra Sarani, Uttara',
        phone: '+880 1912-334455',
        manager: 'Arif Ahmed',
        countersCount: 3,
        activeStaff: 9,
        status: 'Active'
    },
    {
        id: '4',
        code: 'OUTLET-004',
        name: 'Chittagong GEC Outlet',
        branchType: 'Branch Store',
        city: 'Chittagong',
        address: 'CDA Avenue, GEC Circle',
        phone: '+880 1611-998877',
        manager: 'Mahmudul Hasan',
        countersCount: 2,
        activeStaff: 6,
        status: 'Active'
    }
];

const emptyShopForm: ShopFormData = {
    code: '',
    name: '',
    branchType: 'Branch Store',
    city: '',
    address: '',
    phone: '',
    manager: '',
    countersCount: '',
    activeStaff: '',
    status: 'Active'
};

export const ShopsPage: React.FC = () => {
    const [shops, setShops] = useState<ShopOutlet[]>(INITIAL_SHOPS);
    const [searchQuery, setSearchQuery] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<ShopFormData>(emptyShopForm);

    const filteredShops = shops.filter(
        (shop) =>
            shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            shop.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            shop.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openCreate = () => {
        setEditingId(null);
        setFormData(emptyShopForm);
        setDrawerOpen(true);
    };

    const openEdit = (shop: ShopOutlet) => {
        setEditingId(shop.id);
        setFormData({
            code: shop.code,
            name: shop.name,
            branchType: shop.branchType,
            city: shop.city,
            address: shop.address,
            phone: shop.phone,
            manager: shop.manager,
            countersCount: String(shop.countersCount),
            activeStaff: String(shop.activeStaff),
            status: shop.status
        });
        setDrawerOpen(true);
    };

    const handleFormFieldChange = <K extends keyof ShopFormData>(field: K, value: ShopFormData[K]) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!formData.name || !formData.code) return;
        if (editingId) {
            setShops((prev) =>
                prev.map((s) =>
                    s.id === editingId
                        ? {
                              ...s,
                              ...formData,
                              countersCount: parseInt(formData.countersCount) || 0,
                              activeStaff: parseInt(formData.activeStaff) || 0
                          }
                        : s
                )
            );
        } else {
            setShops((prev) => [
                ...prev,
                {
                    id: String(Date.now()),
                    ...formData,
                    countersCount: parseInt(formData.countersCount) || 0,
                    activeStaff: parseInt(formData.activeStaff) || 0
                }
            ]);
        }
        setDrawerOpen(false);
    };

    const totalStaff = shops.reduce((sum, s) => sum + s.activeStaff, 0);
    const totalCounters = shops.reduce((sum, s) => sum + s.countersCount, 0);

    return (
        <ShopPresenter
            shops={shops}
            filteredShops={filteredShops}
            totalStaff={totalStaff}
            totalCounters={totalCounters}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenCreate={openCreate}
            onOpenEdit={openEdit}
            drawerOpen={drawerOpen}
            onCloseDrawer={() => setDrawerOpen(false)}
            editingId={editingId}
            formData={formData}
            onFormFieldChange={handleFormFieldChange}
            onSubmit={handleSubmit}
        />
    );
};

export default ShopsPage;
