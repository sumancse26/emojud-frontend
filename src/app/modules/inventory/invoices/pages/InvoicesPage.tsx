import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ShoppingCart,
    Printer,
    FileText,
    User,
    Phone,
    CreditCard,
    Calendar,
    CheckCircle2,
    Clock,
    ScanBarcode,
    Trash2,
    Plus,
    Package,
    UserPlus,
    X,
    Loader2,
    AlertCircle,
    Banknote,
    Pencil,
    Lock
} from 'lucide-react';
import { PageHeader, SliderDrawer, Skeleton, Dropdown, FormField, inputClasses, type DropdownOption } from '@/shared';
import { useApp } from '@/app/providers';
import { tokenStorage } from '@/shared/services/tokenStorage';
import { useInvoice } from '../hooks/useInvoice';
import { InvoicesPresenter } from './presenters/InvoicesPresenter';
import type { CreateInvoicePayload, Invoice, ShopWiseProductItem } from '../types/invoice.types';
import type { User as AuthUser } from '@/app/modules/auth/types/auth.types';

interface CartItem {
    id: string;
    detailId?: number | null;
    productId: string;
    name: string;
    sku: string;
    unitPrice: number;
    quantity: number;
    availStock: number;
    vatAmt: number;
    discAmt: number;
}

interface NewCustomerForm {
    customer_name: string;
    phone: string;
    email: string;
    address: string;
}

const emptyCustomerForm = (): NewCustomerForm => ({
    customer_name: '',
    phone: '',
    email: '',
    address: ''
});

