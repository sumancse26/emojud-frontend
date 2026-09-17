import React, { useState } from 'react';
import { DollarSign, Edit3, Trash2, Save, Search } from 'lucide-react';
import { SliderDrawer, FormField, inputClasses } from '@/shared';

interface SalaryRecord {
    id: string;
    empCode: string;
    empName: string;
    department: string;
    month: string;
    basePay: number;
    allowances: number;
    deductions: number;
    netPayable: number;
    paymentStatus: 'Paid' | 'Processing' | 'On Hold';
    paymentMethod: 'Bank Transfer' | 'Cash' | 'bKash';
    paymentDate: string;
    notes: string;
}

const INITIAL_SALARIES: SalaryRecord[] = [
    {
        id: '1',
        empCode: 'EMP-1001',
        empName: 'Tanvir Hossain',
        department: 'Operations',
        month: 'September 2026',
        basePay: 65000,
        allowances: 5000,
        deductions: 2000,
        netPayable: 68000,
        paymentStatus: 'Paid',
        paymentMethod: 'Bank Transfer',
        paymentDate: '2026-09-01',
        notes: 'Monthly sales performance incentive included'
    },
    {
        id: '2',
        empCode: 'EMP-1002',
        empName: 'Sadia Afreen',
        department: 'Finance & Accounts',
        month: 'September 2026',
        basePay: 32000,
        allowances: 2500,
        deductions: 1000,
        netPayable: 33500,
        paymentStatus: 'Paid',
        paymentMethod: 'Bank Transfer',
        paymentDate: '2026-09-01',
        notes: 'Standard payroll slip'
    },
    {
        id: '3',
        empCode: 'EMP-1003',
        empName: 'Nusrat Jahan',
        department: 'Operations',
        month: 'September 2026',
        basePay: 62000,
        allowances: 4000,
        deductions: 1500,
        netPayable: 64500,
        paymentStatus: 'Paid',
        paymentMethod: 'Bank Transfer',
        paymentDate: '2026-09-01',
        notes: 'Outlet manager remuneration'
    },
    {
        id: '4',
        empCode: 'EMP-1004',
        empName: 'Kamrul Islam',
        department: 'Supply Chain',
        month: 'September 2026',
        basePay: 55000,
        allowances: 3500,
        deductions: 1200,
        netPayable: 57300,
        paymentStatus: 'Paid',
        paymentMethod: 'Bank Transfer',
        paymentDate: '2026-09-01',
        notes: 'Warehouse operations allowance'
    }
];

