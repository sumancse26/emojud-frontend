import React, { useMemo, useState } from 'react';
import { AlertCircle, Plus, RefreshCw, Search } from 'lucide-react';
import { PageHeader, Pagination, Skeleton, useTablePagination } from '@/shared';
import type {
    SupplierPaymentDueItem,
    SupplierPaymentListItem,
    SupplierPaymentPendingItem
} from '../../types/supplier-payment.types';

export interface SupplierPaymentPresenterProps {
    payments: SupplierPaymentListItem[];
    duePurchases: SupplierPaymentDueItem[];
    pendingSuppliers: SupplierPaymentPendingItem[];
    summary?: { no_of_purchase: number; total_due: string | number; total_purchase: string | number };
    isLoading: boolean;
    isLoadingDue: boolean;
    isLoadingPending: boolean;
    isError: boolean;
    error: string | null;
    dueError: string | null;
    pendingError: string | null;
    createError: string | null;
    onOpenCreate: () => void;
    onRefetch: () => void;
    onRefetchDue: () => void;
}

const money = (value: string | number | undefined) =>
    `৳ ${Number(value ?? 0).toLocaleString('en-BD', { minimumFractionDigits: 2 })}`;
const date = (value: string) => new Date(value).toLocaleDateString('en-GB');

export const SupplierPaymentPresenter: React.FC<SupplierPaymentPresenterProps> = React.memo(
    ({
        payments,
        duePurchases,
        pendingSuppliers,
        isLoading,
        isLoadingDue,
        isLoadingPending,
        isError,
        error,
        dueError,
        pendingError,
        createError,
        onOpenCreate,
        onRefetch,
        onRefetchDue
    }) => {
        const [search, setSearch] = useState('');
        const query = search.trim().toLowerCase();
        const filteredPayments = useMemo(
            () =>
                payments.filter((item) =>
                    `${item.payment_no} ${item.supplierPayment?.supplier_name ?? ''} ${item.remarks ?? ''}`
                        .toLowerCase()
                        .includes(query)
                ),
            [payments, query]
        );
        const paymentPagination = useTablePagination(filteredPayments);
        const duePagination = useTablePagination(duePurchases);
        const pendingPagination = useTablePagination(pendingSuppliers);
        const errors = [isError ? error : null, dueError, pendingError, createError].filter(Boolean);
        return (
            <section className="space-y-6">
                <PageHeader>
                    <PageHeader.Header
                        title="Supplier Payments & Settlements"
                        description="Disburse supplier dues and balance procurement accounts."
                        actions={
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={onRefetch}
                                    disabled={isLoading}
                                    title="Refresh payments"
                                    className="rounded-xl bg-slate-100 p-2 text-slate-600 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300">
                                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                                </button>
                                <button
                                    type="button"
                                    onClick={onOpenCreate}
                                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white">
                                    <Plus className="h-4 w-4" />
                                    Make Supplier Payment
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
                                        paymentPagination.setCurrentPage(1);
                                    }}
                                    placeholder="Search payment no, supplier or remarks..."
                                    className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs dark:border-slate-800 dark:bg-[#080d1a]"
                                />
                            </div>
                            <span className="text-xs text-slate-500">
                                Showing {filteredPayments.length} of {payments.length} payments
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
                <DataTable
                    title="Payment History"
                    isLoading={isLoading}
                    columns={[
                        'Payment Reference',
                        'Supplier',
                        'Total Due',
                        'Paid Amount',
                        'Balance',
                        'Status',
                        'Remarks'
                    ]}>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {paymentPagination.paginatedItems.map((item) => {
                            const isSettled = Number(item.current_due) <= 0;
                            return (
                                <tr
                                    key={item.id}
                                    className="transition-colors hover:bg-emerald-50/40 dark:hover:bg-emerald-950/10">
                                    <td className="px-5 py-4 align-middle">
                                        <p className="font-mono text-[11px] font-bold tracking-wide text-emerald-700 dark:text-emerald-400">
                                            {item.payment_no}
                                        </p>
                                        <p className="mt-1 text-[10px] text-slate-400">{date(item.payment_date)}</p>
                                    </td>
                                    <td className="px-4 py-4 align-middle">
                                        <p className="font-semibold text-slate-800 dark:text-slate-100">
                                            {item.supplierPayment?.supplier_name ?? '—'}
                                        </p>
                                        <p className="mt-1 text-[10px] text-slate-400">
                                            {item.supplierPayment?.supplier_code ?? 'Supplier information unavailable'}
                                            {item.supplierPayment?.phone ? ` · ${item.supplierPayment.phone}` : ''}
                                        </p>
                                    </td>
                                    <td className="px-4 py-4 text-right align-middle font-mono text-[11px] text-slate-600 dark:text-slate-300">
                                        {money(item.total_due)}
                                    </td>
                                    <td className="px-4 py-4 text-right align-middle font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                        {money(item.paid_amount)}
                                    </td>
                                    <td
                                        className={`px-4 py-4 text-right align-middle font-mono text-[11px] font-bold ${isSettled ? 'text-slate-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                        {money(item.current_due)}
                                    </td>
                                    <td className="px-4 py-4 text-center align-middle">
                                        <span
                                            className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${isSettled ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300' : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300'}`}>
                                            {isSettled ? 'Settled' : 'Partial'}
                                        </span>
                                    </td>
                                    <td
                                        className="max-w-[220px] truncate px-4 py-4 align-middle text-slate-500 dark:text-slate-400"
                                        title={item.remarks ?? ''}>
                                        {item.remarks ?? '—'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={7} className="p-0">
                                <Pagination
                                    currentPage={paymentPagination.currentPage}
                                    totalPages={paymentPagination.totalPages}
                                    onPageChange={paymentPagination.setCurrentPage}
                                    totalItems={filteredPayments.length}
                                    pageSize={paymentPagination.pageSize}
                                    onPageSizeChange={paymentPagination.setPageSize}
                                    showPageSizeSelector
                                    itemLabel="payments"
                                    pageFooter={false}
                                    className="border-0 bg-transparent shadow-none"
                                />
                            </td>
                        </tr>
                    </tfoot>
                </DataTable>
                <div className="grid gap-6 xl:grid-cols-2">
                    <DataTable
                        title="Purchase Dues"
                        isLoading={isLoadingDue}
                        action={
                            <button
                                type="button"
                                onClick={onRefetchDue}
                                disabled={isLoadingDue}
                                className="rounded-lg p-1.5 text-slate-500">
                                <RefreshCw className={`h-4 w-4 ${isLoadingDue ? 'animate-spin' : ''}`} />
                            </button>
                        }
                        columns={['Purchase', 'Supplier', 'Purchase Date', 'Due Amount']}>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {duePagination.paginatedItems.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-5 py-3.5 font-mono font-bold">{item.purchase_no}</td>
                                    <td className="px-4 py-3.5">{item.supplier.supplier_name}</td>
                                    <td className="px-4 py-3.5">{date(item.purchase_date)}</td>
                                    <td className="px-4 py-3.5 text-right font-bold text-amber-600">
                                        {money(item.due_amount)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={4} className="p-0">
                                    <Pagination
                                        currentPage={duePagination.currentPage}
                                        totalPages={duePagination.totalPages}
                                        onPageChange={duePagination.setCurrentPage}
                                        totalItems={duePurchases.length}
                                        pageSize={duePagination.pageSize}
                                        onPageSizeChange={duePagination.setPageSize}
                                        showPageSizeSelector
                                        itemLabel="purchase dues"
                                        pageFooter={false}
                                        className="border-0 bg-transparent shadow-none"
                                    />
                                </td>
                            </tr>
                        </tfoot>
                    </DataTable>
                    <DataTable
                        title="Pending Supplier Dues"
                        isLoading={isLoadingPending}
                        columns={['Supplier', 'Phone', 'Previous Due']}>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {pendingPagination.paginatedItems.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-5 py-3.5">
                                        {item.supplier_name}
                                        <span className="block text-[10px] text-slate-400">{item.supplier_code}</span>
                                    </td>
                                    <td className="px-4 py-3.5">{item.phone ?? '—'}</td>
                                    <td className="px-4 py-3.5 text-right font-bold text-amber-600">
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
                                        totalItems={pendingSuppliers.length}
                                        pageSize={pendingPagination.pageSize}
                                        onPageSizeChange={pendingPagination.setPageSize}
                                        showPageSizeSelector
                                        itemLabel="pending suppliers"
                                        pageFooter={false}
                                        className="border-0 bg-transparent shadow-none"
                                    />
                                </td>
                            </tr>
                        </tfoot>
                    </DataTable>
                </div>
            </section>
        );
    }
);

interface DataTableProps {
    title: string;
    columns: string[];
    isLoading: boolean;
    action?: React.ReactNode;
    children: React.ReactNode;
}
const DataTable: React.FC<DataTableProps> = ({ title, columns, isLoading, action, children }) => {
    const widths =
        columns.length === 7
            ? ['18%', '21%', '13%', '13%', '13%', '10%', '22%']
            : columns.length === 6
              ? ['20%', '20%', '15%', '15%', '15%', '15%']
              : columns.length === 4
                ? ['24%', '32%', '22%', '22%']
                : ['45%', '25%', '30%'];
    const minWidth = columns.length === 7 ? 980 : columns.length === 6 ? 900 : columns.length === 4 ? 650 : 600;
    const isNumeric = (column: string) => /amount|due|balance/i.test(column);
    const isStatus = (column: string) => /status/i.test(column);
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800/60 dark:bg-[#080d1a]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
                <div>
                    <h2 className="text-sm font-bold text-slate-800 dark:text-white">{title}</h2>
                    <p className="mt-0.5 text-[10px] text-slate-400">Review and reconcile supplier transactions</p>
                </div>
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
                                        className={`px-4 py-3.5 first:pl-5 last:pr-5 ${isNumeric(column) ? 'text-right' : isStatus(column) ? 'text-center' : 'text-left'}`}>
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

export default SupplierPaymentPresenter;
