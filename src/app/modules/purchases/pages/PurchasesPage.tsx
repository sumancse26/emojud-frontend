import React, { useState } from 'react';
import { Plus, Search, Edit3, Trash2, Save } from 'lucide-react';
import { SliderDrawer, FormField, inputClasses } from '@/shared';

interface PurchaseOrder {
    id: string;
    poNumber: string;
    vendorName: string;
    orderDate: string;
    warehouse: string;
    totalAmount: number;
    paidAmount: number;
    dueAmount: number;
    paymentStatus: 'PAID' | 'PARTIAL' | 'UNPAID';
    deliveryStatus: 'RECEIVED' | 'IN_TRANSIT' | 'ORDERED';
    notes: string;
}

const INITIAL_PURCHASES: PurchaseOrder[] = [
    {
        id: '1',
        poNumber: 'PO-2026-0312',
        vendorName: 'Apex Textiles & Fabrics Ltd.',
        orderDate: '2026-09-12',
        warehouse: 'Central Warehouse (Savar)',
        totalAmount: 240000,
        paidAmount: 200000,
        dueAmount: 40000,
        paymentStatus: 'PARTIAL',
        deliveryStatus: 'RECEIVED',
        notes: 'Premium Supima Cotton batches 400pcs'
    },
    {
        id: '2',
        poNumber: 'PO-2026-0315',
        vendorName: 'Bengal Leather Crafts Ind.',
        orderDate: '2026-09-14',
        warehouse: 'Central Warehouse (Savar)',
        totalAmount: 185000,
        paidAmount: 185000,
        dueAmount: 0,
        paymentStatus: 'PAID',
        deliveryStatus: 'RECEIVED',
        notes: 'Italian full grain leather belts & wallets'
    },
    {
        id: '3',
        poNumber: 'PO-2026-0318',
        vendorName: 'Silk & Thread Global Imports',
        orderDate: '2026-09-16',
        warehouse: 'Dhanmondi Flagship Outlet',
        totalAmount: 95000,
        paidAmount: 0,
        dueAmount: 95000,
        paymentStatus: 'UNPAID',
        deliveryStatus: 'IN_TRANSIT',
        notes: 'Formal Jacquard woven silk ties (150 pcs)'
    }
];

