import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { useApp } from '@/app/providers';
import type { OverviewChartItem } from '../types/dashboard.types';

Chart.register(...registerables);

export const RevenueChart: React.FC<{ items?: OverviewChartItem[] }> = ({ items = [] }) => {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart | null>(null);
    const { isDarkMode } = useApp();

    const list = Array.isArray(items) && items.length > 0 ? items : [];

    useEffect(() => {
        const canvas = chartRef.current;
        if (!canvas) return;

        if (chartInstance.current) {
            chartInstance.current.destroy();
            chartInstance.current = null;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const textColor = isDarkMode ? '#94a3b8' : '#64748b';
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)';

        // Extract labels and dataset values
        const hasData = list.length > 0 && list.some((i) => (Number(i.sales) > 0 || Number(i.purchase) > 0));

        const labels = hasData
            ? list.map((item) => item.report_date)
            : list.length > 0
            ? list.map((item) => item.report_date)
            : ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

        const salesData = hasData
            ? list.map((item) => Number(item.sales ?? 0))
            : list.length > 0
            ? list.map((item) => Number(item.sales ?? 0))
            : [980000, 1120000, 1250000, 1180000, 1340000, 1482950];

        const purchaseData = hasData
            ? list.map((item) => Number(item.purchase ?? 0))
            : list.length > 0
            ? list.map((item) => Number(item.purchase ?? 0))
            : [720000, 810000, 940000, 860000, 890000, 894300];

        const newChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Sales',
                        data: salesData,
                        borderColor: '#059669',
                        backgroundColor: isDarkMode ? 'rgba(5, 150, 105, 0.18)' : 'rgba(16, 185, 129, 0.12)',
                        fill: true,
                        tension: 0.38,
                        borderWidth: 2.5,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        pointBackgroundColor: '#059669',
                        pointBorderColor: '#059669',
                        pointBorderWidth: 1
                    },
                    {
                        label: 'Purchases',
                        data: purchaseData,
                        borderColor: '#2563eb',
                        backgroundColor: 'transparent',
                        fill: false,
                        borderDash: [5, 5],
                        tension: 0.38,
                        borderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        pointBackgroundColor: '#2563eb',
                        pointBorderColor: '#2563eb',
                        pointBorderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 300 },
                interaction: {
                    mode: 'index',
                    intersect: false
                },
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
                        grid: {
                            color: gridColor,
                            display: true
                        },
                        ticks: {
                            color: textColor,
                            font: { size: 11 }
                        }
                    },
                    y: {
                        grid: {
                            color: gridColor,
                            display: true
                        },
                        ticks: {
                            color: textColor,
                            font: { size: 11 },
                            callback: (val) => {
                                const num = Number(val);
                                if (num >= 1000000) return `৳${(num / 1000).toFixed(0)}k`;
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
            {/* Header with Title and Legend */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                        Monthly Sales & Restock Trends
                    </h3>
                    <p className="text-xs text-slate-400">Gross revenue vs purchase cost in BDT (৳)</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Sales
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> Purchases
                    </span>
                </div>
            </div>

            {/* Chart Canvas Area */}
            <div className="h-64 w-full relative">
                <canvas ref={chartRef} />
            </div>
        </div>
    );
};
