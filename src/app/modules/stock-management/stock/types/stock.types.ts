export interface StockListParams {
  shop_id: string | number
}

export interface StockDetailParams {
  shop_id: string | number
  prod_id: string | number
}

export interface StockCategory {
  id: string | number
  parent_category_id: string | number | null
  category_name: string
}

export interface StockLookup {
  id: string | number
  lookup_code: string
  lookup_value: string
}

export interface StockProductEntry {
  id: string | number
  stock_date: string
  current_stock: string | number
}

export interface StockListItem {
  id: string | number
  product_code: string
  product_name: string
  category?: StockCategory | null
  prod_stock?: StockProductEntry | StockProductEntry[] | null
  available_stock?: string | number | null
  brand?: StockLookup | null
  units?: StockLookup | null
}

export interface StockDetailItem {
  id: string | number
  lot_no: string
  qty: string | number
  pr_no: string
  supplier_name: string
}

export interface StockApiResponse<T> {
  success: boolean
  response_code: number
  message?: string
  data: T
}

export interface StockItem {
  id: string
  productCode: string
  productName: string
  category: string
  brand: string
  unit: string
  currentStock: number
  availableStock?: number
  stockDate?: string
}
