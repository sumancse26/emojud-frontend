import { APP_CONSTANTS } from '@/shared/constants/app.constants';

// ─── Cookie Helpers ────────────────────────────────────────────────────────────
// Token is kept in a cookie (Secure + SameSite=Strict) instead of localStorage
// to reduce XSS exposure. User data (non-sensitive) remains in localStorage.

const TOKEN_KEY = APP_CONSTANTS.STORAGE_KEYS.AUTH_TOKEN;
const USER_KEY = APP_CONSTANTS.STORAGE_KEYS.USER_PROFILE;
const COOKIE_MAX_AGE_SECONDS = APP_CONSTANTS.COOKIE.TOKEN_MAX_AGE_SECONDS;


function setCookie(name: string, value: string, maxAge: number): void {
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Strict${secure}`
}

function getCookie(name: string): string | null {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
  return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : null
}

function deleteCookie(name: string): void {
  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Strict`
}

// ─── Token Storage ─────────────────────────────────────────────────────────────
export const tokenStorage = {
  /** Read Bearer token from cookie */
  getToken(): string | null {
    return getCookie(TOKEN_KEY)
  },

  /** Persist Bearer token in a cookie */
  setToken(token: string): void {
    setCookie(TOKEN_KEY, token, COOKIE_MAX_AGE_SECONDS)
  },

  /** Remove only the token cookie */
  removeToken(): void {
    deleteCookie(TOKEN_KEY)
  },

  /** Read user object from localStorage */
  getUser<T>(): T | null {
    try {
      const raw = localStorage.getItem(USER_KEY)
      return raw ? (JSON.parse(raw) as T) : null
    } catch {
      return null
    }
  },

  /** Persist user object in localStorage */
  setUser<T>(user: T): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  /** Remove user object from localStorage */
  removeUser(): void {
    localStorage.removeItem(USER_KEY)
  },

  /** Clear both the token cookie and user data from localStorage */
  clearAll(): void {
    deleteCookie(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },
}

