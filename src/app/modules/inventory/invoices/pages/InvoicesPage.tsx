import React, { useState } from 'react'
import {
  Plus,
  Search,
  ShoppingCart,
  Printer,
  FileText,
  User,
  Phone,
  CreditCard,
  Calendar,
  CheckCircle2,
  Clock,
  ScanBarcode,
  Trash2,
} from 'lucide-react'
import { SliderDrawer } from '@/shared'
import { InvoiceTable } from '../components/InvoiceTable'
import type { Invoice } from '../types/invoice.types'

interface CartItem {
  id: string
  name: string
  sku: string
  unitPrice: number
  quantity: number
}

const INITIAL_CART: CartItem[] = [
  {
    id: '1',
    name: 'Premium Cotton Polo Shirt (XL)',
    sku: 'POLO-CTN-XL-01',
    unitPrice: 850.0,
    quantity: 2,
  },
  {
    id: '2',
    name: 'Slim Fit Denim Jeans 32',
    sku: 'JNS-SLM-32',
    unitPrice: 1500.0,
    quantity: 1,
  },
]

export const InvoicesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isPOSDrawerOpen, setIsPOSDrawerOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false)

  // POS Billing Drawer Form State
  const [customer, setCustomer] = useState('Walk-in Customer (General Counter)')
  const [settlement, setSettlement] = useState('Cash On Hand')
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART)

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta
            return newQty > 0 ? { ...item, quantity: newQty } : null
          }
          return item
        })
        .filter(Boolean) as CartItem[]
    )
  }

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id))
  }

  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const subtotal = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0)
  const tax = subtotal * 0.05
  const discount = subtotal > 0 ? 100.0 : 0.0
  const grandTotal = Math.max(0, subtotal + tax - discount)

  const handleConfirmAndPrint = () => {
    alert(`Invoice Confirmed! Grand Total: ৳ ${grandTotal.toFixed(2)}. Sent to Thermal Printer!`)
    setIsPOSDrawerOpen(false)
  }

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsDetailDrawerOpen(true)
  }

  const handlePrintInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsDetailDrawerOpen(true)
  }

  return (
    <section className="space-y-6">
      {/* Invoices Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Sales Invoices</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Customer billing records, point-of-sale checkouts, and receivables
          </p>
        </div>
        <button
          onClick={() => setIsPOSDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-emerald-600/25 hover:shadow-emerald-500/30 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Invoice</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by invoice no, customer or phone…"
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-700/50 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 dark:focus:border-emerald-500 transition-all font-medium"
          />
        </div>
        <p className="text-sm text-slate-400 dark:text-slate-500 shrink-0">
          Showing 1–10 of 480 invoices
        </p>
      </div>

      {/* Invoice Table */}
      <InvoiceTable
        searchTerm={searchTerm}
        onViewInvoice={handleViewInvoice}
        onPrintInvoice={handlePrintInvoice}
      />

      {/* 1. New Invoice / POS Billing Slider Drawer */}
      <SliderDrawer
        isOpen={isPOSDrawerOpen}
        onClose={() => setIsPOSDrawerOpen(false)}
        width="max-w-2xl"
      >
        <SliderDrawer.Header onClose={() => setIsPOSDrawerOpen(false)}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">POS Quick Billing Register</h2>
              <p className="text-[10px] text-slate-400">Invoice Reference: #INV-2026-0843 (Live Counter)</p>
            </div>
          </div>
        </SliderDrawer.Header>

        <SliderDrawer.Body>
          <div className="space-y-4 text-xs">
            {/* Customer selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Customer Account</label>
                <select
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 font-medium"
                >
                  <option>Walk-in Customer (General Counter)</option>
                  <option>Rahim Chowdhury (+880 1712-345678)</option>
                  <option>Farhana Yasmin (+880 1911-889900)</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Settlement Method</label>
                <select
                  value={settlement}
                  onChange={(e) => setSettlement(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 font-medium"
                >
                  <option>Cash On Hand</option>
                  <option>bKash Merchant</option>
                  <option>Nagad</option>
                  <option>POS Card Terminal</option>
                </select>
              </div>
            </div>

            {/* Barcode / Search Product Input */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <ScanBarcode className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Scan Barcode or Type SKU / Product Name..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium"
              />
            </div>

            {/* Cart Item Table */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-2.5">Item & Description</th>
                    <th className="p-2.5 text-center">Quantity</th>
                    <th className="p-2.5 text-right">Unit Rate</th>
                    <th className="p-2.5 text-right">Total</th>
                    <th className="p-2.5 text-center" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td className="p-2.5">
                        <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                        <span className="text-[10px] text-slate-400 font-mono">
                          ৳ {item.unitPrice.toFixed(2)} / unit
                        </span>
                      </td>
                      <td className="p-2.5 text-center">
                        <div className="inline-flex items-center border border-slate-200 dark:border-slate-700 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="px-2 py-0.5 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 font-mono font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="px-2 py-0.5 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="p-2.5 font-mono text-right font-medium">৳ {item.unitPrice.toFixed(2)}</td>
                      <td className="p-2.5 font-mono font-bold text-right text-emerald-600 dark:text-emerald-400">
                        ৳ {(item.unitPrice * item.quantity).toFixed(2)}
                      </td>
                      <td className="p-2.5 text-center">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 hover:text-rose-500 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculation Breakdown */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl space-y-1.5 border border-slate-200/60 dark:border-slate-800">
              <div className="flex justify-between text-slate-500">
                <span>Gross Subtotal ({totalItemCount} items):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">৳ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Government VAT / Tax (5%):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">৳ {tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Special Promotional Discount:</span>
                <span className="font-mono font-bold text-rose-500">- ৳ {discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                <span>Grand Net Payable:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 text-base">
                  ৳ {grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </SliderDrawer.Body>

        <SliderDrawer.Footer>
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setIsPOSDrawerOpen(false)}
              className="w-1/3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Discard & Close
            </button>
            <button
              onClick={handleConfirmAndPrint}
              className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Confirm & Print Bill (৳ {grandTotal.toFixed(2)})</span>
            </button>
          </div>
        </SliderDrawer.Footer>
      </SliderDrawer>

      {/* 2. Invoice Details Slider Drawer */}
      <SliderDrawer
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        width="max-w-xl"
      >
        <SliderDrawer.Header onClose={() => setIsDetailDrawerOpen(false)}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                Invoice Details
              </h2>
              <p className="text-[10px] font-mono text-slate-400">
                {selectedInvoice?.invoiceNumber}
              </p>
            </div>
          </div>
        </SliderDrawer.Header>

        <SliderDrawer.Body>
          {selectedInvoice && (
            <div className="space-y-5 text-xs">
              {/* Customer & Meta Card */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        {selectedInvoice.customerName}
                      </h4>
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px] font-mono mt-0.5">
                        <Phone className="w-3 h-3" />
                        <span>{selectedInvoice.customerPhone}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      selectedInvoice.status === 'Paid'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {selectedInvoice.status === 'Paid' ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    {selectedInvoice.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Issue Date: <strong className="text-slate-700 dark:text-slate-200">{selectedInvoice.issueDate}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                    <span>Method: <strong className="text-slate-700 dark:text-slate-200">{selectedInvoice.paymentMethod}</strong></span>
                  </div>
                </div>
              </div>

              {/* Invoice Line Items */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Billed Products & Services
                </h3>
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 text-[11px]">
                      <tr>
                        <th className="p-3">Item Description</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3 text-right">Unit Price</th>
                        <th className="p-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                      {selectedInvoice.items && selectedInvoice.items.length > 0 ? (
                        selectedInvoice.items.map((item) => (
                          <tr key={item.id}>
                            <td className="p-3">
                              <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                              <span className="text-[10px] text-slate-400 font-mono">{item.sku}</span>
                            </td>
                            <td className="p-3 text-center font-mono font-medium">{item.quantity}</td>
                            <td className="p-3 text-right font-mono text-slate-600 dark:text-slate-300">
                              ৳ {item.unitPrice.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                              ৳ {item.total.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-slate-400">
                            General Counter Order Summary
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Calculation Breakdown */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 space-y-2">
                <div className="flex justify-between text-slate-500">
                  <span>Gross Invoice Subtotal:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    ৳ {selectedInvoice.totalAmount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Amount Paid by Customer:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    ৳ {selectedInvoice.paidAmount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Outstanding Due Balance:</span>
                  <span
                    className={`font-mono font-bold ${
                      selectedInvoice.dueAmount > 0 ? 'text-rose-500' : 'text-slate-400'
                    }`}
                  >
                    ৳ {selectedInvoice.dueAmount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-sm font-bold text-slate-900 dark:text-white">
                  <span>Total Net Receivable:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 text-base">
                    ৳ {selectedInvoice.totalAmount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          )}
        </SliderDrawer.Body>

        <SliderDrawer.Footer>
          <div className="flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsDetailDrawerOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                window.print()
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice Receipt</span>
            </button>
          </div>
        </SliderDrawer.Footer>
      </SliderDrawer>
    </section>
  )
}

