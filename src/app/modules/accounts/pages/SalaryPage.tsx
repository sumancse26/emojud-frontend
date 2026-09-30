import React, { useState } from 'react';
import { SalaryPresenter } from './presenters/SalaryPresenter';

export interface SalaryRecord {
    id: string;
    empCode: string;
    empName: string;
    department: string;
    month: string;
    basePay: number;
    allowances: number;
    deductions: number;
    netPayable: number;
    paymentStatus: 'Paid' | 'Processing' | 'On Hold';
    paymentMethod: 'Bank Transfer' | 'Cash' | 'bKash';
    paymentDate: string;
    notes: string;
}

export interface SalaryFormData {
    empCode: string;
    empName: string;
    department: string;
    month: string;
    basePay: number;
    allowances: number;
    deductions: number;
    paymentStatus: SalaryRecord['paymentStatus'];
    paymentMethod: SalaryRecord['paymentMethod'];
    paymentDate: string;
    notes: string;
}

const INITIAL_SALARIES: SalaryRecord[] = [
    {
        id: '1',
        empCode: 'EMP-1001',
        empName: 'Tanvir Hossain',
        department: 'Operations',
        month: 'September 2026',
        basePay: 65000,
        allowances: 5000,
        deductions: 2000,
        netPayable: 68000,
        paymentStatus: 'Paid',
        paymentMethod: 'Bank Transfer',
        paymentDate: '2026-09-01',
        notes: 'Monthly sales performance incentive included'
    },
    {
        id: '2',
        empCode: 'EMP-1002',
        empName: 'Sadia Afreen',
        department: 'Finance & Accounts',
        month: 'September 2026',
        basePay: 32000,
        allowances: 2500,
        deductions: 1000,
        netPayable: 33500,
        paymentStatus: 'Paid',
        paymentMethod: 'Bank Transfer',
        paymentDate: '2026-09-01',
        notes: 'Standard payroll slip'
    },
    {
        id: '3',
        empCode: 'EMP-1003',
        empName: 'Nusrat Jahan',
        department: 'Operations',
        month: 'September 2026',
        basePay: 62000,
        allowances: 4000,
        deductions: 1500,
        netPayable: 64500,
        paymentStatus: 'Paid',
        paymentMethod: 'Bank Transfer',
        paymentDate: '2026-09-01',
        notes: 'Outlet manager remuneration'
    },
    {
        id: '4',
        empCode: 'EMP-1004',
        empName: 'Kamrul Islam',
        department: 'Supply Chain',
        month: 'September 2026',
        basePay: 55000,
        allowances: 3500,
        deductions: 1200,
        netPayable: 57300,
        paymentStatus: 'Paid',
        paymentMethod: 'Bank Transfer',
        paymentDate: '2026-09-01',
        notes: 'Warehouse operations allowance'
    }
];

export const SalaryPage: React.FC = () => {
    const [salaries, setSalaries] = useState<SalaryRecord[]>(INITIAL_SALARIES);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<SalaryRecord | null>(null);

    const [formState, setFormState] = useState<SalaryFormData>({
        empCode: '',
        empName: '',
        department: 'Operations',
        month: 'September 2026',
        basePay: 30000,
        allowances: 2000,
        deductions: 1000,
        paymentStatus: 'Paid',
        paymentMethod: 'Bank Transfer',
        paymentDate: new Date().toISOString().split('T')[0],
        notes: ''
    });

    const handleOpenCreate = () => {
        setEditingRecord(null);
        setFormState({
            empCode: `EMP-${Math.floor(1005 + Math.random() * 50)}`,
            empName: '',
            department: 'Operations',
            month: 'September 2026',
            basePay: 35000,
            allowances: 3000,
            deductions: 1000,
            paymentStatus: 'Paid',
            paymentMethod: 'Bank Transfer',
            paymentDate: new Date().toISOString().split('T')[0],
            notes: ''
        });
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (rec: SalaryRecord) => {
        setEditingRecord(rec);
        setFormState({
            empCode: rec.empCode,
            empName: rec.empName,
            department: rec.department,
            month: rec.month,
            basePay: rec.basePay,
            allowances: rec.allowances,
            deductions: rec.deductions,
            paymentStatus: rec.paymentStatus,
            paymentMethod: rec.paymentMethod,
            paymentDate: rec.paymentDate,
            notes: rec.notes
        });
        setIsDrawerOpen(true);
    };

    const handleFormFieldChange = <K extends keyof SalaryFormData>(field: K, value: SalaryFormData[K]) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const netPayable = formState.basePay + formState.allowances - formState.deductions;
        if (editingRecord) {
            setSalaries((prev) =>
                prev.map((s) => (s.id === editingRecord.id ? { ...s, ...formState, netPayable } : s))
            );
        } else {
            const newRecord: SalaryRecord = {
                id: Date.now().toString(),
                ...formState,
                netPayable
            };
            setSalaries((prev) => [newRecord, ...prev]);
        }
        setIsDrawerOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this payroll disbursement entry?')) {
            setSalaries((prev) => prev.filter((s) => s.id !== id));
        }
    };

    const totalDisbursed = salaries.reduce((acc, s) => acc + s.netPayable, 0);

    const filteredSalaries = salaries.filter(
        (s) =>
            s.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SalaryPresenter
            salaries={salaries}
            filteredSalaries={filteredSalaries}
            totalDisbursed={totalDisbursed}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isDrawerOpen={isDrawerOpen}
            onCloseDrawer={() => setIsDrawerOpen(false)}
            editingRecord={editingRecord}
            formState={formState}
            onFormFieldChange={handleFormFieldChange}
            onOpenCreate={handleOpenCreate}
            onOpenEdit={handleOpenEdit}
            onSave={handleSave}
            onDelete={handleDelete}
        />
    );
};

export default SalaryPage;
