import React, { useCallback, useMemo, useState } from 'react'
import { FileText, Plus, Printer, RefreshCw, Trash2 } from 'lucide-react'
import { Dropdown, FormField, inputClasses, PageHeader, Pagination, SliderDrawer, Skeleton, useTablePagination, type DropdownOption } from '@/shared'
import { useApp } from '@/app/providers'
import { useToast } from '@/shared/components/Toast'
import { useExpense } from '../hooks/useExpense'
import { ExpensesPresenter } from './presenters/ExpensesPresenter'
import type { CreateExpensePayload, ExpenseItem } from '../types/expense.types'

interface ExpenseDetailForm {
  id: number | null
  expenseHeadId: number
  amount: number
  paymentMethodId: number
  remarks: string
}

interface ExpenseFormState {
  id: number | null
  expenseDate: string
  expenseNo: string
  totalAmount: number
  remarks: string
  details: ExpenseDetailForm[]
}

const emptyDetail = (): ExpenseDetailForm => ({
  id: null,
  expenseHeadId: 0,
  amount: 0,
  paymentMethodId: 0,
  remarks: '',
})

const newForm = (): ExpenseFormState => ({
  id: null,
  expenseDate: new Date().toISOString().slice(0, 10),
  expenseNo: '',
  totalAmount: 0,
  remarks: '',
  details: [emptyDetail()],
})

