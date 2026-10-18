import React, { useCallback, useMemo, useState } from 'react'
import { Calendar, Edit3, FileText, Package, Plus, Printer, RefreshCw, Trash2, User } from 'lucide-react'
import { Dropdown, FormField, inputClasses, PageHeader, Skeleton, SliderDrawer, type DropdownOption } from '@/shared'
import { useApp } from '@/app/providers'
import { tokenStorage } from '@/shared/services/tokenStorage'
import { useToast } from '@/shared/components/Toast'
import { usePurchase } from '../hooks/usePurchase'
import { PurchasesPresenter } from './presenters/PurchasesPresenter'
import type { CreatePurchasePayload, PurchaseItem, PurchaseProductPayload } from '../types/purchase.types'
import type { User as AuthUser } from '@/app/modules/auth/types/auth.types'

interface PurchaseFormState {
  supplierId: string
  warehouseId: string
  purchaseDate: string
  challanNo: string
  challanDate: string
  discountAmount: number
  vatAmount: number
  paidAmount: number
}

interface PurchaseLineItem {
  id: string
  productId: string
  productName: string
  productCode: string
  unitId?: string
  unitName?: string
  qty: number
  purchaseRate: number
  retailRate: number
  salesRate: number
  totalAmount: number
}

interface ActiveProductLine {
  productId: string
  unitId: string
  qty: number
  purchaseRate: number
  retailRate: number
  salesRate: number
}

const initialFormState = (): PurchaseFormState => ({
  supplierId: '',
  warehouseId: '',
  purchaseDate: new Date().toISOString().slice(0, 10),
  challanNo: '',
  challanDate: new Date().toISOString().slice(0, 10),
  discountAmount: 0,
  vatAmount: 0,
  paidAmount: 0,
})

const initialActiveLine = (): ActiveProductLine => ({
  productId: '',
  unitId: '',
  qty: 1,
  purchaseRate: 0,
  retailRate: 0,
  salesRate: 0,
})

