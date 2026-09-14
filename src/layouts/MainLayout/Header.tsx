import React, { useState } from 'react'
import {
  Menu,
  Search,
  PlusCircle,
  Bell,
  Sun,
  Moon,
} from 'lucide-react'
import { useApp } from '@/app/providers/AppProvider'

export const Header: React.FC = () => {
  const {
    openPOSDrawer,
    isDarkMode,
    toggleTheme,
    toggleMobileSidebar,
  } = useApp()

  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  return (
    <header className="h-16 px-4 lg:px-6 bg-white dark:bg-[#0d1729] border-b border-slate-200/80 dark:border-slate-800/60 flex items-center justify-between gap-4 shrink-0">
      {/* Left: Search & Mobile Menu Toggle */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={toggleMobileSidebar}
          className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search invoice #, SKU barcode, customer or phone (Ctrl + K)..."
            className="w-full pl-9 pr-12 py-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 border-none text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium"
          />
          <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 shadow-xs">
              ⌘K
            </kbd>
          </span>
        </div>
      </div>

      {/* Right: Actions, Notifications, Theme Toggle, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* + New Invoice / POS Sale button */}
        <button
          onClick={openPOSDrawer}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm shadow-emerald-600/25 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">New POS Sale</span>
        </button>

        {/* Notifications with dropdown toggle */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationOpen((prev) => !prev)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#0d1729]" />
          </button>

          {/* Notifications Dropdown Box */}
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden text-xs">
              <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">Recent Notifications</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold cursor-pointer">
                  Mark all as read
                </span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-64 overflow-y-auto">
                <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer flex gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">New purchase order received</p>
                    <p className="text-[11px] text-slate-400">PO-2026-0041 from Apex Sourcing Ltd.</p>
                    <span className="text-[9px] text-slate-400">2 mins ago</span>
                  </div>
                </div>
                <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer flex gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">Salary processed for September</p>
                    <p className="text-[11px] text-slate-400">24 employees paid successfully</p>
                    <span className="text-[9px] text-slate-400">1 hour ago</span>
                  </div>
                </div>
                <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer flex gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">Low stock alert</p>
                    <p className="text-[11px] text-slate-400">Formal Silk Tie SKU-889 below threshold</p>
                    <span className="text-[9px] text-slate-400">3 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dark/Light Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5" />}
        </button>

        {/* Live Connection status indicator */}
        <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium text-slate-600 dark:text-slate-300">Live Register Connected</span>
        </div>
      </div>
    </header>
  )
}
