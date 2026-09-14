import React, { useState } from 'react'
import {
  Store,
  BarChart2,
  Users,
  Sparkles,
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'
import { useApp } from '@/app/providers/AppProvider'

export const LoginPage: React.FC = () => {
  const { setActiveView } = useApp()
  const [username, setUsername] = useState('suman')
  const [password, setPassword] = useState('12345678')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  const handleFillDemo = () => {
    setUsername('suman')
    setPassword('12345678')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveView('view-dashboard')
  }

  return (
    <section className="min-h-[calc(100vh-45px)] w-full flex flex-col items-center justify-center bg-white dark:bg-[#060d17] relative overflow-hidden p-4 sm:p-6 lg:p-12 transition-colors">
      {/* Shared background — dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Shared glow orbs */}
      <div className="absolute -top-32 -left-32 w-96 sm:w-[500px] h-96 sm:h-[500px] rounded-full bg-indigo-300/30 dark:bg-indigo-600/10 blur-[120px] pointer-events-none anim-blob-1" />
      <div className="absolute -bottom-20 -right-20 w-80 sm:w-[400px] h-80 sm:h-[400px] rounded-full bg-violet-300/25 dark:bg-violet-600/10 blur-[100px] pointer-events-none anim-blob-2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-200/20 dark:bg-blue-600/10 blur-[100px] pointer-events-none" />

      {/* Shared geometric arcs */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
        <svg width="100%" height="100%" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" fill="none">
          <circle cx="1100" cy="80" r="260" stroke="#6366f1" strokeWidth="80" />
          <circle cx="1100" cy="80" r="420" stroke="#6366f1" strokeWidth="1" />
          <circle cx="80" cy="780" r="180" stroke="#6366f1" strokeWidth="60" />
        </svg>
      </div>

      {/* Login Container */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14 w-full max-w-[1240px] relative z-10">
        
        {/* Left Brand Panel */}
        <div className="hidden lg:flex relative w-full flex-col z-10 flex-1 px-4 lg:px-8 py-6">
          <div className="relative z-10 flex flex-col justify-between flex-1 space-y-10">
            
            {/* Logo */}
            <div className="flex items-center gap-2.5 anim-left-1">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-lg shadow-indigo-500/30">
                ej
              </div>
              <span className="text-slate-900 dark:text-white font-bold text-lg tracking-tight">Emojud</span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 border border-slate-200 dark:border-slate-800 rounded-full px-2 py-0.5">
                ERP
              </span>
            </div>

            {/* Hero Pitch */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 anim-left-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-indigo-500">Smart Business Platform</p>
              </div>

              <h1 className="text-4xl xl:text-5xl font-extrabold text-slate-900 dark:text-white leading-[1.15] tracking-tight anim-left-2">
                Run your business <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                  Effortlessly.
                </span>
              </h1>

              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-md anim-left-3">
                One platform for multi-shop sales, inventory sync, supplier ledger, HR payroll, and real-time financial analytics.
              </p>

              {/* Feature list with icons */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4 anim-left-1">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">Multi-Shop Control</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">All branches and warehouses from one unified dashboard</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 anim-left-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-indigo-100 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                    <BarChart2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">Live Analytics & POS</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Thermal barcode invoicing, revenue & stock in real time</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 anim-left-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">HR & Payroll</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Employees, attendance records, and salary simplified</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust footer */}
            <div className="flex items-center gap-3 pt-6 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex -space-x-2 shrink-0">
                <div className="w-6 h-6 rounded-full border-2 border-white dark:border-[#0d1729] bg-blue-400" />
                <div className="w-6 h-6 rounded-full border-2 border-white dark:border-[#0d1729] bg-violet-400" />
                <div className="w-6 h-6 rounded-full border-2 border-white dark:border-[#0d1729] bg-cyan-400" />
                <div className="w-6 h-6 rounded-full border-2 border-white dark:border-[#0d1729] bg-emerald-400" />
                <div className="w-6 h-6 rounded-full border-2 border-white dark:border-[#0d1729] bg-amber-400" />
              </div>
              <span>Trusted across retail, wholesale, and corporate branches</span>
            </div>

          </div>
        </div>

        {/* Right Form Card */}
        <div className="w-full max-w-md relative z-10 mx-auto anim-float-1">
          <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800 rounded-[2rem] shadow-2xl shadow-slate-900/10 p-6 sm:p-8 form-panel-glow">
            
            {/* Mobile logo header */}
            <div className="lg:hidden flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-lg shadow-indigo-500/30">
                ej
              </div>
              <span className="text-slate-900 dark:text-white font-bold text-lg tracking-tight">Emojud</span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 border border-slate-300 dark:border-slate-700 rounded-full px-2 py-0.5">
                ERP
              </span>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Welcome back</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Sign in with your branch credentials to access ERP</p>
            </div>

            {/* Instant 1-Click Demo Login Box */}
            <div className="mb-5 p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> 1-Click Demo Login
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                  Ready
                </span>
              </div>
              <button
                type="button"
                onClick={handleFillDemo}
                className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Auto-Fill Demo (suman / 12345678)</span>
              </button>
            </div>

            {/* Login Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Username / Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <UserIcon className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Security Password</label>
                  <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20 cursor-pointer"
                  />
                  <span>Keep me signed in</span>
                </label>
                <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> TLS 256-bit
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl btn-shimmer text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Sign In to Emojud</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Footer live link */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80 text-center">
              <a
                href="https://emojud.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Deployed App (emojud.vercel.app)</span>
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
