export interface WarehouseShop {
    id: string | number;
    display_code?: string | null;
    short_code?: string | null;
    shop_name?: string | null;
    address?: string | null;
    address_2?: string | null;
    phone?: string | null;
    image?: number | string | null;
}

export interface WarehouseItem {
    id: string | number;
    shop_id: string | number;
    warehouse_name: string;
    company_id?: string | number;
    address?: string | null;
    created_by?: string | number;
    shop?: WarehouseShop;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
}

export interface CreateUpdateWarehousePayload {
    id?: string | number | null;
    shop_id: string | number;
    warehouse_name: string;
    company_id?: string | number;
    address?: string | null;
    created_by?: string | number;
    [key: string]: unknown;
}

export interface WarehouseListParams {
    company_id?: string | number;
    shop_id?: string | number;
    search?: string;
    [key: string]: unknown;
}

export interface WarehouseApiResponse<T> {
    success?: boolean;
    data: T;
    message?: string;
    response_code?: number;
}

export type WarehouseListResponse = WarehouseItem[] | WarehouseApiResponse<WarehouseItem[]>;
export type WarehouseMutationResponse = WarehouseItem | WarehouseApiResponse<WarehouseItem>;
