export interface ProductLedgerItem {
    id: string | number;
    trn_date: string;
    product_id: string | number;
    shop_id: string | number;
    warehouse_id: string | number;
    lot_id: string | number;
    transaction_type: string | number;
    qty: string | number;
    purchase_rate: string | number;
    retail_rate: string | number;
    sales_rate: string | number;
    ref_type: string | number;
    ref_id: string | number;
    ref_no: string | null;
    transaction_date: string;
    status: string | number;
}

export interface ProductLedgerReportParams {
    product_id: string | number;
    from_date: string;
    to_date: string;
}

export interface ProductLedgerReportResponse {
    success: boolean;
    response_code: number;
    data: ProductLedgerItem[];
}
