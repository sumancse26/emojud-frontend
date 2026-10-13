import { useCallback, useMemo } from 'react';
import { useApi } from '@/shared/hooks/useApi';
import { clearGetCache } from '@/shared/services/apiClient';
import { invoiceService } from '../services/invoiceService';
import type {
    CreateInvoicePayload,
    Invoice,
    InvoiceApiResponse,
    InvoiceDetail,
    InvoiceDetailParams,
    InvoiceListItem,
    InvoiceListParams,
    InvoiceMutationResponse,
    PaymentMethodItem,
    PaymentMethodLookupResponse,
    ShopWiseProductItem,
    ShopWiseProductResponse
} from '../types/invoice.types';
import type {
    CustomerItem,
    CustomerListResponse,
    CreateUpdateCustomerPayload,
    CustomerMutationResponse
} from '@/app/modules/inventory/customers/types/customer.types';

const toNumber = (value: string | number | undefined): number => Number(value ?? 0);

function normalizeInvoice(item: InvoiceListItem | InvoiceDetail): Invoice {
    const isSubmitNum = item.is_submit !== undefined && item.is_submit !== null ? Number(item.is_submit) : 0;
    const isPaid = toNumber(item.due_amount) === 0 && toNumber(item.paid_amount) > 0;
    const isPartial = toNumber(item.due_amount) > 0 && toNumber(item.paid_amount) > 0;
    const status = isPaid ? 'Paid' : isPartial ? 'Partial' : 'Due';
    const tranStatusText = item.tranStatus?.lookup_code || (isSubmitNum === 1 ? 'Submitted' : 'Draft');

    return {
        id: String(item.id),
        invoiceNumber: item.invoice_no,
        customerName: item.customer?.customer_name ?? 'Walk-in Customer',
        customerPhone: item.customer?.customer_code ?? '—',
        issueDate: item.invoice_date ? new Date(item.invoice_date).toLocaleDateString('en-GB') : '—',
        rawDate: item.invoice_date,
        paymentMethod: tranStatusText,
        totalAmount: toNumber(item.total_amount),
        paidAmount: toNumber(item.paid_amount),
        dueAmount: toNumber(item.due_amount),
        discountAmount: toNumber(item.discount_amount),
        vatAmount: toNumber(item.vat_amount),
        netAmount: toNumber(item.net_amount),
        status,
        isSubmit: isSubmitNum,
        shopId: Number(item.shop?.id ?? 0),
        customerId: Number(item.customer?.id ?? 0),
        items:
            'invoiceDtls' in item
                ? (item.invoiceDtls ?? []).map((detail) => ({
                      id: String(detail.id),
                      detailId: Number(detail.id),
                      productId: String(detail.product?.id || detail.product_id || ''),
                      name: detail.product?.product_name ?? 'Product',
                      sku: detail.product?.product_code ?? '—',
                      quantity: toNumber(detail.qty),
                      unitPrice: toNumber(detail.rate),
                      vatAmt: toNumber(detail.vat_amt),
                      discAmt: toNumber(detail.disc_amt),
                      total: toNumber(detail.total_amount)
                  }))
                : undefined
    };
}

// ─── Helper: extract array from possibly-wrapped response ───────────────────

function extractCustomerList(response: CustomerListResponse): CustomerItem[] {
    if (Array.isArray(response)) return response;
    if (response && typeof response === 'object' && 'data' in response) {
        const inner = (response as { data: unknown }).data;
        return Array.isArray(inner) ? inner : [];
    }
    return [];
}

function extractProductList(response: ShopWiseProductResponse): ShopWiseProductItem[] {
    if (Array.isArray(response)) return response as unknown as ShopWiseProductItem[];
    return response?.data ?? [];
}

function extractPaymentMethods(response: PaymentMethodLookupResponse): PaymentMethodItem[] {
    return response?.data?.payment_method ?? [];
}

// ─── Return type ────────────────────────────────────────────────────────────

export interface UseInvoiceReturn {
    invoices: Invoice[];
    isLoading: boolean;
    isError: boolean;
    error: string | null;
    refetch: () => Promise<InvoiceApiResponse<InvoiceListItem[]>>;
    getInvoiceDetails: (invoice: Invoice) => Promise<Invoice>;
    refetchInvoiceDetails: (invoice: Invoice) => Promise<Invoice>;
    detail: Invoice | null;
    isDetailLoading: boolean;
    detailError: string | null;
    createInvoice: (payload: CreateInvoicePayload) => Promise<InvoiceMutationResponse>;
    updateInvoice: (payload: CreateInvoicePayload) => Promise<InvoiceMutationResponse>;
    isCreating: boolean;
    createError: string | null;
    // ─── POS form data ──────────────────────────────────────────────────
    customers: CustomerItem[];
    isCustomersLoading: boolean;
    customersError: string | null;
    fetchCustomers: () => Promise<void>;
    paymentMethods: PaymentMethodItem[];
    isPaymentMethodsLoading: boolean;
    paymentMethodsError: string | null;
    fetchPaymentMethods: () => Promise<void>;
    products: ShopWiseProductItem[];
    isProductsLoading: boolean;
    productsError: string | null;
    fetchProducts: () => Promise<void>;
    createCustomer: (payload: CreateUpdateCustomerPayload) => Promise<CustomerItem | null>;
    isCreatingCustomer: boolean;
    createCustomerError: string | null;
}

