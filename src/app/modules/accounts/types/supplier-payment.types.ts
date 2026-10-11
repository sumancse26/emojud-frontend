export interface SupplierPaymentListParams { shop_id: string | number }

export interface SupplierPaymentApiResponse<T> {
  success?: boolean
  response_code?: number
  message?: string
  data?: T
  summary?: SupplierPaymentDueSummary
}

export interface SupplierPaymentSupplier {
  id: string
  supplier_code: string
  supplier_name: string
  phone?: string
  email?: string
  address?: string
}

export interface SupplierPaymentListItem {
  id: string
  payment_no: string
  payment_date: string
  total_due: string | number
  paid_amount: string | number
  current_due: string | number
  remarks?: string
  supplierPayment?: SupplierPaymentSupplier
}

export interface SupplierPaymentDueItem {
  id: string
  purchase_no: string
  purchase_date: string
  due_amount: string | number
  supplier: SupplierPaymentSupplier
}

export interface SupplierPaymentPendingItem extends SupplierPaymentSupplier {
  previous_due: string | number
}

export interface SupplierPaymentDueSummary {
  no_of_purchase: number
  total_due: string | number
  total_purchase: string | number
}

export interface CreateSupplierPaymentPayload {
  id: null
  shop_id: number
  supplier_id: number
  payment_date: string
  ref_purchase_id: string | number
  payment_method_id: number
  total_due: number
  paid_amount: number
  current_due: number
  remarks: string
  user_id: number
}
