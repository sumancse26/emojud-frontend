import React, { useCallback, useState } from 'react';
import { FileText, Package, Printer, RefreshCw, Truck } from 'lucide-react';
import { PageHeader, SliderDrawer, Skeleton } from '@/shared';
import { useApp } from '@/app/providers';
import { useStock } from '../hooks/useStock';
import { StockSummaryPresenter } from './presenters/StockSummaryPresenter';
import type { StockItem } from '../types/stock.types';

export const StockSummaryPage: React.FC = () => {
    const { selectedBranch } = useApp();
    const {
        stocks,
        isLoading,
        isError,
        error,
        refetch,
        getStockDetails,
        refetchStockDetails,
        detail,
        isDetailLoading,
        detailError
    } = useStock(selectedBranch);
    const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const viewStock = useCallback(
        async (stock: StockItem) => {
            setSelectedStock(stock);
            setIsDetailOpen(true);
            try {
                await getStockDetails(stock);
            } catch {
                /* detailError renders the failure */
            }
        },
        [getStockDetails]
    );

    const refreshDetails = useCallback(async () => {
        if (!selectedStock) return;
        try {
            await refetchStockDetails(selectedStock);
        } catch {
            /* detailError renders the failure */
        }
    }, [refetchStockDetails, selectedStock]);

    return (
        <>
            <StockSummaryPresenter
                stocks={stocks}
                isLoading={isLoading}
                isError={isError}
                error={error}
                onRefetch={() => void refetch()}
                onViewStock={viewStock}
            />
            <SliderDrawer isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} width="max-w-xl">
                <SliderDrawer.Header onClose={() => setIsDetailOpen(false)} className="items-start">
                    <PageHeader variant="flat" withAccent={false} className="min-w-0 flex-1 py-0">
                        <PageHeader.Header
                            title={
                                <span className="flex items-center gap-2">
                                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-slate-950">
                                        <Package className="h-4 w-4" />
                                    </span>
                                    <span>Stock Details</span>
                                </span>
                            }
                            description={selectedStock?.productCode ?? 'Stock information'}
                            actions={
                                <button
                                    type="button"
                                    onClick={() => void refreshDetails()}
                                    disabled={!selectedStock || isDetailLoading}
                                    title="Refresh stock details"
                                    className="rounded-xl bg-slate-100 p-2 text-slate-600 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300">
                                    <RefreshCw className={`h-4 w-4 ${isDetailLoading ? 'animate-spin' : ''}`} />
                                </button>
                            }
                        />
                        <PageHeader.Bottom>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
                                <span>
                                    Product:{' '}
                                    <strong className="text-slate-700 dark:text-slate-200">
                                        {selectedStock?.productName ?? 'Loading...'}
                                    </strong>
                                </span>
                                <span>
                                    Stock:{' '}
                                    <strong className="text-slate-700 dark:text-slate-200">
                                        {selectedStock?.currentStock ?? 0} {selectedStock?.unit ?? ''}
                                    </strong>
                                </span>
                            </div>
                        </PageHeader.Bottom>
                    </PageHeader>
                </SliderDrawer.Header>
                <SliderDrawer.Body>
                    {isDetailLoading && <Skeleton.Table rows={4} columns={4} />}
                    {detailError && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
                            {detailError}
                        </div>
                    )}
                    {selectedStock && (
                        <div className="space-y-5 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                                    <FileText className="mb-2 h-4 w-4 text-emerald-500" />
                                    <p className="font-bold text-slate-900 dark:text-white">
                                        {selectedStock.productName}
                                    </p>
                                    <p className="text-slate-400">{selectedStock.productCode}</p>
                                </div>
                                <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                                    <Truck className="mb-2 h-4 w-4 text-emerald-500" />
                                    <p className="font-bold text-slate-900 dark:text-white">
                                        {selectedStock.currentStock} {selectedStock.unit}
                                    </p>
                                    <p className="text-slate-400">Available quantity</p>
                                </div>
                            </div>
                            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 dark:bg-slate-900/60">
                                        <tr>
                                            <th className="p-3">Lot Number</th>
                                            <th className="p-3">Purchase Reference</th>
                                            <th className="p-3">Supplier</th>
                                            <th className="p-3 text-right">Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {detail.map((row) => (
                                            <tr key={row.id}>
                                                <td className="p-3 font-mono text-[10px]">{row.lot_no}</td>
                                                <td className="p-3 font-semibold text-emerald-600">{row.pr_no}</td>
                                                <td className="p-3">{row.supplier_name}</td>
                                                <td className="p-3 text-right font-bold">{row.qty}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </SliderDrawer.Body>
                <SliderDrawer.Footer>
                    <div className="flex justify-start">
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white">
                            <Printer className="h-4 w-4" />
                            Print Stock Details
                        </button>
                    </div>
                </SliderDrawer.Footer>
            </SliderDrawer>
        </>
    );
};
