import React from 'react';
import { Printer, Download } from 'lucide-react';

export const CustomerDueReportPage: React.FC = () => {
    const data = [
        {
            customer: 'Farhana Yasmin',
            phone: '+880 1911-889900',
            outlet: 'Gulshan Outlet',
            creditLimit: 20000,
            due30Days: 4400,
            due60Days: 0,
            due90Days: 0,
            totalDue: 4400,
            lastPayment: '02 Sep 2026'
        },
        {
            customer: 'Mahmudul Hasan',
            phone: '+880 1712-445566',
            outlet: 'Dhanmondi Outlet',
            creditLimit: 15000,
            due30Days: 1800,
            due60Days: 0,
            due90Days: 0,
            totalDue: 1800,
            lastPayment: '16 Sep 2026'
        }
    ];

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Customer Due & Aging Receivables Report
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Accounts receivable aging breakdown (0-30, 31-60, 60+ days) and client credit limits.
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
                            <th className="px-5 py-3">Customer Profile</th>
                            <th className="px-4 py-3">Outlet</th>
                            <th className="px-4 py-3 text-right">Credit Limit (৳)</th>
                            <th className="px-4 py-3 text-right">0-30 Days</th>
                            <th className="px-4 py-3 text-right">31-60 Days</th>
                            <th className="px-4 py-3 text-right">60+ Days</th>
                            <th className="px-4 py-3 text-right">Total Outstanding (৳)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {data.map((c, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                                <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                                    <p>{c.customer}</p>
                                    <p className="text-[10px] text-slate-400 font-mono">{c.phone}</p>
                                </td>
                                <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 font-medium">
                                    {c.outlet}
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono text-slate-500">
                                    ৳ {c.creditLimit.toLocaleString('en-BD')}
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono text-amber-600 dark:text-amber-400">
                                    ৳ {c.due30Days.toLocaleString('en-BD')}
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono text-slate-400">
                                    ৳ {c.due60Days.toLocaleString('en-BD')}
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono text-slate-400">
                                    ৳ {c.due90Days.toLocaleString('en-BD')}
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono font-black text-rose-500">
                                    ৳ {c.totalDue.toLocaleString('en-BD')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};
