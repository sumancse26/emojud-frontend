import React from 'react';
import { Warehouse as WarehouseIcon, Plus, MapPin, Boxes, ArrowRightLeft, Save, Edit3, Search } from 'lucide-react';
import { SliderDrawer, FormField, inputClasses, selectClasses, PageHeader } from '@/shared';
import type { WarehouseItem, WarehouseFormData } from '../WarehousePage';

export interface WarehousePresenterProps {
    warehouses: WarehouseItem[];
    filteredWarehouses: WarehouseItem[];
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onOpenCreate: () => void;
    onOpenEdit: (wh: WarehouseItem) => void;
    drawerOpen: boolean;
    onCloseDrawer: () => void;
    editingId: string | null;
    formData: WarehouseFormData;
    onFormFieldChange: <K extends keyof WarehouseFormData>(field: K, value: WarehouseFormData[K]) => void;
    onSubmit: (e?: React.FormEvent) => void;
}

export const WarehousePresenter: React.FC<WarehousePresenterProps> = ({
    filteredWarehouses,
    searchQuery,
    onSearchChange,
    onOpenCreate,
    onOpenEdit,
    drawerOpen,
    onCloseDrawer,
    editingId,
    formData,
    onFormFieldChange,
    onSubmit
}) => {
    return (
        <section className="space-y-6">
            <PageHeader>
                <PageHeader.Header
                    title="Central Warehouse & Storage Hubs"
                    description="Monitor storage bin capacity, inter-warehouse stock transfers, and zone managers."
                    actions={
                        <div className="flex items-center gap-2.5">
                            <button className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer">
                                <ArrowRightLeft className="w-4 h-4" />
                                <span>Transfer Stock</span>
                            </button>
                            <button
                                onClick={onOpenCreate}
                                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer">
                                <Plus className="w-4 h-4" />
                                <span>Add Warehouse</span>
                            </button>
                        </div>
                    }
                />

                <PageHeader.Bottom>
                    <div className="relative max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search warehouse by name, code or location..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/50 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium transition"
                        />
                    </div>
                </PageHeader.Bottom>
            </PageHeader>


            {/* Storage Utilization Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {filteredWarehouses.map((wh) => {
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
                                        onClick={() => onOpenEdit(wh)}
                                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition">
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
                                        {wh.capacityUsed.toLocaleString()} / {wh.capacityTotal.toLocaleString()} units (
                                        {usagePercent}%)
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
                                    Manager:{' '}
                                    <strong className="text-slate-700 dark:text-slate-200">{wh.manager}</strong>
                                </span>
                                <button
                                    onClick={() => onOpenEdit(wh)}
                                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer">
                                    Zone Map →
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Slider Drawer for Create / Edit */}
            <SliderDrawer isOpen={drawerOpen} onClose={onCloseDrawer}>
                <SliderDrawer.Header>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                            <WarehouseIcon className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                                {editingId ? 'Edit Warehouse' : 'Add New Warehouse'}
                            </h2>
                            <p className="text-[10px] text-slate-400">
                                {editingId
                                    ? `Editing: ${formData.name || 'Untitled'}`
                                    : 'Enter the details to create a new Warehouse'}
                            </p>
                        </div>
                    </div>
                </SliderDrawer.Header>
                <SliderDrawer.Body>
                    <form className="space-y-5" onSubmit={onSubmit}>
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
                                            onChange={(e) =>
                                                onFormFieldChange('code', e.target.value.toUpperCase())
                                            }
                                        />
                                    </FormField>
                                    <FormField label="Type" required>
                                        <select
                                            className={selectClasses}
                                            value={formData.type}
                                            onChange={(e) =>
                                                onFormFieldChange('type', e.target.value as WarehouseItem['type'])
                                            }>
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
                                        onChange={(e) => onFormFieldChange('name', e.target.value)}
                                    />
                                </FormField>

                                <FormField label="Location / Address">
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="e.g. Hemayetpur Industrial Zone, Savar"
                                        value={formData.location}
                                        onChange={(e) => onFormFieldChange('location', e.target.value)}
                                    />
                                </FormField>

                                <div className="grid grid-cols-2 gap-3">
                                    <FormField label="Status">
                                        <select
                                            className={selectClasses}
                                            value={formData.status}
                                            onChange={(e) =>
                                                onFormFieldChange('status', e.target.value as WarehouseItem['status'])
                                            }>
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
                                            onChange={(e) => onFormFieldChange('manager', e.target.value)}
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
                                        onChange={(e) => onFormFieldChange('capacityTotal', e.target.value)}
                                    />
                                </FormField>
                                <FormField label="Storage Zones">
                                    <input
                                        type="number"
                                        className={inputClasses}
                                        placeholder="e.g. 16"
                                        value={formData.zonesCount}
                                        onChange={(e) => onFormFieldChange('zonesCount', e.target.value)}
                                    />
                                </FormField>
                            </div>
                        </div>
                    </form>
                </SliderDrawer.Body>
                <SliderDrawer.Footer>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onCloseDrawer}
                            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => onSubmit()}
                            className="flex-[2] py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition cursor-pointer">
                            <Save className="w-3.5 h-3.5" />
                            <span>{editingId ? 'Update Warehouse' : 'Create Warehouse'}</span>
                        </button>
                    </div>
                </SliderDrawer.Footer>
            </SliderDrawer>
        </section>
    );
};

export default WarehousePresenter;
