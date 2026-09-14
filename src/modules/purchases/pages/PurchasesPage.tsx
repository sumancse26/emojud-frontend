import React from 'react'
import { Plus } from 'lucide-react'

export const PurchasesPage: React.FC = () => {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Purchases & Vendor Payables</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Track purchase orders, restock inventory shipments, vendor ledger balances, and payment settlements</p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Create Purchase Order</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Purchase Cost (Sep)</span>
          <p className="text-xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">৳ 894,300.00</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Paid to Vendors</span>
          <p className="text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 mt-1">৳ 720,000.00</p>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-slate-400">Vendor Outstanding Payables</span>
          <p className="text-xl font-extrabold font-mono text-rose-500 mt-1">৳ 174,300.00</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 font-bold text-sm text-slate-900 dark:text-white">Recent Vendor Restock Shipments</div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-900/40 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-5 py-3">PO Reference</th>
                <th className="px-5 py-3">Vendor / Supplier Name</th>
                <th className="px-5 py-3">Order Date</th>
                <th className="px-5 py-3 text-right">Grand Total Cost</th>
                <th className="px-5 py-3 text-right">Outstanding Balance</th>
                <th className="px-5 py-3 text-center">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                <td className="px-5 py-3 font-mono font-bold text-blue-600 dark:text-blue-400">PO-2026-0312</td>
                <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-200">Apex Garments Sourcing Ltd.</td>
                <td className="px-5 py-3 text-slate-500">12 Sep 2026</td>
                <td className="px-5 py-3 font-mono text-right font-bold text-slate-900 dark:text-white">৳ 240,000.00</td>
                <td className="px-5 py-3 font-mono text-right text-rose-500 font-bold">৳ 40,000.00</td>
                <td className="px-5 py-3 text-center">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500">Partial Due</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
