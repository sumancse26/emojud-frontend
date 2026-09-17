import React, { useState } from 'react';
import { Plus, Search, Edit3, Trash2, Save } from 'lucide-react';
import { SliderDrawer, FormField, inputClasses } from '@/shared';

interface SupplierPayment {
    id: string;
    paymentNo: string;
    date: string;
    supplierName: string;
    purchaseOrderRef: string;
    paidAmount: number;
    paymentMethod: 'Bank Transfer' | 'Cheque' | 'Cash' | 'bKash';
    chequeNo?: string;
    status: 'Settled' | 'Pending Clearance';
    notes: string;
}

const INITIAL_PAYMENTS: SupplierPayment[] = [
    {
        id: '1',
        paymentNo: 'PAY-2026-041',
        date: '2026-09-16',
        supplierName: 'Apex Textiles & Fabrics Ltd.',
        purchaseOrderRef: 'PO-2026-0041',
        paidAmount: 150000,
        paymentMethod: 'Bank Transfer',
        status: 'Settled',
        notes: 'Partial settlement against batch invoice'
    },
    {
        id: '2',
        paymentNo: 'PAY-2026-042',
        date: '2026-09-14',
        supplierName: 'Bengal Leather Crafts Ind.',
        purchaseOrderRef: 'PO-2026-0038',
        paidAmount: 65000,
        paymentMethod: 'Cheque',
        chequeNo: 'CHQ-882910',
        status: 'Settled',
        notes: 'Account payee cheque cleared'
    },
    {
        id: '3',
        paymentNo: 'PAY-2026-043',
        date: '2026-09-17',
        supplierName: 'Royal Fragrance & Oils Ltd.',
        purchaseOrderRef: 'PO-2026-0044',
        paidAmount: 45000,
        paymentMethod: 'Bank Transfer',
        status: 'Pending Clearance',
        notes: 'BEFTN transfer in transit'
    }
];

