import React, { useState } from 'react';
import { CustomerDueCollectionPresenter } from './presenters/CustomerDueCollectionPresenter';

export interface DueCollection {
    id: string;
    receiptNo: string;
    date: string;
    customerName: string;
    customerPhone: string;
    invoiceRef: string;
    collectedAmount: number;
    paymentMode: 'Cash' | 'bKash' | 'Card' | 'Nagad';
    cashier: string;
    remainingDue: number;
    notes: string;
}

export interface DueCollectionFormData {
    receiptNo: string;
    date: string;
    customerName: string;
    customerPhone: string;
    invoiceRef: string;
    collectedAmount: number;
    paymentMode: DueCollection['paymentMode'];
    cashier: string;
    remainingDue: number;
    notes: string;
}

const INITIAL_COLLECTIONS: DueCollection[] = [
    {
        id: '1',
        receiptNo: 'REC-2026-108',
        date: '2026-09-17',
        customerName: 'Farhana Yasmin',
        customerPhone: '+880 1911-889900',
        invoiceRef: 'INV-2026-0044',
        collectedAmount: 4400,
        paymentMode: 'bKash',
        cashier: 'Sadia Afreen',
        remainingDue: 0,
        notes: 'Cleared total due amount'
    },
    {
        id: '2',
        receiptNo: 'REC-2026-109',
        date: '2026-09-16',
        customerName: 'Mahmudul Hasan',
        customerPhone: '+880 1712-445566',
        invoiceRef: 'INV-2026-0039',
        collectedAmount: 2500,
        paymentMode: 'Cash',
        cashier: 'Sadia Afreen',
        remainingDue: 1800,
        notes: 'Partial settlement, remaining ৳ 1,800 due next week'
    }
];

export const CustomerDueCollectionPage: React.FC = () => {
    const [collections, setCollections] = useState<DueCollection[]>(INITIAL_COLLECTIONS);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<DueCollection | null>(null);

    const [formState, setFormState] = useState<DueCollectionFormData>({
        receiptNo: '',
        date: new Date().toISOString().split('T')[0],
        customerName: 'Rahim Chowdhury',
        customerPhone: '+880 1712-345678',
        invoiceRef: 'INV-2026-0050',
        collectedAmount: 1000,
        paymentMode: 'Cash',
        cashier: 'Suman Roy (Admin)',
        remainingDue: 0,
        notes: ''
    });

    const handleOpenCreate = () => {
        setEditingItem(null);
        setFormState({
            receiptNo: `REC-2026-1${Math.floor(10 + Math.random() * 80)}`,
            date: new Date().toISOString().split('T')[0],
            customerName: 'Mahbubur Rahman',
            customerPhone: '+880 1819-776655',
            invoiceRef: 'INV-2026-0052',
            collectedAmount: 5000,
            paymentMode: 'bKash',
            cashier: 'Suman Roy (Admin)',
            remainingDue: 7500,
            notes: ''
        });
        setIsDrawerOpen(true);
    };

    const handleOpenEdit = (item: DueCollection) => {
        setEditingItem(item);
        setFormState({
            receiptNo: item.receiptNo,
            date: item.date,
            customerName: item.customerName,
            customerPhone: item.customerPhone,
            invoiceRef: item.invoiceRef,
            collectedAmount: item.collectedAmount,
            paymentMode: item.paymentMode,
            cashier: item.cashier,
            remainingDue: item.remainingDue,
            notes: item.notes
        });
        setIsDrawerOpen(true);
    };

    const handleFormFieldChange = <K extends keyof DueCollectionFormData>(
        field: K,
        value: DueCollectionFormData[K]
    ) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingItem) {
            setCollections((prev) =>
                prev.map((c) => (c.id === editingItem.id ? { ...c, ...formState } : c))
            );
        } else {
            const newItem: DueCollection = {
                id: Date.now().toString(),
                ...formState
            };
            setCollections((prev) => [newItem, ...prev]);
        }
        setIsDrawerOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to void this collection receipt?')) {
            setCollections((prev) => prev.filter((c) => c.id !== id));
        }
    };

    const totalCollected = collections.reduce((acc, c) => acc + c.collectedAmount, 0);

    const filteredCollections = collections.filter(
        (c) =>
            c.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.customerPhone.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <CustomerDueCollectionPresenter
            collections={collections}
            filteredCollections={filteredCollections}
            totalCollected={totalCollected}
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

export default CustomerDueCollectionPage;
