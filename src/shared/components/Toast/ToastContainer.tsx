import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X, Sparkles } from 'lucide-react';
import type { ToastItem, ToastType } from './ToastContext';

export interface ToastContainerProps {
    toasts: ToastItem[];
    onRemove: (id: string) => void;
}

interface ToastTheme {
    border: string;
    glow: string;
    text: string;
    titleText: string;
    iconBg: string;
    iconColor: string;
    accentGradient: string;
    progressBar: string;
    icon: React.ComponentType<{ className?: string }>;
    defaultTitle: string;
}

const toastThemes: Record<ToastType, ToastTheme> = {
    success: {
        border: 'border-emerald-500/30 dark:border-emerald-500/40',
        glow: 'shadow-emerald-500/10 dark:shadow-emerald-950/40',
        text: 'text-slate-600 dark:text-slate-300',
        titleText: 'text-emerald-700 dark:text-emerald-400',
        iconBg: 'bg-emerald-500/15 border border-emerald-500/30',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        accentGradient: 'from-emerald-500 to-teal-400',
        progressBar: 'bg-gradient-to-r from-emerald-500 to-teal-400',
        icon: CheckCircle2,
        defaultTitle: 'Success'
    },
    error: {
        border: 'border-rose-500/30 dark:border-rose-500/40',
        glow: 'shadow-rose-500/10 dark:shadow-rose-950/40',
        text: 'text-slate-600 dark:text-slate-300',
        titleText: 'text-rose-700 dark:text-rose-400',
        iconBg: 'bg-rose-500/15 border border-rose-500/30',
        iconColor: 'text-rose-600 dark:text-rose-400',
        accentGradient: 'from-rose-500 to-pink-500',
        progressBar: 'bg-gradient-to-r from-rose-500 to-pink-500',
        icon: AlertCircle,
        defaultTitle: 'Error Occurred'
    },
    warning: {
        border: 'border-amber-500/30 dark:border-amber-500/40',
        glow: 'shadow-amber-500/10 dark:shadow-amber-950/40',
        text: 'text-slate-600 dark:text-slate-300',
        titleText: 'text-amber-700 dark:text-amber-400',
        iconBg: 'bg-amber-500/15 border border-amber-500/30',
        iconColor: 'text-amber-600 dark:text-amber-400',
        accentGradient: 'from-amber-500 to-yellow-400',
        progressBar: 'bg-gradient-to-r from-amber-500 to-yellow-400',
        icon: AlertTriangle,
        defaultTitle: 'Attention Needed'
    },
    info: {
        border: 'border-blue-500/30 dark:border-blue-500/40',
        glow: 'shadow-blue-500/10 dark:shadow-blue-950/40',
        text: 'text-slate-600 dark:text-slate-300',
        titleText: 'text-blue-700 dark:text-blue-400',
        iconBg: 'bg-blue-500/15 border border-blue-500/30',
        iconColor: 'text-blue-600 dark:text-blue-400',
        accentGradient: 'from-blue-500 to-indigo-400',
        progressBar: 'bg-gradient-to-r from-blue-500 to-indigo-400',
        icon: Info,
        defaultTitle: 'Information'
    }
};

const ToastMessageItem: React.FC<{ toast: ToastItem; onRemove: (id: string) => void }> = ({
    toast,
    onRemove
}) => {
    const { id, type, title, message, duration = 4000 } = toast;
    const theme = toastThemes[type] || toastThemes.info;
    const Icon = theme.icon;

    const [isExiting, setIsExiting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const remainingTimeRef = useRef(duration);
    const startTimeRef = useRef(Date.now());
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const triggerExit = () => {
        setIsExiting(true);
        setTimeout(() => {
            onRemove(id);
        }, 320);
    };

    useEffect(() => {
        if (duration <= 0) return;

        if (!isPaused) {
            startTimeRef.current = Date.now();
            timerRef.current = setTimeout(() => {
                triggerExit();
            }, remainingTimeRef.current);
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isPaused, duration]);

    const handleMouseEnter = () => {
        if (duration <= 0) return;
        setIsPaused(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        const elapsed = Date.now() - startTimeRef.current;
        remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
    };

    const handleMouseLeave = () => {
        if (duration <= 0) return;
        setIsPaused(false);
    };

    return (
        <div
            role="alert"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`pointer-events-auto relative overflow-hidden rounded-2xl border bg-white/95 dark:bg-[#0c1427]/95 backdrop-blur-xl shadow-2xl ${theme.border} ${theme.glow} ${
                isExiting ? 'toast-exit' : 'toast-enter'
            } transition-all duration-200 group`}>
            {/* Top Accent Gradient Bar */}
            <div className={`h-1 w-full bg-gradient-to-r ${theme.accentGradient}`} />

            <div className="p-4 flex items-start gap-3.5">
                {/* Icon Badge with subtle pulse */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${theme.iconBg} ${theme.iconColor}`}>
                    <Icon className="w-5 h-5" />
                </div>

                {/* Content Section */}
                <div className="flex-1 pt-0.5 min-w-0 pr-1 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                        <h4 className={`text-xs font-bold tracking-tight ${theme.titleText}`}>
                            {title || theme.defaultTitle}
                        </h4>
                        {type === 'success' && (
                            <Sparkles className="w-3 h-3 text-emerald-500 dark:text-emerald-400 shrink-0" />
                        )}
                    </div>
                    <p className={`text-xs ${theme.text} leading-relaxed font-medium break-words`}>
                        {message}
                    </p>
                </div>

                {/* Close Button */}
                <button
                    onClick={triggerExit}
                    title="Dismiss"
                    className="p-1.5 -mr-1 -mt-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer shrink-0">
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Bottom Shrinking Progress Bar */}
            {duration > 0 && (
                <div className="h-0.5 w-full bg-slate-100 dark:bg-slate-800/80 overflow-hidden">
                    <div
                        className={`h-full ${theme.progressBar} toast-progress-bar`}
                        style={{
                            animationDuration: `${duration}ms`,
                            animationPlayState: isPaused ? 'paused' : 'running'
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
    if (toasts.length === 0) return null;

    return (
        <aside
            aria-label="Notifications"
            className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none sm:max-w-md">
            {toasts.map((toast) => (
                <ToastMessageItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </aside>
    );
};

export default ToastContainer;
