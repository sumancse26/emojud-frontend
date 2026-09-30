import React from 'react';
import { DollarSign, Edit3, Trash2, Save, Search, Coins, CheckCircle2, Calendar } from 'lucide-react';
import { SliderDrawer, FormField, inputClasses, PageHeader, Pagination } from '@/shared';
import type { SalaryRecord, SalaryFormData } from '../SalaryPage';

export interface SalaryPresenterProps {
    salaries: SalaryRecord[];
    filteredSalaries: SalaryRecord[];
    totalDisbursed: number;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    isDrawerOpen: boolean;
    onCloseDrawer: () => void;
    editingRecord: SalaryRecord | null;
    formState: SalaryFormData;
    onFormFieldChange: <K extends keyof SalaryFormData>(field: K, value: SalaryFormData[K]) => void;
    onOpenCreate: () => void;
    onOpenEdit: (rec: SalaryRecord) => void;
    onSave: (e: React.FormEvent) => void;
    onDelete: (id: string) => void;
}

export const SalaryPresenter: React.FC<SalaryPresenterProps> = ({
    salaries,
    filteredSalaries,
    totalDisbursed,
    searchQuery,
    onSearchChange,
    isDrawerOpen,
    onCloseDrawer,
    editingRecord,
    formState,
    onFormFieldChange,
    onOpenCreate,
    onOpenEdit,
    onSave,
    onDelete
}) => {
    const paidCount = salaries.filter((s) => s.paymentStatus === 'Paid').length;

    return (
        <section className="space-y-6">
            <PageHeader>
                <PageHeader.Header
                    title="Salary & Payroll Disbursement"
                    description="Monthly payroll sheets, employee payslips, tax deductions, and bank disbursement runs."
                    actions={
                        <button
                            onClick={onOpenCreate}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-emerald-600/20 transition cursor-pointer">
                            <DollarSign className="w-4 h-4" />
                            <span>Process Salary Entry</span>
                        </button>
                    }
                />

                <PageHeader.Body>
                    <PageHeader.MetricGrid cols={3}>
                        <PageHeader.MetricCard
                            label="Total Month Payroll"
                            value={`৳ ${totalDisbursed.toLocaleString('en-BD', { minimumFractionDigits: 2 })}`}
                            icon={<Coins className="w-4 h-4" />}
                            accentColor="slate"
                            subtext="Net disbursed to staff"
                        />
                        <PageHeader.MetricCard
                            label="Employees Paid"
                            value={`${paidCount} / ${salaries.length}`}
                            icon={<CheckCircle2 className="w-4 h-4" />}
                            accentColor="emerald"
                            valueColor="text-emerald-600 dark:text-emerald-400"
                            trend={{ value: `${Math.round((paidCount / (salaries.length || 1)) * 100)}% Settled`, isPositive: true }}
                            subtext="Payroll vouchers executed"
                        />
                        <PageHeader.MetricCard
                            label="Payroll Cycle"
                            value="September 2026"
                            icon={<Calendar className="w-4 h-4" />}
                            accentColor="blue"
                            valueColor="text-blue-600 dark:text-blue-400"
                            subtext="Current active period"
                        />
                    </PageHeader.MetricGrid>
                </PageHeader.Body>

                <PageHeader.Bottom>
                    <div className="relative max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search employee name, code, or department..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/50 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium transition"
                        />
                    </div>
                </PageHeader.Bottom>
            </PageHeader>

            <div className="bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/80 dark:bg-slate-900/40 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80 text-[11px]">
                            <tr>
                                <th className="px-5 py-3">Employee</th>
                                <th className="px-4 py-3">Department</th>
                                <th className="px-4 py-3 text-right">Base Salary</th>
                                <th className="px-4 py-3 text-right">Allowances</th>
                                <th className="px-4 py-3 text-right">Deductions</th>
                                <th className="px-4 py-3 text-right">Net Payable (৳)</th>
                                <th className="px-4 py-3 text-center">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {filteredSalaries.map((s) => (
                                <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                                    <td className="px-5 py-3.5">
                                        <p className="font-bold text-slate-900 dark:text-white">{s.empName}</p>
                                        <p className="text-[10px] text-slate-400 font-mono">
                                            {s.empCode} • {s.month}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 font-medium">
                                        {s.department}
                                    </td>
                                    <td className="px-4 py-3.5 text-right font-mono text-slate-500">
                                        ৳ {s.basePay.toLocaleString('en-BD')}
                                    </td>
                                    <td className="px-4 py-3.5 text-right font-mono text-emerald-600 dark:text-emerald-400">
                                        +৳ {s.allowances.toLocaleString('en-BD')}
                                    </td>
                                    <td className="px-4 py-3.5 text-right font-mono text-rose-500">
                                        -৳ {s.deductions.toLocaleString('en-BD')}
                                    </td>
                                    <td className="px-4 py-3.5 text-right font-mono font-black text-slate-900 dark:text-white">
                                        ৳ {s.netPayable.toLocaleString('en-BD')}
                                    </td>
                                    <td className="px-4 py-3.5 text-center">
                                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                            {s.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                onClick={() => onOpenEdit(s)}
                                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                                title="Edit Slip">
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => onDelete(s.id)}
                                                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
                                                title="Delete Slip">
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
                    totalItems={filteredSalaries.length}
                    pageSize={10}
                    itemLabel="payroll slips"
                />
            </div>

            {/* Slider Drawer */}
            <SliderDrawer
                isOpen={isDrawerOpen}
                onClose={onCloseDrawer}
                title={editingRecord ? 'Edit Salary Slip' : 'Process Salary Slip'}
                subtitle="Calculate net disbursement, bonuses, and statutory deductions"
                width="max-w-lg">
                <form onSubmit={onSave} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Employee Code" required>
                            <input
                                type="text"
                                value={formState.empCode}
                                onChange={(e) => onFormFieldChange('empCode', e.target.value)}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                        <FormField label="Salary Month" required>
                            <input
                                type="text"
                                value={formState.month}
                                onChange={(e) => onFormFieldChange('month', e.target.value)}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                    </div>

                    <FormField label="Employee Name" required>
                        <input
                            type="text"
                            placeholder="e.g. Tanvir Hossain"
                            value={formState.empName}
                            onChange={(e) => onFormFieldChange('empName', e.target.value)}
                            className={inputClasses}
                            required
                        />
                    </FormField>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Department" required>
                            <select
                                value={formState.department}
                                onChange={(e) => onFormFieldChange('department', e.target.value)}
                                className={inputClasses}>
                                <option value="Operations">Operations</option>
                                <option value="Finance & Accounts">Finance & Accounts</option>
                                <option value="Supply Chain">Supply Chain</option>
                                <option value="Human Resources">Human Resources</option>
                            </select>
                        </FormField>
                        <FormField label="Payment Status">
                            <select
                                value={formState.paymentStatus}
                                onChange={(e) =>
                                    onFormFieldChange('paymentStatus', e.target.value as SalaryRecord['paymentStatus'])
                                }
                                className={inputClasses}>
                                <option value="Paid">Paid</option>
                                <option value="Processing">Processing</option>
                                <option value="On Hold">On Hold</option>
                            </select>
                        </FormField>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <FormField label="Base Pay (৳)" required>
                            <input
                                type="number"
                                min="0"
                                step="500"
                                value={formState.basePay}
                                onChange={(e) => onFormFieldChange('basePay', Number(e.target.value))}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                        <FormField label="Allowances (৳)">
                            <input
                                type="number"
                                min="0"
                                step="100"
                                value={formState.allowances}
                                onChange={(e) => onFormFieldChange('allowances', Number(e.target.value))}
                                className={inputClasses}
                            />
                        </FormField>
                        <FormField label="Deductions (৳)">
                            <input
                                type="number"
                                min="0"
                                step="100"
                                value={formState.deductions}
                                onChange={(e) => onFormFieldChange('deductions', Number(e.target.value))}
                                className={inputClasses}
                            />
                        </FormField>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Net Calculated Payable
                        </span>
                        <span className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400">
                            ৳ {(formState.basePay + formState.allowances - formState.deductions).toLocaleString('en-BD')}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Disbursement Method">
                            <select
                                value={formState.paymentMethod}
                                onChange={(e) =>
                                    onFormFieldChange('paymentMethod', e.target.value as SalaryRecord['paymentMethod'])
                                }
                                className={inputClasses}>
                                <option value="Bank Transfer">Bank Transfer (EBL/City)</option>
                                <option value="Cash">Cash Handover</option>
                                <option value="bKash">bKash Payroll</option>
                            </select>
                        </FormField>
                        <FormField label="Disbursement Date">
                            <input
                                type="date"
                                value={formState.paymentDate}
                                onChange={(e) => onFormFieldChange('paymentDate', e.target.value)}
                                className={inputClasses}
                            />
                        </FormField>
                    </div>

                    <FormField label="Payroll Notes & Breakdown">
                        <textarea
                            rows={2}
                            placeholder="Performance incentive, unpaid leave deductions..."
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
                            <span>{editingRecord ? 'Update Payslip' : 'Record Salary Slip'}</span>
                        </button>
                    </div>
                </form>
            </SliderDrawer>
        </section>
    );
};

export default SalaryPresenter;
