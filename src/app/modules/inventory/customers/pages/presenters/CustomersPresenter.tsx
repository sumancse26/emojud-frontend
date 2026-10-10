import React, { useState } from 'react';
import {
    Users,
    UserPlus,
    Edit3,
    Save,
    RefreshCw,
    AlertCircle,
    Loader2,
    Search,
    Phone,
    Mail,
    MapPin,
    Building2,
    PhoneCall,
    X
} from 'lucide-react';
import { SliderDrawer, FormField, inputClasses, PageHeader, Pagination, Skeleton } from '@/shared';
import type { CustomerItem, CreateUpdateCustomerPayload, CustomerDetailResponse } from '../../types/customer.types';

export interface CustomersPresenterProps {
    customers: CustomerItem[];
    filteredCustomers: CustomerItem[];
    isLoading: boolean;
    isError: boolean;
    error: string | null;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    isDrawerOpen: boolean;
    onCloseDrawer: () => void;
    editingCustomer: CustomerItem | null;
    formState: CreateUpdateCustomerPayload;
    onFormFieldChange: <K extends keyof CreateUpdateCustomerPayload>(
        field: K,
        value: CreateUpdateCustomerPayload[K]
    ) => void;
    onOpenCreate: () => void;
    onOpenEdit: (customer: CustomerItem) => void;
    onSave: (e?: React.FormEvent) => void;
    isSaving: boolean;
    saveError: string | null;
    onRefetch: () => void;
    onLookupPhone: (phone: string) => Promise<CustomerDetailResponse>;
}

