export interface ProductCategoryRef {
    id: string | number;
    category_name: string;
    parent_category_id?: string | number | null;
}

export interface ProductLookupRef {
    id: string | number;
    lookup_code: string;
    lookup_value: string;
}

export interface ProductItem {
    id: string;
    product_code: string;
    product_name: string;
    barcode?: string | null;
    purchase_rate: string | number;
    retail_rate: string | number;
    sales_rate: string | number;
    min_stock_qty?: string | number;
    is_batch_wise?: number;
    is_expire_wise?: number;
    specifications?: string | null;
    category?: ProductCategoryRef | null;
    brand?: ProductLookupRef | null;
    units?: ProductLookupRef | null;
    avail_stock?: string | number;
    status?: number;
    image?: string | number | null;
    [key: string]: unknown;
}

export interface ShopWiseProductItem {
    id: string;
    product_code: string;
    product_name: string;
    purchase_rate: string | number;
    retail_rate: string | number;
    sales_rate: string | number;
    avail_stock: string | number;
    [key: string]: unknown;
}

export interface CreateUpdateProductPayload {
    id?: number | string;
    product_name: string;
    product_code: string;
    specifications?: string;
    barcode?: string;
    category_id?: number | string;
    sub_category_id?: number | string;
    brand_id?: number | string;
    unit_id?: number | string;
    purchase_rate: number | string;
    retail_rate: number | string;
    sales_rate: number | string;
    min_stock_qty?: number | string;
    image?: number | string;
    is_batch_wise: number;
    is_expire_wise: number;
    status: number;
    shop_id?: number | string;
    [key: string]: unknown;
}

export interface ProductListParams {
    shop_id?: number | string;
    search?: string;
    [key: string]: unknown;
}

export interface ProductApiResponse<T> {
    success?: boolean;
    response_code?: number;
    message?: string;
    data: T;
}

export type ProductListResponse = ProductItem[] | ProductApiResponse<ProductItem[]>;
export type ShopWiseProductListResponse = ShopWiseProductItem[] | ProductApiResponse<ShopWiseProductItem[]>;
export type ProductMutationResponse = ProductItem | ProductApiResponse<ProductItem>;
