import React from 'react';
import { Printer, Download } from 'lucide-react';

export const GrossProfitReportPage: React.FC = () => {
    const data = [
        {
            category: 'Apparel & Menswear',
            unitsSold: 340,
            revenue: 833000,
            cogs: 510000,
            grossProfit: 323000,
            margin: 38.7
        },
        {
            category: 'Footwear & Leather',
            unitsSold: 120,
            revenue: 540000,
            cogs: 310000,
            grossProfit: 230000,
            margin: 42.5
        },
        {
            category: 'Fashion Accessories',
            unitsSold: 85,
            revenue: 109950,
            cogs: 49400,
            grossProfit: 60550,
            margin: 55.0
        }
    ];

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Gross Profit & Margin Analytics
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Category-wise sales revenue, cost of goods sold (COGS), and gross margins.
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
                            <th className="px-5 py-3">Product Category</th>
                            <th className="px-4 py-3 text-right">Units Sold</th>
                            <th className="px-4 py-3 text-right">Gross Revenue (৳)</th>
                            <th className="px-4 py-3 text-right">COGS (৳)</th>
                            <th className="px-4 py-3 text-right">Gross Profit (৳)</th>
                            <th className="px-4 py-3 text-right">Margin (%)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {data.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                                <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                                    {row.category}
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono text-slate-600 dark:text-slate-300">
                                    {row.unitsSold} pcs
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono text-slate-800 dark:text-slate-200 font-bold">
                                    ৳ {row.revenue.toLocaleString('en-BD')}
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono text-rose-500">
                                    ৳ {row.cogs.toLocaleString('en-BD')}
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono font-black text-emerald-600 dark:text-emerald-400">
                                    ৳ {row.grossProfit.toLocaleString('en-BD')}
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono font-black text-slate-900 dark:text-white">
                                    {row.margin}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};
