/**
 * Shop types and API payload/response definitions
 */

export interface ShopItem {
    id: number | string;
    company_id?: number | string;
    display_code?: string;
    short_code?: string;
    shop_name: string;
    address?: string | null;
    address_2?: string | null;
    phone?: string | null;
    image?: number | string | null;
    slogan?: string | null;
    status?: number;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
}

export interface CreateUpdateShopPayload {
    id?: number | string;
    company_id?: number | string;
    display_code?: string;
    short_code?: string;
    shop_name: string;
    address?: string | null;
    address_2?: string | null;
    phone?: string | null;
    image?: number | string | null;
    slogan?: string | null;
    status?: number;
    [key: string]: unknown;
}

export interface ShopListParams {
    company_id?: number | string;
    status?: number;
    search?: string;
    [key: string]: unknown;
}

export interface ShopApiResponse<T> {
    success?: boolean;
    data: T;
    message?: string;
    response_code?: number;
}

export type ShopListResponse = ShopItem[] | ShopApiResponse<ShopItem[]>;
export type ShopMutationResponse = ShopItem | ShopApiResponse<ShopItem>;
