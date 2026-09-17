import React from 'react';
import { Printer, Download } from 'lucide-react';

export const ProductLedgerReportPage: React.FC = () => {
    const data = [
        {
            date: '17 Sep 2026',
            item: 'Executive Slim-Fit Cotton Shirt (White - L)',
            sku: 'SHIRT-SLM-001',
            refNo: 'GRN-2026-0041',
            type: 'Purchase Addition',
            openingQty: 42,
            inQty: 100,
            outQty: 0,
            closingQty: 142
        },
        {
            date: '17 Sep 2026',
            item: 'Executive Slim-Fit Cotton Shirt (White - L)',
            sku: 'SHIRT-SLM-001',
            refNo: 'INV-2026-0091',
            type: 'POS Retail Sale',
            openingQty: 142,
            inQty: 0,
            outQty: 3,
            closingQty: 139
        }
    ];

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Product Item Movement Ledger
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Item-level inventory audit trail: Opening stock, Purchases, POS sales, and Closing balance.
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
                            <th className="px-5 py-3">Date & Ref #</th>
                            <th className="px-4 py-3">Product Name & SKU</th>
                            <th className="px-4 py-3">Transaction Type</th>
                            <th className="px-4 py-3 text-right">Opening Qty</th>
                            <th className="px-4 py-3 text-right">In (+)</th>
                            <th className="px-4 py-3 text-right">Out (-)</th>
                            <th className="px-4 py-3 text-right">Closing Qty</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {data.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                                <td className="px-5 py-3.5 font-mono text-slate-400">
                                    <p className="font-bold text-slate-900 dark:text-white">{row.refNo}</p>
                                    <p className="text-[10px]">{row.date}</p>
                                </td>
                                <td className="px-4 py-3.5">
                                    <p className="font-bold text-slate-900 dark:text-white">{row.item}</p>
                                    <p className="text-[10px] text-slate-400 font-mono">{row.sku}</p>
                                </td>
                                <td className="px-4 py-3.5">
                                    <span
                                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                            row.inQty > 0
                                                ? 'bg-emerald-500/10 text-emerald-600'
                                                : 'bg-blue-500/10 text-blue-600'
                                        }`}>
                                        {row.type}
                                    </span>
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono text-slate-500">
                                    {row.openingQty}
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                    {row.inQty > 0 ? `+${row.inQty}` : '-'}
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono font-bold text-rose-500">
                                    {row.outQty > 0 ? `-${row.outQty}` : '-'}
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono font-black text-slate-900 dark:text-white">
                                    {row.closingQty} pcs
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};
