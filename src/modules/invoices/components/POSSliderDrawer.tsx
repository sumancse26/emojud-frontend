import React, { useState } from 'react'
import { ShoppingCart, X, ScanBarcode, Trash2, Printer } from 'lucide-react'
import { useApp } from '@/app/providers/AppProvider'

interface CartItem {
  id: string
  name: string
  sku: string
  unitPrice: number
  quantity: number
}

export const POSSliderDrawer: React.FC = () => {
  const { isPOSDrawerOpen, closePOSDrawer } = useApp()
  const [customer, setCustomer] = useState('Walk-in Customer (General Counter)')
  const [settlement, setSettlement] = useState('Cash On Hand')
  const [cartItems, setCartItems] = useState<CartItem[]>([
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
  ])

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
    closePOSDrawer()
  }

  if (!isPOSDrawerOpen) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={closePOSDrawer}
      />

      <aside className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-white dark:bg-[#0d1729] border-l border-slate-200 dark:border-slate-800 shadow-2xl transition-transform duration-300 flex flex-col justify-between">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">POS Quick Billing Register</h2>
              <p className="text-[10px] text-slate-400">Invoice Reference: #INV-2026-0843 (Live Counter)</p>
            </div>
          </div>
          <button
            onClick={closePOSDrawer}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
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

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between gap-3">
          <button
            onClick={closePOSDrawer}
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
      </aside>
    </>
  )
}
