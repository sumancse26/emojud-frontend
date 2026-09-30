import React, { useState } from 'react';
import { DesignationPresenter } from './presenters/DesignationPresenter';

export interface Designation {
    id: string;
    title: string;
    department: string;
    grade: string;
    totalEmployees: number;
    baseSalaryRange: string;
    description: string;
}

export interface DesignationFormData {
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

    const [formState, setFormState] = useState<DesignationFormData>({
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

    const handleFormFieldChange = <K extends keyof DesignationFormData>(
        field: K,
        value: DesignationFormData[K]
    ) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value
        }));
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
        <DesignationPresenter
            designations={designations}
            isDrawerOpen={isDrawerOpen}
            onCloseDrawer={() => setIsDrawerOpen(false)}
            editingItem={editingItem}
            formState={formState}
            onFormFieldChange={handleFormFieldChange}
            onOpenCreate={handleOpenCreate}
            onOpenEdit={handleOpenEdit}
            onSave={handleSave}
            onDelete={handleDelete}
        />
    );
};

export default DesignationPage;
