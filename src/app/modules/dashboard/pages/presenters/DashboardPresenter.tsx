import React from 'react';
import { DashboardHeader } from '../../components/DashboardHeader';
import { StatsGrid } from '../../components/StatsGrid';
import { RevenueChart } from '../../components/RevenueChart';
import { PaymentMethodBreakdown } from '../../components/PaymentMethodBreakdown';
import { TopProducts } from '../../components/TopProducts';
import { RecentInvoicesTable } from '../../components/RecentInvoicesTable';
import { RecentPurchasesTable } from '../../components/RecentPurchasesTable';
import { LowStockAlert } from '../../components/LowStockAlert';
import type { DashboardData } from '../../types/dashboard.types';

export interface DashboardPresenterProps {
    data: DashboardData | null;
    isLoading: boolean;
    error: string | null;
    onRetry: () => void;
}

export const DashboardPresenter: React.FC<DashboardPresenterProps> = ({
    data,
    isLoading,
    error,
    onRetry
}) => {
    // ── Loading State ──────────────────────────────────────────────────────
    if (isLoading && !data) {
        return (
            <section className="p-8 text-sm text-slate-500">
                Loading dashboard…
            </section>
        );
    }

    // ── Error State (no cached data) ───────────────────────────────────────
    if (error && !data) {
        return (
            <section className="p-8 text-sm text-rose-600">
                {error}
                <button onClick={onRetry} className="ml-3 underline">
                    Retry
                </button>
            </section>
        );
    }

    // ── Empty State ────────────────────────────────────────────────────────
    if (!data) return null;

    // ── Dashboard Content ──────────────────────────────────────────────────
    return (
        <section className="space-y-5">
            {/* Top Quick Actions Ribbon & Date Header */}
            <DashboardHeader />

            {/* Partial-error banner (data still shown from cache) */}
            {error && (
                <div className="rounded-xl bg-amber-50 text-amber-700 px-4 py-3 text-xs">
                    Some dashboard data could not be loaded.{' '}
                    <button onClick={onRetry} className="underline">
                        Retry
                    </button>
                </div>
            )}

            {/* 1. Stats Cards (Sales, Purchase, Expense, Profit, Stock, Due, Employees) */}
            <StatsGrid
                summary={data.summary}
                monthlyTotals={data.monthlySummary}
            />

            {/* 2. Charts Row (Daily Trends, Payment Breakdown, Top Products) */}
            <div className="grid gap-5 xl:grid-cols-[1fr_260px_240px]">
                <RevenueChart items={data.overview?.overview_chart} />
                <PaymentMethodBreakdown items={data.overview?.payment_method_summary} />
                <TopProducts products={data.overview?.top_selling_products} />
            </div>

            {/* 3. Tables Row (Recent Invoices, Recent POs, Stock Alerts) */}
            <div className="grid gap-5 lg:grid-cols-3">
                <RecentInvoicesTable invoices={data.recentOperations?.recent_invoice} />
                <RecentPurchasesTable purchases={data.recentOperations?.recent_purchase} />
                <LowStockAlert
                    items={data.stockOverview?.low_stock_alert}
                    summary={data.stockOverview?.stock_summary}
                />
            </div>
        </section>
    );
};
