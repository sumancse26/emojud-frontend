import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import { LayoutDashboard, ArrowLeft, Layers, ShieldCheck, Sparkles, Plus } from 'lucide-react';
import { ROUTES } from './paths';

interface FeaturePlaceholderProps {
    title?: string;
    module?: string;
    description?: string;
}

export const FeaturePlaceholder: React.FC<FeaturePlaceholderProps> = ({
    title,
    module,
    description
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const resolvedTitle =
        title ||
        pathSegments[pathSegments.length - 1]
            ?.replace(/-/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase()) ||
        'Feature Module';

    const resolvedModule =
        module ||
        (pathSegments.length > 1
            ? pathSegments[pathSegments.length - 2].toUpperCase()
            : 'ERP CORE');

    return (
        <div className="space-y-6">
            {/* Top Bar / Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-[#080d1a] p-4 lg:p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                        <span>EMOJUD ERP</span>
                        <span>/</span>
                        <span className="text-emerald-600 dark:text-emerald-400">{resolvedModule}</span>
                        <span>/</span>
                        <span className="text-slate-700 dark:text-slate-200">{resolvedTitle}</span>
                    </div>
                    <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        {resolvedTitle}
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {description || `Manage and configure ${resolvedTitle.toLowerCase()} workflows, reports and records.`}
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer">
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back</span>
                    </button>
                    <button
                        onClick={() => navigate(ROUTES.HOME.DASHBOARD)}
                        className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 rounded-xl transition cursor-pointer">
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>Dashboard</span>
                    </button>
                </div>
            </div>

            {/* Feature Content Canvas */}
            <div className="bg-white dark:bg-[#080d1a] rounded-2xl border border-slate-200/80 dark:border-slate-800/60 p-8 text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center ring-8 ring-emerald-500/5">
                    <Layers className="w-8 h-8" />
                </div>

                <div className="max-w-md mx-auto space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Route Active: {location.pathname}</span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        {resolvedTitle} Module Ready
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        This module route is registered and connected to the navigation system. Business logic and UI components can be attached here seamlessly.
                    </p>
                </div>

                {/* Simulated Quick Action Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-4 text-left">
                    <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-xs mb-1">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Role Permissions</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                            Managed by RBAC permission matrix.
                        </p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-xs mb-1">
                            <Layers className="w-3.5 h-3.5 text-blue-500" />
                            <span>Data Grid View</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                            Exportable CSV, Excel, and PDF formats.
                        </p>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                        <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-xs mb-1">
                            <Plus className="w-3.5 h-3.5 text-violet-500" />
                            <span>Audit Trail</span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                            Automatic action logging enabled.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
