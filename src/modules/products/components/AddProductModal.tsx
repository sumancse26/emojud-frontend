import React, { useState } from 'react'
import { X } from 'lucide-react'
import { useApp } from '@/app/providers/AppProvider'

export const AddProductModal: React.FC = () => {
  const { isAddProductModalOpen, setIsAddProductModalOpen } = useApp()
  const [name, setName] = useState('')
  const [category, setCategory] = useState("Men's Apparel")
  const [sku, setSku] = useState('')
  const [costPrice, setCostPrice] = useState('')
  const [sellingPrice, setSellingPrice] = useState('')
  const [stock, setStock] = useState('')

  if (!isAddProductModalOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Product "${name}" registered successfully!`)
    setIsAddProductModalOpen(false)
    setName('')
    setSku('')
    setCostPrice('')
    setSellingPrice('')
    setStock('')
  }

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-[#0d1729] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Register New Product Item</h3>
          <button
            onClick={() => setIsAddProductModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form className="space-y-3 text-xs" onSubmit={handleSubmit}>
          <div>
            <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Product Name & Title</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Premium Cotton Oxford Shirt"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-emerald-500 font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Inventory Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-emerald-500 font-medium cursor-pointer"
              >
                <option>Men's Apparel</option>
                <option>Casual Bottoms</option>
                <option>Accessories</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Barcode / SKU Code</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. SHT-OXF-001"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Unit Cost Price (৳)</label>
              <input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                placeholder="500"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Retail Selling Price (৳)</label>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                placeholder="850"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1">Initial Stock Qty</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="50"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-1 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => setIsAddProductModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              Cancel & Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-sm cursor-pointer"
            >
              Save & Publish Product
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
