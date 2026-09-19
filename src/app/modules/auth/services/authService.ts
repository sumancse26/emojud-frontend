import { axios } from '@/shared/services/apiClient';
import { tokenStorage } from '@/shared/services/tokenStorage';
import type { User, LoginCredentials } from '../types/auth.types';

// Shape of the login API response
export interface LoginResponse {
    success: boolean;
    response_code: number;
    message: string;
    data: {
        token: string;
        user: User;
    };
}

export const authService = {
    /**
     * Call the login endpoint, persist the Bearer token and user info,
     * then return them so the caller can update UI state.
     */
    async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
        const response = await axios.post<LoginResponse>('/auth/login', {
            username: credentials.username,
            email: credentials.email,
            password: credentials.password
        });

        const { token, user } = response.data;

        // Persist token — the Axios request interceptor will pick it up automatically
        tokenStorage.setToken(token);
        tokenStorage.setUser<User>(user);

        return { token, user };
    },

    /** Fetch the currently authenticated user (token sent automatically via interceptor) */
    async getCurrentUser(): Promise<User> {
        return axios.get<User>('/auth/me');
    },

    /** Clear token + user from storage (call on logout) */
    logout(): void {
        tokenStorage.clearAll();
    }
};
