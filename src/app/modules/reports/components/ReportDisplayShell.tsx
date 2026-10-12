import React, { useState } from 'react';
import { CalendarDays, Download, Printer, Search } from 'lucide-react';

export interface ReportDisplayMetric {
    label: string;
    value: string;
    color?: string;
}

interface ReportDisplayShellProps {
    title: string;
    metrics: ReportDisplayMetric[];
}

export const ReportDisplayShell: React.FC<ReportDisplayShellProps> = ({ title, metrics }) => {
    const [fromDate, setFromDate] = useState('2026-09-17');
    const [toDate, setToDate] = useState('2026-09-17');
    const [isGenerated, setIsGenerated] = useState(false);
    const printRange = `${new Date(`${fromDate}T00:00:00`).toLocaleDateString('en-GB')} – ${new Date(`${toDate}T00:00:00`).toLocaleDateString('en-GB')}`;
    const visibleMetrics = isGenerated
        ? metrics
        : metrics.map((metric) => ({
              ...metric,
              value: metric.value.includes('৳') ? '৳ 0.00' : '0'
          }));

    return (
        <div className={`display-report-header space-y-4 ${isGenerated ? 'display-report-generated' : ''}`}>
            <div className="display-report-print-brand report-brand print-report-logo" aria-label="NIPRO JMI Pharma">
                <div className="report-brand-mark">N</div>
                <div>
                    <div className="report-brand-name">NIPRO</div>
                    <div className="report-brand-subtitle">JMI Pharma</div>
                </div>
            </div>
            <div className="display-report-print-title">
                <h1>{title}</h1>
                <p>{printRange}</p>
            </div>
            <div className="display-report-screen rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800/60 dark:bg-[#080d1a]">
                <div className="text-center">
                    <h1 className="text-sm font-bold text-slate-900 underline decoration-slate-400 underline-offset-4 dark:text-white">
                        {title}
                    </h1>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        Select a date range to generate the report
                    </p>
                </div>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        setIsGenerated(true);
                    }}
                    className="mt-4 grid gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 md:grid-cols-[1fr_1fr_auto] md:items-end dark:border-slate-800 dark:bg-slate-900/40">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                        From date
                        <span className="relative mt-1 block">
                            <CalendarDays className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                            <input
                                type="date"
                                value={fromDate}
                                onChange={(event) => setFromDate(event.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 pl-8 text-[11px] text-slate-700 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                            />
                        </span>
                    </label>
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                        To date
                        <span className="relative mt-1 block">
                            <CalendarDays className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                            <input
                                type="date"
                                value={toDate}
                                onChange={(event) => setToDate(event.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 pl-8 text-[11px] text-slate-700 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                            />
                        </span>
                    </label>
                    <button
                        type="submit"
                        className="inline-flex h-[33px] items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 text-[11px] font-bold text-white hover:bg-emerald-500">
                        <Search className="h-3.5 w-3.5" /> Generate report
                    </button>
                </form>
            </div>
            <div className="display-report-metrics grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {visibleMetrics.map((metric) => (
                    <div
                        key={metric.label}
                        className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs dark:border-slate-800/60 dark:bg-[#080d1a]">
                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{metric.label}</p>
                        <p
                            className={`mt-1 font-mono text-sm font-black ${metric.color ?? 'text-slate-900 dark:text-white'}`}>
                            {metric.value}
                        </p>
                    </div>
                ))}
            </div>
            <div className="display-report-toolbar flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800/60 dark:bg-[#080d1a]">
                <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h2>
                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                        Report details for the selected date range
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        disabled={!isGenerated}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-200">
                        <Printer className="h-3.5 w-3.5" /> Print
                    </button>
                    <button
                        type="button"
                        disabled={!isGenerated}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50">
                        <Download className="h-3.5 w-3.5" /> Export CSV
                    </button>
                </div>
            </div>
        </div>
    );
};
