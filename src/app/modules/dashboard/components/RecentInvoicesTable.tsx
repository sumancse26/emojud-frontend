import React from 'react';
import type { RecentInvoice } from '../types/dashboard.types';

export const RecentInvoicesTable: React.FC<{ invoices?: RecentInvoice[] }> = ({
    invoices = []
}) => {
    const list = Array.isArray(invoices) ? invoices : [];

    return (
        <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <h3 className="font-semibold text-sm">Recent Invoices</h3>
                <span className="text-[11px] text-slate-400">{list.length} records</span>
            </div>

            {list.length === 0 ? (
                <div className="text-xs text-slate-400 py-8 text-center">No recent invoices</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/40 text-[11px] text-slate-400 uppercase">
                            <tr>
                                <th className="px-4 py-3">Invoice #</th>
                                <th className="px-4 py-3">Customer</th>
                                <th className="px-4 py-3 text-right">Amount</th>
                                <th className="px-4 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {list.slice(0, 5).map((item) => {
                                const status = item.status || 'Pending';
                                const isPaid = status.toLowerCase() === 'paid';

                                return (
                                    <tr key={item.id}>
                                        <td className="px-4 py-3 font-mono font-medium text-slate-700 dark:text-slate-300">
                                            {item.invoice_no}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                                            {item.customer_name}
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">
                                            ৳ {Number(item.amount ?? 0).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                                    isPaid
                                                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50'
                                                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50'
                                                }`}
                                            >
                                                {status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
