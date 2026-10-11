import { useCallback, useMemo } from 'react'
import { useApi } from '@/shared/hooks/useApi'
import { clearGetCache } from '@/shared/services/apiClient'
import { supplierPaymentService } from '../services/supplierPaymentService'
import type { CreateSupplierPaymentPayload, SupplierPaymentApiResponse, SupplierPaymentDueItem, SupplierPaymentListItem, SupplierPaymentListParams, SupplierPaymentPendingItem } from '../types/supplier-payment.types'

export interface SupplierPaymentLookup { id: string; lookup_code: string; lookup_value: string }

export interface UseSupplierPaymentReturn {
  payments: SupplierPaymentListItem[]
  duePurchases: SupplierPaymentDueItem[]
  pendingSuppliers: SupplierPaymentPendingItem[]
  summary: SupplierPaymentApiResponse<SupplierPaymentDueItem[]>['summary']
  paymentMethods: SupplierPaymentLookup[]
  isLoading: boolean
  isLoadingDue: boolean
  isLoadingPending: boolean
  isLoadingPaymentMethods: boolean
  error: string | null
  dueError: string | null
  pendingError: string | null
  paymentMethodsError: string | null
  refetch: () => Promise<SupplierPaymentApiResponse<SupplierPaymentListItem[]>>
  refetchDue: () => Promise<SupplierPaymentApiResponse<SupplierPaymentDueItem[]>>
  createPayment: (payload: CreateSupplierPaymentPayload) => Promise<SupplierPaymentApiResponse<unknown>>
  isCreating: boolean
  createError: string | null
}

function normalizePaymentMethods(response: Record<string, unknown> | null): SupplierPaymentLookup[] {
  const responseData = response?.data && typeof response.data === 'object' && !Array.isArray(response.data)
    ? response.data as Record<string, unknown>
    : null
  const raw = response?.payment_method ?? response?.paymentMethods ?? responseData?.payment_method ?? responseData?.paymentMethods ?? response?.data
  if (!Array.isArray(raw)) return []
  return raw.flatMap((item) => {
    if (!item || typeof item !== 'object') return []
    const lookup = item as Record<string, unknown>
    if (lookup.id === undefined || typeof lookup.lookup_code !== 'string') return []
    return [{ id: String(lookup.id), lookup_code: lookup.lookup_code, lookup_value: typeof lookup.lookup_value === 'string' ? lookup.lookup_value : lookup.lookup_code }]
  })
}

export function useSupplierPayment(shopId: string | number): UseSupplierPaymentReturn {
  const params = useMemo<SupplierPaymentListParams>(() => ({ shop_id: shopId }), [shopId])
  const paymentsRequest = useApi<SupplierPaymentApiResponse<SupplierPaymentListItem[]>, SupplierPaymentListParams>(supplierPaymentService.getPayments, { immediate: true, initialParams: params })
  const dueRequest = useApi<SupplierPaymentApiResponse<SupplierPaymentDueItem[]>, SupplierPaymentListParams>(supplierPaymentService.getDuePurchases, { immediate: true, initialParams: params, suspense: false })
  const pendingRequest = useApi<SupplierPaymentApiResponse<SupplierPaymentPendingItem[]>, SupplierPaymentListParams>(supplierPaymentService.getPendingSuppliers, { immediate: true, initialParams: params, suspense: false })
  const methodsRequest = useApi<Record<string, unknown>, void>(supplierPaymentService.getPaymentMethods, { immediate: true, suspense: false })
  const createRequest = useApi<SupplierPaymentApiResponse<unknown>, CreateSupplierPaymentPayload>(supplierPaymentService.createPayment)
  const createPayment = useCallback(async (payload: CreateSupplierPaymentPayload) => { const response = await createRequest.execute(payload); clearGetCache(); await Promise.all([paymentsRequest.execute(params), dueRequest.execute(params), pendingRequest.execute(params)]); return response }, [createRequest.execute, paymentsRequest.execute, dueRequest.execute, pendingRequest.execute, params])
  return { payments: paymentsRequest.data?.data ?? [], duePurchases: dueRequest.data?.data ?? [], pendingSuppliers: pendingRequest.data?.data ?? [], summary: dueRequest.data?.summary, paymentMethods: normalizePaymentMethods(methodsRequest.data), isLoading: paymentsRequest.isLoading, isLoadingDue: dueRequest.isLoading, isLoadingPending: pendingRequest.isLoading, isLoadingPaymentMethods: methodsRequest.isLoading, error: paymentsRequest.error, dueError: dueRequest.error, pendingError: pendingRequest.error, paymentMethodsError: methodsRequest.error, refetch: () => paymentsRequest.execute(params), refetchDue: () => dueRequest.execute(params), createPayment, isCreating: createRequest.isLoading, createError: createRequest.error }
}

export default useSupplierPayment
