import type { Problem } from '../types/problem.types'

const MOCK_PROBLEMS: Problem[] = [
  {
    id: 'prob_1',
    title: 'Two Sum & Bitwise Alchemy',
    slug: 'two-sum-bitwise-alchemy',
    difficulty: 'Easy',
    acceptanceRate: 84.5,
    tags: ['Array', 'Hash Map', 'Bit Manipulation'],
    description: 'Find two indices in array that combine bitwise to match the target emotion sum.',
    timeLimitMs: 1000,
    memoryLimitMb: 256,
  },
  {
    id: 'prob_2',
    title: 'Dynamic Tree Balance',
    slug: 'dynamic-tree-balance',
    difficulty: 'Medium',
    acceptanceRate: 52.1,
    tags: ['Trees', 'DFS', 'Dynamic Programming'],
    description: 'Rebalance the emotion graph tree to maintain maximum subtree harmony.',
    timeLimitMs: 2000,
    memoryLimitMb: 512,
  },
  {
    id: 'prob_3',
    title: 'Shortest Path in Hypergraph',
    slug: 'shortest-path-hypergraph',
    difficulty: 'Hard',
    acceptanceRate: 29.8,
    tags: ['Graphs', 'Shortest Path', 'Dijkstra'],
    description: 'Navigate multidimensional state space with weighted negative emotion barriers.',
    timeLimitMs: 3000,
    memoryLimitMb: 512,
  },
]

export const problemService = {
  async getProblems(): Promise<Problem[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_PROBLEMS)
      }, 300)
    })
  },

  async getProblemById(id: string): Promise<Problem | undefined> {
    return MOCK_PROBLEMS.find((p) => p.id === id)
  },
}
