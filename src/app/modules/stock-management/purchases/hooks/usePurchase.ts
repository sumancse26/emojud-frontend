import { useCallback, useEffect, useMemo, useState } from 'react'
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
  PurchaseWarehouseItem,
  PurchaseSupplierItem,
  PurchaseProductItem,
  PurchaseLookupItem,
} from '../types/purchase.types'

const numberValue = (value: string | number | undefined) => Number(value ?? 0)

function normalizePurchase(item: PurchaseListItem | PurchaseDetailResponse['master'], details?: PurchaseDetailResponse['details']): PurchaseItem {
  const isDetail = 'supplier_name' in item
  const status = isDetail ? item.tran_status : item.pur_tran_status?.lookup_code ?? 'Pending'
  const master = isDetail ? (item as PurchaseDetailResponse['master']) : undefined
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
    challanNo: master?.challan_no ?? undefined,
    challanDate: master?.challan_date ? new Date(master.challan_date).toLocaleDateString('en-GB') : undefined,
    rawPurchaseDate: item.purchase_date,
    rawChallanDate: master?.challan_date ?? undefined,
    isSubmit: item.is_submit,
    isConfirm: item.is_confirm,
    products: details,
  }
}

function extractArray<T>(res: unknown): T[] {
  if (!res) return []
  if (Array.isArray(res)) return res
  if (typeof res === 'object' && res !== null && 'data' in res && Array.isArray((res as { data: unknown }).data)) {
    return (res as { data: T[] }).data
  }
  return []
}

export function normalizeQuantityLookups(raw: unknown): PurchaseLookupItem[] {
  if (!raw) return []
  const data = (typeof raw === 'object' && raw !== null && 'data' in raw) ? (raw as { data: unknown }).data : raw

  if (Array.isArray(data)) {
    return data.map((item) => ({
      id: String(item.id),
      lookup_code: String(item.lookup_code ?? ''),
      lookup_value: String(item.lookup_value ?? item.lookup_code ?? item.id),
    }))
  }

  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>
    const arrayCandidate =
      record['4'] ??
      record['unit'] ??
      record['units'] ??
      record['quantity'] ??
      record['quantities'] ??
      Object.values(record).find(Array.isArray)
    if (Array.isArray(arrayCandidate)) {
      return arrayCandidate.map((item) => ({
        id: String(item.id),
        lookup_code: String(item.lookup_code ?? ''),
        lookup_value: String(item.lookup_value ?? item.lookup_code ?? item.id),
      }))
    }
  }

  return []
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
  updatePurchase: (payload: CreatePurchasePayload) => Promise<PurchaseApiResponse<PurchaseDetailResponse>>
  isUpdating: boolean
  updateError: string | null

  // Master dropdown lists
  warehouses: PurchaseWarehouseItem[]
  suppliers: PurchaseSupplierItem[]
  products: PurchaseProductItem[]
  quantityUnits: PurchaseLookupItem[]
  isLoadingMasters: boolean
  mastersError: string | null
  fetchMasters: () => Promise<void>
}

export function usePurchase(shopId: string | number): UsePurchaseReturn {
  const params = useMemo<PurchaseListParams>(() => ({ shop_id: shopId }), [shopId])
  const listRequest = useApi<PurchaseApiResponse<PurchaseListItem[]>, PurchaseListParams>(purchaseService.getPurchases, {
    immediate: true,
    initialParams: params,
  })
  const detailRequest = useApi<PurchaseDetailResponse, { id: string; shop_id: string | number }>(purchaseService.getPurchaseDetails, { suspense: false })
  const createRequest = useApi<PurchaseApiResponse<PurchaseDetailResponse>, CreatePurchasePayload>(purchaseService.createPurchase)
  const updateRequest = useApi<PurchaseApiResponse<PurchaseDetailResponse>, CreatePurchasePayload>(purchaseService.updatePurchase)

  const [warehouses, setWarehouses] = useState<PurchaseWarehouseItem[]>([])
  const [suppliers, setSuppliers] = useState<PurchaseSupplierItem[]>([])
  const [products, setProducts] = useState<PurchaseProductItem[]>([])
  const [quantityUnits, setQuantityUnits] = useState<PurchaseLookupItem[]>([])
  const [isLoadingMasters, setIsLoadingMasters] = useState(false)
  const [mastersError, setMastersError] = useState<string | null>(null)

  const fetchMasters = useCallback(async () => {
    setIsLoadingMasters(true)
    setMastersError(null)
    try {
      const [warehouseRes, supplierRes, productRes, lookupRes] = await Promise.all([
        purchaseService.getWarehouses().catch(() => []),
        purchaseService.getSuppliers({ shop_id: shopId }).catch(() => []),
        purchaseService.getProducts({ shop_id: shopId }).catch(() => []),
        purchaseService.getQuantityLookups().catch(() => null),
      ])
      setWarehouses(extractArray<PurchaseWarehouseItem>(warehouseRes))
      setSuppliers(extractArray<PurchaseSupplierItem>(supplierRes))
      setProducts(extractArray<PurchaseProductItem>(productRes))
      setQuantityUnits(normalizeQuantityLookups(lookupRes))
    } catch (err) {
      setMastersError(err instanceof Error ? err.message : 'Failed to load purchase options')
    } finally {
      setIsLoadingMasters(false)
    }
  }, [shopId])

  useEffect(() => {
    void fetchMasters()
  }, [fetchMasters])

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
  const updatePurchase = useCallback(async (payload: CreatePurchasePayload) => {
    const response = await updateRequest.execute(payload)
    await listRequest.execute(params)
    return response
  }, [updateRequest.execute, listRequest.execute, params])

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
    updatePurchase,
    isUpdating: updateRequest.isLoading,
    updateError: updateRequest.error,
    warehouses,
    suppliers,
    products,
    quantityUnits,
    isLoadingMasters,
    mastersError,
    fetchMasters,
  }
}

export default usePurchase
