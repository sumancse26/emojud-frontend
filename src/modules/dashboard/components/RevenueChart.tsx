import React, { useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import { useApp } from '@/app/providers/AppProvider'

Chart.register(...registerables)

export const RevenueChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const chartInstance = useRef<Chart | null>(null)
  const { isDarkMode } = useApp()

  useEffect(() => {
    const canvas = chartRef.current
    if (!canvas) return

    // Clean up any existing instance
    if (chartInstance.current) {
      chartInstance.current.destroy()
      chartInstance.current = null
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const textColor = isDarkMode ? '#94a3b8' : '#64748b'
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'

    const newChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        datasets: [
          {
            label: 'Gross Sales (৳)',
            data: [980000, 1120000, 1250000, 1180000, 1340000, 1482950],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true,
            tension: 0.35,
            borderWidth: 2.5,
            pointRadius: 4,
            pointBackgroundColor: '#10b981',
          },
          {
            label: 'Total Purchases (৳)',
            data: [720000, 810000, 940000, 860000, 890000, 894300],
            borderColor: '#3b82f6',
            backgroundColor: 'transparent',
            borderDash: [5, 5],
            tension: 0.35,
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: '#3b82f6',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 250 },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) =>
                `৳ ${Number(context.raw).toLocaleString('en-BD', { minimumFractionDigits: 2 })}`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: textColor, font: { size: 10 } },
          },
          y: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              font: { size: 10 },
              callback: (val) => '৳' + Number(val) / 1000 + 'k',
            },
          },
        },
      },
    })

    chartInstance.current = newChart

    return () => {
      if (newChart) {
        newChart.destroy()
      }
      chartInstance.current = null
    }
  }, [isDarkMode])

  return (
    <div className="bg-white dark:bg-[#0d1729] border border-slate-200/80 dark:border-slate-800/50 rounded-2xl p-5 shadow-sm dark:shadow-none">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Monthly Sales & Restock Trends</h3>
          <p className="text-xs text-slate-400">Gross revenue vs purchase cost in BDT (৳)</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Sales
          </span>
          <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Purchases
          </span>
        </div>
      </div>
      <div className="h-60 w-full relative">
        <canvas ref={chartRef} />
      </div>
    </div>
  )
}
