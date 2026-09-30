import React from 'react';
import { Plus, Search, Edit3, Trash2, Save, CheckCircle2, Receipt, Wallet, FileText, ShieldCheck } from 'lucide-react';
import { SliderDrawer, FormField, inputClasses, PageHeader } from '@/shared';
import type { ExpenseVoucher, ExpenseFormData } from '../ExpensesPage';

export interface ExpensesPresenterProps {
    expenses: ExpenseVoucher[];
    filteredExpenses: ExpenseVoucher[];
    totalExpense: number;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    isDrawerOpen: boolean;
    onCloseDrawer: () => void;
    editingVoucher: ExpenseVoucher | null;
    formState: ExpenseFormData;
    onFormFieldChange: <K extends keyof ExpenseFormData>(field: K, value: ExpenseFormData[K]) => void;
    onOpenCreate: () => void;
    onOpenEdit: (v: ExpenseVoucher) => void;
    onSave: (e: React.FormEvent) => void;
    onDelete: (id: string) => void;
}

export const ExpensesPresenter: React.FC<ExpensesPresenterProps> = ({
    expenses,
    filteredExpenses,
    totalExpense,
    searchQuery,
    onSearchChange,
    isDrawerOpen,
    onCloseDrawer,
    editingVoucher,
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
                    title="Daily Expense Vouchers & Petty Cash"
                    description="Record utility bills, shop maintenance, courier, and miscellaneous operational costs."
                    actions={
                        <button
                            onClick={onOpenCreate}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-emerald-600/20 transition cursor-pointer">
                            <Plus className="w-4 h-4" />
                            <span>Create Expense Voucher</span>
                        </button>
                    }
                />

                <PageHeader.Body>
                    <PageHeader.MetricGrid cols={4}>
                        <PageHeader.MetricCard
                            label="Total Recorded Expenses"
                            value={`৳ ${totalExpense.toLocaleString('en-BD')}`}
                            icon={<Receipt className="w-4 h-4" />}
                            accentColor="slate"
                            subtext="Cumulative operating expense"
                        />
                        <PageHeader.MetricCard
                            label="Petty Cash Balance"
                            value="৳ 42,500"
                            icon={<Wallet className="w-4 h-4" />}
                            accentColor="emerald"
                            valueColor="text-emerald-600 dark:text-emerald-400"
                            trend={{ value: "Healthy", isPositive: true }}
                            subtext="Immediate cash in hand"
                        />
                        <PageHeader.MetricCard
                            label="Vouchers Processed"
                            value={expenses.length}
                            icon={<FileText className="w-4 h-4" />}
                            accentColor="blue"
                            valueColor="text-blue-600 dark:text-blue-400"
                            subtext="Filed and reconciled"
                        />
                        <PageHeader.MetricCard
                            label="Audit Compliance"
                            value="100%"
                            icon={<ShieldCheck className="w-4 h-4" />}
                            accentColor="purple"
                            valueColor="text-purple-600 dark:text-purple-400"
                            subtext="All receipts verified"
                        />
                    </PageHeader.MetricGrid>
                </PageHeader.Body>

                <PageHeader.Bottom>
                    <div className="relative max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search voucher #, payee or category..."
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
                            {filteredExpenses.map((exp) => (
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
                                                onClick={() => onOpenEdit(exp)}
                                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                                title="Edit Voucher">
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => onDelete(exp.id)}
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
                onClose={onCloseDrawer}
                title={editingVoucher ? 'Edit Expense Voucher' : 'Create Expense Voucher'}
                subtitle="Record store bills, maintenance, travel or petty cash expenditures"
                width="max-w-lg">
                <form onSubmit={onSave} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Voucher Ref #" required>
                            <input
                                type="text"
                                value={formState.voucherNo}
                                onChange={(e) => onFormFieldChange('voucherNo', e.target.value)}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                        <FormField label="Expense Date" required>
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
                        <FormField label="Expense Category / Head" required>
                            <select
                                value={formState.category}
                                onChange={(e) =>
                                    onFormFieldChange('category', e.target.value as ExpenseVoucher['category'])
                                }
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
                                onChange={(e) => onFormFieldChange('outlet', e.target.value)}
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
                                onChange={(e) => onFormFieldChange('paidTo', e.target.value)}
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
                                onChange={(e) => onFormFieldChange('amount', Number(e.target.value))}
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
                                    onFormFieldChange('paymentMode', e.target.value as ExpenseVoucher['paymentMode'])
                                }
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
                                    onChange={(e) => onFormFieldChange('receiptAttached', e.target.checked)}
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
                            onChange={(e) => onFormFieldChange('remarks', e.target.value)}
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
                            <span>{editingVoucher ? 'Update Voucher' : 'Post Voucher'}</span>
                        </button>
                    </div>
                </form>
            </SliderDrawer>
        </section>
    );
};

export default ExpensesPresenter;
