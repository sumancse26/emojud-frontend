/**
 * Common shared TypeScript definitions
 */

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export type ThemeMode = 'dark' | 'light' | 'system'

export type LoadingState = 'idle' | 'loading' | 'success' | 'error'
