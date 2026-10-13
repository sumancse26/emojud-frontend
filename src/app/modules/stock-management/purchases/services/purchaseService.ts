import { axios } from '@/shared/services/apiClient'
import type {
  CreatePurchasePayload,
  PurchaseApiResponse,
  PurchaseDetailParams,
  PurchaseDetailResponse,
  PurchaseListItem,
  PurchaseListParams,
  PurchaseWarehouseItem,
  PurchaseSupplierItem,
  PurchaseProductItem,
  PurchaseLookupResponse,
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

  updatePurchase(payload: CreatePurchasePayload): Promise<PurchaseApiResponse<PurchaseDetailResponse>> {
    return axios.post<PurchaseApiResponse<PurchaseDetailResponse>>('/api/purchase', payload)
  },

  /** GET /api/warehouse */
  getWarehouses(): Promise<PurchaseWarehouseItem[] | PurchaseApiResponse<PurchaseWarehouseItem[]>> {
    return axios.get<PurchaseWarehouseItem[] | PurchaseApiResponse<PurchaseWarehouseItem[]>>('/api/warehouse')
  },

  /** GET /api/suppliers?shop_id=... */
  getSuppliers(params: { shop_id: string | number }): Promise<PurchaseSupplierItem[] | PurchaseApiResponse<PurchaseSupplierItem[]>> {
    return axios.get<PurchaseSupplierItem[] | PurchaseApiResponse<PurchaseSupplierItem[]>>('/api/suppliers', params as Record<string, unknown>)
  },

  /** GET /api/products?shop_id=... */
  getProducts(params: { shop_id: string | number }): Promise<PurchaseProductItem[] | PurchaseApiResponse<PurchaseProductItem[]>> {
    return axios.get<PurchaseProductItem[] | PurchaseApiResponse<PurchaseProductItem[]>>('/api/products', params as Record<string, unknown>)
  },

  /** GET /api/common/lookup?ids=[4] */
  getQuantityLookups(): Promise<PurchaseLookupResponse> {
    return axios.get<PurchaseLookupResponse>('/api/common/lookup', { ids: '[4]' })
  },
}

export default purchaseService
