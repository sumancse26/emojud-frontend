import React, { useState } from 'react';
import { UserPlus, Search, Edit3, Trash2, Save } from 'lucide-react';
import { SliderDrawer, FormField, inputClasses } from '@/shared';

interface Customer {
    id: string;
    code: string;
    name: string;
    initials: string;
    phone: string;
    email: string;
    address: string;
    creditLimit: number;
    totalOrders: number;
    dueAmount: number;
    badgeColor: string;
    status: 'Active' | 'Blocked';
}

const INITIAL_CUSTOMERS: Customer[] = [
    {
        id: '1',
        code: 'CUST-8021',
        name: 'Rahim Chowdhury',
        initials: 'RC',
        phone: '+880 1712-345678',
        email: 'rahim.c@gmail.com',
        address: 'Road 27, Dhanmondi, Dhaka',
        creditLimit: 50000,
        totalOrders: 14,
        dueAmount: 0.0,
        badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        status: 'Active'
    },
    {
        id: '2',
        code: 'CUST-8022',
        name: 'Farhana Yasmin',
        initials: 'FY',
        phone: '+880 1911-889900',
        email: 'farhana.y@yahoo.com',
        address: 'Gulshan-1, Dhaka',
        creditLimit: 25000,
        totalOrders: 8,
        dueAmount: 4400.0,
        badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        status: 'Active'
    },
    {
        id: '3',
        code: 'CUST-8023',
        name: 'Mahbubur Rahman',
        initials: 'MR',
        phone: '+880 1819-776655',
        email: 'mahbub.r@gmail.com',
        address: 'Sector 4, Uttara, Dhaka',
        creditLimit: 40000,
        totalOrders: 21,
        dueAmount: 12500.0,
        badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
        status: 'Active'
    },
    {
        id: '4',
        code: 'CUST-8024',
        name: 'Anika Tabassum',
        initials: 'AT',
        phone: '+880 1612-443322',
        email: 'anika.t@outlook.com',
        address: 'Banani Block C, Dhaka',
        creditLimit: 30000,
        totalOrders: 5,
        dueAmount: 0.0,
        badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
        status: 'Active'
    }
];

