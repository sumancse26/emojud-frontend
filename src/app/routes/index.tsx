import React from 'react'
import { useApp } from '@/app/providers/AppProvider'
import { LoginPage } from '@/modules/auth'
import { DashboardPage } from '@/modules/dashboard'
import { InvoicesPage } from '@/modules/invoices'
import { ProductsPage } from '@/modules/products'
import { PurchasesPage } from '@/modules/purchases'
import { CustomersPage } from '@/modules/customers'
import { ReportsPage } from '@/modules/reports'

export const AppRouter: React.FC = () => {
  const { activeView } = useApp()

  switch (activeView) {
    case 'view-login':
      return <LoginPage />
    case 'view-dashboard':
      return <DashboardPage />
    case 'view-invoices':
      return <InvoicesPage />
    case 'view-products':
      return <ProductsPage />
    case 'view-purchases':
      return <PurchasesPage />
    case 'view-customers':
      return <CustomersPage />
    case 'view-reports':
      return <ReportsPage />
    default:
      return <DashboardPage />
  }
}
