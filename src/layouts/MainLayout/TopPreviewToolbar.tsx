import React from 'react'
import {
  Lock,
  LayoutDashboard,
  Receipt,
  Package,
  Truck,
  Users,
  BarChart3,
  Sun,
  Moon,
} from 'lucide-react'
import { useApp, type AppModuleView } from '@/app/providers/AppProvider'

export const TopPreviewToolbar: React.FC = () => {
  const { activeView, setActiveView, isDarkMode, toggleTheme } = useApp()

  const navItems: { view: AppModuleView; label: string; icon: React.ReactNode }[] = [
    { view: 'view-login', label: 'Login Portal', icon: <Lock className="w-3.5 h-3.5 inline mr-1" /> },
    { view: 'view-dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-3.5 h-3.5 inline mr-1" /> },
    { view: 'view-invoices', label: 'Sales & Invoices', icon: <Receipt className="w-3.5 h-3.5 inline mr-1" /> },
    { view: 'view-products', label: 'Products & Stock', icon: <Package className="w-3.5 h-3.5 inline mr-1" /> },
    { view: 'view-purchases', label: 'Purchases & PO', icon: <Truck className="w-3.5 h-3.5 inline mr-1" /> },
    { view: 'view-customers', label: 'Customers & Dues', icon: <Users className="w-3.5 h-3.5 inline mr-1" /> },
    { view: 'view-reports', label: 'Financial Reports', icon: <BarChart3 className="w-3.5 h-3.5 inline mr-1" /> },
  ]

  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800 shadow-md">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-extrabold text-[11px] shadow-sm font-mono">
          ej
        </div>
        <span className="font-bold tracking-tight text-slate-200">Emojud ERP</span>
        <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
          Enterprise v2.4
        </span>
      </div>

      {/* Screen Navigation Switcher Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
        <span className="text-slate-400 mr-1 hidden md:inline">Module Preview:</span>
        {navItems.map((item) => {
          const isActive = activeView === item.view
          return (
            <button
              key={item.view}
              onClick={() => setActiveView(item.view)}
              className={`px-2.5 py-1 rounded-lg transition-all font-medium cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          )
        })}
      </div>

      {/* Quick Theme Toggle in top utility bar */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
          title="Toggle Dark/Light Mode"
        >
          {isDarkMode ? (
            <Sun className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <Moon className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </header>
  )
}
