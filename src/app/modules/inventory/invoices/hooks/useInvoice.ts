import { useCallback, useMemo } from 'react'
import { useApi } from '@/shared/hooks/useApi'
import { clearGetCache } from '@/shared/services/apiClient'
import { invoiceService } from '../services/invoiceService'
import type {
  CreateInvoicePayload,
  Invoice,
  InvoiceApiResponse,
  InvoiceDetail,
  InvoiceDetailParams,
  InvoiceListItem,
  InvoiceListParams,
} from '../types/invoice.types'

const toNumber = (value: string | number | undefined): number => Number(value ?? 0)

function normalizeInvoice(item: InvoiceListItem | InvoiceDetail): Invoice {
  const status = item.tranStatus?.lookup_code ?? 'Due'
  return {
    id: String(item.id),
    invoiceNumber: item.invoice_no,
    customerName: item.customer?.customer_name ?? 'Walk-in Customer',
    customerPhone: item.customer?.customer_code ?? '—',
    issueDate: new Date(item.invoice_date).toLocaleDateString('en-GB'),
    paymentMethod: status,
    totalAmount: toNumber(item.total_amount),
    paidAmount: toNumber(item.paid_amount),
    dueAmount: toNumber(item.due_amount),
    status: status.toLowerCase().includes('paid')
      ? 'Paid'
      : toNumber(item.due_amount) > 0 && toNumber(item.paid_amount) > 0
        ? 'Partial'
        : 'Due',
    shopId: Number(item.shop?.id ?? 0),
    customerId: Number(item.customer?.id ?? 0),
    items: 'invoiceDtls' in item
      ? (item.invoiceDtls ?? []).map((detail) => ({
          id: String(detail.id),
          name: detail.product?.product_name ?? 'Product',
          sku: detail.product?.product_code ?? '—',
          quantity: toNumber(detail.qty),
          unitPrice: toNumber(detail.rate),
          total: toNumber(detail.total_amount),
        }))
      : undefined,
  }
}

export interface UseInvoiceReturn {
  invoices: Invoice[]
  isLoading: boolean
  isError: boolean
  error: string | null
  refetch: () => Promise<InvoiceApiResponse<InvoiceListItem[]>>
  getInvoiceDetails: (invoice: Invoice) => Promise<Invoice>
  refetchInvoiceDetails: (invoice: Invoice) => Promise<Invoice>
  detail: Invoice | null
  isDetailLoading: boolean
  detailError: string | null
  createInvoice: (payload: CreateInvoicePayload) => Promise<InvoiceApiResponse<InvoiceDetail>>
  isCreating: boolean
  createError: string | null
}

export function useInvoice(shopId: string | number): UseInvoiceReturn {
  const params = useMemo<InvoiceListParams>(() => ({ shop_id: shopId }), [shopId])

  const listRequest = useApi<InvoiceApiResponse<InvoiceListItem[]>, InvoiceListParams>(
    invoiceService.getInvoices,
    { immediate: true, initialParams: params },
  )

  const detailRequest = useApi<InvoiceApiResponse<InvoiceDetail>, InvoiceDetailParams>(
    invoiceService.getInvoiceDetails,
    { suspense: false },
  )

  const createRequest = useApi<InvoiceApiResponse<InvoiceDetail>, CreateInvoicePayload>(
    invoiceService.createInvoice,
  )

  const invoices = useMemo(
    () => listRequest.data?.data?.map(normalizeInvoice) ?? [],
    [listRequest.data],
  )

  const getInvoiceDetails = useCallback(async (invoice: Invoice): Promise<Invoice> => {
    const response = await detailRequest.execute({ inv_id: invoice.id, shop_id: invoice.shopId ?? shopId })
    return normalizeInvoice(response.data)
  }, [detailRequest.execute, shopId])

  const refetchInvoiceDetails = useCallback(async (invoice: Invoice): Promise<Invoice> => {
    // A manual refresh must bypass the 30-minute GET cache.
    clearGetCache()
    return getInvoiceDetails(invoice)
  }, [getInvoiceDetails])

  const createInvoice = useCallback(async (payload: CreateInvoicePayload) => {
    const response = await createRequest.execute(payload)
    // The POST clears the GET cache; this explicitly requests the updated list.
    await listRequest.execute(params)
    return response
  }, [createRequest.execute, listRequest.execute, params])

  return {
    invoices,
    isLoading: listRequest.isLoading,
    isError: listRequest.isError,
    error: listRequest.error,
    refetch: () => listRequest.execute(params),
    getInvoiceDetails,
    refetchInvoiceDetails,
    detail: detailRequest.data ? normalizeInvoice(detailRequest.data.data) : null,
    isDetailLoading: detailRequest.isLoading,
    detailError: detailRequest.error,
    createInvoice,
    isCreating: createRequest.isLoading,
    createError: createRequest.error,
  }
}

export default useInvoice
