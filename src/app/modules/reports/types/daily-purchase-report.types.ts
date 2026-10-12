export interface DailyPurchaseReportDetail {
    id: string | number;
    purchase_mst_id: string | number;
    product_id: string | number;
    qty: string | number;
    purchase_rate: string | number;
    retail_rate: string | number;
    sales_rate: string | number;
    total_amount: string | number;
}

export interface DailyPurchaseReportItem {
    id: string | number;
    purchase_no: string;
    shop_id: string | number;
    warehouse_id: string | number;
    supplier_id: string | number;
    purchase_date: string;
    total_amount: string | number;
    discount_amount: string | number;
    vat_amount: string | number;
    net_amount: string | number;
    paid_amount: string | number;
    due_amount: string | number;
    tran_status: string | number | null;
    status: string | number;
    purchaseDtls?: DailyPurchaseReportDetail[];
}

export interface DailyPurchaseReportParams {
    from_date: string;
    to_date: string;
}

export interface DailyPurchaseReportResponse {
    success: boolean;
    response_code: number;
    data: DailyPurchaseReportItem[];
}
