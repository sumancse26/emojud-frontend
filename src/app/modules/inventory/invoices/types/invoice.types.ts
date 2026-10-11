export type InvoiceStatus = 'Paid' | 'Partial' | 'Due'

export interface InvoiceItem {
  id: string
  name: string
  sku: string
  quantity: number
  unitPrice: number
  total: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  customerName: string
  customerPhone: string
  issueDate: string
  paymentMethod: string
  totalAmount: number
  paidAmount: number
  dueAmount: number
  status: InvoiceStatus
  items?: InvoiceItem[]
  shopId?: number
  customerId?: number
}

export interface InvoiceListParams {
  shop_id: string | number
}

export interface InvoiceListItem {
  id: string
  invoice_no: string
  invoice_date: string
  total_amount: string | number
  discount_amount: string | number
  vat_amount: string | number
  net_amount: string | number
  paid_amount: string | number
  due_amount: string | number
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
  id: number
  product_id: number
  qty: number
  rate: number
  vat_amt: number
  disc_amt: number
  total_amount: number
}

export interface CreateInvoicePayload {
  id: number
  shop_id: number
  customer_id: number
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
