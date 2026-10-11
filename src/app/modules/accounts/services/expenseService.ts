import { axios } from '@/shared/services/apiClient'
import type { CreateExpensePayload, ExpenseApiResponse, ExpenseDetailItem, ExpenseListItem, ExpenseListParams, ExpenseLookupResponse } from '../types/expense.types'

export const expenseService = {
  getExpenses(params: ExpenseListParams): Promise<ExpenseApiResponse<ExpenseListItem[]>> {
    return axios.get<ExpenseApiResponse<ExpenseListItem[]>>('/api/expense', params as unknown as Record<string, unknown>)
  },
  getExpenseDetails(id: string | number): Promise<ExpenseApiResponse<ExpenseDetailItem[]>> {
    return axios.get<ExpenseApiResponse<ExpenseDetailItem[]>>(`/api/expense/${id}`)
  },
  getExpenseLookups(): Promise<ExpenseLookupResponse> {
    return axios.get<ExpenseLookupResponse>('/api/common/lookup', { ids: '[6,7]' })
  },
  createExpense(payload: CreateExpensePayload): Promise<ExpenseApiResponse<ExpenseDetailItem[]>> {
    return axios.post<ExpenseApiResponse<ExpenseDetailItem[]>>('/api/expense', payload)
  },
}

export default expenseService
