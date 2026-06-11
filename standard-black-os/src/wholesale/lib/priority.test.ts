import { describe, it, expect } from 'vitest'
import { getLeadPriority } from './priority'

describe('getLeadPriority', () => {
  it('returns Hot for qualified + tax delinquent', () => {
    expect(getLeadPriority({ status: 'Qualified', tags: ['Tax Delinquent'] })).toBe('Hot')
  })
  it('returns Hot for qualified + absentee', () => {
    expect(getLeadPriority({ status: 'qualified', tags: ['absentee'] })).toBe('Hot')
  })
  it('returns Hot for qualified + underscore tax_delinquent signal', () => {
    expect(getLeadPriority({ status: 'Qualified', tags: ['tax_delinquent'] })).toBe('Hot')
  })
  it('returns Warm for uppercase VACANT signal', () => {
    expect(getLeadPriority({ status: 'Contacted', tags: ['VACANT'] })).toBe('Warm')
  })
  it('returns Warm for vacant tag', () => {
    expect(getLeadPriority({ status: 'Contacted', tags: ['Vacant'] })).toBe('Warm')
  })
  it('returns Warm for new status', () => {
    expect(getLeadPriority({ status: 'New', tags: [] })).toBe('Warm')
  })
  it('returns Cold otherwise', () => {
    expect(getLeadPriority({ status: 'Contacted', tags: ['Probate'] })).toBe('Cold')
  })
  it('handles missing tags/status', () => {
    expect(getLeadPriority({})).toBe('Cold')
  })
})
