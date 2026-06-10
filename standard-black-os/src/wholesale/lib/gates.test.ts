import { describe, it, expect } from 'vitest'
import { isMaoApproved, canDraftOffer, isOfferApproved } from './gates'
import type { Deal } from './types'

const deal = (over: Partial<Deal>): Deal => ({
  id: 'd', lead_id: 'l', arv: 200000, comps: null, repair_level: 'moderate',
  repair_estimate: 30000, asking_price: null, mao: 100000, mao_override: null,
  mao_override_reason: null, assignment_fee: 10000, offer_price: null,
  matched_buyer_ids: [], analysis_notes: null, analyzed_at: null,
  mao_approved_at: null, offer_approved_at: null, ...over,
} as Deal)

describe('gates', () => {
  it('MAO not approved until timestamp set', () => {
    expect(isMaoApproved(deal({}))).toBe(false)
    expect(isMaoApproved(deal({ mao_approved_at: '2026-06-09T00:00:00Z' }))).toBe(true)
  })
  it('cannot draft offer until MAO approved', () => {
    expect(canDraftOffer(deal({}))).toBe(false)
    expect(canDraftOffer(deal({ mao_approved_at: '2026-06-09T00:00:00Z' }))).toBe(true)
  })
  it('offer approval reflects timestamp', () => {
    expect(isOfferApproved(deal({}))).toBe(false)
    expect(isOfferApproved(deal({ offer_approved_at: '2026-06-09T00:00:00Z' }))).toBe(true)
  })
})
