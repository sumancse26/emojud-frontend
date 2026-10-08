import { useMemo, useCallback } from 'react';
import { useApi } from '@/shared/hooks/useApi';
import { permissionService } from '../services/permissionService';
import type {
    UserWisePermissionItem,
    SaveUserPermissionsPayload,
    UserWisePermissionListResponse,
    SaveUserPermissionsResponse
} from '../types/permission.types';

export interface UseUserShopPermissionOptions {
    immediate?: boolean;
    autoRefetchOnMutation?: boolean;
    onSuccess?: (data: UserWisePermissionListResponse) => void;
    onError?: (error: string) => void;
}

export interface UseUserShopPermissionReturn {
    // ─── Query (List) State ───────────────────────────────────────────
    permissions: UserWisePermissionItem[];
    rawResponse: UserWisePermissionListResponse | null;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: string | null;
    refetch: () => Promise<UserWisePermissionListResponse>;
    fetchPermissions: () => Promise<UserWisePermissionListResponse>;

    // ─── Mutation State ───────────────────────────────────────────────
    savePermissions: (payload: SaveUserPermissionsPayload) => Promise<SaveUserPermissionsResponse>;
    isSaving: boolean;
    isSaveSuccess: boolean;
    isSaveError: boolean;
    saveError: string | null;
    resetMutation: () => void;
}

export function useUserShopPermission(options: UseUserShopPermissionOptions = {}): UseUserShopPermissionReturn {
    const { immediate = true, autoRefetchOnMutation = true, onSuccess, onError } = options;

    // ─── 1. Query: Fetch User Permissions List ─────────────────────────
    const {
        data: rawResponse,
        isLoading,
        isSuccess,
        isError,
        error,
        execute: executeFetch
    } = useApi<UserWisePermissionListResponse, void>(() => permissionService.getUserWisePermissions(), {
        immediate,
        onSuccess,
        onError
    });

    // ─── 2. Mutation: Save User Permissions ────────────────────────────
    const {
        isLoading: isSaving,
        isSuccess: isSaveSuccess,
        isError: isSaveError,
        error: saveError,
        execute: executeMutation,
        reset: resetMutation
    } = useApi<SaveUserPermissionsResponse, SaveUserPermissionsPayload>((payload) =>
        permissionService.saveUserPermissions(payload)
    );

    // ─── Extract Normalized Permissions List ───────────────────────────
    const permissions = useMemo<UserWisePermissionItem[]>(() => {
        if (!rawResponse) return [];
        if (Array.isArray(rawResponse)) return rawResponse;
        if (typeof rawResponse === 'object' && 'data' in rawResponse && Array.isArray(rawResponse.data)) {
            return rawResponse.data;
        }
        return [];
    }, [rawResponse]);

    // ─── Execute save and optionally trigger refetch ───────────────────
    const savePermissions = useCallback(
        async (payload: SaveUserPermissionsPayload): Promise<SaveUserPermissionsResponse> => {
            const response = await executeMutation(payload);
            if (autoRefetchOnMutation) {
                await executeFetch();
            }
            return response;
        },
        [executeMutation, autoRefetchOnMutation, executeFetch]
    );

    return {
        permissions,
        rawResponse,
        isLoading,
        isSuccess,
        isError,
        error,
        refetch: executeFetch,
        fetchPermissions: executeFetch,

        savePermissions,
        isSaving,
        isSaveSuccess,
        isSaveError,
        saveError,
        resetMutation
    };
}

export default useUserShopPermission;
