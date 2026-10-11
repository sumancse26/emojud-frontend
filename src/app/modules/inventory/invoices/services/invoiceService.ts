import { axios } from '@/shared/services/apiClient'
import type {
  CreateInvoicePayload,
  InvoiceApiResponse,
  InvoiceDetail,
  InvoiceDetailParams,
  InvoiceListItem,
  InvoiceListParams,
} from '../types/invoice.types'

export const invoiceService = {
  getInvoices(params: InvoiceListParams): Promise<InvoiceApiResponse<InvoiceListItem[]>> {
    return axios.get<InvoiceApiResponse<InvoiceListItem[]>>('/api/invoice', params as unknown as Record<string, unknown>)
  },

  getInvoiceDetails(params: InvoiceDetailParams): Promise<InvoiceApiResponse<InvoiceDetail>> {
    return axios.get<InvoiceApiResponse<InvoiceDetail>>('/api/invoice-details', params as unknown as Record<string, unknown>)
  },

  createInvoice(payload: CreateInvoicePayload): Promise<InvoiceApiResponse<InvoiceDetail>> {
    return axios.post<InvoiceApiResponse<InvoiceDetail>>('/api/invoice', payload)
  },
}

export default invoiceService
