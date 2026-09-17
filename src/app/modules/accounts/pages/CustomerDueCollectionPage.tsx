import React, { useState } from 'react';
import { Plus, Search, Edit3, Trash2, Save } from 'lucide-react';
import { SliderDrawer, FormField, inputClasses } from '@/shared';

interface DueCollection {
    id: string;
    receiptNo: string;
    date: string;
    customerName: string;
    customerPhone: string;
    invoiceRef: string;
    collectedAmount: number;
    paymentMode: 'Cash' | 'bKash' | 'Card' | 'Nagad';
    cashier: string;
    remainingDue: number;
    notes: string;
}

const INITIAL_COLLECTIONS: DueCollection[] = [
    {
        id: '1',
        receiptNo: 'REC-2026-108',
        date: '2026-09-17',
        customerName: 'Farhana Yasmin',
        customerPhone: '+880 1911-889900',
        invoiceRef: 'INV-2026-0044',
        collectedAmount: 4400,
        paymentMode: 'bKash',
        cashier: 'Sadia Afreen',
        remainingDue: 0,
        notes: 'Cleared total due amount'
    },
    {
        id: '2',
        receiptNo: 'REC-2026-109',
        date: '2026-09-16',
        customerName: 'Mahmudul Hasan',
        customerPhone: '+880 1712-445566',
        invoiceRef: 'INV-2026-0039',
        collectedAmount: 2500,
        paymentMode: 'Cash',
        cashier: 'Sadia Afreen',
        remainingDue: 1800,
        notes: 'Partial settlement, remaining ৳ 1,800 due next week'
    }
];

