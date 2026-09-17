import React, { useState } from 'react';
import { UserPlus, Search, MoreVertical, Save, Users } from 'lucide-react';
import { SliderDrawer, FormField, inputClasses, selectClasses } from '@/shared';

interface Employee {
    id: string;
    empCode: string;
    name: string;
    initials: string;
    email: string;
    phone: string;
    department: string;
    designation: string;
    branch: string;
    salary: number;
    joinDate: string;
    status: 'Active' | 'On Leave' | 'Terminated';
}

const INITIAL_EMPLOYEES: Employee[] = [
    {
        id: '1',
        empCode: 'EMP-1001',
        name: 'Tanvir Hossain',
        initials: 'TH',
        email: 'tanvir@emojud.com',
        phone: '+880 1711-234567',
        department: 'Operations',
        designation: 'Branch Manager',
        branch: 'Dhanmondi Outlet',
        salary: 65000,
        joinDate: '15 Jan 2022',
        status: 'Active'
    },
    {
        id: '2',
        empCode: 'EMP-1002',
        name: 'Sadia Afreen',
        initials: 'SA',
        email: 'sadia.cash@emojud.com',
        phone: '+880 1819-334455',
        department: 'Finance & Accounts',
        designation: 'Senior Cashier',
        branch: 'Dhanmondi Outlet',
        salary: 32000,
        joinDate: '01 Mar 2023',
        status: 'Active'
    },
    {
        id: '3',
        empCode: 'EMP-1003',
        name: 'Nusrat Jahan',
        initials: 'NJ',
        email: 'nusrat@emojud.com',
        phone: '+880 1912-778899',
        department: 'Operations',
        designation: 'Branch Manager',
        branch: 'Gulshan Outlet',
        salary: 62000,
        joinDate: '10 Jun 2022',
        status: 'Active'
    },
    {
        id: '4',
        empCode: 'EMP-1004',
        name: 'Kamrul Islam',
        initials: 'KI',
        email: 'kamrul.wh@emojud.com',
        phone: '+880 1611-445566',
        department: 'Supply Chain',
        designation: 'Warehouse Manager',
        branch: 'Central WH (Savar)',
        salary: 55000,
        joinDate: '05 Aug 2021',
        status: 'Active'
    },
    {
        id: '5',
        empCode: 'EMP-1005',
        name: 'Mahbubur Rahman',
        initials: 'MR',
        email: 'mahbub@emojud.com',
        phone: '+880 1715-990011',
        department: 'Sales & Marketing',
        designation: 'POS Sales Executive',
        branch: 'Dhanmondi Outlet',
        salary: 28000,
        joinDate: '12 Sep 2023',
        status: 'Active'
    }
];

interface EmployeeFormData {
    empCode: string;
    name: string;
    email: string;
    phone: string;
    department: string;
    designation: string;
    branch: string;
    salary: string;
    joinDate: string;
    status: Employee['status'];
}

const emptyForm: EmployeeFormData = {
    empCode: '',
    name: '',
    email: '',
    phone: '',
    department: 'Operations',
    designation: '',
    branch: '',
    salary: '',
    joinDate: '',
    status: 'Active',
};

