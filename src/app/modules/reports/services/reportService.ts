import { axiosInstance } from '@/shared/services/apiClient';
import type { DailySalesReportParams, DailySalesReportResponse } from '../types/daily-sales-report.types';
import type { CollectionReportResponse } from '../types/collection-report.types';
import type { CashFlowReportParams, CashFlowReportResponse } from '../types/cash-flow-report.types';
import type { ProductLedgerReportParams, ProductLedgerReportResponse } from '../types/product-ledger-report.types';
import type { ProductApiResponse, ProductItem, ProductListParams } from '@/app/modules/products/types/product.types';
import type {
    DailyPurchaseReportParams,
    DailyPurchaseReportResponse
} from '../types/daily-purchase-report.types';
import type {
    DailyExpenseReportParams,
    DailyExpenseReportResponse
} from '../types/daily-expense-report.types';
import type { StockSummaryReportResponse } from '../types/stock-summary-report.types';
import type { CustomerDueReportResponse } from '../types/customer-due-report.types';
import type { SupplierDueReportResponse } from '../types/supplier-due-report.types';

export const reportService = {
    getDailySales(params: DailySalesReportParams): Promise<DailySalesReportResponse> {
        return axiosInstance
            .get<DailySalesReportResponse>('/api/report/daily-sales', { params })
            .then((response) => response.data);
    },

    getGrossProfit(params: DailySalesReportParams): Promise<DailySalesReportResponse> {
        return axiosInstance
            .get<DailySalesReportResponse>('/api/report/gross-profit', { params })
            .then((response) => response.data);
    },

    getDailyPurchase(params: DailyPurchaseReportParams): Promise<DailyPurchaseReportResponse> {
        return axiosInstance
            .get<DailyPurchaseReportResponse>('/api/report/daily-purchase', { params })
            .then((response) => response.data);
    },

    getDailyExpense(params: DailyExpenseReportParams): Promise<DailyExpenseReportResponse> {
        return axiosInstance
            .get<DailyExpenseReportResponse>('/api/report/daily-expense', { params })
            .then((response) => response.data);
    },

    getStockSummary(): Promise<StockSummaryReportResponse> {
        return axiosInstance
            .get<StockSummaryReportResponse>('/api/report/stock-summary')
            .then((response) => response.data);
    },

    getCustomerDue(): Promise<CustomerDueReportResponse> {
        return axiosInstance
            .get<CustomerDueReportResponse>('/api/report/customer-due')
            .then((response) => response.data);
    },

    getSupplierDue(): Promise<SupplierDueReportResponse> {
        return axiosInstance
            .get<SupplierDueReportResponse>('/api/report/supplier-due')
            .then((response) => response.data);
    },

    getCollection(params: DailySalesReportParams): Promise<CollectionReportResponse> {
        return axiosInstance
            .get<CollectionReportResponse>('/api/report/collection', { params })
            .then((response) => response.data);
    },

    getCashFlow(params: CashFlowReportParams): Promise<CashFlowReportResponse> {
        return axiosInstance
            .get<CashFlowReportResponse>('/api/report/cash-flow', { params })
            .then((response) => response.data);
    },

    getProducts(params: ProductListParams): Promise<ProductApiResponse<ProductItem[]>> {
        return axiosInstance
            .get<ProductApiResponse<ProductItem[]>>('/api/products', { params })
            .then((response) => response.data);
    },

    getProductLedger(params: ProductLedgerReportParams): Promise<ProductLedgerReportResponse> {
        return axiosInstance
            .get<ProductLedgerReportResponse>('/api/report/product-ledger', { params })
            .then((response) => response.data);
    }
};

export default reportService;
