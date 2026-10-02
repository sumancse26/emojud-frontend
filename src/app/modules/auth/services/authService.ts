import { axios } from '@/shared/services/apiClient';
import { tokenStorage } from '@/shared/services/tokenStorage';
import type { User, LoginCredentials } from '../types/auth.types';

// Shape of the login API response
export interface LoginResponse {
    success?: boolean;
    response_code?: number;
    message?: string;
    accessToken?: string;
}

interface DecodedTokenPayload {
    user_id?: number | string;
    company_id?: number | string;
    role_id?: number | string;
    username?: string;
    sub?: string;
    type?: string;
    iat?: number;
    exp?: number;
    [key: string]: unknown;
}

function parseJwt(token: string): DecodedTokenPayload | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload) as DecodedTokenPayload;
    } catch {
        return null;
    }
}

export const authService = {
    /**
     * Call the login endpoint (/api/auth/login), persist the Bearer access token in cookie,
     * persist user info in storage, and return them for state updates.
     */
    async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
        const payload: Record<string, unknown> = {
            password: credentials.password
        };

        if (credentials.username) {
            payload.username = credentials.username;
        }

        if (credentials.email) {
            payload.email = credentials.email;
        } else if (credentials.username && credentials.username.includes('@')) {
            payload.email = credentials.username;
        }

        const response = await axios.post<LoginResponse>('/api/auth/login', payload);

        // Extract accessToken from response
        const token = response?.accessToken;

        if (!token) {
            const errorMsg =
                response?.message || 'Authentication successful but no accessToken was returned from server.';
            throw new Error(errorMsg);
        }

        // Decode JWT payload to extract user info (user_id, company_id, role_id, username, exp)
        const decoded = parseJwt(token);

        const userId = String(decoded?.user_id ?? decoded?.sub ?? 'usr_default');
        const username = decoded?.username ?? credentials.username ?? 'user';
        const roleId = String(decoded?.role_id);
        // const roleName =
        //     roleId === 1
        //         ? 'Super Administrator'
        //         : roleId === 2
        //           ? 'Administrator'
        //           : 'Staff';
        const companyId = String(decoded?.company_id ?? '1');

        const user: User = {
            id: userId,
            username: username,
            name: username === 'suman' ? 'Suman (Admin)' : username.charAt(0).toUpperCase() + username.slice(1),
            email: credentials.email || (username.includes('@') ? username : `${username}@emojud.com`),
            role: roleId,
            branchId: companyId
        };

        // Determine token lifetime in seconds if exp exists in JWT
        let maxAgeSeconds: number | undefined;
        if (decoded?.exp) {
            const currentSeconds = Math.floor(Date.now() / 1000);
            const remaining = decoded.exp - currentSeconds;
            if (remaining > 0) {
                maxAgeSeconds = remaining;
            }
        }

        // Persist access token in cookie (will be attached to all subsequent API calls)
        tokenStorage.setToken(token, maxAgeSeconds);
        tokenStorage.setUser<User>(user);

        return { token, user };
    },

    /** Fetch the currently authenticated user (token sent automatically via interceptor) */
    async getCurrentUser(): Promise<User> {
        return axios.get<User>('/api/auth/me');
    },

    /** Clear token cookie + user from storage (call on logout) */
    logout(): void {
        tokenStorage.clearAll();
    }
};
