import { useMemo, useCallback } from 'react';
import { useApi } from '@/shared/hooks/useApi';
import { shopService } from '../services/shopService';
import type {
    ShopItem,
    CreateUpdateShopPayload,
    ShopListParams,
    ShopListResponse,
    ShopMutationResponse
} from '../types/shop.types';

export interface UseShopOptions {
    immediate?: boolean;
    initialParams?: ShopListParams;
    autoRefetchOnMutation?: boolean;
    onSuccess?: (data: ShopListResponse) => void;
    onError?: (error: string) => void;
}

export interface UseShopReturn {
    // ─── Query (List) State ───────────────────────────────────────────
    shops: ShopItem[];
    rawResponse: ShopListResponse | null;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: string | null;
    refetch: (params?: ShopListParams) => Promise<ShopListResponse>;
    fetchShops: (params?: ShopListParams) => Promise<ShopListResponse>;

    // ─── Mutation (Create / Update) State ─────────────────────────────
    createOrUpdateShop: (payload: CreateUpdateShopPayload) => Promise<ShopMutationResponse>;
    isSaving: boolean;
    isSaveSuccess: boolean;
    isSaveError: boolean;
    saveError: string | null;
    lastSavedShop: ShopMutationResponse | null;
    resetMutation: () => void;
}

export function useShop(options: UseShopOptions = {}): UseShopReturn {
    const { immediate = true, initialParams, autoRefetchOnMutation = true, onSuccess, onError } = options;

    // ─── 1. Query: Fetch Shop List ────────────────────────────────────
    const {
        data: rawResponse,
        isLoading,
        isSuccess,
        isError,
        error,
        execute: executeFetch
    } = useApi<ShopListResponse, ShopListParams | undefined>((params) => shopService.getShops(params), {
        immediate,
        initialParams,
        onSuccess,
        onError
    });

    // ─── 2. Mutation: Create or Update Shop ───────────────────────────
    const {
        data: lastSavedShop,
        isLoading: isSaving,
        isSuccess: isSaveSuccess,
        isError: isSaveError,
        error: saveError,
        execute: executeMutation,
        reset: resetMutation
    } = useApi<ShopMutationResponse, CreateUpdateShopPayload>((payload) => shopService.createOrUpdateShop(payload));

    // ─── Extract Normalized Shop Items List ───────────────────────────
    const shops = useMemo<ShopItem[]>(() => {
        if (!rawResponse) return [];
        if (Array.isArray(rawResponse)) return rawResponse;
        if (typeof rawResponse === 'object' && 'data' in rawResponse && Array.isArray(rawResponse.data)) {
            return rawResponse.data;
        }
        return [];
    }, [rawResponse]);

    // ─── Execute create/update and optionally trigger refetch ──────────
    const createOrUpdateShop = useCallback(
        async (payload: CreateUpdateShopPayload): Promise<ShopMutationResponse> => {
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
        shops,
        rawResponse,
        isLoading,
        isSuccess,
        isError,
        error,
        refetch: executeFetch,
        fetchShops: executeFetch,

        // Mutation state
        createOrUpdateShop,
        isSaving,
        isSaveSuccess,
        isSaveError,
        saveError,
        lastSavedShop,
        resetMutation
    };
}

export default useShop;
