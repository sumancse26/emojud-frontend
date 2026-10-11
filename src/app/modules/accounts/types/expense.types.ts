export interface ExpenseListParams { shop_id: string | number }
export interface ExpenseLookup { id: string; lookup_code: string; lookup_value: string }

export interface ExpenseLookupResponse {
  success?: boolean
  response_code?: number
  data?: unknown
  expenses?: unknown
  payment_method?: unknown
}
export interface ExpenseListItem { id: string; expense_no: string; expense_date: string; remarks: string }
export interface ExpenseDetailItem { id: string; amount: string | number; remarks: string; expenseMst: { id: string; expense_no: string; expense_date: string }; expenseHead?: ExpenseLookup; paymentMethod?: ExpenseLookup }
export interface ExpenseApiResponse<T> { success: boolean; response_code: number; message?: string; data: T }
export interface CreateExpenseDetailPayload { id: number | null; expense_head_id: number; amount: number; payment_method_id: number; remarks: string }
export interface CreateExpensePayload { id: number | null; expense_no: string; shop_id: number; expense_date: string; total_amount: number; remarks: string; details: CreateExpenseDetailPayload[] }
export interface ExpenseItem { id: string; expenseNumber: string; expenseDate: string; remarks: string }
