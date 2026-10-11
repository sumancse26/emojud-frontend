import type { ReactNode } from 'react';

export interface CustomerDueListParams {
    shop_id: string | number;
}
export interface CustomerDueApiResponse<T> {
    success?: boolean;
    response_code?: number;
    message?: string;
    data?: T;
    summary?: CustomerDueSummary;
}
export interface CustomerDueCustomer {
    id: string;
    customer_name: string;
    customer_code?: string;
    phone?: string;
}
export interface CustomerDueItem {
    id: string;
    invoice_no: string;
    due_date: string;
    total_amount: string | number;
    paid_amount: string | number;
    due_amount: string | number;
    payment_status: number;
    remarks?: string;
    due_cust_info: CustomerDueCustomer;
}
export interface CustomerDuePendingItem extends CustomerDueCustomer {
    previous_due: string | number;
}
export interface CustomerDueInvoiceItem {
    customer_name: ReactNode;
    id: string;
    invoice_no: string;
    customer_id: string;
    due_amount: string | number;
}
export interface CustomerDueSummary {
    total_invoice: number;
    total_due: string | number;
}
export interface CreateCustomerDuePayload {
    id: null;
    shop_id: number;
    customer_id: number;
    ref_type: number;
    ref_id: string | number;
    invoice_no: string;
    due_date: string;
    total_amount: number;
    paid_amount: number;
    due_amount: number;
    payment_status: number;
    remarks: string;
}
