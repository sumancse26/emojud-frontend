export interface DailySalesReportDetail {
    id: string;
    invoice_mst_id: string;
    product_id: string;
    qty: string | number;
    rate: string | number;
    vat_amt: string | number;
    disc_amt: string | number;
    total_amount: string | number;
}

export interface DailySalesReportItem {
    id: string;
    invoice_no: string;
    shop_id: string | number;
    customer_id: string | number;
    invoice_date: string;
    total_amount: string | number;
    discount_amount: string | number;
    vat_amount: string | number;
    net_amount: string | number;
    paid_amount: string | number;
    due_amount: string | number;
    tran_status: string | number | null;
    status: number;
    invoiceDtls?: DailySalesReportDetail[];
}

export interface DailySalesReportParams {
    from_date: string;
    to_date: string;
}

export interface DailySalesReportResponse {
    success: boolean;
    response_code: number;
    data: DailySalesReportItem[];
}
