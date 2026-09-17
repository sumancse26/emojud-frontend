import React from 'react';
import { Printer, Download } from 'lucide-react';

export const DailyExpenseReportPage: React.FC = () => {
    const data = [
        {
            voucher: 'EXP-2026-081',
            date: '17 Sep 2026',
            category: 'Store Utility',
            outlet: 'Dhanmondi Outlet',
            amount: 8500,
            beneficiary: 'DPDC Electricity Bill',
            paymentMode: 'Bank Transfer'
        },
        {
            voucher: 'EXP-2026-082',
            date: '17 Sep 2026',
            category: 'Packaging Materials',
            outlet: 'Central WH (Savar)',
            amount: 24000,
            beneficiary: 'Ideal Carton Mills',
            paymentMode: 'Bank Transfer'
        },
        {
            voucher: 'EXP-2026-083',
            date: '17 Sep 2026',
            category: 'Logistics & Fuel',
            outlet: 'Gulshan Outlet',
            amount: 3200,
            beneficiary: 'Inter-branch Delivery Van',
            paymentMode: 'Cash'
        }
    ];

    const total = data.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Daily Expense Audit Report
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Overhead disbursements, petty cash transactions, and voucher approvals.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer">
                        <Printer className="w-4 h-4" />
                        <span>Print</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer">
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/80 dark:bg-slate-900/40 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80 text-[11px]">
                        <tr>
                            <th className="px-5 py-3">Voucher # & Date</th>
                            <th className="px-4 py-3">Expense Head</th>
                            <th className="px-4 py-3">Branch Location</th>
                            <th className="px-4 py-3">Paid Beneficiary</th>
                            <th className="px-4 py-3">Mode</th>
                            <th className="px-4 py-3 text-right">Disbursed (৳)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {data.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                                <td className="px-5 py-3.5 font-mono text-slate-400 font-bold">
                                    {row.voucher}
                                </td>
                                <td className="px-4 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                                    {row.category}
                                </td>
                                <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                                    {row.outlet}
                                </td>
                                <td className="px-4 py-3.5 text-slate-500">
                                    {row.beneficiary}
                                </td>
                                <td className="px-4 py-3.5 text-slate-500 font-medium">
                                    {row.paymentMode}
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono font-black text-rose-500">
                                    ৳ {row.amount.toLocaleString('en-BD')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 font-bold">
                        <tr>
                            <td colSpan={5} className="px-5 py-3 text-right text-slate-600 dark:text-slate-300">
                                Total Daily Overhead:
                            </td>
                            <td className="px-4 py-3 text-right font-mono font-black text-rose-600 dark:text-rose-400">
                                ৳ {total.toLocaleString('en-BD')}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </section>
    );
};
