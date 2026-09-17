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
}
