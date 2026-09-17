import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

export interface SliderDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    icon?: React.ReactNode;
    width?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export const SliderDrawer: React.FC<SliderDrawerProps> = ({
    isOpen,
    onClose,
    title,
    subtitle,
    icon,
    width = 'max-w-xl',
    children,
    footer,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const drawerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            // Small delay to trigger CSS transition
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsAnimating(true);
                });
            });
        } else {
            setIsAnimating(false);
            const timer = setTimeout(() => setIsVisible(false), 350);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Close on ESC key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isVisible) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50"
                style={{
                    backgroundColor: isAnimating ? 'rgba(2, 6, 23, 0.6)' : 'rgba(2, 6, 23, 0)',
                    backdropFilter: isAnimating ? 'blur(6px)' : 'blur(0px)',
                    WebkitBackdropFilter: isAnimating ? 'blur(6px)' : 'blur(0px)',
                    transition: 'background-color 350ms cubic-bezier(0.4, 0, 0.2, 1), backdrop-filter 350ms cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <aside
                ref={drawerRef}
                className={`fixed inset-y-0 right-0 z-50 w-full ${width} flex flex-col bg-white dark:bg-[#0a1020] border-l border-slate-200 dark:border-slate-800/80`}
                style={{
                    transform: isAnimating ? 'translateX(0)' : 'translateX(100%)',
                    boxShadow: isAnimating
                        ? '-20px 0 60px -10px rgba(0, 0, 0, 0.35), -8px 0 20px -6px rgba(0, 0, 0, 0.2)'
                        : 'none',
                    transition: 'transform 350ms cubic-bezier(0.32, 0.72, 0, 1), box-shadow 350ms cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                {/* Header */}
                <div className="shrink-0 px-5 py-4 border-b border-slate-200/80 dark:border-slate-800/70 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/30">
                    <div className="flex items-center gap-3 min-w-0">
                        {icon && (
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                                {icon}
                            </div>
                        )}
                        <div className="min-w-0">
                            <h2 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                                {title}
                            </h2>
                            {subtitle && (
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
                        title="Close (Esc)"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto px-5 py-5">
                    {children}
                </div>

                {/* Footer (optional) */}
                {footer && (
                    <div className="shrink-0 px-5 py-4 border-t border-slate-200/80 dark:border-slate-800/70 bg-slate-50/80 dark:bg-slate-900/40">
                        {footer}
                    </div>
                )}
            </aside>
        </>
    );
};
