import React from 'react'
import { StatsGrid } from '../components/StatsGrid'
import { RevenueChart } from '../components/RevenueChart'
import { PaymentMethodBreakdown } from '../components/PaymentMethodBreakdown'
import { TopProducts } from '../components/TopProducts'
import { RecentInvoicesTable } from '../components/RecentInvoicesTable'
import { RecentPurchasesTable } from '../components/RecentPurchasesTable'
import { LowStockAlert } from '../components/LowStockAlert'

export const DashboardPage: React.FC = () => {
  return (
    <section className="space-y-5">
      {/* 1. Stats and ribbon */}
      <StatsGrid />

      {/* 2. Charts and Top Selling */}
      <div className="grid gap-5 xl:grid-cols-[1fr_260px_240px]">
        <RevenueChart />
        <PaymentMethodBreakdown />
        <TopProducts />
      </div>

      {/* 3. Recent Invoices, POs & Alerts */}
      <div className="grid gap-5 lg:grid-cols-3">
        <RecentInvoicesTable />
        <RecentPurchasesTable />
        <LowStockAlert />
      </div>
    </section>
  )
}
