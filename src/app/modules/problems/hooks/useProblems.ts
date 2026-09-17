import { useState, useEffect, useCallback } from 'react'
import type { Problem } from '../types/problem.types'
import { problemService } from '../services/problemService'

export function useProblems() {
  const [problems, setProblems] = useState<Problem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProblems = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await problemService.getProblems()
      setProblems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch problems')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProblems()
  }, [fetchProblems])

  return {
    problems,
    isLoading,
    error,
    refresh: fetchProblems,
  }
}
