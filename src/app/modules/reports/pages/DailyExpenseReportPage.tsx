import React, { useMemo, useState } from 'react';
import { CalendarDays, Download, LoaderCircle, Printer, RefreshCw, Search } from 'lucide-react';
import { useApi } from '@/shared/hooks/useApi';
import { reportService } from '../services/reportService';
import type { DailyExpenseReportItem, DailyExpenseReportParams, DailyExpenseReportResponse } from '../types/daily-expense-report.types';

const today = () => new Date().toISOString().slice(0, 10);
const toNumber = (value: string | number | undefined) => Number(value ?? 0);
const money = (value: number) => `৳ ${value.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const dateLabel = (value: string) => new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString('en-GB');

export const DailyExpenseReportPage: React.FC = () => {
    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(today);
    const [appliedRange, setAppliedRange] = useState<DailyExpenseReportParams | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const request = useApi<DailyExpenseReportResponse, DailyExpenseReportParams>(reportService.getDailyExpense);
    const expenses = useMemo<DailyExpenseReportItem[]>(() => request.data?.data ?? [], [request.data]);
    const total = useMemo(() => expenses.reduce((sum, expense) => sum + toNumber(expense.total_amount), 0), [expenses]);
    const average = expenses.length ? total / expenses.length : 0;
    const rangeLabel = appliedRange
        ? `${dateLabel(appliedRange.from_date)} – ${dateLabel(appliedRange.to_date)}`
        : 'Select a date range to generate the report';

    const generate = async (event?: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault();
        if (!fromDate || !toDate) return setFormError('Please select both dates.');
        if (fromDate > toDate) return setFormError('Start date cannot be later than the end date.');
        const params = { from_date: fromDate, to_date: toDate };
        setFormError(null);
        setAppliedRange(params);
        await request.execute(params);
    };

    return (
        <section className="print-report-page daily-sales-report space-y-5">
            <div className="daily-sales-report-header rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/60 dark:bg-[#080d1a] lg:p-6">
                <div className="report-letterhead"><div className="report-brand print-report-logo" aria-label="Emojud"><div className="report-brand-mark">E</div><div><div className="report-brand-name">Emojud</div><div className="report-brand-subtitle">Report</div></div></div></div>
                <div className="report-title-row"><h1>Daily Expense Report</h1><p>{rangeLabel}</p></div>
                <form onSubmit={(event) => void generate(event)} className="mt-5 rounded-xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/40 print-controls">
                    <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">From date<span className="relative mt-1.5 block"><CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pl-9 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200" /></span></label>
                        <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">To date<span className="relative mt-1.5 block"><CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pl-9 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200" /></span></label>
                        <button type="submit" disabled={request.isLoading} className="inline-flex h-[34px] items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 text-xs font-bold text-white disabled:opacity-60">{request.isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}{request.isLoading ? 'Loading report...' : 'Generate report'}</button>
                    </div>
                    {formError && <p className="mt-2 text-xs font-medium text-rose-600">{formError}</p>}
                </form>
            </div>
            {request.isError && <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700"><span>{request.error ?? 'Unable to load the daily expense report.'}</span><button type="button" onClick={() => void generate()} className="inline-flex items-center gap-1.5 font-bold"><RefreshCw className="h-3.5 w-3.5" /> Retry</button></div>}
            <div className="daily-sales-summary grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[["Vouchers", String(expenses.length), 'text-slate-900 dark:text-white'], ["Total expense", money(total), 'text-rose-600 dark:text-rose-400'], ["Average expense", money(average), 'text-amber-600 dark:text-amber-400']].map(([label, value, color]) => <div key={label} className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800/60 dark:bg-[#080d1a]"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className={`mt-1.5 font-mono text-lg font-black ${color}`}>{value}</p></div>)}
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800/60 dark:bg-[#080d1a]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800/80"><div><h2 className="text-sm font-bold text-slate-900 dark:text-white">Expense register</h2><p className="mt-0.5 text-[11px] text-slate-500">Expense transactions for {rangeLabel}</p></div><div className="flex items-center gap-2 print-controls"><button type="button" onClick={() => window.print()} disabled={!appliedRange || request.isLoading} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 disabled:opacity-50"><Printer className="h-3.5 w-3.5" /> Print</button><button type="button" disabled={!expenses.length} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50"><Download className="h-3.5 w-3.5" /> Export CSV</button></div></div>
                {!appliedRange ? <div className="flex min-h-56 flex-col items-center justify-center text-center"><Search className="mb-3 h-5 w-5 text-emerald-600" /><h3 className="text-sm font-bold text-slate-800">Choose a date range</h3><p className="mt-1 text-xs text-slate-500">Generate the report to load expense data.</p></div> : expenses.length === 0 && !request.isLoading ? <div className="flex min-h-56 items-center justify-center text-xs text-slate-500">No expense records were found for this date range.</div> : <div className="overflow-x-auto"><table className="w-full min-w-[950px] text-left text-xs"><thead className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400"><tr><th className="px-5 py-3">SL</th><th className="px-4 py-3">Voucher &amp; Date</th><th className="px-4 py-3">Expense head</th><th className="px-4 py-3">Payment method</th><th className="px-4 py-3">Shop</th><th className="px-4 py-3">Remarks</th><th className="px-4 py-3 text-right">Amount</th><th className="px-4 py-3 text-center">Status</th></tr></thead><tbody className="divide-y divide-slate-100">{expenses.map((expense, index) => { const detail = expense.expenseDtls?.[0]; return <tr key={expense.id}><td className="px-5 py-3.5 font-mono text-slate-400">{index + 1}</td><td className="px-4 py-3.5"><p className="font-mono font-bold text-slate-900">{expense.expense_no}</p><p className="text-[10px] text-slate-400">{dateLabel(expense.expense_date)}</p></td><td className="px-4 py-3.5">Head {detail?.expense_head_id ?? '—'}</td><td className="px-4 py-3.5">Method {detail?.payment_method_id ?? '—'}</td><td className="px-4 py-3.5">Shop {expense.shop_id}</td><td className="px-4 py-3.5 text-slate-500">{expense.remarks ?? detail?.remarks ?? '—'}</td><td className="px-4 py-3.5 text-right font-mono font-black text-rose-600">{money(toNumber(expense.total_amount))}</td><td className="px-4 py-3.5 text-center"><span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">{Number(expense.status) === 1 ? 'Approved' : 'Pending'}</span></td></tr>; })}</tbody><tfoot className="border-t border-slate-200 bg-slate-50/95 font-bold"><tr><td colSpan={6} className="px-5 py-3 text-right">Report total</td><td className="px-4 py-3 text-right font-mono text-rose-600">{money(total)}</td><td /></tr></tfoot></table></div>}
            </div>
        </section>
    );
};
