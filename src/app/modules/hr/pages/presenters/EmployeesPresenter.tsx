import React from 'react';
import { UserPlus, Search, MoreVertical, Save, Users, UserCheck, Banknote, Building2 } from 'lucide-react';
import { SliderDrawer, FormField, inputClasses, selectClasses, PageHeader } from '@/shared';
import type { Employee, EmployeeFormData } from '../EmployeesPage';

export interface EmployeesPresenterProps {
    employees: Employee[];
    filteredEmployees: Employee[];
    searchQuery: string;
    onSearchChange: (query: string) => void;
    deptFilter: string;
    onDeptFilterChange: (dept: string) => void;
    drawerOpen: boolean;
    onCloseDrawer: () => void;
    editingId: string | null;
    formData: EmployeeFormData;
    onFormFieldChange: <K extends keyof EmployeeFormData>(field: K, value: EmployeeFormData[K]) => void;
    onOpenCreate: () => void;
    onOpenEdit: (emp: Employee) => void;
    onSubmit: (e?: React.FormEvent) => void;
}

export const EmployeesPresenter: React.FC<EmployeesPresenterProps> = ({
    employees,
    filteredEmployees,
    searchQuery,
    onSearchChange,
    deptFilter,
    onDeptFilterChange,
    drawerOpen,
    onCloseDrawer,
    editingId,
    formData,
    onFormFieldChange,
    onOpenCreate,
    onOpenEdit,
    onSubmit
}) => {
    const activeStaff = employees.filter((e) => e.status === 'Active').length;
    const totalPayroll = employees.reduce((s, e) => s + e.salary, 0);
    const deptCount = new Set(employees.map((e) => e.department)).size;

    return (
        <section className="space-y-6">
            <PageHeader>
                <PageHeader.Header
                    title="Employee & Staff Directory"
                    description="Manage company staff profiles, payroll structures, branch postings, and employment terms."
                    actions={
                        <button
                            onClick={onOpenCreate}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-emerald-600/20 transition cursor-pointer">
                            <UserPlus className="w-4 h-4" />
                            <span>Onboard Employee</span>
                        </button>
                    }
                />

                <PageHeader.Body>
                    <PageHeader.MetricGrid cols={4}>
                        <PageHeader.MetricCard
                            label="Total Staff"
                            value={employees.length}
                            icon={<Users className="w-4 h-4" />}
                            accentColor="slate"
                            subtext="Total workforce count"
                        />
                        <PageHeader.MetricCard
                            label="Active on Duty"
                            value={activeStaff}
                            icon={<UserCheck className="w-4 h-4" />}
                            accentColor="emerald"
                            valueColor="text-emerald-600 dark:text-emerald-400"
                            trend={{ value: `${Math.round((activeStaff / (employees.length || 1)) * 100)}%`, isPositive: true }}
                            subtext="Active employment status"
                        />
                        <PageHeader.MetricCard
                            label="Monthly Payroll"
                            value={`৳ ${totalPayroll.toLocaleString('en-BD')}`}
                            icon={<Banknote className="w-4 h-4" />}
                            accentColor="blue"
                            valueColor="text-blue-600 dark:text-blue-400"
                            subtext="Gross monthly salary bill"
                        />
                        <PageHeader.MetricCard
                            label="Departments"
                            value={deptCount}
                            icon={<Building2 className="w-4 h-4" />}
                            accentColor="purple"
                            valueColor="text-purple-600 dark:text-purple-400"
                            subtext="Active divisions"
                        />
                    </PageHeader.MetricGrid>
                </PageHeader.Body>

                <PageHeader.Bottom>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="relative w-full sm:w-80">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search employee by name, code, designation..."
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/50 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition"
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <select
                                value={deptFilter}
                                onChange={(e) => onDeptFilterChange(e.target.value)}
                                className="px-3 py-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/50 rounded-xl text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer transition">
                                <option value="All">All Departments</option>
                                <option value="Operations">Operations</option>
                                <option value="Finance & Accounts">Finance & Accounts</option>
                                <option value="Supply Chain">Supply Chain</option>
                                <option value="Sales & Marketing">Sales & Marketing</option>
                            </select>
                        </div>
                    </div>
                </PageHeader.Bottom>
            </PageHeader>

            {/* Employees Table */}
            <div className="bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/80 dark:bg-slate-900/40 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80 text-[11px]">
                            <tr>
                                <th className="px-5 py-3">Employee Profile</th>
                                <th className="px-4 py-3">Department & Role</th>
                                <th className="px-4 py-3">Branch Outlet</th>
                                <th className="px-4 py-3">Contact Details</th>
                                <th className="px-4 py-3 text-right">Base Salary</th>
                                <th className="px-4 py-3 text-center">Status</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {filteredEmployees.map((emp) => (
                                <tr key={emp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-xs">
                                                {emp.initials}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">{emp.name}</p>
                                                <p className="text-[10px] text-slate-400 font-mono">
                                                    {emp.empCode} • Joined {emp.joinDate}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                                            {emp.designation}
                                        </p>
                                        <p className="text-[11px] text-slate-400">{emp.department}</p>
                                    </td>
                                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 font-medium">
                                        {emp.branch}
                                    </td>
                                    <td className="px-4 py-3.5 space-y-0.5">
                                        <p className="font-mono text-[11px] text-slate-600 dark:text-slate-300">
                                            {emp.phone}
                                        </p>
                                        <p className="text-[11px] text-slate-400">{emp.email}</p>
                                    </td>
                                    <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                                        ৳ {emp.salary.toLocaleString('en-BD')}
                                    </td>
                                    <td className="px-4 py-3.5 text-center">
                                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                            {emp.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                        <button
                                            onClick={() => onOpenEdit(emp)}
                                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Slider Drawer for Create / Edit */}
            <SliderDrawer
                isOpen={drawerOpen}
                onClose={onCloseDrawer}
                title={editingId ? 'Edit Employee' : 'Onboard New Employee'}
                subtitle={
                    editingId
                        ? `Editing: ${formData.name || 'Untitled'}`
                        : 'Add new staff member to your organization'
                }
                icon={<Users className="w-4 h-4" />}
                width="max-w-lg"
                footer={
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onCloseDrawer}
                            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => onSubmit()}
                            disabled={!formData.name || !formData.empCode}
                            className="flex-[2] py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition cursor-pointer">
                            <Save className="w-3.5 h-3.5" />
                            <span>{editingId ? 'Update Employee' : 'Onboard Employee'}</span>
                        </button>
                    </div>
                }>
                <div className="space-y-5">
                    {/* Personal Info */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Personal Information
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="Employee Code" required>
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="EMP-XXXX"
                                        value={formData.empCode}
                                        onChange={(e) =>
                                            onFormFieldChange('empCode', e.target.value.toUpperCase())
                                        }
                                    />
                                </FormField>
                                <FormField label="Full Name" required>
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="e.g. Tanvir Hossain"
                                        value={formData.name}
                                        onChange={(e) => onFormFieldChange('name', e.target.value)}
                                    />
                                </FormField>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="Email Address">
                                    <input
                                        type="email"
                                        className={inputClasses}
                                        placeholder="employee@emojud.com"
                                        value={formData.email}
                                        onChange={(e) => onFormFieldChange('email', e.target.value)}
                                    />
                                </FormField>
                                <FormField label="Phone Number">
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="+880 1XXX-XXXXXX"
                                        value={formData.phone}
                                        onChange={(e) => onFormFieldChange('phone', e.target.value)}
                                    />
                                </FormField>
                            </div>
                        </div>
                    </div>

                    {/* Employment Info */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            Employment Details
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="Department" required>
                                    <select
                                        className={selectClasses}
                                        value={formData.department}
                                        onChange={(e) => onFormFieldChange('department', e.target.value)}>
                                        <option>Operations</option>
                                        <option>Finance & Accounts</option>
                                        <option>Supply Chain</option>
                                        <option>Sales & Marketing</option>
                                        <option>Human Resources</option>
                                    </select>
                                </FormField>
                                <FormField label="Designation" required>
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="e.g. Branch Manager"
                                        value={formData.designation}
                                        onChange={(e) => onFormFieldChange('designation', e.target.value)}
                                    />
                                </FormField>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="Branch Posting">
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="e.g. Dhanmondi Outlet"
                                        value={formData.branch}
                                        onChange={(e) => onFormFieldChange('branch', e.target.value)}
                                    />
                                </FormField>
                                <FormField label="Joining Date">
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="e.g. 15 Jan 2022"
                                        value={formData.joinDate}
                                        onChange={(e) => onFormFieldChange('joinDate', e.target.value)}
                                    />
                                </FormField>
                            </div>
                        </div>
                    </div>

                    {/* Payroll & Status */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Payroll & Status
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <FormField label="Base Salary (৳)">
                                <input
                                    type="number"
                                    className={inputClasses}
                                    placeholder="e.g. 65000"
                                    value={formData.salary}
                                    onChange={(e) => onFormFieldChange('salary', e.target.value)}
                                />
                            </FormField>
                            <FormField label="Employment Status">
                                <select
                                    className={selectClasses}
                                    value={formData.status}
                                    onChange={(e) =>
                                        onFormFieldChange('status', e.target.value as Employee['status'])
                                    }>
                                    <option>Active</option>
                                    <option>On Leave</option>
                                    <option>Terminated</option>
                                </select>
                            </FormField>
                        </div>
                    </div>
                </div>
            </SliderDrawer>
        </section>
    );
};

export default EmployeesPresenter;
