import { axios } from '@/shared/services/apiClient';
import type {
    CreateUpdateWarehousePayload,
    WarehouseListParams,
    WarehouseListResponse,
    WarehouseMutationResponse
} from '../types/warehouse.types';

export const warehouseService = {
    /**
     * Fetch list of warehouses
     * GET /api/warehouse
     */
    async getWarehouses(params?: WarehouseListParams): Promise<WarehouseListResponse> {
        return axios.get<WarehouseListResponse>('/api/warehouse', params as Record<string, unknown>);
    },

    /**
     * Create or Update a warehouse
     * POST /api/warehouse
     */
    async createOrUpdateWarehouse(payload: CreateUpdateWarehousePayload): Promise<WarehouseMutationResponse> {
        return axios.post<WarehouseMutationResponse>('/api/warehouse', payload);
    }
};

export default warehouseService;
