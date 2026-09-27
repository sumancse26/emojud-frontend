import React, { useState } from 'react'
import { Package, Save } from 'lucide-react'
import { useApp } from '@/app/providers/AppProvider'
import { SliderDrawer, FormField, inputClasses, selectClasses } from '@/shared'

export const AddProductModal: React.FC = () => {
  const { isAddProductModalOpen, setIsAddProductModalOpen } = useApp()
  const [name, setName] = useState('')
  const [category, setCategory] = useState("Men's Apparel")
  const [sku, setSku] = useState('')
  const [costPrice, setCostPrice] = useState('')
  const [sellingPrice, setSellingPrice] = useState('')
  const [stock, setStock] = useState('')

  const handleClose = () => {
    setIsAddProductModalOpen(false)
  }

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
    <SliderDrawer
      isOpen={isAddProductModalOpen}
      onClose={handleClose}
      width="max-w-xl"
    >
      <SliderDrawer.Header onClose={handleClose}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">Register New Product Item</h2>
            <p className="text-[10px] text-slate-400">Add an inventory SKU and configure pricing</p>
          </div>
        </div>
      </SliderDrawer.Header>

      <SliderDrawer.Body>
        <form id="add-product-form" className="space-y-4 text-xs" onSubmit={handleSubmit}>
          <FormField label="Product Name & Title" required>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Premium Cotton Oxford Shirt"
              className={inputClasses}
              required
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Inventory Category" required>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={selectClasses}
              >
                <option>Men's Apparel</option>
                <option>Casual Bottoms</option>
                <option>Accessories</option>
              </select>
            </FormField>

            <FormField label="Barcode / SKU Code">
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. SHT-OXF-001"
                className={`${inputClasses} font-mono`}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <FormField label="Unit Cost Price (৳)" required>
              <input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                placeholder="500"
                className={`${inputClasses} font-mono`}
                required
              />
            </FormField>

            <FormField label="Retail Selling Price (৳)" required>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                placeholder="850"
                className={`${inputClasses} font-mono`}
                required
              />
            </FormField>

            <FormField label="Initial Stock Qty" required>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="50"
                className={`${inputClasses} font-mono`}
                required
              />
            </FormField>
          </div>
        </form>
      </SliderDrawer.Body>

      <SliderDrawer.Footer>
        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            Cancel & Close
          </button>
          <button
            type="submit"
            form="add-product-form"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save & Publish Product</span>
          </button>
        </div>
      </SliderDrawer.Footer>
    </SliderDrawer>
  )
}

