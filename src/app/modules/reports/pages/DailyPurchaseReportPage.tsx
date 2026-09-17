import React from 'react';
import { Printer, Download } from 'lucide-react';

export const DailyPurchaseReportPage: React.FC = () => {
    const data = [
        {
            poNo: 'PO-2026-0041',
            date: '17 Sep 2026',
            supplier: 'Apex Textiles & Fabrics Ltd.',
            items: 'Slim-Fit Cotton Fabric Rolls (1000m)',
            warehouse: 'Central WH (Savar)',
            amount: 245000,
            status: 'Received & Verified'
        },
        {
            poNo: 'PO-2026-0042',
            date: '17 Sep 2026',
            supplier: 'Bengal Leather Crafts Ind.',
            items: 'Calf Leather Shoes & Loafers (50 pairs)',
            warehouse: 'Central WH (Savar)',
            amount: 160000,
            status: 'In Transit'
        }
    ];

    const total = data.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Daily Purchase & Goods Received Report
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Procurement orders, supplier shipments, and goods receipt notes (GRN) for the day.
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
                            <th className="px-5 py-3">PO Number & Date</th>
                            <th className="px-4 py-3">Supplier Name</th>
                            <th className="px-4 py-3">Received Items Description</th>
                            <th className="px-4 py-3">Destination Hub</th>
                            <th className="px-4 py-3 text-right">Total Cost (৳)</th>
                            <th className="px-4 py-3 text-center">GRN Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {data.map((p, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                                <td className="px-5 py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                                    {p.poNo}
                                </td>
                                <td className="px-4 py-3.5 font-bold text-slate-800 dark:text-slate-200">
                                    {p.supplier}
                                </td>
                                <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                                    {p.items}
                                </td>
                                <td className="px-4 py-3.5 text-slate-500">
                                    {p.warehouse}
                                </td>
                                <td className="px-4 py-3.5 text-right font-mono font-black text-slate-900 dark:text-white">
                                    ৳ {p.amount.toLocaleString('en-BD')}
                                </td>
                                <td className="px-4 py-3.5 text-center">
                                    <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                        {p.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 font-bold">
                        <tr>
                            <td colSpan={4} className="px-5 py-3 text-right text-slate-600 dark:text-slate-300">
                                Total Procurement:
                            </td>
                            <td className="px-4 py-3 text-right font-mono font-black text-slate-900 dark:text-white">
                                ৳ {total.toLocaleString('en-BD')}
                            </td>
                            <td />
                        </tr>
                    </tfoot>
                </table>
            </div>
        </section>
    );
};
