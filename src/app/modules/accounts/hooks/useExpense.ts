import { useCallback, useMemo } from 'react'
import { useApi } from '@/shared/hooks/useApi'
import { clearGetCache } from '@/shared/services/apiClient'
import { expenseService } from '../services/expenseService'
import type { CreateExpensePayload, ExpenseApiResponse, ExpenseDetailItem, ExpenseItem, ExpenseListItem, ExpenseListParams, ExpenseLookup, ExpenseLookupResponse } from '../types/expense.types'

const normalize = (item: ExpenseListItem): ExpenseItem => ({ id: String(item.id), expenseNumber: item.expense_no, expenseDate: new Date(item.expense_date).toLocaleDateString('en-GB'), remarks: item.remarks ?? '—' })

export interface UseExpenseReturn {
  expenses: ExpenseItem[]
  isLoading: boolean
  isError: boolean
  error: string | null
  refetch: () => Promise<ExpenseApiResponse<ExpenseListItem[]>>
  getExpenseDetails: (expense: ExpenseItem) => Promise<ExpenseDetailItem[]>
  refetchExpenseDetails: (expense: ExpenseItem) => Promise<ExpenseDetailItem[]>
  detail: ExpenseDetailItem[]
  isDetailLoading: boolean
  detailError: string | null
  createExpense: (payload: CreateExpensePayload) => Promise<ExpenseApiResponse<ExpenseDetailItem[]>>
  isCreating: boolean
  createError: string | null
  expenseHeads: ExpenseLookup[]
  paymentMethods: ExpenseLookup[]
  isLoadingLookups: boolean
  lookupError: string | null
}

function normalizeLookups(response: ExpenseLookupResponse | null): { expenseHeads: ExpenseLookup[]; paymentMethods: ExpenseLookup[] } {
  const raw = response?.data ?? response
  const groups: Record<string, unknown[]> = { '6': [], '7': [] }
  const add = (groupId: string, values: unknown) => {
    if (Array.isArray(values)) groups[groupId] = values
  }

  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const record = raw as Record<string, unknown>
    add('6', record['6'] ?? record.expenses ?? record.expense ?? record.expenseHeads ?? record.expense_heads)
    add('7', record['7'] ?? record.payment_method ?? record.payment ?? record.paymentMethods ?? record.payment_methods)
  }

  if (Array.isArray(raw)) {
    raw.forEach((entry) => {
      if (!entry || typeof entry !== 'object') return
      const item = entry as Record<string, unknown>
      const groupId = String(item.lookup_id ?? item.lookup_type_id ?? item.lookup_group_id ?? item.group_id ?? item.type_id ?? ((item.id === '6' || item.id === '7') ? item.id : ''))
      const values = item.items ?? item.lookups ?? item.data ?? item.values
      if ((groupId === '6' || groupId === '7') && Array.isArray(values)) add(groupId, values)
      else if (item.id !== undefined && item.lookup_code && item.lookup_value) {
        const fallbackGroup = groupId === '7' ? '7' : '6'
        groups[fallbackGroup].push(item)
      }
    })
  }

  const toLookup = (value: unknown): ExpenseLookup | null => {
    if (!value || typeof value !== 'object') return null
    const item = value as Record<string, unknown>
    if (item.id === undefined || typeof item.lookup_code !== 'string') return null
    return { id: String(item.id), lookup_code: item.lookup_code, lookup_value: typeof item.lookup_value === 'string' ? item.lookup_value : item.lookup_code }
  }
  return { expenseHeads: groups['6'].map(toLookup).filter((item): item is ExpenseLookup => item !== null), paymentMethods: groups['7'].map(toLookup).filter((item): item is ExpenseLookup => item !== null) }
}

export function useExpense(shopId: string | number): UseExpenseReturn {
  const params = useMemo<ExpenseListParams>(() => ({ shop_id: shopId }), [shopId])
  const listRequest = useApi<ExpenseApiResponse<ExpenseListItem[]>, ExpenseListParams>(expenseService.getExpenses, { immediate: true, initialParams: params })
  const detailRequest = useApi<ExpenseApiResponse<ExpenseDetailItem[]>, string | number>(expenseService.getExpenseDetails, { suspense: false })
  const lookupRequest = useApi<ExpenseLookupResponse, void>(expenseService.getExpenseLookups, { immediate: true, suspense: false })
  const createRequest = useApi<ExpenseApiResponse<ExpenseDetailItem[]>, CreateExpensePayload>(expenseService.createExpense)
  const expenses = useMemo(() => listRequest.data?.data?.map(normalize) ?? [], [listRequest.data])
  const getExpenseDetails = useCallback(async (expense: ExpenseItem) => (await detailRequest.execute(expense.id)).data ?? [], [detailRequest.execute])
  const refetchExpenseDetails = useCallback(async (expense: ExpenseItem) => { clearGetCache(); return getExpenseDetails(expense) }, [getExpenseDetails])
  const createExpense = useCallback(async (payload: CreateExpensePayload) => { const response = await createRequest.execute(payload); await listRequest.execute(params); return response }, [createRequest.execute, listRequest.execute, params])
  const lookups = useMemo(() => normalizeLookups(lookupRequest.data), [lookupRequest.data])
  return { expenses, isLoading: listRequest.isLoading, isError: listRequest.isError, error: listRequest.error, refetch: () => listRequest.execute(params), getExpenseDetails, refetchExpenseDetails, detail: detailRequest.data?.data ?? [], isDetailLoading: detailRequest.isLoading, detailError: detailRequest.error, createExpense, isCreating: createRequest.isLoading, createError: createRequest.error, ...lookups, isLoadingLookups: lookupRequest.isLoading, lookupError: lookupRequest.error }
}

export default useExpense
