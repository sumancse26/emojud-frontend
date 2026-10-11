import { useCallback, useMemo } from 'react'
import { useApi } from '@/shared/hooks/useApi'
import { clearGetCache } from '@/shared/services/apiClient'
import { stockService } from '../services/stockService'
import type { StockApiResponse, StockDetailItem, StockItem, StockListItem, StockListParams } from '../types/stock.types'

const toNumber = (value: string | number | undefined) => Number(value ?? 0)
const normalizeStock = (item: StockListItem): StockItem => {
  const stock = item.prod_stock?.[0]
  return {
    id: String(item.id), productCode: item.product_code, productName: item.product_name,
    category: item.category?.category_name ?? '—', brand: item.brand?.lookup_value ?? item.brand?.lookup_code ?? '—',
    unit: item.units?.lookup_value ?? item.units?.lookup_code ?? '—', currentStock: toNumber(stock?.current_stock),
    stockDate: stock?.stock_date,
  }
}

export interface UseStockReturn {
  stocks: StockItem[]
  isLoading: boolean
  isError: boolean
  error: string | null
  refetch: () => Promise<StockApiResponse<StockListItem[]>>
  getStockDetails: (stock: StockItem) => Promise<StockDetailItem[]>
  refetchStockDetails: (stock: StockItem) => Promise<StockDetailItem[]>
  detail: StockDetailItem[]
  isDetailLoading: boolean
  detailError: string | null
}

export function useStock(shopId: string | number): UseStockReturn {
  const params = useMemo<StockListParams>(() => ({ shop_id: shopId }), [shopId])
  const listRequest = useApi<StockApiResponse<StockListItem[]>, StockListParams>(stockService.getStockSummary, { immediate: true, initialParams: params })
  const detailRequest = useApi<StockApiResponse<StockDetailItem[]>, { shop_id: string | number; prod_id: string }> (stockService.getStockDetails, { suspense: false })
  const stocks = useMemo(() => listRequest.data?.data?.map(normalizeStock) ?? [], [listRequest.data])
  const getStockDetails = useCallback(async (stock: StockItem) => {
    const response = await detailRequest.execute({ shop_id: shopId, prod_id: stock.id })
    return response.data ?? []
  }, [detailRequest.execute, shopId])
  const refetchStockDetails = useCallback(async (stock: StockItem) => {
    clearGetCache()
    return getStockDetails(stock)
  }, [getStockDetails])
  return {
    stocks, isLoading: listRequest.isLoading, isError: listRequest.isError, error: listRequest.error,
    refetch: () => listRequest.execute(params), getStockDetails, refetchStockDetails,
    detail: detailRequest.data?.data ?? [], isDetailLoading: detailRequest.isLoading, detailError: detailRequest.error,
  }
}

export default useStock
