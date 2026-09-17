import React from 'react';
import { useNavigate } from 'react-router';
import { LayoutDashboard, ArrowLeft } from 'lucide-react';
import { ROUTES } from './paths';

export const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-5">
            <div className="w-20 h-20 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-3xl font-black shadow-lg shadow-rose-500/10">
                404
            </div>
            <div className="space-y-2 max-w-md">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Page Not Found
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    The requested route does not exist or has been moved. Please verify the URL or navigate back to the main dashboard.
                </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Go Back</span>
                </button>
                <button
                    onClick={() => navigate(ROUTES.HOME.DASHBOARD)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition shadow-md shadow-emerald-600/20 cursor-pointer">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Go to Dashboard</span>
                </button>
            </div>
        </div>
    );
};
