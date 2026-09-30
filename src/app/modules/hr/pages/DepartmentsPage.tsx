import React, { useState } from 'react';
import { DepartmentsPresenter } from './presenters/DepartmentsPresenter';

export interface Department {
    id: string;
    code: string;
    name: string;
    headOfDept: string;
    totalStaff: number;
    monthlyBudget: number;
    description: string;
    status: 'ACTIVE' | 'INACTIVE';
}

export interface DepartmentFormData {
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

    const [formState, setFormState] = useState<DepartmentFormData>({
        code: '',
        name: '',
        headOfDept: '',
        totalStaff: 0,
        monthlyBudget: 0,
        description: '',
        status: 'ACTIVE'
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

    const handleFormFieldChange = <K extends keyof DepartmentFormData>(
        field: K,
        value: DepartmentFormData[K]
    ) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value
        }));
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
        <DepartmentsPresenter
            departments={departments}
            isDrawerOpen={isDrawerOpen}
            onCloseDrawer={() => setIsDrawerOpen(false)}
            editingDept={editingDept}
            formState={formState}
            onFormFieldChange={handleFormFieldChange}
            onOpenCreate={handleOpenCreate}
            onOpenEdit={handleOpenEdit}
            onSave={handleSave}
            onDelete={handleDelete}
        />
    );
};

export default DepartmentsPage;