export const PurchasesPage: React.FC = () => {
    const [purchases, setPurchases] = useState<PurchaseOrder[]>(INITIAL_PURCHASES);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingPO, setEditingPO] = useState<PurchaseOrder | null>(null);

    const [formState, setFormState] = useState({
        poNumber: '',
        vendorName: 'Apex Textiles & Fabrics Ltd.',
        orderDate: new Date().toISOString().split('T')[0],
        warehouse: 'Central Warehouse (Savar)',
        totalAmount: 0,
        paidAmount: 0,
        paymentStatus: 'UNPAID' as 'PAID' | 'PARTIAL' | 'UNPAID',
        deliveryStatus: 'ORDERED' as 'RECEIVED' | 'IN_TRANSIT' | 'ORDERED',
        notes: ''
    });

    const handleOpenCreate = () => {
        setEditingPO(null);
        setFormState({
            poNumber: `PO-2026-0${Math.floor(320 + Math.random() * 80)}`,
            vendorName: 'Apex Textiles & Fabrics Ltd.',
            orderDate: new Date().toISOString().split('T')[0],
            warehouse: 'Central Warehouse (Savar)',
            totalAmount: 50000,
            paidAmount: 0,
            paymentStatus: 'UNPAID',
            deliveryStatus: 'ORDERED',
            notes: ''
        });
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (po: PurchaseOrder) => {
        setEditingPO(po);
        setFormState({
            poNumber: po.poNumber,
            vendorName: po.vendorName,
            orderDate: po.orderDate,
            warehouse: po.warehouse,
            totalAmount: po.totalAmount,
            paidAmount: po.paidAmount,
            paymentStatus: po.paymentStatus,
            deliveryStatus: po.deliveryStatus,
            notes: po.notes
        });
        setIsDrawerOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const dueAmount = Math.max(0, formState.totalAmount - formState.paidAmount);
        let calculatedPaymentStatus: 'PAID' | 'PARTIAL' | 'UNPAID' = 'UNPAID';
        if (formState.paidAmount >= formState.totalAmount) calculatedPaymentStatus = 'PAID';
        else if (formState.paidAmount > 0) calculatedPaymentStatus = 'PARTIAL';

        if (editingPO) {
            setPurchases((prev) =>
                prev.map((p) =>
                    p.id === editingPO.id
                        ? {
                              ...p,
                              ...formState,
                              dueAmount,
                              paymentStatus: calculatedPaymentStatus
                          }
                        : p
                )
            );
        } else {
            const newPO: PurchaseOrder = {
                id: Date.now().toString(),
                ...formState,
                dueAmount,
                paymentStatus: calculatedPaymentStatus
            };
            setPurchases((prev) => [newPO, ...prev]);
        }
        setIsDrawerOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to cancel this purchase order?')) {
            setPurchases((prev) => prev.filter((p) => p.id !== id));
        }
    };

    const totalCost = purchases.reduce((acc, p) => acc + p.totalAmount, 0);
    const totalPaid = purchases.reduce((acc, p) => acc + p.paidAmount, 0);
    const totalDue = purchases.reduce((acc, p) => acc + p.dueAmount, 0);

    const filtered = purchases.filter(
        (p) =>
            p.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.vendorName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Purchases & Vendor Restock Orders
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Track purchase orders, restock inventory shipments, vendor ledger balances, and payment settlements.
                    </p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 self-start sm:self-auto cursor-pointer">
                    <Plus className="w-4 h-4" />
                    <span>Create Purchase Order</span>
                </button>
            </div>

            {/* Metric KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <span className="text-[11px] font-bold uppercase text-slate-400">Total Purchase Cost</span>
                    <p className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">
                        ৳ {totalCost.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <span className="text-[11px] font-bold uppercase text-slate-400">Total Paid to Vendors</span>
                    <p className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                        ৳ {totalPaid.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <span className="text-[11px] font-bold uppercase text-slate-400">Vendor Outstanding Payables</span>
                    <p className="text-2xl font-extrabold font-mono text-rose-500 mt-1">
                        ৳ {totalDue.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="relative max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search by PO # or vendor name..."
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
                                <th className="px-5 py-3">PO Reference</th>
                                <th className="px-5 py-3">Vendor / Supplier</th>
                                <th className="px-5 py-3">Destination WH</th>
                                <th className="px-5 py-3">Order Date</th>
                                <th className="px-5 py-3 text-right">Grand Total</th>
                                <th className="px-5 py-3 text-right">Outstanding Balance</th>
                                <th className="px-5 py-3 text-center">Delivery Status</th>
                                <th className="px-5 py-3 text-center">Payment</th>
                                <th className="px-5 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {filtered.map((po) => (
                                <tr key={po.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                                    <td className="px-5 py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                                        {po.poNumber}
                                    </td>
                                    <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                                        {po.vendorName}
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-500 text-[11px]">
                                        {po.warehouse}
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-500 font-mono">
                                        {po.orderDate}
                                    </td>
                                    <td className="px-5 py-3.5 font-mono text-right font-bold text-slate-900 dark:text-white">
                                        ৳ {po.totalAmount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className={`px-5 py-3.5 font-mono text-right font-bold ${
                                        po.dueAmount > 0 ? 'text-rose-500' : 'text-slate-400'
                                    }`}>
                                        ৳ {po.dueAmount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-5 py-3.5 text-center">
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                            po.deliveryStatus === 'RECEIVED'
                                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                : po.deliveryStatus === 'IN_TRANSIT'
                                                ? 'bg-blue-500/10 text-blue-600'
                                                : 'bg-amber-500/10 text-amber-600'
                                        }`}>
                                            {po.deliveryStatus}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-center">
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                            po.paymentStatus === 'PAID'
                                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                : po.paymentStatus === 'PARTIAL'
                                                ? 'bg-amber-500/10 text-amber-500'
                                                : 'bg-rose-500/10 text-rose-600'
                                        }`}>
                                            {po.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                onClick={() => handleOpenEdit(po)}
                                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                                title="Edit PO">
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(po.id)}
                                                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
                                                title="Delete PO">
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
                title={editingPO ? 'Edit Purchase Order' : 'Create Purchase Order'}
                subtitle="Record vendor supply batches, delivery receiving, and payment terms"
                width="max-w-lg">
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="PO Tracking Ref #" required>
                            <input
                                type="text"
                                value={formState.poNumber}
                                onChange={(e) => setFormState({ ...formState, poNumber: e.target.value })}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                        <FormField label="Order Date" required>
                            <input
                                type="date"
                                value={formState.orderDate}
                                onChange={(e) => setFormState({ ...formState, orderDate: e.target.value })}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                    </div>

                    <FormField label="Vendor / Supplier" required>
                        <select
                            value={formState.vendorName}
                            onChange={(e) => setFormState({ ...formState, vendorName: e.target.value })}
                            className={inputClasses}>
                            <option value="Apex Textiles & Fabrics Ltd.">Apex Textiles & Fabrics Ltd.</option>
                            <option value="Bengal Leather Crafts Ind.">Bengal Leather Crafts Ind.</option>
                            <option value="Silk & Thread Global Imports">Silk & Thread Global Imports</option>
                            <option value="Royal Fragrance & Oils Ltd.">Royal Fragrance & Oils Ltd.</option>
                        </select>
                    </FormField>

                    <FormField label="Receiving Warehouse / Hub" required>
                        <select
                            value={formState.warehouse}
                            onChange={(e) => setFormState({ ...formState, warehouse: e.target.value })}
                            className={inputClasses}>
                            <option value="Central Warehouse (Savar)">Central Warehouse (Savar)</option>
                            <option value="Dhanmondi Flagship Outlet">Dhanmondi Flagship Outlet</option>
                            <option value="Gulshan Branch Outlet">Gulshan Branch Outlet</option>
                            <option value="Chittagong Distribution Hub">Chittagong Distribution Hub</option>
                        </select>
                    </FormField>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Total Grand Cost (৳)" required>
                            <input
                                type="number"
                                min="0"
                                step="500"
                                value={formState.totalAmount}
                                onChange={(e) => setFormState({ ...formState, totalAmount: Number(e.target.value) })}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                        <FormField label="Paid Amount (৳)">
                            <input
                                type="number"
                                min="0"
                                step="500"
                                value={formState.paidAmount}
                                onChange={(e) => setFormState({ ...formState, paidAmount: Number(e.target.value) })}
                                className={inputClasses}
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Delivery Status">
                            <select
                                value={formState.deliveryStatus}
                                onChange={(e) => setFormState({ ...formState, deliveryStatus: e.target.value as any })}
                                className={inputClasses}>
                                <option value="ORDERED">ORDERED</option>
                                <option value="IN_TRANSIT">IN_TRANSIT</option>
                                <option value="RECEIVED">RECEIVED</option>
                            </select>
                        </FormField>
                        <FormField label="Payment Status Preview">
                            <input
                                type="text"
                                readOnly
                                value={
                                    formState.paidAmount >= formState.totalAmount
                                        ? 'PAID'
                                        : formState.paidAmount > 0
                                        ? 'PARTIAL'
                                        : 'UNPAID'
                                }
                                className={`${inputClasses} bg-slate-100 dark:bg-slate-800 font-bold font-mono`}
                            />
                        </FormField>
                    </div>

                    <FormField label="Order Description & Batch Notes">
                        <textarea
                            rows={3}
                            placeholder="Specify SKU breakdown, batch details, carton numbers..."
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
                            <span>{editingPO ? 'Update Purchase Order' : 'Save Purchase Order'}</span>
                        </button>
                    </div>
                </form>
            </SliderDrawer>
        </section>
    );
};
