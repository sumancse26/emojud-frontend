import { useMemo, useCallback } from 'react';
import { useApi } from '@/shared/hooks/useApi';
import { customerService } from '../services/customerService';
import type {
    CustomerItem,
    CustomerListParams,
    CustomerListResponse,
    CustomerDetailResponse,
    CreateUpdateCustomerPayload,
    CustomerMutationResponse
} from '../types/customer.types';

export interface UseCustomerOptions {
    initialParams?: CustomerListParams;
    immediate?: boolean;
    autoRefetchOnMutation?: boolean;
    onSuccess?: (data: CustomerListResponse) => void;
    onError?: (error: string) => void;
}

export interface UseCustomerReturn {
    customers: CustomerItem[];
    rawResponse: CustomerListResponse | null;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: string | null;
    refetch: () => Promise<CustomerListResponse>;
    getCustomerByPhone: (phone: string) => Promise<CustomerDetailResponse>;
    createOrUpdateCustomer: (payload: CreateUpdateCustomerPayload) => Promise<CustomerMutationResponse>;
    isSaving: boolean;
    isSaveSuccess: boolean;
    isSaveError: boolean;
    saveError: string | null;
}

export function useCustomer(options: UseCustomerOptions = {}): UseCustomerReturn {
    const {
        initialParams,
        immediate = true,
        autoRefetchOnMutation = true,
        onSuccess,
        onError
    } = options;

    const {
        data: rawResponse,
        isLoading,
        isSuccess,
        isError,
        error,
        execute: executeFetch
    } = useApi<CustomerListResponse, CustomerListParams | undefined>(
        (params) => customerService.getCustomers(params ?? initialParams),
        {
            immediate,
            initialParams,
            onSuccess,
            onError
        }
    );

    const {
        isLoading: isSaving,
        isSuccess: isSaveSuccess,
        isError: isSaveError,
        error: saveError,
        execute: executeMutation
    } = useApi<CustomerMutationResponse, CreateUpdateCustomerPayload>((payload) =>
        customerService.createOrUpdateCustomer(payload)
    );

    const customers = useMemo<CustomerItem[]>(() => {
        if (!rawResponse) return [];
        if (Array.isArray(rawResponse)) return rawResponse;
        if (typeof rawResponse === 'object' && 'data' in rawResponse && Array.isArray(rawResponse.data)) {
            return rawResponse.data;
        }
        return [];
    }, [rawResponse]);

    const createOrUpdateCustomer = useCallback(
        async (payload: CreateUpdateCustomerPayload): Promise<CustomerMutationResponse> => {
            const res = await executeMutation(payload);
            if (autoRefetchOnMutation) {
                await executeFetch(initialParams);
            }
            return res;
        },
        [executeMutation, autoRefetchOnMutation, executeFetch, initialParams]
    );

    const getCustomerByPhone = useCallback(async (phone: string): Promise<CustomerDetailResponse> => {
        return customerService.getCustomerByPhone(phone);
    }, []);

    return {
        customers,
        rawResponse,
        isLoading,
        isSuccess,
        isError,
        error,
        refetch: () => executeFetch(initialParams),
        getCustomerByPhone,
        createOrUpdateCustomer,
        isSaving,
        isSaveSuccess,
        isSaveError,
        saveError
    };
}

export default useCustomer;
