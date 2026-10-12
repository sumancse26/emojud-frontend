import React, { useMemo, useState } from 'react';
import { CalendarDays, Download, LoaderCircle, Printer, RefreshCw, Search } from 'lucide-react';
import { useApp } from '@/app/providers/AppContext';
import { useApi } from '@/shared/hooks/useApi';
import { reportService } from '../services/reportService';
import type { ProductApiResponse, ProductItem, ProductListParams } from '@/app/modules/products/types/product.types';
import type { ProductLedgerItem, ProductLedgerReportParams, ProductLedgerReportResponse } from '../types/product-ledger-report.types';

const today = () => new Date().toISOString().slice(0, 10);
const toNumber = (value: string | number | undefined) => Number(value ?? 0);
const number = (value: number) => value.toLocaleString('en-BD', { maximumFractionDigits: 2 });
const money = (value: number) => `৳ ${value.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const dateLabel = (value: string) => new Date(value).toLocaleDateString('en-GB');

export const ProductLedgerReportPage: React.FC = () => {
    const { selectedBranch } = useApp();
    const [productId, setProductId] = useState('');
    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(today);
    const [applied, setApplied] = useState<ProductLedgerReportParams | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const productParams = useMemo<ProductListParams>(() => ({ shop_id: selectedBranch }), [selectedBranch]);
    const productsRequest = useApi<ProductApiResponse<ProductItem[]>, ProductListParams>(reportService.getProducts, {
        immediate: true,
        initialParams: productParams,
        suspense: false
    });
    const ledgerRequest = useApi<ProductLedgerReportResponse, ProductLedgerReportParams>(reportService.getProductLedger);
    const products = productsRequest.data?.data ?? [];
    const entries = useMemo<ProductLedgerItem[]>(() => ledgerRequest.data?.data ?? [], [ledgerRequest.data]);
    const selectedProduct = products.find((product) => String(product.id) === productId);
    const totals = useMemo(
        () => entries.reduce(
            (sum, item) => {
                const qty = toNumber(item.qty);
                const isOut = Number(item.transaction_type) !== 1;
                return {
                    movements: sum.movements + 1,
                    inQty: sum.inQty + (isOut ? 0 : qty),
                    outQty: sum.outQty + (isOut ? qty : 0),
                    value: sum.value + qty * toNumber(item.purchase_rate)
                };
            },
            { movements: 0, inQty: 0, outQty: 0, value: 0 }
        ),
        [entries]
    );
    const rangeLabel = applied ? `${dateLabel(applied.from_date)} – ${dateLabel(applied.to_date)}` : 'Select a product and date range';

    const generate = async (event?: React.FormEvent<HTMLFormElement>) => {
        event?.preventDefault();
        if (!productId) return setFormError('Please select a product.');
        if (!fromDate || !toDate) return setFormError('Please select both dates.');
        if (fromDate > toDate) return setFormError('Start date cannot be later than the end date.');
        const params = { product_id: productId, from_date: fromDate, to_date: toDate };
        setFormError(null);
        setApplied(params);
        await ledgerRequest.execute(params);
    };

    return (
        <section className="print-report-page daily-sales-report space-y-5">
            <div className="daily-sales-report-header rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800/60 dark:bg-[#080d1a] lg:p-6">
                <div className="report-letterhead"><div className="report-brand print-report-logo" aria-label="Emojud"><div className="report-brand-mark">E</div><div><div className="report-brand-name">Emojud</div><div className="report-brand-subtitle">Report</div></div></div></div>
                <div className="report-title-row"><h1>Product Item Movement Ledger</h1><p>{rangeLabel}</p></div>
                <form onSubmit={(event) => void generate(event)} className="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/40 print-controls">
                    <div className="flex min-w-[860px] flex-nowrap items-end gap-3">
                        <label className="block min-w-0 flex-[1.4] text-xs font-semibold text-slate-600 dark:text-slate-300">Product<span className="relative mt-1.5 block"><select value={productId} onChange={(event) => setProductId(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"><option value="">{productsRequest.isLoading ? 'Loading products...' : 'Select product'}</option>{products.map((product) => <option key={product.id} value={product.id}>{product.product_name} ({product.product_code})</option>)}</select></span></label>
                        <label className="block min-w-0 flex-1 text-xs font-semibold text-slate-600 dark:text-slate-300">From date<span className="relative mt-1.5 block"><CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pl-9 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200" /></span></label>
                        <label className="block min-w-0 flex-1 text-xs font-semibold text-slate-600 dark:text-slate-300">To date<span className="relative mt-1.5 block"><CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pl-9 text-xs dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200" /></span></label>
                        <button type="submit" disabled={ledgerRequest.isLoading || !products.length} className="inline-flex h-[34px] self-end items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 text-xs font-bold leading-none text-white disabled:opacity-60">{ledgerRequest.isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}{ledgerRequest.isLoading ? 'Loading report...' : 'Generate report'}</button>
                    </div>
                    {formError && <p className="mt-2 text-xs font-medium text-rose-600">{formError}</p>}
                    {productsRequest.isError && <p className="mt-2 text-xs font-medium text-rose-600">{productsRequest.error ?? 'Unable to load products.'}</p>}
                </form>
            </div>
            {ledgerRequest.isError && <div className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700"><span>{ledgerRequest.error ?? 'Unable to load the product ledger.'}</span><button type="button" onClick={() => void generate()} className="inline-flex items-center gap-1.5 font-bold"><RefreshCw className="h-3.5 w-3.5" /> Retry</button></div>}
            <div className="daily-sales-summary grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[["Movements", number(totals.movements), 'text-slate-900 dark:text-white'], ["In quantity", number(totals.inQty), 'text-emerald-600 dark:text-emerald-400'], ["Out quantity", number(totals.outQty), 'text-rose-600 dark:text-rose-400'], ["Purchase value", money(totals.value), 'text-blue-600 dark:text-blue-400']].map(([label, value, color]) => <div key={label} className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800/60 dark:bg-[#080d1a]"><p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p><p className={`mt-1.5 font-mono text-lg font-black ${color}`}>{value}</p></div>)}
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800/60 dark:bg-[#080d1a]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800/80"><div><h2 className="text-sm font-bold text-slate-900 dark:text-white">Product ledger</h2><p className="mt-0.5 text-[11px] text-slate-500">{selectedProduct?.product_name ?? 'Select a product'} · {rangeLabel}</p></div><div className="flex items-center gap-2 print-controls"><button type="button" onClick={() => window.print()} disabled={!applied || ledgerRequest.isLoading} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 disabled:opacity-50"><Printer className="h-3.5 w-3.5" /> Print</button><button type="button" disabled={!entries.length} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50"><Download className="h-3.5 w-3.5" /> Export CSV</button></div></div>
                {!applied ? <div className="flex min-h-56 flex-col items-center justify-center text-center"><Search className="mb-3 h-5 w-5 text-emerald-600" /><h3 className="text-sm font-bold text-slate-800">Choose a product and date range</h3><p className="mt-1 text-xs text-slate-500">Generate the report to load product movement data.</p></div> : entries.length === 0 && !ledgerRequest.isLoading ? <div className="flex min-h-56 items-center justify-center text-xs text-slate-500">No ledger records were found for this selection.</div> : <div className="overflow-x-auto"><table className="w-full min-w-[980px] text-left text-xs"><thead className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400"><tr><th className="px-5 py-3">SL</th><th className="px-4 py-3">Transaction date</th><th className="px-4 py-3">Reference</th><th className="px-4 py-3 text-center">Movement</th><th className="px-4 py-3 text-right">Quantity</th><th className="px-4 py-3 text-right">Purchase rate</th><th className="px-4 py-3 text-right">Retail rate</th><th className="px-4 py-3 text-right">Sales rate</th><th className="px-4 py-3">Warehouse / Lot</th></tr></thead><tbody className="divide-y divide-slate-100">{entries.map((item, index) => { const isIn = Number(item.transaction_type) === 1; return <tr key={item.id}><td className="px-5 py-3.5 font-mono text-slate-400">{index + 1}</td><td className="px-4 py-3.5 text-slate-600">{dateLabel(item.trn_date)}</td><td className="px-4 py-3.5"><p className="font-mono font-bold text-slate-900">{item.ref_no ?? `REF-${item.ref_id}`}</p><p className="text-[10px] text-slate-400">Ref ID: {item.ref_id}</p></td><td className="px-4 py-3.5 text-center"><span className={`inline-flex rounded-full px-2 py-1 text-[10px] font-bold ${isIn ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{isIn ? 'Stock in' : 'Stock out'}</span></td><td className={`px-4 py-3.5 text-right font-mono font-bold ${isIn ? 'text-emerald-600' : 'text-rose-600'}`}>{isIn ? '+' : '-'}{number(toNumber(item.qty))}</td><td className="px-4 py-3.5 text-right font-mono">{money(toNumber(item.purchase_rate))}</td><td className="px-4 py-3.5 text-right font-mono">{money(toNumber(item.retail_rate))}</td><td className="px-4 py-3.5 text-right font-mono">{money(toNumber(item.sales_rate))}</td><td className="px-4 py-3.5 text-slate-500">WH {item.warehouse_id} / Lot {item.lot_id}</td></tr>; })}</tbody></table></div>}
            </div>
        </section>
    );
};
