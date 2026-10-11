import { axios } from '@/shared/services/apiClient'
import type { CreateSupplierPaymentPayload, SupplierPaymentApiResponse, SupplierPaymentDueItem, SupplierPaymentListItem, SupplierPaymentListParams, SupplierPaymentPendingItem } from '../types/supplier-payment.types'

export const supplierPaymentService = {
  getPayments(params: SupplierPaymentListParams): Promise<SupplierPaymentApiResponse<SupplierPaymentListItem[]>> {
    return axios.get('/api/supplier-payment', params as unknown as Record<string, unknown>)
  },
  getDuePurchases(params: SupplierPaymentListParams): Promise<SupplierPaymentApiResponse<SupplierPaymentDueItem[]>> {
    return axios.get('/api/supplier-payment-due', params as unknown as Record<string, unknown>)
  },
  getPendingSuppliers(params: SupplierPaymentListParams): Promise<SupplierPaymentApiResponse<SupplierPaymentPendingItem[]>> {
    return axios.get('/api/supplier-payment-pending-due', params as unknown as Record<string, unknown>)
  },
  getPaymentMethods(): Promise<Record<string, unknown>> {
    return axios.get('/api/common/lookup', { ids: '[7]' })
  },
  createPayment(payload: CreateSupplierPaymentPayload): Promise<SupplierPaymentApiResponse<unknown>> {
    return axios.post('/api/supplier-payment', payload)
  }
}

export default supplierPaymentService
