import React from 'react'
import { Plus, RefreshCw, Search } from 'lucide-react'
import { PageHeader, Skeleton } from '@/shared'
import { InvoiceTable } from '../../components/InvoiceTable'
import type { Invoice } from '../../types/invoice.types'

export interface InvoicesPresenterProps {
  invoices: Invoice[]
  searchTerm: string
  isLoading: boolean
  isError: boolean
  error: string | null
  createError: string | null
  onSearchChange: (value: string) => void
  onOpenCreate: () => void
  onRefetch: () => void
  onViewInvoice: (invoice: Invoice) => void
  onPrintInvoice: (invoice: Invoice) => void
}

export const InvoicesPresenter: React.FC<InvoicesPresenterProps> = React.memo(({
  invoices,
  searchTerm,
  isLoading,
  isError,
  error,
  createError,
  onSearchChange,
  onOpenCreate,
  onRefetch,
  onViewInvoice,
  onPrintInvoice,
}) => (
  <>
    <PageHeader>
      <PageHeader.Header
        title="Sales Invoices"
        description="Customer billing records, point-of-sale checkouts, and receivables"
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRefetch}
              disabled={isLoading}
              title="Refresh invoices"
              aria-label="Refresh invoices"
              className="rounded-xl bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onOpenCreate}
              className="flex shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-500 hover:shadow-emerald-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>New Invoice</span>
            </button>
          </div>
        }
      />

      <PageHeader.Bottom>
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by invoice no, customer or phone..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-slate-800 dark:bg-[#080d1a] dark:text-slate-200"
            />
          </div>
          <span className="self-end text-xs font-medium text-slate-500 dark:text-slate-400 sm:self-auto">
            Showing{' '}
            <strong className="font-semibold text-slate-700 dark:text-slate-200">{invoices.length}</strong>{' '}
            invoice{invoices.length === 1 ? '' : 's'}
          </span>
        </div>
      </PageHeader.Bottom>
    </PageHeader>

    {isError && (
      <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
        {error ?? 'Unable to load invoices.'}
      </div>
    )}

    {createError && (
      <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
        {createError}
      </div>
    )}

    {isLoading ? (
      <Skeleton.Table rows={7} columns={9} />
    ) : (
      <InvoiceTable
        invoices={invoices}
        searchTerm={searchTerm}
        onViewInvoice={onViewInvoice}
        onPrintInvoice={onPrintInvoice}
      />
    )}
  </>
))

export default InvoicesPresenter
