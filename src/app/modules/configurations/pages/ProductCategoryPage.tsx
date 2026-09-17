import React, { useState } from 'react';
import { Plus, Tag, Edit3, Trash2, Save, X as XIcon, Search } from 'lucide-react';
import { SliderDrawer, FormField, inputClasses, selectClasses } from '@/shared';

interface CategoryItem {
    id: string;
    code: string;
    name: string;
    subcategories: string[];
    vatRate: number;
    productCount: number;
    color: string;
    status: 'Active' | 'Inactive';
}

const COLOR_OPTIONS = [
    { label: 'Blue → Indigo', value: 'from-blue-500 to-indigo-600' },
    { label: 'Emerald → Teal', value: 'from-emerald-500 to-teal-600' },
    { label: 'Violet → Purple', value: 'from-violet-500 to-purple-600' },
    { label: 'Amber → Orange', value: 'from-amber-500 to-orange-600' },
    { label: 'Rose → Pink', value: 'from-rose-500 to-pink-600' },
    { label: 'Cyan → Sky', value: 'from-cyan-500 to-sky-600' },
];

const INITIAL_CATEGORIES: CategoryItem[] = [
    {
        id: '1',
        code: 'CAT-APP',
        name: 'Apparel & Menswear',
        subcategories: ['Formal Shirts', 'Casual Polo', 'Denim Jeans', 'Blazers & Suits', 'Silk Ties'],
        vatRate: 7.5,
        productCount: 420,
        color: 'from-blue-500 to-indigo-600',
        status: 'Active'
    },
    {
        id: '2',
        code: 'CAT-FTW',
        name: 'Footwear & Leather',
        subcategories: ['Leather Loafers', 'Oxford Shoes', 'Sneakers', 'Wallets & Belts'],
        vatRate: 7.5,
        productCount: 280,
        color: 'from-emerald-500 to-teal-600',
        status: 'Active'
    },
    {
        id: '3',
        code: 'CAT-ACC',
        name: 'Fashion Accessories',
        subcategories: ['Sunglasses', 'Watches', 'Cufflinks', 'Leather Bags'],
        vatRate: 15.0,
        productCount: 150,
        color: 'from-violet-500 to-purple-600',
        status: 'Active'
    },
    {
        id: '4',
        code: 'CAT-PERF',
        name: 'Perfumes & Grooming',
        subcategories: ['Eau De Parfum', 'Beard Oils', 'Hair Care', 'Body Mists'],
        vatRate: 15.0,
        productCount: 95,
        color: 'from-amber-500 to-orange-600',
        status: 'Active'
    }
];

interface CategoryFormData {
    code: string;
    name: string;
    vatRate: string;
    color: string;
    status: 'Active' | 'Inactive';
    subcategories: string[];
    newSubcategory: string;
}

const emptyForm: CategoryFormData = {
    code: '',
    name: '',
    vatRate: '',
    color: COLOR_OPTIONS[0].value,
    status: 'Active',
    subcategories: [],
    newSubcategory: '',
};

