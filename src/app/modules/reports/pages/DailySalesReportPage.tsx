import React, { useMemo, useState } from 'react';
import { CalendarDays, Download, LoaderCircle, Printer, RefreshCw, Search } from 'lucide-react';
import { useApi } from '@/shared/hooks/useApi';
import { reportService } from '../services/reportService';
import type {
    DailySalesReportItem,
    DailySalesReportParams,
    DailySalesReportResponse
} from '../types/daily-sales-report.types';

const today = () => new Date().toISOString().slice(0, 10);
const toNumber = (value: string | number | undefined): number => Number(value ?? 0);
const formatMoney = (value: number) =>
    `৳ ${value.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const formatDate = (value: string) => {
    const date = new Date(`${value.slice(0, 10)}T00:00:00`);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-GB');
};

export const DailySalesReportPage: React.FC = () => {
    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(today);
    const [appliedRange, setAppliedRange] = useState<{ from: string; to: string } | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const reportRequest = useApi<DailySalesReportResponse, DailySalesReportParams>(reportService.getDailySales);
    const invoices = useMemo<DailySalesReportItem[]>(() => reportRequest.data?.data ?? [], [reportRequest.data]);
    const totals = useMemo(
        () =>
            invoices.reduce(
                (summary, invoice) => ({
                    gross: summary.gross + toNumber(invoice.total_amount),
                    discount: summary.discount + toNumber(invoice.discount_amount),
                    vat: summary.vat + toNumber(invoice.vat_amount),
                    net: summary.net + toNumber(invoice.net_amount),
                    paid: summary.paid + toNumber(invoice.paid_amount),
                    due: summary.due + toNumber(invoice.due_amount)
                }),
                { gross: 0, discount: 0, vat: 0, net: 0, paid: 0, due: 0 }
            ),
        [invoices]
    );
    const rangeLabel = appliedRange
        ? `${formatDate(appliedRange.from)} – ${formatDate(appliedRange.to)}`
        : 'Select a date range to generate the report';

    const loadReport = async (event?: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault();
        if (!fromDate || !toDate) return setFormError('Please select both dates.');
        if (fromDate > toDate) return setFormError('Start date cannot be later than the end date.');
        setFormError(null);
        setAppliedRange({ from: fromDate, to: toDate });
        await reportRequest.execute({ from_date: fromDate, to_date: toDate });
    };

    const metrics = [
        ['Invoices', invoices.length.toLocaleString('en-BD'), 'text-slate-900 dark:text-white'],
        ['Gross sales', formatMoney(totals.gross), 'text-slate-900 dark:text-white'],
        ['Discount', formatMoney(totals.discount), 'text-rose-600 dark:text-rose-400'],
        ['VAT collected', formatMoney(totals.vat), 'text-blue-600 dark:text-blue-400'],
        ['Net sales', formatMoney(totals.net), 'text-emerald-600 dark:text-emerald-400'],
        ['Outstanding', formatMoney(totals.due), 'text-amber-600 dark:text-amber-400']
    ] as const;

    return (
        <section className="print-report-page daily-sales-report space-y-5">
            <div className="daily-sales-report-header rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/60 dark:bg-[#080d1a] lg:p-6">
                <div className="report-letterhead">
                    <div className="report-brand print-report-logo" aria-label="Emojud">
                        <div className="report-brand-mark">E</div>
                        <div>
                            <div className="report-brand-name">Emojud</div>
                            <div className="report-brand-subtitle">Report</div>
                        </div>
                    </div>
                </div>
                <div className="report-title-row">
                    <h1>Daily Sales Report</h1>
                    <p>{rangeLabel}</p>
                </div>
                <form
                    onSubmit={(event) => void loadReport(event)}
                    className="report-filter mt-5 rounded-xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/40 print-controls">
                    <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                            From date
                            <span className="relative mt-1.5 block">
                                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(event) => setFromDate(event.target.value)}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pl-9 text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                                />
                            </span>
                        </label>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">
                            To date
                            <span className="relative mt-1.5 block">
                                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(event) => setToDate(event.target.value)}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pl-9 text-xs font-medium text-slate-800 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                                />
                            </span>
                        </label>
                        <button
                            type="submit"
                            disabled={reportRequest.isLoading}
                            className="inline-flex h-[34px] items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 text-xs font-bold text-white disabled:opacity-60">
                            {reportRequest.isLoading ? (
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                            ) : (
                                <Search className="h-4 w-4" />
                            )}
                            {reportRequest.isLoading ? 'Loading report...' : 'Generate report'}
                        </button>
                    </div>
                    {formError && <p className="mt-2 text-xs font-medium text-rose-600">{formError}</p>}
                </form>
            </div>
            {reportRequest.isError && (
                <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
                    <span>{reportRequest.error ?? 'Unable to load the sales report.'}</span>
                    <button
                        type="button"
                        onClick={() => void loadReport()}
                        className="inline-flex items-center gap-1.5 font-bold">
                        <RefreshCw className="h-3.5 w-3.5" /> Retry
                    </button>
                </div>
            )}
            <div className="daily-sales-summary grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {metrics.map(([label, value, color]) => (
                    <div
                        key={label}
                        className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800/60 dark:bg-[#080d1a]">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                        <p className={`mt-1.5 font-mono text-lg font-black ${color}`}>{value}</p>
                    </div>
                ))}
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800/60 dark:bg-[#080d1a]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800/80">
                    <div>
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white">Sales register</h2>
                        <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                            Invoice-level sales activity for {rangeLabel}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 print-controls">
                        <button
                            type="button"
                            onClick={() => window.print()}
                            disabled={!appliedRange || reportRequest.isLoading}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200">
                            <Printer className="h-3.5 w-3.5" /> Print
                        </button>
                        <button
                            type="button"
                            disabled={!invoices.length}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">
                            <Download className="h-3.5 w-3.5" /> Export CSV
                        </button>
                    </div>
                </div>
                {!appliedRange ? (
                    <div className="flex min-h-56 flex-col items-center justify-center px-5 text-center">
                        <div className="mb-3 rounded-full bg-emerald-50 p-3 text-emerald-600">
                            <Search className="h-5 w-5" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Choose a date range</h3>
                        <p className="mt-1 max-w-sm text-xs text-slate-500">
                            Select the reporting period above and generate the report to load sales data.
                        </p>
                    </div>
                ) : invoices.length === 0 && !reportRequest.isLoading ? (
                    <div className="flex min-h-56 items-center justify-center text-xs text-slate-500">
                        No sales invoices were found for this date range.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[980px] text-left text-xs">
                            <thead className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                <tr>
                                    <th className="px-5 py-3">SL</th>
                                    <th className="px-4 py-3">Invoice &amp; Date</th>
                                    <th className="px-4 py-3">Outlet</th>
                                    <th className="px-4 py-3">Customer</th>
                                    <th className="px-4 py-3 text-right">Gross</th>
                                    <th className="px-4 py-3 text-right">Discount</th>
                                    <th className="px-4 py-3 text-right">VAT</th>
                                    <th className="px-4 py-3 text-right">Net sales</th>
                                    <th className="px-4 py-3 text-right">Paid</th>
                                    <th className="px-4 py-3 text-right">Due</th>
                                    <th className="px-4 py-3 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {invoices.map((invoice, index) => {
                                    const due = toNumber(invoice.due_amount);
                                    return (
                                        <tr key={invoice.id}>
                                            <td className="px-5 py-3.5 font-mono text-slate-400">{index + 1}</td>
                                            <td className="px-4 py-3.5">
                                                <p className="font-mono font-bold text-slate-900 dark:text-white">
                                                    {invoice.invoice_no}
                                                </p>
                                                <p className="mt-0.5 text-[10px] text-slate-400">
                                                    {formatDate(invoice.invoice_date)}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                                                Shop {invoice.shop_id}
                                            </td>
                                            <td className="px-4 py-3.5 text-slate-800 dark:text-slate-200">
                                                Customer {invoice.customer_id}
                                            </td>
                                            <td className="px-4 py-3.5 text-right font-mono">
                                                {formatMoney(toNumber(invoice.total_amount))}
                                            </td>
                                            <td className="px-4 py-3.5 text-right font-mono text-rose-600">
                                                {formatMoney(toNumber(invoice.discount_amount))}
                                            </td>
                                            <td className="px-4 py-3.5 text-right font-mono text-blue-600">
                                                {formatMoney(toNumber(invoice.vat_amount))}
                                            </td>
                                            <td className="px-4 py-3.5 text-right font-mono font-black text-emerald-600">
                                                {formatMoney(toNumber(invoice.net_amount))}
                                            </td>
                                            <td className="px-4 py-3.5 text-right font-mono">
                                                {formatMoney(toNumber(invoice.paid_amount))}
                                            </td>
                                            <td className="px-4 py-3.5 text-right font-mono text-amber-600">
                                                {formatMoney(due)}
                                            </td>
                                            <td className="px-4 py-3.5 text-center">
                                                <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
                                                    {invoice.status === 1 ? (due > 0 ? 'Due' : 'Approved') : 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                            <tfoot className="border-t border-slate-200 bg-slate-50/95 font-bold">
                                <tr>
                                    <td colSpan={4} className="px-5 py-3 text-right">
                                        Report total
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono">{formatMoney(totals.gross)}</td>
                                    <td className="px-4 py-3 text-right font-mono text-rose-600">
                                        {formatMoney(totals.discount)}
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono text-blue-600">
                                        {formatMoney(totals.vat)}
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono text-emerald-600">
                                        {formatMoney(totals.net)}
                                    </td>
                                    <td className="px-4 py-3 text-right font-mono">{formatMoney(totals.paid)}</td>
                                    <td className="px-4 py-3 text-right font-mono text-amber-600">
                                        {formatMoney(totals.due)}
                                    </td>
                                    <td />
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
};
