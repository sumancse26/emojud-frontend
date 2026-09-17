import React, { useState } from 'react'
import { useProblems } from '../hooks/useProblems'
import { ProblemCard } from '../components/ProblemCard'
import { Button } from '@/shared/components/Button/Button'

export interface ProblemsPageProps {
  onSelectProblem?: (problemId: string) => void
}

export const ProblemsPage: React.FC<ProblemsPageProps> = ({ onSelectProblem }) => {
  const { problems, isLoading, refresh } = useProblems()
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all')

  const filtered = problems.filter((p) => {
    if (filterDifficulty === 'all') return true
    return p.difficulty.toLowerCase() === filterDifficulty.toLowerCase()
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Problem Repository</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            Browse and solve algorithmic challenges across difficulty levels
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            style={{
              padding: '0.45rem 0.75rem',
              backgroundColor: 'var(--color-bg-secondary)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <Button variant="secondary" size="sm" onClick={() => refresh()}>
            🔄 Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
          Loading problem bank...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
          {filtered.map((prob) => (
            <ProblemCard key={prob.id} problem={prob} onSolve={onSelectProblem} />
          ))}
        </div>
      )}
    </div>
  )
}
