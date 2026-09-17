import React, { useState, useEffect, useMemo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router';
import {
    ChevronsLeft,
    ChevronRight,
    ChevronDown,
    Layers,
    LayoutDashboard,
    Settings,
    Users,
    Package,
    Boxes,
    ReceiptText,
    BarChart3
} from 'lucide-react';
import { useApp } from '@/app/providers/AppProvider';
import { NAV_MENU_DATA } from '@/config/nav-menu.data';
import type { NavMenuItem } from '@/app/routes/types';
import { ROUTES } from '@/app/routes/paths';

// Fallback icon selector if SVG string is not provided or fails to render
const getFallbackIcon = (moduleName: string) => {
    switch (moduleName.toUpperCase()) {
        case 'HOME':
            return <LayoutDashboard className="w-4.5 h-4.5" />;
        case 'CONFIGURATIONS':
            return <Settings className="w-4.5 h-4.5" />;
        case 'HR':
            return <Users className="w-4.5 h-4.5" />;
        case 'PRODUCTS':
            return <Package className="w-4.5 h-4.5" />;
        case 'INVENTORY':
            return <Boxes className="w-4.5 h-4.5" />;
        case 'STOCK MANAGEMENT':
            return <Layers className="w-4.5 h-4.5" />;
        case 'ACCOUNTS':
            return <ReceiptText className="w-4.5 h-4.5" />;
        case 'REPORTS':
            return <BarChart3 className="w-4.5 h-4.5" />;
        default:
            return <Layers className="w-4.5 h-4.5" />;
    }
};

const NavIconRenderer: React.FC<{ item: NavMenuItem; isActive?: boolean }> = ({ item }) => {
    if (item.feature_icon && item.feature_icon.includes('<svg')) {
        return (
            <span
                className="inline-flex items-center justify-center shrink-0 w-4.5 h-4.5 [&>svg]:w-4.5 [&>svg]:h-4.5 [&>svg]:stroke-current"
                dangerouslySetInnerHTML={{ __html: item.feature_icon }}
            />
        );
    }
    return <span className="shrink-0">{getFallbackIcon(item.module_name)}</span>;
};

export const Sidebar: React.FC<{ menuData?: NavMenuItem[] }> = ({ menuData = NAV_MENU_DATA }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const {
        isSidebarCollapsed,
        toggleSidebarCollapse,
        isMobileSidebarOpen,
        selectedBranch,
        setSelectedBranch
    } = useApp();

    const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({});

    // Auto-expand accordion if child route is active on page load or navigation
    useEffect(() => {
        const currentPath = location.pathname;
        const newAccordionState: Record<string, boolean> = {};

        menuData.forEach((parent) => {
            if (parent.children && parent.children.length > 0) {
                const hasActiveChild = parent.children.some(
                    (child) => child.route_url && currentPath.startsWith(child.route_url)
                );
                if (hasActiveChild) {
                    newAccordionState[parent.id] = true;
                }
            }
        });

        if (Object.keys(newAccordionState).length > 0) {
            setOpenAccordions((prev) => ({ ...prev, ...newAccordionState }));
        }
    }, [location.pathname, menuData]);

    const toggleAccordion = (parentId: string) => {
        setOpenAccordions((prev) => ({
            ...prev,
            [parentId]: !prev[parentId]
        }));
    };

    // Grouping items into sections for enterprise ERP UX
    const groupedMenu = useMemo(() => {
        return menuData;
    }, [menuData]);

    return (
        <aside
            className={`${
                isSidebarCollapsed ? 'w-20' : 'w-64'
            } shrink-0 bg-white dark:bg-[#080d1a] border-r border-slate-200/80 dark:border-slate-800/60 flex flex-col justify-between transition-all duration-300 ${
                isMobileSidebarOpen
                    ? 'flex fixed inset-y-0 left-0 z-40 shadow-2xl md:relative md:shadow-none'
                    : 'hidden md:flex'
            }`}>
            {/* Top Branding & Shop selector */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center justify-between mb-4">
                    <div
                        onClick={() => navigate(ROUTES.HOME.DASHBOARD)}
                        className="flex items-center gap-2.5 cursor-pointer">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-extrabold text-[11px] tracking-tight shadow-lg shadow-blue-500/30 shrink-0 font-mono">
                            E
                        </div>
                        {!isSidebarCollapsed && (
                            <div>
                                <h2 className="font-bold text-sm tracking-tight leading-tight text-slate-900 dark:text-white">
                                    Emojud ERP
                                </h2>
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">
                                    Enterprise POS
                                </span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={toggleSidebarCollapse}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer transition-colors"
                        title="Collapse Sidebar">
                        <ChevronsLeft
                            className={`w-4 h-4 transition-transform ${isSidebarCollapsed ? 'rotate-180' : ''}`}
                        />
                    </button>
                </div>

                {/* Current Branch Selector Dropdown */}
                {!isSidebarCollapsed && (
                    <div className="relative">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                            Active Store Branch
                        </label>
                        <div className="relative">
                            <select
                                value={selectedBranch}
                                onChange={(e) => setSelectedBranch(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium cursor-pointer appearance-none">
                                <option value="1">📍 Dhanmondi Flagship Outlet</option>
                                <option value="2">📍 Gulshan Branch Outlet</option>
                                <option value="3">📍 Central Warehouse (Savar)</option>
                                <option value="4">📍 Chittagong Distribution Hub</option>
                            </select>
                            <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                                <ChevronDown className="w-3.5 h-3.5" />
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Dynamic Navigation Links */}
            <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                {groupedMenu.map((item) => {
                    const hasChildren = item.children && item.children.length > 0;
                    const isOpen = openAccordions[item.id] ?? false;

                    if (!hasChildren) {
                        const targetUrl = item.route_url || '#';
                        const isRouteActive =
                            targetUrl !== '#' &&
                            (location.pathname === targetUrl ||
                                (targetUrl !== '/feature/dashboard' &&
                                    location.pathname.startsWith(targetUrl)));

                        return (
                            <NavLink
                                key={item.id}
                                to={targetUrl}
                                className={`w-full group relative flex items-center rounded-xl text-xs font-semibold transition-all duration-200 gap-3 px-3 py-2.5 cursor-pointer ${
                                    isRouteActive
                                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 dark:bg-emerald-500/15 dark:text-emerald-400 dark:shadow-none dark:ring-1 dark:ring-emerald-500/20'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                                }`}
                                title={isSidebarCollapsed ? item.feature_name : undefined}>
                                {isRouteActive && (
                                    <span className="absolute left-0 inset-y-2 w-0.75 rounded-r-full bg-white/60 dark:bg-emerald-400" />
                                )}
                                <NavIconRenderer item={item} isActive={isRouteActive} />
                                {!isSidebarCollapsed && (
                                    <span className="leading-tight text-left truncate flex-1">
                                        {item.feature_name}
                                    </span>
                                )}
                                {isRouteActive && !isSidebarCollapsed && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/80 dark:bg-emerald-400 shrink-0" />
                                )}
                            </NavLink>
                        );
                    }

                    // Parent Item with Sub-routes
                    const hasActiveChild = item.children?.some(
                        (child) => child.route_url && location.pathname.startsWith(child.route_url)
                    );

                    return (
                        <div key={item.id} className="space-y-0.5">
                            <button
                                type="button"
                                onClick={() => toggleAccordion(item.id)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                                    hasActiveChild && !isOpen
                                        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/5'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                                }`}
                                title={isSidebarCollapsed ? item.feature_name : undefined}>
                                <NavIconRenderer item={item} isActive={hasActiveChild} />
                                {!isSidebarCollapsed && (
                                    <>
                                        <span className="leading-tight flex-1 text-left truncate">
                                            {item.feature_name}
                                        </span>
                                        <ChevronRight
                                            className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 text-slate-400 dark:text-slate-500 ${
                                                isOpen ? 'rotate-90' : ''
                                            }`}
                                        />
                                    </>
                                )}
                            </button>

                            {/* Submenu Accordion */}
                            {!isSidebarCollapsed && isOpen && (
                                <div className="ml-3 mt-0.5 mb-1 pl-3 border-l-2 border-slate-200/80 dark:border-slate-800/70 space-y-0.5 py-0.5">
                                    {item.children?.map((child) => {
                                        const childUrl = child.route_url || '#';
                                        const isChildActive =
                                            childUrl !== '#' && location.pathname === childUrl;

                                        return (
                                            <NavLink
                                                key={child.id}
                                                to={childUrl}
                                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                                                    isChildActive
                                                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25 dark:bg-emerald-500/15 dark:text-emerald-400 dark:shadow-none dark:ring-1 dark:ring-emerald-500/20'
                                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                                                }`}>
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                                        isChildActive
                                                            ? 'bg-white dark:bg-emerald-400'
                                                            : 'bg-slate-300 dark:bg-slate-600'
                                                    }`}
                                                />
                                                <span className="truncate leading-tight">
                                                    {child.feature_name}
                                                </span>
                                            </NavLink>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
};
