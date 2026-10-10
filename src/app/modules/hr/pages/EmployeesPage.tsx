import React, { useState, useMemo } from 'react';
import { useApp } from '@/app/providers';
import { useToast } from '@/shared/components/Toast';
import { tokenStorage } from '@/shared/services/tokenStorage';
import type { User } from '@/app/modules/auth/types/auth.types';
import type { DropdownOption } from '@/shared/components/Dropdown/Dropdown';
import { useEmployee } from '../hooks/useEmployee';
import { useDepartment } from '../hooks/useDepartment';
import { useDesignation } from '../hooks/useDesignation';
import { EmployeesPresenter } from './presenters/EmployeesPresenter';
import type { EmployeeItem, CreateEmployeePayload } from '../types/employee.types';

export interface EmployeeFormData {
    employee_code: string;
    full_name: string;
    email: string;
    phone: string;
    address: string;
    department_id: string;
    designation_id: string;
    gender: string;
    blood_group: string;
    nid: string;
    passport_no: string;
    basic_salary: string;
    join_date: string;
    username: string;
    password: string;
}

const emptyForm: EmployeeFormData = {
    employee_code: '',
    full_name: '',
    email: '',
    phone: '',
    address: '',
    department_id: '',
    designation_id: '',
    gender: '',
    blood_group: '',
    nid: '',
    passport_no: '',
    basic_salary: '',
    join_date: '',
    username: '',
    password: ''
};

