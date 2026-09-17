import React from 'react';
import { Printer, Download } from 'lucide-react';

export const CashFlowReportPage: React.FC = () => {
    const data = [
        {
            date: '17 Sep 2026',
            description: 'Opening Cash Balance',
            category: 'Opening Balance',
            debit: 45000,
            credit: 0,
            balance: 45000
        },
        {
            date: '17 Sep 2026',
            description: 'POS Cash Register Receipts (Dhanmondi)',
            category: 'Sales Receipt',
            debit: 38200,
            credit: 0,
            balance: 83200
        },
        {
            date: '17 Sep 2026',
            description: 'Customer Due Collection (Farhana Yasmin)',
            category: 'Due Collection',
            debit: 4400,
            credit: 0,
            balance: 87600
        },
        {
            date: '17 Sep 2026',
            description: 'Shop Utility Bill (Electricity DPDC)',
            category: 'Expense Voucher',
            debit: 0,
            credit: 8500,
            balance: 79100
        }
    ];

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Cash Book & Cash Flow Statement
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Daily cash in, cash out, voucher disbursements, and active vault closing balance.
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
                            <th className="px-5 py-3">Date & Time</th>
                            <th className="px-4 py-3">Transaction Particulars</th>
                            <th className="px-4 py-3">Category Head</th>
                            <th className="px-4 py-3 text-right">Cash In / Debit (৳)</th>
                            <th className="px-4 py-3 text-right">Cash Out / Credit (৳)</th>
                            <th className="px-4 py-3 text-right">Running Balance (৳)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {data.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                                <td className="px-5 py-3.5 font-mono text-slate-400 font-medium">
                                    {row.date}
                                </td>
                                <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">
                                    {row.description}
                                </td>
                                <td className="px-4 py-3.5">
                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                        {row.category}
                                    </span>
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                    {row.debit > 0 ? `+৳ ${row.debit.toLocaleString('en-BD')}` : '-'}
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono font-bold text-rose-500">
                                    {row.credit > 0 ? `-৳ ${row.credit.toLocaleString('en-BD')}` : '-'}
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono font-black text-slate-900 dark:text-white">
                                    ৳ {row.balance.toLocaleString('en-BD')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};
