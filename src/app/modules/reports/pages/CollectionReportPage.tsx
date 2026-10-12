import React from 'react';
import { Printer, Download } from 'lucide-react';
import { ReportDisplayShell } from '../components/ReportDisplayShell';

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
        <section className="display-report-page print-report-page space-y-6">
            <ReportDisplayShell
                title="Cashier & Shift Collection Report"
                metrics={[
                    { label: 'Shifts', value: String(data.length) },
                    {
                        label: 'Cash',
                        value: `৳ ${data.reduce((sum, row) => sum + row.cashCollected, 0).toLocaleString('en-BD')}`,
                        color: 'text-emerald-600'
                    },
                    {
                        label: 'Digital',
                        value: `৳ ${data.reduce((sum, row) => sum + row.cardCollected + row.digitalCollected, 0).toLocaleString('en-BD')}`,
                        color: 'text-blue-600'
                    },
                    {
                        label: 'Total collection',
                        value: `৳ ${data.reduce((sum, row) => sum + row.totalCollection, 0).toLocaleString('en-BD')}`,
                        color: 'text-emerald-600'
                    }
                ]}
            />

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