export const EmployeesPage: React.FC = () => {
    const { selectedBranch } = useApp();
    const toast = useToast();

    // ─── Memoize request params to ensure reference stability ─────────
    const employeeParams = useMemo(
        () => ({ shop_id: selectedBranch }),
        [selectedBranch]
    );

    const {
        employees,
        isLoading,
        isError,
        error,
        refetch,
        createEmployee,
        isSaving,
        saveError
    } = useEmployee({
        immediate: true,
        initialParams: employeeParams
    });

    // ─── Departments & Designations from API ──────────────────────────
    const { departments, isLoading: isLoadingDepts } = useDepartment({ immediate: true });
    const { designations, isLoading: isLoadingDesignations } = useDesignation({ immediate: true });

    const departmentOptions = useMemo<DropdownOption[]>(() => {
        return departments.map((dept) => ({
            value: String(dept.id),
            label: dept.department_name,
            subLabel: dept.display_code
        }));
    }, [departments]);

    const designationOptions = useMemo<DropdownOption[]>(() => {
        return designations.map((desig) => ({
            value: String(desig.id),
            label: desig.designation_name,
            subLabel: desig.display_code
        }));
    }, [designations]);

    const [searchQuery, setSearchQuery] = useState('');
    const [deptFilter, setDeptFilter] = useState('All');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<EmployeeFormData>(emptyForm);

    // ─── Client-side filtering ────────────────────────────────────────
    const filteredEmployees = useMemo(() => {
        return employees.filter((emp) => {
            const matchesSearch =
                emp.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                emp.employee_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (emp.designation?.designation_name ?? '').toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDept =
                deptFilter === 'All' || emp.department?.department_name === deptFilter;
            return matchesSearch && matchesDept;
        });
    }, [employees, searchQuery, deptFilter]);

    const openCreate = () => {
        setEditingId(null);
        setFormData(emptyForm);
        setDrawerOpen(true);
    };

    const openEdit = (emp: EmployeeItem) => {
        setEditingId(emp.id);
        setFormData({
            employee_code: emp.employee_code,
            full_name: emp.full_name,
            email: emp.email ?? '',
            phone: emp.phone ?? '',
            address: emp.address ?? '',
            department_id: emp.department?.id ? String(emp.department.id) : '',
            designation_id: emp.designation?.id ? String(emp.designation.id) : '',
            gender: emp.genderLookup?.id ? String(emp.genderLookup.id) : '',
            blood_group: emp.bloodGroupLookup?.id ? String(emp.bloodGroupLookup.id) : '',
            nid: emp.nid ?? '',
            passport_no: emp.passport_no ?? '',
            basic_salary: emp.basic_salary ?? '',
            join_date: emp.join_date ? emp.join_date.split('T')[0] : '',
            username:
                (emp.username as string) ??
                ((emp as Record<string, unknown>).user as { username?: string } | undefined)?.username ??
                '',
            password: ''
        });
        setDrawerOpen(true);
    };

    const handleFormFieldChange = <K extends keyof EmployeeFormData>(field: K, value: EmployeeFormData[K]) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!formData.full_name?.trim() || !formData.employee_code?.trim()) {
            toast.warning('Full name and employee code are required.');
            return;
        }

        const isUpdating = Boolean(editingId);

        // Username is required for both create and update
        if (!formData.username?.trim()) {
            toast.warning('Username is required.');
            return;
        }
        if (formData.username.trim().length < 3) {
            toast.warning('Username must be at least 3 characters.');
            return;
        }

        // Password validation (only for new employee onboarding, never on update)
        if (!isUpdating) {
            if (!formData.password) {
                toast.warning('Password is required for employee account credentials.');
                return;
            }
            if (formData.password.length < 6) {
                toast.warning('Password must be at least 6 characters.');
                return;
            }
        }

        const user = tokenStorage.getUser<User>();

        const payload: CreateEmployeePayload = {
            ...(editingId ? { id: Number(editingId) } : {}),
            employee_code: formData.employee_code.trim(),
            full_name: formData.full_name.trim(),
            phone: formData.phone?.trim() || undefined,
            email: formData.email?.trim() || undefined,
            address: formData.address?.trim() || undefined,
            join_date: formData.join_date || undefined,
            department_id: formData.department_id ? Number(formData.department_id) : undefined,
            designation_id: formData.designation_id ? Number(formData.designation_id) : undefined,
            gender: formData.gender ? Number(formData.gender) : undefined,
            blood_group: formData.blood_group ? Number(formData.blood_group) : undefined,
            nid: formData.nid?.trim() || undefined,
            passport_no: formData.passport_no?.trim() || undefined,
            basic_salary: formData.basic_salary ? Number(formData.basic_salary) : undefined,
            shop_id: Number(selectedBranch),
            username: formData.username.trim(),
            ...(!isUpdating ? { password: formData.password } : {}),
            created_by: user?.id ? Number(user.id) : 1,
            company_id: user?.branchId ? Number(user.branchId) : 1,
            default_role_id: 1,
            user_id: user?.id ? Number(user.id) : 1
        };

        try {
            await createEmployee(payload);
            toast.success(
                isUpdating
                    ? `Employee "${formData.full_name}" updated successfully!`
                    : `Employee "${formData.full_name}" onboarded successfully!`
            );
            setDrawerOpen(false);
            setEditingId(null);
            setFormData(emptyForm);
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to save employee. Please try again.';
            toast.error(errorMsg);
        }
    };

    return (
        <EmployeesPresenter
            employees={employees}
            filteredEmployees={filteredEmployees}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            deptFilter={deptFilter}
            onDeptFilterChange={setDeptFilter}
            drawerOpen={drawerOpen}
            onCloseDrawer={() => setDrawerOpen(false)}
            editingId={editingId}
            formData={formData}
            onFormFieldChange={handleFormFieldChange}
            onOpenCreate={openCreate}
            onOpenEdit={openEdit}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            isError={isError}
            error={error}
            isSaving={isSaving}
            saveError={saveError}
            onRefetch={() => void refetch(employeeParams)}
            departmentOptions={departmentOptions}
            designationOptions={designationOptions}
            isLoadingDepts={isLoadingDepts}
            isLoadingDesignations={isLoadingDesignations}
        />
    );
};

export default EmployeesPage;
