import axiosLib from 'axios';
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ENV_CONFIG } from '@/config/env.config';
import { tokenStorage } from './tokenStorage';
import { APP_CONSTANTS } from '@/shared/constants/app.constants';

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
// Automatically attach Bearer token from cookie on every request
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = tokenStorage.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ─── Response Interceptor ──────────────────────────────────────────────────────
// Handle 401 Unauthorized: clear session and redirect to login
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
        const isLoginRequest = error.config?.url?.endsWith('login');
        if (error.response?.status === 401 && !isLoginRequest) {
            tokenStorage.clearAll();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ─── API Client Wrapper ────────────────────────────────────────────────────────
export const axios = {
    get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
        return axiosInstance.get<T>(url, { params }).then((res) => res.data);
    },

    post<T>(url: string, data?: unknown): Promise<T> {
        return axiosInstance.post<T>(url, data).then((res) => res.data);
    },

    put<T>(url: string, data?: unknown): Promise<T> {
        return axiosInstance.put<T>(url, data).then((res) => res.data);
    },

    patch<T>(url: string, data?: unknown): Promise<T> {
        return axiosInstance.patch<T>(url, data).then((res) => res.data);
    },

    delete<T>(url: string): Promise<T> {
        return axiosInstance.delete<T>(url).then((res) => res.data);
    }
};

// Export the raw instance for advanced use cases (e.g., file uploads)
export { axiosInstance };
