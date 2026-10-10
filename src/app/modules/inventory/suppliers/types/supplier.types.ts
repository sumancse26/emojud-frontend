export interface SupplierItem {
    id: string;
    shop_id: string | number;
    supplier_code: string;
    supplier_name: string;
    phone: string | null;
    email: string | null;
    address: string | null;
    previous_due: string | number;
    created_by?: string | number;
    [key: string]: unknown;
}

export interface CreateUpdateSupplierPayload {
    id: number | string | null;
    shop_id: number | string;
    supplier_name: string;
    phone: string;
    email?: string | null;
    address?: string | null;
    previous_due: number | string;
    created_by?: number | string;
    [key: string]: unknown;
}

export interface SupplierListParams {
    shop_id?: number | string;
    phone?: string;
    [key: string]: unknown;
}

export interface SupplierApiResponse<T> {
    success?: boolean;
    response_code?: number;
    message?: string;
    data: T;
}

export type SupplierListResponse = SupplierItem[] | SupplierApiResponse<SupplierItem[]>;
export type SupplierMutationResponse = SupplierItem | SupplierApiResponse<SupplierItem>;
