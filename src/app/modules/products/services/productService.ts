import { axios } from '@/shared/services/apiClient';
import type {
    ProductListParams,
    ProductListResponse,
    ShopWiseProductListResponse,
    CreateUpdateProductPayload,
    ProductMutationResponse,
    ProductCategoryResponse,
    ProductCommonLookupResponse
} from '../types/product.types';

export const productService = {
    /**
     * Fetch master products list
     * GET /api/products?shop_id=...
     */
    async getProducts(params?: ProductListParams): Promise<ProductListResponse> {
        return axios.get<ProductListResponse>('/api/products', params as Record<string, unknown>);
    },

    /**
     * Fetch shop-wise products with inventory quantities
     * GET /api/shop-wise-products?shop_id=...
     */
    async getShopWiseProducts(params?: ProductListParams): Promise<ShopWiseProductListResponse> {
        return axios.get<ShopWiseProductListResponse>('/api/shop-wise-products', params as Record<string, unknown>);
    },

    /**
     * Fetch product categories
     * GET /api/product-category
     */
    async getCategories(): Promise<ProductCategoryResponse> {
        return axios.get<ProductCategoryResponse>('/api/product-category');
    },

    /**
     * Fetch product subcategories for a given category
     * GET /api/product-sub-category/:id
     */
    async getSubCategories(categoryId: string | number): Promise<ProductCategoryResponse> {
        return axios.get<ProductCategoryResponse>(`/api/product-sub-category/${categoryId}`);
    },

    /**
     * Fetch common lookups for brands (3) and uom (4)
     * GET /api/common/lookup?ids=[3,4]
     */
    async getLookups(): Promise<ProductCommonLookupResponse> {
        return axios.get<ProductCommonLookupResponse>('/api/common/lookup', { ids: '[3,4]' });
    },

    /**
     * Create or update a product
     * POST /api/products
     */
    async createOrUpdateProduct(payload: CreateUpdateProductPayload): Promise<ProductMutationResponse> {
        return axios.post<ProductMutationResponse>('/api/products', payload);
    }
};

export default productService;
