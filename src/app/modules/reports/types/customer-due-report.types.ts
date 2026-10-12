export interface CustomerDueReportItem {
    id: string | number;
    shop_id: string | number;
    customer_id: string | number;
    ref_type: string | number;
    ref_id: string | number;
    invoice_no: string;
    due_date: string;
    total_amount: string | number;
    paid_amount: string | number;
    due_amount: string | number;
    payment_status: string | number;
    remarks?: string | null;
    status: string | number;
}

export interface CustomerDueReportResponse {
    success: boolean;
    response_code: number;
    data: CustomerDueReportItem[];
}
