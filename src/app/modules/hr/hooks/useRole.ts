import { useMemo, useCallback } from 'react';
import { useApi } from '@/shared/hooks/useApi';
import { roleService } from '../services/roleService';
import type {
    RoleItem,
    CreateRolePayload,
    RoleListResponse,
    RoleMutationResponse
} from '../types/role.types';

export interface UseRoleOptions {
    immediate?: boolean;
    autoRefetchOnMutation?: boolean;
    onSuccess?: (data: RoleListResponse) => void;
    onError?: (error: string) => void;
}

export interface UseRoleReturn {
    roles: RoleItem[];
    rawResponse: RoleListResponse | null;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: string | null;
    refetch: () => Promise<RoleListResponse>;
    createOrUpdateRole: (payload: CreateRolePayload) => Promise<RoleMutationResponse>;
    isSaving: boolean;
    isSaveSuccess: boolean;
    isSaveError: boolean;
    saveError: string | null;
}

export function useRole(options: UseRoleOptions = {}): UseRoleReturn {
    const { immediate = true, autoRefetchOnMutation = true, onSuccess, onError } = options;

    const {
        data: rawResponse,
        isLoading,
        isSuccess,
        isError,
        error,
        execute: executeFetch
    } = useApi<RoleListResponse, void>(
        () => roleService.getRoles(),
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
    } = useApi<RoleMutationResponse, CreateRolePayload>((payload) =>
        roleService.createOrUpdateRole(payload)
    );

    const roles = useMemo<RoleItem[]>(() => {
        if (!rawResponse) return [];
        if (Array.isArray(rawResponse)) return rawResponse;
        if (typeof rawResponse === 'object' && 'data' in rawResponse && Array.isArray(rawResponse.data)) {
            return rawResponse.data;
        }
        return [];
    }, [rawResponse]);

    const createOrUpdateRole = useCallback(
        async (payload: CreateRolePayload): Promise<RoleMutationResponse> => {
            const res = await executeMutation(payload);
            if (autoRefetchOnMutation) {
                await executeFetch();
            }
            return res;
        },
        [executeMutation, autoRefetchOnMutation, executeFetch]
    );

    return {
        roles,
        rawResponse,
        isLoading,
        isSuccess,
        isError,
        error,
        refetch: executeFetch,
        createOrUpdateRole,
        isSaving,
        isSaveSuccess,
        isSaveError,
        saveError
    };
}

export default useRole;
