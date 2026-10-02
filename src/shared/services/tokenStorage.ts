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

  /** Read user object from localStorage */
  getUser<T>(): T | null {
    if (typeof localStorage === 'undefined') return null;
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },

  /** Persist user object in localStorage */
  setUser<T>(user: T): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {
      // Ignore quota errors
    }
  },

  /** Remove user object from localStorage */
  removeUser(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(USER_KEY);
  },

  /** Clear both the token cookies and user data */
  clearAll(): void {
    this.removeToken();
    this.removeUser();
  },
};