export const ExpensesPage: React.FC = () => {
  const { selectedBranch } = useApp()
  const toast = useToast()
  const {
    expenses,
    isLoading,
    isError,
    error,
    refetch,
    getExpenseDetails,
    refetchExpenseDetails,
    detail,
    isDetailLoading,
    detailError,
    createExpense,
    isCreating,
    createError,
    expenseHeads,
    paymentMethods,
    isLoadingLookups,
    lookupError,
  } = useExpense(selectedBranch)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(null)
  const [formState, setFormState] = useState<ExpenseFormState>(newForm)
  const [isEditMode, setIsEditMode] = useState(false)
  const detailPagination = useTablePagination(detail)

  const expenseHeadOptions = useMemo<DropdownOption[]>(
    () => expenseHeads.map((item) => ({ value: String(item.id), label: item.lookup_value, subLabel: item.lookup_code })),
    [expenseHeads],
  )
  const paymentMethodOptions = useMemo<DropdownOption[]>(
    () => paymentMethods.map((item) => ({ value: String(item.id), label: item.lookup_value, subLabel: item.lookup_code })),
    [paymentMethods],
  )

  // Computed total from detail amounts
  const computedTotal = useMemo(
    () => formState.details.reduce((sum, d) => sum + (Number(d.amount) || 0), 0),
    [formState.details],
  )

  const viewExpense = useCallback(
    async (expense: ExpenseItem) => {
      setSelectedExpense(expense)
      setIsDetailOpen(true)
      try {
        await getExpenseDetails(expense)
      } catch {
        /* detailError renders the failure */
      }
    },
    [getExpenseDetails],
  )

  const refreshDetails = useCallback(async () => {
    if (!selectedExpense) return
    try {
      await refetchExpenseDetails(selectedExpense)
    } catch {
      /* detailError renders the failure */
    }
  }, [refetchExpenseDetails, selectedExpense])

  const openEditExpense = useCallback(
    async (expense: ExpenseItem) => {
      setSelectedExpense(expense)
      setIsEditMode(true)
      try {
        const details = await getExpenseDetails(expense)
        setFormState({
          id: Number(expense.id),
          expenseDate: expense.expenseDate
            ? new Date(expense.expenseDate.split('/').reverse().join('-')).toISOString().slice(0, 10)
            : new Date().toISOString().slice(0, 10),
          expenseNo: expense.expenseNumber ?? '',
          totalAmount: 0,
          remarks: expense.remarks === '—' ? '' : expense.remarks,
          details:
            details && details.length > 0
              ? details.map((d) => ({
                  id: d.id ? Number(d.id) : null,
                  expenseHeadId: d.expenseHead ? Number(d.expenseHead.id) : 0,
                  amount: Number(d.amount) || 0,
                  paymentMethodId: d.paymentMethod ? Number(d.paymentMethod.id) : 0,
                  remarks: d.remarks ?? '',
                }))
              : [emptyDetail()],
        })
        setIsCreateOpen(true)
      } catch {
        toast.error('Failed to load expense details for editing.')
      }
    },
    [getExpenseDetails, toast],
  )

  // Detail row management
  const addDetail = () =>
    setFormState((s) => ({ ...s, details: [...s.details, emptyDetail()] }))

  const removeDetail = (index: number) =>
    setFormState((s) => ({
      ...s,
      details: s.details.filter((_, i) => i !== index),
    }))

  const updateDetail = (index: number, field: keyof ExpenseDetailForm, value: string | number) =>
    setFormState((s) => ({
      ...s,
      details: s.details.map((d, i) => (i === index ? { ...d, [field]: value } : d)),
    }))

  const submitExpense = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault()
      const total = formState.details.reduce((sum, d) => sum + (Number(d.amount) || 0), 0)
      const payload: CreateExpensePayload = {
        id: formState.id,
        expense_no: formState.expenseNo,
        shop_id: Number(selectedBranch),
        expense_date: formState.expenseDate,
        total_amount: total || formState.totalAmount,
        remarks: formState.remarks,
        details: formState.details.map((d) => ({
          id: d.id,
          expense_head_id: d.expenseHeadId,
          amount: d.amount,
          payment_method_id: d.paymentMethodId,
          remarks: d.remarks,
        })),
      }
      try {
        await createExpense(payload)
        setIsCreateOpen(false)
        setIsEditMode(false)
        toast.success(isEditMode ? 'Expense updated successfully.' : 'Expense created successfully.')
      } catch (submitError) {
        const message = submitError instanceof Error ? submitError.message : 'Failed to save expense.'
        toast.error(message)
      }
    },
    [createExpense, formState, selectedBranch, toast, isEditMode],
  )

  const handleOpenCreate = () => {
    setFormState(newForm())
    setIsEditMode(false)
    setIsCreateOpen(true)
  }

  const handleCloseForm = () => {
    setIsCreateOpen(false)
    setIsEditMode(false)
  }

  return (
    <>
      <ExpensesPresenter
        expenses={expenses}
        isLoading={isLoading}
        isError={isError}
        error={error}
        createError={createError}
        onOpenCreate={handleOpenCreate}
        onRefetch={() => void refetch()}
        onViewExpense={viewExpense}
        onEditExpense={openEditExpense}
      />

      {/* ── Create / Edit Expense Drawer ── */}
      <SliderDrawer isOpen={isCreateOpen} onClose={handleCloseForm} width="max-w-xl">
        <SliderDrawer.Header onClose={handleCloseForm}>
          <div className="flex items-center gap-2.5">
            <div className={`flex h-8 w-8 items-center justify-center rounded-xl text-white ${isEditMode ? 'bg-blue-500' : 'bg-emerald-500'}`}>
              {isEditMode ? <FileText className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {isEditMode ? 'Update Expense' : 'Create Expense'}
              </h2>
              <p className="text-[10px] text-slate-400">
                {isEditMode
                  ? `Editing ${formState.expenseNo || 'expense record'}`
                  : 'Record operating expenses and payment details'}
              </p>
            </div>
          </div>
        </SliderDrawer.Header>

        <SliderDrawer.Body>
          <form id="expense-form" onSubmit={submitExpense} className="space-y-4 text-xs">
            {lookupError && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-300">
                Unable to load expense heads and payment methods. Please refresh and try again.
              </div>
            )}

            {/* General info */}
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Expense No">
                <input
                  value={formState.expenseNo}
                  onChange={(e) => setFormState((s) => ({ ...s, expenseNo: e.target.value }))}
                  className={inputClasses}
                  placeholder="Auto generated"
                />
              </FormField>
              <FormField label="Expense Date" required>
                <input
                  type="date"
                  value={formState.expenseDate}
                  onChange={(e) => setFormState((s) => ({ ...s, expenseDate: e.target.value }))}
                  className={inputClasses}
                  required
                />
              </FormField>
            </div>

            <FormField label="Remarks">
              <input
                value={formState.remarks}
                onChange={(e) => setFormState((s) => ({ ...s, remarks: e.target.value }))}
                className={inputClasses}
                placeholder="e.g. Office maintenance, utility bills…"
              />
            </FormField>

            {/* ── Expense Detail Rows ── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Expense Details ({formState.details.length})
                </p>
                <button
                  type="button"
                  onClick={addDetail}
                  className="flex items-center gap-1.5 rounded-lg border border-dashed border-emerald-400 px-3 py-1.5 text-[11px] font-semibold text-emerald-600 transition-colors hover:border-emerald-500 hover:bg-emerald-50 dark:border-emerald-600 dark:text-emerald-400 dark:hover:bg-emerald-950/30"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Detail
                </button>
              </div>

              {formState.details.map((detail, index) => (
                <div
                  key={index}
                  className="relative rounded-xl border border-slate-200 bg-slate-50/50 p-3 transition-all dark:border-slate-800 dark:bg-slate-900/30"
                >
                  {/* Header row with numbering and remove button */}
                  <div className="mb-3 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-100 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                        {index + 1}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                        Expense Item
                      </span>
                    </span>
                    {formState.details.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDetail(index)}
                        title="Remove this detail"
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/30 dark:hover:text-rose-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Expense Head" required>
                      <Dropdown
                        options={expenseHeadOptions}
                        value={detail.expenseHeadId ? String(detail.expenseHeadId) : ''}
                        onChange={(value) => updateDetail(index, 'expenseHeadId', Number(value))}
                        placeholder="Select expense head"
                        isLoading={isLoadingLookups}
                        disabled={Boolean(lookupError)}
                        required
                        searchable={5}
                      />
                    </FormField>
                    <FormField label="Payment Method" required>
                      <Dropdown
                        options={paymentMethodOptions}
                        value={detail.paymentMethodId ? String(detail.paymentMethodId) : ''}
                        onChange={(value) => updateDetail(index, 'paymentMethodId', Number(value))}
                        placeholder="Select payment method"
                        isLoading={isLoadingLookups}
                        disabled={Boolean(lookupError)}
                        required
                        searchable={5}
                      />
                    </FormField>
                    <FormField label="Amount" required>
                      <input
                        type="number"
                        min="0"
                        value={detail.amount || ''}
                        onChange={(e) => updateDetail(index, 'amount', Number(e.target.value))}
                        className={inputClasses}
                        placeholder="0.00"
                        required
                      />
                    </FormField>
                    <FormField label="Detail Remarks">
                      <input
                        value={detail.remarks}
                        onChange={(e) => updateDetail(index, 'remarks', e.target.value)}
                        className={inputClasses}
                        placeholder="e.g. Electric bill"
                      />
                    </FormField>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Computed Total ── */}
            <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-3 dark:border-emerald-900/40 dark:bg-emerald-950/20">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                Total Amount
              </span>
              <span className="font-mono text-sm font-bold text-emerald-700 dark:text-emerald-300">
                ৳ {computedTotal.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </form>
        </SliderDrawer.Body>

        <SliderDrawer.Footer>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCloseForm}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold dark:border-slate-700"
            >
              Cancel
            </button>
            <button
              form="expense-form"
              type="submit"
              disabled={isCreating || isLoadingLookups || Boolean(lookupError)}
              className={`rounded-xl px-5 py-2.5 text-xs font-bold text-white disabled:opacity-50 ${isEditMode ? 'bg-blue-600 hover:bg-blue-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}
            >
              {isCreating ? 'Saving...' : isEditMode ? 'Update Expense' : 'Save Expense'}
            </button>
          </div>
        </SliderDrawer.Footer>
      </SliderDrawer>

      {/* ── View Expense Details Drawer ── */}
      <SliderDrawer isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} width="max-w-2xl">
        <SliderDrawer.Header onClose={() => setIsDetailOpen(false)} className="items-start">
          <PageHeader variant="flat" withAccent={false} className="min-w-0 flex-1 py-0">
            <PageHeader.Header
              title={
                <span className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-slate-950">
                    <FileText className="h-4 w-4" />
                  </span>
                  <span>Expense Details</span>
                </span>
              }
              description={selectedExpense?.expenseNumber ?? 'Expense information'}
              actions={
                <button
                  type="button"
                  onClick={() => void refreshDetails()}
                  disabled={!selectedExpense || isDetailLoading}
                  title="Refresh expense details"
                  className="rounded-xl bg-slate-100 p-2 text-slate-600 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300"
                >
                  <RefreshCw className={`h-4 w-4 ${isDetailLoading ? 'animate-spin' : ''}`} />
                </button>
              }
            />
            <PageHeader.Bottom>
              <div className="flex items-center gap-4 text-[11px] text-slate-500">
                <span>
                  Date: <strong className="text-slate-700 dark:text-slate-200">{selectedExpense?.expenseDate ?? '—'}</strong>
                </span>
                <span>{selectedExpense?.remarks}</span>
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
          {selectedExpense && (
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/60">
                  <tr>
                    <th className="p-3">Expense Head</th>
                    <th className="p-3">Payment Method</th>
                    <th className="p-3">Remarks</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {detailPagination.paginatedItems.map((item) => (
                    <tr key={item.id}>
                      <td className="p-3">{item.expenseHead?.lookup_value ?? item.expenseHead?.lookup_code ?? '—'}</td>
                      <td className="p-3">{item.paymentMethod?.lookup_value ?? item.paymentMethod?.lookup_code ?? '—'}</td>
                      <td className="p-3">{item.remarks}</td>
                      <td className="p-3 text-right font-mono font-bold">
                        ৳ {Number(item.amount).toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t border-slate-200/80 bg-slate-50/95 dark:border-slate-800/80 dark:bg-slate-900/60">
                  <tr>
                    <td colSpan={4} className="p-0">
                      <Pagination
                        currentPage={detailPagination.currentPage}
                        totalPages={detailPagination.totalPages}
                        onPageChange={detailPagination.setCurrentPage}
                        totalItems={detail.length}
                        pageSize={detailPagination.pageSize}
                        onPageSizeChange={detailPagination.setPageSize}
                        showPageSizeSelector
                        itemLabel="expense details"
                        pageFooter={false}
                        className="border-0 bg-transparent shadow-none"
                      />
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </SliderDrawer.Body>

        <SliderDrawer.Footer>
          <div className="flex justify-end gap-2">
            {selectedExpense && (
              <button
                type="button"
                onClick={() => {
                  setIsDetailOpen(false)
                  void openEditExpense(selectedExpense)
                }}
                className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-2.5 text-xs font-bold text-blue-700 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-300 dark:hover:bg-blue-900/40"
              >
                <FileText className="h-4 w-4" />
                Edit Expense
              </button>
            )}
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white"
            >
              <Printer className="h-4 w-4" />
              Print Expense
            </button>
          </div>
        </SliderDrawer.Footer>
      </SliderDrawer>
    </>
  )
}

export default ExpensesPage
