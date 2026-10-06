import React, { useState } from 'react';
import {
    ShoppingBag,
    ShoppingCart,
    CreditCard,
    TrendingUp,
    Package,
    Coins,
    Users
} from 'lucide-react';
import type { SummaryData, MonthlyTotalsData } from '../types/dashboard.types';

interface StatsCardProps {
    label: string;
    amount: number;
    isCurrency?: boolean;
    icon: React.ComponentType<{ className?: string }>;
    iconBgClass: string;
    iconColorClass: string;
    trendText?: string;
    trendLabel?: string;
    trendPositive?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
    label,
    amount,
    isCurrency = true,
    icon: Icon,
    iconBgClass,
    iconColorClass,
    trendText,
    trendLabel,
    trendPositive
}) => (
    <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl p-4 shadow-sm dark:shadow-none transition-colors">
        <div className="flex items-start justify-between mb-2">
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-tight pr-1">
                {label}
            </p>
            <span
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${iconBgClass} ${iconColorClass}`}
            >
                <Icon className="w-4 h-4" />
            </span>
        </div>
        <p className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight font-mono">
            {isCurrency ? `৳ ${amount?.toLocaleString()}` : amount}
        </p>
        {(trendText || trendLabel) && (
            <div className="flex items-center gap-1 mt-1.5">
                {trendText && (
                    <span
                        className={`text-[11px] font-semibold ${
                            trendPositive === undefined
                                ? 'text-slate-500 dark:text-slate-400'
                                : trendPositive
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-rose-600 dark:text-rose-400'
                        }`}
                    >
                        {trendText}
                    </span>
                )}
                {trendLabel && (
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        {trendLabel}
                    </span>
                )}
            </div>
        )}
    </div>
);

export interface StatsGridProps {
    summary?: SummaryData | null;
    monthlyTotals?: MonthlyTotalsData | null;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ summary, monthlyTotals }) => {
    const [period, setPeriod] = useState<'monthly' | 'daily'>('monthly');

    const activeSummary = period === 'monthly'
        ? (summary?.monthly_summary ?? {
              sales: monthlyTotals?.total_sales ?? 0,
              purchase: monthlyTotals?.total_purchase ?? 0,
              expense: monthlyTotals?.total_expense ?? 0,
              profit: monthlyTotals?.net_profit ?? 0
          })
        : (summary?.daily_summary ?? {
              sales: 0,
              purchase: 0,
              expense: 0,
              profit: 0
          });

    const stockValue = Number(summary?.stock_value ?? monthlyTotals?.stock_value ?? 0);
    const dueCollection = Number(summary?.due_collection ?? monthlyTotals?.due_collection ?? 0);
    const activeEmployees = Number(summary?.active_employee ?? monthlyTotals?.active_employee ?? 0);

    const cards: StatsCardProps[] = [
        {
            label: `${period === 'monthly' ? 'Monthly' : 'Today'} Sales`,
            amount: Number(activeSummary.sales ?? 0),
            icon: ShoppingBag,
            iconBgClass: 'bg-emerald-100 dark:bg-emerald-500/15',
            iconColorClass: 'text-emerald-600 dark:text-emerald-400',
            trendText: period === 'monthly' ? 'This month' : 'Today',
            trendPositive: true
        },
        {
            label: `${period === 'monthly' ? 'Monthly' : 'Today'} Purchase`,
            amount: Number(activeSummary.purchase ?? 0),
            icon: ShoppingCart,
            iconBgClass: 'bg-blue-100 dark:bg-blue-500/15',
            iconColorClass: 'text-blue-600 dark:text-blue-400',
            trendText: period === 'monthly' ? 'This month' : 'Today',
            trendPositive: true
        },
        {
            label: `${period === 'monthly' ? 'Monthly' : 'Today'} Expense`,
            amount: Number(activeSummary.expense ?? 0),
            icon: CreditCard,
            iconBgClass: 'bg-rose-100 dark:bg-rose-500/15',
            iconColorClass: 'text-rose-600 dark:text-rose-400',
            trendText: period === 'monthly' ? 'This month' : 'Today',
            trendPositive: false
        },
        {
            label: 'Net Profit',
            amount: Number(activeSummary.profit ?? 0),
            icon: TrendingUp,
            iconBgClass: 'bg-amber-100 dark:bg-amber-500/15',
            iconColorClass: 'text-amber-600 dark:text-amber-400',
            trendText: Number(activeSummary.profit ?? 0) >= 0 ? 'Positive' : 'Negative',
            trendLabel: 'profit margin',
            trendPositive: Number(activeSummary.profit ?? 0) >= 0
        },
        {
            label: 'Stock Value',
            amount: stockValue,
            icon: Package,
            iconBgClass: 'bg-violet-100 dark:bg-violet-500/15',
            iconColorClass: 'text-violet-600 dark:text-violet-400',
            trendText: 'Warehouse total',
            trendPositive: true
        },
        {
            label: 'Due Collection',
            amount: dueCollection,
            icon: Coins,
            iconBgClass: 'bg-cyan-100 dark:bg-cyan-500/15',
            iconColorClass: 'text-cyan-600 dark:text-cyan-400',
            trendText: 'Pending collection',
            trendPositive: true
        },
        {
            label: 'Active Employees',
            amount: activeEmployees,
            isCurrency: false,
            icon: Users,
            iconBgClass: 'bg-emerald-100 dark:bg-emerald-500/15',
            iconColorClass: 'text-emerald-600 dark:text-emerald-400',
            trendText: 'Active',
            trendPositive: true
        }
    ];

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-end">
                <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-50 dark:bg-slate-900 text-xs">
                    <button
                        onClick={() => setPeriod('monthly')}
                        className={`px-3 py-1 rounded-md font-medium transition-all ${
                            period === 'monthly'
                                ? 'bg-white dark:bg-[#0d1729] text-emerald-600 dark:text-emerald-400 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setPeriod('daily')}
                        className={`px-3 py-1 rounded-md font-medium transition-all ${
                            period === 'daily'
                                ? 'bg-white dark:bg-[#0d1729] text-emerald-600 dark:text-emerald-400 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                    >
                        Today
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {cards.map((card) => (
                    <StatsCard key={card.label} {...card} />
                ))}
            </div>
        </div>
    );
};
