import type { Submission, SubmissionFilter } from '../types/submission.types'

const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: 'sub_101',
    problemId: 'prob_1',
    problemTitle: 'Two Sum & Bitwise Alchemy',
    userId: 'usr_001',
    userName: 'AliceMaster',
    language: 'typescript',
    verdict: 'ACCEPTED',
    executionTimeMs: 42,
    memoryUsedKb: 34200,
    submittedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    codeSnippet: 'function twoSum(nums: number[], target: number) { ... }',
  },
  {
    id: 'sub_102',
    problemId: 'prob_2',
    problemTitle: 'Dynamic Tree Balance',
    userId: 'usr_002',
    userName: 'BobDev',
    language: 'cpp',
    verdict: 'TIME_LIMIT_EXCEEDED',
    executionTimeMs: 2010,
    memoryUsedKb: 12400,
    submittedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    codeSnippet: '#include <iostream>\nint main() { ... }',
  },
  {
    id: 'sub_103',
    problemId: 'prob_3',
    problemTitle: 'Shortest Path in Hypergraph',
    userId: 'usr_003',
    userName: 'CipherHacker',
    language: 'python',
    verdict: 'WRONG_ANSWER',
    executionTimeMs: 120,
    memoryUsedKb: 18200,
    submittedAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    codeSnippet: 'def solve(): pass',
  },
]

export const submissionService = {
  async getSubmissions(filter?: SubmissionFilter): Promise<Submission[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let results = [...MOCK_SUBMISSIONS]
        if (filter?.verdict) {
          results = results.filter((s) => s.verdict === filter.verdict)
        }
        if (filter?.problemId) {
          results = results.filter((s) => s.problemId === filter.problemId)
        }
        resolve(results)
      }, 300)
    })
  },

  async submitCode(payload: { problemId: string; language: Submission['language']; code: string }): Promise<Submission> {
    const newSubmission: Submission = {
      id: 'sub_' + Math.floor(Math.random() * 900 + 100),
      problemId: payload.problemId,
      problemTitle: 'Custom Submission',
      userId: 'usr_001',
      userName: 'AliceMaster',
      language: payload.language,
      verdict: 'ACCEPTED',
      executionTimeMs: Math.floor(Math.random() * 80 + 20),
      memoryUsedKb: 28400,
      submittedAt: new Date().toISOString(),
      codeSnippet: payload.code,
    }
    MOCK_SUBMISSIONS.unshift(newSubmission)
    return newSubmission
  },
}
