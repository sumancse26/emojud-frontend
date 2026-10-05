import React, { useState } from 'react';
import { User as UserIcon, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import type { LoginCredentials } from '../types/auth.types';

export interface LoginFormProps {
    formData: LoginCredentials;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (credentials: LoginCredentials) => Promise<void> | void;
    isLoading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
    formData,
    onChange,
    onSubmit,
    isLoading = false
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Username / Email
                </label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <UserIcon className="w-4 h-4" />
                    </span>
                    <input
                        type="text"
                        name="username"
                        value={formData.username ?? ''}
                        onChange={onChange}
                        placeholder="Enter username"
                        required
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                    />
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Security Password
                    </label>
                    <a
                        href="#forgot"
                        onClick={(e) => e.preventDefault()}
                        className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
                        Forgot password?
                    </a>
                </div>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                    </span>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password ?? ''}
                        onChange={onChange}
                        placeholder="••••••••"
                        required
                        minLength={8}
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        name="rememberMe"
                        checked={Boolean(formData.rememberMe)}
                        onChange={onChange}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20 cursor-pointer"
                    />
                    <span>Keep me signed in</span>
                </label>
                <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" /> TLS 256-bit
                </span>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl btn-shimmer text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Signing in…</span>
                    </>
                ) : (
                    <>
                        <span>Sign In to Emojud</span>
                        <ArrowRight className="w-4 h-4" />
                    </>
                )}
            </button>
        </form>
    );
};
