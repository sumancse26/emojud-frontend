import React from 'react';
import { Award, Plus, Edit3, Trash2, Save } from 'lucide-react';
import { SliderDrawer, FormField, inputClasses, PageHeader, Pagination } from '@/shared';
import type { Designation, DesignationFormData } from '../DesignationPage';

export interface DesignationPresenterProps {
    designations: Designation[];
    isDrawerOpen: boolean;
    onCloseDrawer: () => void;
    editingItem: Designation | null;
    formState: DesignationFormData;
    onFormFieldChange: <K extends keyof DesignationFormData>(field: K, value: DesignationFormData[K]) => void;
    onOpenCreate: () => void;
    onOpenEdit: (item: Designation) => void;
    onSave: (e: React.FormEvent) => void;
    onDelete: (id: string) => void;
}

export const DesignationPresenter: React.FC<DesignationPresenterProps> = ({
    designations,
    isDrawerOpen,
    onCloseDrawer,
    editingItem,
    formState,
    onFormFieldChange,
    onOpenCreate,
    onOpenEdit,
    onSave,
    onDelete
}) => {
    return (
        <section className="space-y-6">
            <PageHeader>
                <PageHeader.Header
                    title="Designations & Salary Bands"
                    description="Corporate job titles, grade hierarchies, and standard pay bands."
                    actions={
                        <button
                            onClick={onOpenCreate}
                            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer">
                            <Plus className="w-4 h-4" />
                            <span>Create Designation</span>
                        </button>
                    }
                />
            </PageHeader>

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
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                                                <Award className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">{d.title}</p>
                                                <p className="text-[10px] text-slate-400">{d.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 font-medium text-slate-700 dark:text-slate-300">
                                        {d.department}
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                            {d.grade}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                                        {d.baseSalaryRange}
                                    </td>
                                    <td className="px-4 py-3.5 text-center font-bold text-slate-800 dark:text-slate-200">
                                        {d.totalEmployees} Staff
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                onClick={() => onOpenEdit(d)}
                                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                                title="Edit Designation">
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => onDelete(d.id)}
                                                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
                                                title="Delete Designation">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination footer */}
                <Pagination
                    totalItems={designations.length}
                    pageSize={10}
                    itemLabel="designations"
                />
            </div>

            {/* Slider Drawer */}
            <SliderDrawer
                isOpen={isDrawerOpen}
                onClose={onCloseDrawer}
                title={editingItem ? 'Edit Designation' : 'Create Job Designation'}
                subtitle="Specify corporate hierarchy grade and salary pay bands"
                width="max-w-lg">
                <form onSubmit={onSave} className="space-y-4">
                    <FormField label="Designation Title" required>
                        <input
                            type="text"
                            placeholder="e.g. Senior POS Cashier & Billing Lead"
                            value={formState.title}
                            onChange={(e) => onFormFieldChange('title', e.target.value)}
                            className={inputClasses}
                            required
                        />
                    </FormField>

                    <div className="grid grid-cols-2 gap-3">
                        <FormField label="Parent Department" required>
                            <select
                                value={formState.department}
                                onChange={(e) => onFormFieldChange('department', e.target.value)}
                                className={inputClasses}>
                                <option value="Store Operations">Store Operations</option>
                                <option value="Finance & Accounts">Finance & Accounts</option>
                                <option value="Supply Chain">Supply Chain</option>
                                <option value="Human Resources">Human Resources</option>
                            </select>
                        </FormField>
                        <FormField label="Corporate Grade Level">
                            <select
                                value={formState.grade}
                                onChange={(e) => onFormFieldChange('grade', e.target.value)}
                                className={inputClasses}>
                                <option value="Grade A1">Grade A1 (Executive Management)</option>
                                <option value="Grade B1">Grade B1 (Senior Supervisory)</option>
                                <option value="Grade B2">Grade B2 (Mid Operations)</option>
                                <option value="Grade C1">Grade C1 (Junior Staff)</option>
                            </select>
                        </FormField>
                    </div>

                    <FormField label="Standard Salary Range Band">
                        <input
                            type="text"
                            placeholder="e.g. ৳ 35,000 - ৳ 50,000"
                            value={formState.baseSalaryRange}
                            onChange={(e) => onFormFieldChange('baseSalaryRange', e.target.value)}
                            className={inputClasses}
                        />
                    </FormField>

                    <FormField label="Job Scope & Role Summary">
                        <textarea
                            rows={3}
                            placeholder="Briefly state primary KPIs, role responsibilities..."
                            value={formState.description}
                            onChange={(e) => onFormFieldChange('description', e.target.value)}
                            className={inputClasses}
                        />
                    </FormField>

                    <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={onCloseDrawer}
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

export default DesignationPresenter;
