import { useCallback } from 'react';
import { useApi } from '@/shared/hooks/useApi';
import type { User, LoginCredentials } from '../types/auth.types';
import { authService } from '../services/authService';
import { tokenStorage } from '@/shared/services/tokenStorage';

export interface UseAuthReturn {
    user: User | null;
    token: string | null;
    data: { user: User; token: string } | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<{ user: User; token: string }>;
    logout: () => void;
    clearError: () => void;
}

/**
 * Domain-specific Auth hook built on top of the master `useApi` pattern.
 */
export function useAuth(): UseAuthReturn {
    const {
        data,
        execute: executeLogin,
        isLoading,
        isSuccess,
        isError,
        error,
        setError,
        reset
    } = useApi(authService.login, {
        initialData: () => {
            const token = tokenStorage.getToken();
            const user = tokenStorage.getUser<User>();
            return token && user ? { user, token } : null;
        }
    });

    const user = data?.user ?? (tokenStorage.getToken() ? tokenStorage.getUser<User>() : null);
    const token = data?.token ?? tokenStorage.getToken();

    const logout = useCallback(() => {
        authService.logout();
        reset();
    }, [reset]);

    const clearError = useCallback(() => {
        setError(null);
    }, [setError]);

    return {
        user,
        token,
        data,
        isAuthenticated: !!user && !!token,
        isLoading,
        isSuccess,
        isError,
        error,
        login: executeLogin,
        logout,
        clearError
    };
}

export default useAuth;
