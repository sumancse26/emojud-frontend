export interface CommissionProfitListParams { shop_id: string | number }
export interface CommissionProfitApiResponse<T> { success?: boolean; response_code?: number; message?: string; data?: T }
export interface CommissionProfitItem { id: string; year_id: string | number; invoice_id: string | number | null; product_id: string | number | null; qty: string | number; purchase_rate: string | number; sales_rate: string | number; profit_amount: string | number; commission_percent: string | number; commission_amount: string | number; is_received_commission: number; received_date: string | null }
export interface CreateCommissionProfitPayload { id: null; shop_id: number; year_id: number; month_id: number; commission_amount: number; is_received_commission: number; received_date: string }
