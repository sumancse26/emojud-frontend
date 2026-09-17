import React, { useState } from 'react';
import { Plus, Search, Edit3, Trash2, Save } from 'lucide-react';
import { SliderDrawer, FormField, inputClasses } from '@/shared';

interface Supplier {
    id: string;
    code: string;
    companyName: string;
    contactPerson: string;
    category: string;
    phone: string;
    email: string;
    address: string;
    totalPurchases: number;
    payableDue: number;
    paymentTerms: string;
    status: 'Active' | 'Under Review';
}

const INITIAL_SUPPLIERS: Supplier[] = [
    {
        id: '1',
        code: 'SUP-701',
        companyName: 'Apex Textiles & Fabrics Ltd.',
        contactPerson: 'Mohammad Faruk',
        category: 'Apparel & Cotton',
        phone: '+880 1711-889900',
        email: 'faruk@apextextiles.com',
        address: 'Tejgaon I/A, Dhaka',
        totalPurchases: 1850000,
        payableDue: 245000,
        paymentTerms: 'Net 30 Days',
        status: 'Active'
    },
    {
        id: '2',
        code: 'SUP-702',
        companyName: 'Bengal Leather Crafts Ind.',
        contactPerson: 'Zakir Hossain',
        category: 'Footwear & Leather',
        phone: '+880 1819-223344',
        email: 'supply@bengalleather.com',
        address: 'Hazaribagh, Dhaka',
        totalPurchases: 940000,
        payableDue: 85000,
        paymentTerms: 'Net 15 Days',
        status: 'Active'
    },
    {
        id: '3',
        code: 'SUP-703',
        companyName: 'Silk & Thread Global Imports',
        contactPerson: 'Nayeem Ashraf',
        category: 'Fashion Accessories',
        phone: '+880 1912-556677',
        email: 'nayeem@silkthread.com',
        address: 'Agrabad C/A, Chittagong',
        totalPurchases: 620000,
        payableDue: 0,
        paymentTerms: 'Advance LC',
        status: 'Active'
    },
    {
        id: '4',
        code: 'SUP-704',
        companyName: 'Royal Fragrance & Oils Ltd.',
        contactPerson: 'Imtiaz Ahmed',
        category: 'Perfumes & Cosmetics',
        phone: '+880 1611-112233',
        email: 'sales@royalfragrance.com',
        address: 'Savar EPZ Road, Dhaka',
        totalPurchases: 410000,
        payableDue: 62000,
        paymentTerms: 'Cash On Delivery',
        status: 'Active'
    }
];