export const ProductCategoryPage: React.FC = () => {
    const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
    const [searchQuery, setSearchQuery] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<CategoryFormData>(emptyForm);

    const filtered = categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openCreate = () => {
        setEditingId(null);
        setFormData(emptyForm);
        setDrawerOpen(true);
    };

    const openEdit = (cat: CategoryItem) => {
        setEditingId(cat.id);
        setFormData({
            code: cat.code,
            name: cat.name,
            vatRate: String(cat.vatRate),
            color: cat.color,
            status: cat.status,
            subcategories: [...cat.subcategories],
            newSubcategory: '',
        });
        setDrawerOpen(true);
    };

    const handleAddSubcategory = () => {
        const trimmed = formData.newSubcategory.trim();
        if (trimmed && !formData.subcategories.includes(trimmed)) {
            setFormData((prev) => ({
                ...prev,
                subcategories: [...prev.subcategories, trimmed],
                newSubcategory: '',
            }));
        }
    };

    const handleRemoveSubcategory = (idx: number) => {
        setFormData((prev) => ({
            ...prev,
            subcategories: prev.subcategories.filter((_, i) => i !== idx),
        }));
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.code) return;

        if (editingId) {
            setCategories((prev) =>
                prev.map((c) =>
                    c.id === editingId
                        ? {
                              ...c,
                              code: formData.code,
                              name: formData.name,
                              vatRate: parseFloat(formData.vatRate) || 0,
                              color: formData.color,
                              status: formData.status,
                              subcategories: formData.subcategories,
                          }
                        : c
                )
            );
        } else {
            const newCat: CategoryItem = {
                id: String(Date.now()),
                code: formData.code,
                name: formData.name,
                vatRate: parseFloat(formData.vatRate) || 0,
                productCount: 0,
                color: formData.color,
                status: formData.status,
                subcategories: formData.subcategories,
            };
            setCategories((prev) => [...prev, newCat]);
        }
        setDrawerOpen(false);
    };

    const handleDelete = (id: string) => {
        setCategories((prev) => prev.filter((c) => c.id !== id));
    };

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Product Categories & Subcategories
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Hierarchical product classification, default VAT/Tax slabs, and inventory mapping.
                    </p>
                </div>

                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    <span>Create New Category</span>
                </button>
            </div>

            {/* Filter Bar */}
            <div className="relative max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search category name or code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#080d1a] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
            </div>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filtered.map((cat) => (
                    <div
                        key={cat.id}
                        className="bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl p-5 shadow-xs space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} text-white flex items-center justify-center font-bold shadow-md shadow-emerald-500/10`}>
                                    <Tag className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                                            {cat.name}
                                        </h3>
                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold">
                                            {cat.code}
                                        </span>
                                    </div>
                                    <span className="text-[11px] text-slate-400 font-medium">
                                        VAT Slab: <strong>{cat.vatRate}%</strong> • Total Items:{' '}
                                        <strong className="text-emerald-600 dark:text-emerald-400">
                                            {cat.productCount} SKUs
                                        </strong>
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => openEdit(cat)}
                                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition"
                                >
                                    <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(cat.id)}
                                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer transition"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* Subcategories pill badges */}
                        <div className="space-y-1.5 pt-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Subcategory Taxonomies ({cat.subcategories.length})
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {cat.subcategories.map((sub, idx) => (
                                    <span
                                        key={idx}
                                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                        <span>{sub}</span>
                                    </span>
                                ))}
                                <button
                                    onClick={() => openEdit(cat)}
                                    className="px-2 py-1 rounded-lg text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition cursor-pointer"
                                >
                                    + Add Sub
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Slider Drawer for Create / Edit */}
            <SliderDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title={editingId ? 'Edit Category' : 'Create New Category'}
                subtitle={editingId ? `Editing: ${formData.name || 'Untitled'}` : 'Add a new product category to your catalog'}
                icon={<Tag className="w-4 h-4" />}
                footer={
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setDrawerOpen(false)}
                            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!formData.name || !formData.code}
                            className="flex-[2] py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                            <Save className="w-3.5 h-3.5" />
                            <span>{editingId ? 'Update Category' : 'Create Category'}</span>
                        </button>
                    </div>
                }
            >
                <div className="space-y-5">
                    {/* Basic Information */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Basic Information
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="Category Code" required>
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="e.g. CAT-APP"
                                        value={formData.code}
                                        onChange={(e) => setFormData((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                                    />
                                </FormField>
                                <FormField label="VAT Rate (%)" required>
                                    <input
                                        type="number"
                                        step="0.5"
                                        className={inputClasses}
                                        placeholder="e.g. 7.5"
                                        value={formData.vatRate}
                                        onChange={(e) => setFormData((p) => ({ ...p, vatRate: e.target.value }))}
                                    />
                                </FormField>
                            </div>

                            <FormField label="Category Name" required>
                                <input
                                    type="text"
                                    className={inputClasses}
                                    placeholder="e.g. Apparel & Menswear"
                                    value={formData.name}
                                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                                />
                            </FormField>

                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="Theme Color">
                                    <select
                                        className={selectClasses}
                                        value={formData.color}
                                        onChange={(e) => setFormData((p) => ({ ...p, color: e.target.value }))}
                                    >
                                        {COLOR_OPTIONS.map((c) => (
                                            <option key={c.value} value={c.value}>{c.label}</option>
                                        ))}
                                    </select>
                                </FormField>
                                <FormField label="Status">
                                    <select
                                        className={selectClasses}
                                        value={formData.status}
                                        onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value as 'Active' | 'Inactive' }))}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </FormField>
                            </div>

                            {/* Color Preview */}
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${formData.color} shadow-md`} />
                                <div className="text-xs">
                                    <p className="font-bold text-slate-700 dark:text-slate-200">Theme Preview</p>
                                    <p className="text-slate-400 text-[10px]">This color will be used for the category card icon</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subcategories */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                            Subcategories ({formData.subcategories.length})
                        </h3>

                        {/* Add subcategory input */}
                        <div className="flex items-center gap-2 mb-3">
                            <input
                                type="text"
                                className={inputClasses}
                                placeholder="Type subcategory name..."
                                value={formData.newSubcategory}
                                onChange={(e) => setFormData((p) => ({ ...p, newSubcategory: e.target.value }))}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddSubcategory()}
                            />
                            <button
                                onClick={handleAddSubcategory}
                                disabled={!formData.newSubcategory.trim()}
                                className="shrink-0 px-3 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold transition cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Subcategory chips */}
                        {formData.subcategories.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {formData.subcategories.map((sub, idx) => (
                                    <span
                                        key={idx}
                                        className="group px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition"
                                    >
                                        {sub}
                                        <button
                                            onClick={() => handleRemoveSubcategory(idx)}
                                            className="text-slate-400 hover:text-rose-500 transition cursor-pointer"
                                        >
                                            <XIcon className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-slate-400 text-xs border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                                No subcategories added yet. Type above and press Enter.
                            </div>
                        )}
                    </div>
                </div>
            </SliderDrawer>
        </section>
    );
};
