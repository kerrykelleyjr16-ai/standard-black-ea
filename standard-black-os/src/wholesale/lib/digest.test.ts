import { describe, it, expect } from 'vitest'
import { buildDigest } from './digest'
import type { Lead, Task } from './types'

const lead = (stage: Lead['stage']): Lead => ({
  id: Math.random().toString(), address: 'x', city: 'Dallas', state: 'TX', zip: '75201',
  county: null, property_type: null, beds: null, baths: null, sqft: null, year_built: null,
  lot_size: null, source: null, owner_name: null, owner_phone: null, owner_email: null,
  skip_trace_status: null, motivation_signals: [], stage, created_at: '2026-06-09T00:00:00Z',
})
const task = (type: Task['type']): Task => ({
  id: Math.random().toString(), type, lead_id: null, deal_id: null, title: 't',
  detail: null, status: 'open', due_date: null, created_at: '2026-06-09T00:00:00Z',
})

describe('buildDigest', () => {
  it('counts leads by stage and pending approvals', () => {
    const d = buildDigest([lead('New'), lead('New'), lead('Qualified')],
                          [task('approve_mao'), task('call')])
    expect(d.leadsByStage['New']).toBe(2)
    expect(d.leadsByStage['Qualified']).toBe(1)
    expect(d.pendingApprovals).toBe(1)
    expect(d.openTasks).toBe(2)
  })
})
