import { useMemo, useCallback } from 'react';
import { useApi } from '@/shared/hooks/useApi';
import { supplierService } from '../services/supplierService';
import type {
    SupplierItem,
    SupplierListParams,
    SupplierListResponse,
    CreateUpdateSupplierPayload,
    SupplierMutationResponse
} from '../types/supplier.types';

export interface UseSupplierOptions {
    initialParams?: SupplierListParams;
    immediate?: boolean;
    autoRefetchOnMutation?: boolean;
    onSuccess?: (data: SupplierListResponse) => void;
    onError?: (error: string) => void;
}

export interface UseSupplierReturn {
    suppliers: SupplierItem[];
    rawResponse: SupplierListResponse | null;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: string | null;
    refetch: () => Promise<SupplierListResponse>;
    getSupplierByPhone: (phone: string) => Promise<SupplierListResponse>;
    createOrUpdateSupplier: (payload: CreateUpdateSupplierPayload) => Promise<SupplierMutationResponse>;
    isSaving: boolean;
    isSaveSuccess: boolean;
    isSaveError: boolean;
    saveError: string | null;
}

export function useSupplier(options: UseSupplierOptions = {}): UseSupplierReturn {
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
    } = useApi<SupplierListResponse, SupplierListParams | undefined>(
        (params) => supplierService.getSuppliers(params ?? initialParams),
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
    } = useApi<SupplierMutationResponse, CreateUpdateSupplierPayload>((payload) =>
        supplierService.createOrUpdateSupplier(payload)
    );

    const suppliers = useMemo<SupplierItem[]>(() => {
        if (!rawResponse) return [];
        if (Array.isArray(rawResponse)) return rawResponse;
        if (typeof rawResponse === 'object' && 'data' in rawResponse && Array.isArray(rawResponse.data)) {
            return rawResponse.data;
        }
        return [];
    }, [rawResponse]);

    const createOrUpdateSupplier = useCallback(
        async (payload: CreateUpdateSupplierPayload): Promise<SupplierMutationResponse> => {
            const res = await executeMutation(payload);
            if (autoRefetchOnMutation) {
                await executeFetch(initialParams);
            }
            return res;
        },
        [executeMutation, autoRefetchOnMutation, executeFetch, initialParams]
    );

    const getSupplierByPhone = useCallback(async (phone: string): Promise<SupplierListResponse> => {
        return supplierService.getSupplierByPhone(phone);
    }, []);

    return {
        suppliers,
        rawResponse,
        isLoading,
        isSuccess,
        isError,
        error,
        refetch: () => executeFetch(initialParams),
        getSupplierByPhone,
        createOrUpdateSupplier,
        isSaving,
        isSaveSuccess,
        isSaveError,
        saveError
    };
}

export default useSupplier;
