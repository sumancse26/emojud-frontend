import React, { useState } from 'react';
import { EmployeesPresenter } from './presenters/EmployeesPresenter';

export interface Employee {
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

export interface EmployeeFormData {
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
    status: 'Active'
};

export const EmployeesPage: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
    const [searchQuery, setSearchQuery] = useState('');
    const [deptFilter, setDeptFilter] = useState('All');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<EmployeeFormData>(emptyForm);

    const filteredEmployees = employees.filter((emp) => {
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
            status: emp.status
        });
        setDrawerOpen(true);
    };

    const handleFormFieldChange = <K extends keyof EmployeeFormData>(field: K, value: EmployeeFormData[K]) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((w) => w[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!formData.name || !formData.empCode) return;
        if (editingId) {
            setEmployees((prev) =>
                prev.map((emp) =>
                    emp.id === editingId
                        ? {
                              ...emp,
                              ...formData,
                              initials: getInitials(formData.name),
                              salary: parseInt(formData.salary) || 0
                          }
                        : emp
                )
            );
        } else {
            setEmployees((prev) => [
                ...prev,
                {
                    id: String(Date.now()),
                    ...formData,
                    initials: getInitials(formData.name),
                    salary: parseInt(formData.salary) || 0
                }
            ]);
        }
        setDrawerOpen(false);
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
        />
    );
};

export default EmployeesPage;
