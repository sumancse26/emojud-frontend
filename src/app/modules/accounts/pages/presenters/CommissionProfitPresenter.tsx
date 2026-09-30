import React from 'react';
import { DollarSign, Search, Edit3, Trash2, Save, Award, Users, Calendar } from 'lucide-react';
import { SliderDrawer, FormField, inputClasses, PageHeader } from '@/shared';
import type { CommissionRecord, CommissionProfitFormData } from '../CommissionProfitPage';

export interface CommissionProfitPresenterProps {
    commissions: CommissionRecord[];
    filteredCommissions: CommissionRecord[];
    totalEarned: number;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    isDrawerOpen: boolean;
    onCloseDrawer: () => void;
    editingItem: CommissionRecord | null;
    formState: CommissionProfitFormData;
    onFormFieldChange: <K extends keyof CommissionProfitFormData>(field: K, value: CommissionProfitFormData[K]) => void;
    onOpenCreate: () => void;
    onOpenEdit: (c: CommissionRecord) => void;
    onSave: (e: React.FormEvent) => void;
    onDelete: (id: string) => void;
}

export const CommissionProfitPresenter: React.FC<CommissionProfitPresenterProps> = ({
    commissions,
    filteredCommissions,
    totalEarned,
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
    const eligibleCount = commissions.filter((c) => c.payoutStatus === 'Eligible').length;

    return (
        <section className="space-y-6">
            <PageHeader>
                <PageHeader.Header
                    title="Sales Representative Commission & Profit Margins"
                    description="Monitor individual sales achievements, incentive calculations, and executive commissions."
                    actions={
                        <button
                            onClick={onOpenCreate}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-emerald-600/20 transition cursor-pointer">
                            <DollarSign className="w-4 h-4" />
                            <span>Calculate Commission</span>
                        </button>
                    }
                />

                <PageHeader.Body>
                    <PageHeader.MetricGrid cols={3}>
                        <PageHeader.MetricCard
                            label="Total Incentive Pool"
                            value={`৳ ${totalEarned.toLocaleString('en-BD')}`}
                            icon={<Award className="w-4 h-4" />}
                            accentColor="emerald"
                            valueColor="text-slate-900 dark:text-white"
                            subtext="Calculated rep earnings"
                        />
                        <PageHeader.MetricCard
                            label="Eligible Reps"
                            value={`${eligibleCount} / ${commissions.length}`}
                            icon={<Users className="w-4 h-4" />}
                            accentColor="blue"
                            valueColor="text-emerald-600 dark:text-emerald-400"
                            trend={{ value: "Active", isPositive: true }}
                            subtext="Met monthly quota target"
                        />
                        <PageHeader.MetricCard
                            label="Commission Month"
                            value="September 2026"
                            icon={<Calendar className="w-4 h-4" />}
                            accentColor="purple"
                            valueColor="text-purple-600 dark:text-purple-400"
                            subtext="Calculation timeline"
                        />
                    </PageHeader.MetricGrid>
                </PageHeader.Body>

                <PageHeader.Bottom>
                    <div className="relative max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search sales representative or branch..."
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
                                <th className="px-5 py-3">Sales Representative</th>
                                <th className="px-4 py-3">Assigned Branch</th>
                                <th className="px-4 py-3 text-right">Sales Target</th>
                                <th className="px-4 py-3 text-right">Actual Achievement</th>
                                <th className="px-4 py-3 text-center">Rate</th>
                                <th className="px-4 py-3 text-right">Earned Commission (৳)</th>
                                <th className="px-4 py-3 text-center">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {filteredCommissions.map((c) => (
                                <tr key={c.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                                    <td className="px-5 py-3.5">
                                        <p className="font-bold text-slate-900 dark:text-white">{c.repName}</p>
                                        <p className="text-[10px] text-slate-400">{c.month}</p>
                                    </td>
                                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 font-medium">
                                        {c.outlet}
                                    </td>
                                    <td className="px-4 py-3.5 text-right font-mono text-slate-400">
                                        ৳ {c.monthlySalesTarget.toLocaleString('en-BD')}
                                    </td>
                                    <td className="px-4 py-3.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                        ৳ {c.salesAchieved.toLocaleString('en-BD')}
                                    </td>
                                    <td className="px-4 py-3.5 text-center font-bold">{c.commissionRate}%</td>
                                    <td className="px-4 py-3.5 text-right font-mono font-black text-slate-900 dark:text-white">
                                        ৳ {c.commissionEarned.toLocaleString('en-BD')}
                                    </td>
                                    <td className="px-4 py-3.5 text-center">
                                        <span
                                            className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                c.payoutStatus === 'Paid'
                                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                                    : c.payoutStatus === 'Eligible'
                                                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                                                      : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                            }`}>
                                            {c.payoutStatus}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                onClick={() => onOpenEdit(c)}
                                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                                title="Edit Commission">
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => onDelete(c.id)}
                                                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
                                                title="Remove Entry">
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
                title={editingItem ? 'Edit Commission Slip' : 'Calculate Sales Commission'}
                subtitle="Compute performance incentives and margin payouts"
                width="max-w-lg">
                <form onSubmit={onSave} className="space-y-4">
                    <FormField label="Sales Representative Name" required>
                        <input
                            type="text"
                            placeholder="e.g. Mahbubur Rahman"
                            value={formState.repName}
                            onChange={(e) => onFormFieldChange('repName', e.target.value)}
                            className={inputClasses}
                            required
                        />
                    </FormField>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Branch / Outlet" required>
                            <select
                                value={formState.outlet}
                                onChange={(e) => onFormFieldChange('outlet', e.target.value)}
                                className={inputClasses}>
                                <option value="Dhanmondi Flagship Outlet">Dhanmondi Flagship Outlet</option>
                                <option value="Gulshan Branch Outlet">Gulshan Branch Outlet</option>
                                <option value="Uttara Mega Store">Uttara Mega Store</option>
                                <option value="Chittagong GEC Outlet">Chittagong GEC Outlet</option>
                            </select>
                        </FormField>
                        <FormField label="Target Month" required>
                            <input
                                type="text"
                                value={formState.month}
                                onChange={(e) => onFormFieldChange('month', e.target.value)}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Monthly Sales Target (৳)" required>
                            <input
                                type="number"
                                min="0"
                                step="10000"
                                value={formState.monthlySalesTarget}
                                onChange={(e) => onFormFieldChange('monthlySalesTarget', Number(e.target.value))}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                        <FormField label="Actual Sales Achieved (৳)" required>
                            <input
                                type="number"
                                min="0"
                                step="10000"
                                value={formState.salesAchieved}
                                onChange={(e) => onFormFieldChange('salesAchieved', Number(e.target.value))}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Commission Rate (%)" required>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                value={formState.commissionRate}
                                onChange={(e) => onFormFieldChange('commissionRate', Number(e.target.value))}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                        <FormField label="Payout Status">
                            <select
                                value={formState.payoutStatus}
                                onChange={(e) =>
                                    onFormFieldChange(
                                        'payoutStatus',
                                        e.target.value as CommissionRecord['payoutStatus']
                                    )
                                }
                                className={inputClasses}>
                                <option value="Eligible">Eligible for Payout</option>
                                <option value="Paid">Paid Out</option>
                                <option value="On Hold">On Hold (Target Missed)</option>
                            </select>
                        </FormField>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Estimated Commission Payable
                        </span>
                        <span className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400">
                            ৳ {((formState.salesAchieved * formState.commissionRate) / 100).toLocaleString('en-BD')}
                        </span>
                    </div>

                    <FormField label="Performance Review Remarks">
                        <textarea
                            rows={2}
                            placeholder="Target exceed note, executive commendation..."
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
                            <span>{editingItem ? 'Update Commission' : 'Save Commission'}</span>
                        </button>
                    </div>
                </form>
            </SliderDrawer>
        </section>
    );
};

export default CommissionProfitPresenter;
