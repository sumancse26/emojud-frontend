import React from 'react';
import { Printer, Download } from 'lucide-react';
import { ReportDisplayShell } from '../components/ReportDisplayShell';

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
        <section className="display-report-page print-report-page space-y-6">
            <ReportDisplayShell
                title="Cash Book & Cash Flow Statement"
                metrics={[
                    { label: 'Records', value: String(data.length) },
                    {
                        label: 'Cash in',
                        value: `৳ ${data.reduce((sum, row) => sum + row.debit, 0).toLocaleString('en-BD')}`,
                        color: 'text-emerald-600'
                    },
                    {
                        label: 'Cash out',
                        value: `৳ ${data.reduce((sum, row) => sum + row.credit, 0).toLocaleString('en-BD')}`,
                        color: 'text-rose-600'
                    },
                    {
                        label: 'Closing balance',
                        value: `৳ ${data[data.length - 1].balance.toLocaleString('en-BD')}`,
                        color: 'text-blue-600'
                    }
                ]}
            />

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
                                <td className="px-5 py-3.5 font-mono text-slate-400 font-medium">{row.date}</td>
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
