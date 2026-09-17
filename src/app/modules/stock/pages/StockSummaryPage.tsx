import React, { useState } from 'react';
import { Search, Download, Plus } from 'lucide-react';

interface StockSummaryItem {
    id: string;
    sku: string;
    barcode: string;
    name: string;
    category: string;
    outlet: string;
    inStock: number;
    reorderLevel: number;
    unitCost: number;
    sellingPrice: number;
    status: 'In Stock' | 'Low Stock' | 'Critical';
}

const MOCK_STOCK: StockSummaryItem[] = [
    {
        id: '1',
        sku: 'SHIRT-SLM-001',
        barcode: '8901234567890',
        name: 'Executive Slim-Fit Cotton Shirt (White)',
        category: 'Apparel',
        outlet: 'Dhanmondi Outlet',
        inStock: 142,
        reorderLevel: 25,
        unitCost: 1200,
        sellingPrice: 2450,
        status: 'In Stock'
    },
    {
        id: '2',
        sku: 'JEAN-STR-002',
        barcode: '8901234567891',
        name: 'Indigo Stretch Denim Jeans (32/32)',
        category: 'Apparel',
        outlet: 'Dhanmondi Outlet',
        inStock: 14,
        reorderLevel: 20,
        unitCost: 1650,
        sellingPrice: 3200,
        status: 'Low Stock'
    },
    {
        id: '3',
        sku: 'TIE-SLK-003',
        barcode: '8901234567892',
        name: 'Handcrafted Silk Tie (Navy Blue)',
        category: 'Accessories',
        outlet: 'Gulshan Outlet',
        inStock: 6,
        reorderLevel: 15,
        unitCost: 450,
        sellingPrice: 1150,
        status: 'Critical'
    },
    {
        id: '4',
        sku: 'SHOE-LOA-004',
        barcode: '8901234567893',
        name: 'Italian Calf Leather Loafers (Size 42)',
        category: 'Footwear',
        outlet: 'Dhanmondi Outlet',
        inStock: 38,
        reorderLevel: 10,
        unitCost: 3200,
        sellingPrice: 6500,
        status: 'In Stock'
    },
    {
        id: '5',
        sku: 'BELT-LTH-005',
        barcode: '8901234567894',
        name: 'Reversible Formal Leather Belt (Black/Tan)',
        category: 'Accessories',
        outlet: 'Central WH (Savar)',
        inStock: 250,
        reorderLevel: 50,
        unitCost: 650,
        sellingPrice: 1450,
        status: 'In Stock'
    }
];

export const StockSummaryPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const filtered = MOCK_STOCK.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.barcode.includes(searchQuery);
        const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalValuation = MOCK_STOCK.reduce((acc, item) => acc + item.inStock * item.unitCost, 0);

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Stock Summary & Valuation
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Real-time inventory levels, safety thresholds, asset valuation, and stock alerts.
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    <button className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer">
                        <Download className="w-4 h-4" />
                        <span>Export Stock Sheet</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer">
                        <Plus className="w-4 h-4" />
                        <span>Add Stock Entry</span>
                    </button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Inventory Assets</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
                        ৳ {totalValuation.toLocaleString('en-BD')}
                    </p>
                </div>
                <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">SKUs in Stock</p>
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                        450 Units
                    </p>
                </div>
                <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Low Stock SKUs</p>
                    <p className="text-2xl font-black text-amber-500 mt-1">1 Item</p>
                </div>
                <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Critical Threshold</p>
                    <p className="text-2xl font-black text-rose-500 mt-1">1 Item</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by SKU, item name, barcode..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer">
                        <option value="All">All Statuses</option>
                        <option value="In Stock">In Stock</option>
                        <option value="Low Stock">Low Stock</option>
                        <option value="Critical">Critical</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/80 dark:bg-slate-900/40 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80 text-[11px]">
                            <tr>
                                <th className="px-5 py-3">Product Name & Barcode</th>
                                <th className="px-4 py-3">Branch Location</th>
                                <th className="px-4 py-3 text-right">Unit Cost</th>
                                <th className="px-4 py-3 text-right">Selling Price</th>
                                <th className="px-4 py-3 text-right">Available Qty</th>
                                <th className="px-4 py-3 text-right">Stock Valuation</th>
                                <th className="px-4 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {filtered.map((item) => {
                                const lineValuation = item.inStock * item.unitCost;

                                return (
                                    <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                                        <td className="px-5 py-3.5">
                                            <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                                            <p className="text-[10px] text-slate-400 font-mono">
                                                SKU: {item.sku} • EAN: {item.barcode}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 font-medium">
                                            {item.outlet}
                                        </td>
                                        <td className="px-4 py-3.5 text-right font-mono text-slate-500">
                                            ৳ {item.unitCost.toLocaleString('en-BD')}
                                        </td>
                                        <td className="px-4 py-3.5 text-right font-mono font-semibold text-slate-800 dark:text-slate-200">
                                            ৳ {item.sellingPrice.toLocaleString('en-BD')}
                                        </td>
                                        <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                                            {item.inStock} pcs
                                        </td>
                                        <td className="px-4 py-3.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                            ৳ {lineValuation.toLocaleString('en-BD')}
                                        </td>
                                        <td className="px-4 py-3.5 text-center">
                                            <span
                                                className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                                    item.status === 'In Stock'
                                                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                                        : item.status === 'Low Stock'
                                                        ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                                                        : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};
