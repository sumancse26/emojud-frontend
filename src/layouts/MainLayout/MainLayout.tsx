import React from 'react'
import { TopPreviewToolbar } from './TopPreviewToolbar'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { POSSliderDrawer } from '@/modules/invoices'
import { AddProductModal } from '@/modules/products'
import { useApp } from '@/app/providers/AppProvider'

export interface MainLayoutProps {
  children: React.ReactNode
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { activeView } = useApp()
  const isLoginPage = activeView === 'view-login'

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#060d17] text-slate-800 dark:text-slate-100 font-sans antialiased transition-colors duration-200 selection:bg-emerald-500 selection:text-white">
      {/* Top preview bar toolbar */}
      <TopPreviewToolbar />

      {isLoginPage ? (
        <div className="w-full">{children}</div>
      ) : (
        <div id="main-app-shell" className="flex min-h-[calc(100vh-45px)] w-full">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">{children}</main>
          </div>
          <POSSliderDrawer />
          <AddProductModal />
        </div>
      )}
    </div>
  )
}
