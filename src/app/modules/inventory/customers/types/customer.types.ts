export interface CustomerShop {
    id: string | number;
    display_code?: string;
    short_code?: string;
    shop_name: string;
    [key: string]: unknown;
}

export interface CustomerItem {
    id: string;
    shop_id?: string | number;
    customer_code: string;
    customer_name: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    previous_due: string | number;
    created_by?: string | number;
    shop?: CustomerShop;
    [key: string]: unknown;
}

export interface CreateUpdateCustomerPayload {
    id: number | string | null;
    shop_id: number | string;
    customer_name: string;
    phone: string;
    email?: string | null;
    address?: string | null;
    previous_due: number | string;
    created_by?: number | string;
    [key: string]: unknown;
}

export interface CustomerListParams {
    shop_id?: number | string;
    phone?: string;
    [key: string]: unknown;
}

export interface CustomerApiResponse<T> {
    success?: boolean;
    response_code?: number;
    message?: string;
    data: T;
}

export type CustomerListResponse = CustomerItem[] | CustomerApiResponse<CustomerItem[]>;
export type CustomerDetailResponse = CustomerItem[] | CustomerApiResponse<CustomerItem[]> | CustomerItem | CustomerApiResponse<CustomerItem>;
export type CustomerMutationResponse = CustomerItem | CustomerApiResponse<CustomerItem> | Record<string, unknown>;
