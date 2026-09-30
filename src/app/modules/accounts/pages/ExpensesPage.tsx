import React, { useState } from 'react';
import { ExpensesPresenter } from './presenters/ExpensesPresenter';

export interface ExpenseVoucher {
    id: string;
    voucherNo: string;
    date: string;
    category: 'Store Utility' | 'Branch Rent' | 'Staff Refreshments' | 'Logistics & Fuel' | 'Packaging Materials' | 'Marketing & Promo';
    outlet: string;
    amount: number;
    paidTo: string;
    paymentMode: 'Cash' | 'Bank Transfer' | 'bKash / Nagad';
    approvedBy: string;
    receiptAttached: boolean;
    remarks: string;
}

export interface ExpenseFormData {
    voucherNo: string;
    date: string;
    category: ExpenseVoucher['category'];
    outlet: string;
    amount: number;
    paidTo: string;
    paymentMode: ExpenseVoucher['paymentMode'];
    approvedBy: string;
    receiptAttached: boolean;
    remarks: string;
}

const INITIAL_EXPENSES: ExpenseVoucher[] = [
    {
        id: '1',
        voucherNo: 'EXP-2026-081',
        date: '2026-09-17',
        category: 'Store Utility',
        outlet: 'Dhanmondi Flagship Outlet',
        amount: 8500,
        paidTo: 'DPDC Electricity Bill',
        paymentMode: 'Bank Transfer',
        approvedBy: 'Tanvir Hossain',
        receiptAttached: true,
        remarks: 'September meter bill paid'
    },
    {
        id: '2',
        voucherNo: 'EXP-2026-082',
        date: '2026-09-16',
        category: 'Packaging Materials',
        outlet: 'Central Warehouse (Savar)',
        amount: 24000,
        paidTo: 'Ideal Carton & Box Mills',
        paymentMode: 'Bank Transfer',
        approvedBy: 'Kamrul Islam',
        receiptAttached: true,
        remarks: '2000 pcs corrugated shipping boxes'
    },
    {
        id: '3',
        voucherNo: 'EXP-2026-083',
        date: '2026-09-16',
        category: 'Logistics & Fuel',
        outlet: 'Gulshan Branch Outlet',
        amount: 3200,
        paidTo: 'Inter-branch Delivery Van',
        paymentMode: 'Cash',
        approvedBy: 'Tanvir Hossain',
        receiptAttached: false,
        remarks: 'Fuel allowance for stock delivery'
    },
    {
        id: '4',
        voucherNo: 'EXP-2026-084',
        date: '2026-09-15',
        category: 'Staff Refreshments',
        outlet: 'Dhanmondi Flagship Outlet',
        amount: 1450,
        paidTo: 'Daily Tea & Snacks',
        paymentMode: 'Cash',
        approvedBy: 'Tanvir Hossain',
        receiptAttached: true,
        remarks: 'Weekly petty cash voucher'
    }
];

export const ExpensesPage: React.FC = () => {
    const [expenses, setExpenses] = useState<ExpenseVoucher[]>(INITIAL_EXPENSES);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState<ExpenseVoucher | null>(null);

    const [formState, setFormState] = useState<ExpenseFormData>({
        voucherNo: '',
        date: new Date().toISOString().split('T')[0],
        category: 'Store Utility',
        outlet: 'Dhanmondi Flagship Outlet',
        amount: 1000,
        paidTo: '',
        paymentMode: 'Cash',
        approvedBy: 'Suman Roy (Admin)',
        receiptAttached: true,
        remarks: ''
    });

    const handleOpenCreate = () => {
        setEditingVoucher(null);
        setFormState({
            voucherNo: `EXP-2026-0${Math.floor(85 + Math.random() * 100)}`,
            date: new Date().toISOString().split('T')[0],
            category: 'Store Utility',
            outlet: 'Dhanmondi Flagship Outlet',
            amount: 1500,
            paidTo: '',
            paymentMode: 'Cash',
            approvedBy: 'Suman Roy (Admin)',
            receiptAttached: true,
            remarks: ''
        });
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (v: ExpenseVoucher) => {
        setEditingVoucher(v);
        setFormState({
            voucherNo: v.voucherNo,
            date: v.date,
            category: v.category,
            outlet: v.outlet,
            amount: v.amount,
            paidTo: v.paidTo,
            paymentMode: v.paymentMode,
            approvedBy: v.approvedBy,
            receiptAttached: v.receiptAttached,
            remarks: v.remarks
        });
        setIsDrawerOpen(true);
    };

    const handleFormFieldChange = <K extends keyof ExpenseFormData>(field: K, value: ExpenseFormData[K]) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingVoucher) {
            setExpenses((prev) =>
                prev.map((item) => (item.id === editingVoucher.id ? { ...item, ...formState } : item))
            );
        } else {
            const newItem: ExpenseVoucher = {
                id: Date.now().toString(),
                ...formState
            };
            setExpenses((prev) => [newItem, ...prev]);
        }
        setIsDrawerOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to void this expense voucher?')) {
            setExpenses((prev) => prev.filter((item) => item.id !== id));
        }
    };

    const filteredExpenses = expenses.filter(
        (exp) =>
            exp.voucherNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exp.paidTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            exp.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <ExpensesPresenter
            expenses={expenses}
            filteredExpenses={filteredExpenses}
            totalExpense={totalExpense}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isDrawerOpen={isDrawerOpen}
            onCloseDrawer={() => setIsDrawerOpen(false)}
            editingVoucher={editingVoucher}
            formState={formState}
            onFormFieldChange={handleFormFieldChange}
            onOpenCreate={handleOpenCreate}
            onOpenEdit={handleOpenEdit}
            onSave={handleSave}
            onDelete={handleDelete}
        />
    );
};

export default ExpensesPage;
