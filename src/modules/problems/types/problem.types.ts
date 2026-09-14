export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export interface Problem {
  id: string
  title: string
  slug: string
  difficulty: Difficulty
  acceptanceRate: number
  tags: string[]
  description: string
  timeLimitMs: number
  memoryLimitMb: number
}
