import React from 'react'

export const TopProducts: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl p-5 shadow-sm dark:shadow-none">
      <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm mb-1">Top Selling Items</h3>
      <p className="text-xs text-slate-400 mb-4">Highest volume products</p>

      <div className="space-y-3.5 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] flex items-center justify-center">
              1
            </span>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">Cotton Polo (XL)</p>
              <p className="text-[10px] text-slate-400">142 units sold</p>
            </div>
          </div>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">৳ 120.7k</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[10px] flex items-center justify-center">
              2
            </span>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">Denim Jeans 32</p>
              <p className="text-[10px] text-slate-400">89 units sold</p>
            </div>
          </div>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">৳ 133.5k</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold text-[10px] flex items-center justify-center">
              3
            </span>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-200">Silk Tie Navy</p>
              <p className="text-[10px] text-slate-400">64 units sold</p>
            </div>
          </div>
          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">৳ 28.8k</span>
        </div>
      </div>
    </div>
  )
}
