import React, { useState } from 'react';
import { DollarSign, Search, Edit3, Trash2, Save } from 'lucide-react';
import { SliderDrawer, FormField, inputClasses } from '@/shared';

interface CommissionRecord {
    id: string;
    repName: string;
    outlet: string;
    monthlySalesTarget: number;
    salesAchieved: number;
    commissionRate: number;
    commissionEarned: number;
    payoutStatus: 'Paid' | 'Eligible' | 'On Hold';
    month: string;
    notes: string;
}

const INITIAL_COMMISSIONS: CommissionRecord[] = [
    {
        id: '1',
        repName: 'Mahbubur Rahman',
        outlet: 'Dhanmondi Flagship Outlet',
        monthlySalesTarget: 500000,
        salesAchieved: 620000,
        commissionRate: 2.5,
        commissionEarned: 15500,
        payoutStatus: 'Eligible',
        month: 'September 2026',
        notes: 'Target exceeded by 24%'
    },
    {
        id: '2',
        repName: 'Arif Ahmed',
        outlet: 'Gulshan Branch Outlet',
        monthlySalesTarget: 450000,
        salesAchieved: 490000,
        commissionRate: 2.0,
        commissionEarned: 9800,
        payoutStatus: 'Eligible',
        month: 'September 2026',
        notes: 'Target achieved successfully'
    },
    {
        id: '3',
        repName: 'Nusrat Jahan',
        outlet: 'Dhanmondi Flagship Outlet',
        monthlySalesTarget: 400000,
        salesAchieved: 420000,
        commissionRate: 2.0,
        commissionEarned: 8400,
        payoutStatus: 'Paid',
        month: 'August 2026',
        notes: 'Disbursed with August salary'
    }
];

