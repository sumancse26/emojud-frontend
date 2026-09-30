import React, { useState } from 'react';
import { SupplierPaymentPresenter } from './presenters/SupplierPaymentPresenter';

export interface SupplierPayment {
    id: string;
    paymentNo: string;
    date: string;
    supplierName: string;
    purchaseOrderRef: string;
    paidAmount: number;
    paymentMethod: 'Bank Transfer' | 'Cheque' | 'Cash' | 'bKash';
    chequeNo?: string;
    status: 'Settled' | 'Pending Clearance';
    notes: string;
}

export interface SupplierPaymentFormData {
    paymentNo: string;
    date: string;
    supplierName: string;
    purchaseOrderRef: string;
    paidAmount: number;
    paymentMethod: SupplierPayment['paymentMethod'];
    chequeNo: string;
    status: SupplierPayment['status'];
    notes: string;
}

const INITIAL_PAYMENTS: SupplierPayment[] = [
    {
        id: '1',
        paymentNo: 'PAY-2026-041',
        date: '2026-09-16',
        supplierName: 'Apex Textiles & Fabrics Ltd.',
        purchaseOrderRef: 'PO-2026-0041',
        paidAmount: 150000,
        paymentMethod: 'Bank Transfer',
        status: 'Settled',
        notes: 'Partial settlement against batch invoice'
    },
    {
        id: '2',
        paymentNo: 'PAY-2026-042',
        date: '2026-09-14',
        supplierName: 'Bengal Leather Crafts Ind.',
        purchaseOrderRef: 'PO-2026-0038',
        paidAmount: 65000,
        paymentMethod: 'Cheque',
        chequeNo: 'CHQ-882910',
        status: 'Settled',
        notes: 'Account payee cheque cleared'
    },
    {
        id: '3',
        paymentNo: 'PAY-2026-043',
        date: '2026-09-17',
        supplierName: 'Royal Fragrance & Oils Ltd.',
        purchaseOrderRef: 'PO-2026-0044',
        paidAmount: 45000,
        paymentMethod: 'Bank Transfer',
        status: 'Pending Clearance',
        notes: 'BEFTN transfer in transit'
    }
];

export const SupplierPaymentPage: React.FC = () => {
    const [payments, setPayments] = useState<SupplierPayment[]>(INITIAL_PAYMENTS);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingPayment, setEditingPayment] = useState<SupplierPayment | null>(null);

    const [formState, setFormState] = useState<SupplierPaymentFormData>({
        paymentNo: '',
        date: new Date().toISOString().split('T')[0],
        supplierName: 'Apex Textiles & Fabrics Ltd.',
        purchaseOrderRef: 'PO-2026-0041',
        paidAmount: 25000,
        paymentMethod: 'Bank Transfer',
        chequeNo: '',
        status: 'Settled',
        notes: ''
    });

    const handleOpenCreate = () => {
        setEditingPayment(null);
        setFormState({
            paymentNo: `PAY-2026-0${Math.floor(45 + Math.random() * 50)}`,
            date: new Date().toISOString().split('T')[0],
            supplierName: 'Apex Textiles & Fabrics Ltd.',
            purchaseOrderRef: 'PO-2026-0041',
            paidAmount: 25000,
            paymentMethod: 'Bank Transfer',
            chequeNo: '',
            status: 'Settled',
            notes: ''
        });
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (p: SupplierPayment) => {
        setEditingPayment(p);
        setFormState({
            paymentNo: p.paymentNo,
            date: p.date,
            supplierName: p.supplierName,
            purchaseOrderRef: p.purchaseOrderRef,
            paidAmount: p.paidAmount,
            paymentMethod: p.paymentMethod,
            chequeNo: p.chequeNo || '',
            status: p.status,
            notes: p.notes
        });
        setIsDrawerOpen(true);
    };

    const handleFormFieldChange = <K extends keyof SupplierPaymentFormData>(
        field: K,
        value: SupplierPaymentFormData[K]
    ) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingPayment) {
            setPayments((prev) =>
                prev.map((item) => (item.id === editingPayment.id ? { ...item, ...formState } : item))
            );
        } else {
            const newItem: SupplierPayment = {
                id: Date.now().toString(),
                ...formState
            };
            setPayments((prev) => [newItem, ...prev]);
        }
        setIsDrawerOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to void this payment record?')) {
            setPayments((prev) => prev.filter((p) => p.id !== id));
        }
    };

    const totalPaid = payments.reduce((acc, p) => acc + p.paidAmount, 0);

    const filteredPayments = payments.filter(
        (p) =>
            p.paymentNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.purchaseOrderRef.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SupplierPaymentPresenter
            payments={payments}
            filteredPayments={filteredPayments}
            totalPaid={totalPaid}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isDrawerOpen={isDrawerOpen}
            onCloseDrawer={() => setIsDrawerOpen(false)}
            editingPayment={editingPayment}
            formState={formState}
            onFormFieldChange={handleFormFieldChange}
            onOpenCreate={handleOpenCreate}
            onOpenEdit={handleOpenEdit}
            onSave={handleSave}
            onDelete={handleDelete}
        />
    );
};

export default SupplierPaymentPage;
