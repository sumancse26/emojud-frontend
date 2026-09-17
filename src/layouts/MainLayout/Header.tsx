import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, Sun, Moon, LogOut, ChevronDown, User, Shield, Store } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useApp } from '@/app/providers/AppProvider';
import { ROUTES } from '@/app/routes/paths';

export const Header: React.FC = () => {
    const navigate = useNavigate();
    const {
        isDarkMode,
        toggleTheme,
        toggleMobileSidebar
    } = useApp();

    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const profileMenuRef = useRef<HTMLDivElement>(null);
    const notificationMenuRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
            if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target as Node)) {
                setIsNotificationOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignOut = () => {
        setIsProfileMenuOpen(false);
        navigate(ROUTES.AUTH.LOGIN);
    };

    return (
        <header className="h-16 px-4 lg:px-6 bg-white dark:bg-[#0d1729] border-b border-slate-200/80 dark:border-slate-800/60 flex items-center justify-between gap-4 shrink-0">
            {/* Left: Search & Mobile Menu Toggle */}
            <div className="flex items-center gap-3 flex-1 max-w-md">
                <button
                    onClick={toggleMobileSidebar}
                    className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    title="Toggle Navigation">
                    <Menu className="w-5 h-5" />
                </button>

                <div className="relative w-full">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Search className="w-4 h-4" />
                    </span>
                    <input
                        type="text"
                        placeholder="Search invoice #, SKU barcode, customer or phone (Ctrl + K)..."
                        className="w-full pl-9 pr-12 py-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 border-none text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium"
                    />
                    <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                        <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 shadow-xs">
                            ⌘K
                        </kbd>
                    </span>
                </div>
            </div>

            {/* Right: Actions, Notifications, Theme Toggle, Profile & Logout */}
            <div className="flex items-center gap-2 sm:gap-3">
                {/* Live Connection status indicator */}
                <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-xs mr-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-semibold text-[11px] text-emerald-700 dark:text-emerald-400">Live Register</span>
                </div>

                {/* Notifications with dropdown toggle */}
                <div className="relative" ref={notificationMenuRef}>
                    <button
                        onClick={() => setIsNotificationOpen((prev) => !prev)}
                        className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
                        title="Notifications">
                        <Bell className="w-4.5 h-4.5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#0d1729]" />
                    </button>

                    {/* Notifications Dropdown Box */}
                    {isNotificationOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden text-xs">
                            <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <span className="font-bold text-slate-900 dark:text-white">Recent Notifications</span>
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold cursor-pointer">
                                    Mark all as read
                                </span>
                            </div>
                            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-64 overflow-y-auto">
                                <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer flex gap-2.5">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-slate-200">
                                            New purchase order received
                                        </p>
                                        <p className="text-[11px] text-slate-400">
                                            PO-2026-0041 from Apex Sourcing Ltd.
                                        </p>
                                        <span className="text-[9px] text-slate-400">2 mins ago</span>
                                    </div>
                                </div>
                                <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer flex gap-2.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-slate-200">
                                            Salary processed for September
                                        </p>
                                        <p className="text-[11px] text-slate-400">24 employees paid successfully</p>
                                        <span className="text-[9px] text-slate-400">1 hour ago</span>
                                    </div>
                                </div>
                                <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer flex gap-2.5">
                                    <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-slate-200">Low stock alert</p>
                                        <p className="text-[11px] text-slate-400">
                                            Formal Silk Tie SKU-889 below threshold
                                        </p>
                                        <span className="text-[9px] text-slate-400">3 hours ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Dark/Light Theme Switcher Button */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Toggle Theme">
                    {isDarkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5" />}
                </button>

                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

                {/* User Profile & Logout Section */}
                <div className="relative" ref={profileMenuRef}>
                    <button
                        onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                        className="flex items-center gap-2.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all cursor-pointer group">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 ring-2 ring-emerald-500/30">
                            AD
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                                Suman (Admin)
                            </p>
                            <p className="text-[10px] text-slate-400 leading-tight">
                                Super Administrator
                            </p>
                        </div>
                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Profile Dropdown Menu */}
                    {isProfileMenuOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden text-xs py-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
                            {/* Profile Header */}
                            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shadow-emerald-500/30">
                                        AD
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="font-bold text-slate-900 dark:text-white truncate">
                                            Suman Roy
                                        </p>
                                        <p className="text-[10px] text-slate-400 truncate">
                                            suman.admin@emojud.com
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2.5 flex items-center gap-1.5">
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                        Super Admin
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                        • All Branches Access
                                    </span>
                                </div>
                            </div>

                            {/* Menu Links */}
                            <div className="py-1">
                                <button
                                    onClick={() => {
                                        setIsProfileMenuOpen(false);
                                        navigate(ROUTES.CONFIGURATIONS.USER_SHOP_PERMISSION);
                                    }}
                                    className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left cursor-pointer">
                                    <Shield className="w-4 h-4 text-slate-400" />
                                    <span>Access & Permissions</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setIsProfileMenuOpen(false);
                                        navigate(ROUTES.CONFIGURATIONS.SHOPS);
                                    }}
                                    className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left cursor-pointer">
                                    <Store className="w-4 h-4 text-slate-400" />
                                    <span>Store Outlets</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setIsProfileMenuOpen(false);
                                        navigate(ROUTES.HR.EMPLOYEES);
                                    }}
                                    className="w-full flex items-center gap-2.5 px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left cursor-pointer">
                                    <User className="w-4 h-4 text-slate-400" />
                                    <span>My Staff Profile</span>
                                </button>
                            </div>

                            {/* Logout Action */}
                            <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-bold transition-colors text-left cursor-pointer">
                                    <LogOut className="w-4 h-4" />
                                    <span>Sign Out / Logout</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Quick 1-click Logout Icon Button */}
                <button
                    onClick={handleSignOut}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Quick Sign Out">
                    <LogOut className="w-4.5 h-4.5" />
                </button>
            </div>
        </header>
    );
};

