export interface SupplierDueReportItem {
    id: string | number;
    payment_no: string;
    shop_id: string | number;
    supplier_id: string | number;
    payment_date: string;
    ref_purchase_id: string | number;
    payment_method_id: string | number;
    total_due: string | number;
    paid_amount: string | number;
    current_due: string | number;
    remarks?: string | null;
    status: string | number;
}

export interface SupplierDueReportResponse {
    success: boolean;
    response_code: number;
    data: SupplierDueReportItem[];
}
