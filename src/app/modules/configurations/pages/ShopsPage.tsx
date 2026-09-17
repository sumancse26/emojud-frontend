import React, { useState } from 'react';
import { Store, Plus, MapPin, Phone, User, CheckCircle2, Search, Filter, Save, Edit3 } from 'lucide-react';
import { SliderDrawer, FormField, inputClasses, selectClasses } from '@/shared';

interface ShopOutlet {
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

interface ShopFormData {
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
    status: 'Active',
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
            status: shop.status,
        });
        setDrawerOpen(true);
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.code) return;
        if (editingId) {
            setShops((prev) =>
                prev.map((s) =>
                    s.id === editingId
                        ? {
                              ...s,
                              ...formData,
                              countersCount: parseInt(formData.countersCount) || 0,
                              activeStaff: parseInt(formData.activeStaff) || 0,
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
                    activeStaff: parseInt(formData.activeStaff) || 0,
                },
            ]);
        }
        setDrawerOpen(false);
    };

    const totalStaff = shops.reduce((sum, s) => sum + s.activeStaff, 0);
    const totalCounters = shops.reduce((sum, s) => sum + s.countersCount, 0);

    return (
        <section className="space-y-6">
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
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer self-start sm:self-auto"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add New Shop Outlet</span>
                </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Outlets</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{shops.length}</p>
                </div>
                <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active POS Counters</p>
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{totalCounters}</p>
                </div>
                <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Floor Staff</p>
                    <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{totalStaff}</p>
                </div>
                <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Operational Status</p>
                    <div className="flex items-center gap-1.5 mt-1 text-emerald-600 font-bold text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>100% Online</span>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search outlet by name, code, or city..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                </div>
                <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-xl transition cursor-pointer">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Filter Outlets</span>
                </button>
            </div>

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
                                    onClick={() => openEdit(shop)}
                                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition"
                                >
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
                                <span className="truncate">{shop.address}, {shop.city}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="font-mono">{shop.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span>Branch Manager: <strong className="text-slate-700 dark:text-slate-200">{shop.manager}</strong></span>
                            </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
                            <span className="text-slate-400 font-medium">
                                <strong>{shop.countersCount}</strong> POS Terminals • <strong>{shop.activeStaff}</strong> Staff
                            </span>
                            <button
                                onClick={() => openEdit(shop)}
                                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                            >
                                Manage Shop →
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Slider Drawer for Create / Edit */}
            <SliderDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title={editingId ? 'Edit Shop Outlet' : 'Add New Shop Outlet'}
                subtitle={editingId ? `Editing: ${formData.name || 'Untitled'}` : 'Configure a new physical store location'}
                icon={<Store className="w-4 h-4" />}
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
                            <span>{editingId ? 'Update Shop' : 'Create Shop'}</span>
                        </button>
                    </div>
                }
            >
                <div className="space-y-5">
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
                                        onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                                    />
                                </FormField>
                                <FormField label="Branch Type" required>
                                    <select
                                        className={selectClasses}
                                        value={formData.branchType}
                                        onChange={(e) => setFormData((p) => ({ ...p, branchType: e.target.value as ShopFormData['branchType'] }))}
                                    >
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
                                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                                />
                            </FormField>

                            <FormField label="Status">
                                <select
                                    className={selectClasses}
                                    value={formData.status}
                                    onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value as ShopFormData['status'] }))}
                                >
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
                                        onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
                                    />
                                </FormField>
                                <FormField label="Phone">
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="+880 1XXX-XXXXXX"
                                        value={formData.phone}
                                        onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                                    />
                                </FormField>
                            </div>
                            <FormField label="Full Address">
                                <input
                                    type="text"
                                    className={inputClasses}
                                    placeholder="House/Plot, Road, Area"
                                    value={formData.address}
                                    onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
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
                                    onChange={(e) => setFormData((p) => ({ ...p, manager: e.target.value }))}
                                />
                            </FormField>
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="POS Counter Terminals">
                                    <input
                                        type="number"
                                        className={inputClasses}
                                        placeholder="e.g. 4"
                                        value={formData.countersCount}
                                        onChange={(e) => setFormData((p) => ({ ...p, countersCount: e.target.value }))}
                                    />
                                </FormField>
                                <FormField label="Active Staff Count">
                                    <input
                                        type="number"
                                        className={inputClasses}
                                        placeholder="e.g. 12"
                                        value={formData.activeStaff}
                                        onChange={(e) => setFormData((p) => ({ ...p, activeStaff: e.target.value }))}
                                    />
                                </FormField>
                            </div>
                        </div>
                    </div>
                </div>
            </SliderDrawer>
        </section>
    );
};
