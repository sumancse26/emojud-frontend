export interface PurchaseListParams {
  shop_id: string | number
}

export interface PurchaseDetailParams {
  id: string | number
  shop_id: string | number
}

export interface PurchaseSupplier {
  id: string
  supplier_code: string
  supplier_name: string
}

export interface PurchaseStatus {
  id: string
  lookup_code: string
  lookup_value?: string
}

export interface PurchaseListItem {
  id: string
  purchase_no: string
  purchase_date: string
  is_submit: string
  is_confirm: string
  supplier?: PurchaseSupplier
  pur_tran_status?: PurchaseStatus
}

export interface PurchaseDetailMaster {
  id: string
  purchase_no: string
  purchase_date: string
  shop_id: string
  warehouse_id: string
  supplier_id: string
  supplier_name: string
  total_amount: string | number
  discount_amount: string | number
  vat_amount: string | number
  net_amount: string | number
  paid_amount: string | number
  due_amount: string | number
  tran_status: string
  status: number
  is_submit: string
  is_confirm: string
}

export interface PurchaseDetailItem {
  id: string
  product_id: string
  product_name: string
  product_code: string
  qty: string | number
  purchase_rate: string | number
  retail_rate: string | number
  sales_rate: string | number
  total_amount: string | number
}

export interface PurchaseDetailResponse {
  success: boolean
  response_code: number
  master: PurchaseDetailMaster
  details: PurchaseDetailItem[]
}

export interface PurchaseApiResponse<T> {
  success: boolean
  response_code: number
  data?: T
  master?: PurchaseDetailMaster
  details?: PurchaseDetailItem[]
}

export interface PurchaseProductPayload {
  id: number | null
  product_id: number
  qty: number
  purchase_rate: number
  retail_rate: number
  sales_rate: number
  total_amount: number
  unit_id?: number | null
}

export interface CreatePurchasePayload {
  id: number | null
  shop_id: number
  warehouse_id: number
  supplier_id: number
  purchase_date: string
  challan_no: string
  challan_date: string
  total_amount: number
  discount_amount: number
  vat_amount: number
  net_amount: number
  paid_amount: number
  due_amount: number
  is_submit: number
  is_confirm: number
  user_id: number
  products: PurchaseProductPayload[]
}

export interface PurchaseWarehouseItem {
  id: string | number
  warehouse_name: string
  display_code?: string | null
  short_code?: string | null
  address?: string | null
  shop_id?: string | number
}

export interface PurchaseSupplierItem {
  id: string | number
  supplier_code?: string
  supplier_name: string
  phone?: string | null
  email?: string | null
  address?: string | null
  previous_due?: string | number
}

export interface PurchaseProductItem {
  id: string | number
  product_code: string
  product_name: string
  purchase_rate: string | number
  retail_rate: string | number
  sales_rate: string | number
  avail_stock?: string | number
  units?: { id: string | number; lookup_code?: string; lookup_value?: string } | null
}

export interface PurchaseLookupItem {
  id: string | number
  lookup_code: string
  lookup_value: string
}

export interface PurchaseLookupResponse {
  success?: boolean
  response_code?: number
  data?: Record<string, PurchaseLookupItem[]> | PurchaseLookupItem[] | unknown
}

export interface PurchaseItem {
  id: string
  purchaseNumber: string
  supplierName: string
  supplierCode: string
  purchaseDate: string
  status: string
  shopId: number
  totalAmount: number
  discountAmount: number
  vatAmount: number
  netAmount: number
  paidAmount: number
  dueAmount: number
  warehouseId?: number
  supplierId?: number
  products?: PurchaseDetailItem[]
}
