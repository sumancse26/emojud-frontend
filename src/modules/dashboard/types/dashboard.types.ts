export interface DashboardStats {
  totalSales: number
  totalPurchase: number
  totalExpense: number
  netProfit: number
  stockValue: number
  dueCollection: number
  activeEmployees: number
  salesGrowth: number
  purchaseGrowth: number
  expenseGrowth: number
}

export interface TopSellingItem {
  id: string
  name: string
  unitsSold: number
  revenue: number
  rank: number
}

export interface PaymentBreakdown {
  cashPercentage: number
  mfsPercentage: number
  cardPercentage: number
  bankPercentage: number
  totalCollected: number
}