export const CustomerDueCollectionPage: React.FC = () => {
    const [collections, setCollections] = useState<DueCollection[]>(INITIAL_COLLECTIONS);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<DueCollection | null>(null);

    const [formState, setFormState] = useState({
        receiptNo: '',
        date: new Date().toISOString().split('T')[0],
        customerName: 'Rahim Chowdhury',
        customerPhone: '+880 1712-345678',
        invoiceRef: 'INV-2026-0050',
        collectedAmount: 1000,
        paymentMode: 'Cash' as DueCollection['paymentMode'],
        cashier: 'Suman Roy (Admin)',
        remainingDue: 0,
        notes: ''
    });

    const handleOpenCreate = () => {
        setEditingItem(null);
        setFormState({
            receiptNo: `REC-2026-1${Math.floor(10 + Math.random() * 80)}`,
            date: new Date().toISOString().split('T')[0],
            customerName: 'Mahbubur Rahman',
            customerPhone: '+880 1819-776655',
            invoiceRef: 'INV-2026-0052',
            collectedAmount: 5000,
            paymentMode: 'bKash',
            cashier: 'Suman Roy (Admin)',
            remainingDue: 7500,
            notes: ''
        });
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (item: DueCollection) => {
        setEditingItem(item);
        setFormState({
            receiptNo: item.receiptNo,
            date: item.date,
            customerName: item.customerName,
            customerPhone: item.customerPhone,
            invoiceRef: item.invoiceRef,
            collectedAmount: item.collectedAmount,
            paymentMode: item.paymentMode,
            cashier: item.cashier,
            remainingDue: item.remainingDue,
            notes: item.notes
        });
        setIsDrawerOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            setCollections((prev) =>
                prev.map((c) => (c.id === editingItem.id ? { ...c, ...formState } : c))
            );
        } else {
            const newItem: DueCollection = {
                id: Date.now().toString(),
                ...formState
            };
            setCollections((prev) => [newItem, ...prev]);
        }
        setIsDrawerOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to void this collection receipt?')) {
            setCollections((prev) => prev.filter((c) => c.id !== id));
        }
    };

    const totalCollected = collections.reduce((acc, c) => acc + c.collectedAmount, 0);

    const filtered = collections.filter(
        (c) =>
            c.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.customerPhone.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Customer Due Collection Receipts
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Collect outstanding customer credit dues, print money receipts, and adjust sales balances.
                    </p>
                </div>

                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer self-start sm:self-auto">
                    <Plus className="w-4 h-4" />
                    <span>Collect New Due</span>
                </button>
            </div>

            {/* Metric KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Due Collections</span>
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
                        ৳ {totalCollected.toLocaleString('en-BD')}
                    </p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Money Receipts Issued</span>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{collections.length}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Recovery Rate</span>
                    <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">94%</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="relative max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search receipt #, customer name, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#080d1a] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
            </div>

            <div className="bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/80 dark:bg-slate-900/40 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80 text-[11px]">
                            <tr>
                                <th className="px-5 py-3">Receipt # & Date</th>
                                <th className="px-4 py-3">Customer Profile</th>
                                <th className="px-4 py-3">Invoice Ref</th>
                                <th className="px-4 py-3">Payment Mode</th>
                                <th className="px-4 py-3">Received By</th>
                                <th className="px-4 py-3 text-right">Collected (৳)</th>
                                <th className="px-4 py-3 text-right">Remaining Due (৳)</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {filtered.map((c) => (
                                <tr key={c.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                                    <td className="px-5 py-3.5">
                                        <p className="font-mono font-bold text-slate-900 dark:text-white">{c.receiptNo}</p>
                                        <p className="text-[10px] text-slate-400">{c.date}</p>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <p className="font-bold text-slate-800 dark:text-slate-200">{c.customerName}</p>
                                        <p className="text-[11px] text-slate-400 font-mono">{c.customerPhone}</p>
                                    </td>
                                    <td className="px-4 py-3.5 font-mono text-blue-600 dark:text-blue-400 font-bold">
                                        {c.invoiceRef}
                                    </td>
                                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 font-medium">
                                        {c.paymentMode}
                                    </td>
                                    <td className="px-4 py-3.5 text-slate-500">
                                        {c.cashier}
                                    </td>
                                    <td className="px-4 py-3.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                        ৳ {c.collectedAmount.toLocaleString('en-BD')}
                                    </td>
                                    <td className={`px-4 py-3.5 text-right font-mono font-bold ${
                                        c.remainingDue > 0 ? 'text-rose-500' : 'text-slate-400'
                                    }`}>
                                        ৳ {c.remainingDue.toLocaleString('en-BD')}
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                onClick={() => handleOpenEdit(c)}
                                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                                title="Edit Receipt">
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(c.id)}
                                                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
                                                title="Void Receipt">
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
                title={editingItem ? 'Edit Collection Receipt' : 'Collect Customer Due Receipt'}
                subtitle="Issue official money receipt and deduct customer due ledger"
                width="max-w-lg">
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Money Receipt Ref #" required>
                            <input
                                type="text"
                                value={formState.receiptNo}
                                onChange={(e) => setFormState({ ...formState, receiptNo: e.target.value })}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                        <FormField label="Collection Date" required>
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
                        <FormField label="Customer Name" required>
                            <input
                                type="text"
                                placeholder="e.g. Mahbubur Rahman"
                                value={formState.customerName}
                                onChange={(e) => setFormState({ ...formState, customerName: e.target.value })}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                        <FormField label="Customer Phone" required>
                            <input
                                type="text"
                                placeholder="+880 1819-xxxxxx"
                                value={formState.customerPhone}
                                onChange={(e) => setFormState({ ...formState, customerPhone: e.target.value })}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Original Invoice Ref #" required>
                            <input
                                type="text"
                                placeholder="INV-2026-xxxx"
                                value={formState.invoiceRef}
                                onChange={(e) => setFormState({ ...formState, invoiceRef: e.target.value })}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                        <FormField label="Payment Channel" required>
                            <select
                                value={formState.paymentMode}
                                onChange={(e) => setFormState({ ...formState, paymentMode: e.target.value as any })}
                                className={inputClasses}>
                                <option value="Cash">Cash at Counter</option>
                                <option value="bKash">bKash Personal / Merchant</option>
                                <option value="Nagad">Nagad</option>
                                <option value="Card">Visa / Master Card POS</option>
                            </select>
                        </FormField>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Amount Received (৳)" required>
                            <input
                                type="number"
                                min="1"
                                step="10"
                                value={formState.collectedAmount}
                                onChange={(e) => setFormState({ ...formState, collectedAmount: Number(e.target.value) })}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                        <FormField label="Remaining Due (৳)">
                            <input
                                type="number"
                                min="0"
                                value={formState.remainingDue}
                                onChange={(e) => setFormState({ ...formState, remainingDue: Number(e.target.value) })}
                                className={inputClasses}
                            />
                        </FormField>
                    </div>

                    <FormField label="Remarks & Note">
                        <textarea
                            rows={2}
                            placeholder="Transaction ID / Next installment date..."
                            value={formState.notes}
                            onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
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
                            <span>{editingItem ? 'Update Receipt' : 'Save Money Receipt'}</span>
                        </button>
                    </div>
                </form>
            </SliderDrawer>
        </section>
    );
};
