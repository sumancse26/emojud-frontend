import React from 'react';
import type { PaymentMethodSummaryItem } from '../types/dashboard.types';

export const PaymentMethodBreakdown: React.FC<{ items?: PaymentMethodSummaryItem[] }> = ({
    items = []
}) => {
    const list = Array.isArray(items) ? items : [];
    const totalAmount = list.reduce((acc, curr) => acc + Number(curr.amount ?? 0), 0);

    const getBarColor = (index: number) => {
        const colors = [
            'bg-emerald-500',
            'bg-blue-500',
            'bg-violet-500',
            'bg-amber-500',
            'bg-cyan-500'
        ];
        return colors[index % colors.length];
    };

    return (
        <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl p-5">
            <h3 className="font-semibold text-sm">Payment Methods</h3>
            <p className="text-xs text-slate-400 mb-4">Counter settlement breakdown</p>

            {list.length === 0 ? (
                <div className="text-xs text-slate-400 py-6 text-center">No payment data recorded</div>
            ) : (
                <div className="space-y-3 mb-4">
                    {list.map((item, idx) => {
                        const name = item.payment_method || 'Other';
                        const pct = Number(item.percentage ?? 0);
                        const amt = Number(item.amount ?? 0);

                        return (
                            <div key={name}>
                                <div className="flex justify-between text-xs font-semibold mb-1">
                                    <span className="text-slate-700 dark:text-slate-300">{name}</span>
                                    <span className="text-slate-500">{pct}% (৳ {amt.toLocaleString()})</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                    <div
                                        className={`${getBarColor(idx)} h-full rounded-full transition-all`}
                                        style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex justify-between items-center">
                <span>Total Collected</span>
                <b className="text-slate-800 dark:text-slate-100 font-mono text-sm">
                    ৳ {totalAmount.toLocaleString()}
                </b>
            </div>
        </div>
    );
};
