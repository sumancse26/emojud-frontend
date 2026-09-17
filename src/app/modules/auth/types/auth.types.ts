export interface User {
  id: string
  username: string
  name: string
  email?: string
  role: string
  branchId: string
  avatar?: string
  rating?: number
}

export interface LoginCredentials {
  username?: string
  email?: string
  password?: string
  rememberMe?: boolean
}
