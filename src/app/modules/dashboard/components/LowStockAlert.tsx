import React from 'react';
import type { LowStockAlertItem, StockSummary } from '../types/dashboard.types';

export interface LowStockAlertProps {
    items?: LowStockAlertItem[];
    summary?: StockSummary;
}

export const LowStockAlert: React.FC<LowStockAlertProps> = ({
    items = [],
    summary
}) => {
    const list = Array.isArray(items) ? items : [];

    return (
        <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Critical Stock Alert</h3>
                {summary && (
                    <span className="text-[11px] text-slate-400">
                        {summary.total_items} items total
                    </span>
                )}
            </div>

            {/* Stock Summary Mini Progress */}
            {summary && (
                <div className="mb-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center justify-between text-[11px] mb-1.5 font-medium">
                        <span className="text-emerald-600 dark:text-emerald-400">
                            In Stock: {summary.in_stock?.count ?? 0}
                        </span>
                        <span className="text-amber-600 dark:text-amber-400">
                            Low: {summary.low_stock?.count ?? 0}
                        </span>
                        <span className="text-rose-600 dark:text-rose-400">
                            Out: {summary.out_of_stock?.count ?? 0}
                        </span>
                    </div>
                    <div className="flex h-1.5 w-full rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                        <div
                            style={{ width: `${summary.in_stock?.percentage ?? 0}%` }}
                            className="bg-emerald-500"
                        />
                        <div
                            style={{ width: `${summary.low_stock?.percentage ?? 0}%` }}
                            className="bg-amber-500"
                        />
                        <div
                            style={{ width: `${summary.out_of_stock?.percentage ?? 0}%` }}
                            className="bg-rose-500"
                        />
                    </div>
                </div>
            )}

            {list.length === 0 ? (
                <div className="text-xs text-slate-400 py-6 text-center">
                    All inventory levels are healthy
                </div>
            ) : (
                <div className="space-y-2">
                    {list.slice(0, 4).map((item) => {
                        const isOut = Number(item.available_stock ?? 0) <= 0;

                        return (
                            <div
                                key={item.product_id}
                                className={`p-3 rounded-xl border text-xs ${
                                    isOut
                                        ? 'bg-rose-500/5 border-rose-500/20'
                                        : 'bg-amber-500/5 border-amber-500/20'
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <b className="text-slate-800 dark:text-slate-200 truncate pr-2">
                                        {item.product_name}
                                    </b>
                                    <span
                                        className={`font-semibold shrink-0 ${
                                            isOut
                                                ? 'text-rose-600 dark:text-rose-400'
                                                : 'text-amber-600 dark:text-amber-400'
                                        }`}
                                    >
                                        {item.available_stock} left
                                    </span>
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1">
                                    Min required: {item.min_stock_qty} units
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
