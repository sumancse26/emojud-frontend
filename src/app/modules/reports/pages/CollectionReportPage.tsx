import React from 'react';
import { Printer, Download } from 'lucide-react';

export const CollectionReportPage: React.FC = () => {
    const data = [
        {
            cashier: 'Sadia Afreen',
            outlet: 'Dhanmondi Outlet',
            shift: 'Morning Shift (9AM - 4PM)',
            cashCollected: 38200,
            cardCollected: 24500,
            digitalCollected: 18700,
            dueCollected: 4400,
            totalCollection: 85800
        },
        {
            cashier: 'Mahbubur Rahman',
            outlet: 'Dhanmondi Outlet',
            shift: 'Evening Shift (4PM - 10PM)',
            cashCollected: 42100,
            cardCollected: 31000,
            digitalCollected: 22400,
            dueCollected: 2500,
            totalCollection: 98000
        }
    ];

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Cashier & Shift Collection Report
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Register cash, card terminal receipts, mobile banking payments, and shift closings.
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
                            <th className="px-5 py-3">Cashier & Shift</th>
                            <th className="px-4 py-3">Outlet</th>
                            <th className="px-4 py-3 text-right">Cash (৳)</th>
                            <th className="px-4 py-3 text-right">Card POS (৳)</th>
                            <th className="px-4 py-3 text-right">bKash/MFS (৳)</th>
                            <th className="px-4 py-3 text-right">Due Collected (৳)</th>
                            <th className="px-4 py-3 text-right">Total Shift Balance (৳)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {data.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                                <td className="px-5 py-3.5">
                                    <p className="font-bold text-slate-900 dark:text-white">{row.cashier}</p>
                                    <p className="text-[10px] text-slate-400 font-medium">{row.shift}</p>
                                </td>
                                <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 font-medium">
                                    {row.outlet}
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono font-medium text-slate-800 dark:text-slate-200">
                                    ৳ {row.cashCollected.toLocaleString('en-BD')}
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono font-medium text-blue-600 dark:text-blue-400">
                                    ৳ {row.cardCollected.toLocaleString('en-BD')}
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono font-medium text-purple-600 dark:text-purple-400">
                                    ৳ {row.digitalCollected.toLocaleString('en-BD')}
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono font-medium text-emerald-600 dark:text-emerald-400">
                                    ৳ {row.dueCollected.toLocaleString('en-BD')}
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono font-black text-slate-900 dark:text-white">
                                    ৳ {row.totalCollection.toLocaleString('en-BD')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};
