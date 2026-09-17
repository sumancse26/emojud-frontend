import React from 'react';
import { Printer, Download } from 'lucide-react';

export const StockSummaryReportPage: React.FC = () => {
    const data = [
        {
            sku: 'SHIRT-SLM-001',
            name: 'Executive Slim-Fit Cotton Shirt',
            category: 'Apparel',
            dhanmondi: 45,
            gulshan: 32,
            warehouseSavar: 65,
            totalQty: 142,
            unitCost: 1200,
            valuation: 170400
        },
        {
            sku: 'JEAN-STR-002',
            name: 'Indigo Stretch Denim Jeans',
            category: 'Apparel',
            dhanmondi: 8,
            gulshan: 6,
            warehouseSavar: 0,
            totalQty: 14,
            unitCost: 1650,
            valuation: 23100
        },
        {
            sku: 'SHOE-LOA-004',
            name: 'Italian Calf Leather Loafers',
            category: 'Footwear',
            dhanmondi: 12,
            gulshan: 8,
            warehouseSavar: 18,
            totalQty: 38,
            unitCost: 3200,
            valuation: 121600
        }
    ];

    const totalValuation = data.reduce((acc, curr) => acc + curr.valuation, 0);

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Stock Summary & Outlet Distribution Report
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Consolidated inventory counts across all retail outlets and central warehouses.
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
                            <th className="px-5 py-3">Product Name & SKU</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3 text-right">Dhanmondi</th>
                            <th className="px-4 py-3 text-right">Gulshan</th>
                            <th className="px-4 py-3 text-right">Central WH</th>
                            <th className="px-4 py-3 text-right">Total Qty</th>
                            <th className="px-4 py-3 text-right">Valuation (৳)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {data.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                                <td className="px-5 py-3.5">
                                    <p className="font-bold text-slate-900 dark:text-white">{row.name}</p>
                                    <p className="text-[10px] text-slate-400 font-mono">{row.sku}</p>
                                </td>
                                <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                                    {row.category}
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono text-slate-600 dark:text-slate-300">
                                    {row.dhanmondi}
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono text-slate-600 dark:text-slate-300">
                                    {row.gulshan}
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono text-slate-600 dark:text-slate-300">
                                    {row.warehouseSavar}
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                                    {row.totalQty} pcs
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                    ৳ {row.valuation.toLocaleString('en-BD')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 font-bold">
                        <tr>
                            <td colSpan={6} className="px-5 py-3 text-right text-slate-600 dark:text-slate-300">
                                Total Inventory Valuation:
                            </td>
                            <td className="px-4 py-3 text-right font-mono font-black text-emerald-600 dark:text-emerald-400">
                                ৳ {totalValuation.toLocaleString('en-BD')}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </section>
    );
};
