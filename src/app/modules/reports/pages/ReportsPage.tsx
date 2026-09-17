import React from 'react'
import { Printer } from 'lucide-react'

export const ReportsPage: React.FC = () => {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Financial Reports & P&L Statement</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Comprehensive Gross Margin, Operating Expenses, Net Profit, and Daily Register Audit
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Statement</span>
        </button>
      </div>

      {/* Profit & Loss Summary Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 shadow-sm max-w-2xl space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
          Monthly Profit & Loss Statement (September 2026)
        </h3>

        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
            <span className="text-slate-500 font-medium">Gross Sales Revenue:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">৳ 1,482,950.00</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
            <span className="text-slate-500 font-medium">Cost of Goods Sold (COGS):</span>
            <span className="font-mono font-bold text-rose-500">- ৳ 920,400.00</span>
          </div>
          <div className="flex justify-between py-1.5 font-bold text-sm bg-slate-50 dark:bg-slate-900/60 px-3 rounded-lg">
            <span className="text-slate-800 dark:text-slate-200">Gross Margin:</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400">৳ 562,550.00 (37.9%)</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800/40">
            <span className="text-slate-500 font-medium">Operating Expenses (Shop Rent, Utilities, Payroll):</span>
            <span className="font-mono font-bold text-rose-500">- ৳ 173,900.00</span>
          </div>
          <div className="flex justify-between py-2 font-black text-base bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 rounded-xl">
            <span>Net Operating Profit:</span>
            <span className="font-mono">৳ 388,650.00 (26.2%)</span>
          </div>
        </div>
      </div>
    </section>
  )
}