export const CommissionProfitPage: React.FC = () => {
    const [commissions, setCommissions] = useState<CommissionRecord[]>(INITIAL_COMMISSIONS);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<CommissionRecord | null>(null);

    const [formState, setFormState] = useState({
        repName: '',
        outlet: 'Dhanmondi Flagship Outlet',
        monthlySalesTarget: 500000,
        salesAchieved: 550000,
        commissionRate: 2.5,
        payoutStatus: 'Eligible' as CommissionRecord['payoutStatus'],
        month: 'September 2026',
        notes: ''
    });

    const handleOpenCreate = () => {
        setEditingItem(null);
        setFormState({
            repName: '',
            outlet: 'Dhanmondi Flagship Outlet',
            monthlySalesTarget: 500000,
            salesAchieved: 550000,
            commissionRate: 2.5,
            payoutStatus: 'Eligible',
            month: 'September 2026',
            notes: ''
        });
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (c: CommissionRecord) => {
        setEditingItem(c);
        setFormState({
            repName: c.repName,
            outlet: c.outlet,
            monthlySalesTarget: c.monthlySalesTarget,
            salesAchieved: c.salesAchieved,
            commissionRate: c.commissionRate,
            payoutStatus: c.payoutStatus,
            month: c.month,
            notes: c.notes
        });
        setIsDrawerOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const commissionEarned = (formState.salesAchieved * formState.commissionRate) / 100;
        if (editingItem) {
            setCommissions((prev) =>
                prev.map((item) =>
                    item.id === editingItem.id
                        ? { ...item, ...formState, commissionEarned }
                        : item
                )
            );
        } else {
            const newItem: CommissionRecord = {
                id: Date.now().toString(),
                ...formState,
                commissionEarned
            };
            setCommissions((prev) => [newItem, ...prev]);
        }
        setIsDrawerOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to remove this commission entry?')) {
            setCommissions((prev) => prev.filter((item) => item.id !== id));
        }
    };

    const totalEarned = commissions.reduce((acc, c) => acc + c.commissionEarned, 0);

    const filtered = commissions.filter(
        (c) =>
            c.repName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.outlet.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Sales Representative Commission & Profit Margins
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Monitor individual sales achievements, incentive calculations, and executive commissions.
                    </p>
                </div>

                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer self-start sm:self-auto">
                    <DollarSign className="w-4 h-4" />
                    <span>Calculate Commission</span>
                </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Incentive Pool</span>
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
                        ৳ {totalEarned.toLocaleString('en-BD')}
                    </p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Eligible Reps</span>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                        {commissions.filter((c) => c.payoutStatus === 'Eligible').length}
                    </p>
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Avg Target Achievement</span>
                    <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">118%</p>
                </div>
            </div>

            {/* Filter */}
            <div className="relative max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search sales representative or branch..."
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
                                <th className="px-5 py-3">Sales Executive & Month</th>
                                <th className="px-4 py-3">Store Outlet</th>
                                <th className="px-4 py-3 text-right">Target (৳)</th>
                                <th className="px-4 py-3 text-right">Achieved Sales (৳)</th>
                                <th className="px-4 py-3 text-right">Rate</th>
                                <th className="px-4 py-3 text-right">Earned Payout (৳)</th>
                                <th className="px-4 py-3 text-center">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {filtered.map((comm) => (
                                <tr key={comm.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                                    <td className="px-5 py-3.5">
                                        <p className="font-bold text-slate-900 dark:text-white">{comm.repName}</p>
                                        <p className="text-[10px] text-slate-400 font-mono">{comm.month}</p>
                                    </td>
                                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 font-medium">
                                        {comm.outlet}
                                    </td>
                                    <td className="px-4 py-3.5 text-right font-mono text-slate-500">
                                        ৳ {comm.monthlySalesTarget.toLocaleString('en-BD')}
                                    </td>
                                    <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                                        ৳ {comm.salesAchieved.toLocaleString('en-BD')}
                                    </td>
                                    <td className="px-4 py-3.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                        {comm.commissionRate}%
                                    </td>
                                    <td className="px-4 py-3.5 text-right font-mono font-black text-slate-900 dark:text-white">
                                        ৳ {comm.commissionEarned.toLocaleString('en-BD')}
                                    </td>
                                    <td className="px-4 py-3.5 text-center">
                                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                            comm.payoutStatus === 'Paid'
                                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                                : comm.payoutStatus === 'Eligible'
                                                ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                                                : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                                        }`}>
                                            {comm.payoutStatus}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                onClick={() => handleOpenEdit(comm)}
                                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                                title="Edit Commission">
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(comm.id)}
                                                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
                                                title="Delete Record">
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
                title={editingItem ? 'Edit Commission Slip' : 'Calculate Sales Commission'}
                subtitle="Calculate sales quota achievements and monthly commissions"
                width="max-w-lg">
                <form onSubmit={handleSave} className="space-y-4">
                    <FormField label="Sales Representative Name" required>
                        <input
                            type="text"
                            placeholder="e.g. Mahbubur Rahman"
                            value={formState.repName}
                            onChange={(e) => setFormState({ ...formState, repName: e.target.value })}
                            className={inputClasses}
                            required
                        />
                    </FormField>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Assigned Outlet" required>
                            <select
                                value={formState.outlet}
                                onChange={(e) => setFormState({ ...formState, outlet: e.target.value })}
                                className={inputClasses}>
                                <option value="Dhanmondi Flagship Outlet">Dhanmondi Flagship Outlet</option>
                                <option value="Gulshan Branch Outlet">Gulshan Branch Outlet</option>
                                <option value="Uttara Sector 3 Branch">Uttara Sector 3 Branch</option>
                            </select>
                        </FormField>
                        <FormField label="Target Month" required>
                            <input
                                type="text"
                                value={formState.month}
                                onChange={(e) => setFormState({ ...formState, month: e.target.value })}
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
                                onChange={(e) => setFormState({ ...formState, monthlySalesTarget: Number(e.target.value) })}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                        <FormField label="Actual Achieved Sales (৳)" required>
                            <input
                                type="number"
                                min="0"
                                step="1000"
                                value={formState.salesAchieved}
                                onChange={(e) => setFormState({ ...formState, salesAchieved: Number(e.target.value) })}
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
                                onChange={(e) => setFormState({ ...formState, commissionRate: Number(e.target.value) })}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                        <FormField label="Payout Status">
                            <select
                                value={formState.payoutStatus}
                                onChange={(e) => setFormState({ ...formState, payoutStatus: e.target.value as any })}
                                className={inputClasses}>
                                <option value="Eligible">Eligible</option>
                                <option value="Paid">Paid</option>
                                <option value="On Hold">On Hold</option>
                            </select>
                        </FormField>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Total Calculated Incentive</span>
                        <span className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400">
                            ৳ {((formState.salesAchieved * formState.commissionRate) / 100).toLocaleString('en-BD')}
                        </span>
                    </div>

                    <FormField label="Notes & Remarks">
                        <textarea
                            rows={2}
                            placeholder="Special promo bonus, quota adjustment notes..."
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
                            <span>{editingItem ? 'Update Commission' : 'Save Commission'}</span>
                        </button>
                    </div>
                </form>
            </SliderDrawer>
        </section>
    );
};
