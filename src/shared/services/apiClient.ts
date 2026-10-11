import axiosLib from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ENV_CONFIG } from '@/config/env.config';
import { tokenStorage } from './tokenStorage';
import { APP_CONSTANTS } from '@/shared/constants/app.constants';

// GET cache is shared by all hooks. Keeping the promise also deduplicates
// simultaneous requests for the same endpoint and parameters.
const GET_CACHE_TTL_MS = 30 * 60 * 1000;
const getCache = new Map<string, { promise: Promise<unknown>; expiresAt: number }>();

function stableSerialize(value: unknown): string {
    if (value === null || typeof value !== 'object') return JSON.stringify(value);
    if (Array.isArray(value)) return `[${value.map(stableSerialize).join(',')}]`;

    const record = value as Record<string, unknown>;
    return `{${Object.keys(record)
        .sort()
        .map((key) => `${JSON.stringify(key)}:${stableSerialize(record[key])}`)
        .join(',')}}`;
}

function getCacheKey(url: string, params?: Record<string, unknown>): string {
    return `${url}?${stableSerialize(params ?? {})}`;
}

export function clearGetCache(): void {
    getCache.clear();
}

function mutate<T>(request: () => Promise<AxiosResponse<T>>): Promise<T> {
    // Any write can change a previously cached GET response.
    clearGetCache();
    return request()
        .then((res) => res.data)
        .finally(clearGetCache);
}

// ─── Axios Instance ────────────────────────────────────────────────────────────
const axiosInstance: AxiosInstance = axiosLib.create({
    baseURL: ENV_CONFIG.API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    },
    timeout: APP_CONSTANTS.API.TIMEOUT_MS
});

// ─── Request Interceptor ───────────────────────────────────────────────────────
// Automatically attach Bearer token from cookie on every request.
// If no token is found, redirect to the login page.
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const isAuthRequest = config.url?.includes('/api/auth/login');

        const token = tokenStorage.getToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else if (!isAuthRequest) {
            // No token found for an authenticated API call -> redirect to login page
            tokenStorage.clearAll();
            clearGetCache();
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
            return Promise.reject(new Error('No access token found. Redirecting to login page.'));
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ─── Response Interceptor ──────────────────────────────────────────────────────
// Handle 401 Unauthorized: clear session cookie and redirect to login
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
        const isLoginRequest = error.config?.url?.includes('/api/auth/login');

        if (error.response?.status === 401 && !isLoginRequest) {
            tokenStorage.clearAll();
            clearGetCache();
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// ─── API Client Wrapper ────────────────────────────────────────────────────────
export const axios = {
    get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
        const key = getCacheKey(url, params);
        const cached = getCache.get(key);
        if (cached && cached.expiresAt > Date.now()) {
            return cached.promise as Promise<T>;
        }
        if (cached) getCache.delete(key);

        const request = axiosInstance.get<T>(url, { params }).then((res) => res.data);
        getCache.set(key, {
            promise: request,
            expiresAt: Date.now() + GET_CACHE_TTL_MS
        });
        request.catch(() => {
            // Failed GETs are never cached; a later render can retry them.
            if (getCache.get(key)?.promise === request) getCache.delete(key);
        });
        return request;
    },

    post<T>(url: string, data?: unknown): Promise<T> {
        return mutate(() => axiosInstance.post<T>(url, data));
    },

    put<T>(url: string, data?: unknown): Promise<T> {
        return mutate(() => axiosInstance.put<T>(url, data));
    },

    patch<T>(url: string, data?: unknown): Promise<T> {
        return mutate(() => axiosInstance.patch<T>(url, data));
    },

    delete<T>(url: string): Promise<T> {
        return mutate(() => axiosInstance.delete<T>(url));
    }
};

// Export the raw instance for advanced use cases (e.g., file uploads)
export { axiosInstance };
