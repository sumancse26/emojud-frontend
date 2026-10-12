import React from 'react';
import { Printer, Download } from 'lucide-react';
import { ReportDisplayShell } from '../components/ReportDisplayShell';

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
        <section className="display-report-page print-report-page space-y-6">
            <ReportDisplayShell
                title="Product Item Movement Ledger"
                metrics={[
                    { label: 'Movements', value: String(data.length) },
                    { label: 'Opening qty', value: String(data[0].openingQty), color: 'text-slate-700' },
                    {
                        label: 'In quantity',
                        value: String(data.reduce((sum, row) => sum + row.inQty, 0)),
                        color: 'text-emerald-600'
                    },
                    {
                        label: 'Out quantity',
                        value: String(data.reduce((sum, row) => sum + row.outQty, 0)),
                        color: 'text-rose-600'
                    }
                ]}
            />

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
                                <td className="px-4 py-3.5 text-right font-mono text-slate-500">{row.openingQty}</td>
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
