import React from 'react';
import { Printer, Download } from 'lucide-react';
import { ReportDisplayShell } from '../components/ReportDisplayShell';

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
        <section className="display-report-page print-report-page space-y-6">
            <ReportDisplayShell
                title="Daily Purchase & Goods Received Report"
                metrics={[
                    { label: 'Purchase orders', value: String(data.length) },
                    {
                        label: 'Total procurement',
                        value: `৳ ${total.toLocaleString('en-BD')}`,
                        color: 'text-emerald-600'
                    },
                    {
                        label: 'In transit',
                        value: String(data.filter((row) => row.status === 'In Transit').length),
                        color: 'text-amber-600'
                    }
                ]}
            />

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
                                <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">{p.items}</td>
                                <td className="px-4 py-3.5 text-slate-500">{p.warehouse}</td>
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
