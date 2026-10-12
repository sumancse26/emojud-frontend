import React from 'react';
import { Printer, Download } from 'lucide-react';
import { ReportDisplayShell } from '../components/ReportDisplayShell';

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
        <section className="display-report-page print-report-page space-y-6">
            <ReportDisplayShell
                title="Gross Profit & Margin Analytics"
                metrics={[
                    { label: 'Categories', value: String(data.length) },
                    {
                        label: 'Revenue',
                        value: `৳ ${data.reduce((sum, row) => sum + row.revenue, 0).toLocaleString('en-BD')}`,
                        color: 'text-blue-600'
                    },
                    {
                        label: 'Gross profit',
                        value: `৳ ${data.reduce((sum, row) => sum + row.grossProfit, 0).toLocaleString('en-BD')}`,
                        color: 'text-emerald-600'
                    }
                ]}
            />

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
                                <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">{row.category}</td>
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
