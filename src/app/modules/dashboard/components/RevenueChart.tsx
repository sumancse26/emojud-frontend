import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { useApp } from '@/app/providers';
import type { OverviewChartItem } from '../types/dashboard.types';

Chart.register(...registerables);

export const RevenueChart: React.FC<{ items?: OverviewChartItem[] }> = ({ items = [] }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart | null>(null);
    const { isDarkMode } = useApp();

    const list = Array.isArray(items) ? items : [];

    useEffect(() => {
        const canvas = chartRef.current;
        if (!canvas) return;

        // Clean up previous chart instance
        if (chartInstance.current) {
            chartInstance.current.destroy();
            chartInstance.current = null;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const textColor = isDarkMode ? '#94a3b8' : '#64748b';
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)';

        const labels = list.length > 0
            ? list.map((item) => item.report_date)
            : ['Sep 30', 'Oct 01', 'Oct 02', 'Oct 03', 'Oct 04', 'Oct 05', 'Oct 06'];

        const salesData = list.length > 0
            ? list.map((item) => Number(item.sales ?? 0))
            : [0, 0, 0, 0, 0, 0, 0];

        const purchaseData = list.length > 0
            ? list.map((item) => Number(item.purchase ?? 0))
            : [0, 0, 0, 0, 0, 0, 0];

        const expenseData = list.length > 0
            ? list.map((item) => Number(item.expense ?? 0))
            : [0, 0, 0, 0, 0, 0, 0];

        const newChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Sales (৳)',
                        data: salesData,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.12)',
                        fill: true,
                        tension: 0.35,
                        borderWidth: 2.5,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        pointBackgroundColor: '#10b981',
                        pointBorderColor: '#ffffff'
                    },
                    {
                        label: 'Purchases (৳)',
                        data: purchaseData,
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.08)',
                        fill: true,
                        tension: 0.35,
                        borderWidth: 2,
                        pointRadius: 3.5,
                        pointHoverRadius: 6,
                        pointBackgroundColor: '#3b82f6',
                        pointBorderColor: '#ffffff'
                    },
                    {
                        label: 'Expense (৳)',
                        data: expenseData,
                        borderColor: '#f43f5e',
                        backgroundColor: 'transparent',
                        borderDash: [4, 4],
                        tension: 0.35,
                        borderWidth: 2,
                        pointRadius: 3.5,
                        pointHoverRadius: 6,
                        pointBackgroundColor: '#f43f5e',
                        pointBorderColor: '#ffffff'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 300 },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                        titleColor: isDarkMode ? '#f8fafc' : '#0f172a',
                        bodyColor: isDarkMode ? '#cbd5e1' : '#334155',
                        borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        borderWidth: 1,
                        padding: 10,
                        boxPadding: 4,
                        usePointStyle: true,
                        callbacks: {
                            label: (context) =>
                                ` ${context.dataset.label}: ৳ ${Number(context.raw ?? 0).toLocaleString('en-BD')}`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: gridColor },
                        ticks: { color: textColor, font: { size: 10 } }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: gridColor },
                        ticks: {
                            color: textColor,
                            font: { size: 10 },
                            callback: (val) => {
                                const num = Number(val);
                                if (num >= 1000000) return `৳${(num / 1000000).toFixed(1)}M`;
                                if (num >= 1000) return `৳${(num / 1000).toFixed(0)}k`;
                                return `৳${num}`;
                            }
                        }
                    }
                }
            }
        });

        chartInstance.current = newChart;

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null;
            }
        };
    }, [list, isDarkMode]);

    return (
        <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl p-5 shadow-sm dark:shadow-none transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                        Sales vs Purchase vs Expense
                    </h3>
                    <p className="text-xs text-slate-400">Daily financial trends in BDT (৳)</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Sales
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Purchases
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Expense
                    </span>
                </div>
            </div>

            <div className="h-64 w-full relative">
                <canvas ref={chartRef} />
            </div>
        </div>
    );
};
