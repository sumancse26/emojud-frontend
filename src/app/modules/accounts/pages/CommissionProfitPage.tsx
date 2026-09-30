import React, { useState } from 'react';
import { CommissionProfitPresenter } from './presenters/CommissionProfitPresenter';

export interface CommissionRecord {
    id: string;
    repName: string;
    outlet: string;
    monthlySalesTarget: number;
    salesAchieved: number;
    commissionRate: number;
    commissionEarned: number;
    payoutStatus: 'Paid' | 'Eligible' | 'On Hold';
    month: string;
    notes: string;
}

export interface CommissionProfitFormData {
    repName: string;
    outlet: string;
    monthlySalesTarget: number;
    salesAchieved: number;
    commissionRate: number;
    payoutStatus: CommissionRecord['payoutStatus'];
    month: string;
    notes: string;
}

const INITIAL_COMMISSIONS: CommissionRecord[] = [
    {
        id: '1',
        repName: 'Mahbubur Rahman',
        outlet: 'Dhanmondi Flagship Outlet',
        monthlySalesTarget: 500000,
        salesAchieved: 620000,
        commissionRate: 2.5,
        commissionEarned: 15500,
        payoutStatus: 'Eligible',
        month: 'September 2026',
        notes: 'Target exceeded by 24%'
    },
    {
        id: '2',
        repName: 'Arif Ahmed',
        outlet: 'Gulshan Branch Outlet',
        monthlySalesTarget: 450000,
        salesAchieved: 490000,
        commissionRate: 2.0,
        commissionEarned: 9800,
        payoutStatus: 'Eligible',
        month: 'September 2026',
        notes: 'Target achieved successfully'
    },
    {
        id: '3',
        repName: 'Nusrat Jahan',
        outlet: 'Dhanmondi Flagship Outlet',
        monthlySalesTarget: 400000,
        salesAchieved: 420000,
        commissionRate: 2.0,
        commissionEarned: 8400,
        payoutStatus: 'Paid',
        month: 'August 2026',
        notes: 'Disbursed with August salary'
    }
];

export const CommissionProfitPage: React.FC = () => {
    const [commissions, setCommissions] = useState<CommissionRecord[]>(INITIAL_COMMISSIONS);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<CommissionRecord | null>(null);

    const [formState, setFormState] = useState<CommissionProfitFormData>({
        repName: '',
        outlet: 'Dhanmondi Flagship Outlet',
        monthlySalesTarget: 500000,
        salesAchieved: 550000,
        commissionRate: 2.5,
        payoutStatus: 'Eligible',
        month: 'September 2026',
        notes: ''
    });

    const handleOpenCreate = () => {
        setEditingItem(null);
        setFormState({
            repName: '',
            outlet: 'Dhanmondi Flagship Outlet',
            monthlySalesTarget: 500000,
            salesAchieved: 550000,
            commissionRate: 2.5,
            payoutStatus: 'Eligible',
            month: 'September 2026',
            notes: ''
        });
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (c: CommissionRecord) => {
        setEditingItem(c);
        setFormState({
            repName: c.repName,
            outlet: c.outlet,
            monthlySalesTarget: c.monthlySalesTarget,
            salesAchieved: c.salesAchieved,
            commissionRate: c.commissionRate,
            payoutStatus: c.payoutStatus,
            month: c.month,
            notes: c.notes
        });
        setIsDrawerOpen(true);
    };

    const handleFormFieldChange = <K extends keyof CommissionProfitFormData>(
        field: K,
        value: CommissionProfitFormData[K]
    ) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const commissionEarned = (formState.salesAchieved * formState.commissionRate) / 100;
        if (editingItem) {
            setCommissions((prev) =>
                prev.map((item) =>
                    item.id === editingItem.id
                        ? { ...item, ...formState, commissionEarned }
                        : item
                )
            );
        } else {
            const newItem: CommissionRecord = {
                id: Date.now().toString(),
                ...formState,
                commissionEarned
            };
            setCommissions((prev) => [newItem, ...prev]);
        }
        setIsDrawerOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to remove this commission entry?')) {
            setCommissions((prev) => prev.filter((item) => item.id !== id));
        }
    };

    const totalEarned = commissions.reduce((acc, c) => acc + c.commissionEarned, 0);

    const filteredCommissions = commissions.filter(
        (c) =>
            c.repName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.outlet.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <CommissionProfitPresenter
            commissions={commissions}
            filteredCommissions={filteredCommissions}
            totalEarned={totalEarned}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
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

export default CommissionProfitPage;
