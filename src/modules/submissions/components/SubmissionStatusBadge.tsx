import React from 'react'
import type { JudgmentVerdict } from '../types/submission.types'

export interface SubmissionStatusBadgeProps {
  verdict: JudgmentVerdict
}

const VERDICT_CONFIG: Record<JudgmentVerdict, { label: string; color: string; bg: string; icon: string }> = {
  ACCEPTED: { label: 'Accepted', color: 'var(--color-success)', bg: 'var(--color-success-bg)', icon: '✅' },
  WRONG_ANSWER: { label: 'Wrong Answer', color: 'var(--color-error)', bg: 'var(--color-error-bg)', icon: '❌' },
  TIME_LIMIT_EXCEEDED: { label: 'Time Limit Exceeded', color: 'var(--color-warning)', bg: 'var(--color-warning-bg)', icon: '⏱️' },
  MEMORY_LIMIT_EXCEEDED: { label: 'Memory Limit Exceeded', color: 'var(--color-warning)', bg: 'var(--color-warning-bg)', icon: '💾' },
  RUNTIME_ERROR: { label: 'Runtime Error', color: 'var(--color-error)', bg: 'var(--color-error-bg)', icon: '💥' },
  COMPILATION_ERROR: { label: 'Compilation Error', color: 'var(--color-error)', bg: 'var(--color-error-bg)', icon: '⚠️' },
  PENDING: { label: 'Pending', color: 'var(--color-text-secondary)', bg: 'rgba(255,255,255,0.05)', icon: '⏳' },
  JUDGING: { label: 'Judging', color: 'var(--color-info)', bg: 'var(--color-info-bg)', icon: '⚙️' },
}

export const SubmissionStatusBadge: React.FC<SubmissionStatusBadgeProps> = ({ verdict }) => {
  const config = VERDICT_CONFIG[verdict] || VERDICT_CONFIG.PENDING

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.35rem',
        padding: '0.25rem 0.65rem',
        borderRadius: 'var(--radius-full)',
        backgroundColor: config.bg,
        color: config.color,
        fontSize: '0.8125rem',
        fontWeight: 600,
        border: `1px solid ${config.color}33`,
      }}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  )
}
