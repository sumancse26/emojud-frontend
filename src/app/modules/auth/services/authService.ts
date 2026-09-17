import { apiClient } from '@/shared/services/apiClient'
import type { User, LoginCredentials } from '../types/auth.types'

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const identifier = credentials.username || credentials.email || 'suman'
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: {
            id: 'usr_001',
            username: identifier,
            name: identifier === 'suman' ? 'Suman (Admin)' : identifier,
            email: credentials.email || `${identifier}@emojud.com`,
            role: 'Super Administrator',
            branchId: '1',
          },
          token: 'mock_jwt_token_' + Date.now(),
        })
      }, 500)
    })
  },

  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/auth/me')
  },
}
