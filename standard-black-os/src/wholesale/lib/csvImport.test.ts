import { describe, it, expect } from 'vitest'
import { parsePropStreamCsv, MOTIVATION_KEYWORDS } from './csvImport'

const csv = `Address,City,State,Zip,Owner Name,Owner Phone,Beds,Baths,Building Sqft,Year Built,Vacant,Tax Delinquent,Pre-Foreclosure
123 Main St,Dallas,TX,75201,Jane Doe,2145551234,3,2,1500,1980,Yes,Yes,Yes`

describe('parsePropStreamCsv', () => {
  it('maps columns to Lead inserts and tags motivation signals', () => {
    const rows = parsePropStreamCsv(csv)
    expect(rows).toHaveLength(1)
    expect(rows[0].address).toBe('123 Main St')
    expect(rows[0].zip).toBe('75201')
    expect(rows[0].owner_phone).toBe('2145551234')
    expect(rows[0].beds).toBe(3)
    expect(rows[0].stage).toBe('New')
    expect(rows[0].motivation_signals).toContain('vacant')
  })
  it('normalizes multi-word signals to the underscore keys the UI color maps use', () => {
    const rows = parsePropStreamCsv(csv)
    expect(rows[0].motivation_signals).toContain('tax_delinquent')
    expect(rows[0].motivation_signals).toContain('pre_foreclosure')
    expect(rows[0].motivation_signals).not.toContain('tax delinquent')
    expect(rows[0].motivation_signals).not.toContain('pre-foreclosure')
  })
  it('exposes the keyword list', () => {
    expect(MOTIVATION_KEYWORDS.length).toBeGreaterThan(0)
  })
})
