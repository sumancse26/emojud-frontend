import React from 'react';
import {
    Store,
    Plus,
    MapPin,
    Phone,
    User,
    CheckCircle2,
    Search,
    Filter,
    Save,
    Edit3,
    ShoppingCart
} from 'lucide-react';
import { SliderDrawer, FormField, inputClasses, selectClasses } from '@/shared';
import PageHeader from '@/shared/components/PageHeader/PageHeader';

import type { ShopOutlet, ShopFormData } from '../ShopsPage';

export interface ShopPresenterProps {
    shops: ShopOutlet[];
    filteredShops: ShopOutlet[];
    totalStaff: number;
    totalCounters: number;
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onOpenCreate: () => void;
    onOpenEdit: (shop: ShopOutlet) => void;
    drawerOpen: boolean;
    onCloseDrawer: () => void;
    editingId: string | null;
    formData: ShopFormData;
    onFormFieldChange: <K extends keyof ShopFormData>(field: K, value: ShopFormData[K]) => void;
    onSubmit: (e?: React.FormEvent) => void;
}

export const ShopPresenter: React.FC<ShopPresenterProps> = (props) => {
    const {
        shops,
        filteredShops,
        totalStaff,
        totalCounters,
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
    } = props;
    return (
        <section className="space-y-6">
            <PageHeader>
                <PageHeader.Header>
                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                Shop & Outlet Configurations
                            </h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Configure physical store branches, POS counter terminals, and outlet managers.
                            </p>
                        </div>

                        <button
                            onClick={onOpenCreate}
                            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer self-start sm:self-auto">
                            <Plus className="w-4 h-4" />
                            <span>Add New Shop Outlet</span>
                        </button>
                    </div>
                </PageHeader.Header>
                <PageHeader.Body>
                    {/* Quick Metrics Bar */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                Total Outlets
                            </p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{shops.length}</p>
                        </div>
                        <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                Active POS Counters
                            </p>
                            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                                {totalCounters}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                Total Floor Staff
                            </p>
                            <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{totalStaff}</p>
                        </div>
                        <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                Operational Status
                            </p>
                            <div className="flex items-center gap-1.5 mt-1 text-emerald-600 font-bold text-sm">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>100% Online</span>
                            </div>
                        </div>
                    </div>
                </PageHeader.Body>
                <PageHeader.Bottom>
                    {/* Filters and Search */}
                    <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="relative w-full sm:w-80">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search outlet by name, code, or city..."
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-xl transition cursor-pointer">
                            <Filter className="w-3.5 h-3.5" />
                            <span>Filter Outlets</span>
                        </button>
                    </div>
                </PageHeader.Bottom>
            </PageHeader>

            {/* Outlets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredShops.map((shop) => (
                    <div
                        key={shop.id}
                        className="bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl p-5 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                                    <Store className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                                            {shop.name}
                                        </h3>
                                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                                            {shop.code}
                                        </span>
                                    </div>
                                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                        {shop.branchType}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => onOpenEdit(shop)}
                                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition">
                                    <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                    {shop.status}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 space-y-2 text-xs">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">
                                    {shop.address}, {shop.city}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="font-mono">{shop.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>
                                    Branch Manager:{' '}
                                    <strong className="text-slate-700 dark:text-slate-200">{shop.manager}</strong>
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
                            <span className="text-slate-400 font-medium">
                                <strong>{shop.countersCount}</strong> POS Terminals •{' '}
                                <strong>{shop.activeStaff}</strong> Staff
                            </span>
                            <button
                                onClick={() => onOpenEdit(shop)}
                                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer">
                                Manage Shop →
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Slider Drawer for Create / Edit */}
            <SliderDrawer isOpen={drawerOpen} onClose={onCloseDrawer}>
                <SliderDrawer.Header onClose={onCloseDrawer}>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                            <ShoppingCart className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                                {editingId ? 'Edit Shop Outlet' : 'Add New Shop'}
                            </h2>
                            <p className="text-[10px] text-slate-400">
                                {editingId
                                    ? `Editing: ${formData.name || 'Untitled'}`
                                    : 'Enter the details to create a new shop'}
                            </p>
                        </div>
                    </div>
                </SliderDrawer.Header>
                <SliderDrawer.Body>
                    <form id="shop-form" onSubmit={onSubmit} className="space-y-5">
                        {/* Basic Info */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Outlet Information
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <FormField label="Outlet Code" required>
                                        <input
                                            type="text"
                                            className={inputClasses}
                                            placeholder="e.g. OUTLET-005"
                                            value={formData.code}
                                            onChange={(e) => onFormFieldChange('code', e.target.value.toUpperCase())}
                                        />
                                    </FormField>
                                    <FormField label="Branch Type" required>
                                        <select
                                            className={selectClasses}
                                            value={formData.branchType}
                                            onChange={(e) =>
                                                onFormFieldChange(
                                                    'branchType',
                                                    e.target.value as ShopFormData['branchType']
                                                )
                                            }>
                                            <option>Flagship Outlet</option>
                                            <option>Branch Store</option>
                                            <option>Distribution Hub</option>
                                        </select>
                                    </FormField>
                                </div>

                                <FormField label="Outlet Name" required>
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="e.g. Dhanmondi Flagship Outlet"
                                        value={formData.name}
                                        onChange={(e) => onFormFieldChange('name', e.target.value)}
                                    />
                                </FormField>

                                <FormField label="Status">
                                    <select
                                        className={selectClasses}
                                        value={formData.status}
                                        onChange={(e) =>
                                            onFormFieldChange('status', e.target.value as ShopFormData['status'])
                                        }>
                                        <option>Active</option>
                                        <option>Under Maintenance</option>
                                    </select>
                                </FormField>
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                Location & Contact
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <FormField label="City" required>
                                        <input
                                            type="text"
                                            className={inputClasses}
                                            placeholder="e.g. Dhaka"
                                            value={formData.city}
                                            onChange={(e) => onFormFieldChange('city', e.target.value)}
                                        />
                                    </FormField>
                                    <FormField label="Phone">
                                        <input
                                            type="text"
                                            className={inputClasses}
                                            placeholder="+880 1XXX-XXXXXX"
                                            value={formData.phone}
                                            onChange={(e) => onFormFieldChange('phone', e.target.value)}
                                        />
                                    </FormField>
                                </div>
                                <FormField label="Full Address">
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="House/Plot, Road, Area"
                                        value={formData.address}
                                        onChange={(e) => onFormFieldChange('address', e.target.value)}
                                    />
                                </FormField>
                            </div>
                        </div>

                        {/* Operations */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                Operations
                            </h3>
                            <div className="space-y-4">
                                <FormField label="Branch Manager Name">
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="e.g. Tanvir Hossain"
                                        value={formData.manager}
                                        onChange={(e) => onFormFieldChange('manager', e.target.value)}
                                    />
                                </FormField>
                                <div className="grid grid-cols-2 gap-3">
                                    <FormField label="POS Counter Terminals">
                                        <input
                                            type="number"
                                            className={inputClasses}
                                            placeholder="e.g. 4"
                                            value={formData.countersCount}
                                            onChange={(e) => onFormFieldChange('countersCount', e.target.value)}
                                        />
                                    </FormField>
                                    <FormField label="Active Staff Count">
                                        <input
                                            type="number"
                                            className={inputClasses}
                                            placeholder="e.g. 12"
                                            value={formData.activeStaff}
                                            onChange={(e) => onFormFieldChange('activeStaff', e.target.value)}
                                        />
                                    </FormField>
                                </div>
                            </div>
                        </div>
                    </form>
                </SliderDrawer.Body>

                <SliderDrawer.Footer>
                    <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={onCloseDrawer}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="shop-form"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer">
                            <Save className="w-4 h-4" />
                            <span>{editingId ? 'Update Shop' : 'Create Shop'}</span>
                        </button>
                    </div>
                </SliderDrawer.Footer>
            </SliderDrawer>
        </section>
    );
};

export default ShopPresenter;
