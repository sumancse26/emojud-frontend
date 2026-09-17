import React from 'react'

export const PaymentMethodBreakdown: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl p-5 shadow-sm dark:shadow-none flex flex-col justify-between">
      <div>
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-1">Payment Channels</h3>
        <p className="text-xs text-slate-400 mb-4">Counter settlement mix</p>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700 dark:text-slate-300">Cash On Counter</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">54%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '54%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700 dark:text-slate-300">bKash & Nagad MFS</span>
              <span className="font-mono text-pink-500">28%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-pink-500 h-full rounded-full" style={{ width: '28%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700 dark:text-slate-300">POS Card Terminal</span>
              <span className="font-mono text-blue-500">12%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: '12%' }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700 dark:text-slate-300">Bank Wire / Cheque</span>
              <span className="font-mono text-violet-500">6%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-violet-500 h-full rounded-full" style={{ width: '6%' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Total Collected</span>
        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">৳ 1,482,950</span>
      </div>
    </div>
  )
}