export const SupplierPaymentPage: React.FC = () => {
    const [payments, setPayments] = useState<SupplierPayment[]>(INITIAL_PAYMENTS);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingPayment, setEditingPayment] = useState<SupplierPayment | null>(null);

    const [formState, setFormState] = useState({
        paymentNo: '',
        date: new Date().toISOString().split('T')[0],
        supplierName: 'Apex Textiles & Fabrics Ltd.',
        purchaseOrderRef: 'PO-2026-0041',
        paidAmount: 25000,
        paymentMethod: 'Bank Transfer' as SupplierPayment['paymentMethod'],
        chequeNo: '',
        status: 'Settled' as SupplierPayment['status'],
        notes: ''
    });

    const handleOpenCreate = () => {
        setEditingPayment(null);
        setFormState({
            paymentNo: `PAY-2026-0${Math.floor(45 + Math.random() * 50)}`,
            date: new Date().toISOString().split('T')[0],
            supplierName: 'Apex Textiles & Fabrics Ltd.',
            purchaseOrderRef: 'PO-2026-0041',
            paidAmount: 25000,
            paymentMethod: 'Bank Transfer',
            chequeNo: '',
            status: 'Settled',
            notes: ''
        });
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (p: SupplierPayment) => {
        setEditingPayment(p);
        setFormState({
            paymentNo: p.paymentNo,
            date: p.date,
            supplierName: p.supplierName,
            purchaseOrderRef: p.purchaseOrderRef,
            paidAmount: p.paidAmount,
            paymentMethod: p.paymentMethod,
            chequeNo: p.chequeNo || '',
            status: p.status,
            notes: p.notes
        });
        setIsDrawerOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingPayment) {
            setPayments((prev) =>
                prev.map((item) => (item.id === editingPayment.id ? { ...item, ...formState } : item))
            );
        } else {
            const newItem: SupplierPayment = {
                id: Date.now().toString(),
                ...formState
            };
            setPayments((prev) => [newItem, ...prev]);
        }
        setIsDrawerOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to void this payment record?')) {
            setPayments((prev) => prev.filter((p) => p.id !== id));
        }
    };

    const totalPaid = payments.reduce((acc, p) => acc + p.paidAmount, 0);

    const filtered = payments.filter(
        (p) =>
            p.paymentNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.purchaseOrderRef.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Supplier Payments & Settlements
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Disburse vendor payable dues, record cheque clearances, and balance ledger accounts.
                    </p>
                </div>

                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer self-start sm:self-auto">
                    <Plus className="w-4 h-4" />
                    <span>Make Supplier Payment</span>
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Settlements</span>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
                        ৳ {totalPaid.toLocaleString('en-BD')}
                    </p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Disbursed Vouchers</span>
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{payments.length}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pending Clearance</span>
                    <p className="text-2xl font-black text-amber-500 mt-1">
                        {payments.filter((p) => p.status === 'Pending Clearance').length}
                    </p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="relative max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search payment #, vendor, or PO reference..."
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
                                <th className="px-5 py-3">Payment # & Date</th>
                                <th className="px-4 py-3">Supplier Name</th>
                                <th className="px-4 py-3">Purchase Order Ref</th>
                                <th className="px-4 py-3">Payment Method</th>
                                <th className="px-4 py-3 text-right">Amount Paid (৳)</th>
                                <th className="px-4 py-3 text-center">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {filtered.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                                    <td className="px-5 py-3.5">
                                        <p className="font-mono font-bold text-slate-900 dark:text-white">{p.paymentNo}</p>
                                        <p className="text-[10px] text-slate-400">{p.date}</p>
                                    </td>
                                    <td className="px-4 py-3.5 font-bold text-slate-800 dark:text-slate-200">
                                        {p.supplierName}
                                    </td>
                                    <td className="px-4 py-3.5 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                                        {p.purchaseOrderRef}
                                    </td>
                                    <td className="px-4 py-3.5 text-slate-500">
                                        {p.paymentMethod} {p.chequeNo && `(${p.chequeNo})`}
                                    </td>
                                    <td className="px-4 py-3.5 text-right font-mono font-black text-slate-900 dark:text-white">
                                        ৳ {p.paidAmount.toLocaleString('en-BD')}
                                    </td>
                                    <td className="px-4 py-3.5 text-center">
                                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                            p.status === 'Settled'
                                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                                : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                                        }`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                onClick={() => handleOpenEdit(p)}
                                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                                title="Edit Payment">
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
                                                title="Void Payment">
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
                title={editingPayment ? 'Edit Supplier Payment' : 'Record Supplier Payment'}
                subtitle="Settle vendor balance invoice and update accounts ledger"
                width="max-w-lg">
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Payment Ref #" required>
                            <input
                                type="text"
                                value={formState.paymentNo}
                                onChange={(e) => setFormState({ ...formState, paymentNo: e.target.value })}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                        <FormField label="Payment Date" required>
                            <input
                                type="date"
                                value={formState.date}
                                onChange={(e) => setFormState({ ...formState, date: e.target.value })}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                    </div>

                    <FormField label="Supplier / Vendor Beneficiary" required>
                        <select
                            value={formState.supplierName}
                            onChange={(e) => setFormState({ ...formState, supplierName: e.target.value })}
                            className={inputClasses}>
                            <option value="Apex Textiles & Fabrics Ltd.">Apex Textiles & Fabrics Ltd.</option>
                            <option value="Bengal Leather Crafts Ind.">Bengal Leather Crafts Ind.</option>
                            <option value="Silk & Thread Global Imports">Silk & Thread Global Imports</option>
                            <option value="Royal Fragrance & Oils Ltd.">Royal Fragrance & Oils Ltd.</option>
                        </select>
                    </FormField>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Purchase Order Ref #" required>
                            <input
                                type="text"
                                placeholder="PO-2026-xxxx"
                                value={formState.purchaseOrderRef}
                                onChange={(e) => setFormState({ ...formState, purchaseOrderRef: e.target.value })}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                        <FormField label="Settlement Amount (৳)" required>
                            <input
                                type="number"
                                min="1"
                                step="100"
                                value={formState.paidAmount}
                                onChange={(e) => setFormState({ ...formState, paidAmount: Number(e.target.value) })}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Payment Mode">
                            <select
                                value={formState.paymentMethod}
                                onChange={(e) => setFormState({ ...formState, paymentMethod: e.target.value as any })}
                                className={inputClasses}>
                                <option value="Bank Transfer">Bank Transfer (EBL/City)</option>
                                <option value="Cheque">Bank Cheque</option>
                                <option value="Cash">Cash Voucher</option>
                                <option value="bKash">bKash Merchant</option>
                            </select>
                        </FormField>
                        <FormField label="Cheque # (If applicable)">
                            <input
                                type="text"
                                placeholder="CHQ-xxxxx"
                                value={formState.chequeNo}
                                onChange={(e) => setFormState({ ...formState, chequeNo: e.target.value })}
                                className={inputClasses}
                            />
                        </FormField>
                    </div>

                    <FormField label="Clearing Status">
                        <select
                            value={formState.status}
                            onChange={(e) => setFormState({ ...formState, status: e.target.value as any })}
                            className={inputClasses}>
                            <option value="Settled">Settled (Funds Transferred)</option>
                            <option value="Pending Clearance">Pending Clearance</option>
                        </select>
                    </FormField>

                    <FormField label="Settlement Remarks & Batch Reference">
                        <textarea
                            rows={2}
                            placeholder="Bank transaction ref, ledger book folio..."
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
                            <span>{editingPayment ? 'Update Payment' : 'Disburse Payment'}</span>
                        </button>
                    </div>
                </form>
            </SliderDrawer>
        </section>
    );
};
