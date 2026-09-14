import React from 'react'
import type { Submission } from '../types/submission.types'
import { SubmissionStatusBadge } from './SubmissionStatusBadge'
import { Card } from '@/shared/components/Card/Card'
import { formatDate, formatExecutionTime, formatMemory } from '@/shared/utils/formatters'

export interface SubmissionCardProps {
  submission: Submission
}

export const SubmissionCard: React.FC<SubmissionCardProps> = ({ submission }) => {
  return (
    <Card
      hoverable
      title={submission.problemTitle}
      subtitle={`Submitted by @${submission.userName} • ${formatDate(submission.submittedAt)}`}
      headerAction={<SubmissionStatusBadge verdict={submission.verdict} />}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1rem',
          fontSize: '0.875rem',
          marginTop: '0.5rem',
        }}
      >
        <div>
          <span style={{ color: 'var(--color-text-muted)' }}>Language: </span>
          <code style={{ color: 'var(--color-accent)' }}>{submission.language.toUpperCase()}</code>
        </div>
        <div>
          <span style={{ color: 'var(--color-text-muted)' }}>Time: </span>
          <span>{formatExecutionTime(submission.executionTimeMs)}</span>
        </div>
        <div>
          <span style={{ color: 'var(--color-text-muted)' }}>Memory: </span>
          <span>{formatMemory(submission.memoryUsedKb)}</span>
        </div>
      </div>
    </Card>
  )
}
