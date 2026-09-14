import React, { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { InvoiceTable } from '../components/InvoiceTable'
import { useApp } from '@/app/providers/AppProvider'

export const InvoicesPage: React.FC = () => {
  const { openPOSDrawer } = useApp()
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <section className="space-y-6">
      {/* Invoices Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Sales Invoices</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Customer billing records, point-of-sale checkouts, and receivables
          </p>
        </div>
        <button
          onClick={openPOSDrawer}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-emerald-600/25 hover:shadow-emerald-500/30 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Invoice</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by invoice no, customer or phone…"
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-700/50 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 dark:focus:border-emerald-500 transition-all font-medium"
          />
        </div>
        <p className="text-sm text-slate-400 dark:text-slate-500 shrink-0">
          Showing 1–10 of 480 invoices
        </p>
      </div>

      {/* Invoice Table */}
      <InvoiceTable />
    </section>
  )
}
