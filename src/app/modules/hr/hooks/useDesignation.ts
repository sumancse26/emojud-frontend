import { useMemo, useCallback } from 'react';
import { useApi } from '@/shared/hooks/useApi';
import { designationService } from '../services/designationService';
import type {
    DesignationItem,
    CreateDesignationPayload,
    DesignationListResponse,
    DesignationMutationResponse
} from '../types/designation.types';

export interface UseDesignationOptions {
    immediate?: boolean;
    autoRefetchOnMutation?: boolean;
    onSuccess?: (data: DesignationListResponse) => void;
    onError?: (error: string) => void;
}

export interface UseDesignationReturn {
    designations: DesignationItem[];
    rawResponse: DesignationListResponse | null;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: string | null;
    refetch: () => Promise<DesignationListResponse>;
    createOrUpdateDesignation: (payload: CreateDesignationPayload) => Promise<DesignationMutationResponse>;
    isSaving: boolean;
    isSaveSuccess: boolean;
    isSaveError: boolean;
    saveError: string | null;
}

export function useDesignation(options: UseDesignationOptions = {}): UseDesignationReturn {
    const { immediate = true, autoRefetchOnMutation = true, onSuccess, onError } = options;

    const {
        data: rawResponse,
        isLoading,
        isSuccess,
        isError,
        error,
        execute: executeFetch
    } = useApi<DesignationListResponse, void>(
        () => designationService.getDesignations(),
        {
            immediate,
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
    } = useApi<DesignationMutationResponse, CreateDesignationPayload>((payload) =>
        designationService.createOrUpdateDesignation(payload)
    );

    const designations = useMemo<DesignationItem[]>(() => {
        if (!rawResponse) return [];
        if (Array.isArray(rawResponse)) return rawResponse;
        if (typeof rawResponse === 'object' && 'data' in rawResponse && Array.isArray(rawResponse.data)) {
            return rawResponse.data;
        }
        return [];
    }, [rawResponse]);

    const createOrUpdateDesignation = useCallback(
        async (payload: CreateDesignationPayload): Promise<DesignationMutationResponse> => {
            const res = await executeMutation(payload);
            if (autoRefetchOnMutation) {
                await executeFetch();
            }
            return res;
        },
        [executeMutation, autoRefetchOnMutation, executeFetch]
    );

    return {
        designations,
        rawResponse,
        isLoading,
        isSuccess,
        isError,
        error,
        refetch: executeFetch,
        createOrUpdateDesignation,
        isSaving,
        isSaveSuccess,
        isSaveError,
        saveError
    };
}

export default useDesignation;
