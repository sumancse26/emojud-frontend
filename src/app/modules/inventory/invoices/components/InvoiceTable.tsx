import React, { useMemo } from 'react'
import { Printer, Eye } from 'lucide-react'
import { Pagination, useTablePagination } from '@/shared'
import type { Invoice } from '../types/invoice.types'

export interface InvoiceTableProps {
  invoices: Invoice[]
  onViewInvoice?: (invoice: Invoice) => void
  onPrintInvoice?: (invoice: Invoice) => void
  searchTerm?: string
}

export const InvoiceTable: React.FC<InvoiceTableProps> = React.memo(({ 
  invoices,
  onViewInvoice,
  onPrintInvoice,
  searchTerm = '',
}) => {
  const filteredInvoices = useMemo(() => {
    if (!searchTerm) return invoices
    const term = searchTerm.toLowerCase()
    return invoices.filter((inv) =>
      inv.invoiceNumber.toLowerCase().includes(term) ||
      inv.customerName.toLowerCase().includes(term) ||
      inv.customerPhone.toLowerCase().includes(term)
    )
  }, [invoices, searchTerm])

  const { currentPage, pageSize, totalPages, paginatedItems: visibleInvoices, setCurrentPage, setPageSize } = useTablePagination(filteredInvoices)

  return (
    <div className="flex min-h-[calc(100vh-19rem)] flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800/50 dark:bg-[#0d1729]">
      <div className="flex-1 min-w-0 overflow-hidden">
        <table className="h-full w-full table-fixed text-left text-xs">
          <colgroup>
            <col style={{ width: '14%' }} />
            <col style={{ width: '16%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '13%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '11%' }} />
            <col style={{ width: '11%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '6%' }} />
          </colgroup>
          <thead className="bg-slate-50/80 dark:bg-slate-900/40 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80 text-[11px]">
            <tr>
              <th className="truncate px-3 py-3">Invoice Reference</th>
              <th className="truncate px-3 py-3">Customer Details</th>
              <th className="truncate px-3 py-3">Issue Date</th>
              <th className="truncate px-3 py-3">Payment Method</th>
              <th className="truncate px-3 py-3 text-right">Invoice Total</th>
              <th className="truncate px-3 py-3 text-right">Paid Amount</th>
              <th className="truncate px-3 py-3 text-right">Due Balance</th>
              <th className="truncate px-3 py-3 text-center">Status</th>
              <th className="truncate px-2 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
            {visibleInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                <td className="truncate px-3 py-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  <button
                    onClick={() => onViewInvoice?.(inv)}
                    className="hover:underline cursor-pointer font-bold text-left"
                  >
                    {inv.invoiceNumber}
                  </button>
                </td>
                <td className="truncate px-3 py-3.5 font-medium text-slate-900 dark:text-white">
                  <span className="block truncate">{inv.customerName}</span>
                  <span className="block text-[10px] text-slate-400 font-mono">{inv.customerPhone}</span>
                </td>
                <td className="truncate px-3 py-3.5 text-slate-500">{inv.issueDate}</td>
                <td className="truncate px-3 py-3.5">
                  <span className="inline-block max-w-full truncate rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {inv.paymentMethod}
                  </span>
                </td>
                <td className="truncate px-3 py-3.5 font-mono font-bold text-right text-slate-900 dark:text-white">
                  ৳ {inv.totalAmount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                </td>
                <td className="truncate px-3 py-3.5 font-mono text-right text-emerald-600 dark:text-emerald-400 font-medium">
                  ৳ {inv.paidAmount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                </td>
                <td
                  className={`truncate px-3 py-3.5 font-mono text-right ${
                    inv.dueAmount > 0 ? 'text-rose-500 font-bold' : 'text-slate-400'
                  }`}
                >
                  ৳ {inv.dueAmount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                </td>
                <td className="truncate px-2 py-3.5 text-center">
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
                <td className="px-2 py-3.5 text-center whitespace-nowrap">
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
          <tfoot className="border-t border-slate-200/80 bg-slate-50/95 dark:border-slate-800/80 dark:bg-slate-900/60">
            <tr>
              <td colSpan={9} className="p-0">
                <Pagination
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  totalItems={filteredInvoices.length}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  onPageSizeChange={setPageSize}
                  showPageSizeSelector
                  itemLabel="invoices"
                  pageFooter={false}
                  className="border-0 bg-transparent shadow-none"
                />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
})

