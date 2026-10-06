import React from 'react';
import { useNavigate } from 'react-router';
import {
    PackagePlus,
    PackageMinus,
    HandCoins,
    Landmark,
    ReceiptText,
    Percent,
    Calendar
} from 'lucide-react';
import { ROUTES } from '@/app/routes/paths';

interface QuickAction {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    path: string;
    bgClass: string;
    borderClass: string;
    textClass: string;
    iconClass: string;
}

const QUICK_ACTIONS: QuickAction[] = [
    {
        label: 'Stock In',
        icon: PackagePlus,
        path: ROUTES.STOCK_MANAGEMENT.PURCHASE,
        bgClass: 'bg-emerald-50 hover:bg-emerald-100/80 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50',
        borderClass: 'border-emerald-200 dark:border-emerald-800/40',
        textClass: 'text-emerald-700 dark:text-emerald-300',
        iconClass: 'text-emerald-600 dark:text-emerald-400'
    },
    {
        label: 'Stock Out',
        icon: PackageMinus,
        path: ROUTES.INVENTORY.INVOICES,
        bgClass: 'bg-rose-50 hover:bg-rose-100/80 dark:bg-rose-950/30 dark:hover:bg-rose-950/50',
        borderClass: 'border-rose-200 dark:border-rose-800/40',
        textClass: 'text-rose-700 dark:text-rose-300',
        iconClass: 'text-rose-600 dark:text-rose-400'
    },
    {
        label: 'Due Collection',
        icon: HandCoins,
        path: ROUTES.ACCOUNTS.CUSTOMER_DUE_COLLECTION,
        bgClass: 'bg-blue-50 hover:bg-blue-100/80 dark:bg-blue-950/30 dark:hover:bg-blue-950/50',
        borderClass: 'border-blue-200 dark:border-blue-800/40',
        textClass: 'text-blue-700 dark:text-blue-300',
        iconClass: 'text-blue-600 dark:text-blue-400'
    },
    {
        label: 'Supplier Payment',
        icon: Landmark,
        path: ROUTES.ACCOUNTS.SUPPLIER_PAYMENT,
        bgClass: 'bg-violet-50 hover:bg-violet-100/80 dark:bg-violet-950/30 dark:hover:bg-violet-950/50',
        borderClass: 'border-violet-200 dark:border-violet-800/40',
        textClass: 'text-violet-700 dark:text-violet-300',
        iconClass: 'text-violet-600 dark:text-violet-400'
    },
    {
        label: 'Daily Expense',
        icon: ReceiptText,
        path: ROUTES.ACCOUNTS.EXPENSES,
        bgClass: 'bg-amber-50 hover:bg-amber-100/80 dark:bg-amber-950/30 dark:hover:bg-amber-950/50',
        borderClass: 'border-amber-200 dark:border-amber-800/40',
        textClass: 'text-amber-700 dark:text-amber-300',
        iconClass: 'text-amber-600 dark:text-amber-400'
    },
    {
        label: 'Commission Profit',
        icon: Percent,
        path: ROUTES.ACCOUNTS.COMMISSION_PROFIT,
        bgClass: 'bg-cyan-50 hover:bg-cyan-100/80 dark:bg-cyan-950/30 dark:hover:bg-cyan-950/50',
        borderClass: 'border-cyan-200 dark:border-cyan-800/40',
        textClass: 'text-cyan-700 dark:text-cyan-300',
        iconClass: 'text-cyan-600 dark:text-cyan-400'
    }
];

function getCurrentMonthDateRange(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const monthName = now.toLocaleString('en-US', { month: 'short' });
    const lastDay = new Date(year, month + 1, 0).getDate();
    return `${monthName} 1, ${year} – ${monthName} ${lastDay}, ${year}`;
}

export const DashboardHeader: React.FC = () => {
    const navigate = useNavigate();
    const dateRange = getCurrentMonthDateRange();

    return (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            {/* Quick Action Links Ribbon */}
            <div className="flex flex-wrap items-center gap-2">
                {QUICK_ACTIONS.map((action) => {
                    const Icon = action.icon;
                    return (
                        <button
                            key={action.label}
                            onClick={() => navigate(action.path)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5 text-xs font-medium cursor-pointer ${action.bgClass} ${action.borderClass} ${action.textClass}`}
                        >
                            <Icon className={`w-4 h-4 ${action.iconClass}`} />
                            <span>{action.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Date Range Pill */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-xl px-3 py-1.5 shadow-sm self-start lg:self-auto">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium">{dateRange}</span>
            </div>
        </div>
    );
};
