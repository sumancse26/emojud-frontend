import React from 'react'
import { UserPlus } from 'lucide-react'

interface Customer {
  id: string
  code: string
  name: string
  initials: string
  phone: string
  address: string
  totalOrders: number
  dueAmount: number
  badgeColor: string
}

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: '1',
    code: 'CUST-8021',
    name: 'Rahim Chowdhury',
    initials: 'RC',
    phone: '+880 1712-345678',
    address: 'Road 27, Dhanmondi, Dhaka',
    totalOrders: 14,
    dueAmount: 0.0,
    badgeColor: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    id: '2',
    code: 'CUST-8022',
    name: 'Farhana Yasmin',
    initials: 'FY',
    phone: '+880 1911-889900',
    address: 'Gulshan-1, Dhaka',
    totalOrders: 8,
    dueAmount: 4400.0,
    badgeColor: 'bg-amber-500/10 text-amber-600',
  },
]

export const CustomersPage: React.FC = () => {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Customers & Due Receivables</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage customer profiles, credit limits, phone directory, and due collection receipts
          </p>
        </div>

        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2 self-start sm:self-auto cursor-pointer">
          <UserPlus className="w-4 h-4" />
          <span>Register New Customer</span>
        </button>
      </div>

      {/* Customer Ledger Table */}
      <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-900/40 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80 text-[11px]">
              <tr>
                <th className="px-5 py-3">Customer Profile & ID</th>
                <th className="px-5 py-3">Contact Number</th>
                <th className="px-5 py-3">Store Branch & City</th>
                <th className="px-5 py-3 text-right">Total Orders Placed</th>
                <th className="px-5 py-3 text-right">Due Receivable (৳)</th>
                <th className="px-5 py-3 text-right">Ledger Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {MOCK_CUSTOMERS.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-full ${cust.badgeColor} font-bold flex items-center justify-center`}
                      >
                        {cust.initials}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{cust.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">ID: {cust.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 font-mono">{cust.phone}</td>
                  <td className="px-5 py-3.5 text-slate-500">{cust.address}</td>
                  <td className="px-5 py-3.5 font-mono text-right font-bold text-slate-800 dark:text-slate-200">
                    {cust.totalOrders} Invoices
                  </td>
                  <td
                    className={`px-5 py-3.5 font-mono font-bold text-right ${
                      cust.dueAmount > 0 ? 'text-rose-500' : 'text-slate-400'
                    }`}
                  >
                    ৳ {cust.dueAmount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {cust.dueAmount > 0 ? (
                      <button className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer">
                        Collect Due Receipt
                      </button>
                    ) : (
                      <button className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-500/20 transition-colors cursor-pointer">
                        View Ledger
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
