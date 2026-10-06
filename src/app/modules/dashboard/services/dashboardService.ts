import { axios } from '@/shared/services/apiClient';
import type {
    SummaryData,
    RecentOperationsData,
    OverviewData,
    StockOverviewData,
    MonthlyTotalsData
} from '../types/dashboard.types';

export interface DashboardParams {
    shop_id: string | number;
}

export const dashboardService = {
    /** Fetch high-level stats (daily_summary, monthly_summary, stock_value, etc.) */
    getSummary(params: DashboardParams): Promise<SummaryData> {
        return axios.get<SummaryData>('/api/dashboard', params as unknown as Record<string, unknown>);
    },

    /** Fetch recent sale/purchase operations and activity */
    getRecentOperations(params: DashboardParams): Promise<RecentOperationsData> {
        return axios.get<RecentOperationsData>('/api/dashboard/recent-operations', params as unknown as Record<string, unknown>);
    },

    /** Fetch overview chart data, payment method breakdown, and top selling products */
    getOverview(params: DashboardParams): Promise<OverviewData> {
        return axios.get<OverviewData>('/api/dashboard/overview', params as unknown as Record<string, unknown>);
    },

    /** Fetch low-stock alert items and stock summary breakdown */
    getStockOverview(params: DashboardParams): Promise<StockOverviewData> {
        return axios.get<StockOverviewData>('/api/dashboard/stock-overview', params as unknown as Record<string, unknown>);
    },

    /** Fetch monthly sales, purchase, expense totals */
    getMonthlySummary(params: DashboardParams): Promise<MonthlyTotalsData> {
        return axios.get<MonthlyTotalsData>('/api/dashboard/monthly-summary', params as unknown as Record<string, unknown>);
    }
};
