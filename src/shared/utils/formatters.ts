/**
 * Utility formatting functions
 */

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function formatMemory(kb: number): string {
  if (kb < 1024) return `${kb} KB`
  return `${(kb / 1024).toFixed(2)} MB`
}

export function formatExecutionTime(ms: number): string {
  if (ms < 1000) return `${ms} ms`
  return `${(ms / 1000).toFixed(2)} s`
}
