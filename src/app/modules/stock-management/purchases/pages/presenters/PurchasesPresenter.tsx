import React, { useMemo, useState } from 'react'
import { AlertCircle, Eye, Plus, Printer, RefreshCw, Search } from 'lucide-react'
import { PageHeader, Pagination, Skeleton, useTablePagination } from '@/shared'
import type { PurchaseItem } from '../../types/purchase.types'

export interface PurchasesPresenterProps {
  purchases: PurchaseItem[]
  isLoading: boolean
  isError: boolean
  error: string | null
  createError: string | null
  onOpenCreate: () => void
  onRefetch: () => void
  onViewPurchase: (purchase: PurchaseItem) => void
  onPrintPurchase: (purchase: PurchaseItem) => void
}

export const PurchasesPresenter: React.FC<PurchasesPresenterProps> = React.memo(({
  purchases,
  isLoading,
  isError,
  error,
  createError,
  onOpenCreate,
  onRefetch,
  onViewPurchase,
  onPrintPurchase,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const filteredPurchases = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return purchases
    return purchases.filter((purchase) =>
      purchase.purchaseNumber.toLowerCase().includes(query) ||
      purchase.supplierName.toLowerCase().includes(query) ||
      purchase.supplierCode.toLowerCase().includes(query),
    )
  }, [purchases, searchQuery])
  const { currentPage, pageSize, totalPages, paginatedItems, setCurrentPage, setPageSize } = useTablePagination(filteredPurchases)

  return (
    <section className="space-y-6">
      <PageHeader>
        <PageHeader.Header
          title="Purchases & Vendor Restock Orders"
          description="Track purchase orders, restock inventory shipments, vendor ledgers, and payment settlements."
          actions={
            <div className="flex items-center gap-2">
              <button type="button" onClick={onRefetch} disabled={isLoading} title="Refresh purchases" className="rounded-xl bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300">
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button type="button" onClick={onOpenCreate} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-500">
                <Plus className="h-4 w-4" />
                <span>New Purchase</span>
              </button>
            </div>
          }
        />
        <PageHeader.Bottom>
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={searchQuery} onChange={(event) => { setSearchQuery(event.target.value); setCurrentPage(1) }} placeholder="Search by purchase no or supplier..." className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-slate-800 dark:bg-[#080d1a] dark:text-slate-200" />
            </div>
            <span className="self-end text-xs font-medium text-slate-500 sm:self-auto">Showing <strong className="text-slate-700 dark:text-slate-200">{filteredPurchases.length}</strong> of {purchases.length} purchases</span>
          </div>
        </PageHeader.Bottom>
      </PageHeader>

      {(isError || createError) && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error ?? createError}</span>
        </div>
      )}

      <div className="min-h-[calc(100vh-19rem)] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800/60 dark:bg-[#080d1a]">
        <div className="overflow-x-auto">
          {isLoading ? <Skeleton.Table rows={7} columns={8} /> : (
            <table className="w-full table-fixed text-left text-xs">
              <colgroup><col className="w-[15%]" /><col className="w-[20%]" /><col className="w-[14%]" /><col className="w-[12%]" /><col className="w-[11%]" /><col className="w-[11%]" /><col className="w-[10%]" /><col className="w-[7%]" /></colgroup>
              <thead className="bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:bg-slate-900/40"><tr>
                <th className="px-4 py-3">Purchase Reference</th><th className="px-4 py-3">Supplier</th><th className="px-4 py-3">Purchase Date</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Net Amount</th><th className="px-4 py-3 text-right">Paid Amount</th><th className="px-4 py-3 text-right">Due Amount</th><th className="px-2 py-3 text-center">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {paginatedItems.map((purchase) => (
                  <tr key={purchase.id} className="transition hover:bg-slate-50/70 dark:hover:bg-slate-900/40">
                    <td className="truncate px-4 py-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400"><button type="button" onClick={() => onViewPurchase(purchase)} className="cursor-pointer hover:underline">{purchase.purchaseNumber}</button></td>
                    <td className="truncate px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200">{purchase.supplierName}<span className="block text-[10px] font-mono text-slate-400">{purchase.supplierCode}</span></td>
                    <td className="truncate px-4 py-3.5 text-slate-500">{purchase.purchaseDate}</td>
                    <td className="px-4 py-3.5"><span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{purchase.status}</span></td>
                    <td className="truncate px-4 py-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">৳ {purchase.netAmount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                    <td className="truncate px-4 py-3.5 text-right font-mono text-emerald-600 dark:text-emerald-400">৳ {purchase.paidAmount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                    <td className={`truncate px-4 py-3.5 text-right font-mono ${purchase.dueAmount > 0 ? 'font-bold text-rose-500' : 'text-slate-400'}`}>৳ {purchase.dueAmount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}</td>
                    <td className="whitespace-nowrap px-2 py-3.5 text-center"><button type="button" onClick={() => onPrintPurchase(purchase)} title="Print purchase" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-emerald-500 dark:hover:bg-slate-800"><Printer className="h-3.5 w-3.5" /></button><button type="button" onClick={() => onViewPurchase(purchase)} title="View details" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-500 dark:hover:bg-slate-800"><Eye className="h-3.5 w-3.5" /></button></td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-slate-200/80 bg-slate-50/95 dark:border-slate-800/80 dark:bg-slate-900/60"><tr><td colSpan={8} className="p-0"><Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filteredPurchases.length} pageSize={pageSize} onPageSizeChange={setPageSize} showPageSizeSelector itemLabel="purchases" pageFooter={false} className="border-0 bg-transparent shadow-none" /></td></tr></tfoot>
            </table>
          )}
        </div>
      </div>
    </section>
  )
})

export default PurchasesPresenter
