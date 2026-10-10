import { useMemo, useCallback } from 'react';
import { useApi } from '@/shared/hooks/useApi';
import { departmentService } from '../services/departmentService';
import type {
    DepartmentItem,
    CreateDepartmentPayload,
    DepartmentListResponse,
    DepartmentMutationResponse
} from '../types/department.types';

export interface UseDepartmentOptions {
    immediate?: boolean;
    autoRefetchOnMutation?: boolean;
    onSuccess?: (data: DepartmentListResponse) => void;
    onError?: (error: string) => void;
}

export interface UseDepartmentReturn {
    departments: DepartmentItem[];
    rawResponse: DepartmentListResponse | null;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: string | null;
    refetch: () => Promise<DepartmentListResponse>;
    createOrUpdateDepartment: (payload: CreateDepartmentPayload) => Promise<DepartmentMutationResponse>;
    isSaving: boolean;
    isSaveSuccess: boolean;
    isSaveError: boolean;
    saveError: string | null;
}

export function useDepartment(options: UseDepartmentOptions = {}): UseDepartmentReturn {
    const { immediate = true, autoRefetchOnMutation = true, onSuccess, onError } = options;

    const {
        data: rawResponse,
        isLoading,
        isSuccess,
        isError,
        error,
        execute: executeFetch
    } = useApi<DepartmentListResponse, void>(
        () => departmentService.getDepartments(),
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
    } = useApi<DepartmentMutationResponse, CreateDepartmentPayload>((payload) =>
        departmentService.createOrUpdateDepartment(payload)
    );

    const departments = useMemo<DepartmentItem[]>(() => {
        if (!rawResponse) return [];
        if (Array.isArray(rawResponse)) return rawResponse;
        if (typeof rawResponse === 'object' && 'data' in rawResponse && Array.isArray(rawResponse.data)) {
            return rawResponse.data;
        }
        return [];
    }, [rawResponse]);

    const createOrUpdateDepartment = useCallback(
        async (payload: CreateDepartmentPayload): Promise<DepartmentMutationResponse> => {
            const res = await executeMutation(payload);
            if (autoRefetchOnMutation) {
                await executeFetch();
            }
            return res;
        },
        [executeMutation, autoRefetchOnMutation, executeFetch]
    );

    return {
        departments,
        rawResponse,
        isLoading,
        isSuccess,
        isError,
        error,
        refetch: executeFetch,
        createOrUpdateDepartment,
        isSaving,
        isSaveSuccess,
        isSaveError,
        saveError
    };
}

export default useDepartment;
