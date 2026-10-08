export interface ProductCategoryItem {
    id: string | number;
    category_name: string;
    parent_category_id?: string | number | null;
    company_id?: string | number;
    created_by?: string | number;
    subcategories?: ProductCategoryItem[];
    [key: string]: unknown;
}

export interface CreateUpdateCategoryPayload {
    id?: string | number | null;
    parent_category_id?: string | number | null;
    category_name: string;
    company_id?: string | number;
    created_by?: string | number;
    [key: string]: unknown;
}

export interface CategoryApiResponse<T> {
    success?: boolean;
    data: T;
    message?: string;
    response_code?: number;
}

export type CategoryListResponse = ProductCategoryItem[] | CategoryApiResponse<ProductCategoryItem[]>;
export type CategoryMutationResponse = ProductCategoryItem | CategoryApiResponse<ProductCategoryItem>;
