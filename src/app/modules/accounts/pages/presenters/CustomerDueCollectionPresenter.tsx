import React, { useMemo, useState } from 'react';
import { AlertCircle, Plus, RefreshCw, Search } from 'lucide-react';
import { PageHeader, Pagination, Skeleton, useTablePagination } from '@/shared';
import type { CustomerDueInvoiceItem, CustomerDueItem, CustomerDuePendingItem } from '../../types/customer-due.types';
export interface CustomerDueCollectionPresenterProps {
    due: CustomerDueItem[];
    pending: CustomerDuePendingItem[];
    invoices: CustomerDueInvoiceItem[];
    summary?: { total_invoice: number; total_due: string | number };
    isLoading: boolean;
    isLoadingPending: boolean;
    isLoadingInvoices: boolean;
    isError: boolean;
    error: string | null;
    pendingError: string | null;
    invoicesError: string | null;
    createError: string | null;
    onOpenCreate: () => void;
    onRefetch: () => void;
    onRefetchInvoices: () => void;
}
const money = (value: string | number | undefined) =>
    `৳ ${Number(value ?? 0).toLocaleString('en-BD', { minimumFractionDigits: 2 })}`;
const date = (value: string) => new Date(value).toLocaleDateString('en-GB');
export const CustomerDueCollectionPresenter: React.FC<CustomerDueCollectionPresenterProps> = React.memo(
    ({
        due,
        pending,
        invoices,
        isLoading,
        isLoadingPending,
        isLoadingInvoices,
        isError,
        error,
        pendingError,
        invoicesError,
        createError,
        onOpenCreate,
        onRefetch,
        onRefetchInvoices
    }) => {
        const [search, setSearch] = useState('');
        const query = search.trim().toLowerCase();
        const filtered = useMemo(
            () =>
                due.filter((item) =>
                    `${item.invoice_no} ${item.due_cust_info?.customer_name ?? ''} ${item.remarks ?? ''}`
                        .toLowerCase()
                        .includes(query)
                ),
            [due, query]
        );
        const duePagination = useTablePagination(filtered);
        const pendingPagination = useTablePagination(pending);
        const invoicePagination = useTablePagination(invoices);
        const errors = [isError ? error : null, pendingError, invoicesError, createError].filter(Boolean);
        return (
            <section className="space-y-6">
                <PageHeader>
                    <PageHeader.Header
                        title="Customer Due Collection"
                        description="Track customer receivables, collect invoice balances, and reconcile outstanding dues."
                        actions={
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={onRefetch}
                                    disabled={isLoading}
                                    title="Refresh customer dues"
                                    className="rounded-xl bg-slate-100 p-2 text-slate-600 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300">
                                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                                </button>
                                <button
                                    type="button"
                                    onClick={onOpenCreate}
                                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white">
                                    <Plus className="h-4 w-4" />
                                    Collect Customer Due
                                </button>
                            </div>
                        }
                    />
                    <PageHeader.Bottom>
                        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                            <div className="relative w-full sm:w-80">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    value={search}
                                    onChange={(event) => {
                                        setSearch(event.target.value);
                                        duePagination.setCurrentPage(1);
                                    }}
                                    placeholder="Search invoice or customer..."
                                    className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs dark:border-slate-800 dark:bg-[#080d1a]"
                                />
                            </div>
                            <span className="text-xs text-slate-500">
                                Showing {filtered.length} of {due.length} records
                            </span>
                        </div>
                    </PageHeader.Bottom>
                </PageHeader>
                {errors.length > 0 && (
                    <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
                        <AlertCircle className="h-4 w-4" />
                        {errors[0]}
                    </div>
                )}
                <CustomerTable
                    title="Due Collection History"
                    isLoading={isLoading}
                    columns={[
                        'Invoice',
                        'Customer',
                        'Due Date',
                        'Total Amount',
                        'Paid Amount',
                        'Due Amount',
                        'Status',
                        'Remarks'
                    ]}>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {duePagination.paginatedItems.map((item) => {
                            const settled = Number(item.due_amount) <= 0;
                            return (
                                <tr
                                    key={item.id}
                                    className="transition-colors hover:bg-emerald-50/40 dark:hover:bg-emerald-950/10">
                                    <td className="px-5 py-4 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                                        {item.invoice_no}
                                        <span className="mt-1 block text-[10px] font-normal text-slate-400">
                                            {date(item.due_date)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 font-semibold">
                                        {item.due_cust_info?.customer_name ?? '—'}
                                    </td>
                                    <td className="px-4 py-4 text-slate-500">{date(item.due_date)}</td>
                                    <td className="px-4 py-4 text-right font-mono">{money(item.total_amount)}</td>
                                    <td className="px-4 py-4 text-right font-mono font-bold text-emerald-600">
                                        {money(item.paid_amount)}
                                    </td>
                                    <td
                                        className={`px-4 py-4 text-right font-mono font-bold ${settled ? 'text-slate-400' : 'text-rose-600'}`}>
                                        {money(item.due_amount)}
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span
                                            className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${settled ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>
                                            {settled ? 'Paid' : 'Due'}
                                        </span>
                                    </td>
                                    <td
                                        className="max-w-[180px] truncate px-4 py-4 text-slate-500"
                                        title={item.remarks ?? ''}>
                                        {item.remarks ?? '—'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={8} className="p-0">
                                <Pagination
                                    currentPage={duePagination.currentPage}
                                    totalPages={duePagination.totalPages}
                                    onPageChange={duePagination.setCurrentPage}
                                    totalItems={filtered.length}
                                    pageSize={duePagination.pageSize}
                                    onPageSizeChange={duePagination.setPageSize}
                                    showPageSizeSelector
                                    itemLabel="due records"
                                    pageFooter={false}
                                    className="border-0 bg-transparent shadow-none"
                                />
                            </td>
                        </tr>
                    </tfoot>
                </CustomerTable>
                <div className="grid gap-6 xl:grid-cols-2">
                    <CustomerTable
                        title="Invoice-wise Customer Due"
                        isLoading={isLoadingInvoices}
                        action={
                            <button
                                type="button"
                                onClick={onRefetchInvoices}
                                disabled={isLoadingInvoices}
                                className="rounded-lg p-1.5 text-slate-500">
                                <RefreshCw className={`h-4 w-4 ${isLoadingInvoices ? 'animate-spin' : ''}`} />
                            </button>
                        }
                        columns={['Invoice', 'Customer ID', 'Due Amount']}>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {invoicePagination.paginatedItems.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-5 py-3.5 font-mono font-bold">{item.invoice_no}</td>
                                    <td className="px-4 py-3.5">{item.customer_name}</td>
                                    <td className="px-4 py-3.5 text-right font-mono font-bold text-amber-600">
                                        {money(item.due_amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={3} className="p-0">
                                    <Pagination
                                        currentPage={invoicePagination.currentPage}
                                        totalPages={invoicePagination.totalPages}
                                        onPageChange={invoicePagination.setCurrentPage}
                                        totalItems={invoices.length}
                                        pageSize={invoicePagination.pageSize}
                                        onPageSizeChange={invoicePagination.setPageSize}
                                        showPageSizeSelector
                                        itemLabel="invoice dues"
                                        pageFooter={false}
                                        className="border-0 bg-transparent shadow-none"
                                    />
                                </td>
                            </tr>
                        </tfoot>
                    </CustomerTable>
                    <CustomerTable
                        title="Pending Customer Dues"
                        isLoading={isLoadingPending}
                        columns={['Customer', 'Phone', 'Previous Due']}>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {pendingPagination.paginatedItems.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-5 py-3.5 font-semibold">
                                        {item.customer_name}
                                        <span className="mt-1 block text-[10px] text-slate-400">
                                            {item.customer_code ?? 'Customer account'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5">{item.phone ?? '—'}</td>
                                    <td className="px-4 py-3.5 text-right font-mono font-bold text-amber-600">
                                        {money(item.previous_due)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={3} className="p-0">
                                    <Pagination
                                        currentPage={pendingPagination.currentPage}
                                        totalPages={pendingPagination.totalPages}
                                        onPageChange={pendingPagination.setCurrentPage}
                                        totalItems={pending.length}
                                        pageSize={pendingPagination.pageSize}
                                        onPageSizeChange={pendingPagination.setPageSize}
                                        showPageSizeSelector
                                        itemLabel="pending customers"
                                        pageFooter={false}
                                        className="border-0 bg-transparent shadow-none"
                                    />
                                </td>
                            </tr>
                        </tfoot>
                    </CustomerTable>
                </div>
            </section>
        );
    }
);
interface CustomerTableProps {
    title: string;
    columns: string[];
    isLoading: boolean;
    action?: React.ReactNode;
    children: React.ReactNode;
}
const CustomerTable: React.FC<CustomerTableProps> = ({ title, columns, isLoading, action, children }) => {
    const widths =
        title === 'Invoice-wise Customer Due'
            ? ['42%', '25%', '33%']
            : title === 'Pending Customer Dues'
              ? ['45%', '25%', '30%']
              : ['16%', '17%', '12%', '12%', '12%', '12%', '10%', '19%'];
    const minWidth = columns.length === 8 ? 980 : 620;
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800/60 dark:bg-[#080d1a]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
                <h2 className="text-sm font-bold text-slate-800 dark:text-white">{title}</h2>
                {action}
            </div>
            {isLoading ? (
                <Skeleton.Table rows={4} columns={columns.length} />
            ) : (
                <div className="overflow-x-auto">
                    <table style={{ minWidth }} className="w-full table-fixed text-left text-xs">
                        <colgroup>
                            {widths.map((width, index) => (
                                <col key={columns[index]} style={{ width }} />
                            ))}
                        </colgroup>
                        <thead className="bg-slate-50/90 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:bg-slate-900/50">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column}
                                        className={`px-4 py-3.5 ${/amount|due/i.test(column) ? 'text-right' : /status/i.test(column) ? 'text-center' : 'text-left'}`}>
                                        {column}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        {children}
                    </table>
                </div>
            )}
        </div>
    );
};
export default CustomerDueCollectionPresenter;