export const InvoicesPage: React.FC = () => {
    const { selectedBranch } = useApp();
    const {
        invoices,
        isLoading,
        refetch,
        isError,
        error,
        getInvoiceDetails,
        isDetailLoading,
        detailError,
        createInvoice,
        updateInvoice,
        isCreating,
        createError,
        // POS form data
        customers,
        isCustomersLoading,
        fetchCustomers,
        paymentMethods,
        isPaymentMethodsLoading,
        fetchPaymentMethods,
        products,
        isProductsLoading,
        fetchProducts,
        createCustomer,
        isCreatingCustomer,
        createCustomerError
    } = useInvoice(selectedBranch);

    const [searchTerm, setSearchTerm] = useState('');
    const [isPOSDrawerOpen, setIsPOSDrawerOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

    // Track if we are editing an existing invoice (id !== null) or creating (id === null)
    const [editingInvoiceId, setEditingInvoiceId] = useState<string | null>(null);
    const [editingInvoiceNumber, setEditingInvoiceNumber] = useState<string | null>(null);

    // POS Billing Drawer Form State
    const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState('');
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [productSearchTerm, setProductSearchTerm] = useState('');
    const [showProductDropdown, setShowProductDropdown] = useState(false);
    const productSearchRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Switch for passing is_submit (by default is 0)
    const [isSubmitSwitch, setIsSubmitSwitch] = useState(false);

    // Invoice-level Financial Adjustment Inputs
    const [discountInput, setDiscountInput] = useState('0');
    const [vatInput, setVatInput] = useState('0');
    const [paidInput, setPaidInput] = useState('');
    const [hasManualPaid, setHasManualPaid] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Inline new customer form
    const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
    const [newCustomerForm, setNewCustomerForm] = useState<NewCustomerForm>(emptyCustomerForm);

    // ─── Dropdown options (memoized) ────────────────────────────────────

    const customerOptions = useMemo<DropdownOption[]>(
        () =>
            customers.map((c) => ({
                value: c.id,
                label: c.customer_name,
                subLabel:
                    [c.phone, Number(c.previous_due) > 0 ? `Due ৳ ${c.previous_due}` : '']
                        .filter(Boolean)
                        .join(' · ') || c.customer_code
            })),
        [customers]
    );

    const paymentMethodOptions = useMemo<DropdownOption[]>(
        () =>
            paymentMethods.map((m) => ({
                value: m.id,
                label: m.lookup_value,
                subLabel: m.lookup_code
            })),
        [paymentMethods]
    );

    // Open Create Drawer (id = null, is_submit = 0)
    const handleOpenCreate = useCallback(() => {
        setEditingInvoiceId(null);
        setEditingInvoiceNumber(null);
        setIsSubmitSwitch(false);
        setIsPOSDrawerOpen(true);
        setValidationError(null);
        setSuccessMessage(null);
        setCartItems([]);
        setInvoiceDate(new Date().toISOString().slice(0, 10));
        setDiscountInput('0');
        setVatInput('0');
        setPaidInput('');
        setHasManualPaid(false);
        void fetchCustomers();
        void fetchPaymentMethods();
        void fetchProducts();
    }, [fetchCustomers, fetchPaymentMethods, fetchProducts]);

    // Open Edit Drawer (provision for updating invoice until submitted)
    const handleEditInvoice = useCallback(
        async (invoice: Invoice) => {
            if (invoice.isSubmit === 1) {
                alert('This invoice has already been submitted and is locked from editing.');
                return;
            }

            setEditingInvoiceId(invoice.id);
            setEditingInvoiceNumber(invoice.invoiceNumber);
            setIsSubmitSwitch(false); // Default is_submit is 0 until toggled
            setValidationError(null);
            setSuccessMessage(null);
            setIsPOSDrawerOpen(true);

            // Ensure form master data is loaded
            void fetchCustomers();
            void fetchPaymentMethods();
            void fetchProducts();

            try {
                const detail = await getInvoiceDetails(invoice);
                if (detail.isSubmit === 1) {
                    setIsPOSDrawerOpen(false);
                    alert('This invoice has already been submitted and cannot be updated.');
                    return;
                }
                setInvoiceDate(detail.rawDate ? detail.rawDate.split('T')[0] : new Date().toISOString().slice(0, 10));
                setSelectedCustomerId(String(detail.customerId || invoice.customerId || ''));

                if (detail.items && detail.items.length > 0) {
                    setCartItems(
                        detail.items.map((it) => ({
                            id: it.id || crypto.randomUUID(),
                            detailId: it.detailId ?? (Number(it.id) || null),
                            productId: it.productId || '1',
                            name: it.name,
                            sku: it.sku,
                            unitPrice: it.unitPrice,
                            quantity: it.quantity,
                            availStock: 999,
                            vatAmt: it.vatAmt ?? 0,
                            discAmt: it.discAmt ?? 0
                        }))
                    );
                } else {
                    setCartItems([]);
                }

                setDiscountInput(String(detail.discountAmount ?? 0));
                setVatInput(String(detail.vatAmount ?? 0));
                setPaidInput(String(detail.paidAmount ?? 0));
                setHasManualPaid(true);
                setIsSubmitSwitch(detail.isSubmit === 1);
            } catch {
                setSelectedCustomerId(String(invoice.customerId || ''));
                setInvoiceDate(invoice.rawDate ? invoice.rawDate.slice(0, 10) : new Date().toISOString().slice(0, 10));
                setDiscountInput(String(invoice.discountAmount ?? 0));
                setVatInput(String(invoice.vatAmount ?? 0));
                setPaidInput(String(invoice.paidAmount ?? 0));
                setHasManualPaid(true);
            }
        },
        [fetchCustomers, fetchPaymentMethods, fetchProducts, getInvoiceDetails]
    );

    // Pre-select first customer / payment method once data arrives for new creations
    useEffect(() => {
        if (customers.length > 0 && !selectedCustomerId && !editingInvoiceId) {
            setSelectedCustomerId(customers[0].id);
        }
    }, [customers, selectedCustomerId, editingInvoiceId]);

    useEffect(() => {
        if (paymentMethods.length > 0 && !selectedPaymentMethodId && !editingInvoiceId) {
            setSelectedPaymentMethodId(paymentMethods[0].id);
        }
    }, [paymentMethods, selectedPaymentMethodId, editingInvoiceId]);

    // Close product dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node) &&
                productSearchRef.current &&
                !productSearchRef.current.contains(e.target as Node)
            ) {
                setShowProductDropdown(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Filtered products for search dropdown
    const filteredProducts = useMemo(() => {
        if (!productSearchTerm.trim()) return products;
        const term = productSearchTerm.toLowerCase();
        return products.filter(
            (p) => p.product_name.toLowerCase().includes(term) || p.product_code.toLowerCase().includes(term)
        );
    }, [products, productSearchTerm]);

    // Add product to cart
    const addProductToCart = useCallback((product: ShopWiseProductItem) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => item.productId === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    detailId: null, // New product line added
                    productId: product.id,
                    name: product.product_name,
                    sku: product.product_code,
                    unitPrice: Number(product.sales_rate) || 0,
                    quantity: 1,
                    availStock: Number(product.avail_stock) || 0,
                    vatAmt: 0,
                    discAmt: 0
                }
            ];
        });
        setProductSearchTerm('');
        setShowProductDropdown(false);
    }, []);

    const updateQuantity = (id: string, delta: number) => {
        setCartItems(
            (prev) =>
                prev
                    .map((item) => {
                        if (item.id === id) {
                            const newQty = item.quantity + delta;
                            return newQty > 0 ? { ...item, quantity: newQty } : null;
                        }
                        return item;
                    })
                    .filter(Boolean) as CartItem[]
        );
    };

    const updateQuantityExact = (id: string, qty: number) => {
        const safeQty = Math.max(1, isNaN(qty) ? 1 : qty);
        setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: safeQty } : item)));
    };

    const updateUnitPrice = (id: string, rate: number) => {
        const safeRate = Math.max(0, isNaN(rate) ? 0 : rate);
        setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, unitPrice: safeRate } : item)));
    };

    const updateItemVat = (id: string, vat: number) => {
        const safeVat = Math.max(0, isNaN(vat) ? 0 : vat);
        setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, vatAmt: safeVat } : item)));
    };

    const updateItemDiscount = (id: string, disc: number) => {
        const safeDisc = Math.max(0, isNaN(disc) ? 0 : disc);
        setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, discAmt: safeDisc } : item)));
    };

    const removeItem = (id: string) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    // ─── Financial Calculations ──────────────────────────────────────────

    const totalItemCount = useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity, 0), [cartItems]);

    const grossSubtotal = useMemo(
        () => cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0),
        [cartItems]
    );

    const discountAmount = Number(discountInput) || 0;
    const vatAmount = Number(vatInput) || 0;
    const netAmount = Math.max(0, grossSubtotal - discountAmount + vatAmount);

    // Paid amount calculation
    const paidAmount = hasManualPaid ? Math.max(0, Number(paidInput) || 0) : netAmount;
    const dueAmount = Math.max(0, netAmount - paidAmount);

    // ─── Create new customer inline ─────────────────────────────────────

    const handleCreateCustomer = useCallback(async () => {
        if (!newCustomerForm.customer_name.trim() || !newCustomerForm.phone.trim()) return;
        try {
            const user = tokenStorage.getUser<AuthUser>();
            const created = await createCustomer({
                id: null,
                shop_id: Number(selectedBranch),
                customer_name: newCustomerForm.customer_name,
                phone: newCustomerForm.phone,
                email: newCustomerForm.email || null,
                address: newCustomerForm.address || null,
                previous_due: 0,
                created_by: Number(user?.id ?? 1)
            });
            if (created) {
                setSelectedCustomerId(String(created.id));
            }
            setShowNewCustomerForm(false);
            setNewCustomerForm(emptyCustomerForm());
        } catch {
            // createCustomerError is exposed by the hook
        }
    }, [createCustomer, newCustomerForm, selectedBranch]);

    // Reset form state when drawer closes
    const handleCloseCreate = useCallback(() => {
        setIsPOSDrawerOpen(false);
        setEditingInvoiceId(null);
        setEditingInvoiceNumber(null);
        setIsSubmitSwitch(false);
        setCartItems([]);
        setSelectedCustomerId('');
        setSelectedPaymentMethodId('');
        setProductSearchTerm('');
        setShowProductDropdown(false);
        setShowNewCustomerForm(false);
        setNewCustomerForm(emptyCustomerForm());
        setDiscountInput('0');
        setVatInput('0');
        setPaidInput('');
        setHasManualPaid(false);
        setValidationError(null);
        setSuccessMessage(null);
    }, []);

    // ─── POST /api/invoice Creation / Update Submission ─────────────────

    const handleConfirmAndSaveInvoice = useCallback(async () => {
        setValidationError(null);

        if (cartItems.length === 0) {
            setValidationError('Please add at least one product to the invoice.');
            return;
        }

        if (!selectedCustomerId) {
            setValidationError('Please select a customer for this invoice.');
            return;
        }

        const user = tokenStorage.getUser<AuthUser>();
        const isUpdate = Boolean(editingInvoiceId);

        // For create: id is null; for update: id passes the value
        const payload: CreateInvoicePayload = {
            id: isUpdate ? Number(editingInvoiceId) : null,
            shop_id: Number(selectedBranch),
            customer_id: Number(selectedCustomerId),
            invoice_date: invoiceDate,
            total_amount: Number(grossSubtotal.toFixed(2)),
            discount_amount: Number(discountAmount.toFixed(2)),
            vat_amount: Number(vatAmount.toFixed(2)),
            net_amount: Number(netAmount.toFixed(2)),
            paid_amount: Number(paidAmount.toFixed(2)),
            due_amount: Number(dueAmount.toFixed(2)),
            is_submit: isSubmitSwitch ? 1 : 0,
            user_id: Number(user?.id ?? 1),
            products: cartItems.map((item) => ({
                id: isUpdate ? (item.detailId ?? null) : null,
                product_id: Number(item.productId),
                qty: item.quantity,
                rate: item.unitPrice,
                vat_amt: Number((item.vatAmt || 0).toFixed(2)),
                disc_amt: Number((item.discAmt || 0).toFixed(2)),
                total_amount: Number((item.quantity * item.unitPrice).toFixed(2))
            }))
        };

        try {
            if (isUpdate) {
                await updateInvoice(payload);
                setSuccessMessage(
                    isSubmitSwitch
                        ? `Invoice #${editingInvoiceNumber ?? ''} submitted and finalized successfully!`
                        : `Invoice #${editingInvoiceNumber ?? ''} updated successfully as draft!`
                );
            } else {
                await createInvoice(payload);
                setSuccessMessage(
                    isSubmitSwitch
                        ? 'Invoice submitted and finalized successfully!'
                        : 'Draft invoice created successfully (is_submit = 0)!'
                );
            }

            setTimeout(() => {
                handleCloseCreate();
            }, 900);
        } catch {
            // The mutation error is exposed through createError for the UI
        }
    }, [
        cartItems,
        createInvoice,
        updateInvoice,
        discountAmount,
        dueAmount,
        editingInvoiceId,
        editingInvoiceNumber,
        grossSubtotal,
        handleCloseCreate,
        invoiceDate,
        isSubmitSwitch,
        netAmount,
        paidAmount,
        selectedBranch,
        selectedCustomerId,
        vatAmount
    ]);

    const handleViewInvoice = useCallback(
        async (invoice: Invoice) => {
            setSelectedInvoice(invoice);
            setIsDetailDrawerOpen(true);
            try {
                const detail = await getInvoiceDetails(invoice);
                setSelectedInvoice(detail);
            } catch {
                // The detail error is rendered inside the drawer.
            }
        },
        [getInvoiceDetails]
    );

    const handlePrintInvoice = handleViewInvoice;

    return (
        <section className="space-y-6">
            <InvoicesPresenter
                invoices={invoices}
                searchTerm={searchTerm}
                isLoading={isLoading}
                isError={isError}
                error={error}
                createError={createError}
                onSearchChange={setSearchTerm}
                onOpenCreate={handleOpenCreate}
                onRefetch={() => void refetch()}
                onViewInvoice={handleViewInvoice}
                onPrintInvoice={handlePrintInvoice}
                onEditInvoice={handleEditInvoice}
            />

            {/* 1. New / Update Invoice POS Billing Slider Drawer */}
            <SliderDrawer isOpen={isPOSDrawerOpen} onClose={handleCloseCreate} width="max-w-3xl">
                <SliderDrawer.Header onClose={handleCloseCreate}>
                    <div className="flex items-center gap-2.5">
                        <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                                editingInvoiceId ? 'bg-blue-600 text-white' : 'bg-emerald-500 text-slate-950'
                            }`}>
                            {editingInvoiceId ? <Pencil className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                                    {editingInvoiceId
                                        ? `Update Invoice #${editingInvoiceNumber}`
                                        : 'POS Quick Billing Register'}
                                </h2>
                                {editingInvoiceId && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/60 dark:border-amber-800">
                                        Draft Edit (ID: {editingInvoiceId})
                                    </span>
                                )}
                            </div>
                            <p className="text-[10px] text-slate-400">
                                {editingInvoiceId
                                    ? 'Update invoice records anytime until submission'
                                    : 'Live Sales Counter & Invoice Generator'}
                            </p>
                        </div>
                    </div>
                </SliderDrawer.Header>

                <SliderDrawer.Body>
                    <div className="space-y-4 text-xs">
                        {/* Feedback Messages */}
                        {validationError && (
                            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300 flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                                <div className="flex-1">
                                    <p className="font-semibold">{validationError}</p>
                                </div>
                            </div>
                        )}

                        {createError && (
                            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300 flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                                <div className="flex-1">
                                    <p className="font-semibold">Operation Failed</p>
                                    <p className="text-[11px] mt-0.5">{createError}</p>
                                </div>
                            </div>
                        )}

                        {successMessage && (
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                <p className="font-semibold">{successMessage}</p>
                            </div>
                        )}

                        {/* Submission Status Switch Card */}
                        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <div
                                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold shrink-0 transition-colors ${
                                        isSubmitSwitch
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                                    }`}>
                                    {isSubmitSwitch ? <Lock className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                                            {isSubmitSwitch ? 'Final Submission (Lock)' : 'Save as Draft (Editable)'}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                        {isSubmitSwitch
                                            ? 'Will be officially submitted and locked from further edits.'
                                            : 'Default is 0. Invoice remains editable and can be updated anytime.'}
                                    </p>
                                </div>
                            </div>

                            {/* Toggle Switch */}
                            <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                <input
                                    type="checkbox"
                                    checked={isSubmitSwitch}
                                    onChange={(e) => setIsSubmitSwitch(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>

                        {/* Customer, Settlement Method & Invoice Date */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block font-bold text-slate-600 dark:text-slate-300">
                                        Customer Account
                                    </label>
                                    {!editingInvoiceId && (
                                        <button
                                            type="button"
                                            onClick={() => setShowNewCustomerForm((prev) => !prev)}
                                            className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 hover:text-emerald-500 cursor-pointer transition-colors">
                                            {showNewCustomerForm ? (
                                                <>
                                                    <X className="w-3 h-3" /> Cancel
                                                </>
                                            ) : (
                                                <>
                                                    <UserPlus className="w-3 h-3" /> New Customer
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                                <Dropdown
                                    options={customerOptions}
                                    value={selectedCustomerId}
                                    onChange={(value) => setSelectedCustomerId(value)}
                                    placeholder="Select customer..."
                                    isLoading={isCustomersLoading}
                                    searchable={0}
                                    searchPlaceholder="Search by name or phone..."
                                    showCount
                                />
                            </div>

                            <FormField label="Settlement Method">
                                <Dropdown
                                    options={paymentMethodOptions}
                                    value={selectedPaymentMethodId}
                                    onChange={(value) => setSelectedPaymentMethodId(value)}
                                    placeholder="Select payment method..."
                                    isLoading={isPaymentMethodsLoading}
                                    searchable={5}
                                    searchPlaceholder="Search methods..."
                                />
                            </FormField>

                            <FormField label="Invoice Date" required>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={invoiceDate}
                                        onChange={(e) => setInvoiceDate(e.target.value)}
                                        className={inputClasses}
                                        required
                                    />
                                </div>
                            </FormField>
                        </div>

                        {/* Inline New Customer Form */}
                        {showNewCustomerForm && !editingInvoiceId && (
                            <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <UserPlus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                    <h4 className="font-bold text-xs text-emerald-800 dark:text-emerald-300">
                                        Quick Add New Customer
                                    </h4>
                                </div>

                                {createCustomerError && (
                                    <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
                                        {createCustomerError}
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                    <FormField label="Customer Name" required>
                                        <input
                                            type="text"
                                            value={newCustomerForm.customer_name}
                                            onChange={(e) =>
                                                setNewCustomerForm((f) => ({ ...f, customer_name: e.target.value }))
                                            }
                                            className={inputClasses}
                                            placeholder="Enter customer name"
                                            required
                                        />
                                    </FormField>
                                    <FormField label="Phone" required>
                                        <input
                                            type="text"
                                            value={newCustomerForm.phone}
                                            onChange={(e) =>
                                                setNewCustomerForm((f) => ({ ...f, phone: e.target.value }))
                                            }
                                            className={inputClasses}
                                            placeholder="01XXXXXXXXX"
                                            required
                                        />
                                    </FormField>
                                    <FormField label="Email">
                                        <input
                                            type="email"
                                            value={newCustomerForm.email}
                                            onChange={(e) =>
                                                setNewCustomerForm((f) => ({ ...f, email: e.target.value }))
                                            }
                                            className={inputClasses}
                                            placeholder="email@example.com"
                                        />
                                    </FormField>
                                    <FormField label="Address">
                                        <input
                                            type="text"
                                            value={newCustomerForm.address}
                                            onChange={(e) =>
                                                setNewCustomerForm((f) => ({ ...f, address: e.target.value }))
                                            }
                                            className={inputClasses}
                                            placeholder="Customer address"
                                        />
                                    </FormField>
                                </div>

                                <div className="flex justify-start">
                                    <button
                                        type="button"
                                        onClick={() => void handleCreateCustomer()}
                                        disabled={
                                            isCreatingCustomer ||
                                            !newCustomerForm.customer_name.trim() ||
                                            !newCustomerForm.phone.trim()
                                        }
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors">
                                        {isCreatingCustomer ? (
                                            <>
                                                <Loader2 className="w-3 h-3 animate-spin" /> Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-3 h-3" /> Add Customer
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Barcode / Search Product Input */}
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <ScanBarcode className="w-4 h-4" />
                            </span>
                            <input
                                ref={productSearchRef}
                                type="text"
                                value={productSearchTerm}
                                onChange={(e) => {
                                    setProductSearchTerm(e.target.value);
                                    setShowProductDropdown(true);
                                }}
                                onFocus={() => setShowProductDropdown(true)}
                                placeholder={
                                    isProductsLoading
                                        ? 'Loading products...'
                                        : 'Scan Barcode or Type SKU / Product Name to add...'
                                }
                                disabled={isProductsLoading}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-medium disabled:opacity-50"
                            />

                            {/* Product search dropdown */}
                            {showProductDropdown && !isProductsLoading && (
                                <div
                                    ref={dropdownRef}
                                    className="absolute z-50 left-0 right-0 top-full mt-1 max-h-56 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl">
                                    {filteredProducts.length === 0 ? (
                                        <div className="px-4 py-3 text-xs text-slate-400 text-center">
                                            No products found
                                        </div>
                                    ) : (
                                        filteredProducts.map((product) => {
                                            const stock = Number(product.avail_stock);
                                            const alreadyInCart = cartItems.find((c) => c.productId === product.id);
                                            const isOutOfStock = stock <= 0;

                                            return (
                                                <button
                                                    key={product.id}
                                                    type="button"
                                                    disabled={isOutOfStock}
                                                    onClick={() => addProductToCart(product)}
                                                    className={`w-full text-left px-3 py-2.5 flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors ${
                                                        isOutOfStock
                                                            ? 'opacity-40 cursor-not-allowed'
                                                            : 'hover:bg-emerald-50 dark:hover:bg-emerald-950/30 cursor-pointer'
                                                    }`}>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="font-semibold text-slate-900 dark:text-white text-xs truncate">
                                                            {product.product_name}
                                                            {alreadyInCart && (
                                                                <span className="ml-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                                                                    (×{alreadyInCart.quantity} in cart)
                                                                </span>
                                                            )}
                                                        </p>
                                                        <span className="text-[10px] text-slate-400 font-mono">
                                                            {product.product_code}
                                                        </span>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <p className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                                                            ৳ {Number(product.sales_rate).toFixed(2)}
                                                        </p>
                                                        <p
                                                            className={`text-[10px] font-medium ${stock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                                                            Stock: {stock}
                                                        </p>
                                                    </div>
                                                    {!isOutOfStock && (
                                                        <Plus className="w-4 h-4 text-emerald-500 shrink-0" />
                                                    )}
                                                </button>
                                            );
                                        })
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Cart Item Table */}
                        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                                    <tr>
                                        <th className="p-2.5">Item & SKU</th>
                                        <th className="p-2.5 text-center w-28">Quantity</th>
                                        <th className="p-2.5 text-right w-24">Unit Rate</th>
                                        <th className="p-2.5 text-right w-20">VAT</th>
                                        <th className="p-2.5 text-right w-20">Disc</th>
                                        <th className="p-2.5 text-right w-24">Total</th>
                                        <th className="p-2.5 text-center w-10" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                                    {cartItems.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="p-6 text-center text-slate-400">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Package className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                                                    <p className="font-medium">No products added yet</p>
                                                    <p className="text-[10px]">
                                                        Search and add products using the search bar above
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        cartItems.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20">
                                                <td className="p-2.5">
                                                    <p className="font-bold text-slate-900 dark:text-white">
                                                        {item.name}
                                                    </p>
                                                    <span className="text-[10px] text-slate-400 font-mono">
                                                        {item.sku}
                                                        {item.detailId && (
                                                            <span className="ml-1 text-[9px] text-blue-500">
                                                                #{item.detailId}
                                                            </span>
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="p-2.5 text-center">
                                                    <div className="inline-flex items-center border border-slate-200 dark:border-slate-700 rounded-lg">
                                                        <button
                                                            type="button"
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                            className="px-2 py-0.5 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                                                            -
                                                        </button>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) =>
                                                                updateQuantityExact(
                                                                    item.id,
                                                                    parseInt(e.target.value, 10)
                                                                )
                                                            }
                                                            className="w-10 text-center font-mono font-bold bg-transparent text-xs focus:outline-none"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                            className="px-2 py-0.5 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer">
                                                            +
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="p-2.5 text-right">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="any"
                                                        value={item.unitPrice}
                                                        onChange={(e) =>
                                                            updateUnitPrice(item.id, parseFloat(e.target.value))
                                                        }
                                                        className="w-20 text-right font-mono font-semibold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-0.5 text-xs focus:outline-none focus:border-emerald-500"
                                                    />
                                                </td>
                                                <td className="p-2.5 text-right">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="any"
                                                        value={item.vatAmt}
                                                        onChange={(e) =>
                                                            updateItemVat(item.id, parseFloat(e.target.value))
                                                        }
                                                        className="w-16 text-right font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-0.5 text-[11px] focus:outline-none focus:border-emerald-500"
                                                    />
                                                </td>
                                                <td className="p-2.5 text-right">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="any"
                                                        value={item.discAmt}
                                                        onChange={(e) =>
                                                            updateItemDiscount(item.id, parseFloat(e.target.value))
                                                        }
                                                        className="w-16 text-right font-mono bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-1.5 py-0.5 text-[11px] focus:outline-none focus:border-emerald-500"
                                                    />
                                                </td>
                                                <td className="p-2.5 font-mono font-bold text-right text-emerald-600 dark:text-emerald-400">
                                                    ৳ {(item.unitPrice * item.quantity).toFixed(2)}
                                                </td>
                                                <td className="p-2.5 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-slate-400 hover:text-rose-500 cursor-pointer p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/20"
                                                        title="Remove product">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Calculation & Payment Adjustment Panel */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Left: Summary totals */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-slate-500">
                                        <span>Gross Subtotal ({totalItemCount} items):</span>
                                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                                            ৳ {grossSubtotal.toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center gap-2">
                                        <span className="text-slate-500">Total Discount:</span>
                                        <div className="flex items-center gap-1">
                                            <span className="text-slate-400 text-xs">৳</span>
                                            <input
                                                type="number"
                                                min="0"
                                                step="any"
                                                value={discountInput}
                                                onChange={(e) => setDiscountInput(e.target.value)}
                                                placeholder="0"
                                                className="w-24 text-right font-mono font-semibold px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-rose-500 focus:outline-none focus:border-rose-400"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center gap-2">
                                        <span className="text-slate-500">VAT / Tax:</span>
                                        <div className="flex items-center gap-1">
                                            <span className="text-slate-400 text-xs">৳</span>
                                            <input
                                                type="number"
                                                min="0"
                                                step="any"
                                                value={vatInput}
                                                onChange={(e) => setVatInput(e.target.value)}
                                                placeholder="0"
                                                className="w-24 text-right font-mono font-semibold px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                                        <span>Net Amount Payable:</span>
                                        <span className="font-mono text-emerald-600 dark:text-emerald-400 text-base">
                                            ৳ {netAmount.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {/* Right: Payment collection & Due calculation */}
                                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <label className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                                            <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                                            Paid Amount
                                        </label>
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPaidInput(String(netAmount));
                                                    setHasManualPaid(true);
                                                }}
                                                className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 cursor-pointer">
                                                Full Paid
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPaidInput('0');
                                                    setHasManualPaid(true);
                                                }}
                                                className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 cursor-pointer">
                                                All Due
                                            </button>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none font-mono text-slate-400 text-sm">
                                            ৳
                                        </span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="any"
                                            value={hasManualPaid ? paidInput : netAmount > 0 ? netAmount : ''}
                                            onChange={(e) => {
                                                setHasManualPaid(true);
                                                setPaidInput(e.target.value);
                                            }}
                                            placeholder="0.00"
                                            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 text-right font-mono font-bold text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between pt-1">
                                        <span className="text-slate-500 font-medium">Due Balance:</span>
                                        <span
                                            className={`font-mono font-bold text-sm ${
                                                dueAmount > 0
                                                    ? 'text-rose-500'
                                                    : 'text-emerald-600 dark:text-emerald-400'
                                            }`}>
                                            ৳ {dueAmount.toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="text-right">
                                        {dueAmount === 0 ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                                                <CheckCircle2 className="w-3 h-3" /> Fully Settled
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
                                                <Clock className="w-3 h-3" /> Credit Receivable: ৳{' '}
                                                {dueAmount.toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SliderDrawer.Body>

                <SliderDrawer.Footer>
                    <div className="flex items-center justify-between gap-3">
                        <button
                            type="button"
                            onClick={handleCloseCreate}
                            className="w-1/3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                            Discard & Close
                        </button>
                        <button
                            type="button"
                            onClick={() => void handleConfirmAndSaveInvoice()}
                            disabled={isCreating || cartItems.length === 0}
                            className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                            {isCreating ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>{editingInvoiceId ? 'Updating Invoice...' : 'Saving Invoice...'}</span>
                                </>
                            ) : (
                                <>
                                    <Printer className="w-4 h-4" />
                                    <span>
                                        {editingInvoiceId
                                            ? isSubmitSwitch
                                                ? `Submit & Finalize Invoice (৳ ${netAmount.toFixed(2)})`
                                                : `Update Draft Invoice (৳ ${netAmount.toFixed(2)})`
                                            : isSubmitSwitch
                                              ? `Submit Invoice (৳ ${netAmount.toFixed(2)})`
                                              : `Save Draft Invoice (৳ ${netAmount.toFixed(2)})`}
                                    </span>
                                </>
                            )}
                        </button>
                    </div>
                </SliderDrawer.Footer>
            </SliderDrawer>

            {/* 2. Invoice Details Slider Drawer */}
            <SliderDrawer isOpen={isDetailDrawerOpen} onClose={() => setIsDetailDrawerOpen(false)} width="max-w-xl">
                <SliderDrawer.Header onClose={() => setIsDetailDrawerOpen(false)} className="items-start">
                    <PageHeader variant="flat" withAccent={false} className="min-w-0 flex-1 py-0">
                        <PageHeader.Header
                            title={
                                <span className="flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
                                        <FileText className="w-4 h-4" />
                                    </span>
                                    <span>Invoice Details</span>
                                </span>
                            }
                            description={selectedInvoice?.invoiceNumber ?? 'Invoice information'}
                        />
                        <PageHeader.Bottom>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                                <span>
                                    Customer:{' '}
                                    <strong className="text-slate-700 dark:text-slate-200">
                                        {selectedInvoice?.customerName ?? 'Loading...'}
                                    </strong>
                                </span>
                                <span>
                                    Issue date:{' '}
                                    <strong className="text-slate-700 dark:text-slate-200">
                                        {selectedInvoice?.issueDate ?? '—'}
                                    </strong>
                                </span>
                            </div>
                        </PageHeader.Bottom>
                    </PageHeader>
                </SliderDrawer.Header>

                <SliderDrawer.Body>
                    {isDetailLoading && <Skeleton.Table rows={4} columns={4} />}
                    {detailError && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300">
                            {detailError}
                        </div>
                    )}
                    {selectedInvoice && (
                        <div className="space-y-5 text-xs">
                            {/* Customer & Meta Card */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                                                {selectedInvoice.customerName}
                                            </h4>
                                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px] font-mono mt-0.5">
                                                <Phone className="w-3 h-3" />
                                                <span>{selectedInvoice.customerPhone}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                                                selectedInvoice.isSubmit === 1
                                                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200'
                                                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200'
                                            }`}>
                                            {selectedInvoice.isSubmit === 1 ? 'Submitted' : 'Draft'}
                                        </span>
                                        <span
                                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                selectedInvoice.status === 'Paid'
                                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                            }`}>
                                            {selectedInvoice.status === 'Paid' ? (
                                                <CheckCircle2 className="w-3 h-3" />
                                            ) : (
                                                <Clock className="w-3 h-3" />
                                            )}
                                            {selectedInvoice.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px]">
                                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                        <span>
                                            Issue Date:{' '}
                                            <strong className="text-slate-700 dark:text-slate-200">
                                                {selectedInvoice.issueDate}
                                            </strong>
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                        <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                                        <span>
                                            Method:{' '}
                                            <strong className="text-slate-700 dark:text-slate-200">
                                                {selectedInvoice.paymentMethod}
                                            </strong>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Invoice Line Items */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Billed Products & Services
                                </h3>
                                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-slate-50 dark:bg-slate-900/60 text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800 text-[11px]">
                                            <tr>
                                                <th className="p-3">Item Description</th>
                                                <th className="p-3 text-center">Qty</th>
                                                <th className="p-3 text-right">Unit Price</th>
                                                <th className="p-3 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                                            {selectedInvoice.items && selectedInvoice.items.length > 0 ? (
                                                selectedInvoice.items.map((item) => (
                                                    <tr key={item.id}>
                                                        <td className="p-3">
                                                            <p className="font-semibold text-slate-900 dark:text-white">
                                                                {item.name}
                                                            </p>
                                                            <span className="text-[10px] text-slate-400 font-mono">
                                                                {item.sku}
                                                            </span>
                                                        </td>
                                                        <td className="p-3 text-center font-mono font-medium">
                                                            {item.quantity}
                                                        </td>
                                                        <td className="p-3 text-right font-mono text-slate-600 dark:text-slate-300">
                                                            ৳{' '}
                                                            {item.unitPrice.toLocaleString('en-BD', {
                                                                minimumFractionDigits: 2
                                                            })}
                                                        </td>
                                                        <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                                                            ৳{' '}
                                                            {item.total.toLocaleString('en-BD', {
                                                                minimumFractionDigits: 2
                                                            })}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={4} className="p-4 text-center text-slate-400">
                                                        General Counter Order Summary
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Calculation Breakdown */}
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/80 dark:border-slate-800/60 space-y-2">
                                <div className="flex justify-between text-slate-500">
                                    <span>Gross Invoice Subtotal:</span>
                                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                                        ৳{' '}
                                        {selectedInvoice.totalAmount.toLocaleString('en-BD', {
                                            minimumFractionDigits: 2
                                        })}
                                    </span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span>Amount Paid by Customer:</span>
                                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                        ৳{' '}
                                        {selectedInvoice.paidAmount.toLocaleString('en-BD', {
                                            minimumFractionDigits: 2
                                        })}
                                    </span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span>Outstanding Due Balance:</span>
                                    <span
                                        className={`font-mono font-bold ${
                                            selectedInvoice.dueAmount > 0 ? 'text-rose-500' : 'text-slate-400'
                                        }`}>
                                        ৳{' '}
                                        {selectedInvoice.dueAmount.toLocaleString('en-BD', {
                                            minimumFractionDigits: 2
                                        })}
                                    </span>
                                </div>
                                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-sm font-bold text-slate-900 dark:text-white">
                                    <span>Total Net Receivable:</span>
                                    <span className="font-mono text-emerald-600 dark:text-emerald-400 text-base">
                                        ৳{' '}
                                        {selectedInvoice.totalAmount.toLocaleString('en-BD', {
                                            minimumFractionDigits: 2
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </SliderDrawer.Body>

                <SliderDrawer.Footer>
                    <div className="flex items-center justify-start gap-2.5">
                        {/* Provision for updating invoice until submitted */}
                        {selectedInvoice?.isSubmit !== 1 && (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsDetailDrawerOpen(false);
                                    if (selectedInvoice) void handleEditInvoice(selectedInvoice);
                                }}
                                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-xs font-bold transition cursor-pointer">
                                <Pencil className="w-3.5 h-3.5" />
                                <span>Edit Invoice</span>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => setIsDetailDrawerOpen(false)}
                            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer">
                            Close
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                window.print();
                            }}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer">
                            <Printer className="w-4 h-4" />
                            <span>Print Invoice Receipt</span>
                        </button>
                    </div>
                </SliderDrawer.Footer>
            </SliderDrawer>
        </section>
    );
};

export default InvoicesPage;
