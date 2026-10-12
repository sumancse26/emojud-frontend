export interface DailyExpenseReportDetail {
    id: string | number;
    expense_mst_id: string | number;
    expense_head_id: string | number;
    amount: string | number;
    payment_method_id: string | number;
    remarks?: string | null;
}

export interface DailyExpenseReportItem {
    id: string | number;
    expense_no: string;
    shop_id: string | number;
    expense_date: string;
    total_amount: string | number;
    remarks?: string | null;
    status: string | number;
    created_by?: string | number | null;
    created_at?: string | null;
    expenseDtls?: DailyExpenseReportDetail[];
}

export interface DailyExpenseReportParams {
    from_date: string;
    to_date: string;
}

export interface DailyExpenseReportResponse {
    success: boolean;
    response_code: number;
    data: DailyExpenseReportItem[];
}
