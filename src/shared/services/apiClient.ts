import { ENV_CONFIG } from '@/config/env.config'

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(
      endpoint.startsWith('http') ? endpoint : `${window.location.origin}${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`
    )
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value))
        }
      })
    }
    return url.toString()
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers, ...rest } = options
    const url = this.buildUrl(endpoint, params)

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      ...rest,
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error')
      throw new Error(`API Request failed with status ${response.status}: ${errorText}`)
    }

    return response.json() as Promise<T>
  }

  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

export const apiClient = new ApiClient(ENV_CONFIG.API_BASE_URL)
