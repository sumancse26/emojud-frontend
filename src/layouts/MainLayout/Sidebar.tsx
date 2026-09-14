import React, { useState } from 'react'
import {
  ChevronsLeft,
  LayoutDashboard,
  Receipt,
  Package,
  Truck,
  Users,
  BarChart3,
  Settings,
  ChevronRight,
  ChevronDown,
  LogOut,
} from 'lucide-react'
import { useApp } from '@/app/providers/AppProvider'

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    openPOSDrawer,
    setIsAddProductModalOpen,
    isSidebarCollapsed,
    toggleSidebarCollapse,
    isMobileSidebarOpen,
    selectedBranch,
    setSelectedBranch,
  } = useApp()

  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    'acc-sales': true,
    'acc-products': true,
    'acc-purchases': false,
    'acc-customers': false,
    'acc-reports': false,
    'acc-admin': false,
  })

  const toggleAccordion = (accId: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [accId]: !prev[accId],
    }))
  }

  return (
    <aside
      className={`${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      } shrink-0 bg-white dark:bg-[#080d1a] border-r border-slate-200/80 dark:border-slate-800/60 flex flex-col justify-between transition-all duration-300 ${
        isMobileSidebarOpen ? 'flex fixed inset-y-0 left-0 z-40 shadow-2xl md:relative md:shadow-none' : 'hidden md:flex'
      }`}
    >
      {/* Top Branding & Shop selector */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-extrabold text-[11px] tracking-tight shadow-lg shadow-blue-500/30 shrink-0 font-mono">
              E
            </div>
            {!isSidebarCollapsed && (
              <div>
                <h2 className="font-bold text-sm tracking-tight leading-tight text-slate-900 dark:text-white">
                  Emojud ERP
                </h2>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                  Enterprise POS
                </span>
              </div>
            )}
          </div>
          <button
            onClick={toggleSidebarCollapse}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer"
            title="Collapse Sidebar"
          >
            <ChevronsLeft className={`w-4 h-4 transition-transform ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Current Branch Selector Dropdown */}
        {!isSidebarCollapsed && (
          <div className="relative">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
              Active Store Branch
            </label>
            <div className="relative">
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium cursor-pointer appearance-none"
              >
                <option value="1">📍 Dhanmondi Flagship Outlet</option>
                <option value="2">📍 Gulshan Branch Outlet</option>
                <option value="3">📍 Central Warehouse (Savar)</option>
                <option value="4">📍 Chittagong Distribution Hub</option>
              </select>
              <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                <ChevronDown className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {/* Navigation Section: Core Operations */}
        <div>
          {!isSidebarCollapsed && (
            <p className="px-3 mb-1.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Core Operations
            </p>
          )}

          <div className="space-y-0.5">
            {/* 1. Dashboard (Direct Leaf) */}
            <button
              onClick={() => setActiveView('view-dashboard')}
              className={`w-full group relative flex items-center rounded-xl text-sm font-medium transition-all duration-200 gap-3 px-3 py-2.5 cursor-pointer ${
                activeView === 'view-dashboard'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 dark:bg-emerald-500/15 dark:text-emerald-400 dark:shadow-none dark:ring-1 dark:ring-emerald-500/20'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
              }`}
            >
              {activeView === 'view-dashboard' && (
                <span className="absolute left-0 inset-y-2 w-0.75 rounded-r-full bg-white/60 dark:bg-emerald-400" />
              )}
              <span className={`shrink-0 ${activeView === 'view-dashboard' ? 'text-white dark:text-emerald-400' : ''}`}>
                <LayoutDashboard className="w-4.5 h-4.5" />
              </span>
              {!isSidebarCollapsed && <span className="leading-none text-left">Dashboard Overview</span>}
              {activeView === 'view-dashboard' && !isSidebarCollapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70 dark:bg-emerald-400 shrink-0" />
              )}
            </button>

            {/* 2. Sales & POS (Accordion Parent) */}
            <div>
              <button
                onClick={() => toggleAccordion('acc-sales')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 cursor-pointer"
              >
                <span className="shrink-0 text-slate-400 dark:text-slate-500">
                  <Receipt className="w-4.5 h-4.5" />
                </span>
                {!isSidebarCollapsed && (
                  <>
                    <span className="leading-none flex-1 text-left">Sales & Invoicing</span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 text-slate-400 dark:text-slate-600 ${
                        openAccordions['acc-sales'] ? 'rotate-90' : ''
                      }`}
                    />
                  </>
                )}
              </button>

              {!isSidebarCollapsed && openAccordions['acc-sales'] && (
                <div className="ml-3 mt-0.5 mb-0.5 pl-3 border-l-2 border-slate-200 dark:border-slate-800/70 space-y-0.5 py-0.5">
                  <button
                    onClick={() => setActiveView('view-invoices')}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                      activeView === 'view-invoices'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 dark:bg-emerald-500/15 dark:text-emerald-400 dark:shadow-none dark:ring-1 dark:ring-emerald-500/20'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        activeView === 'view-invoices' ? 'bg-white dark:bg-emerald-400' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    />
                    <span>Sales Invoices</span>
                  </button>
                  <button
                    onClick={openPOSDrawer}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 cursor-pointer text-left"
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-slate-300 dark:bg-slate-600" />
                    <span>+ POS Sale Register</span>
                  </button>
                  <button
                    onClick={() => setActiveView('view-customers')}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 cursor-pointer text-left"
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-slate-300 dark:bg-slate-600" />
                    <span>Customer Due Collection</span>
                  </button>
                </div>
              )}
            </div>

            {/* 3. Products & Stock (Accordion Parent) */}
            <div>
              <button
                onClick={() => toggleAccordion('acc-products')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 cursor-pointer"
              >
                <span className="shrink-0 text-slate-400 dark:text-slate-500">
                  <Package className="w-4.5 h-4.5" />
                </span>
                {!isSidebarCollapsed && (
                  <>
                    <span className="leading-none flex-1 text-left">Products & Stock</span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 text-slate-400 dark:text-slate-600 ${
                        openAccordions['acc-products'] ? 'rotate-90' : ''
                      }`}
                    />
                  </>
                )}
              </button>

              {!isSidebarCollapsed && openAccordions['acc-products'] && (
                <div className="ml-3 mt-0.5 mb-0.5 pl-3 border-l-2 border-slate-200 dark:border-slate-800/70 space-y-0.5 py-0.5">
                  <button
                    onClick={() => setActiveView('view-products')}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                      activeView === 'view-products'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 dark:bg-emerald-500/15 dark:text-emerald-400 dark:shadow-none dark:ring-1 dark:ring-emerald-500/20'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        activeView === 'view-products' ? 'bg-white dark:bg-emerald-400' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    />
                    <span>Product Directory</span>
                  </button>
                  <button
                    onClick={() => setIsAddProductModalOpen(true)}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 cursor-pointer text-left"
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-slate-300 dark:bg-slate-600" />
                    <span>+ Add New Product</span>
                  </button>
                  <button
                    onClick={() => setActiveView('view-products')}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 cursor-pointer text-left"
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-slate-300 dark:bg-slate-600" />
                    <span>Stock Health & Alerts</span>
                  </button>
                </div>
              )}
            </div>

            {/* 4. Purchases & Restock (Accordion Parent) */}
            <div>
              <button
                onClick={() => toggleAccordion('acc-purchases')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 cursor-pointer"
              >
                <span className="shrink-0 text-slate-400 dark:text-slate-500">
                  <Truck className="w-4.5 h-4.5" />
                </span>
                {!isSidebarCollapsed && (
                  <>
                    <span className="leading-none flex-1 text-left">Purchases & Restock</span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 text-slate-400 dark:text-slate-600 ${
                        openAccordions['acc-purchases'] ? 'rotate-90' : ''
                      }`}
                    />
                  </>
                )}
              </button>

              {!isSidebarCollapsed && openAccordions['acc-purchases'] && (
                <div className="ml-3 mt-0.5 mb-0.5 pl-3 border-l-2 border-slate-200 dark:border-slate-800/70 space-y-0.5 py-0.5">
                  <button
                    onClick={() => setActiveView('view-purchases')}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                      activeView === 'view-purchases'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 dark:bg-emerald-500/15 dark:text-emerald-400 dark:shadow-none dark:ring-1 dark:ring-emerald-500/20'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        activeView === 'view-purchases' ? 'bg-white dark:bg-emerald-400' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    />
                    <span>Purchase Orders (PO)</span>
                  </button>
                  <button
                    onClick={() => setActiveView('view-purchases')}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 cursor-pointer text-left"
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-slate-300 dark:bg-slate-600" />
                    <span>Supplier Payables</span>
                  </button>
                </div>
              )}
            </div>

            {/* 5. Customers & Ledger (Accordion Parent) */}
            <div>
              <button
                onClick={() => toggleAccordion('acc-customers')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 cursor-pointer"
              >
                <span className="shrink-0 text-slate-400 dark:text-slate-500">
                  <Users className="w-4.5 h-4.5" />
                </span>
                {!isSidebarCollapsed && (
                  <>
                    <span className="leading-none flex-1 text-left">Customers & Ledger</span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 text-slate-400 dark:text-slate-600 ${
                        openAccordions['acc-customers'] ? 'rotate-90' : ''
                      }`}
                    />
                  </>
                )}
              </button>

              {!isSidebarCollapsed && openAccordions['acc-customers'] && (
                <div className="ml-3 mt-0.5 mb-0.5 pl-3 border-l-2 border-slate-200 dark:border-slate-800/70 space-y-0.5 py-0.5">
                  <button
                    onClick={() => setActiveView('view-customers')}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                      activeView === 'view-customers'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 dark:bg-emerald-500/15 dark:text-emerald-400 dark:shadow-none dark:ring-1 dark:ring-emerald-500/20'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        activeView === 'view-customers' ? 'bg-white dark:bg-emerald-400' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    />
                    <span>Customer Directory</span>
                  </button>
                  <button
                    onClick={() => setActiveView('view-customers')}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 cursor-pointer text-left"
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-slate-300 dark:bg-slate-600" />
                    <span>Due Receivables Ledger</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Section: Finance & Ledger */}
        <div>
          {!isSidebarCollapsed && (
            <p className="px-3 mb-1.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Finance & Ledger
            </p>
          )}

          <div className="space-y-0.5">
            {/* 6. Financial Reports & Analytics (Accordion Parent) */}
            <div>
              <button
                onClick={() => toggleAccordion('acc-reports')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 cursor-pointer"
              >
                <span className="shrink-0 text-slate-400 dark:text-slate-500">
                  <BarChart3 className="w-4.5 h-4.5" />
                </span>
                {!isSidebarCollapsed && (
                  <>
                    <span className="leading-none flex-1 text-left">Reports & Analytics</span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 text-slate-400 dark:text-slate-600 ${
                        openAccordions['acc-reports'] ? 'rotate-90' : ''
                      }`}
                    />
                  </>
                )}
              </button>

              {!isSidebarCollapsed && openAccordions['acc-reports'] && (
                <div className="ml-3 mt-0.5 mb-0.5 pl-3 border-l-2 border-slate-200 dark:border-slate-800/70 space-y-0.5 py-0.5">
                  <button
                    onClick={() => setActiveView('view-reports')}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                      activeView === 'view-reports'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 dark:bg-emerald-500/15 dark:text-emerald-400 dark:shadow-none dark:ring-1 dark:ring-emerald-500/20'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        activeView === 'view-reports' ? 'bg-white dark:bg-emerald-400' : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    />
                    <span>Profit & Loss Statement</span>
                  </button>
                  <button
                    onClick={() => setActiveView('view-reports')}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 cursor-pointer text-left"
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-slate-300 dark:bg-slate-600" />
                    <span>Daily Expense Vouchers</span>
                  </button>
                  <button
                    onClick={() => setActiveView('view-reports')}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 cursor-pointer text-left"
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-slate-300 dark:bg-slate-600" />
                    <span>Supplier Payment Ledger</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Section: Administration */}
        <div>
          {!isSidebarCollapsed && (
            <p className="px-3 mb-1.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Administration
            </p>
          )}

          <div className="space-y-0.5">
            {/* 7. Administration & HR (Accordion Parent) */}
            <div>
              <button
                onClick={() => toggleAccordion('acc-admin')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 cursor-pointer"
              >
                <span className="shrink-0 text-slate-400 dark:text-slate-500">
                  <Settings className="w-4.5 h-4.5" />
                </span>
                {!isSidebarCollapsed && (
                  <>
                    <span className="leading-none flex-1 text-left">Administration</span>
                    <ChevronRight
                      className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 text-slate-400 dark:text-slate-600 ${
                        openAccordions['acc-admin'] ? 'rotate-90' : ''
                      }`}
                    />
                  </>
                )}
              </button>

              {!isSidebarCollapsed && openAccordions['acc-admin'] && (
                <div className="ml-3 mt-0.5 mb-0.5 pl-3 border-l-2 border-slate-200 dark:border-slate-800/70 space-y-0.5 py-0.5">
                  <button
                    onClick={() => alert('Employees & Payroll module loaded.')}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 cursor-pointer text-left"
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-slate-300 dark:bg-slate-600" />
                    <span>Employees & Payroll</span>
                  </button>
                  <button
                    onClick={() => alert('Branch Stores management loaded.')}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 cursor-pointer text-left"
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-slate-300 dark:bg-slate-600" />
                    <span>Branch Store Outlets</span>
                  </button>
                  <button
                    onClick={() => alert('User Roles & Permissions loaded.')}
                    className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 cursor-pointer text-left"
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-slate-300 dark:bg-slate-600" />
                    <span>Roles & Permissions</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom User Profile Card */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
              AD
            </div>
            {!isSidebarCollapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Suman (Admin)</p>
                <p className="text-[10px] text-slate-400 truncate">Super Administrator</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setActiveView('view-login')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
