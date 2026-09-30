import React, { useState } from 'react';
import { ProductCategoryPresenter } from './presenters/ProductCategoryPresenter';

export interface CategoryItem {
    id: string;
    code: string;
    name: string;
    subcategories: string[];
    vatRate: number;
    productCount: number;
    color: string;
    status: 'Active' | 'Inactive';
}

export const COLOR_OPTIONS = [
    { label: 'Blue → Indigo', value: 'from-blue-500 to-indigo-600' },
    { label: 'Emerald → Teal', value: 'from-emerald-500 to-teal-600' },
    { label: 'Violet → Purple', value: 'from-violet-500 to-purple-600' },
    { label: 'Amber → Orange', value: 'from-amber-500 to-orange-600' },
    { label: 'Rose → Pink', value: 'from-rose-500 to-pink-600' },
    { label: 'Cyan → Sky', value: 'from-cyan-500 to-sky-600' }
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

export interface CategoryFormData {
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
    newSubcategory: ''
};

export const ProductCategoryPage: React.FC = () => {
    const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
    const [searchQuery, setSearchQuery] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<CategoryFormData>(emptyForm);

    const filteredCategories = categories.filter(
        (cat) =>
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
            newSubcategory: ''
        });
        setDrawerOpen(true);
    };

    const handleFormFieldChange = <K extends keyof CategoryFormData>(field: K, value: CategoryFormData[K]) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddSubcategory = () => {
        const trimmed = formData.newSubcategory.trim();
        if (trimmed && !formData.subcategories.includes(trimmed)) {
            setFormData((prev) => ({
                ...prev,
                subcategories: [...prev.subcategories, trimmed],
                newSubcategory: ''
            }));
        }
    };

    const handleRemoveSubcategory = (idx: number) => {
        setFormData((prev) => ({
            ...prev,
            subcategories: prev.subcategories.filter((_, i) => i !== idx)
        }));
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
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
                              subcategories: formData.subcategories
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
                subcategories: formData.subcategories
            };
            setCategories((prev) => [...prev, newCat]);
        }
        setDrawerOpen(false);
    };

    const handleDelete = (id: string) => {
        setCategories((prev) => prev.filter((c) => c.id !== id));
    };

    return (
        <ProductCategoryPresenter
            categories={categories}
            filteredCategories={filteredCategories}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenCreate={openCreate}
            onOpenEdit={openEdit}
            onDelete={handleDelete}
            drawerOpen={drawerOpen}
            onCloseDrawer={() => setDrawerOpen(false)}
            editingId={editingId}
            formData={formData}
            onFormFieldChange={handleFormFieldChange}
            onAddSubcategory={handleAddSubcategory}
            onRemoveSubcategory={handleRemoveSubcategory}
            onSubmit={handleSubmit}
            colorOptions={COLOR_OPTIONS}
        />
    );
};

export default ProductCategoryPage;
