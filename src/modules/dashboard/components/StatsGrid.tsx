import React from 'react'
import {
  PackagePlus,
  PackageMinus,
  HandCoins,
  Landmark,
  ReceiptText,
  Percent,
  Calendar,
  ShoppingBag,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  Package,
  Coins,
  Users,
} from 'lucide-react'
import { useApp } from '@/app/providers/AppProvider'

export const StatsGrid: React.FC = () => {
  const { setActiveView } = useApp()

  return (
    <div className="space-y-5">
      {/* Top Row: Quick Action Links Ribbon & Current Month Range */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Quick Action Links */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveView('view-purchases')}
            className="flex items-center gap-2 px-3 py-1 rounded-xl border transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 text-xs font-medium cursor-pointer"
          >
            <PackagePlus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Stock In</span>
          </button>

          <button
            onClick={() => setActiveView('view-invoices')}
            className="flex items-center gap-2 px-3 py-1 rounded-xl border transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5 bg-red-50 text-red-700 border-red-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 text-xs font-medium cursor-pointer"
          >
            <PackageMinus className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>Stock Out</span>
          </button>

          <button
            onClick={() => setActiveView('view-customers')}
            className="flex items-center gap-2 px-3 py-1 rounded-xl border transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5 bg-blue-50 text-blue-700 border-blue-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 text-xs font-medium cursor-pointer"
          >
            <HandCoins className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Due Collection</span>
          </button>

          <button
            onClick={() => setActiveView('view-purchases')}
            className="flex items-center gap-2 px-3 py-1 rounded-xl border transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5 bg-violet-50 text-violet-700 border-violet-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 text-xs font-medium cursor-pointer"
          >
            <Landmark className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span>Supplier Payment</span>
          </button>

          <button
            onClick={() => setActiveView('view-reports')}
            className="flex items-center gap-2 px-3 py-1 rounded-xl border transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5 bg-amber-50 text-amber-700 border-amber-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 text-xs font-medium cursor-pointer"
          >
            <ReceiptText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Daily Expense</span>
          </button>

          <button
            onClick={() => setActiveView('view-reports')}
            className="flex items-center gap-2 px-3 py-1 rounded-xl border transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5 bg-blue-50 text-blue-700 border-blue-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 text-xs font-medium cursor-pointer"
          >
            <Percent className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Commission Profit</span>
          </button>
        </div>

        {/* Date Range Pill */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-700/50 rounded-lg px-3 py-1.5 shadow-sm self-start lg:self-auto">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-medium">Sep 1, 2026 – Sep 30, 2026</span>
        </div>
      </div>

      {/* 7 Dashboard Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* 1. Total Sales */}
        <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl p-4 shadow-sm dark:shadow-none transition-colors">
          <div className="flex items-start justify-between mb-2">
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-tight pr-1">
              Total Sales
            </p>
            <span className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
              <ShoppingBag className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight font-mono">৳ 1,482,950</p>
          <div className="flex items-center gap-1 mt-1.5">
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">↑ 12.4%</span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">vs last month</span>
          </div>
        </div>

        {/* 2. Total Purchase */}
        <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl p-4 shadow-sm dark:shadow-none transition-colors">
          <div className="flex items-start justify-between mb-2">
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-tight pr-1">
              Total Purchase
            </p>
            <span className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
              <ShoppingCart className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight font-mono">৳ 894,300</p>
          <div className="flex items-center gap-1 mt-1.5">
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">↑ 8.1%</span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">vs last month</span>
          </div>
        </div>

        {/* 3. Total Expense */}
        <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl p-4 shadow-sm dark:shadow-none transition-colors">
          <div className="flex items-start justify-between mb-2">
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-tight pr-1">
              Total Expense
            </p>
            <span className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400">
              <CreditCard className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight font-mono">৳ 173,900</p>
          <div className="flex items-center gap-1 mt-1.5">
            <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">↓ 3.2%</span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">vs last month</span>
          </div>
        </div>

        {/* 4. Net Profit */}
        <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl p-4 shadow-sm dark:shadow-none transition-colors">
          <div className="flex items-start justify-between mb-2">
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-tight pr-1">
              Net Profit
            </p>
            <span className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight font-mono">৳ 388,650</p>
          <div className="flex items-center gap-1 mt-1.5">
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Positive</span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">profit trend</span>
          </div>
        </div>

        {/* 5. Stock Value */}
        <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl p-4 shadow-sm dark:shadow-none transition-colors">
          <div className="flex items-start justify-between mb-2">
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-tight pr-1">
              Stock Value
            </p>
            <span className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight font-mono">৳ 3,850,000</p>
          <div className="flex items-center gap-1 mt-1.5">
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">↑ 6.3%</span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">month change</span>
          </div>
        </div>

        {/* 6. Due Collection */}
        <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl p-4 shadow-sm dark:shadow-none transition-colors">
          <div className="flex items-start justify-between mb-2">
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-tight pr-1">
              Due Collection
            </p>
            <span className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-cyan-100 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400">
              <Coins className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight font-mono">৳ 142,500</p>
          <div className="flex items-center gap-1 mt-1.5">
            <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">↓ 2.4%</span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">month change</span>
          </div>
        </div>

        {/* 7. Active Employees */}
        <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl p-4 shadow-sm dark:shadow-none transition-colors">
          <div className="flex items-start justify-between mb-2">
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-tight pr-1">
              Active Employees
            </p>
            <span className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight font-mono">24</p>
          <div className="flex items-center gap-1 mt-1.5">
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">● 100% Present</span>
          </div>
        </div>
      </div>
    </div>
  )
}
