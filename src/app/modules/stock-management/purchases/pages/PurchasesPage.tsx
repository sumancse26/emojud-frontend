import React, { useCallback, useState } from 'react'
import { Calendar, FileText, Package, Printer, RefreshCw, User } from 'lucide-react'
import { PageHeader, SliderDrawer, Skeleton, FormField, inputClasses } from '@/shared'
import { useApp } from '@/app/providers'
import { tokenStorage } from '@/shared/services/tokenStorage'
import { usePurchase } from '../hooks/usePurchase'
import { PurchasesPresenter } from './presenters/PurchasesPresenter'
import type { CreatePurchasePayload, PurchaseItem } from '../types/purchase.types'
import type { User as AuthUser } from '@/app/modules/auth/types/auth.types'

interface PurchaseFormState {
  supplierId: number
  warehouseId: number
  purchaseDate: string
  challanNo: string
  challanDate: string
  productId: number
  qty: number
  purchaseRate: number
  retailRate: number
  salesRate: number
  discountAmount: number
  vatAmount: number
  paidAmount: number
}

const initialFormState = (): PurchaseFormState => ({
  supplierId: 1, warehouseId: 1, purchaseDate: new Date().toISOString().slice(0, 10), challanNo: '',
  challanDate: new Date().toISOString().slice(0, 10), productId: 1, qty: 1, purchaseRate: 0,
  retailRate: 0, salesRate: 0, discountAmount: 0, vatAmount: 0, paidAmount: 0,
})

