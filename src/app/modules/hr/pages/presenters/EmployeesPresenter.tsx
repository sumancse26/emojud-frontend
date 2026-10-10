import React from 'react';
import {
    UserPlus,
    Search,
    Save,
    Users,
    Loader2,
    AlertCircle,
    RefreshCw,
    Edit3
} from 'lucide-react';
import {
    SliderDrawer,
    FormField,
    inputClasses,
    PageHeader,
    Pagination,
    Skeleton,
    Dropdown
} from '@/shared';
import type { DropdownOption } from '@/shared/components/Dropdown/Dropdown';
import type { EmployeeItem } from '../../types/employee.types';
import type { EmployeeFormData } from '../EmployeesPage';

export interface EmployeesPresenterProps {
    employees: EmployeeItem[];
    filteredEmployees: EmployeeItem[];
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
    onOpenEdit: (emp: EmployeeItem) => void;
    onSubmit: (e?: React.FormEvent) => void;
    isLoading: boolean;
    isError: boolean;
    error: string | null;
    isSaving: boolean;
    saveError?: string | null;
    onRefetch: () => void;
    departmentOptions: DropdownOption[];
    designationOptions: DropdownOption[];
    isLoadingDepts?: boolean;
    isLoadingDesignations?: boolean;
}

const getInitials = (name: string) =>
    name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    try {
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    } catch {
        return dateStr;
    }
};

const GENDER_OPTIONS: DropdownOption[] = [
    { value: '1', label: 'Male' },
    { value: '2', label: 'Female' },
    { value: '3', label: 'Other' }
];

