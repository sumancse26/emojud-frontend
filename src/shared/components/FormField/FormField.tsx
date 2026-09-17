import React from 'react';

export interface FormFieldProps {
    label: string;
    required?: boolean;
    error?: string;
    hint?: string;
    children: React.ReactNode;
    className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
    label,
    required,
    error,
    hint,
    children,
    className = '',
}) => (
    <div className={`space-y-1.5 ${className}`}>
        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">
            {label}
            {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
        {children}
        {error && (
            <p className="text-[10px] text-rose-500 font-medium">{error}</p>
        )}
        {hint && !error && (
            <p className="text-[10px] text-slate-400 font-medium">{hint}</p>
        )}
    </div>
);

/** Shared input class names for consistency */
export const inputClasses =
    'w-full px-3 py-2.5 text-xs font-medium rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition';

export const selectClasses =
    'w-full px-3 py-2.5 text-xs font-medium rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition appearance-none cursor-pointer';

export const textareaClasses =
    'w-full px-3 py-2.5 text-xs font-medium rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition resize-none';
