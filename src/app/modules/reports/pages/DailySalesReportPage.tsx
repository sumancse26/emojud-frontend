import React, { useState } from 'react';
import { Printer, Download, Calendar } from 'lucide-react';

export const DailySalesReportPage: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState('2026-09-17');

    const salesData = [
        {
            time: '10:15 AM',
            invoice: 'INV-2026-0091',
            outlet: 'Dhanmondi Outlet',
            customer: 'Rahim Chowdhury',
            itemsCount: 3,
            paymentMode: 'Card (Visa)',
            amount: 7200,
            vat: 540,
            net: 7740
        },
        {
            time: '11:40 AM',
            invoice: 'INV-2026-0092',
            outlet: 'Dhanmondi Outlet',
            customer: 'Walk-in Guest',
            itemsCount: 1,
            paymentMode: 'Cash',
            amount: 2450,
            vat: 183.75,
            net: 2633.75
        },
        {
            time: '01:10 PM',
            invoice: 'INV-2026-0093',
            outlet: 'Gulshan Outlet',
            customer: 'Farhana Yasmin',
            itemsCount: 4,
            paymentMode: 'bKash Merchant',
            amount: 12800,
            vat: 960,
            net: 13760
        },
        {
            time: '03:25 PM',
            invoice: 'INV-2026-0094',
            outlet: 'Dhanmondi Outlet',
            customer: 'Tariqul Islam',
            itemsCount: 2,
            paymentMode: 'Cash',
            amount: 4900,
            vat: 367.5,
            net: 5267.5
        }
    ];

    const totalGross = salesData.reduce((acc, curr) => acc + curr.amount, 0);
    const totalVat = salesData.reduce((acc, curr) => acc + curr.vat, 0);
    const totalNet = salesData.reduce((acc, curr) => acc + curr.net, 0);

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Daily Sales & Register Audit Report
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Detailed invoice breakdown, VAT collection, and register payment methods for the day.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-[#080d1a] border border-slate-200 dark:border-slate-800 rounded-xl text-xs">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent border-none text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
                        />
                    </div>
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer">
                        <Printer className="w-4 h-4" />
                        <span>Print</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer">
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Gross Sales</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
                        ৳ {totalGross.toLocaleString('en-BD')}
                    </p>
                </div>
                <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">VAT Collected (7.5%)</p>
                    <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 font-mono">
                        ৳ {totalVat.toLocaleString('en-BD')}
                    </p>
                </div>
                <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Net Sales Revenue</p>
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
                        ৳ {totalNet.toLocaleString('en-BD')}
                    </p>
                </div>
                <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Invoices Billed</p>
                    <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1 font-mono">
                        4 Bills
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/80 dark:bg-slate-900/40 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80 text-[11px]">
                            <tr>
                                <th className="px-5 py-3">Time & Invoice #</th>
                                <th className="px-4 py-3">Outlet</th>
                                <th className="px-4 py-3">Customer Profile</th>
                                <th className="px-4 py-3">Payment Method</th>
                                <th className="px-4 py-3 text-right">Items</th>
                                <th className="px-4 py-3 text-right">Gross (৳)</th>
                                <th className="px-4 py-3 text-right">VAT (৳)</th>
                                <th className="px-4 py-3 text-right">Total Net (৳)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {salesData.map((s, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                                    <td className="px-5 py-3.5">
                                        <p className="font-mono font-bold text-slate-900 dark:text-white">{s.invoice}</p>
                                        <p className="text-[10px] text-slate-400">{s.time}</p>
                                    </td>
                                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 font-medium">
                                        {s.outlet}
                                    </td>
                                    <td className="px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200">
                                        {s.customer}
                                    </td>
                                    <td className="px-4 py-3.5 text-slate-500 font-medium">
                                        {s.paymentMode}
                                    </td>
                                    <td className="px-4 py-3.5 text-right font-mono text-slate-600 dark:text-slate-300">
                                        {s.itemsCount} pcs
                                    </td>
                                    <td className="px-4 py-3.5 text-right font-mono text-slate-700 dark:text-slate-300">
                                        ৳ {s.amount.toLocaleString('en-BD')}
                                    </td>
                                    <td className="px-4 py-3.5 text-right font-mono text-blue-600 dark:text-blue-400">
                                        ৳ {s.vat.toLocaleString('en-BD')}
                                    </td>
                                    <td className="px-4 py-3.5 text-right font-mono font-black text-emerald-600 dark:text-emerald-400">
                                        ৳ {s.net.toLocaleString('en-BD')}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};
