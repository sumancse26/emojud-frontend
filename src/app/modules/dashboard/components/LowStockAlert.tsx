import React from 'react'
import { Plus } from 'lucide-react'
import { useApp } from '@/app/providers/AppProvider'

export const LowStockAlert: React.FC = () => {
  const { setActiveView } = useApp()

  return (
    <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl p-5 shadow-sm dark:shadow-none flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Critical Stock Alert</h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
            Action Required
          </span>
        </div>

        <div className="space-y-3 pt-1">
          <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-slate-800 dark:text-slate-200">Formal Silk Tie - Navy Blue</span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400">2 units left</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: '10%' }} />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>SKU: TIE-SLK-02</span>
              <span>Threshold: 20 units</span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => setActiveView('view-purchases')}
        className="mt-4 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Create Restock Purchase Order</span>
      </button>
    </div>
  )
}