export const CustomersPage: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

    const [formState, setFormState] = useState({
        code: '',
        name: '',
        phone: '',
        email: '',
        address: '',
        creditLimit: 20000,
        dueAmount: 0,
        status: 'Active' as 'Active' | 'Blocked'
    });

    const getInitials = (name: string) => {
        const parts = name.trim().split(' ');
        if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        return (name.substring(0, 2) || 'CU').toUpperCase();
    };

    const handleOpenCreate = () => {
        setEditingCustomer(null);
        setFormState({
            code: `CUST-${Math.floor(8000 + Math.random() * 1000)}`,
            name: '',
            phone: '+880 ',
            email: '',
            address: '',
            creditLimit: 20000,
            dueAmount: 0,
            status: 'Active'
        });
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (cust: Customer) => {
        setEditingCustomer(cust);
        setFormState({
            code: cust.code,
            name: cust.name,
            phone: cust.phone,
            email: cust.email,
            address: cust.address,
            creditLimit: cust.creditLimit,
            dueAmount: cust.dueAmount,
            status: cust.status
        });
        setIsDrawerOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCustomer) {
            setCustomers((prev) =>
                prev.map((c) =>
                    c.id === editingCustomer.id
                        ? {
                              ...c,
                              ...formState,
                              initials: getInitials(formState.name)
                          }
                        : c
                )
            );
        } else {
            const colors = [
                'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                'bg-blue-500/10 text-blue-600 dark:text-blue-400',
                'bg-amber-500/10 text-amber-600 dark:text-amber-400',
                'bg-purple-500/10 text-purple-600 dark:text-purple-400'
            ];
            const newCust: Customer = {
                id: Date.now().toString(),
                ...formState,
                initials: getInitials(formState.name),
                totalOrders: 0,
                badgeColor: colors[Math.floor(Math.random() * colors.length)]
            };
            setCustomers((prev) => [newCust, ...prev]);
        }
        setIsDrawerOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this customer profile?')) {
            setCustomers((prev) => prev.filter((c) => c.id !== id));
        }
    };

    const filtered = customers.filter(
        (c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.phone.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalDues = customers.reduce((acc, c) => acc + c.dueAmount, 0);

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Customers & Due Receivables
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Manage customer profiles, credit limits, phone directory, and due collection receipts.
                    </p>
                </div>

                <button
                    onClick={handleOpenCreate}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 self-start sm:self-auto cursor-pointer">
                    <UserPlus className="w-4 h-4" />
                    <span>Register New Customer</span>
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Customers</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{customers.length}</p>
                </div>
                <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Receivable Due</p>
                    <p className="text-2xl font-black text-rose-500 mt-1 font-mono">৳ {totalDues.toLocaleString('en-BD')}</p>
                </div>
                <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Invoices</p>
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">48</p>
                </div>
                <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Avg Credit Limit</p>
                    <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 font-mono">৳ 35,000</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="relative max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search by customer name, phone, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#080d1a] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
            </div>

            {/* Customer Ledger Table */}
            <div className="bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/80 dark:bg-slate-900/40 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80 text-[11px]">
                            <tr>
                                <th className="px-5 py-3">Customer Profile & ID</th>
                                <th className="px-5 py-3">Contact Number</th>
                                <th className="px-5 py-3">Store Branch & City</th>
                                <th className="px-5 py-3 text-right">Credit Limit</th>
                                <th className="px-5 py-3 text-right">Total Orders</th>
                                <th className="px-5 py-3 text-right">Due Receivable (৳)</th>
                                <th className="px-5 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {filtered.map((cust) => (
                                <tr key={cust.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2.5">
                                            <div
                                                className={`w-8 h-8 rounded-full ${cust.badgeColor} font-bold flex items-center justify-center text-xs`}>
                                                {cust.initials}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">{cust.name}</p>
                                                <p className="text-[10px] text-slate-400 font-mono">ID: {cust.code}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 font-mono">{cust.phone}</td>
                                    <td className="px-5 py-3.5 text-slate-500">{cust.address}</td>
                                    <td className="px-5 py-3.5 font-mono text-right font-medium text-slate-700 dark:text-slate-300">
                                        ৳ {cust.creditLimit.toLocaleString('en-BD')}
                                    </td>
                                    <td className="px-5 py-3.5 font-mono text-right font-bold text-slate-800 dark:text-slate-200">
                                        {cust.totalOrders} Invoices
                                    </td>
                                    <td
                                        className={`px-5 py-3.5 font-mono font-bold text-right ${
                                            cust.dueAmount > 0 ? 'text-rose-500' : 'text-slate-400'
                                        }`}>
                                        ৳ {cust.dueAmount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                onClick={() => handleOpenEdit(cust)}
                                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                                title="Edit Profile">
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cust.id)}
                                                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
                                                title="Delete Profile">
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
                title={editingCustomer ? 'Edit Customer Profile' : 'Register New Customer'}
                subtitle="Create customer ledger and credit account parameters"
                width="max-w-lg">
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Customer Code" required>
                            <input
                                type="text"
                                value={formState.code}
                                onChange={(e) => setFormState({ ...formState, code: e.target.value })}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                        <FormField label="Account Status">
                            <select
                                value={formState.status}
                                onChange={(e) => setFormState({ ...formState, status: e.target.value as 'Active' | 'Blocked' })}
                                className={inputClasses}>
                                <option value="Active">Active</option>
                                <option value="Blocked">Blocked</option>
                            </select>
                        </FormField>
                    </div>

                    <FormField label="Customer Full Name" required>
                        <input
                            type="text"
                            placeholder="e.g. Rahim Chowdhury"
                            value={formState.name}
                            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                            className={inputClasses}
                            required
                        />
                    </FormField>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Mobile Phone Number" required>
                            <input
                                type="text"
                                placeholder="+880 1712-xxxxxx"
                                value={formState.phone}
                                onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                        <FormField label="Email Address">
                            <input
                                type="email"
                                placeholder="customer@mail.com"
                                value={formState.email}
                                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                className={inputClasses}
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Credit Limit Ceiling (৳)">
                            <input
                                type="number"
                                min="0"
                                step="1000"
                                value={formState.creditLimit}
                                onChange={(e) => setFormState({ ...formState, creditLimit: Number(e.target.value) })}
                                className={inputClasses}
                            />
                        </FormField>
                        <FormField label="Opening Due Receivable (৳)">
                            <input
                                type="number"
                                min="0"
                                value={formState.dueAmount}
                                onChange={(e) => setFormState({ ...formState, dueAmount: Number(e.target.value) })}
                                className={inputClasses}
                            />
                        </FormField>
                    </div>

                    <FormField label="Customer Delivery / Billing Address">
                        <textarea
                            rows={2}
                            placeholder="Road, House, Area, City..."
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
                            <span>{editingCustomer ? 'Update Customer' : 'Save Customer Profile'}</span>
                        </button>
                    </div>
                </form>
            </SliderDrawer>
        </section>
    );
};
