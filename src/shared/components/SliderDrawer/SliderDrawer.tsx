import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

/* ================= TYPES & INTERFACES ================= */

export interface SliderDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    width?: string;
    children: React.ReactNode;
    className?: string;
    /** Convenience prop – auto-generates a Header when provided */
    title?: string;
    /** Subtitle shown below the title */
    subtitle?: string;
    /** Icon element rendered in the header badge */
    icon?: React.ReactNode;
    /** Footer content rendered inside SliderDrawer.Footer */
    footer?: React.ReactNode;
}

export interface SliderDrawerHeaderProps {
    children?: React.ReactNode;
    onClose?: () => void;
    className?: string;
}

export interface SliderDrawerBodyProps {
    children: React.ReactNode;
    className?: string;
}

export interface SliderDrawerFooterProps {
    children: React.ReactNode;
    className?: string;
}

const SliderDrawerHeader: React.FC<SliderDrawerHeaderProps> = ({ children, onClose, className = '' }) => {
    const handleClose = onClose;

    return (
        <div
            className={`shrink-0 px-5 py-4 border-b border-slate-200/80 dark:border-slate-800/70 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/30 ${className}`}>
            {children}
            {handleClose && (
                <button
                    type="button"
                    onClick={handleClose}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer shrink-0"
                    title="Close">
                    <X className="w-5 h-5" />
                </button>
            )}
        </div>
    );
};

const SliderDrawerBody: React.FC<SliderDrawerBodyProps> = ({ children, className = '' }) => (
    <div className={`flex-1 overflow-y-auto px-5 py-5 ${className}`}>{children}</div>
);

const SliderDrawerFooter: React.FC<SliderDrawerFooterProps> = ({ children, className = '' }) => (
    <div
        className={`shrink-0 px-5 py-4 border-t border-slate-200/80 dark:border-slate-800/70 bg-slate-50/80 dark:bg-slate-900/40 ${className}`}>
        {children}
    </div>
);

/* ================= PRESENTER COMPONENT ================= */

export const SliderDrawer: React.FC<SliderDrawerProps> & {
    Header: typeof SliderDrawerHeader;
    Body: typeof SliderDrawerBody;
    Footer: typeof SliderDrawerFooter;
} = ({ isOpen, onClose, width = 'max-w-xl', children, className = '' }) => {
    const [isMounted, setIsMounted] = useState(isOpen);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsMounted(true);
            const animFrame = requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsVisible(true);
                });
            });
            return () => cancelAnimationFrame(animFrame);
        } else {
            setIsVisible(false);
            const timer = setTimeout(() => {
                setIsMounted(false);
            }, 400);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isMounted) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isMounted, onClose]);

    if (!isMounted) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-400 ease-in-out ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Aside Panel */}
            <aside
                role="dialog"
                aria-modal="true"
                className={`fixed inset-y-0 right-0 z-50 w-full ${width} flex flex-col bg-white dark:bg-[#0a1020] border-l border-slate-200 dark:border-slate-800/80 shadow-2xl transform transition-transform duration-400 ease-in-out ${
                    isVisible ? 'translate-x-0' : 'translate-x-full'
                } ${className}`}>
                {children}
            </aside>
        </div>
    );
};

SliderDrawer.Header = SliderDrawerHeader;
SliderDrawer.Body = SliderDrawerBody;
SliderDrawer.Footer = SliderDrawerFooter;

export default SliderDrawer;
