import React, { useState } from 'react';
import { Plus, Search, Edit3, Trash2, Save, CheckCircle2 } from 'lucide-react';
import { SliderDrawer, FormField, inputClasses } from '@/shared';

interface ExpenseVoucher {
    id: string;
    voucherNo: string;
    date: string;
    category: 'Store Utility' | 'Branch Rent' | 'Staff Refreshments' | 'Logistics & Fuel' | 'Packaging Materials' | 'Marketing & Promo';
    outlet: string;
    amount: number;
    paidTo: string;
    paymentMode: 'Cash' | 'Bank Transfer' | 'bKash / Nagad';
    approvedBy: string;
    receiptAttached: boolean;
    remarks: string;
}

const INITIAL_EXPENSES: ExpenseVoucher[] = [
    {
        id: '1',
        voucherNo: 'EXP-2026-081',
        date: '2026-09-17',
        category: 'Store Utility',
        outlet: 'Dhanmondi Flagship Outlet',
        amount: 8500,
        paidTo: 'DPDC Electricity Bill',
        paymentMode: 'Bank Transfer',
        approvedBy: 'Tanvir Hossain',
        receiptAttached: true,
        remarks: 'September meter bill paid'
    },
    {
        id: '2',
        voucherNo: 'EXP-2026-082',
        date: '2026-09-16',
        category: 'Packaging Materials',
        outlet: 'Central Warehouse (Savar)',
        amount: 24000,
        paidTo: 'Ideal Carton & Box Mills',
        paymentMode: 'Bank Transfer',
        approvedBy: 'Kamrul Islam',
        receiptAttached: true,
        remarks: '2000 pcs corrugated shipping boxes'
    },
    {
        id: '3',
        voucherNo: 'EXP-2026-083',
        date: '2026-09-16',
        category: 'Logistics & Fuel',
        outlet: 'Gulshan Branch Outlet',
        amount: 3200,
        paidTo: 'Inter-branch Delivery Van',
        paymentMode: 'Cash',
        approvedBy: 'Tanvir Hossain',
        receiptAttached: false,
        remarks: 'Fuel allowance for stock delivery'
    },
    {
        id: '4',
        voucherNo: 'EXP-2026-084',
        date: '2026-09-15',
        category: 'Staff Refreshments',
        outlet: 'Dhanmondi Flagship Outlet',
        amount: 1450,
        paidTo: 'Daily Tea & Snacks',
        paymentMode: 'Cash',
        approvedBy: 'Tanvir Hossain',
        receiptAttached: true,
        remarks: 'Weekly petty cash voucher'
    }
];