export const CustomersPresenter: React.FC<CustomersPresenterProps> = ({
    customers,
    filteredCustomers,
    isLoading,
    isError,
    error,
    searchQuery,
    onSearchChange,
    isDrawerOpen,
    onCloseDrawer,
    editingCustomer,
    formState,
    onFormFieldChange,
    onOpenCreate,
    onOpenEdit,
    onSave,
    isSaving,
    saveError,
    onRefetch,
    onLookupPhone
}) => {
    // ─── Pagination ───────────────────────────────────────────────────
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / pageSize));
    const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // ─── Phone Lookup Modal State ─────────────────────────────────────
    const [isLookupOpen, setIsLookupOpen] = useState(false);
    const [lookupPhoneQuery, setLookupPhoneQuery] = useState('');
    const [lookupLoading, setLookupLoading] = useState(false);
    const [lookupResult, setLookupResult] = useState<CustomerItem[] | null>(null);
    const [lookupError, setLookupError] = useState<string | null>(null);

    const handleSearchPhone = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = lookupPhoneQuery.trim();
        if (!trimmed) return;

        setLookupLoading(true);
        setLookupError(null);
        setLookupResult(null);

        try {
            const res = await onLookupPhone(trimmed);
            if (Array.isArray(res)) {
                setLookupResult(res);
            } else if (res && typeof res === 'object' && 'data' in res && Array.isArray(res.data)) {
                setLookupResult(res.data);
            } else if (res && typeof res === 'object' && 'data' in res && res.data) {
                setLookupResult([res.data as unknown as CustomerItem]);
            } else if (res && typeof res === 'object' && 'id' in res) {
                setLookupResult([res as unknown as CustomerItem]);
            } else {
                setLookupResult([]);
            }
        } catch (err: unknown) {
            setLookupError(err instanceof Error ? err.message : 'Failed to lookup customer by phone.');
        } finally {
            setLookupLoading(false);
        }
    };

    const getInitials = (name: string) => {
        const parts = name.trim().split(' ');
        if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        return (name.substring(0, 2) || 'CU').toUpperCase();
    };

    return (
        <section className="space-y-6">
            <PageHeader>
                <PageHeader.Header
                    title="Customers & Receivables"
                    description="Manage customer profiles, phone directory, branch affiliations, and outstanding dues."
                    actions={
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    setIsLookupOpen(true);
                                    setLookupResult(null);
                                    setLookupError(null);
                                    setLookupPhoneQuery('');
                                }}
                                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition cursor-pointer"
                                title="Lookup customer by phone">
                                <PhoneCall className="w-3.5 h-3.5 text-blue-500" />
                                <span>Phone Lookup</span>
                            </button>

                            <button
                                onClick={onRefetch}
                                disabled={isLoading}
                                title="Refresh customers"
                                className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition cursor-pointer disabled:opacity-50">
                                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                            </button>

                            <button
                                onClick={onOpenCreate}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-emerald-600/20 transition cursor-pointer">
                                <UserPlus className="w-4 h-4" />
                                <span>Register New Customer</span>
                            </button>
                        </div>
                    }
                />

                <PageHeader.Bottom>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="relative w-full sm:w-80">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by name, code, phone, address..."
                                value={searchQuery}
                                onChange={(e) => {
                                    onSearchChange(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-[#080d1a] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                            />
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium self-end sm:self-auto">
                            Showing{' '}
                            <strong className="text-slate-700 dark:text-slate-200 font-semibold">
                                {filteredCustomers.length}
                            </strong>{' '}
                            of {customers.length} customers
                        </span>
                    </div>
                </PageHeader.Bottom>
            </PageHeader>

            {/* Error Banner */}
            {isError && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-2xl flex items-center justify-between gap-3 text-rose-700 dark:text-rose-400">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <div>
                            <p className="text-xs font-bold">Failed to load customer directory</p>
                            <p className="text-xs opacity-80">{error || 'Network error encountered.'}</p>
                        </div>
                    </div>
                    <button
                        onClick={onRefetch}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg transition cursor-pointer">
                        Retry
                    </button>
                </div>
            )}

            {/* Customers Data Table */}
            <div className="bg-white dark:bg-[#080d1a] border border-slate-200/80 dark:border-slate-800/60 rounded-2xl shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/80 dark:bg-slate-900/40 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80 text-[11px]">
                            <tr>
                                <th className="px-5 py-3.5">Customer & Code</th>
                                <th className="px-5 py-3.5">Phone & Contact</th>
                                <th className="px-5 py-3.5">Assigned Shop</th>
                                <th className="px-5 py-3.5">Address</th>
                                <th className="px-5 py-3.5 text-right">Previous Due (৳)</th>
                                <th className="px-5 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, idx) => (
                                    <tr key={idx}>
                                        <td className="px-5 py-4">
                                            <Skeleton className="h-4 w-32 rounded" />
                                        </td>
                                        <td className="px-5 py-4">
                                            <Skeleton className="h-4 w-28 rounded" />
                                        </td>
                                        <td className="px-5 py-4">
                                            <Skeleton className="h-4 w-24 rounded" />
                                        </td>
                                        <td className="px-5 py-4">
                                            <Skeleton className="h-4 w-32 rounded" />
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <Skeleton className="h-4 w-16 rounded ml-auto" />
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <Skeleton className="h-4 w-10 rounded ml-auto" />
                                        </td>
                                    </tr>
                                ))
                            ) : paginatedCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                                        <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                        <p className="text-sm font-semibold">No customers found</p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {searchQuery
                                                ? `No results match "${searchQuery}".`
                                                : 'Click "Register New Customer" to add your first customer.'}
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                paginatedCustomers.map((cust) => {
                                    const due =
                                        typeof cust.previous_due === 'number'
                                            ? cust.previous_due
                                            : parseFloat(String(cust.previous_due)) || 0;
                                    const initials = getInitials(cust.customer_name || 'Customer');

                                    return (
                                        <tr
                                            key={cust.id}
                                            className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-xs shrink-0">
                                                        {initials}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 dark:text-white">
                                                            {cust.customer_name}
                                                        </p>
                                                        <p className="text-[10px] text-slate-400 font-mono">
                                                            {cust.customer_code || `ID: ${cust.id}`}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-3.5">
                                                <div className="space-y-0.5">
                                                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-mono">
                                                        <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                                                        <span>{cust.phone || '—'}</span>
                                                    </div>
                                                    {cust.email && (
                                                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                                            <Mail className="w-3 h-3 shrink-0" />
                                                            <span className="truncate max-w-[150px]">{cust.email}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                                                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                    <span className="font-medium">
                                                        {cust.shop?.shop_name ||
                                                            cust.shop?.display_code ||
                                                            (cust.shop_id ? `Shop #${cust.shop_id}` : '—')}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400">
                                                {cust.address ? (
                                                    <div className="flex items-center gap-1.5">
                                                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                                        <span className="truncate max-w-[180px]">{cust.address}</span>
                                                    </div>
                                                ) : (
                                                    '—'
                                                )}
                                            </td>

                                            <td
                                                className={`px-5 py-3.5 font-mono font-bold text-right ${
                                                    due > 0
                                                        ? 'text-rose-500'
                                                        : due < 0
                                                          ? 'text-emerald-500'
                                                          : 'text-slate-400'
                                                }`}>
                                                ৳ {due.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                                            </td>

                                            <td className="px-5 py-3.5 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => onOpenEdit(cust)}
                                                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                                                        title="Edit Customer">
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredCustomers.length > pageSize && (
                    <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </div>
                )}
            </div>

            {/* SliderDrawer for Register / Edit Customer */}
            <SliderDrawer isOpen={isDrawerOpen} onClose={onCloseDrawer} width="max-w-lg">
                <SliderDrawer.Header onClose={onCloseDrawer}>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                            <Users className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                                {editingCustomer ? 'Edit Customer Profile' : 'Register New Customer'}
                            </h2>
                            <p className="text-[10px] text-slate-400">
                                {editingCustomer
                                    ? `Modify customer details for ${editingCustomer.customer_name}.`
                                    : 'Add a new client or wholesale buyer to your retail directory.'}
                            </p>
                        </div>
                    </div>
                </SliderDrawer.Header>

                <SliderDrawer.Body>
                    <form id="customer-form" onSubmit={onSave} className="space-y-4">
                        {saveError && (
                            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{saveError}</span>
                            </div>
                        )}

                        <FormField label="Customer Full Name" required>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Hasan Mahmud"
                                value={formState.customer_name}
                                onChange={(e) => onFormFieldChange('customer_name', e.target.value)}
                                className={inputClasses}
                            />
                        </FormField>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <FormField label="Contact Phone" required>
                                <input
                                    type="tel"
                                    required
                                    placeholder="e.g. 01700000000"
                                    value={formState.phone}
                                    onChange={(e) => onFormFieldChange('phone', e.target.value)}
                                    className={inputClasses}
                                />
                            </FormField>

                            <FormField label="Email Address">
                                <input
                                    type="email"
                                    placeholder="e.g. hasan@gmail.com"
                                    value={formState.email || ''}
                                    onChange={(e) => onFormFieldChange('email', e.target.value)}
                                    className={inputClasses}
                                />
                            </FormField>
                        </div>

                        <FormField label="Physical Address / Location">
                            <textarea
                                rows={2}
                                placeholder="e.g. House 12, Road 4, Dhanmondi, Dhaka"
                                value={formState.address || ''}
                                onChange={(e) => onFormFieldChange('address', e.target.value)}
                                className={inputClasses}
                            />
                        </FormField>

                        <FormField
                            label="Previous Due (৳)"
                            hint="Positive for due payable by customer, negative for advanced balance">
                            <input
                                type="number"
                                step="any"
                                placeholder="0"
                                value={formState.previous_due}
                                onChange={(e) => onFormFieldChange('previous_due', Number(e.target.value))}
                                className={inputClasses}
                            />
                        </FormField>
                    </form>
                </SliderDrawer.Body>

                <SliderDrawer.Footer>
                    <div className="flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={onCloseDrawer}
                            className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="customer-form"
                            disabled={isSaving}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-xs hover:shadow-emerald-600/20 cursor-pointer disabled:opacity-50">
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-3.5 h-3.5" />
                                    <span>{editingCustomer ? 'Update Profile' : 'Save Customer'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </SliderDrawer.Footer>
            </SliderDrawer>

            {/* Modal for Customer Lookup by Phone (GET /api/customers/:phone) */}
            {isLookupOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
                    <div className="bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsLookupOpen(false)}
                            className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer">
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                <PhoneCall className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Customer Phone Lookup
                                </h3>
                                <p className="text-[11px] text-slate-400">
                                    Query customer profile via GET /api/customers/:phone
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSearchPhone} className="flex gap-2 mb-4">
                            <input
                                type="tel"
                                required
                                placeholder="Enter phone (e.g. 01635000601)"
                                value={lookupPhoneQuery}
                                onChange={(e) => setLookupPhoneQuery(e.target.value)}
                                className={`flex-1 ${inputClasses}`}
                            />
                            <button
                                type="submit"
                                disabled={lookupLoading}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5">
                                {lookupLoading ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <Search className="w-3.5 h-3.5" />
                                )}
                                <span>Search</span>
                            </button>
                        </form>

                        {lookupError && (
                            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 mb-3">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{lookupError}</span>
                            </div>
                        )}

                        {lookupResult !== null && (
                            <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                                {lookupResult.length === 0 ? (
                                    <p className="text-center text-xs text-slate-400 py-4">
                                        No customer found for this phone number.
                                    </p>
                                ) : (
                                    lookupResult.map((res) => (
                                        <div
                                            key={res.id}
                                            className="p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <p className="font-bold text-xs text-slate-900 dark:text-white">
                                                    {res.customer_name}
                                                </p>
                                                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-300">
                                                    {res.customer_code}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 font-mono">
                                                Phone: {res.phone || '—'}
                                            </p>
                                            <div className="flex items-center justify-between text-[11px]">
                                                <span className="text-slate-400">Previous Due:</span>
                                                <span className="font-mono font-bold text-rose-500">
                                                    ৳ {Number(res.previous_due || 0).toLocaleString('en-BD')}
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsLookupOpen(false);
                                                    onOpenEdit(res);
                                                }}
                                                className="w-full mt-2 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition text-center cursor-pointer">
                                                Edit Profile
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};

export default CustomersPresenter;
