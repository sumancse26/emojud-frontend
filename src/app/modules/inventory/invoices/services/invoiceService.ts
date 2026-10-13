import { axios } from '@/shared/services/apiClient'
import type {
  CreateInvoicePayload,
  InvoiceApiResponse,
  InvoiceDetail,
  InvoiceDetailParams,
  InvoiceListItem,
  InvoiceListParams,
  InvoiceMutationResponse,
  PaymentMethodLookupResponse,
  ShopWiseProductResponse,
} from '../types/invoice.types'
import type { CustomerListResponse, CreateUpdateCustomerPayload, CustomerMutationResponse } from '@/app/modules/inventory/customers/types/customer.types'

export const invoiceService = {
  getInvoices(params: InvoiceListParams): Promise<InvoiceApiResponse<InvoiceListItem[]>> {
    return axios.get<InvoiceApiResponse<InvoiceListItem[]>>('/api/invoice', params as unknown as Record<string, unknown>)
  },

  getInvoiceDetails(params: InvoiceDetailParams): Promise<InvoiceApiResponse<InvoiceDetail>> {
    return axios.get<InvoiceApiResponse<InvoiceDetail>>('/api/invoice-details', params as unknown as Record<string, unknown>)
  },

  createInvoice(payload: CreateInvoicePayload): Promise<InvoiceMutationResponse> {
    return axios.post<InvoiceMutationResponse>('/api/invoice', payload)
  },

  updateInvoice(payload: CreateInvoicePayload): Promise<InvoiceMutationResponse> {
    return axios.post<InvoiceMutationResponse>('/api/invoice', payload)
  },

  /** GET /api/customers?shop_id=... */
  getCustomers(params: { shop_id: string | number }): Promise<CustomerListResponse> {
    return axios.get<CustomerListResponse>('/api/customers', params as Record<string, unknown>)
  },

  /** GET /api/common/lookup?ids=[7]  →  payment_method list */
  getPaymentMethods(): Promise<PaymentMethodLookupResponse> {
    return axios.get<PaymentMethodLookupResponse>('/api/common/lookup', { ids: '[7]' })
  },

  /** GET /api/shop-wise-products?shop_id=... */
  getShopWiseProducts(params: { shop_id: string | number }): Promise<ShopWiseProductResponse> {
    return axios.get<ShopWiseProductResponse>('/api/shop-wise-products', params as Record<string, unknown>)
  },

  /** POST /api/customers  →  create a new customer inline */
  createCustomer(payload: CreateUpdateCustomerPayload): Promise<CustomerMutationResponse> {
    return axios.post<CustomerMutationResponse>('/api/customers', payload)
  },
}

export default invoiceService
