import { axios } from '@/shared/services/apiClient';
import type {
    ProductListParams,
    ProductListResponse,
    ShopWiseProductListResponse,
    CreateUpdateProductPayload,
    ProductMutationResponse
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
     * Create or update a product
     * POST /api/products
     */
    async createOrUpdateProduct(payload: CreateUpdateProductPayload): Promise<ProductMutationResponse> {
        return axios.post<ProductMutationResponse>('/api/products', payload);
    }
};

export default productService;
