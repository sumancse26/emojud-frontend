import { useCallback, useMemo } from 'react'
import { useApi } from '@/shared/hooks/useApi'
import { clearGetCache } from '@/shared/services/apiClient'
import { purchaseService } from '../services/purchaseService'
import type {
  CreatePurchasePayload,
  PurchaseApiResponse,
  PurchaseDetailResponse,
  PurchaseItem,
  PurchaseListItem,
  PurchaseListParams,
} from '../types/purchase.types'

const numberValue = (value: string | number | undefined) => Number(value ?? 0)

function normalizePurchase(item: PurchaseListItem | PurchaseDetailResponse['master'], details?: PurchaseDetailResponse['details']): PurchaseItem {
  const isDetail = 'supplier_name' in item
  const status = isDetail ? item.tran_status : item.pur_tran_status?.lookup_code ?? 'Pending'
  return {
    id: String(item.id),
    purchaseNumber: item.purchase_no,
    supplierName: isDetail ? item.supplier_name : item.supplier?.supplier_name ?? 'Unknown Supplier',
    supplierCode: isDetail ? '' : item.supplier?.supplier_code ?? '—',
    purchaseDate: new Date(item.purchase_date).toLocaleDateString('en-GB'),
    status,
    shopId: isDetail ? Number(item.shop_id) : 0,
    totalAmount: isDetail ? numberValue(item.total_amount) : 0,
    discountAmount: isDetail ? numberValue(item.discount_amount) : 0,
    vatAmount: isDetail ? numberValue(item.vat_amount) : 0,
    netAmount: isDetail ? numberValue(item.net_amount) : 0,
    paidAmount: isDetail ? numberValue(item.paid_amount) : 0,
    dueAmount: isDetail ? numberValue(item.due_amount) : 0,
    warehouseId: isDetail ? Number(item.warehouse_id) : undefined,
    supplierId: isDetail ? Number(item.supplier_id) : undefined,
    products: details,
  }
}

export interface UsePurchaseReturn {
  purchases: PurchaseItem[]
  isLoading: boolean
  isError: boolean
  error: string | null
  refetch: () => Promise<PurchaseApiResponse<PurchaseListItem[]>>
  getPurchaseDetails: (purchase: PurchaseItem) => Promise<PurchaseItem>
  refetchPurchaseDetails: (purchase: PurchaseItem) => Promise<PurchaseItem>
  isDetailLoading: boolean
  detailError: string | null
  createPurchase: (payload: CreatePurchasePayload) => Promise<PurchaseApiResponse<PurchaseDetailResponse>>
  isCreating: boolean
  createError: string | null
}

export function usePurchase(shopId: string | number): UsePurchaseReturn {
  const params = useMemo<PurchaseListParams>(() => ({ shop_id: shopId }), [shopId])
  const listRequest = useApi<PurchaseApiResponse<PurchaseListItem[]>, PurchaseListParams>(purchaseService.getPurchases, {
    immediate: true,
    initialParams: params,
  })
  const detailRequest = useApi<PurchaseDetailResponse, { id: string; shop_id: string | number }> (purchaseService.getPurchaseDetails, { suspense: false })
  const createRequest = useApi<PurchaseApiResponse<PurchaseDetailResponse>, CreatePurchasePayload>(purchaseService.createPurchase)

  const purchases = useMemo(() => listRequest.data?.data?.map((item) => normalizePurchase(item)) ?? [], [listRequest.data])
  const getPurchaseDetails = useCallback(async (purchase: PurchaseItem) => {
    const response = await detailRequest.execute({ id: purchase.id, shop_id: shopId })
    return normalizePurchase(response.master, response.details)
  }, [detailRequest.execute, shopId])
  const refetchPurchaseDetails = useCallback(async (purchase: PurchaseItem) => {
    clearGetCache()
    return getPurchaseDetails(purchase)
  }, [getPurchaseDetails])
  const createPurchase = useCallback(async (payload: CreatePurchasePayload) => {
    const response = await createRequest.execute(payload)
    await listRequest.execute(params)
    return response
  }, [createRequest.execute, listRequest.execute, params])

  return {
    purchases,
    isLoading: listRequest.isLoading,
    isError: listRequest.isError,
    error: listRequest.error,
    refetch: () => listRequest.execute(params),
    getPurchaseDetails,
    refetchPurchaseDetails,
    isDetailLoading: detailRequest.isLoading,
    detailError: detailRequest.error,
    createPurchase,
    isCreating: createRequest.isLoading,
    createError: createRequest.error,
  }
}

export default usePurchase