export const ExpensesPage: React.FC = () => {
    const [expenses, setExpenses] = useState<ExpenseVoucher[]>(INITIAL_EXPENSES);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState<ExpenseVoucher | null>(null);

    const [formState, setFormState] = useState({
        voucherNo: '',
        date: new Date().toISOString().split('T')[0],
        category: 'Store Utility' as ExpenseVoucher['category'],
        outlet: 'Dhanmondi Flagship Outlet',
        amount: 1000,
        paidTo: '',
        paymentMode: 'Cash' as ExpenseVoucher['paymentMode'],
        approvedBy: 'Suman Roy (Admin)',
        receiptAttached: true,
        remarks: ''
    });

    const handleOpenCreate = () => {
        setEditingVoucher(null);
        setFormState({
            voucherNo: `EXP-2026-0${Math.floor(85 + Math.random() * 100)}`,
            date: new Date().toISOString().split('T')[0],
            category: 'Store Utility',
            outlet: 'Dhanmondi Flagship Outlet',
            amount: 1500,
            paidTo: '',
            paymentMode: 'Cash',
            approvedBy: 'Suman Roy (Admin)',
            receiptAttached: true,
            remarks: ''
        });
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (v: ExpenseVoucher) => {
        setEditingVoucher(v);
        setFormState({
            voucherNo: v.voucherNo,
            date: v.date,
            category: v.category,
            outlet: v.outlet,
            amount: v.amount,
            paidTo: v.paidTo,
            paymentMode: v.paymentMode,
            approvedBy: v.approvedBy,
            receiptAttached: v.receiptAttached,
            remarks: v.remarks
        });
        setIsDrawerOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingVoucher) {
            setExpenses((prev) =>
                prev.map((item) => (item.id === editingVoucher.id ? { ...item, ...formState } : item))
            );
        } else {
            const newItem: ExpenseVoucher = {
                id: Date.now().toString(),
                ...formState
            };
            setExpenses((prev) => [newItem, ...prev]);
        }
        setIsDrawerOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to void this expense voucher?')) {
            setExpenses((prev) => prev.filter((item) => item.id !== id));
        }
    };

    const filtered = expenses.filter(
        (exp) =>
            exp.voucherNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exp.paidTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exp.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Daily Expense Vouchers & Petty Cash
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Record utility bills, shop maintenance, courier, and miscellaneous operational costs.
                    </p>
                </div>

                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer self-start sm:self-auto">
                    <Plus className="w-4 h-4" />
                    <span>Create Expense Voucher</span>
                </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Recorded Expenses</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
                        ৳ {totalExpense.toLocaleString('en-BD')}
                    </p>
                </div>
                <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Petty Cash Balance</p>
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
                        ৳ 42,500
                    </p>
                </div>
                <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Vouchers Processed</p>
                    <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{expenses.length}</p>
                </div>
                <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Audit Compliance</p>
                    <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">100%</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="relative max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search voucher #, payee or category..."
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
                                <th className="px-5 py-3">Voucher # & Date</th>
                                <th className="px-4 py-3">Expense Head</th>
                                <th className="px-4 py-3">Branch Outlet</th>
                                <th className="px-4 py-3">Paid To Beneficiary</th>
                                <th className="px-4 py-3">Payment Mode</th>
                                <th className="px-4 py-3 text-right">Amount (৳)</th>
                                <th className="px-4 py-3 text-center">Receipt</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {filtered.map((exp) => (
                                <tr key={exp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                                    <td className="px-5 py-3.5">
                                        <p className="font-mono font-bold text-slate-900 dark:text-white">
                                            {exp.voucherNo}
                                        </p>
                                        <p className="text-[10px] text-slate-400">{exp.date}</p>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                            {exp.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 font-medium">
                                        {exp.outlet}
                                    </td>
                                    <td className="px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200">
                                        {exp.paidTo}
                                    </td>
                                    <td className="px-4 py-3.5 text-slate-500 font-medium">
                                        {exp.paymentMode}
                                    </td>
                                    <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                                        ৳ {exp.amount.toLocaleString('en-BD')}
                                    </td>
                                    <td className="px-4 py-3.5 text-center">
                                        {exp.receiptAttached ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                <span>Verified</span>
                                            </span>
                                        ) : (
                                            <span className="text-[10px] text-amber-500 font-bold">Pending</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                onClick={() => handleOpenEdit(exp)}
                                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                                title="Edit Voucher">
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(exp.id)}
                                                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
                                                title="Void Voucher">
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
                title={editingVoucher ? 'Edit Expense Voucher' : 'Create Expense Voucher'}
                subtitle="Record store bills, maintenance, travel or petty cash expenditures"
                width="max-w-lg">
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Voucher Ref #" required>
                            <input
                                type="text"
                                value={formState.voucherNo}
                                onChange={(e) => setFormState({ ...formState, voucherNo: e.target.value })}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                        <FormField label="Expense Date" required>
                            <input
                                type="date"
                                value={formState.date}
                                onChange={(e) => setFormState({ ...formState, date: e.target.value })}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Expense Category / Head" required>
                            <select
                                value={formState.category}
                                onChange={(e) => setFormState({ ...formState, category: e.target.value as any })}
                                className={inputClasses}>
                                <option value="Store Utility">Store Utility</option>
                                <option value="Branch Rent">Branch Rent</option>
                                <option value="Staff Refreshments">Staff Refreshments</option>
                                <option value="Logistics & Fuel">Logistics & Fuel</option>
                                <option value="Packaging Materials">Packaging Materials</option>
                                <option value="Marketing & Promo">Marketing & Promo</option>
                            </select>
                        </FormField>
                        <FormField label="Branch Outlet" required>
                            <select
                                value={formState.outlet}
                                onChange={(e) => setFormState({ ...formState, outlet: e.target.value })}
                                className={inputClasses}>
                                <option value="Dhanmondi Flagship Outlet">Dhanmondi Flagship Outlet</option>
                                <option value="Gulshan Branch Outlet">Gulshan Branch Outlet</option>
                                <option value="Central Warehouse (Savar)">Central Warehouse (Savar)</option>
                                <option value="Chittagong Distribution Hub">Chittagong Distribution Hub</option>
                            </select>
                        </FormField>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Paid To Beneficiary" required>
                            <input
                                type="text"
                                placeholder="e.g. DPDC / Supplier / Van Driver"
                                value={formState.paidTo}
                                onChange={(e) => setFormState({ ...formState, paidTo: e.target.value })}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                        <FormField label="Expense Amount (৳)" required>
                            <input
                                type="number"
                                min="0"
                                step="10"
                                value={formState.amount}
                                onChange={(e) => setFormState({ ...formState, amount: Number(e.target.value) })}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Payment Method">
                            <select
                                value={formState.paymentMode}
                                onChange={(e) => setFormState({ ...formState, paymentMode: e.target.value as any })}
                                className={inputClasses}>
                                <option value="Cash">Cash (Petty Cash)</option>
                                <option value="Bank Transfer">Bank Transfer (EBL/City)</option>
                                <option value="bKash / Nagad">bKash / Nagad Merchant</option>
                            </select>
                        </FormField>
                        <FormField label="Receipt Status">
                            <label className="flex items-center gap-2 mt-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formState.receiptAttached}
                                    onChange={(e) => setFormState({ ...formState, receiptAttached: e.target.checked })}
                                    className="w-4 h-4 text-emerald-600 rounded accent-emerald-600 cursor-pointer"
                                />
                                <span>Physical Invoice Attached</span>
                            </label>
                        </FormField>
                    </div>

                    <FormField label="Description & Remarks">
                        <textarea
                            rows={2}
                            placeholder="Reason for expense, invoice slip number..."
                            value={formState.remarks}
                            onChange={(e) => setFormState({ ...formState, remarks: e.target.value })}
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
                            <span>{editingVoucher ? 'Update Voucher' : 'Post Voucher'}</span>
                        </button>
                    </div>
                </form>
            </SliderDrawer>
        </section>
    );
};
