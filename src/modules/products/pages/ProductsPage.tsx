import React from 'react'
import { Plus, Shirt, Watch, Edit3, Trash2, Barcode } from 'lucide-react'
import { useApp } from '@/app/providers/AppProvider'

export const ProductsPage: React.FC = () => {
  const { setIsAddProductModalOpen } = useApp()

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Product Inventory & Stock</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Manage barcode SKUs, wholesale purchase cost, retail prices, and safety stock levels</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1729] text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer">
            <Barcode className="w-3.5 h-3.5" />
            <span>Print Barcode Labels</span>
          </button>
          <button onClick={() => setIsAddProductModalOpen(true)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer">
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-900/40 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80 text-[11px]">
              <tr>
                <th className="px-5 py-3">Product Name & SKU</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3 text-right">Unit Cost Price</th>
                <th className="px-5 py-3 text-right">Retail Selling Price</th>
                <th className="px-5 py-3 text-center">Available Stock</th>
                <th className="px-5 py-3 text-center">Stock Health</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Shirt className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Premium Cotton Polo Shirt (XL)</p>
                      <p className="font-mono text-[10px] text-slate-400">SKU: POLO-CTN-XL-01</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">Men's Apparel</td>
                <td className="px-5 py-3.5 font-mono text-right text-slate-500">৳ 520.00</td>
                <td className="px-5 py-3.5 font-mono font-bold text-right text-emerald-600 dark:text-emerald-400">৳ 850.00</td>
                <td className="px-5 py-3.5 text-center">
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">142 units</span>
                  <span className="block text-[10px] text-slate-400">Safety Threshold: 20 units</span>
                </td>
                <td className="px-5 py-3.5 text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Healthy Stock</span>
                </td>
                <td className="px-5 py-3.5 text-right space-x-1">
                  <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-emerald-500 cursor-pointer"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-500 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Watch className="w-4 h-4 text-rose-500" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Formal Silk Tie - Navy Blue</p>
                      <p className="font-mono text-[10px] text-slate-400">SKU: TIE-SLK-02</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">Accessories</td>
                <td className="px-5 py-3.5 font-mono text-right text-slate-500">৳ 250.00</td>
                <td className="px-5 py-3.5 font-mono font-bold text-right text-emerald-600 dark:text-emerald-400">৳ 450.00</td>
                <td className="px-5 py-3.5 text-center">
                  <span className="font-mono font-bold text-rose-500">2 units</span>
                  <span className="block text-[10px] text-rose-400 font-bold">Under Safety Level</span>
                </td>
                <td className="px-5 py-3.5 text-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400">Critically Low</span>
                </td>
                <td className="px-5 py-3.5 text-right space-x-1">
                  <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-emerald-500 cursor-pointer"><Edit3 className="w-3.5 h-3.5" /></button>
                  <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-500 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
