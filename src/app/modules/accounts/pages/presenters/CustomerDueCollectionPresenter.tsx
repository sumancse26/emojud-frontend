import React from 'react';
import { Plus, Search, Edit3, Trash2, Save, HandCoins, Receipt, TrendingUp } from 'lucide-react';
import { SliderDrawer, FormField, inputClasses, PageHeader, Pagination } from '@/shared';
import type { DueCollection, DueCollectionFormData } from '../CustomerDueCollectionPage';

export interface CustomerDueCollectionPresenterProps {
    collections: DueCollection[];
    filteredCollections: DueCollection[];
    totalCollected: number;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    isDrawerOpen: boolean;
    onCloseDrawer: () => void;
    editingItem: DueCollection | null;
    formState: DueCollectionFormData;
    onFormFieldChange: <K extends keyof DueCollectionFormData>(field: K, value: DueCollectionFormData[K]) => void;
    onOpenCreate: () => void;
    onOpenEdit: (item: DueCollection) => void;
    onSave: (e: React.FormEvent) => void;
    onDelete: (id: string) => void;
}

export const CustomerDueCollectionPresenter: React.FC<CustomerDueCollectionPresenterProps> = ({
    collections,
    filteredCollections,
    totalCollected,
    searchQuery,
    onSearchChange,
    isDrawerOpen,
    onCloseDrawer,
    editingItem,
    formState,
    onFormFieldChange,
    onOpenCreate,
    onOpenEdit,
    onSave,
    onDelete
}) => {
    return (
        <section className="space-y-6">
            <PageHeader>
                <PageHeader.Header
                    title="Customer Due Collection Receipts"
                    description="Collect outstanding customer credit dues, print money receipts, and adjust sales balances."
                    actions={
                        <button
                            onClick={onOpenCreate}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-emerald-600/20 transition cursor-pointer">
                            <Plus className="w-4 h-4" />
                            <span>Collect New Due</span>
                        </button>
                    }
                />

                <PageHeader.Body>
                    <PageHeader.MetricGrid cols={3}>
                        <PageHeader.MetricCard
                            label="Total Due Collections"
                            value={`৳ ${totalCollected.toLocaleString('en-BD')}`}
                            icon={<HandCoins className="w-4 h-4" />}
                            accentColor="emerald"
                            valueColor="text-emerald-600 dark:text-emerald-400"
                            subtext="Total cash & bank recovery"
                        />
                        <PageHeader.MetricCard
                            label="Total Receipts Issued"
                            value={collections.length}
                            icon={<Receipt className="w-4 h-4" />}
                            accentColor="blue"
                            valueColor="text-blue-600 dark:text-blue-400"
                            subtext="Settled money vouchers"
                        />
                        <PageHeader.MetricCard
                            label="Collection Success"
                            value="98.5%"
                            icon={<TrendingUp className="w-4 h-4" />}
                            accentColor="purple"
                            valueColor="text-purple-600 dark:text-purple-400"
                            trend={{ value: "+2.4%", isPositive: true }}
                            subtext="Monthly recovery rate"
                        />
                    </PageHeader.MetricGrid>
                </PageHeader.Body>

                <PageHeader.Bottom>
                    <div className="relative max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search receipt #, customer name, or mobile..."
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
                                <th className="px-5 py-3">Receipt # & Date</th>
                                <th className="px-4 py-3">Customer Account</th>
                                <th className="px-4 py-3">Sales Invoice</th>
                                <th className="px-4 py-3">Mode</th>
                                <th className="px-4 py-3 text-right">Collected (৳)</th>
                                <th className="px-4 py-3 text-right">Remaining Due</th>
                                <th className="px-4 py-3">Cashier</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {filteredCollections.map((c) => (
                                <tr key={c.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                                    <td className="px-5 py-3.5">
                                        <p className="font-mono font-bold text-slate-900 dark:text-white">{c.receiptNo}</p>
                                        <p className="text-[10px] text-slate-400">{c.date}</p>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <p className="font-bold text-slate-800 dark:text-slate-200">{c.customerName}</p>
                                        <p className="text-[10px] text-slate-400 font-mono">{c.customerPhone}</p>
                                    </td>
                                    <td className="px-4 py-3.5 font-mono text-slate-500">{c.invoiceRef}</td>
                                    <td className="px-4 py-3.5">
                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                            {c.paymentMode}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                                        ৳ {c.collectedAmount.toLocaleString('en-BD')}
                                    </td>
                                    <td className="px-4 py-3.5 text-right font-mono text-rose-500">
                                        {c.remainingDue > 0 ? `৳ ${c.remainingDue.toLocaleString('en-BD')}` : 'Cleared'}
                                    </td>
                                    <td className="px-4 py-3.5 text-slate-500">{c.cashier}</td>
                                    <td className="px-4 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                onClick={() => onOpenEdit(c)}
                                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                                title="Edit Receipt">
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => onDelete(c.id)}
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

                {/* Pagination footer */}
                <Pagination
                    totalItems={filteredCollections.length}
                    pageSize={10}
                    itemLabel="collections"
                />
            </div>

            {/* Slider Drawer */}
            <SliderDrawer
                isOpen={isDrawerOpen}
                onClose={onCloseDrawer}
                title={editingItem ? 'Edit Due Collection Slip' : 'Collect Customer Due'}
                subtitle="Receive installment credit payments against active sales ledger invoices"
                width="max-w-lg">
                <form onSubmit={onSave} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Money Receipt #" required>
                            <input
                                type="text"
                                value={formState.receiptNo}
                                onChange={(e) => onFormFieldChange('receiptNo', e.target.value)}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                        <FormField label="Collection Date" required>
                            <input
                                type="date"
                                value={formState.date}
                                onChange={(e) => onFormFieldChange('date', e.target.value)}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Customer Name" required>
                            <input
                                type="text"
                                placeholder="e.g. Rahim Chowdhury"
                                value={formState.customerName}
                                onChange={(e) => onFormFieldChange('customerName', e.target.value)}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                        <FormField label="Contact Phone" required>
                            <input
                                type="text"
                                placeholder="+880 1712-XXXXXX"
                                value={formState.customerPhone}
                                onChange={(e) => onFormFieldChange('customerPhone', e.target.value)}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Invoice Reference #" required>
                            <input
                                type="text"
                                placeholder="e.g. INV-2026-0045"
                                value={formState.invoiceRef}
                                onChange={(e) => onFormFieldChange('invoiceRef', e.target.value)}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                        <FormField label="Collected Amount (৳)" required>
                            <input
                                type="number"
                                min="0"
                                step="100"
                                value={formState.collectedAmount}
                                onChange={(e) => onFormFieldChange('collectedAmount', Number(e.target.value))}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Payment Method">
                            <select
                                value={formState.paymentMode}
                                onChange={(e) =>
                                    onFormFieldChange(
                                        'paymentMode',
                                        e.target.value as DueCollection['paymentMode']
                                    )
                                }
                                className={inputClasses}>
                                <option value="Cash">Cash (Counter POS)</option>
                                <option value="bKash">bKash (Merchant / Personal)</option>
                                <option value="Card">Credit / Debit POS Card</option>
                                <option value="Nagad">Nagad Direct</option>
                            </select>
                        </FormField>
                        <FormField label="Remaining Due After Collection (৳)">
                            <input
                                type="number"
                                min="0"
                                value={formState.remainingDue}
                                onChange={(e) => onFormFieldChange('remainingDue', Number(e.target.value))}
                                className={inputClasses}
                            />
                        </FormField>
                    </div>

                    <FormField label="Collection Remarks & Money Receipt Notes">
                        <textarea
                            rows={2}
                            placeholder="Next payment promise date, installment count..."
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
                            <span>{editingItem ? 'Update Receipt' : 'Save Money Receipt'}</span>
                        </button>
                    </div>
                </form>
            </SliderDrawer>
        </section>
    );
};

export default CustomerDueCollectionPresenter;
