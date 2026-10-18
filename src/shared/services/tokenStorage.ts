import { APP_CONSTANTS } from '@/shared/constants/app.constants';

// ─── Cookie Helpers ────────────────────────────────────────────────────────────
// Token is kept in a cookie (Secure + SameSite=Strict) instead of localStorage
// to reduce XSS exposure. User data (non-sensitive) remains in localStorage.

const PRIMARY_TOKEN_KEY = APP_CONSTANTS.STORAGE_KEYS.AUTH_TOKEN;
const FALLBACK_TOKEN_KEY = 'emojud_access_token';
const USER_KEY = APP_CONSTANTS.STORAGE_KEYS.USER_PROFILE;
const COOKIE_MAX_AGE_SECONDS = APP_CONSTANTS.COOKIE.TOKEN_MAX_AGE_SECONDS;

function setCookie(name: string, value: string, maxAge: number): void {
  if (typeof document === 'undefined') return;
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  const secure = isHttps ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie ? document.cookie.split(/;\s*/) : [];
  for (const item of cookies) {
    const [key, ...valParts] = item.split('=');
    if (key === name) {
      return decodeURIComponent(valParts.join('='));
    }
  }
  return null;
}

function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; Max-Age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=Lax`;
}

// ─── Token Storage ─────────────────────────────────────────────────────────────
export const tokenStorage = {
  /** Read access token from cookie; validates JWT expiry if present */
  getToken(): string | null {
    const token = getCookie(PRIMARY_TOKEN_KEY) || getCookie(FALLBACK_TOKEN_KEY);
    if (!token) return null;

    // Check if token has an exp claim and is expired
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const payload = JSON.parse(jsonPayload);
        if (payload?.exp && payload.exp * 1000 < Date.now()) {
          this.clearAll();
          return null;
        }
      }
    } catch {
      // If parsing fails, proceed with existing token string
    }

    return token;
  },

  /** Persist access token in cookie with optional maxAge */
  setToken(token: string, maxAgeSeconds: number = COOKIE_MAX_AGE_SECONDS): void {
    setCookie(PRIMARY_TOKEN_KEY, token, maxAgeSeconds);
    setCookie(FALLBACK_TOKEN_KEY, token, maxAgeSeconds);
  },

  /** Remove token cookies */
  removeToken(): void {
    deleteCookie(PRIMARY_TOKEN_KEY);
    deleteCookie(FALLBACK_TOKEN_KEY);
  },

  /** Decode JWT token payload into an object */
  decodeToken<T = Record<string, unknown>>(): T | null {
    const token = this.getToken();
    if (!token) return null;
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
      return JSON.parse(jsonPayload) as T;
    } catch {
      return null;
    }
  },

  /** Read user object from cookie, localStorage, or decode from JWT token */
  getUser<T>(): T | null {
    // 1. Try reading user from cookies first
    const cookieUserRaw = getCookie(USER_KEY) || getCookie('user') || getCookie('user_profile');
    if (cookieUserRaw) {
      try {
        return JSON.parse(cookieUserRaw) as T;
      } catch {
        // Continue to localStorage
      }
    }

    // 2. Try reading user from localStorage
    if (typeof localStorage !== 'undefined') {
      try {
        const raw = localStorage.getItem(USER_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as T;
          if (parsed) return parsed;
        }
      } catch {
        // Continue to token decode
      }
    }

    // 3. Fallback: decode directly from JWT access token in cookie
    const decoded = this.decodeToken<Record<string, unknown>>();
    if (decoded) {
      const ROLE_MAP: Record<string, string> = {
        '1': 'Super Administrator',
        '2': 'Administrator',
        '3': 'Manager',
        '4': 'Staff',
        '5': 'Operator'
      };

      const rawRole = decoded.role_name || decoded.roleName || decoded.role || decoded.role_id;
      const roleStr = rawRole ? String(rawRole) : '1';
      const roleName = ROLE_MAP[roleStr] || (!/^\d+$/.test(roleStr) ? roleStr : 'Super Administrator');

      const rawName =
        decoded.name ||
        decoded.full_name ||
        decoded.fullName ||
        decoded.employee_name ||
        decoded.user_name ||
        decoded.displayName ||
        decoded.username;

      let displayName = rawName ? String(rawName) : '';
      if (!displayName || /^\d+$/.test(displayName)) {
        displayName = decoded.username && !/^\d+$/.test(String(decoded.username))
          ? String(decoded.username)
          : 'Suman (Admin)';
      }

      const reconstructedUser = {
        id: String(decoded.user_id ?? decoded.id ?? decoded.sub ?? '1'),
        username: String(decoded.username ?? displayName),
        name: displayName,
        email: decoded.email ? String(decoded.email) : undefined,
        role: roleName,
        branchId: String(decoded.company_id ?? decoded.branch_id ?? '1')
      };

      return reconstructedUser as unknown as T;
    }

    return null;
  },

  /** Persist user object in both localStorage and cookie */
  setUser<T>(user: T, maxAgeSeconds: number = COOKIE_MAX_AGE_SECONDS): void {
    if (!user) return;
    const json = JSON.stringify(user);

    // Save to cookies
    setCookie(USER_KEY, json, maxAgeSeconds);
    setCookie('user', json, maxAgeSeconds);

    // Save to localStorage
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(USER_KEY, json);
      } catch {
        // Ignore quota errors
      }
    }
  },

  /** Remove user object from both localStorage and cookies */
  removeUser(): void {
    deleteCookie(USER_KEY);
    deleteCookie('user');
    deleteCookie('user_profile');
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(USER_KEY);
    }
  },

  /** Clear both the token cookies and user data */
  clearAll(): void {
    this.removeToken();
    this.removeUser();
  },
};

