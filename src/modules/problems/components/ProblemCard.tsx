import React from 'react'
import type { Problem, Difficulty } from '../types/problem.types'
import { Card } from '@/shared/components/Card/Card'
import { Button } from '@/shared/components/Button/Button'

export interface ProblemCardProps {
  problem: Problem
  onSolve?: (problemId: string) => void
}

const DIFFICULTY_COLORS: Record<Difficulty, { color: string; bg: string }> = {
  Easy: { color: 'var(--color-success)', bg: 'var(--color-success-bg)' },
  Medium: { color: 'var(--color-warning)', bg: 'var(--color-warning-bg)' },
  Hard: { color: 'var(--color-error)', bg: 'var(--color-error-bg)' },
}

export const ProblemCard: React.FC<ProblemCardProps> = ({ problem, onSolve }) => {
  const diffStyle = DIFFICULTY_COLORS[problem.difficulty]

  return (
    <Card
      hoverable
      title={problem.title}
      subtitle={`Acceptance: ${problem.acceptanceRate}% • Limits: ${problem.timeLimitMs}ms / ${problem.memoryLimitMb}MB`}
      headerAction={
        <span
          style={{
            padding: '0.2rem 0.6rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: diffStyle.color,
            backgroundColor: diffStyle.bg,
            border: `1px solid ${diffStyle.color}33`,
          }}
        >
          {problem.difficulty}
        </span>
      }
      footer={
        <Button size="sm" onClick={() => onSolve?.(problem.id)}>
          Solve Challenge ➔
        </Button>
      }
    >
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
        {problem.description}
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {problem.tags.map((tag) => (
          <span
            key={tag}
            style={{
              fontSize: '0.75rem',
              padding: '0.2rem 0.5rem',
              backgroundColor: 'var(--color-bg-primary)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text-muted)',
              border: '1px solid var(--color-border)',
            }}
          >
            #{tag}
          </span>
        ))}
      </div>
    </Card>
  )
}
