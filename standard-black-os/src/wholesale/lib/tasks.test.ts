import { describe, it, expect } from 'vitest'
import { sortTasks } from './tasks'
import type { Task } from './types'

const t = (over: Partial<Task>): Task => ({
  id: '1', type: 'call', lead_id: null, deal_id: null, title: 't',
  detail: null, status: 'open', due_date: null, created_at: '2026-06-01T00:00:00Z', ...over,
})

describe('sortTasks', () => {
  it('open before done/dismissed, approvals before other open types, then oldest first', () => {
    const done = t({ id: 'd', status: 'done' })
    const call = t({ id: 'c', type: 'call', created_at: '2026-06-02T00:00:00Z' })
    const mao = t({ id: 'm', type: 'approve_mao', created_at: '2026-06-03T00:00:00Z' })
    const out = sortTasks([done, call, mao]).map((x) => x.id)
    expect(out).toEqual(['m', 'c', 'd'])
  })
})