export const EmployeesPage: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
    const [searchQuery, setSearchQuery] = useState('');
    const [deptFilter, setDeptFilter] = useState('All');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<EmployeeFormData>(emptyForm);

    const filtered = employees.filter((emp) => {
        const matchesSearch =
            emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.designation.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
        return matchesSearch && matchesDept;
    });

    const openCreate = () => {
        setEditingId(null);
        setFormData(emptyForm);
        setDrawerOpen(true);
    };

    const openEdit = (emp: Employee) => {
        setEditingId(emp.id);
        setFormData({
            empCode: emp.empCode,
            name: emp.name,
            email: emp.email,
            phone: emp.phone,
            department: emp.department,
            designation: emp.designation,
            branch: emp.branch,
            salary: String(emp.salary),
            joinDate: emp.joinDate,
            status: emp.status,
        });
        setDrawerOpen(true);
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    };

    const handleSubmit = () => {
        if (!formData.name || !formData.empCode) return;
        if (editingId) {
            setEmployees((prev) =>
                prev.map((e) =>
                    e.id === editingId
                        ? {
                              ...e,
                              ...formData,
                              initials: getInitials(formData.name),
                              salary: parseInt(formData.salary) || 0,
                          }
                        : e
                )
            );
        } else {
            setEmployees((prev) => [
                ...prev,
                {
                    id: String(Date.now()),
                    ...formData,
                    initials: getInitials(formData.name),
                    salary: parseInt(formData.salary) || 0,
                },
            ]);
        }
        setDrawerOpen(false);
    };

    return (
        <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                        Employee & Staff Directory
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Manage company staff profiles, payroll structures, branch postings, and employment terms.
                    </p>
                </div>

                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition cursor-pointer self-start sm:self-auto"
                >
                    <UserPlus className="w-4 h-4" />
                    <span>Onboard Employee</span>
                </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Staff</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{employees.length}</p>
                </div>
                <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active on Duty</p>
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{employees.filter(e => e.status === 'Active').length}</p>
                </div>
                <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Monthly Payroll</p>
                    <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 font-mono">৳ {employees.reduce((s, e) => s + e.salary, 0).toLocaleString('en-BD')}</p>
                </div>
                <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Departments</p>
                    <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">{new Set(employees.map(e => e.department)).size}</p>
                </div>
            </div>

            {/* Filter and Search */}
            <div className="bg-white dark:bg-[#080d1a] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search employee by name, code, designation..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <select
                        value={deptFilter}
                        onChange={(e) => setDeptFilter(e.target.value)}
                        className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer">
                        <option value="All">All Departments</option>
                        <option value="Operations">Operations</option>
                        <option value="Finance & Accounts">Finance & Accounts</option>
                        <option value="Supply Chain">Supply Chain</option>
                        <option value="Sales & Marketing">Sales & Marketing</option>
                    </select>
                </div>
            </div>

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
                            {filtered.map((emp) => (
                                <tr key={emp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-xs">
                                                {emp.initials}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">
                                                    {emp.name}
                                                </p>
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
                                            onClick={() => openEdit(emp)}
                                            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition"
                                        >
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
                onClose={() => setDrawerOpen(false)}
                title={editingId ? 'Edit Employee' : 'Onboard New Employee'}
                subtitle={editingId ? `Editing: ${formData.name || 'Untitled'}` : 'Add new staff member to your organization'}
                icon={<Users className="w-4 h-4" />}
                width="max-w-lg"
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
                            disabled={!formData.name || !formData.empCode}
                            className="flex-[2] py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                            <Save className="w-3.5 h-3.5" />
                            <span>{editingId ? 'Update Employee' : 'Onboard Employee'}</span>
                        </button>
                    </div>
                }
            >
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
                                        onChange={(e) => setFormData((p) => ({ ...p, empCode: e.target.value.toUpperCase() }))}
                                    />
                                </FormField>
                                <FormField label="Full Name" required>
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="e.g. Tanvir Hossain"
                                        value={formData.name}
                                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
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
                                        onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                                    />
                                </FormField>
                                <FormField label="Phone Number">
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="+880 1XXX-XXXXXX"
                                        value={formData.phone}
                                        onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
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
                                        onChange={(e) => setFormData((p) => ({ ...p, department: e.target.value }))}
                                    >
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
                                        onChange={(e) => setFormData((p) => ({ ...p, designation: e.target.value }))}
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
                                        onChange={(e) => setFormData((p) => ({ ...p, branch: e.target.value }))}
                                    />
                                </FormField>
                                <FormField label="Joining Date">
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="e.g. 15 Jan 2022"
                                        value={formData.joinDate}
                                        onChange={(e) => setFormData((p) => ({ ...p, joinDate: e.target.value }))}
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
                                    onChange={(e) => setFormData((p) => ({ ...p, salary: e.target.value }))}
                                />
                            </FormField>
                            <FormField label="Employment Status">
                                <select
                                    className={selectClasses}
                                    value={formData.status}
                                    onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value as Employee['status'] }))}
                                >
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
