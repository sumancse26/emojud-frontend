import React from 'react'
import { useApp } from '@/app/providers/AppProvider'

export const RecentInvoicesTable: React.FC = () => {
  const { setActiveView } = useApp()

  return (
    <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl overflow-hidden shadow-sm dark:shadow-none transition-colors">
      <div className="px-5 py-4 border-b border-slate-200/60 dark:border-slate-800/50 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Recent Sales Invoices</h3>
        <button
          onClick={() => setActiveView('view-invoices')}
          className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 font-medium cursor-pointer"
        >
          View All
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/40 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Invoice No</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30">
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20">
              <td className="px-4 py-3 font-mono text-amber-600 dark:text-amber-400 font-medium">INV-0842</td>
              <td className="px-4 py-3 text-slate-700 dark:text-slate-300 font-medium">Rahim Chowdhury</td>
              <td className="px-4 py-3 text-slate-800 dark:text-slate-200 font-semibold text-right font-mono">৳ 4,850</td>
              <td className="px-4 py-3 text-center">
                <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Paid
                </span>
              </td>
            </tr>
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20">
              <td className="px-4 py-3 font-mono text-amber-600 dark:text-amber-400 font-medium">INV-0841</td>
              <td className="px-4 py-3 text-slate-700 dark:text-slate-300 font-medium">Farhana Yasmin</td>
              <td className="px-4 py-3 text-slate-800 dark:text-slate-200 font-semibold text-right font-mono">৳ 12,400</td>
              <td className="px-4 py-3 text-center">
                <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  Partial
                </span>
              </td>
            </tr>
            <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/20">
              <td className="px-4 py-3 font-mono text-amber-600 dark:text-amber-400 font-medium">INV-0840</td>
              <td className="px-4 py-3 text-slate-700 dark:text-slate-300 font-medium">Tanvir Ahmed</td>
              <td className="px-4 py-3 text-slate-800 dark:text-slate-200 font-semibold text-right font-mono">৳ 3,200</td>
              <td className="px-4 py-3 text-center">
                <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Paid
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
