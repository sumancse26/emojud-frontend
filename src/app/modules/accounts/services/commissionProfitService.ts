import { axios } from '@/shared/services/apiClient'
import type { CommissionProfitApiResponse, CommissionProfitItem, CommissionProfitListParams, CreateCommissionProfitPayload } from '../types/commission-profit.types'
export const commissionProfitService = { getList(params: CommissionProfitListParams): Promise<CommissionProfitApiResponse<CommissionProfitItem[]>> { return axios.get('/api/shop-wise-commission-profit', params as unknown as Record<string, unknown>) }, create(payload: CreateCommissionProfitPayload): Promise<CommissionProfitApiResponse<unknown>> { return axios.post('/api/shop-wise-commission-profit', payload) } }
export default commissionProfitService
