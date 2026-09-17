import React, { useState } from 'react';
import { Building2, Plus, Users, Edit3, Trash2, Save } from 'lucide-react';
import { SliderDrawer, FormField, inputClasses } from '@/shared';

interface Department {
    id: string;
    code: string;
    name: string;
    headOfDept: string;
    totalStaff: number;
    monthlyBudget: number;
    description: string;
    status: 'ACTIVE' | 'INACTIVE';
}

const INITIAL_DEPTS: Department[] = [
    {
        id: '1',
        code: 'DEP-OPS',
        name: 'Store Operations',
        headOfDept: 'Tanvir Hossain',
        totalStaff: 18,
        monthlyBudget: 550000,
        description: 'Retail POS sales operations, outlet cash handling, and customer relations.',
        status: 'ACTIVE'
    },
    {
        id: '2',
        code: 'DEP-FIN',
        name: 'Finance & Accounts',
        headOfDept: 'Sadia Afreen',
        totalStaff: 5,
        monthlyBudget: 220000,
        description: 'Ledger management, daily expense auditing, VAT filing, and supplier settlements.',
        status: 'ACTIVE'
    },
    {
        id: '3',
        code: 'DEP-SCM',
        name: 'Supply Chain & Inventory',
        headOfDept: 'Kamrul Islam',
        totalStaff: 8,
        monthlyBudget: 380000,
        description: 'Central warehouse logistics, vendor shipments, quality inspection, and stock distribution.',
        status: 'ACTIVE'
    },
    {
        id: '4',
        code: 'DEP-HR',
        name: 'Human Resources',
        headOfDept: 'Farhana Yasmin',
        totalStaff: 4,
        monthlyBudget: 180000,
        description: 'Recruitment, attendance biometric tracking, employee welfare, and payroll.',
        status: 'ACTIVE'
    }
];

export const DepartmentsPage: React.FC = () => {
    const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPTS);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingDept, setEditingDept] = useState<Department | null>(null);

    const [formState, setFormState] = useState({
        code: '',
        name: '',
        headOfDept: '',
        totalStaff: 0,
        monthlyBudget: 0,
        description: '',
        status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
    });

    const handleOpenCreate = () => {
        setEditingDept(null);
        setFormState({
            code: `DEP-${Math.floor(100 + Math.random() * 900)}`,
            name: '',
            headOfDept: '',
            totalStaff: 1,
            monthlyBudget: 100000,
            description: '',
            status: 'ACTIVE'
        });
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (dept: Department) => {
        setEditingDept(dept);
        setFormState({
            code: dept.code,
            name: dept.name,
            headOfDept: dept.headOfDept,
            totalStaff: dept.totalStaff,
            monthlyBudget: dept.monthlyBudget,
            description: dept.description,
            status: dept.status
        });
        setIsDrawerOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingDept) {
            setDepartments((prev) =>
                prev.map((d) => (d.id === editingDept.id ? { ...d, ...formState } : d))
            );
        } else {
            const newDept: Department = {
                id: Date.now().toString(),
                ...formState
            };
            setDepartments((prev) => [newDept, ...prev]);
        }
        setIsDrawerOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to remove this department?')) {
            setDepartments((prev) => prev.filter((d) => d.id !== id));
        }
    };

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Company Departments
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Organizational structure, department heads, and cost-center payroll allocations.
                    </p>
                </div>

                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer">
                    <Plus className="w-4 h-4" />
                    <span>Create Department</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {departments.map((dept) => (
                    <div
                        key={dept.id}
                        className="bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl p-5 shadow-xs space-y-4 hover:border-emerald-500/30 transition">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                                            {dept.name}
                                        </h3>
                                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                                            {dept.code}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400">Head: <strong className="text-slate-700 dark:text-slate-200">{dept.headOfDept}</strong></p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => handleOpenEdit(dept)}
                                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                    title="Edit Department">
                                    <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(dept.id)}
                                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
                                    title="Delete Department">
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            {dept.description}
                        </p>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                <Users className="w-3.5 h-3.5 text-slate-400" />
                                <strong>{dept.totalStaff} Staff Members</strong>
                            </span>
                            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                ৳ {dept.monthlyBudget.toLocaleString('en-BD')}/mo
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Slider Drawer for Create / Edit Department */}
            <SliderDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title={editingDept ? 'Edit Department' : 'Create New Department'}
                subtitle="Configure organizational division and budget allocations"
                width="max-w-lg">
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Department Code" required>
                            <input
                                type="text"
                                value={formState.code}
                                onChange={(e) => setFormState({ ...formState, code: e.target.value })}
                                className={inputClasses}
                                required
                            />
                        </FormField>
                        <FormField label="Status">
                            <select
                                value={formState.status}
                                onChange={(e) => setFormState({ ...formState, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
                                className={inputClasses}>
                                <option value="ACTIVE">Active</option>
                                <option value="INACTIVE">Inactive</option>
                            </select>
                        </FormField>
                    </div>

                    <FormField label="Department Name" required>
                        <input
                            type="text"
                            placeholder="e.g. Finance & Auditing"
                            value={formState.name}
                            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                            className={inputClasses}
                            required
                        />
                    </FormField>

                    <FormField label="Head of Department" required>
                        <input
                            type="text"
                            placeholder="e.g. Tanvir Hossain"
                            value={formState.headOfDept}
                            onChange={(e) => setFormState({ ...formState, headOfDept: e.target.value })}
                            className={inputClasses}
                            required
                        />
                    </FormField>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Allocated Staff Count">
                            <input
                                type="number"
                                min="0"
                                value={formState.totalStaff}
                                onChange={(e) => setFormState({ ...formState, totalStaff: Number(e.target.value) })}
                                className={inputClasses}
                            />
                        </FormField>
                        <FormField label="Monthly Budget (৳)">
                            <input
                                type="number"
                                min="0"
                                step="1000"
                                value={formState.monthlyBudget}
                                onChange={(e) => setFormState({ ...formState, monthlyBudget: Number(e.target.value) })}
                                className={inputClasses}
                            />
                        </FormField>
                    </div>

                    <FormField label="Description & Roles">
                        <textarea
                            rows={3}
                            placeholder="Describe primary responsibilities and operational tasks..."
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
                            <span>{editingDept ? 'Update Department' : 'Save Department'}</span>
                        </button>
                    </div>
                </form>
            </SliderDrawer>
        </section>
    );
};
