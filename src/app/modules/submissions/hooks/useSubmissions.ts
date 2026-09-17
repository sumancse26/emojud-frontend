import { useState, useEffect, useCallback } from 'react'
import type { Submission, SubmissionFilter } from '../types/submission.types'
import { submissionService } from '../services/submissionService'

export function useSubmissions(initialFilter?: SubmissionFilter) {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSubmissions = useCallback(async (filter?: SubmissionFilter) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await submissionService.getSubmissions(filter)
      setSubmissions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch submissions')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSubmissions(initialFilter)
  }, [fetchSubmissions, initialFilter])

  const submitSolution = useCallback(
    async (payload: { problemId: string; language: Submission['language']; code: string }) => {
      const newSub = await submissionService.submitCode(payload)
      setSubmissions((prev) => [newSub, ...prev])
      return newSub
    },
    []
  )

  return {
    submissions,
    isLoading,
    error,
    refresh: fetchSubmissions,
    submitSolution,
  }
}
