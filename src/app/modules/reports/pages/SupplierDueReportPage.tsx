import React from 'react';
import { Printer, Download } from 'lucide-react';

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
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Supplier Due & Payables Ledger Report
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Outstanding vendor payables, credit maturities, and trade ledger balance.
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
                                <td className="px-4 py-3.5 text-center text-slate-500 font-medium">
                                    {s.nextDueDate}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};
