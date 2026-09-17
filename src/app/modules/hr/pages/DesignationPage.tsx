import React, { useState } from 'react';
import { Award, Plus, Edit3, Trash2, Save } from 'lucide-react';
import { SliderDrawer, FormField, inputClasses } from '@/shared';

interface Designation {
    id: string;
    title: string;
    department: string;
    grade: string;
    totalEmployees: number;
    baseSalaryRange: string;
    description: string;
}

const INITIAL_DESIGNATIONS: Designation[] = [
    {
        id: '1',
        title: 'Branch Manager',
        department: 'Store Operations',
        grade: 'Grade A1',
        totalEmployees: 4,
        baseSalaryRange: '৳ 60,000 - ৳ 80,000',
        description: 'Oversees daily retail outlet performance, customer relations, and cash reconciliation.'
    },
    {
        id: '2',
        title: 'Senior Cashier & POS Operator',
        department: 'Finance & Accounts',
        grade: 'Grade B2',
        totalEmployees: 8,
        baseSalaryRange: '৳ 30,000 - ৳ 40,000',
        description: 'Point-of-sale checkout counter billing, drawer closure, and card payments.'
    },
    {
        id: '3',
        title: 'Warehouse Logistics Officer',
        department: 'Supply Chain',
        grade: 'Grade B1',
        totalEmployees: 6,
        baseSalaryRange: '৳ 45,000 - ৳ 60,000',
        description: 'Inventory receiving, stock inward/outward inspection, and inter-branch dispatch.'
    },
    {
        id: '4',
        title: 'Sales Associate / Floor Executive',
        department: 'Store Operations',
        grade: 'Grade C1',
        totalEmployees: 12,
        baseSalaryRange: '৳ 22,000 - ৳ 30,000',
        description: 'Customer greeting, shelf assortment merchandising, and order assisting.'
    }
];

export const DesignationPage: React.FC = () => {
    const [designations, setDesignations] = useState<Designation[]>(INITIAL_DESIGNATIONS);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Designation | null>(null);

    const [formState, setFormState] = useState({
        title: '',
        department: 'Store Operations',
        grade: 'Grade B1',
        totalEmployees: 0,
        baseSalaryRange: '৳ 30,000 - ৳ 45,000',
        description: ''
    });

    const handleOpenCreate = () => {
        setEditingItem(null);
        setFormState({
            title: '',
            department: 'Store Operations',
            grade: 'Grade B1',
            totalEmployees: 0,
            baseSalaryRange: '৳ 30,000 - ৳ 45,000',
            description: ''
        });
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (item: Designation) => {
        setEditingItem(item);
        setFormState({
            title: item.title,
            department: item.department,
            grade: item.grade,
            totalEmployees: item.totalEmployees,
            baseSalaryRange: item.baseSalaryRange,
            description: item.description || ''
        });
        setIsDrawerOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            setDesignations((prev) =>
                prev.map((d) => (d.id === editingItem.id ? { ...d, ...formState } : d))
            );
        } else {
            const newItem: Designation = {
                id: Date.now().toString(),
                ...formState
            };
            setDesignations((prev) => [newItem, ...prev]);
        }
        setIsDrawerOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this designation?')) {
            setDesignations((prev) => prev.filter((d) => d.id !== id));
        }
    };

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Designations & Salary Bands
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Corporate job titles, grade hierarchies, and standard pay bands.
                    </p>
                </div>

                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer">
                    <Plus className="w-4 h-4" />
                    <span>Create Designation</span>
                </button>
            </div>

            <div className="bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/80 dark:bg-slate-900/40 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80 text-[11px]">
                            <tr>
                                <th className="px-5 py-3">Designation Title</th>
                                <th className="px-4 py-3">Department</th>
                                <th className="px-4 py-3">Grade Level</th>
                                <th className="px-4 py-3">Salary Band</th>
                                <th className="px-4 py-3 text-center">Employees</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {designations.map((d) => (
                                <tr key={d.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                                    <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                                            <Award className="w-4 h-4" />
                                        </div>
                                        <span>{d.title}</span>
                                    </td>
                                    <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400 font-medium">
                                        {d.department}
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                            {d.grade}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 font-mono text-slate-700 dark:text-slate-300">
                                        {d.baseSalaryRange}
                                    </td>
                                    <td className="px-4 py-3.5 text-center font-bold text-slate-800 dark:text-slate-200">
                                        {d.totalEmployees}
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => handleOpenEdit(d)}
                                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                                title="Edit">
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(d.id)}
                                                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
                                                title="Delete">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Slider Drawer */}
            <SliderDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title={editingItem ? 'Edit Designation' : 'Create New Designation'}
                subtitle="Specify job title, pay band tier, and department mapping"
                width="max-w-lg">
                <form onSubmit={handleSave} className="space-y-4">
                    <FormField label="Designation Title" required>
                        <input
                            type="text"
                            placeholder="e.g. Senior Inventory Auditor"
                            value={formState.title}
                            onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                            className={inputClasses}
                            required
                        />
                    </FormField>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Department" required>
                            <select
                                value={formState.department}
                                onChange={(e) => setFormState({ ...formState, department: e.target.value })}
                                className={inputClasses}>
                                <option value="Store Operations">Store Operations</option>
                                <option value="Finance & Accounts">Finance & Accounts</option>
                                <option value="Supply Chain">Supply Chain</option>
                                <option value="Human Resources">Human Resources</option>
                                <option value="IT & Infrastructure">IT & Infrastructure</option>
                            </select>
                        </FormField>

                        <FormField label="Grade Level" required>
                            <select
                                value={formState.grade}
                                onChange={(e) => setFormState({ ...formState, grade: e.target.value })}
                                className={inputClasses}>
                                <option value="Grade A1 (Executive)">Grade A1 (Executive)</option>
                                <option value="Grade A2 (Senior Mgr)">Grade A2 (Senior Mgr)</option>
                                <option value="Grade B1 (Mid Officer)">Grade B1 (Mid Officer)</option>
                                <option value="Grade B2 (Junior Officer)">Grade B2 (Junior Officer)</option>
                                <option value="Grade C1 (Staff Associate)">Grade C1 (Staff Associate)</option>
                            </select>
                        </FormField>
                    </div>

                    <FormField label="Base Salary Pay Band" required>
                        <input
                            type="text"
                            placeholder="e.g. ৳ 35,000 - ৳ 50,000"
                            value={formState.baseSalaryRange}
                            onChange={(e) => setFormState({ ...formState, baseSalaryRange: e.target.value })}
                            className={inputClasses}
                            required
                        />
                    </FormField>

                    <FormField label="Job Responsibilities & Scope">
                        <textarea
                            rows={3}
                            placeholder="Detail requirements and duties for this post..."
                            value={formState.description}
                            onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                            className={inputClasses}
                        />
                    </FormField>

                    <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={() => setIsDrawerOpen(false)}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer">
                            <Save className="w-4 h-4" />
                            <span>{editingItem ? 'Update Designation' : 'Save Designation'}</span>
                        </button>
                    </div>
                </form>
            </SliderDrawer>
        </section>
    );
};
