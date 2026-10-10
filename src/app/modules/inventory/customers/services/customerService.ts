import { axios } from '@/shared/services/apiClient';
import type {
    CustomerListParams,
    CustomerListResponse,
    CustomerDetailResponse,
    CreateUpdateCustomerPayload,
    CustomerMutationResponse
} from '../types/customer.types';

export const customerService = {
    /**
     * Fetch customer list
     * GET /api/customers?shop_id=1
     */
    async getCustomers(params?: CustomerListParams): Promise<CustomerListResponse> {
        return axios.get<CustomerListResponse>('/api/customers', params as Record<string, unknown>);
    },

    /**
     * Fetch customer details by phone number
     * GET /api/customers/{phone}
     */
    async getCustomerByPhone(phone: string): Promise<CustomerDetailResponse> {
        return axios.get<CustomerDetailResponse>(`/api/customers/${encodeURIComponent(phone)}`);
    },

    /**
     * Create or update a customer
     * POST /api/customers
     */
    async createOrUpdateCustomer(payload: CreateUpdateCustomerPayload): Promise<CustomerMutationResponse> {
        return axios.post<CustomerMutationResponse>('/api/customers', payload);
    }
};

export default customerService;
