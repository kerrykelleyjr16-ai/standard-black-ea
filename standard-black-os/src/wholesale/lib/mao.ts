export function calculateMAO(
  arv: number,
  targetMargin: number,
  repairEstimate: number,
  assignmentFee: number
): number {
  return arv * targetMargin - repairEstimate - assignmentFee
}

export function formatCurrency(value: number | null | undefined): string {
  if (value == null) return '—'
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

export function formatPercent(value: number | null | undefined): string {
  if (value == null) return '—'
  return `${(value * 100).toFixed(0)}%`
}