const BLOOD_GROUP_OPTIONS: DropdownOption[] = [
    { value: '1', label: 'O+' },
    { value: '2', label: 'O-' },
    { value: '3', label: 'A-' },
    { value: '4', label: 'A+' },
    { value: '5', label: 'B+' },
    { value: '6', label: 'B-' },
    { value: '7', label: 'AB+' },
    { value: '8', label: 'AB-' }
];

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
    onSubmit,
    isLoading,
    isError,
    error,
    isSaving,
    saveError,
    onRefetch,
    departmentOptions,
    designationOptions,
    isLoadingDepts = false,
    isLoadingDesignations = false
}) => {
    const deptNames = [...new Set(employees.map((e) => e.department?.department_name).filter(Boolean))];

    const filterDeptOptions: DropdownOption[] = [
        { value: 'All', label: 'All Departments' },
        ...deptNames.map((dept) => ({ value: dept as string, label: dept as string }))
    ];

    return (
        <section className="space-y-6">
            <PageHeader>
                <PageHeader.Header
                    title="Employee & Staff Directory"
                    description="Manage company staff profiles, payroll structures, branch postings, and employment terms."
                    actions={
                        <div className="flex items-center gap-2">
                            <button
                                onClick={onRefetch}
                                disabled={isLoading}
                                title="Refresh employees"
                                className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition cursor-pointer disabled:opacity-50">
                                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            </button>
                            <button
                                onClick={onOpenCreate}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-emerald-600/20 transition cursor-pointer">
                                <UserPlus className="w-4 h-4" />
                                <span>Onboard Employee</span>
                            </button>
                        </div>
                    }
                />

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

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                            <div className="w-48">
                                <Dropdown
                                    options={filterDeptOptions}
                                    value={deptFilter}
                                    onChange={(val) => onDeptFilterChange(val)}
                                    placeholder="Filter by Department"
                                    searchable={true}
                                />
                            </div>

                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium shrink-0">
                                Total Employees: <strong className="text-slate-900 dark:text-white font-bold">{filteredEmployees.length}</strong>
                            </div>
                        </div>
                    </div>
                </PageHeader.Bottom>
            </PageHeader>

            {/* Error Notification */}
            {isError && (
                <div className="flex items-center justify-between p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-xs">
                    <div className="flex items-center gap-2.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error || 'Failed to load employees. Please try again.'}</span>
                    </div>
                    <button
                        onClick={onRefetch}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg font-medium hover:bg-red-500 transition cursor-pointer">
                        Retry
                    </button>
                </div>
            )}

            {/* Loading Skeletons */}
            {isLoading && (
                <Skeleton.Table rows={6} columns={7} />
            )}

            {/* Empty State */}
            {!isLoading && !isError && filteredEmployees.length === 0 && (
                <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-[#0a1020] border border-slate-200/80 dark:border-slate-800/70 rounded-2xl text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <Users className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        {searchQuery ? 'No matching employees found' : 'No employees onboarded yet'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                        {searchQuery
                            ? `No results matched "${searchQuery}". Try a different keyword.`
                            : 'Start onboarding your first staff member to manage payroll, departments, and credentials.'}
                    </p>
                    {!searchQuery && (
                        <button
                            onClick={onOpenCreate}
                            className="mt-2 flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer">
                            <UserPlus className="w-4 h-4" />
                            <span>Onboard Employee</span>
                        </button>
                    )}
                </div>
            )}

            {/* Employees Table */}
            {!isLoading && !isError && filteredEmployees.length > 0 && (
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
                                    <th className="px-4 py-3 text-center">Gender</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                                {filteredEmployees.map((emp) => (
                                    <tr
                                        key={emp.id}
                                        className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-xs">
                                                    {getInitials(emp.full_name)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white">
                                                        {emp.full_name}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 font-mono">
                                                        {emp.employee_code} • Joined {formatDate(emp.join_date)}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <p className="font-semibold text-slate-800 dark:text-slate-200">
                                                {emp.designation?.designation_name ?? '—'}
                                            </p>
                                            <p className="text-[11px] text-slate-400">
                                                {emp.department?.department_name ?? '—'}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 font-medium">
                                            {emp.shop?.shop_name ?? '—'}
                                        </td>
                                        <td className="px-4 py-3.5 space-y-0.5">
                                            <p className="font-mono text-[11px] text-slate-600 dark:text-slate-300">
                                                {emp.phone ?? '—'}
                                            </p>
                                            <p className="text-[11px] text-slate-400">{emp.email ?? '—'}</p>
                                        </td>
                                        <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                                            ৳ {Number(emp.basic_salary || 0).toLocaleString('en-BD')}
                                        </td>
                                        <td className="px-4 py-3.5 text-center">
                                            <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                {emp.genderLookup?.lookup_value ?? '—'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            <button
                                                onClick={() => onOpenEdit(emp)}
                                                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition"
                                                title="Edit employee">
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination footer */}
                    <Pagination totalItems={filteredEmployees.length} pageSize={10} itemLabel="employees" />
                </div>
            )}

            {/* Slider Drawer for Create / Edit (Matching Shop Modal Format) */}
            <SliderDrawer isOpen={drawerOpen} onClose={onCloseDrawer}>
                <SliderDrawer.Header onClose={onCloseDrawer}>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                            <Users className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                                {editingId ? 'Edit Employee Profile' : 'Onboard New Employee'}
                            </h2>
                            <p className="text-[10px] text-slate-400">
                                {editingId
                                    ? `Editing: ${formData.full_name || 'Untitled'}`
                                    : 'Enter the details to register a new employee'}
                            </p>
                        </div>
                    </div>
                </SliderDrawer.Header>

                <SliderDrawer.Body>
                    <form id="employee-form" onSubmit={onSubmit} className="space-y-5">
                        {saveError && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{saveError}</span>
                            </div>
                        )}

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
                                            required
                                            className={inputClasses}
                                            placeholder="EMP-XXXX"
                                            value={formData.employee_code}
                                            onChange={(e) =>
                                                onFormFieldChange('employee_code', e.target.value.toUpperCase())
                                            }
                                        />
                                    </FormField>
                                    <FormField label="Full Name" required>
                                        <input
                                            type="text"
                                            required
                                            className={inputClasses}
                                            placeholder="e.g. Tanvir Hossain"
                                            value={formData.full_name}
                                            onChange={(e) => onFormFieldChange('full_name', e.target.value)}
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
                                <FormField label="Address">
                                    <input
                                        type="text"
                                        className={inputClasses}
                                        placeholder="e.g. 123 Main Street, Dhaka"
                                        value={formData.address}
                                        onChange={(e) => onFormFieldChange('address', e.target.value)}
                                    />
                                </FormField>
                                <div className="grid grid-cols-2 gap-3">
                                    <FormField label="NID Number">
                                        <input
                                            type="text"
                                            className={inputClasses}
                                            placeholder="NID Number"
                                            value={formData.nid}
                                            onChange={(e) => onFormFieldChange('nid', e.target.value)}
                                        />
                                    </FormField>
                                    <FormField label="Passport No">
                                        <input
                                            type="text"
                                            className={inputClasses}
                                            placeholder="Passport Number"
                                            value={formData.passport_no}
                                            onChange={(e) => onFormFieldChange('passport_no', e.target.value)}
                                        />
                                    </FormField>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <FormField label="Gender">
                                        <Dropdown
                                            options={GENDER_OPTIONS}
                                            value={formData.gender}
                                            onChange={(val) => onFormFieldChange('gender', val)}
                                            placeholder="Select Gender"
                                            searchable={true}
                                        />
                                    </FormField>
                                    <FormField label="Blood Group">
                                        <Dropdown
                                            options={BLOOD_GROUP_OPTIONS}
                                            value={formData.blood_group}
                                            onChange={(val) => onFormFieldChange('blood_group', val)}
                                            placeholder="Select Blood Group"
                                            searchable={true}
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
                                        <Dropdown
                                            options={departmentOptions}
                                            value={formData.department_id}
                                            onChange={(val) => onFormFieldChange('department_id', val)}
                                            placeholder="Select Department"
                                            searchable={true}
                                            searchPlaceholder="Search department..."
                                            isLoading={isLoadingDepts}
                                        />
                                    </FormField>
                                    <FormField label="Designation" required>
                                        <Dropdown
                                            options={designationOptions}
                                            value={formData.designation_id}
                                            onChange={(val) => onFormFieldChange('designation_id', val)}
                                            placeholder="Select Designation"
                                            searchable={true}
                                            searchPlaceholder="Search designation..."
                                            isLoading={isLoadingDesignations}
                                        />
                                    </FormField>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <FormField label="Joining Date">
                                        <input
                                            type="date"
                                            className={inputClasses}
                                            value={formData.join_date}
                                            onChange={(e) => onFormFieldChange('join_date', e.target.value)}
                                        />
                                    </FormField>
                                    <FormField label="Base Salary (৳)">
                                        <input
                                            type="number"
                                            className={inputClasses}
                                            placeholder="e.g. 65000"
                                            value={formData.basic_salary}
                                            onChange={(e) => onFormFieldChange('basic_salary', e.target.value)}
                                        />
                                    </FormField>
                                </div>
                            </div>
                        </div>

                        {/* Account Credentials */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                Account Credentials
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <FormField label="Username" required>
                                    <input
                                        type="text"
                                        required
                                        className={inputClasses}
                                        placeholder="e.g. johndoe (min 3 chars)"
                                        value={formData.username}
                                        onChange={(e) => onFormFieldChange('username', e.target.value)}
                                    />
                                </FormField>
                                {!editingId && (
                                    <FormField label="Password" required>
                                        <input
                                            type="password"
                                            required
                                            className={inputClasses}
                                            placeholder="Password (min 6 chars)"
                                            value={formData.password}
                                            onChange={(e) => onFormFieldChange('password', e.target.value)}
                                        />
                                    </FormField>
                                )}
                            </div>
                        </div>
                    </form>
                </SliderDrawer.Body>

                <SliderDrawer.Footer>
                    <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={onCloseDrawer}
                            disabled={isSaving}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer disabled:opacity-50">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="employee-form"
                            disabled={
                                isSaving ||
                                !formData.full_name?.trim() ||
                                !formData.employee_code?.trim() ||
                                !formData.username?.trim() ||
                                (!editingId && !formData.password?.trim())
                            }
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer">
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>{editingId ? 'Update Employee' : 'Onboard Employee'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </SliderDrawer.Footer>
            </SliderDrawer>
        </section>
    );
};

export default EmployeesPresenter;
