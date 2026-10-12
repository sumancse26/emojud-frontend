import React from 'react';
import { Printer, Download } from 'lucide-react';
import { ReportDisplayShell } from '../components/ReportDisplayShell';

export const SupplierDueReportPage: React.FC = () => {
    const data = [
        {
            supplier: 'Apex Textiles & Fabrics Ltd.',
            contact: '+880 1711-889900',
            terms: '30 Days Net',
            totalPurchases: 1850000,
            totalPaid: 1605000,
            payableDue: 245000,
            nextDueDate: '25 Sep 2026'
        },
        {
            supplier: 'Bengal Leather Crafts Ind.',
            contact: '+880 1819-223344',
            terms: '15 Days Net',
            totalPurchases: 940000,
            totalPaid: 855000,
            payableDue: 85000,
            nextDueDate: '20 Sep 2026'
        },
        {
            supplier: 'Royal Fragrance & Oils Ltd.',
            contact: '+880 1611-112233',
            terms: '30 Days Net',
            totalPurchases: 410000,
            totalPaid: 348000,
            payableDue: 62000,
            nextDueDate: '28 Sep 2026'
        }
    ];

    return (
        <section className="display-report-page print-report-page space-y-6">
            <ReportDisplayShell
                title="Supplier Due & Payables Ledger Report"
                metrics={[
                    { label: 'Suppliers', value: String(data.length) },
                    {
                        label: 'Total invoiced',
                        value: `৳ ${data.reduce((sum, row) => sum + row.totalPurchases, 0).toLocaleString('en-BD')}`,
                        color: 'text-blue-600'
                    },
                    {
                        label: 'Total paid',
                        value: `৳ ${data.reduce((sum, row) => sum + row.totalPaid, 0).toLocaleString('en-BD')}`,
                        color: 'text-emerald-600'
                    },
                    {
                        label: 'Payable due',
                        value: `৳ ${data.reduce((sum, row) => sum + row.payableDue, 0).toLocaleString('en-BD')}`,
                        color: 'text-rose-600'
                    }
                ]}
            />

            <div className="bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/80 dark:bg-slate-900/40 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80 text-[11px]">
                        <tr>
                            <th className="px-5 py-3">Supplier Name & Contact</th>
                            <th className="px-4 py-3">Credit Terms</th>
                            <th className="px-4 py-3 text-right">Total Invoiced (৳)</th>
                            <th className="px-4 py-3 text-right">Total Paid (৳)</th>
                            <th className="px-4 py-3 text-right">Payable Balance (৳)</th>
                            <th className="px-4 py-3 text-center">Due Maturity</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {data.map((s, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                                <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                                    <p>{s.supplier}</p>
                                    <p className="text-[10px] text-slate-400 font-mono">{s.contact}</p>
                                </td>
                                <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 font-medium">
                                    {s.terms}
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono text-slate-600 dark:text-slate-300">
                                    ৳ {s.totalPurchases.toLocaleString('en-BD')}
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono text-emerald-600 dark:text-emerald-400">
                                    ৳ {s.totalPaid.toLocaleString('en-BD')}
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono font-black text-rose-500">
                                    ৳ {s.payableDue.toLocaleString('en-BD')}
                                </td>
                                <td className="px-4 py-3.5 text-center text-slate-500 font-medium">{s.nextDueDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};
