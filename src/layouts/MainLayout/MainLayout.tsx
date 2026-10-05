import React from 'react';
import { Outlet } from 'react-router';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export interface MainLayoutProps {
    children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="h-screen w-full flex overflow-hidden bg-slate-100 dark:bg-[#060d17] text-slate-800 dark:text-slate-100 font-sans antialiased transition-colors duration-200 selection:bg-emerald-500 selection:text-white">
            <div id="main-app-shell" className="flex h-screen w-full overflow-hidden">
                {/* Fixed-height sidebar with independent internal scroll */}
                <Sidebar />

                {/* Main Content Viewport with Fixed Header & Independently Scrollable Page Body */}
                <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                    <Header />
                    <main className="flex-1 min-h-0 overflow-y-auto p-4 lg:p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                        {children || <Outlet />}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;
