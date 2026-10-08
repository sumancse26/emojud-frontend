import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastContainer } from './ToastContainer';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
    id: string;
    type: ToastType;
    title?: string;
    message: string;
    duration?: number;
}

export interface ToastOptions {
    title?: string;
    duration?: number;
}

export interface ToastContextType {
    showToast: (message: string, type?: ToastType, options?: ToastOptions) => void;
    success: (message: string, options?: ToastOptions) => void;
    error: (message: string, options?: ToastOptions) => void;
    warning: (message: string, options?: ToastOptions) => void;
    info: (message: string, options?: ToastOptions) => void;
    removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export interface ToastProviderProps {
    children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback(
        (message: string, type: ToastType = 'info', options?: ToastOptions) => {
            const id = Math.random().toString(36).substring(2, 9);
            const newToast: ToastItem = {
                id,
                type,
                title: options?.title,
                message,
                duration: options?.duration ?? 4000
            };

            setToasts((prev) => [...prev, newToast]);
        },
        []
    );

    const success = useCallback(
        (message: string, options?: ToastOptions) => {
            showToast(message, 'success', options);
        },
        [showToast]
    );

    const error = useCallback(
        (message: string, options?: ToastOptions) => {
            showToast(message, 'error', options);
        },
        [showToast]
    );

    const warning = useCallback(
        (message: string, options?: ToastOptions) => {
            showToast(message, 'warning', options);
        },
        [showToast]
    );

    const info = useCallback(
        (message: string, options?: ToastOptions) => {
            showToast(message, 'info', options);
        },
        [showToast]
    );

    return (
        <ToastContext.Provider value={{ showToast, success, error, warning, info, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export default ToastProvider;
