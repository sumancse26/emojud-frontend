import React from 'react';
import { Store, BarChart2, Users, Sparkles, AlertCircle } from 'lucide-react';
import { LoginForm } from '../../components/LoginForm';
import type { LoginCredentials } from '../../types/auth.types';

export interface LoginPresenterProps {
    formData: LoginCredentials;
    isLoading: boolean;
    error: string | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFillDemo: () => void;
    onSubmit: (credentials: LoginCredentials) => Promise<void> | void;
}

export const LoginPresenter: React.FC<LoginPresenterProps> = ({
    formData,
    isLoading,
    error,
    onChange,
    onFillDemo,
    onSubmit
}) => {
    return (
        <section className="min-h-screen w-full flex flex-col justify-between items-center bg-white dark:bg-[#060d17] relative overflow-hidden px-4 py-6 sm:px-6 sm:py-8 lg:px-12 transition-colors">
            {/* Shared background — dot grid */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, rgba(16,185,129,0.12) 1px, transparent 1px)',
                    backgroundSize: '28px 28px'
                }}
            />

            {/* Shared glow orbs */}
            <div className="absolute -top-32 -left-32 w-96 sm:w-[500px] h-96 sm:h-[500px] rounded-full bg-emerald-300/30 dark:bg-emerald-600/10 blur-[120px] pointer-events-none anim-blob-1" />
            <div className="absolute -bottom-20 -right-20 w-80 sm:w-[400px] h-80 sm:h-[400px] rounded-full bg-teal-300/25 dark:bg-teal-600/10 blur-[100px] pointer-events-none anim-blob-2" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-green-200/20 dark:bg-green-600/10 blur-[100px] pointer-events-none" />

            {/* Shared geometric arcs */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]">
                <svg width="100%" height="100%" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" fill="none">
                    <circle cx="1100" cy="80" r="260" stroke="#10b981" strokeWidth="80" />
                    <circle cx="1100" cy="80" r="420" stroke="#10b981" strokeWidth="1" />
                    <circle cx="80" cy="780" r="180" stroke="#10b981" strokeWidth="60" />
                </svg>
            </div>

            {/* Main Content Area: Brand Panel + Form Card */}
            <main className="flex-1 flex items-center justify-center w-full relative z-10 py-6">
                <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14 w-full max-w-[1240px]">
                    {/* Left Brand Panel */}
                    <div className="hidden lg:flex relative w-full flex-col z-10 flex-1 px-4 lg:px-8 py-6">
                        <div className="relative z-10 flex flex-col justify-between flex-1 space-y-10">
                            {/* Logo */}
                            <div className="flex items-center gap-2.5 anim-left-1">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-extrabold text-sm shadow-lg shadow-emerald-500/30">
                                    ej
                                </div>
                                <span className="text-slate-900 dark:text-white font-bold text-lg tracking-tight">
                                    Emojud
                                </span>
                                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 border border-slate-200 dark:border-slate-800 rounded-full px-2 py-0.5">
                                    ERP
                                </span>
                            </div>

                            {/* Hero Pitch */}
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 anim-left-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400">
                                        Smart Business Platform
                                    </p>
                                </div>

                                <h1 className="text-4xl xl:text-5xl font-extrabold text-slate-900 dark:text-white leading-[1.15] tracking-tight anim-left-2">
                                    Run your business <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-500 to-teal-400">
                                        Effortlessly.
                                    </span>
                                </h1>

                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-md anim-left-3">
                                    One platform for multi-shop sales, inventory sync, supplier ledger, HR payroll, and
                                    real-time financial analytics.
                                </p>

                                {/* Feature list with icons */}
                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center gap-4 anim-left-1">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                            <Store className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                                                Multi-Shop Control
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                All branches and warehouses from one unified dashboard
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 anim-left-2">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-teal-100 dark:bg-teal-500/15 text-teal-600 dark:text-teal-400">
                                            <BarChart2 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                                                Live Analytics & POS
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                Thermal barcode invoicing, revenue & stock in real time
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 anim-left-3">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-green-100 dark:bg-green-500/15 text-green-600 dark:text-green-400">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                                                HR & Payroll
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                Employees, attendance records, and salary simplified
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Form Card */}
                    <div className="w-full max-w-md relative z-10 mx-auto anim-float-1">
                        <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800 rounded-[2rem] shadow-2xl shadow-slate-900/10 p-6 sm:p-8 form-panel-glow">
                            {/* Mobile logo header */}
                            <div className="lg:hidden flex items-center gap-2.5 mb-6">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-extrabold text-sm shadow-lg shadow-emerald-500/30">
                                    ej
                                </div>
                                <span className="text-slate-900 dark:text-white font-bold text-lg tracking-tight">
                                    Emojud
                                </span>
                                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 border border-slate-300 dark:border-slate-700 rounded-full px-2 py-0.5">
                                    ERP
                                </span>
                            </div>

                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                    Welcome back
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Sign in with your branch credentials to access ERP
                                </p>
                            </div>

                            {/* Instant 1-Click Demo Login Box */}
                            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5" /> 1-Click Demo Login
                                    </span>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                                        Ready
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={onFillDemo}
                                    className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer">
                                    <span>Auto-Fill Demo (suman / 12345678)</span>
                                </button>
                            </div>

                            {/* Error Banner */}
                            {error && (
                                <div className="mb-4 flex items-start gap-2.5 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-xs">
                                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Login Form Component */}
                            <LoginForm
                                formData={formData}
                                onChange={onChange}
                                onSubmit={onSubmit}
                                isLoading={isLoading}
                            />
                        </div>
                    </div>
                </div>
            </main>

            {/* Trust footer */}
            <footer className="w-full relative z-10 pt-4 pb-2 flex justify-center items-center">
                <div className="flex items-center gap-3 pt-4  text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex -space-x-2 shrink-0">
                        <div className="w-6 h-6 rounded-full border-2 border-white dark:border-[#0d1729] bg-emerald-400" />
                        <div className="w-6 h-6 rounded-full border-2 border-white dark:border-[#0d1729] bg-teal-400" />
                        <div className="w-6 h-6 rounded-full border-2 border-white dark:border-[#0d1729] bg-green-400" />
                        <div className="w-6 h-6 rounded-full border-2 border-white dark:border-[#0d1729] bg-cyan-400" />
                        <div className="w-6 h-6 rounded-full border-2 border-white dark:border-[#0d1729] bg-emerald-500" />
                    </div>
                    <span>Trusted across retail, wholesale, and corporate branches</span>
                </div>
            </footer>
        </section>
    );
};

export default LoginPresenter;
