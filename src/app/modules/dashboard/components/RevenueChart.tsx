import React from 'react';
import type { OverviewChartItem } from '../types/dashboard.types';

function barWidth(value: number, max: number): string {
    if (!value || !max) return '0%';
    const pct = 25 + (value / max) * 75;
    return `${Math.min(100, pct)}%`;
}

export const RevenueChart: React.FC<{ items?: OverviewChartItem[] }> = ({ items = [] }) => {
    const list = Array.isArray(items) ? items : [];

    return (
        <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-sm">Sales vs Purchase vs Expense</h3>
                    <p className="text-xs text-slate-400">Daily financial activity in BDT (৳)</p>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> Sales
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" /> Purchase
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" /> Expense
                    </span>
                </div>
            </div>

            {list.length === 0 ? (
                <div className="text-xs text-slate-400 py-8 text-center">No trend data available</div>
            ) : (
                <div className="space-y-3">
                    {list.map((item, idx) => {
                        const date = item.report_date || `Day ${idx + 1}`;
                        const sales = Number(item.sales ?? 0);
                        const purchase = Number(item.purchase ?? 0);
                        const expense = Number(item.expense ?? 0);
                        const peak = Math.max(sales, purchase, expense, 1);

                        return (
                            <div
                                key={date}
                                className="grid grid-cols-[55px_1fr_1fr_1fr] gap-2 text-xs items-center"
                            >
                                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                                    {date}
                                </span>
                                <div
                                    className="bg-emerald-500 h-2 rounded transition-all"
                                    style={{ width: sales > 0 ? barWidth(sales, peak) : '2px' }}
                                    title={`Sales: ৳ ${sales.toLocaleString()}`}
                                />
                                <div
                                    className="bg-blue-500 h-2 rounded transition-all"
                                    style={{ width: purchase > 0 ? barWidth(purchase, peak) : '2px' }}
                                    title={`Purchase: ৳ ${purchase.toLocaleString()}`}
                                />
                                <div
                                    className="bg-rose-500 h-2 rounded transition-all"
                                    style={{ width: expense > 0 ? barWidth(expense, peak) : '2px' }}
                                    title={`Expense: ৳ ${expense.toLocaleString()}`}
                                />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
