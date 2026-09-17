import React, { useState } from 'react';
import { Warehouse as WarehouseIcon, Plus, MapPin, Boxes, ArrowRightLeft, Save, Edit3, Search } from 'lucide-react';
import { SliderDrawer, FormField, inputClasses, selectClasses } from '@/shared';

interface WarehouseItem {
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

interface WarehouseFormData {
    code: string;
    name: string;
    type: WarehouseItem['type'];
    location: string;
    capacityTotal: string;
    manager: string;
    zonesCount: string;
    status: WarehouseItem['status'];
}

const emptyForm: WarehouseFormData = {
    code: '',
    name: '',
    type: 'Regional Hub',
    location: '',
    capacityTotal: '',
    manager: '',
    zonesCount: '',
    status: 'Optimal',
};

export const WarehousePage: React.FC = () => {
    const [warehouses, setWarehouses] = useState<WarehouseItem[]>(INITIAL_WAREHOUSES);
    const [searchQuery, setSearchQuery] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<WarehouseFormData>(emptyForm);

    const filtered = warehouses.filter(
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
            status: wh.status,
        });
        setDrawerOpen(true);
    };

    const handleSubmit = () => {
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
                              status: formData.status,
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
                    status: formData.status,
                },
            ]);
        }
        setDrawerOpen(false);
    };

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Central Warehouse & Storage Hubs
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Monitor storage bin capacity, inter-warehouse stock transfers, and zone managers.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer">
                        <ArrowRightLeft className="w-4 h-4" />
                        <span>Transfer Stock</span>
                    </button>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add Warehouse</span>
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="relative max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search warehouse by name, code or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#080d1a] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
            </div>

            {/* Storage Utilization Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {filtered.map((wh) => {
                    const usagePercent = Math.round((wh.capacityUsed / wh.capacityTotal) * 100);

                    return (
                        <div
                            key={wh.id}
                            className="bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl p-5 shadow-xs space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                                        <WarehouseIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                                            {wh.name}
                                        </h3>
                                        <span className="text-[10px] font-mono text-slate-400">{wh.code}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => openEdit(wh)}
                                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                            wh.status === 'Optimal'
                                                ? 'bg-emerald-500/10 text-emerald-600'
                                                : 'bg-amber-500/10 text-amber-600'
                                        }`}>
                                        {wh.status}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span className="truncate">{wh.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Boxes className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span>
                                        <strong>{wh.totalSKUs.toLocaleString()}</strong> Active SKUs •{' '}
                                        <strong>{wh.zonesCount}</strong> Storage Zones
                                    </span>
                                </div>
                            </div>

                            {/* Capacity Progress Bar */}
                            <div className="space-y-1.5 pt-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400 font-semibold">Capacity Usage</span>
                                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                                        {wh.capacityUsed.toLocaleString()} / {wh.capacityTotal.toLocaleString()} units ({usagePercent}%)
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${
                                            usagePercent > 80
                                                ? 'bg-amber-500'
                                                : usagePercent > 90
                                                ? 'bg-rose-500'
                                                : 'bg-emerald-500'
                                        }`}
                                        style={{ width: `${usagePercent}%` }}
                                    />
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
                                <span className="text-slate-400">
                                    Manager: <strong className="text-slate-700 dark:text-slate-200">{wh.manager}</strong>
                                </span>
                                <button
                                    onClick={() => openEdit(wh)}
                                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
                                >
                                    Zone Map →
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Slider Drawer for Create / Edit */}
            <SliderDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title={editingId ? 'Edit Warehouse' : 'Add New Warehouse'}
                subtitle={editingId ? `Editing: ${formData.name || 'Untitled'}` : 'Configure a new storage & distribution hub'}
                icon={<WarehouseIcon className="w-4 h-4" />}
                footer={
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setDrawerOpen(false)}
                            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!formData.name || !formData.code}
                            className="flex-[2] py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                            <Save className="w-3.5 h-3.5" />
                            <span>{editingId ? 'Update Warehouse' : 'Create Warehouse'}</span>
                        </button>
                    </div>
                }
            >
                <div className="space-y-5">
                    <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            Warehouse Details
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="Warehouse Code" required>
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="e.g. WH-SAVAR-01"
                                        value={formData.code}
                                        onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                                    />
                                </FormField>
                                <FormField label="Type" required>
                                    <select
                                        className={selectClasses}
                                        value={formData.type}
                                        onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value as WarehouseItem['type'] }))}
                                    >
                                        <option>Central Distribution</option>
                                        <option>Regional Hub</option>
                                        <option>Transit Hub</option>
                                    </select>
                                </FormField>
                            </div>

                            <FormField label="Warehouse Name" required>
                                <input
                                    type="text"
                                    className={inputClasses}
                                    placeholder="e.g. Central Mega Warehouse (Savar)"
                                    value={formData.name}
                                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                                />
                            </FormField>

                            <FormField label="Location / Address">
                                <input
                                    type="text"
                                    className={inputClasses}
                                    placeholder="e.g. Hemayetpur Industrial Zone, Savar"
                                    value={formData.location}
                                    onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                                />
                            </FormField>

                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="Status">
                                    <select
                                        className={selectClasses}
                                        value={formData.status}
                                        onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value as WarehouseItem['status'] }))}
                                    >
                                        <option>Optimal</option>
                                        <option>Near Capacity</option>
                                        <option>Maintenance</option>
                                    </select>
                                </FormField>
                                <FormField label="Manager Name">
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="e.g. Engr. Kamrul Islam"
                                        value={formData.manager}
                                        onChange={(e) => setFormData((p) => ({ ...p, manager: e.target.value }))}
                                    />
                                </FormField>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Capacity & Zones
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <FormField label="Total Capacity (units)">
                                <input
                                    type="number"
                                    className={inputClasses}
                                    placeholder="e.g. 100000"
                                    value={formData.capacityTotal}
                                    onChange={(e) => setFormData((p) => ({ ...p, capacityTotal: e.target.value }))}
                                />
                            </FormField>
                            <FormField label="Storage Zones">
                                <input
                                    type="number"
                                    className={inputClasses}
                                    placeholder="e.g. 16"
                                    value={formData.zonesCount}
                                    onChange={(e) => setFormData((p) => ({ ...p, zonesCount: e.target.value }))}
                                />
                            </FormField>
                        </div>
                    </div>
                </div>
            </SliderDrawer>
        </section>
    );
};
