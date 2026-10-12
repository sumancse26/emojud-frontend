export interface StockSummaryReportDetail {
    id: string | number;
    stock_mst_id: string | number;
    lot_id: string | number;
    prod_id: string | number;
    qty: string | number;
    status: string | number;
    shop_id: string | number;
}

export interface StockSummaryReportItem {
    id: string | number;
    stock_date: string;
    shop_id: string | number;
    warehouse_id: string | number;
    prod_id: string | number;
    current_stock: string | number;
    status: string | number;
    stockDtls?: StockSummaryReportDetail[];
}

export interface StockSummaryReportResponse {
    success: boolean;
    response_code: number;
    data: StockSummaryReportItem[];
}
