import { axios } from '@/shared/services/apiClient'
import type { CreateCustomerDuePayload, CustomerDueApiResponse, CustomerDueInvoiceItem, CustomerDueItem, CustomerDueListParams, CustomerDuePendingItem } from '../types/customer-due.types'
export const customerDueService = {
  getDue(params: CustomerDueListParams): Promise<CustomerDueApiResponse<CustomerDueItem[]>> { return axios.get('/api/customer-due', params as unknown as Record<string, unknown>) },
  getPending(params: CustomerDueListParams): Promise<CustomerDueApiResponse<CustomerDuePendingItem[]>> { return axios.get('/api/customer-due-pending', params as unknown as Record<string, unknown>) },
  getInvoiceWise(params: CustomerDueListParams): Promise<CustomerDueApiResponse<CustomerDueInvoiceItem[]>> { return axios.get('/api/invoice-wise-customer-due', params as unknown as Record<string, unknown>) },
  getPaymentMethods(): Promise<Record<string, unknown>> { return axios.get('/api/common/lookup', { ids: '[7]' }) },
  create(payload: CreateCustomerDuePayload): Promise<CustomerDueApiResponse<unknown>> { return axios.post('/api/customer-due', payload) }
}
export default customerDueService
