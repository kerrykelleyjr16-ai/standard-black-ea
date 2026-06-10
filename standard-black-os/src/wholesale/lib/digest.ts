import type { Lead, Task } from './types'

export interface Digest {
  leadsByStage: Record<string, number>
  openTasks: number
  pendingApprovals: number
  generatedAt: string
}

export function buildDigest(leads: Lead[], tasks: Task[]): Digest {
  const leadsByStage: Record<string, number> = {}
  for (const l of leads) leadsByStage[l.stage] = (leadsByStage[l.stage] ?? 0) + 1
  const open = tasks.filter((t) => t.status === 'open')
  const pendingApprovals = open.filter(
    (t) => t.type === 'approve_mao' || t.type === 'approve_offer'
  ).length
  return { leadsByStage, openTasks: open.length, pendingApprovals, generatedAt: new Date().toISOString() }
}
