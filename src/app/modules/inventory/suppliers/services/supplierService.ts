import { axios } from '@/shared/services/apiClient';
import type {
    SupplierListParams,
    SupplierListResponse,
    CreateUpdateSupplierPayload,
    SupplierMutationResponse
} from '../types/supplier.types';

export const supplierService = {
    /**
     * Fetch the list of suppliers
     * GET /api/suppliers?shop_id=...
     */
    async getSuppliers(params?: SupplierListParams): Promise<SupplierListResponse> {
        return axios.get<SupplierListResponse>('/api/suppliers', params as Record<string, unknown>);
    },

    /**
     * Fetch supplier details by phone number
     * GET /api/suppliers/{phone}
     */
    async getSupplierByPhone(phone: string): Promise<SupplierListResponse> {
        return axios.get<SupplierListResponse>(`/api/suppliers/${encodeURIComponent(phone)}`);
    },

    /**
     * Create or update a supplier
     * POST /api/suppliers
     */
    async createOrUpdateSupplier(payload: CreateUpdateSupplierPayload): Promise<SupplierMutationResponse> {
        return axios.post<SupplierMutationResponse>('/api/suppliers', payload);
    }
};

export default supplierService;
