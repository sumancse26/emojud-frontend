import React, { useState } from 'react'
import { Button } from '@/shared/components/Button/Button'
import { Card } from '@/shared/components/Card/Card'
import type { LoginCredentials } from '../types/auth.types'

export interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => Promise<void>
  isLoading?: boolean
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading = false }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    await onSubmit({ email, password })
  }

  return (
    <Card title="Login to EmoJud" subtitle="Access your coding dashboard & rankings">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
            Email or Handle
          </label>
          <input
            type="text"
            required
            placeholder="handle@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem',
              backgroundColor: 'var(--color-bg-primary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text-primary)',
              outline: 'none',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 0.85rem',
              backgroundColor: 'var(--color-bg-primary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-text-primary)',
              outline: 'none',
            }}
          />
        </div>

        <Button type="submit" fullWidth isLoading={isLoading}>
          Sign In
        </Button>
      </form>
    </Card>
  )
}
