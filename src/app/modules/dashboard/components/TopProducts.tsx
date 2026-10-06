import React from 'react';
import type { TopSellingProductItem } from '../types/dashboard.types';

export const TopProducts: React.FC<{ products?: TopSellingProductItem[] }> = ({ products = [] }) => {
    const list = Array.isArray(products) ? products : [];

    return (
        <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl p-5">
            <h3 className="font-semibold text-sm mb-1">Top Selling Items</h3>
            <p className="text-xs text-slate-400 mb-4">Highest volume products</p>

            {list.length === 0 ? (
                <div className="text-xs text-slate-400 py-8 text-center">No sales recorded yet</div>
            ) : (
                <div className="space-y-3.5 text-xs">
                    {list.slice(0, 5).map((product, index) => {
                        const name = product.product_name ?? product.name ?? 'Unknown item';
                        const units = Number(product.quantity ?? product.units_sold ?? product.unitsSold ?? 0);
                        const revenue = Number(product.amount ?? product.revenue ?? product.sales ?? 0);
                        const id = product.product_id ?? product.name ?? index;

                        return (
                            <div key={id} className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">
                                        {index + 1}. {name}
                                    </p>
                                    <p className="text-[10px] text-slate-400">
                                        {units} units sold
                                    </p>
                                </div>
                                <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
                                    ৳ {revenue.toLocaleString()}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
