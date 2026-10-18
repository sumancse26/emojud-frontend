export interface User {
  id: string
  username: string
  name: string
  email?: string
  role: string
  roleId?: string
  role_id?: string | number
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
