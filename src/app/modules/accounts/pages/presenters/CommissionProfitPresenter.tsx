import React, { useMemo, useState } from 'react';
import { AlertCircle, Plus, RefreshCw, Search } from 'lucide-react';
import { PageHeader, Pagination, Skeleton, useTablePagination } from '@/shared';
import type { CommissionProfitItem } from '../../types/commission-profit.types';
export interface CommissionProfitPresenterProps {
    records: CommissionProfitItem[];
    isLoading: boolean;
    error: string | null;
    createError: string | null;
    onOpenCreate: () => void;
    onRefetch: () => void;
}
const money = (value: string | number | undefined) =>
    `৳ ${Number(value ?? 0).toLocaleString('en-BD', { minimumFractionDigits: 2 })}`;
const date = (value: string | null) => (value ? new Date(value).toLocaleDateString('en-GB') : '—');
export const CommissionProfitPresenter: React.FC<CommissionProfitPresenterProps> = React.memo(
    ({ records, isLoading, error, createError, onOpenCreate, onRefetch }) => {
        const [search, setSearch] = useState('');
        const query = search.trim().toLowerCase();
        const filtered = useMemo(
            () =>
                records.filter((item) =>
                    `${item.year_id} ${item.invoice_id ?? ''} ${item.product_id ?? ''} ${item.received_date ?? ''}`
                        .toLowerCase()
                        .includes(query)
                ),
            [records, query]
        );
        const pagination = useTablePagination(filtered);
        return (
            <section className="space-y-6">
                <PageHeader>
                    <PageHeader.Header
                        title="Commission & Profit"
                        description="Track shop commission earnings, profit margins, and received commission payments."
                        actions={
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={onRefetch}
                                    disabled={isLoading}
                                    title="Refresh commission records"
                                    className="rounded-xl bg-slate-100 p-2 text-slate-600 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300">
                                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                                </button>
                                <button
                                    type="button"
                                    onClick={onOpenCreate}
                                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white">
                                    <Plus className="h-4 w-4" />
                                    Receive Commission
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
                                        pagination.setCurrentPage(1);
                                    }}
                                    placeholder="Search year, invoice, or product..."
                                    className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs dark:border-slate-800 dark:bg-[#080d1a]"
                                />
                            </div>
                            <span className="text-xs text-slate-500">
                                Showing {filtered.length} of {records.length} records
                            </span>
                        </div>
                    </PageHeader.Bottom>
                </PageHeader>
                {(error || createError) && (
                    <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
                        <AlertCircle className="h-4 w-4" />
                        {error ?? createError}
                    </div>
                )}
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800/60 dark:bg-[#080d1a]">
                    {isLoading ? (
                        <Skeleton.Table rows={6} columns={9} />
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-[1050px] w-full table-fixed text-left text-xs">
                                <colgroup>
                                    <col className="w-[9%]" />
                                    <col className="w-[10%]" />
                                    <col className="w-[10%]" />
                                    <col className="w-[11%]" />
                                    <col className="w-[11%]" />
                                    <col className="w-[11%]" />
                                    <col className="w-[12%]" />
                                    <col className="w-[12%]" />
                                    <col className="w-[14%]" />
                                </colgroup>
                                <thead className="bg-slate-50/90 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:bg-slate-900/50">
                                    <tr>
                                        <th className="px-5 py-3.5">Year</th>
                                        <th className="px-4 py-3.5">Invoice</th>
                                        <th className="px-4 py-3.5">Product</th>
                                        <th className="px-4 py-3.5 text-right">Qty</th>
                                        <th className="px-4 py-3.5 text-right">Purchase Rate</th>
                                        <th className="px-4 py-3.5 text-right">Sales Rate</th>
                                        <th className="px-4 py-3.5 text-right">Profit</th>
                                        <th className="px-4 py-3.5 text-right">Commission</th>
                                        <th className="px-4 py-3.5 text-center">Received</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                    {pagination.paginatedItems.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="transition-colors hover:bg-emerald-50/40 dark:hover:bg-emerald-950/10">
                                            <td className="px-5 py-4 font-semibold">{item.year_id}</td>
                                            <td className="px-4 py-4 font-mono text-slate-500">
                                                {item.invoice_id ?? 'Shop level'}
                                            </td>
                                            <td className="px-4 py-4 font-mono text-slate-500">
                                                {item.product_id ?? '—'}
                                            </td>
                                            <td className="px-4 py-4 text-right font-mono">{item.qty}</td>
                                            <td className="px-4 py-4 text-right font-mono">
                                                {money(item.purchase_rate)}
                                            </td>
                                            <td className="px-4 py-4 text-right font-mono">{money(item.sales_rate)}</td>
                                            <td className="px-4 py-4 text-right font-mono font-bold text-blue-600">
                                                {money(item.profit_amount)}
                                            </td>
                                            <td className="px-4 py-4 text-right font-mono font-bold text-emerald-600">
                                                {money(item.commission_amount)}
                                                <span className="block text-[10px] font-normal text-slate-400">
                                                    {item.commission_percent}%
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span
                                                    className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${item.is_received_commission === 1 ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>
                                                    {item.is_received_commission === 1
                                                        ? date(item.received_date)
                                                        : 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="border-t border-slate-200/80 bg-slate-50/95 dark:border-slate-800/80 dark:bg-slate-900/60">
                                    <tr>
                                        <td colSpan={9} className="p-0">
                                            <Pagination
                                                currentPage={pagination.currentPage}
                                                totalPages={pagination.totalPages}
                                                onPageChange={pagination.setCurrentPage}
                                                totalItems={filtered.length}
                                                pageSize={pagination.pageSize}
                                                onPageSizeChange={pagination.setPageSize}
                                                showPageSizeSelector
                                                itemLabel="commission records"
                                                pageFooter={false}
                                                className="border-0 bg-transparent shadow-none"
                                            />
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    )}
                </div>
            </section>
        );
    }
);
export default CommissionProfitPresenter;
