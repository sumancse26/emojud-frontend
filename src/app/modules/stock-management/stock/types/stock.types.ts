export interface StockListParams { shop_id: string | number }
export interface StockDetailParams { shop_id: string | number; prod_id: string | number }

export interface StockCategory { id: string; parent_category_id: string | null; category_name: string }
export interface StockLookup { id: string; lookup_code: string; lookup_value: string }
export interface StockProductEntry { id: string; stock_date: string; current_stock: string | number }
export interface StockListItem { id: string; product_code: string; product_name: string; category?: StockCategory; prod_stock?: StockProductEntry[]; brand?: StockLookup; units?: StockLookup }
export interface StockDetailItem { id: string; lot_no: string; qty: string | number; pr_no: string; supplier_name: string }
export interface StockApiResponse<T> { success: boolean; response_code: number; message?: string; data: T }
export interface StockItem { id: string; productCode: string; productName: string; category: string; brand: string; unit: string; currentStock: number; stockDate?: string }
