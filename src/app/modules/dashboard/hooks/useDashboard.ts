import { useMemo, useCallback } from 'react';
import { useApi } from '@/shared/hooks/useApi';
import { dashboardService, type DashboardParams } from '../services/dashboardService';
import type { DashboardData } from '../types/dashboard.types';

export interface UseDashboardReturn {
    data: DashboardData | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

/**
 * Domain-specific Dashboard hook built on top of the master `useApi` pattern.
 * Calls all 5 dashboard API endpoints and passes data directly to presenter/components.
 */
export function useDashboard(shopId: string | number): UseDashboardReturn {
    const params = useMemo<DashboardParams>(() => ({ shop_id: shopId }), [shopId]);

    const summary = useApi(dashboardService.getSummary, {
        immediate: true,
        initialParams: params
    });

    const recent = useApi(dashboardService.getRecentOperations, {
        immediate: true,
        initialParams: params
    });

    const overview = useApi(dashboardService.getOverview, {
        immediate: true,
        initialParams: params
    });

    const stock = useApi(dashboardService.getStockOverview, {
        immediate: true,
        initialParams: params
    });

    const monthly = useApi(dashboardService.getMonthlySummary, {
        immediate: true,
        initialParams: params
    });

    // Aggregate all API call states
    const responses = [summary, recent, overview, stock, monthly];
    const isLoading = responses.some((req) => req.isLoading);
    const error = responses.find((req) => req.error)?.error ?? null;

    // Combine raw responses directly
    const data = useMemo<DashboardData | null>(() => {
        const hasAnyData = responses.some((req) => req.data !== null);
        if (!hasAnyData) return null;

        return {
            summary: summary.data?.data ?? null,
            recentOperations: recent.data?.data ?? null,
            overview: overview.data?.data ?? null,
            stockOverview: stock.data?.data ?? null,
            monthlySummary: monthly.data?.data ?? null
        };
    }, [summary.data, recent.data, overview.data, stock.data, monthly.data]);

    // Re-fetch all endpoints
    const refetch = useCallback(async () => {
        await Promise.all(responses.map((req) => req.execute(params)));
    }, [params, ...responses.map((r) => r.execute)]);

    return { data, isLoading, error, refetch };
}

export default useDashboard;
