import { useMemo, useCallback } from 'react';
import { useApi } from '@/shared/hooks/useApi';
import { employeeService } from '../services/employeeService';
import type {
    EmployeeItem,
    CreateEmployeePayload,
    EmployeeListParams,
    EmployeeListResponse,
    EmployeeMutationResponse
} from '../types/employee.types';

export interface UseEmployeeOptions {
    immediate?: boolean;
    initialParams?: EmployeeListParams;
    autoRefetchOnMutation?: boolean;
    onSuccess?: (data: EmployeeListResponse) => void;
    onError?: (error: string) => void;
}

export interface UseEmployeeReturn {
    // ─── Query (List) State ───────────────────────────────────────────
    employees: EmployeeItem[];
    rawResponse: EmployeeListResponse | null;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: string | null;
    refetch: (params?: EmployeeListParams) => Promise<EmployeeListResponse>;
    fetchEmployees: (params?: EmployeeListParams) => Promise<EmployeeListResponse>;

    // ─── Mutation (Create) State ──────────────────────────────────────
    createEmployee: (payload: CreateEmployeePayload) => Promise<EmployeeMutationResponse>;
    isSaving: boolean;
    isSaveSuccess: boolean;
    isSaveError: boolean;
    saveError: string | null;
    lastSavedEmployee: EmployeeMutationResponse | null;
    resetMutation: () => void;
}

export function useEmployee(options: UseEmployeeOptions = {}): UseEmployeeReturn {
    const { immediate = true, initialParams, autoRefetchOnMutation = true, onSuccess, onError } = options;

    const initialParamsSerialized = JSON.stringify(initialParams);
    const stableParams = useMemo(
        () => initialParams,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [initialParamsSerialized]
    );

    // ─── 1. Query: Fetch Employee List ────────────────────────────────────
    const {
        data: rawResponse,
        isLoading,
        isSuccess,
        isError,
        error,
        execute: executeFetch
    } = useApi<EmployeeListResponse, EmployeeListParams | undefined>(
        (params) => employeeService.getEmployees(params as EmployeeListParams),
        {
            immediate,
            initialParams: stableParams,
            onSuccess,
            onError
        }
    );

    // ─── 2. Mutation: Create Employee ─────────────────────────────────────
    const {
        data: lastSavedEmployee,
        isLoading: isSaving,
        isSuccess: isSaveSuccess,
        isError: isSaveError,
        error: saveError,
        execute: executeMutation,
        reset: resetMutation
    } = useApi<EmployeeMutationResponse, CreateEmployeePayload>((payload) =>
        employeeService.createEmployee(payload)
    );

    // ─── Extract Normalized Employee Items List ───────────────────────────
    const employees = useMemo<EmployeeItem[]>(() => {
        if (!rawResponse) return [];
        if (Array.isArray(rawResponse)) return rawResponse;
        if (typeof rawResponse === 'object' && 'data' in rawResponse && Array.isArray(rawResponse.data)) {
            return rawResponse.data;
        }
        return [];
    }, [rawResponse]);

    // ─── Execute create and optionally trigger refetch ────────────────────
    const createEmployee = useCallback(
        async (payload: CreateEmployeePayload): Promise<EmployeeMutationResponse> => {
            const response = await executeMutation(payload);
            if (autoRefetchOnMutation) {
                await executeFetch(stableParams);
            }
            return response;
        },
        [executeMutation, autoRefetchOnMutation, executeFetch, stableParams]
    );

    return {
        // Query state
        employees,
        rawResponse,
        isLoading,
        isSuccess,
        isError,
        error,
        refetch: executeFetch,
        fetchEmployees: executeFetch,

        // Mutation state
        createEmployee,
        isSaving,
        isSaveSuccess,
        isSaveError,
        saveError,
        lastSavedEmployee,
        resetMutation
    };
}

export default useEmployee;