export const SuppliersPage: React.FC = () => {
    const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

    const [formState, setFormState] = useState({
        code: '',
        companyName: '',
        contactPerson: '',
        category: 'Apparel & Cotton',
        phone: '',
        email: '',
        address: '',
        payableDue: 0,
        paymentTerms: 'Net 30 Days',
        status: 'Active' as 'Active' | 'Under Review'
    });

    const handleOpenCreate = () => {
        setEditingSupplier(null);
        setFormState({
            code: `SUP-${Math.floor(700 + Math.random() * 100)}`,
            companyName: '',
            contactPerson: '',
            category: 'Apparel & Cotton',
            phone: '+880 ',
            email: '',
            address: '',
            payableDue: 0,
            paymentTerms: 'Net 30 Days',
            status: 'Active'
        });
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (sup: Supplier) => {
        setEditingSupplier(sup);
        setFormState({
            code: sup.code,
            companyName: sup.companyName,
            contactPerson: sup.contactPerson,
            category: sup.category,
            phone: sup.phone,
            email: sup.email,
            address: sup.address,
            payableDue: sup.payableDue,
            paymentTerms: sup.paymentTerms,
            status: sup.status
        });
        setIsDrawerOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSupplier) {
            setSuppliers((prev) =>
                prev.map((s) => (s.id === editingSupplier.id ? { ...s, ...formState } : s))
            );
        } else {
            const newSup: Supplier = {
                id: Date.now().toString(),
                ...formState,
                totalPurchases: 0
            };
            setSuppliers((prev) => [newSup, ...prev]);
        }
        setIsDrawerOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this supplier?')) {
            setSuppliers((prev) => prev.filter((s) => s.id !== id));
        }
    };

    const filtered = suppliers.filter(
        (s) =>
            s.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPayable = suppliers.reduce((acc, s) => acc + s.payableDue, 0);

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Suppliers & Vendor Master Records
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Track supplier ledgers, credit terms, trade volumes, and payable dues.
                    </p>
                </div>

                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer self-start sm:self-auto">
                    <Plus className="w-4 h-4" />
                    <span>Register New Supplier</span>
                </button>
            </div>

            {/* Metric summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Suppliers</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{suppliers.length}</p>
                </div>
                <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Purchases</p>
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">৳ 38.2L</p>
                </div>
                <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Payable Due</p>
                    <p className="text-2xl font-black text-rose-500 mt-1 font-mono">৳ {totalPayable.toLocaleString('en-BD')}</p>
                </div>
                <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Contracts</p>
                    <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">100%</p>
                </div>
            </div>

            {/* Search Filter */}
            <div className="relative max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search vendor by company, code or contact person..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#080d1a] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/80 dark:bg-slate-900/40 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80 text-[11px]">
                            <tr>
                                <th className="px-5 py-3">Supplier Company & Code</th>
                                <th className="px-4 py-3">Contact Person</th>
                                <th className="px-4 py-3">Merchandise Category</th>
                                <th className="px-4 py-3 text-right">Total Trade Volume</th>
                                <th className="px-4 py-3 text-right">Payable Due (৳)</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {filtered.map((s) => (
                                <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                                    <td className="px-5 py-3.5">
                                        <p className="font-bold text-slate-900 dark:text-white">{s.companyName}</p>
                                        <p className="text-[10px] text-slate-400 font-mono">{s.code} • {s.address}</p>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <p className="font-semibold text-slate-800 dark:text-slate-200">{s.contactPerson}</p>
                                        <p className="text-[11px] text-slate-400 font-mono">{s.phone}</p>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                            {s.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                                        ৳ {s.totalPurchases.toLocaleString('en-BD')}
                                    </td>
                                    <td className={`px-4 py-3.5 text-right font-mono font-bold ${
                                        s.payableDue > 0 ? 'text-rose-500' : 'text-slate-400'
                                    }`}>
                                        ৳ {s.payableDue.toLocaleString('en-BD')}
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                onClick={() => handleOpenEdit(s)}
                                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                                title="Edit Supplier">
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(s.id)}
                                                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
                                                title="Delete Supplier">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Slider Drawer */}
            <SliderDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title={editingSupplier ? 'Edit Vendor Record' : 'Register New Vendor'}
                subtitle="Configure vendor commercial terms, contact, and trade category"
                width="max-w-lg">
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Supplier Code" required>
                            <input
                                type="text"
                                value={formState.code}
                                onChange={(e) => setFormState({ ...formState, code: e.target.value })}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                        <FormField label="Status">
                            <select
                                value={formState.status}
                                onChange={(e) => setFormState({ ...formState, status: e.target.value as 'Active' | 'Under Review' })}
                                className={inputClasses}>
                                <option value="Active">Active</option>
                                <option value="Under Review">Under Review</option>
                            </select>
                        </FormField>
                    </div>

                    <FormField label="Supplier / Company Name" required>
                        <input
                            type="text"
                            placeholder="e.g. Apex Textiles Ltd."
                            value={formState.companyName}
                            onChange={(e) => setFormState({ ...formState, companyName: e.target.value })}
                            className={inputClasses}
                            required
                        />
                    </FormField>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Contact Representative" required>
                            <input
                                type="text"
                                placeholder="e.g. Faruk Hossain"
                                value={formState.contactPerson}
                                onChange={(e) => setFormState({ ...formState, contactPerson: e.target.value })}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                        <FormField label="Product Category" required>
                            <select
                                value={formState.category}
                                onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                                className={inputClasses}>
                                <option value="Apparel & Cotton">Apparel & Cotton</option>
                                <option value="Footwear & Leather">Footwear & Leather</option>
                                <option value="Fashion Accessories">Fashion Accessories</option>
                                <option value="Perfumes & Cosmetics">Perfumes & Cosmetics</option>
                                <option value="Packaging Materials">Packaging Materials</option>
                            </select>
                        </FormField>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Phone Number" required>
                            <input
                                type="text"
                                placeholder="+880 1711-xxxxxx"
                                value={formState.phone}
                                onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                        <FormField label="Email Address">
                            <input
                                type="email"
                                placeholder="vendor@domain.com"
                                value={formState.email}
                                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                className={inputClasses}
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Payment Terms">
                            <select
                                value={formState.paymentTerms}
                                onChange={(e) => setFormState({ ...formState, paymentTerms: e.target.value })}
                                className={inputClasses}>
                                <option value="Net 30 Days">Net 30 Days</option>
                                <option value="Net 15 Days">Net 15 Days</option>
                                <option value="Cash On Delivery">Cash On Delivery</option>
                                <option value="Advance LC">Advance LC</option>
                            </select>
                        </FormField>
                        <FormField label="Opening Payable Due (৳)">
                            <input
                                type="number"
                                min="0"
                                value={formState.payableDue}
                                onChange={(e) => setFormState({ ...formState, payableDue: Number(e.target.value) })}
                                className={inputClasses}
                            />
                        </FormField>
                    </div>

                    <FormField label="Office / Factory Address">
                        <textarea
                            rows={2}
                            placeholder="Plot, Road, Area, City..."
                            value={formState.address}
                            onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                            className={inputClasses}
                        />
                    </FormField>

                    <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={() => setIsDrawerOpen(false)}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer">
                            <Save className="w-4 h-4" />
                            <span>{editingSupplier ? 'Update Vendor' : 'Save Vendor'}</span>
                        </button>
                    </div>
                </form>
            </SliderDrawer>
        </section>
    );
};