export const PurchasesPage: React.FC = () => {
  const { selectedBranch } = useApp()
  const { purchases, isLoading, isError, error, refetch, getPurchaseDetails, refetchPurchaseDetails, isDetailLoading, detailError, createPurchase, isCreating, createError } = usePurchase(selectedBranch)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseItem | null>(null)
  const [formState, setFormState] = useState<PurchaseFormState>(initialFormState)

  const viewPurchase = useCallback(async (purchase: PurchaseItem) => {
    setSelectedPurchase(purchase); setIsDetailOpen(true)
    try { setSelectedPurchase(await getPurchaseDetails(purchase)) } catch { /* detailError renders the failure */ }
  }, [getPurchaseDetails])

  const refreshPurchaseDetails = useCallback(async () => {
    if (!selectedPurchase) return
    try { setSelectedPurchase(await refetchPurchaseDetails(selectedPurchase)) } catch { /* detailError renders the failure */ }
  }, [refetchPurchaseDetails, selectedPurchase])

  const submitPurchase = useCallback(async (event: React.FormEvent) => {
    event.preventDefault()
    const totalAmount = formState.qty * formState.purchaseRate
    const netAmount = totalAmount - formState.discountAmount + formState.vatAmount
    const payload: CreatePurchasePayload = {
      id: null, shop_id: Number(selectedBranch), warehouse_id: formState.warehouseId, supplier_id: formState.supplierId,
      purchase_date: formState.purchaseDate, challan_no: formState.challanNo, challan_date: formState.challanDate,
      total_amount: totalAmount, discount_amount: formState.discountAmount, vat_amount: formState.vatAmount,
      net_amount: netAmount, paid_amount: formState.paidAmount, due_amount: Math.max(0, netAmount - formState.paidAmount),
      is_submit: 1, is_confirm: 1, user_id: Number(tokenStorage.getUser<AuthUser>()?.id ?? 1),
      products: [{ id: null, product_id: formState.productId, qty: formState.qty, purchase_rate: formState.purchaseRate, retail_rate: formState.retailRate, sales_rate: formState.salesRate, total_amount: totalAmount }],
    }
    try { await createPurchase(payload); setIsCreateOpen(false) } catch { /* createError renders the failure */ }
  }, [createPurchase, formState, selectedBranch])

  return <>
    <PurchasesPresenter purchases={purchases} isLoading={isLoading} isError={isError} error={error} createError={createError} onOpenCreate={() => { setFormState(initialFormState()); setIsCreateOpen(true) }} onRefetch={() => void refetch()} onViewPurchase={viewPurchase} onPrintPurchase={viewPurchase} />

    <SliderDrawer isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} width="max-w-xl">
      <SliderDrawer.Header onClose={() => setIsCreateOpen(false)}><div className="flex items-center gap-2.5"><div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-slate-950"><Package className="h-4 w-4" /></div><div><h2 className="text-sm font-bold text-slate-900 dark:text-white">Create Purchase</h2><p className="text-[10px] text-slate-400">Record supplier stock receiving and payment details</p></div></div></SliderDrawer.Header>
      <SliderDrawer.Body><form id="purchase-form" onSubmit={submitPurchase} className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3"><FormField label="Supplier ID" required><input type="number" min="1" value={formState.supplierId} onChange={(e) => setFormState((s) => ({ ...s, supplierId: Number(e.target.value) }))} className={inputClasses} required /></FormField><FormField label="Warehouse ID" required><input type="number" min="1" value={formState.warehouseId} onChange={(e) => setFormState((s) => ({ ...s, warehouseId: Number(e.target.value) }))} className={inputClasses} required /></FormField></div>
        <div className="grid grid-cols-2 gap-3"><FormField label="Purchase Date" required><input type="date" value={formState.purchaseDate} onChange={(e) => setFormState((s) => ({ ...s, purchaseDate: e.target.value }))} className={inputClasses} required /></FormField><FormField label="Challan Date" required><input type="date" value={formState.challanDate} onChange={(e) => setFormState((s) => ({ ...s, challanDate: e.target.value }))} className={inputClasses} required /></FormField></div>
        <FormField label="Challan No"><input value={formState.challanNo} onChange={(e) => setFormState((s) => ({ ...s, challanNo: e.target.value }))} className={inputClasses} placeholder="CH-1001" /></FormField>
        <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800"><p className="mb-3 font-bold text-slate-800 dark:text-slate-200">Product line</p><div className="grid grid-cols-2 gap-3"><FormField label="Product ID" required><input type="number" min="1" value={formState.productId} onChange={(e) => setFormState((s) => ({ ...s, productId: Number(e.target.value) }))} className={inputClasses} required /></FormField><FormField label="Quantity" required><input type="number" min="1" value={formState.qty} onChange={(e) => setFormState((s) => ({ ...s, qty: Number(e.target.value) }))} className={inputClasses} required /></FormField><FormField label="Purchase Rate" required><input type="number" min="0" value={formState.purchaseRate} onChange={(e) => setFormState((s) => ({ ...s, purchaseRate: Number(e.target.value) }))} className={inputClasses} required /></FormField><FormField label="Retail Rate"><input type="number" min="0" value={formState.retailRate} onChange={(e) => setFormState((s) => ({ ...s, retailRate: Number(e.target.value) }))} className={inputClasses} /></FormField><FormField label="Sales Rate"><input type="number" min="0" value={formState.salesRate} onChange={(e) => setFormState((s) => ({ ...s, salesRate: Number(e.target.value) }))} className={inputClasses} /></FormField></div></div>
        <div className="grid grid-cols-3 gap-3"><FormField label="Discount"><input type="number" min="0" value={formState.discountAmount} onChange={(e) => setFormState((s) => ({ ...s, discountAmount: Number(e.target.value) }))} className={inputClasses} /></FormField><FormField label="VAT"><input type="number" min="0" value={formState.vatAmount} onChange={(e) => setFormState((s) => ({ ...s, vatAmount: Number(e.target.value) }))} className={inputClasses} /></FormField><FormField label="Paid Amount"><input type="number" min="0" value={formState.paidAmount} onChange={(e) => setFormState((s) => ({ ...s, paidAmount: Number(e.target.value) }))} className={inputClasses} /></FormField></div>
      </form></SliderDrawer.Body>
      <SliderDrawer.Footer><div className="flex justify-end gap-2"><button type="button" onClick={() => setIsCreateOpen(false)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold dark:border-slate-700">Cancel</button><button form="purchase-form" type="submit" disabled={isCreating} className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50">{isCreating ? 'Saving...' : 'Save Purchase'}</button></div></SliderDrawer.Footer>
    </SliderDrawer>

    <SliderDrawer isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} width="max-w-2xl">
      <SliderDrawer.Header onClose={() => setIsDetailOpen(false)} className="items-start"><PageHeader variant="flat" withAccent={false} className="min-w-0 flex-1 py-0"><PageHeader.Header title={<span className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-slate-950"><FileText className="h-4 w-4" /></span><span>Purchase Details</span></span>} description={selectedPurchase?.purchaseNumber ?? 'Purchase information'} actions={<button type="button" onClick={() => void refreshPurchaseDetails()} disabled={!selectedPurchase || isDetailLoading} title="Refresh purchase details" className="rounded-xl bg-slate-100 p-2 text-slate-600 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300"><RefreshCw className={`h-4 w-4 ${isDetailLoading ? 'animate-spin' : ''}`} /></button>} /><PageHeader.Bottom><div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500"><span>Supplier: <strong className="text-slate-700 dark:text-slate-200">{selectedPurchase?.supplierName ?? 'Loading...'}</strong></span><span>Date: <strong className="text-slate-700 dark:text-slate-200">{selectedPurchase?.purchaseDate ?? '—'}</strong></span></div></PageHeader.Bottom></PageHeader></SliderDrawer.Header>
      <SliderDrawer.Body>{isDetailLoading && <Skeleton.Table rows={4} columns={4} />}{detailError && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">{detailError}</div>}{selectedPurchase && <div className="space-y-5 text-xs"><div className="grid grid-cols-2 gap-3"><div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800"><User className="mb-2 h-4 w-4 text-emerald-500" /><p className="font-bold text-slate-900 dark:text-white">{selectedPurchase.supplierName}</p><p className="text-slate-400">Supplier account</p></div><div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800"><Calendar className="mb-2 h-4 w-4 text-emerald-500" /><p className="font-bold text-slate-900 dark:text-white">{selectedPurchase.purchaseDate}</p><p className="text-slate-400">Purchase date</p></div></div><div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800"><table className="w-full text-left text-xs"><thead className="bg-slate-50 dark:bg-slate-900/60"><tr><th className="p-3">Product</th><th className="p-3 text-center">Qty</th><th className="p-3 text-right">Rate</th><th className="p-3 text-right">Total</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800">{selectedPurchase.products?.map((product) => <tr key={product.id}><td className="p-3"><p className="font-semibold">{product.product_name}</p><span className="text-[10px] text-slate-400">{product.product_code}</span></td><td className="p-3 text-center">{product.qty}</td><td className="p-3 text-right">৳ {formatNumber(product.purchase_rate)}</td><td className="p-3 text-right font-bold">৳ {formatNumber(product.total_amount)}</td></tr>)}</tbody></table></div><div className="space-y-2 rounded-xl bg-slate-50 p-4 dark:bg-slate-900/50"><div className="flex justify-between"><span>Net amount</span><strong>৳ {formatNumber(selectedPurchase.netAmount)}</strong></div><div className="flex justify-between text-emerald-600"><span>Paid amount</span><strong>৳ {formatNumber(selectedPurchase.paidAmount)}</strong></div><div className="flex justify-between text-rose-500"><span>Due amount</span><strong>৳ {formatNumber(selectedPurchase.dueAmount)}</strong></div></div></div>}</SliderDrawer.Body>
      <SliderDrawer.Footer><div className="flex justify-end"><button type="button" onClick={() => window.print()} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white"><Printer className="h-4 w-4" />Print Purchase</button></div></SliderDrawer.Footer>
    </SliderDrawer>
  </>
}

const formatNumber = (value: string | number | undefined) => Number(value ?? 0).toLocaleString('en-BD', { minimumFractionDigits: 2 })