export function useInvoice(shopId: string | number): UseInvoiceReturn {
    const params = useMemo<InvoiceListParams>(() => ({ shop_id: shopId }), [shopId]);

    const listRequest = useApi<InvoiceApiResponse<InvoiceListItem[]>, InvoiceListParams>(invoiceService.getInvoices, {
        immediate: true,
        initialParams: params
    });

    const detailRequest = useApi<InvoiceApiResponse<InvoiceDetail>, InvoiceDetailParams>(
        invoiceService.getInvoiceDetails,
        { suspense: false }
    );

    const createRequest = useApi<InvoiceMutationResponse, CreateInvoicePayload>(invoiceService.createInvoice);

    // ─── POS form queries ─────────────────────────────────────────────

    const customerRequest = useApi<CustomerListResponse, { shop_id: string | number }>(invoiceService.getCustomers);

    const paymentMethodRequest = useApi<PaymentMethodLookupResponse, void>(invoiceService.getPaymentMethods);

    const productRequest = useApi<ShopWiseProductResponse, { shop_id: string | number }>(
        invoiceService.getShopWiseProducts
    );

    const createCustomerRequest = useApi<CustomerMutationResponse, CreateUpdateCustomerPayload>(
        invoiceService.createCustomer
    );

    // ─── Derived data ─────────────────────────────────────────────────

    const invoices = useMemo(() => listRequest.data?.data?.map(normalizeInvoice) ?? [], [listRequest.data]);

    const customers = useMemo(
        () => (customerRequest.data ? extractCustomerList(customerRequest.data) : []),
        [customerRequest.data]
    );

    const paymentMethods = useMemo(
        () => (paymentMethodRequest.data ? extractPaymentMethods(paymentMethodRequest.data) : []),
        [paymentMethodRequest.data]
    );

    const products = useMemo(
        () => (productRequest.data ? extractProductList(productRequest.data) : []),
        [productRequest.data]
    );

    // ─── Actions ──────────────────────────────────────────────────────

    const getInvoiceDetails = useCallback(
        async (invoice: Invoice): Promise<Invoice> => {
            const response = await detailRequest.execute({ inv_id: invoice.id, shop_id: invoice.shopId ?? shopId });
            return normalizeInvoice(response.data);
        },
        [detailRequest.execute, shopId]
    );

    const refetchInvoiceDetails = useCallback(
        async (invoice: Invoice): Promise<Invoice> => {
            // A manual refresh must bypass the 30-minute GET cache.
            clearGetCache();
            return getInvoiceDetails(invoice);
        },
        [getInvoiceDetails]
    );

    const createInvoice = useCallback(
        async (payload: CreateInvoicePayload) => {
            const response = await createRequest.execute(payload);
            // The POST clears the GET cache; this explicitly requests the updated list.
            await listRequest.execute(params);
            return response;
        },
        [createRequest.execute, listRequest.execute, params]
    );

    const fetchCustomers = useCallback(async () => {
        await customerRequest.execute({ shop_id: shopId });
    }, [customerRequest.execute, shopId]);

    const fetchPaymentMethods = useCallback(async () => {
        await paymentMethodRequest.execute();
    }, [paymentMethodRequest.execute]);

    const fetchProducts = useCallback(async () => {
        await productRequest.execute({ shop_id: shopId });
    }, [productRequest.execute, shopId]);

    const createCustomer = useCallback(
        async (payload: CreateUpdateCustomerPayload): Promise<CustomerItem | null> => {
            const response = await createCustomerRequest.execute(payload);
            // Re-fetch the customers list so the new customer appears in the dropdown
            await customerRequest.execute({ shop_id: shopId });
            // Extract the created customer from the response
            if (response && typeof response === 'object' && 'data' in response) {
                return (response as { data: CustomerItem }).data ?? null;
            }
            return (response as unknown as CustomerItem) ?? null;
        },
        [createCustomerRequest.execute, customerRequest.execute, shopId]
    );

    return {
        invoices,
        isLoading: listRequest.isLoading,
        isError: listRequest.isError,
        error: listRequest.error,
        refetch: () => listRequest.execute(params),
        getInvoiceDetails,
        refetchInvoiceDetails,
        detail: detailRequest.data ? normalizeInvoice(detailRequest.data.data) : null,
        isDetailLoading: detailRequest.isLoading,
        detailError: detailRequest.error,
        createInvoice,
        updateInvoice: createInvoice,
        isCreating: createRequest.isLoading,
        createError: createRequest.error,
        // POS form data
        customers,
        isCustomersLoading: customerRequest.isLoading,
        customersError: customerRequest.error,
        fetchCustomers,
        paymentMethods,
        isPaymentMethodsLoading: paymentMethodRequest.isLoading,
        paymentMethodsError: paymentMethodRequest.error,
        fetchPaymentMethods,
        products,
        isProductsLoading: productRequest.isLoading,
        productsError: productRequest.error,
        fetchProducts,
        createCustomer,
        isCreatingCustomer: createCustomerRequest.isLoading,
        createCustomerError: createCustomerRequest.error
    };
}

export default useInvoice;
