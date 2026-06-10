import { describe, it, expect } from 'vitest'
import { rankDispoBuyers } from './dispo'
import type { Buyer, Deal, Lead } from './types'

// --- Minimal fixture builders ---

function makeBuyer(overrides: Partial<Buyer> = {}): Buyer {
  return {
    id: 'buyer-1',
    name: 'Test Buyer',
    company: null,
    phone: null,
    email: null,
    source: null,
    notes: null,
    active: true,
    created_at: '2025-01-01T00:00:00Z',
    target_markets: ['75001'], // matches the lead zip below
    property_types: [],
    min_price: null,
    max_price: null,
    condition_max: null,
    min_beds: null,
    min_baths: null,
    strategy: 'flip',
    target_margin: 0.7,
    target_roi: null,
    cap_rate: null,
    max_rehab: null,
    financing: null,
    proof_of_funds: null,
    ...overrides,
  }
}

function makeDeal(overrides: Partial<Deal> = {}): Deal {
  return {
    id: 'deal-1',
    lead_id: 'lead-1',
    arv: 200000,
    comps: null,
    repair_level: 'light',
    repair_estimate: 20000,
    asking_price: null,
    mao: 110000,
    mao_override: null,
    mao_override_reason: null,
    assignment_fee: 10000,
    offer_price: 100000,
    matched_buyer_ids: [],
    analysis_notes: null,
    analyzed_at: null,
    mao_approved_at: '2025-01-02T00:00:00Z',
    offer_approved_at: null,
    ...overrides,
  }
}

function makeLead(overrides: Partial<Lead> = {}): Lead {
  return {
    id: 'lead-1',
    address: '123 Test St',
    city: 'Dallas',
    state: 'TX',
    zip: '75001',
    county: null,
    property_type: 'SFR',
    beds: 3,
    baths: 2,
    sqft: 1500,
    year_built: 1990,
    lot_size: null,
    source: null,
    owner_name: 'Seller Name',
    owner_phone: null,
    owner_email: null,
    skip_trace_status: null,
    motivation_signals: [],
    stage: 'Analyzed',
    created_at: '2025-01-01T00:00:00Z',
    ...overrides,
  }
}

describe('rankDispoBuyers', () => {
  it('returns only non-hard-pass buyers, highest score first', () => {
    const lead = makeLead()
    const deal = makeDeal()

    // In-market buyer — ZIP matches → passes hard filter, gets a score
    const inMarketBuyer = makeBuyer({ id: 'buyer-in', name: 'In-Market Buyer', target_markets: ['75001'] })

    // Hard-pass buyer — ZIP does NOT match (different city/market)
    const hardPassBuyer = makeBuyer({ id: 'buyer-out', name: 'Out-Market Buyer', target_markets: ['90210'] })

    const result = rankDispoBuyers([inMarketBuyer, hardPassBuyer], deal, lead)

    // Only the in-market buyer should come through
    expect(result.length).toBe(1)
    expect(result[0].buyer.id).toBe('buyer-in')
    expect(result[0].hard_pass).toBe(false)
  })

  it('sorts non-hard-pass buyers by score descending', () => {
    const lead = makeLead()
    const deal = makeDeal()

    // Higher scoring buyer: all soft scores hit
    const highScoreBuyer = makeBuyer({
      id: 'buyer-high',
      name: 'High Score',
      target_markets: ['75001'],
      condition_max: 'heavy', // any repair level OK → 30 pts
      target_margin: 0.7,     // spread favorable → 40 pts
      strategy: 'flip',       // flip strategy → 10 pts
    })

    // Lower scoring buyer: no condition pref, same market
    const lowScoreBuyer = makeBuyer({
      id: 'buyer-low',
      name: 'Low Score',
      target_markets: ['75001'],
      condition_max: null,
      strategy: null,
    })

    const result = rankDispoBuyers([lowScoreBuyer, highScoreBuyer], deal, lead)

    expect(result.length).toBe(2)
    expect(result[0].score).toBeGreaterThanOrEqual(result[1].score)
    expect(result[0].buyer.id).toBe('buyer-high')
  })

  it('returns empty array when all buyers are hard passes', () => {
    const lead = makeLead()
    const deal = makeDeal()
    const outBuyer = makeBuyer({ id: 'buyer-out', target_markets: ['99999'] })

    const result = rankDispoBuyers([outBuyer], deal, lead)
    expect(result).toHaveLength(0)
  })
})
