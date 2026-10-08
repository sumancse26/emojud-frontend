import { axios } from '@/shared/services/apiClient';
import type {
    CreateUpdateShopPayload,
    ShopListParams,
    ShopListResponse,
    ShopMutationResponse
} from '../types/shop.types';

export const shopService = {
    /**
     * Fetch the list of shops
     * GET /api/shop
     */
    async getShops(params?: ShopListParams): Promise<ShopListResponse> {
        return axios.get<ShopListResponse>('/api/shop', params as Record<string, unknown>);
    },

    /**
     * Create or Update a shop
     * POST /api/create-update-shop
     */
    async createOrUpdateShop(payload: CreateUpdateShopPayload): Promise<ShopMutationResponse> {
        return axios.post<ShopMutationResponse>('/api/create-update-shop', payload);
    }
};

export default shopService;
