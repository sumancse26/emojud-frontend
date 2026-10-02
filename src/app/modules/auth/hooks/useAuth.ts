import { useState, useCallback } from 'react'
import type { User, LoginCredentials } from '../types/auth.types'
import { authService } from '../services/authService'

import { tokenStorage } from '@/shared/services/tokenStorage'

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    return tokenStorage.getToken() ? tokenStorage.getUser<User>() : null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await authService.login(credentials)
      setUser(response.user)
      return response.user
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  return {
    user,
    isAuthenticated: !!user && !!tokenStorage.getToken(),
    isLoading,
    error,
    login,
    logout,
  }
}
