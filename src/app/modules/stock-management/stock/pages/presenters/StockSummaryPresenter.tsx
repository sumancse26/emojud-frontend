import React, { useMemo, useState } from 'react'
import { AlertCircle, Eye, RefreshCw, Search } from 'lucide-react'
import { PageHeader, Pagination, Skeleton, useTablePagination } from '@/shared'
import type { StockItem } from '../../types/stock.types'

export interface StockSummaryPresenterProps {
  stocks: StockItem[]
  isLoading: boolean
  isError: boolean
  error: string | null
  onRefetch: () => void
  onViewStock: (stock: StockItem) => void
}

export const StockSummaryPresenter: React.FC<StockSummaryPresenterProps> = React.memo(({ stocks, isLoading, isError, error, onRefetch, onViewStock }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const filteredStocks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return stocks
    return stocks.filter((stock) => [stock.productName, stock.productCode, stock.category, stock.brand].some((value) => value.toLowerCase().includes(query)))
  }, [searchQuery, stocks])
  const { currentPage, pageSize, totalPages, paginatedItems, setCurrentPage, setPageSize } = useTablePagination(filteredStocks)

  return <section className="space-y-6">
    <PageHeader>
      <PageHeader.Header title="Stock Summary & Valuation" description="Real-time inventory levels, product availability, and stock movement details." actions={<button type="button" onClick={onRefetch} disabled={isLoading} title="Refresh stock summary" className="rounded-xl bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300"><RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} /></button>} />
      <PageHeader.Bottom><div className="flex flex-col items-center justify-between gap-3 sm:flex-row"><div className="relative w-full sm:w-80"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }} placeholder="Search by product, code, brand or category..." className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-slate-800 dark:bg-[#080d1a] dark:text-slate-200" /></div><span className="self-end text-xs text-slate-500 sm:self-auto">Showing <strong className="text-slate-700 dark:text-slate-200">{filteredStocks.length}</strong> of {stocks.length} products</span></div></PageHeader.Bottom>
    </PageHeader>
    {isError && <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300"><AlertCircle className="h-4 w-4" />{error ?? 'Unable to load stock summary.'}</div>}
    <div className="min-h-[calc(100vh-16rem)] overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800/60 dark:bg-[#080d1a]
    ">{isLoading ? <Skeleton.Table rows={7} columns={7} /> : <table className="w-full table-fixed text-left text-xs"><colgroup><col className="w-[24%]" /><col className="w-[15%]" /><col className="w-[15%]" /><col className="w-[13%]" /><col className="w-[13%]" /><col className="w-[12%]" /><col className="w-[8%]" /></colgroup><thead className="bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:bg-slate-900/40"><tr><th className="px-4 py-3">Product & Code</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Brand</th><th className="px-4 py-3">Unit</th><th className="px-4 py-3 text-right">Available Stock</th><th className="px-4 py-3">Stock Date</th><th className="px-2 py-3 text-center">Actions</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">{paginatedItems.map((stock) => <tr key={stock.id} className="transition hover:bg-slate-50/70 dark:hover:bg-slate-900/40"><td className="truncate px-4 py-3.5 font-medium text-slate-900 dark:text-white">{stock.productName}<span className="block text-[10px] font-mono text-slate-400">{stock.productCode}</span></td><td className="truncate px-4 py-3.5 text-slate-600 dark:text-slate-300">{stock.category}</td><td className="truncate px-4 py-3.5 text-slate-600 dark:text-slate-300">{stock.brand}</td><td className="px-4 py-3.5 text-slate-500">{stock.unit}</td><td className={`px-4 py-3.5 text-right font-mono font-bold ${stock.currentStock > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>{stock.currentStock.toLocaleString('en-BD')} {stock.unit}</td><td className="truncate px-4 py-3.5 text-slate-500">{stock.stockDate ? new Date(stock.stockDate).toLocaleDateString('en-GB') : '—'}</td><td className="px-2 py-3.5 text-center"><button type="button" onClick={() => onViewStock(stock)} title="View stock details" className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-500 dark:hover:bg-slate-800"><Eye className="h-3.5 w-3.5" /></button></td></tr>)}</tbody><tfoot className="border-t border-slate-200/80 bg-slate-50/95 dark:border-slate-800/80 dark:bg-slate-900/60"><tr><td colSpan={7} className="p-0"><Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} totalItems={filteredStocks.length} pageSize={pageSize} onPageSizeChange={setPageSize} showPageSizeSelector itemLabel="stock products" pageFooter={false} className="border-0 bg-transparent shadow-none" /></td></tr></tfoot></table>}</div>
  </section>
})

export default StockSummaryPresenter
