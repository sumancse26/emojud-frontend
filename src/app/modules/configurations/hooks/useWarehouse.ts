import { useMemo, useCallback } from 'react';
import { useApi } from '@/shared/hooks/useApi';
import { warehouseService } from '../services/warehouseService';
import type {
    WarehouseItem,
    CreateUpdateWarehousePayload,
    WarehouseListParams,
    WarehouseListResponse,
    WarehouseMutationResponse
} from '../types/warehouse.types';

export interface UseWarehouseOptions {
    immediate?: boolean;
    initialParams?: WarehouseListParams;
    autoRefetchOnMutation?: boolean;
    onSuccess?: (data: WarehouseListResponse) => void;
    onError?: (error: string) => void;
}

export interface UseWarehouseReturn {
    // ─── Query (List) State ───────────────────────────────────────────
    warehouses: WarehouseItem[];
    rawResponse: WarehouseListResponse | null;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: string | null;
    refetch: (params?: WarehouseListParams) => Promise<WarehouseListResponse>;
    fetchWarehouses: (params?: WarehouseListParams) => Promise<WarehouseListResponse>;

    // ─── Mutation (Create / Update) State ─────────────────────────────
    createOrUpdateWarehouse: (payload: CreateUpdateWarehousePayload) => Promise<WarehouseMutationResponse>;
    isSaving: boolean;
    isSaveSuccess: boolean;
    isSaveError: boolean;
    saveError: string | null;
    lastSavedWarehouse: WarehouseMutationResponse | null;
    resetMutation: () => void;
}

export function useWarehouse(options: UseWarehouseOptions = {}): UseWarehouseReturn {
    const { immediate = true, initialParams, autoRefetchOnMutation = true, onSuccess, onError } = options;

    // ─── 1. Query: Fetch Warehouse List ────────────────────────────────────
    const {
        data: rawResponse,
        isLoading,
        isSuccess,
        isError,
        error,
        execute: executeFetch
    } = useApi<WarehouseListResponse, WarehouseListParams | undefined>(
        (params) => warehouseService.getWarehouses(params),
        {
            immediate,
            initialParams,
            onSuccess,
            onError
        }
    );

    // ─── 2. Mutation: Create or Update Warehouse ───────────────────────────
    const {
        data: lastSavedWarehouse,
        isLoading: isSaving,
        isSuccess: isSaveSuccess,
        isError: isSaveError,
        error: saveError,
        execute: executeMutation,
        reset: resetMutation
    } = useApi<WarehouseMutationResponse, CreateUpdateWarehousePayload>((payload) =>
        warehouseService.createOrUpdateWarehouse(payload)
    );

    // ─── Extract Normalized Warehouse Items List ───────────────────────────
    const warehouses = useMemo<WarehouseItem[]>(() => {
        if (!rawResponse) return [];
        if (Array.isArray(rawResponse)) return rawResponse;
        if (typeof rawResponse === 'object' && 'data' in rawResponse && Array.isArray(rawResponse.data)) {
            return rawResponse.data;
        }
        return [];
    }, [rawResponse]);

    // ─── Execute create/update and optionally trigger refetch ──────────────
    const createOrUpdateWarehouse = useCallback(
        async (payload: CreateUpdateWarehousePayload): Promise<WarehouseMutationResponse> => {
            const response = await executeMutation(payload);
            if (autoRefetchOnMutation) {
                await executeFetch(initialParams);
            }
            return response;
        },
        [executeMutation, autoRefetchOnMutation, executeFetch, initialParams]
    );

    return {
        // Query state
        warehouses,
        rawResponse,
        isLoading,
        isSuccess,
        isError,
        error,
        refetch: executeFetch,
        fetchWarehouses: executeFetch,

        // Mutation state
        createOrUpdateWarehouse,
        isSaving,
        isSaveSuccess,
        isSaveError,
        saveError,
        lastSavedWarehouse,
        resetMutation
    };
}

export default useWarehouse;
