import React, { useState } from 'react';
import { WarehousePresenter } from './presenters/WarehousePresenter';

export interface WarehouseItem {
    id: string;
    code: string;
    name: string;
    type: 'Central Distribution' | 'Regional Hub' | 'Transit Hub';
    location: string;
    capacityTotal: number;
    capacityUsed: number;
    manager: string;
    zonesCount: number;
    totalSKUs: number;
    status: 'Optimal' | 'Near Capacity' | 'Maintenance';
}

export interface WarehouseFormData {
    code: string;
    name: string;
    type: WarehouseItem['type'];
    location: string;
    capacityTotal: string;
    manager: string;
    zonesCount: string;
    status: WarehouseItem['status'];
}

const INITIAL_WAREHOUSES: WarehouseItem[] = [
    {
        id: '1',
        code: 'WH-SAVAR-01',
        name: 'Central Mega Warehouse (Savar)',
        type: 'Central Distribution',
        location: 'Hemayetpur Industrial Zone, Savar',
        capacityTotal: 100000,
        capacityUsed: 72400,
        manager: 'Engr. Kamrul Islam',
        zonesCount: 16,
        totalSKUs: 3420,
        status: 'Optimal'
    },
    {
        id: '2',
        code: 'WH-CTG-02',
        name: 'Chittagong Port Logistics Hub',
        type: 'Regional Hub',
        location: 'Agrabad Access Road, Chittagong',
        capacityTotal: 50000,
        capacityUsed: 44100,
        manager: 'Sazzad Hossain',
        zonesCount: 8,
        totalSKUs: 1890,
        status: 'Near Capacity'
    },
    {
        id: '3',
        code: 'WH-BOGRA-03',
        name: 'North Bengal Transit Depot',
        type: 'Transit Hub',
        location: 'Bogra Bypass Highway, Bogra',
        capacityTotal: 30000,
        capacityUsed: 12500,
        manager: 'Mizanur Rahman',
        zonesCount: 6,
        totalSKUs: 940,
        status: 'Optimal'
    }
];

const emptyForm: WarehouseFormData = {
    code: '',
    name: '',
    type: 'Regional Hub',
    location: '',
    capacityTotal: '',
    manager: '',
    zonesCount: '',
    status: 'Optimal'
};

export const WarehousePage: React.FC = () => {
    const [warehouses, setWarehouses] = useState<WarehouseItem[]>(INITIAL_WAREHOUSES);
    const [searchQuery, setSearchQuery] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<WarehouseFormData>(emptyForm);

    const filteredWarehouses = warehouses.filter(
        (wh) =>
            wh.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            wh.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            wh.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openCreate = () => {
        setEditingId(null);
        setFormData(emptyForm);
        setDrawerOpen(true);
    };

    const openEdit = (wh: WarehouseItem) => {
        setEditingId(wh.id);
        setFormData({
            code: wh.code,
            name: wh.name,
            type: wh.type,
            location: wh.location,
            capacityTotal: String(wh.capacityTotal),
            manager: wh.manager,
            zonesCount: String(wh.zonesCount),
            status: wh.status
        });
        setDrawerOpen(true);
    };

    const handleFormFieldChange = <K extends keyof WarehouseFormData>(field: K, value: WarehouseFormData[K]) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!formData.name || !formData.code) return;

        if (editingId) {
            setWarehouses((prev) =>
                prev.map((w) =>
                    w.id === editingId
                        ? {
                              ...w,
                              code: formData.code,
                              name: formData.name,
                              type: formData.type,
                              location: formData.location,
                              capacityTotal: parseInt(formData.capacityTotal) || 0,
                              manager: formData.manager,
                              zonesCount: parseInt(formData.zonesCount) || 0,
                              status: formData.status
                          }
                        : w
                )
            );
        } else {
            setWarehouses((prev) => [
                ...prev,
                {
                    id: String(Date.now()),
                    code: formData.code,
                    name: formData.name,
                    type: formData.type,
                    location: formData.location,
                    capacityTotal: parseInt(formData.capacityTotal) || 0,
                    capacityUsed: 0,
                    manager: formData.manager,
                    zonesCount: parseInt(formData.zonesCount) || 0,
                    totalSKUs: 0,
                    status: formData.status
                }
            ]);
        }
        setDrawerOpen(false);
    };

    return (
        <WarehousePresenter
            warehouses={warehouses}
            filteredWarehouses={filteredWarehouses}
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

export default WarehousePage;