export const SalaryPage: React.FC = () => {
    const [salaries, setSalaries] = useState<SalaryRecord[]>(INITIAL_SALARIES);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<SalaryRecord | null>(null);

    const [formState, setFormState] = useState({
        empCode: '',
        empName: '',
        department: 'Operations',
        month: 'September 2026',
        basePay: 30000,
        allowances: 2000,
        deductions: 1000,
        paymentStatus: 'Paid' as 'Paid' | 'Processing' | 'On Hold',
        paymentMethod: 'Bank Transfer' as 'Bank Transfer' | 'Cash' | 'bKash',
        paymentDate: new Date().toISOString().split('T')[0],
        notes: ''
    });

    const handleOpenCreate = () => {
        setEditingRecord(null);
        setFormState({
            empCode: `EMP-${Math.floor(1005 + Math.random() * 50)}`,
            empName: '',
            department: 'Operations',
            month: 'September 2026',
            basePay: 35000,
            allowances: 3000,
            deductions: 1000,
            paymentStatus: 'Paid',
            paymentMethod: 'Bank Transfer',
            paymentDate: new Date().toISOString().split('T')[0],
            notes: ''
        });
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (rec: SalaryRecord) => {
        setEditingRecord(rec);
        setFormState({
            empCode: rec.empCode,
            empName: rec.empName,
            department: rec.department,
            month: rec.month,
            basePay: rec.basePay,
            allowances: rec.allowances,
            deductions: rec.deductions,
            paymentStatus: rec.paymentStatus,
            paymentMethod: rec.paymentMethod,
            paymentDate: rec.paymentDate,
            notes: rec.notes
        });
        setIsDrawerOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const netPayable = formState.basePay + formState.allowances - formState.deductions;
        if (editingRecord) {
            setSalaries((prev) =>
                prev.map((s) => (s.id === editingRecord.id ? { ...s, ...formState, netPayable } : s))
            );
        } else {
            const newRecord: SalaryRecord = {
                id: Date.now().toString(),
                ...formState,
                netPayable
            };
            setSalaries((prev) => [newRecord, ...prev]);
        }
        setIsDrawerOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this payroll disbursement entry?')) {
            setSalaries((prev) => prev.filter((s) => s.id !== id));
        }
    };

    const totalDisbursed = salaries.reduce((acc, s) => acc + s.netPayable, 0);

    const filtered = salaries.filter(
        (s) =>
            s.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Salary & Payroll Disbursement
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Monthly payroll sheets, employee payslips, tax deductions, and bank disbursement runs.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        onClick={handleOpenCreate}
                        className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer">
                        <DollarSign className="w-4 h-4" />
                        <span>Process Salary Entry</span>
                    </button>
                </div>
            </div>

            {/* Metric KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <span className="text-[11px] font-bold uppercase text-slate-400">Total Month Payroll</span>
                    <p className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">
                        ৳ {totalDisbursed.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <span className="text-[11px] font-bold uppercase text-slate-400">Employees Paid</span>
                    <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                        {salaries.filter((s) => s.paymentStatus === 'Paid').length} / {salaries.length}
                    </p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <span className="text-[11px] font-bold uppercase text-slate-400">Payroll Cycle</span>
                    <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                        September 2026
                    </p>
                </div>
            </div>

            {/* Filter */}
            <div className="relative max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search employee name, code, or department..."
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
                            {filtered.map((s) => (
                                <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                                    <td className="px-5 py-3.5">
                                        <p className="font-bold text-slate-900 dark:text-white">{s.empName}</p>
                                        <p className="text-[10px] text-slate-400 font-mono">{s.empCode} • {s.month}</p>
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
                                                onClick={() => handleOpenEdit(s)}
                                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                                title="Edit Slip">
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(s.id)}
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
            </div>

            {/* Slider Drawer */}
            <SliderDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title={editingRecord ? 'Edit Salary Slip' : 'Process Salary Slip'}
                subtitle="Calculate net disbursement, bonuses, and statutory deductions"
                width="max-w-lg">
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Employee Code" required>
                            <input
                                type="text"
                                value={formState.empCode}
                                onChange={(e) => setFormState({ ...formState, empCode: e.target.value })}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                        <FormField label="Salary Month" required>
                            <input
                                type="text"
                                value={formState.month}
                                onChange={(e) => setFormState({ ...formState, month: e.target.value })}
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
                            onChange={(e) => setFormState({ ...formState, empName: e.target.value })}
                            className={inputClasses}
                            required
                        />
                    </FormField>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Department" required>
                            <select
                                value={formState.department}
                                onChange={(e) => setFormState({ ...formState, department: e.target.value })}
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
                                onChange={(e) => setFormState({ ...formState, paymentStatus: e.target.value as any })}
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
                                onChange={(e) => setFormState({ ...formState, basePay: Number(e.target.value) })}
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
                                onChange={(e) => setFormState({ ...formState, allowances: Number(e.target.value) })}
                                className={inputClasses}
                            />
                        </FormField>
                        <FormField label="Deductions (৳)">
                            <input
                                type="number"
                                min="0"
                                step="100"
                                value={formState.deductions}
                                onChange={(e) => setFormState({ ...formState, deductions: Number(e.target.value) })}
                                className={inputClasses}
                            />
                        </FormField>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Net Calculated Payable</span>
                        <span className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400">
                            ৳ {(formState.basePay + formState.allowances - formState.deductions).toLocaleString('en-BD')}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Disbursement Method">
                            <select
                                value={formState.paymentMethod}
                                onChange={(e) => setFormState({ ...formState, paymentMethod: e.target.value as any })}
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
                                onChange={(e) => setFormState({ ...formState, paymentDate: e.target.value })}
                                className={inputClasses}
                            />
                        </FormField>
                    </div>

                    <FormField label="Payroll Notes & Breakdown">
                        <textarea
                            rows={2}
                            placeholder="Performance incentive, unpaid leave deductions..."
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
                            <span>{editingRecord ? 'Update Payslip' : 'Record Salary Slip'}</span>
                        </button>
                    </div>
                </form>
            </SliderDrawer>
        </section>
    );
};
