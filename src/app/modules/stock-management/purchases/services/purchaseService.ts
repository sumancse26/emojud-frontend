import { axios } from '@/shared/services/apiClient'
import type {
  CreatePurchasePayload,
  PurchaseApiResponse,
  PurchaseDetailParams,
  PurchaseDetailResponse,
  PurchaseListItem,
  PurchaseListParams,
} from '../types/purchase.types'

export const purchaseService = {
  getPurchases(params: PurchaseListParams): Promise<PurchaseApiResponse<PurchaseListItem[]>> {
    return axios.get<PurchaseApiResponse<PurchaseListItem[]>>('/api/purchase', params as unknown as Record<string, unknown>)
  },

  getPurchaseDetails(params: PurchaseDetailParams): Promise<PurchaseDetailResponse> {
    return axios.get<PurchaseDetailResponse>('/api/purchase-details', params as unknown as Record<string, unknown>)
  },

  createPurchase(payload: CreatePurchasePayload): Promise<PurchaseApiResponse<PurchaseDetailResponse>> {
    return axios.post<PurchaseApiResponse<PurchaseDetailResponse>>('/api/purchase', payload)
  },
}

export default purchaseService