export const PurchasesPage: React.FC = () => {
  const { selectedBranch } = useApp()
  const toast = useToast()
  const {
    purchases,
    isLoading,
    isError,
    error,
    refetch,
    getPurchaseDetails,
    refetchPurchaseDetails,
    isDetailLoading,
    detailError,
    createPurchase,
    isCreating,
    createError,
    updatePurchase,
    isUpdating,
    updateError,
    warehouses,
    suppliers,
    products,
    quantityUnits,
    isLoadingMasters,
    mastersError,
    fetchMasters,
  } = usePurchase(selectedBranch)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseItem | null>(null)
  const [editingPurchase, setEditingPurchase] = useState<PurchaseItem | null>(null)

  const [formState, setFormState] = useState<PurchaseFormState>(initialFormState)
  const [cartItems, setCartItems] = useState<PurchaseLineItem[]>([])
  const [activeLine, setActiveLine] = useState<ActiveProductLine>(initialActiveLine)

  // ─── Dropdown Options ───────────────────────────────────────────────
  const warehouseOptions = useMemo<DropdownOption[]>(
    () =>
      warehouses.map((w) => ({
        value: String(w.id),
        label: w.warehouse_name,
        subLabel: [w.display_code ? `Code: ${w.display_code}` : '', w.address ? String(w.address) : '']
          .filter(Boolean)
          .join(' · ') || `ID: ${w.id}`,
      })),
    [warehouses]
  )

  const supplierOptions = useMemo<DropdownOption[]>(
    () =>
      suppliers.map((s) => ({
        value: String(s.id),
        label: s.supplier_name,
        subLabel: [s.supplier_code, s.phone, Number(s.previous_due) > 0 ? `Due ৳ ${Number(s.previous_due).toLocaleString('en-BD')}` : '']
          .filter(Boolean)
          .join(' · ') || (s.supplier_code ? `Code: ${s.supplier_code}` : `ID: ${s.id}`),
      })),
    [suppliers]
  )

  const productOptions = useMemo<DropdownOption[]>(
    () =>
      products.map((p) => ({
        value: String(p.id),
        label: p.product_name,
        subLabel: `${p.product_code} · Buy: ৳ ${Number(p.purchase_rate).toLocaleString('en-BD')}`,
      })),
    [products]
  )

  const quantityUnitOptions = useMemo<DropdownOption[]>(
    () =>
      quantityUnits.map((u) => ({
        value: String(u.id),
        label: u.lookup_value,
        subLabel: u.lookup_code,
      })),
    [quantityUnits]
  )

  // Open Create Drawer
  const handleOpenCreate = useCallback(() => {
    setEditingPurchase(null)
    setFormState(initialFormState())
    setCartItems([])
    setActiveLine(initialActiveLine())
    setIsCreateOpen(true)
    void fetchMasters()
  }, [fetchMasters])

  // Open Edit Drawer
  const handleEditPurchase = useCallback(
    async (purchase: PurchaseItem) => {
      setEditingPurchase(purchase)
      void fetchMasters()

      setFormState({
        supplierId: purchase.supplierId ? String(purchase.supplierId) : '',
        warehouseId: purchase.warehouseId ? String(purchase.warehouseId) : '',
        purchaseDate: purchase.rawPurchaseDate ? purchase.rawPurchaseDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
        challanNo: purchase.challanNo ?? '',
        challanDate: purchase.rawChallanDate ? purchase.rawChallanDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
        discountAmount: purchase.discountAmount ?? 0,
        vatAmount: purchase.vatAmount ?? 0,
        paidAmount: purchase.paidAmount ?? 0,
      })

      if (purchase.products && purchase.products.length > 0) {
        setCartItems(
          purchase.products.map((p) => {
            const unit = quantityUnits.find((u) => String(u.id) === String(p.unit_id))
            return {
              id: String(p.id ?? crypto.randomUUID()),
              productId: String(p.product_id),
              productName: p.product_name,
              productCode: p.product_code,
              unitId: p.unit_id ? String(p.unit_id) : undefined,
              unitName: unit?.lookup_value,
              qty: Number(p.qty),
              purchaseRate: Number(p.purchase_rate),
              retailRate: Number(p.retail_rate),
              salesRate: Number(p.sales_rate),
              totalAmount: Number(p.total_amount),
            }
          })
        )
      } else {
        setCartItems([])
      }
      setActiveLine(initialActiveLine())
      setIsCreateOpen(true)

      try {
        const detailed = await getPurchaseDetails(purchase)
        setFormState({
          supplierId: detailed.supplierId ? String(detailed.supplierId) : '',
          warehouseId: detailed.warehouseId ? String(detailed.warehouseId) : '',
          purchaseDate: detailed.rawPurchaseDate ? detailed.rawPurchaseDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
          challanNo: detailed.challanNo ?? '',
          challanDate: detailed.rawChallanDate ? detailed.rawChallanDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
          discountAmount: detailed.discountAmount ?? 0,
          vatAmount: detailed.vatAmount ?? 0,
          paidAmount: detailed.paidAmount ?? 0,
        })
        if (detailed.products && detailed.products.length > 0) {
          setCartItems(
            detailed.products.map((p) => {
              const unit = quantityUnits.find((u) => String(u.id) === String(p.unit_id))
              return {
                id: String(p.id ?? crypto.randomUUID()),
                productId: String(p.product_id),
                productName: p.product_name,
                productCode: p.product_code,
                unitId: p.unit_id ? String(p.unit_id) : undefined,
                unitName: unit?.lookup_value,
                qty: Number(p.qty),
                purchaseRate: Number(p.purchase_rate),
                retailRate: Number(p.retail_rate),
                salesRate: Number(p.sales_rate),
                totalAmount: Number(p.total_amount),
              }
            })
          )
        }
      } catch {
        /* retain pre-populated fields from purchase */
      }
    },
    [fetchMasters, getPurchaseDetails, quantityUnits]
  )

  // Select Product Handler
  const handleSelectProduct = useCallback((productId: string) => {
    const prod = products.find((p) => String(p.id) === productId)
    if (!prod) {
      setActiveLine((prev) => ({ ...prev, productId: '' }))
      return
    }
    setActiveLine((prev) => ({
      ...prev,
      productId,
      purchaseRate: Number(prod.purchase_rate) || 0,
      retailRate: Number(prod.retail_rate) || 0,
      salesRate: Number(prod.sales_rate) || 0,
      unitId: prod.units?.id ? String(prod.units.id) : prev.unitId,
      qty: prev.qty > 0 ? prev.qty : 1,
    }))
  }, [products])

  // Add Product to Cart List
  const handleAddProductLine = useCallback(() => {
    if (!activeLine.productId) {
      toast.error('Please select a product first.')
      return
    }
    const prod = products.find((p) => String(p.id) === activeLine.productId)
    if (!prod) return
    const unit = quantityUnits.find((u) => String(u.id) === activeLine.unitId)

    const newItem: PurchaseLineItem = {
      id: `${activeLine.productId}-${Date.now()}`,
      productId: activeLine.productId,
      productName: prod.product_name,
      productCode: prod.product_code,
      unitId: activeLine.unitId || undefined,
      unitName: unit?.lookup_value || unit?.lookup_code,
      qty: activeLine.qty,
      purchaseRate: activeLine.purchaseRate,
      retailRate: activeLine.retailRate,
      salesRate: activeLine.salesRate,
      totalAmount: activeLine.qty * activeLine.purchaseRate,
    }

    setCartItems((prev) => [...prev, newItem])
    setActiveLine(initialActiveLine())
  }, [activeLine, products, quantityUnits, toast])

  // Remove Product Line
  const handleRemoveProductLine = useCallback((itemId: string) => {
    setCartItems((prev) => prev.filter((it) => it.id !== itemId))
  }, [])

  // Calculations
  const grossTotal = useMemo(() => {
    const itemsSum = cartItems.reduce((acc, it) => acc + it.totalAmount, 0)
    if (cartItems.length > 0) return itemsSum
    return activeLine.productId ? activeLine.qty * activeLine.purchaseRate : 0
  }, [cartItems, activeLine])

  const netAmount = useMemo(
    () => Math.max(0, grossTotal - formState.discountAmount + formState.vatAmount),
    [grossTotal, formState.discountAmount, formState.vatAmount]
  )

  const dueAmount = useMemo(
    () => Math.max(0, netAmount - formState.paidAmount),
    [netAmount, formState.paidAmount]
  )

  const viewPurchase = useCallback(async (purchase: PurchaseItem) => {
    setSelectedPurchase(purchase)
    setIsDetailOpen(true)
    try {
      setSelectedPurchase(await getPurchaseDetails(purchase))
    } catch {
      /* detailError renders the failure */
    }
  }, [getPurchaseDetails])

  const refreshPurchaseDetails = useCallback(async () => {
    if (!selectedPurchase) return
    try {
      setSelectedPurchase(await refetchPurchaseDetails(selectedPurchase))
    } catch {
      /* detailError renders the failure */
    }
  }, [refetchPurchaseDetails, selectedPurchase])

  // Submit Purchase
  const submitPurchase = useCallback(async (event: React.FormEvent) => {
    event.preventDefault()

    if (!formState.warehouseId) {
      toast.error('Please select a warehouse.')
      return
    }
    if (!formState.supplierId) {
      toast.error('Please select a supplier.')
      return
    }

    // Determine product lines to submit
    let productsToSubmit: PurchaseProductPayload[] = []
    if (cartItems.length > 0) {
      productsToSubmit = cartItems.map((it) => ({
        id: null,
        product_id: Number(it.productId),
        qty: it.qty,
        purchase_rate: it.purchaseRate,
        retail_rate: it.retailRate,
        sales_rate: it.salesRate,
        total_amount: it.totalAmount,
        unit_id: it.unitId ? Number(it.unitId) : null,
      }))
    } else if (activeLine.productId) {
      productsToSubmit = [{
        id: null,
        product_id: Number(activeLine.productId),
        qty: activeLine.qty,
        purchase_rate: activeLine.purchaseRate,
        retail_rate: activeLine.retailRate,
        sales_rate: activeLine.salesRate,
        total_amount: activeLine.qty * activeLine.purchaseRate,
        unit_id: activeLine.unitId ? Number(activeLine.unitId) : null,
      }]
    }

    if (productsToSubmit.length === 0) {
      toast.error('Please select and add at least one product.')
      return
    }

    const payload: CreatePurchasePayload = {
      id: editingPurchase ? Number(editingPurchase.id) : null,
      shop_id: Number(selectedBranch),
      warehouse_id: Number(formState.warehouseId),
      supplier_id: Number(formState.supplierId),
      purchase_date: formState.purchaseDate,
      challan_no: formState.challanNo,
      challan_date: formState.challanDate,
      total_amount: grossTotal,
      discount_amount: formState.discountAmount,
      vat_amount: formState.vatAmount,
      net_amount: netAmount,
      paid_amount: formState.paidAmount,
      due_amount: dueAmount,
      is_submit: 1,
      is_confirm: 1,
      user_id: Number(tokenStorage.getUser<AuthUser>()?.id ?? 1),
      products: productsToSubmit,
    }

    try {
      if (editingPurchase) {
        await updatePurchase(payload)
        setIsCreateOpen(false)
        setEditingPurchase(null)
        toast.success(`Purchase ${editingPurchase.purchaseNumber} updated successfully!`)
      } else {
        await createPurchase(payload)
        setIsCreateOpen(false)
        toast.success('Purchase created successfully!')
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : (editingPurchase ? 'Failed to update purchase' : 'Failed to create purchase')
      toast.error(msg)
    }
  }, [
    formState,
    cartItems,
    activeLine,
    selectedBranch,
    grossTotal,
    netAmount,
    dueAmount,
    editingPurchase,
    updatePurchase,
    createPurchase,
    toast,
  ])

  return (
    <>
      <PurchasesPresenter
        purchases={purchases}
        isLoading={isLoading}
        isError={isError}
        error={error}
        createError={createError || updateError}
        onOpenCreate={handleOpenCreate}
        onRefetch={() => void refetch()}
        onViewPurchase={viewPurchase}
        onPrintPurchase={viewPurchase}
        onEditPurchase={handleEditPurchase}
      />

      {/* ─── Create / Edit Purchase Drawer ─────────────────────────────────── */}
      <SliderDrawer
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false)
          setEditingPurchase(null)
        }}
        width="max-w-2xl"
      >
        <SliderDrawer.Header
          onClose={() => {
            setIsCreateOpen(false)
            setEditingPurchase(null)
          }}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-slate-950">
              <Package className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {editingPurchase ? `Edit Purchase — ${editingPurchase.purchaseNumber}` : 'Create Purchase'}
              </h2>
              <p className="text-[10px] text-slate-400">
                {editingPurchase ? 'Modify stock quantities, rates, supplier, and challan details' : 'Record supplier stock receiving and payment details'}
              </p>
            </div>
          </div>
        </SliderDrawer.Header>

        <SliderDrawer.Body>
          <form id="purchase-form" onSubmit={submitPurchase} className="space-y-4 text-xs">
            {mastersError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
                {mastersError}
              </div>
            )}

            {/* Warehouse & Supplier Searchable Dropdowns */}
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Warehouse" required>
                <Dropdown
                  options={warehouseOptions}
                  value={formState.warehouseId}
                  onChange={(val) => setFormState((s) => ({ ...s, warehouseId: val }))}
                  placeholder="Select warehouse..."
                  isLoading={isLoadingMasters}
                  searchable={5}
                  searchPlaceholder="Search warehouse..."
                  showCount
                  required
                />
              </FormField>
              <FormField label="Supplier" required>
                <Dropdown
                  options={supplierOptions}
                  value={formState.supplierId}
                  onChange={(val) => setFormState((s) => ({ ...s, supplierId: val }))}
                  placeholder="Select supplier..."
                  isLoading={isLoadingMasters}
                  searchable={5}
                  searchPlaceholder="Search supplier..."
                  showCount
                  required
                />
              </FormField>
            </div>

            {/* Dates & Challan */}
            <div className="grid grid-cols-3 gap-3">
              <FormField label="Purchase Date" required>
                <input
                  type="date"
                  value={formState.purchaseDate}
                  onChange={(e) => setFormState((s) => ({ ...s, purchaseDate: e.target.value }))}
                  className={inputClasses}
                  required
                />
              </FormField>
              <FormField label="Challan Date" required>
                <input
                  type="date"
                  value={formState.challanDate}
                  onChange={(e) => setFormState((s) => ({ ...s, challanDate: e.target.value }))}
                  className={inputClasses}
                  required
                />
              </FormField>
              <FormField label="Challan No">
                <input
                  value={formState.challanNo}
                  onChange={(e) => setFormState((s) => ({ ...s, challanNo: e.target.value }))}
                  className={inputClasses}
                  placeholder="e.g. CH-1001"
                />
              </FormField>
            </div>

            {/* Product Line Selection Section */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-900/30">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200">Product Selection</span>
                {cartItems.length > 0 && (
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in order
                  </span>
                )}
              </div>

              {/* Product and Quantity/Unit Searchable Dropdowns */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <FormField label="Product" required>
                  <Dropdown
                    options={productOptions}
                    value={activeLine.productId}
                    onChange={handleSelectProduct}
                    placeholder="Select product..."
                    isLoading={isLoadingMasters}
                    searchable={5}
                    searchPlaceholder="Search product name or code..."
                    showCount
                  />
                </FormField>
                <FormField label="Unit / Quantity Type">
                  <Dropdown
                    options={quantityUnitOptions}
                    value={activeLine.unitId}
                    onChange={(val) => setActiveLine((prev) => ({ ...prev, unitId: val }))}
                    placeholder="Select unit..."
                    isLoading={isLoadingMasters}
                    searchable={5}
                    searchPlaceholder="Search unit..."
                  />
                </FormField>
              </div>

              {/* Quantity and Rates */}
              <div className="grid grid-cols-4 gap-2.5">
                <FormField label="Quantity" required>
                  <input
                    type="number"
                    min="1"
                    value={activeLine.qty}
                    onChange={(e) => setActiveLine((s) => ({ ...s, qty: Math.max(1, Number(e.target.value)) }))}
                    className={inputClasses}
                  />
                </FormField>
                <FormField label="Buy Rate (৳)" required>
                  <input
                    type="number"
                    min="0"
                    value={activeLine.purchaseRate}
                    onChange={(e) => setActiveLine((s) => ({ ...s, purchaseRate: Number(e.target.value) }))}
                    className={inputClasses}
                  />
                </FormField>
                <FormField label="Retail Rate (৳)">
                  <input
                    type="number"
                    min="0"
                    value={activeLine.retailRate}
                    onChange={(e) => setActiveLine((s) => ({ ...s, retailRate: Number(e.target.value) }))}
                    className={inputClasses}
                  />
                </FormField>
                <FormField label="Sales Rate (৳)">
                  <input
                    type="number"
                    min="0"
                    value={activeLine.salesRate}
                    onChange={(e) => setActiveLine((s) => ({ ...s, salesRate: Number(e.target.value) }))}
                    className={inputClasses}
                  />
                </FormField>
              </div>

              {/* Add to Purchase list button & Line Total preview */}
              <div className="mt-3 flex items-center justify-between border-t border-slate-200/60 pt-2.5 dark:border-slate-800/60">
                <div className="text-[11px] text-slate-500">
                  Line Total:{' '}
                  <strong className="text-emerald-600 dark:text-emerald-400">
                    ৳ {formatNumber(activeLine.qty * activeLine.purchaseRate)}
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={handleAddProductLine}
                  disabled={!activeLine.productId}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-slate-700 disabled:opacity-40 dark:bg-slate-700 dark:hover:bg-slate-600"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Product to Order</span>
                </button>
              </div>

              {/* Added Items Table */}
              {cartItems.length > 0 && (
                <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400 dark:bg-slate-900/80">
                      <tr>
                        <th className="p-2.5">Product</th>
                        <th className="p-2.5 text-center">Unit</th>
                        <th className="p-2.5 text-center">Qty</th>
                        <th className="p-2.5 text-right">Rate</th>
                        <th className="p-2.5 text-right">Total</th>
                        <th className="p-2.5 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {cartItems.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="p-2.5">
                            <p className="font-semibold text-slate-800 dark:text-slate-200">{item.productName}</p>
                            <span className="text-[10px] text-slate-400">{item.productCode}</span>
                          </td>
                          <td className="p-2.5 text-center text-slate-500">{item.unitName ?? '—'}</td>
                          <td className="p-2.5 text-center font-bold">{item.qty}</td>
                          <td className="p-2.5 text-right">৳ {formatNumber(item.purchaseRate)}</td>
                          <td className="p-2.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                            ৳ {formatNumber(item.totalAmount)}
                          </td>
                          <td className="p-2.5 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveProductLine(item.id)}
                              title="Remove item"
                              className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Financials & Settlement */}
            <div className="grid grid-cols-3 gap-3">
              <FormField label="Discount (৳)">
                <input
                  type="number"
                  min="0"
                  value={formState.discountAmount}
                  onChange={(e) => setFormState((s) => ({ ...s, discountAmount: Math.max(0, Number(e.target.value)) }))}
                  className={inputClasses}
                />
              </FormField>
              <FormField label="VAT (৳)">
                <input
                  type="number"
                  min="0"
                  value={formState.vatAmount}
                  onChange={(e) => setFormState((s) => ({ ...s, vatAmount: Math.max(0, Number(e.target.value)) }))}
                  className={inputClasses}
                />
              </FormField>
              <FormField label="Paid Amount (৳)">
                <input
                  type="number"
                  min="0"
                  value={formState.paidAmount}
                  onChange={(e) => setFormState((s) => ({ ...s, paidAmount: Math.max(0, Number(e.target.value)) }))}
                  className={inputClasses}
                />
              </FormField>
            </div>

            {/* Calculations Summary Card */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-3.5 space-y-1.5 dark:border-slate-800/80 dark:bg-slate-900/50">
              <div className="flex justify-between text-slate-500">
                <span>Gross Total</span>
                <strong className="text-slate-800 dark:text-slate-200">৳ {formatNumber(grossTotal)}</strong>
              </div>
              {formState.discountAmount > 0 && (
                <div className="flex justify-between text-slate-500">
                  <span>Discount</span>
                  <span className="text-rose-500">- ৳ {formatNumber(formState.discountAmount)}</span>
                </div>
              )}
              {formState.vatAmount > 0 && (
                <div className="flex justify-between text-slate-500">
                  <span>VAT</span>
                  <span className="text-emerald-600">+ ৳ {formatNumber(formState.vatAmount)}</span>
                </div>
              )}
              <div className="flex justify-between pt-1 border-t border-slate-200/60 dark:border-slate-800/60 font-bold">
                <span className="text-slate-700 dark:text-slate-200">Net Amount</span>
                <span className="text-emerald-600 dark:text-emerald-400">৳ {formatNumber(netAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Paid Amount</span>
                <span className="font-semibold text-emerald-600">৳ {formatNumber(formState.paidAmount)}</span>
              </div>
              <div className="flex justify-between font-bold pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                <span className="text-slate-700 dark:text-slate-200">Due Amount</span>
                <span className={dueAmount > 0 ? 'text-rose-500' : 'text-slate-400'}>৳ {formatNumber(dueAmount)}</span>
              </div>
            </div>
          </form>
        </SliderDrawer.Body>

        <SliderDrawer.Footer>
          <div className="flex justify-start gap-2">
            <button
              type="button"
              onClick={() => {
                setIsCreateOpen(false)
                setEditingPurchase(null)
              }}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold dark:border-slate-700"
            >
              Cancel
            </button>
            <button
              form="purchase-form"
              type="submit"
              disabled={isCreating || isUpdating}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-500 disabled:opacity-50"
            >
              {editingPurchase
                ? (isUpdating ? 'Updating...' : 'Update Purchase')
                : (isCreating ? 'Saving...' : 'Save Purchase')}
            </button>
          </div>
        </SliderDrawer.Footer>
      </SliderDrawer>

      {/* ─── View Purchase Detail Drawer ───────────────────────────────────── */}
      <SliderDrawer isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} width="max-w-2xl">
        <SliderDrawer.Header onClose={() => setIsDetailOpen(false)} className="items-start">
          <PageHeader variant="flat" withAccent={false} className="min-w-0 flex-1 py-0">
            <PageHeader.Header
              title={
                <span className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-slate-950">
                    <FileText className="h-4 w-4" />
                  </span>
                  <span>Purchase Details</span>
                </span>
              }
              description={selectedPurchase?.purchaseNumber ?? 'Purchase information'}
              actions={
                <button
                  type="button"
                  onClick={() => void refreshPurchaseDetails()}
                  disabled={!selectedPurchase || isDetailLoading}
                  title="Refresh purchase details"
                  className="rounded-xl bg-slate-100 p-2 text-slate-600 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300"
                >
                  <RefreshCw className={`h-4 w-4 ${isDetailLoading ? 'animate-spin' : ''}`} />
                </button>
              }
            />
            <PageHeader.Bottom>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
                <span>
                  Supplier: <strong className="text-slate-700 dark:text-slate-200">{selectedPurchase?.supplierName ?? 'Loading...'}</strong>
                </span>
                <span>
                  Date: <strong className="text-slate-700 dark:text-slate-200">{selectedPurchase?.purchaseDate ?? '—'}</strong>
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
          {selectedPurchase && (
            <div className="space-y-5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                  <User className="mb-2 h-4 w-4 text-emerald-500" />
                  <p className="font-bold text-slate-900 dark:text-white">{selectedPurchase.supplierName}</p>
                  <p className="text-slate-400">Supplier account</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                  <Calendar className="mb-2 h-4 w-4 text-emerald-500" />
                  <p className="font-bold text-slate-900 dark:text-white">{selectedPurchase.purchaseDate}</p>
                  <p className="text-slate-400">Purchase date</p>
                </div>
              </div>
              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900/60">
                    <tr>
                      <th className="p-3">Product</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Rate</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {selectedPurchase.products?.map((product) => (
                      <tr key={product.id}>
                        <td className="p-3">
                          <p className="font-semibold">{product.product_name}</p>
                          <span className="text-[10px] text-slate-400">{product.product_code}</span>
                        </td>
                        <td className="p-3 text-center">{product.qty}</td>
                        <td className="p-3 text-right">৳ {formatNumber(product.purchase_rate)}</td>
                        <td className="p-3 text-right font-bold">৳ {formatNumber(product.total_amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="space-y-2 rounded-xl bg-slate-50 p-4 dark:bg-slate-900/50">
                <div className="flex justify-between">
                  <span>Net amount</span>
                  <strong>৳ {formatNumber(selectedPurchase.netAmount)}</strong>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Paid amount</span>
                  <strong>৳ {formatNumber(selectedPurchase.paidAmount)}</strong>
                </div>
                <div className="flex justify-between text-rose-500">
                  <span>Due amount</span>
                  <strong>৳ {formatNumber(selectedPurchase.dueAmount)}</strong>
                </div>
              </div>
            </div>
          )}
        </SliderDrawer.Body>
        <SliderDrawer.Footer>
          <div className="flex justify-start gap-2">
            <button
              type="button"
              onClick={() => {
                if (!selectedPurchase) return
                const target = selectedPurchase
                setIsDetailOpen(false)
                void handleEditPurchase(target)
              }}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
            >
              <Edit3 className="h-4 w-4 text-amber-500" />
              <span>Edit Purchase</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-emerald-500"
            >
              <Printer className="h-4 w-4" />
              <span>Print Purchase</span>
            </button>
          </div>
        </SliderDrawer.Footer>
      </SliderDrawer>
    </>
  )
}

const formatNumber = (value: string | number | undefined) =>
  Number(value ?? 0).toLocaleString('en-BD', { minimumFractionDigits: 2 })

export default PurchasesPage
