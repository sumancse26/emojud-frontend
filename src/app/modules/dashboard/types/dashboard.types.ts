export interface PeriodSummary {
    sales: number;
    purchase: number;
    expense: number;
    profit: number;
}

export interface SummaryData {
    data: null;
    daily_summary?: PeriodSummary;
    monthly_summary?: PeriodSummary;
    stock_value?: number;
    due_collection?: number;
    active_employee?: number;
}

export interface RecentInvoice {
    id: string;
    invoice_no: string;
    customer_name: string;
    amount: number;
    status: string;
}

export interface RecentPurchase {
    id: string;
    purchase_no: string;
    supplier_name: string;
    amount: number;
    status: string;
    created_by?: string;
}

export interface RecentActivity {
    activity_type: string;
    title: string;
    activity_time: string;
    created_at: string;
    created_by: string;
}

export interface RecentOperationsData {
    data: null;
    recent_invoice?: RecentInvoice[];
    recent_purchase?: RecentPurchase[];
    recent_activity?: RecentActivity[];
}

export interface OverviewChartItem {
    report_date: string;
    sales: number;
    purchase: number;
    expense: number;
}

export interface PaymentMethodSummaryItem {
    payment_method: string;
    amount: number;
    percentage: number;
}

export interface TopSellingProductItem {
    product_id?: string;
    product_name?: string;
    name?: string;
    quantity?: number;
    units_sold?: number;
    amount?: number;
    revenue?: number;
    rank?: number;
}

export interface OverviewData {
    data: null;
    overview_chart?: OverviewChartItem[];
    payment_method_summary?: PaymentMethodSummaryItem[];
    top_selling_products?: TopSellingProductItem[];
}

export interface LowStockAlertItem {
    product_id: string;
    product_name: string;
    available_stock: number;
    min_stock_qty: number;
}

export interface StockStatus {
    count: number;
    percentage: number;
}

export interface StockSummary {
    total_items: number;
    in_stock: StockStatus;
    low_stock: StockStatus;
    out_of_stock: StockStatus;
}

export interface StockOverviewData {
    data: null;
    low_stock_alert?: LowStockAlertItem[];
    stock_summary?: StockSummary;
}

export interface MonthlyTotalsData {
    data: null;
    total_sales?: number;
    total_purchase?: number;
    total_expense?: number;
    net_profit?: number;
    stock_value?: number;
    due_collection?: number;
    active_employee?: number;
}

export interface DashboardData {
    summary: SummaryData | null;
    recentOperations: RecentOperationsData | null;
    overview: OverviewData | null;
    stockOverview: StockOverviewData | null;
    monthlySummary: MonthlyTotalsData | null;
}
