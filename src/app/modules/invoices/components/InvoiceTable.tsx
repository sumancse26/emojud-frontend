import React, { useState } from 'react'
import { Printer, Eye } from 'lucide-react'
import { Pagination } from '@/shared'
import type { Invoice } from '../types/invoice.types'

export const MOCK_INVOICES: Invoice[] = [
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
    items: [
      { id: '1', name: 'Premium Cotton Polo Shirt (XL)', sku: 'POLO-CTN-XL-01', quantity: 2, unitPrice: 850.0, total: 1700.0 },
      { id: '2', name: 'Slim Fit Denim Jeans 32', sku: 'JNS-SLM-32', quantity: 2, unitPrice: 1500.0, total: 3000.0 },
      { id: '3', name: 'Packaging & Bag', sku: 'PKG-BAG-01', quantity: 1, unitPrice: 150.0, total: 150.0 },
    ],
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
    items: [
      { id: '1', name: 'Designer Silk Saree - Ruby Red', sku: 'SAR-SLK-RD', quantity: 1, unitPrice: 9500.0, total: 9500.0 },
      { id: '2', name: 'Matching Blouse Piece', sku: 'BLS-PC-01', quantity: 1, unitPrice: 2900.0, total: 2900.0 },
    ],
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
    items: [
      { id: '1', name: 'Casual Oxford Button-down Shirt', sku: 'SHT-OXF-BL', quantity: 2, unitPrice: 1600.0, total: 3200.0 },
    ],
  },
]

export interface InvoiceTableProps {
  onViewInvoice?: (invoice: Invoice) => void
  onPrintInvoice?: (invoice: Invoice) => void
  searchTerm?: string
}

export const InvoiceTable: React.FC<InvoiceTableProps> = ({
  onViewInvoice,
  onPrintInvoice,
  searchTerm = '',
}) => {
  const [currentPage, setCurrentPage] = useState(1)

  const filteredInvoices = MOCK_INVOICES.filter((inv) => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      inv.invoiceNumber.toLowerCase().includes(term) ||
      inv.customerName.toLowerCase().includes(term) ||
      inv.customerPhone.includes(term)
    )
  })

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
            {filteredInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-5 py-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  <button
                    onClick={() => onViewInvoice?.(inv)}
                    className="hover:underline cursor-pointer font-bold text-left"
                  >
                    {inv.invoiceNumber}
                  </button>
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
                    onClick={() => onPrintInvoice?.(inv)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-emerald-500 cursor-pointer transition-colors"
                    title="Print Receipt"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onViewInvoice?.(inv)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-500 cursor-pointer transition-colors"
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
      <Pagination
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        totalItems={filteredInvoices.length}
        totalPages={48}
        itemLabel="invoices"
      />
    </div>
  )
}

