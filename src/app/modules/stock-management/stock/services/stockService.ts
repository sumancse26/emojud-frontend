import { axios } from '@/shared/services/apiClient'
import type { StockApiResponse, StockDetailItem, StockDetailParams, StockListItem, StockListParams } from '../types/stock.types'

export const stockService = {
  getStockSummary(params: StockListParams): Promise<StockApiResponse<StockListItem[]>> {
    return axios.get<StockApiResponse<StockListItem[]>>('/api/stock-summary', params as unknown as Record<string, unknown>)
  },
  getStockDetails(params: StockDetailParams): Promise<StockApiResponse<StockDetailItem[]>> {
    return axios.get<StockApiResponse<StockDetailItem[]>>('/api/stock-summary-detail', params as unknown as Record<string, unknown>)
  },
}

export default stockService
