import React, { useState } from 'react'
import { Printer, Eye } from 'lucide-react'
import { useApp } from '@/app/providers/AppProvider'
import type { Invoice } from '../types/invoice.types'

const MOCK_INVOICES: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2026-0842',
    customerName: 'Rahim Chowdhury',
    customerPhone: '+880 1712-345678',
    issueDate: '14 Sep 2026',
    paymentMethod: 'bKash Merchant',
    totalAmount: 4850.0,
    paidAmount: 4850.0,
    dueAmount: 0.0,
    status: 'Paid',
  },
  {
    id: '2',
    invoiceNumber: 'INV-2026-0841',
    customerName: 'Farhana Yasmin',
    customerPhone: '+880 1911-889900',
    issueDate: '14 Sep 2026',
    paymentMethod: 'Cash + Due',
    totalAmount: 12400.0,
    paidAmount: 8000.0,
    dueAmount: 4400.0,
    status: 'Partial',
  },
  {
    id: '3',
    invoiceNumber: 'INV-2026-0840',
    customerName: 'Tanvir Ahmed',
    customerPhone: '+880 1819-223344',
    issueDate: '13 Sep 2026',
    paymentMethod: 'POS Card Terminal',
    totalAmount: 3200.0,
    paidAmount: 3200.0,
    dueAmount: 0.0,
    status: 'Paid',
  },
]

export const InvoiceTable: React.FC = () => {
  const { openPOSDrawer } = useApp()
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 dark:bg-slate-900/40 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80 text-[11px]">
            <tr>
              <th className="px-5 py-3">Invoice Reference</th>
              <th className="px-5 py-3">Customer Details</th>
              <th className="px-5 py-3">Issue Date</th>
              <th className="px-5 py-3">Payment Method</th>
              <th className="px-5 py-3 text-right">Invoice Total</th>
              <th className="px-5 py-3 text-right">Paid Amount</th>
              <th className="px-5 py-3 text-right">Due Balance</th>
              <th className="px-5 py-3 text-center">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
            {MOCK_INVOICES.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-5 py-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {inv.invoiceNumber}
                </td>
                <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-white">
                  {inv.customerName}
                  <span className="block text-[10px] text-slate-400 font-mono">{inv.customerPhone}</span>
                </td>
                <td className="px-5 py-3.5 text-slate-500">{inv.issueDate}</td>
                <td className="px-5 py-3.5">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-medium text-slate-600 dark:text-slate-300">
                    {inv.paymentMethod}
                  </span>
                </td>
                <td className="px-5 py-3.5 font-mono font-bold text-right text-slate-900 dark:text-white">
                  ৳ {inv.totalAmount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-5 py-3.5 font-mono text-right text-emerald-600 dark:text-emerald-400 font-medium">
                  ৳ {inv.paidAmount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                </td>
                <td
                  className={`px-5 py-3.5 font-mono text-right ${
                    inv.dueAmount > 0 ? 'text-rose-500 font-bold' : 'text-slate-400'
                  }`}
                >
                  ৳ {inv.dueAmount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-5 py-3.5 text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      inv.status === 'Paid'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right space-x-1">
                  <button
                    onClick={openPOSDrawer}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-emerald-500 cursor-pointer"
                    title="Print Receipt"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={openPOSDrawer}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-500 cursor-pointer"
                    title="View Details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
        <span>Showing Page {currentPage} of 48 Pages</span>
        <div className="flex items-center gap-1">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(1)}
            className={`px-3 py-1 rounded-lg font-bold cursor-pointer ${
              currentPage === 1
                ? 'bg-emerald-600 text-white'
                : 'border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            1
          </button>
          <button
            onClick={() => setCurrentPage(2)}
            className={`px-3 py-1 rounded-lg font-bold cursor-pointer ${
              currentPage === 2
                ? 'bg-emerald-600 text-white'
                : 'border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            2
          </button>
          <button
            onClick={() => setCurrentPage(3)}
            className={`px-3 py-1 rounded-lg font-bold cursor-pointer ${
              currentPage === 3
                ? 'bg-emerald-600 text-white'
                : 'border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            3
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(48, p + 1))}
            className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
