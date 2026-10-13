export type InvoiceStatus = 'Paid' | 'Partial' | 'Due'

export interface InvoiceItem {
  id: string
  detailId?: number
  productId?: string
  name: string
  sku: string
  quantity: number
  unitPrice: number
  vatAmt?: number
  discAmt?: number
  total: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  customerName: string
  customerPhone: string
  issueDate: string
  rawDate?: string
  paymentMethod: string
  paymentMethodId?: number
  totalAmount: number
  discountAmount?: number
  vatAmount?: number
  netAmount?: number
  paidAmount: number
  dueAmount: number
  status: InvoiceStatus
  isSubmit?: number
  items?: InvoiceItem[]
  shopId?: number
  customerId?: number
}

export interface InvoiceListParams {
  shop_id: string | number
  from_date?: string
  to_date?: string
}

export interface InvoiceListItem {
  id: string
  invoice_no: string
  invoice_date: string
  total_amount: string | number
  discount_amount?: string | number
  vat_amount?: string | number
  net_amount?: string | number
  paid_amount: string | number
  due_amount: string | number
  is_submit?: string | number
  customer?: {
    id: string
    customer_code?: string
    customer_name?: string
  }
  shop?: {
    id: string
    display_code?: string
    shop_name?: string
  }
  tranStatus?: {
    id: string
    lookup_code?: string
  }
}

export interface InvoiceDetailItem {
  id: string
  product_id?: string | number
  qty: string | number
  rate: string | number
  vat_amt: string | number
  disc_amt: string | number
  total_amount: string | number
  product?: {
    id: string
    product_code?: string
    product_name?: string
    purchase_rate?: string | number
    retail_rate?: string | number
    sales_rate?: string | number
  }
}

export interface InvoiceDetail extends InvoiceListItem {
  invoiceDtls?: InvoiceDetailItem[]
}

export interface InvoiceApiResponse<T> {
  success: boolean
  response_code: number
  data: T
}

export interface InvoiceDetailParams {
  inv_id: string | number
  shop_id: string | number
}

export interface CreateInvoiceProductPayload {
  id: number | null
  product_id: number
  qty: number
  rate: number
  vat_amt: number
  disc_amt: number
  total_amount: number
}

export interface CreateInvoicePayload {
  id: number | null
  shop_id: number
  customer_id: number
  payment_method_id?: number
  invoice_date: string
  total_amount: number
  discount_amount: number
  vat_amount: number
  net_amount: number
  paid_amount: number
  due_amount: number
  is_submit: number
  user_id: number
  products: CreateInvoiceProductPayload[]
}

export type InvoiceMutationResponse =
  | InvoiceApiResponse<InvoiceDetail>
  | InvoiceApiResponse<Record<string, unknown>>
  | InvoiceDetail
  | Record<string, unknown>

// ─── Payment Method Lookup ──────────────────────────────────────────────────

export interface PaymentMethodItem {
  id: string
  lookup_code: string
  lookup_value: string
}

export interface PaymentMethodLookupResponse {
  success: boolean
  response_code: number
  data: {
    payment_method: PaymentMethodItem[]
  }
}

// ─── Shop-wise Products ─────────────────────────────────────────────────────

export interface ShopWiseProductItem {
  id: string
  product_code: string
  product_name: string
  purchase_rate: string | number
  retail_rate: string | number
  sales_rate: string | number
  avail_stock: string | number
}

export interface ShopWiseProductResponse {
  success: boolean
  response_code: number
  message?: string
  data: ShopWiseProductItem[]
}

