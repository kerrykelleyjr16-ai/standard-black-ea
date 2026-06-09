import { describe, it, expect } from 'vitest'
import { isStopKeyword, isContactable } from './compliance'
import type { Conversation } from './types'

const convo = (over: Partial<Conversation>): Conversation => ({
  id: 'c', lead_id: 'l', channel: 'sms', direction: 'inbound', body: '',
  ai_generated: false, motivation_score: null, sentiment: null,
  consent_status: null, opted_out: false, created_at: '2026-06-09T00:00:00Z', ...over,
})

describe('compliance', () => {
  it('detects STOP keywords case/space-insensitively', () => {
    expect(isStopKeyword(' Stop ')).toBe(true)
    expect(isStopKeyword('UNSUBSCRIBE')).toBe(true)
    expect(isStopKeyword('yeah maybe')).toBe(false)
  })
  it('lead is not contactable if any conversation is opted_out', () => {
    expect(isContactable([convo({})])).toBe(true)
    expect(isContactable([convo({ opted_out: true })])).toBe(false)
  })
})
