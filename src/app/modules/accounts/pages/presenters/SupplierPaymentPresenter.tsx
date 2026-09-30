import React from 'react';
import { Plus, Search, Edit3, Trash2, Save, BadgeDollarSign, FileCheck2, Clock } from 'lucide-react';
import { SliderDrawer, FormField, inputClasses, PageHeader, Pagination } from '@/shared';
import type { SupplierPayment, SupplierPaymentFormData } from '../SupplierPaymentPage';

export interface SupplierPaymentPresenterProps {
    payments: SupplierPayment[];
    filteredPayments: SupplierPayment[];
    totalPaid: number;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    isDrawerOpen: boolean;
    onCloseDrawer: () => void;
    editingPayment: SupplierPayment | null;
    formState: SupplierPaymentFormData;
    onFormFieldChange: <K extends keyof SupplierPaymentFormData>(field: K, value: SupplierPaymentFormData[K]) => void;
    onOpenCreate: () => void;
    onOpenEdit: (p: SupplierPayment) => void;
    onSave: (e: React.FormEvent) => void;
    onDelete: (id: string) => void;
}

export const SupplierPaymentPresenter: React.FC<SupplierPaymentPresenterProps> = ({
    payments,
    filteredPayments,
    totalPaid,
    searchQuery,
    onSearchChange,
    isDrawerOpen,
    onCloseDrawer,
    editingPayment,
    formState,
    onFormFieldChange,
    onOpenCreate,
    onOpenEdit,
    onSave,
    onDelete
}) => {
    const pendingCount = payments.filter((p) => p.status === 'Pending Clearance').length;

    return (
        <section className="space-y-6">
            <PageHeader>
                <PageHeader.Header
                    title="Supplier Payments & Settlements"
                    description="Disburse vendor payable dues, record cheque clearances, and balance ledger accounts."
                    actions={
                        <button
                            onClick={onOpenCreate}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-emerald-600/20 transition cursor-pointer">
                            <Plus className="w-4 h-4" />
                            <span>Make Supplier Payment</span>
                        </button>
                    }
                />

                <PageHeader.Body>
                    <PageHeader.MetricGrid cols={3}>
                        <PageHeader.MetricCard
                            label="Total Settlements"
                            value={`৳ ${totalPaid.toLocaleString('en-BD')}`}
                            icon={<BadgeDollarSign className="w-4 h-4" />}
                            accentColor="emerald"
                            valueColor="text-slate-900 dark:text-white"
                            subtext="Total cleared vendor dues"
                        />
                        <PageHeader.MetricCard
                            label="Total Disbursed Vouchers"
                            value={payments.length}
                            icon={<FileCheck2 className="w-4 h-4" />}
                            accentColor="blue"
                            valueColor="text-blue-600 dark:text-blue-400"
                            subtext="Settlement transactions"
                        />
                        <PageHeader.MetricCard
                            label="Pending Clearance"
                            value={pendingCount}
                            icon={<Clock className="w-4 h-4" />}
                            accentColor="amber"
                            valueColor="text-amber-500"
                            trend={pendingCount > 0 ? { value: "Action Needed", isPositive: false } : { value: "All Cleared", isPositive: true }}
                            subtext="Cheques under clearing"
                        />
                    </PageHeader.MetricGrid>
                </PageHeader.Body>

                <PageHeader.Bottom>
                    <div className="relative max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search payment #, supplier or PO ref..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/50 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium transition"
                        />
                    </div>
                </PageHeader.Bottom>
            </PageHeader>

            {/* Table */}
            <div className="bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/80 dark:bg-slate-900/40 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80 text-[11px]">
                            <tr>
                                <th className="px-5 py-3">Voucher # & Date</th>
                                <th className="px-4 py-3">Vendor / Supplier</th>
                                <th className="px-4 py-3">PO Reference</th>
                                <th className="px-4 py-3">Method</th>
                                <th className="px-4 py-3 text-right">Settled Amount (৳)</th>
                                <th className="px-4 py-3 text-center">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {filteredPayments.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                                    <td className="px-5 py-3.5">
                                        <p className="font-mono font-bold text-slate-900 dark:text-white">{p.paymentNo}</p>
                                        <p className="text-[10px] text-slate-400">{p.date}</p>
                                    </td>
                                    <td className="px-4 py-3.5 font-bold text-slate-800 dark:text-slate-200">
                                        {p.supplierName}
                                    </td>
                                    <td className="px-4 py-3.5 font-mono text-slate-500">{p.purchaseOrderRef}</td>
                                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                                        {p.paymentMethod} {p.chequeNo && `(${p.chequeNo})`}
                                    </td>
                                    <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                                        ৳ {p.paidAmount.toLocaleString('en-BD')}
                                    </td>
                                    <td className="px-4 py-3.5 text-center">
                                        <span
                                            className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                p.status === 'Settled'
                                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                                    : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                            }`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                onClick={() => onOpenEdit(p)}
                                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                                title="Edit Payment">
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => onDelete(p.id)}
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

                {/* Pagination footer */}
                <Pagination
                    totalItems={filteredPayments.length}
                    pageSize={10}
                    itemLabel="payments"
                />
            </div>

            {/* Slider Drawer */}
            <SliderDrawer
                isOpen={isDrawerOpen}
                onClose={onCloseDrawer}
                title={editingPayment ? 'Edit Settlement Slip' : 'Record Supplier Payment'}
                subtitle="Settle outstanding procurement invoices and ledger payments"
                width="max-w-lg">
                <form onSubmit={onSave} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Payment Slip #" required>
                            <input
                                type="text"
                                value={formState.paymentNo}
                                onChange={(e) => onFormFieldChange('paymentNo', e.target.value)}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                        <FormField label="Disbursement Date" required>
                            <input
                                type="date"
                                value={formState.date}
                                onChange={(e) => onFormFieldChange('date', e.target.value)}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                    </div>

                    <FormField label="Supplier / Vendor Name" required>
                        <select
                            value={formState.supplierName}
                            onChange={(e) => onFormFieldChange('supplierName', e.target.value)}
                            className={inputClasses}>
                            <option value="Apex Textiles & Fabrics Ltd.">Apex Textiles & Fabrics Ltd.</option>
                            <option value="Bengal Leather Crafts Ind.">Bengal Leather Crafts Ind.</option>
                            <option value="Royal Fragrance & Oils Ltd.">Royal Fragrance & Oils Ltd.</option>
                            <option value="Dhaka Accessories Corporation">Dhaka Accessories Corporation</option>
                        </select>
                    </FormField>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Purchase Order Ref" required>
                            <input
                                type="text"
                                placeholder="e.g. PO-2026-0041"
                                value={formState.purchaseOrderRef}
                                onChange={(e) => onFormFieldChange('purchaseOrderRef', e.target.value)}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                        <FormField label="Payment Amount (৳)" required>
                            <input
                                type="number"
                                min="0"
                                step="1000"
                                value={formState.paidAmount}
                                onChange={(e) => onFormFieldChange('paidAmount', Number(e.target.value))}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Payment Method">
                            <select
                                value={formState.paymentMethod}
                                onChange={(e) =>
                                    onFormFieldChange(
                                        'paymentMethod',
                                        e.target.value as SupplierPayment['paymentMethod']
                                    )
                                }
                                className={inputClasses}>
                                <option value="Bank Transfer">Bank Transfer (BEFTN/RTGS)</option>
                                <option value="Cheque">Account Payee Cheque</option>
                                <option value="Cash">Cash Handover</option>
                                <option value="bKash">bKash Merchant Payment</option>
                            </select>
                        </FormField>
                        <FormField label="Clearance Status">
                            <select
                                value={formState.status}
                                onChange={(e) =>
                                    onFormFieldChange('status', e.target.value as SupplierPayment['status'])
                                }
                                className={inputClasses}>
                                <option value="Settled">Settled & Reconciled</option>
                                <option value="Pending Clearance">Pending Bank Clearance</option>
                            </select>
                        </FormField>
                    </div>

                    {formState.paymentMethod === 'Cheque' && (
                        <FormField label="Cheque / Instrument Number">
                            <input
                                type="text"
                                placeholder="e.g. CHQ-998822 (City Bank)"
                                value={formState.chequeNo}
                                onChange={(e) => onFormFieldChange('chequeNo', e.target.value)}
                                className={inputClasses}
                            />
                        </FormField>
                    )}

                    <FormField label="Payment Memo & Reconciliation Remarks">
                        <textarea
                            rows={2}
                            placeholder="Bank transaction ID, invoice balancing notes..."
                            value={formState.notes}
                            onChange={(e) => onFormFieldChange('notes', e.target.value)}
                            className={inputClasses}
                        />
                    </FormField>

                    <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={onCloseDrawer}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer">
                            <Save className="w-4 h-4" />
                            <span>{editingPayment ? 'Update Payment' : 'Post Supplier Payment'}</span>
                        </button>
                    </div>
                </form>
            </SliderDrawer>
        </section>
    );
};

export default SupplierPaymentPresenter;
