export type LeadPriority = 'Hot' | 'Warm' | 'Cold'

export function getLeadPriority(lead: { status?: string | null; tags?: string[] | null }): LeadPriority {
  const tags = (lead.tags ?? []).map((t) => t.toLowerCase().replace(/_/g, ' '))
  const status = (lead.status ?? '').toLowerCase()
  if (status === 'qualified' && (tags.includes('tax delinquent') || tags.includes('absentee'))) return 'Hot'
  if (tags.includes('vacant') || status === 'new') return 'Warm'
  return 'Cold'
}
