import React, { useState } from 'react'
import { useSubmissions } from '../hooks/useSubmissions'
import { SubmissionCard } from '../components/SubmissionCard'
import { Button } from '@/shared/components/Button/Button'
import type { Submission } from '../types/submission.types'

export const SubmissionsPage: React.FC = () => {
  const { submissions, isLoading, submitSolution, refresh } = useSubmissions()
  const [selectedLang, setSelectedLang] = useState<Submission['language']>('typescript')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleQuickSubmit = async () => {
    setIsSubmitting(true)
    try {
      await submitSolution({
        problemId: 'prob_1',
        language: selectedLang,
        code: '// Solution submitted\nconsole.log("Accepted!");',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Judge Submissions</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
            Live stream of code verdicts evaluated by EmoJud Engine
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value as Submission['language'])}
            style={{
              padding: '0.45rem 0.75rem',
              backgroundColor: 'var(--color-bg-secondary)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <option value="typescript">TypeScript</option>
            <option value="cpp">C++ 20</option>
            <option value="python">Python 3.12</option>
            <option value="rust">Rust</option>
          </select>

          <Button size="sm" onClick={handleQuickSubmit} isLoading={isSubmitting}>
            ⚡ Submit Code
          </Button>

          <Button variant="secondary" size="sm" onClick={() => refresh()}>
            🔄 Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
          Loading submissions feed...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {submissions.map((sub) => (
            <SubmissionCard key={sub.id} submission={sub} />
          ))}
        </div>
      )}
    </div>
  )
}
