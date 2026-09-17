import React from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AddProductModal } from '@/app/modules/products/components/AddProductModal';
import { POSSliderDrawer } from '@/app/modules/invoices/components/POSSliderDrawer';

export interface MainLayoutProps {
    children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-100 dark:bg-[#060d17] text-slate-800 dark:text-slate-100 font-sans antialiased transition-colors duration-200 selection:bg-emerald-500 selection:text-white">
            <div id="main-app-shell" className="flex min-h-[calc(100vh-45px)] w-full">
                <Sidebar />
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
                        {children || <Outlet />}
                    </main>
                </div>
                <POSSliderDrawer />
                <AddProductModal />
            </div>
        </div>
    );
};
