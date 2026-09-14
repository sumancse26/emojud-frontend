export type JudgmentVerdict =
  | 'ACCEPTED'
  | 'WRONG_ANSWER'
  | 'TIME_LIMIT_EXCEEDED'
  | 'MEMORY_LIMIT_EXCEEDED'
  | 'RUNTIME_ERROR'
  | 'COMPILATION_ERROR'
  | 'PENDING'
  | 'JUDGING'

export interface Submission {
  id: string
  problemId: string
  problemTitle: string
  userId: string
  userName: string
  language: 'cpp' | 'python' | 'java' | 'rust' | 'typescript'
  verdict: JudgmentVerdict
  executionTimeMs: number
  memoryUsedKb: number
  submittedAt: string
  codeSnippet?: string
}

export interface SubmissionFilter {
  problemId?: string
  verdict?: JudgmentVerdict
  language?: string
}
