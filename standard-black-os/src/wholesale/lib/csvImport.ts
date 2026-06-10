/**
 * parsePropStreamCsv — pure, dependency-free CSV → Lead insert rows.
 *
 * Documented limitations (YAGNI):
 *  - No quoted-comma handling: fields containing commas must be unquoted in the export.
 *  - No deduplication: callers must guard against duplicate inserts.
 */

import type { Lead } from './types'

export const MOTIVATION_KEYWORDS = [
  'vacant',
  'tax delinquent',
  'absentee',
  'pre-foreclosure',
  'inherited',
  'tired landlord',
] as const

/** PropStream header → Lead field mapping (case-insensitive) */
const HEADER_MAP: Record<string, keyof Lead> = {
  address: 'address',
  city: 'city',
  state: 'state',
  zip: 'zip',
  'owner name': 'owner_name',
  'owner phone': 'owner_phone',
  'owner email': 'owner_email',
  beds: 'beds',
  baths: 'baths',
  'building sqft': 'sqft',
  sqft: 'sqft',
  'year built': 'year_built',
  'property type': 'property_type',
}

const NUMERIC_FIELDS: Array<keyof Lead> = ['beds', 'baths', 'sqft', 'year_built']

type LeadInsertRow = Partial<Lead> & {
  address: string
  city: string
  state: string
  zip: string
  stage: 'New'
  motivation_signals: string[]
  skip_trace_status: 'pending'
}

function isTruthy(value: string): boolean {
  const v = value.trim().toLowerCase()
  return v === 'yes' || v === 'true' || v === '1'
}

export function parsePropStreamCsv(csvText: string): LeadInsertRow[] {
  const lines = csvText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .filter((l) => l.trim() !== '')

  if (lines.length < 2) return []

  const headers = lines[0].split(',').map((h) => h.trim())

  const rows: LeadInsertRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(',').map((c) => c.trim())

    const row: Partial<LeadInsertRow> = {
      stage: 'New',
      skip_trace_status: 'pending',
      motivation_signals: [],
    }

    const signals: string[] = []

    for (let j = 0; j < headers.length; j++) {
      const headerLower = headers[j].toLowerCase()
      const cell = cells[j] ?? ''

      // Map known fields
      const field = HEADER_MAP[headerLower]
      if (field) {
        if (NUMERIC_FIELDS.includes(field as keyof Lead)) {
          const n = Number(cell)
          ;(row as Record<string, unknown>)[field] = isNaN(n) || cell === '' ? null : n
        } else {
          ;(row as Record<string, unknown>)[field] = cell === '' ? null : cell
        }
      }

      // Check motivation signals — store the underscore key the UI color maps use
      for (const keyword of MOTIVATION_KEYWORDS) {
        if (headerLower === keyword && isTruthy(cell)) {
          signals.push(keyword.replace(/[\s-]+/g, '_'))
        }
      }
    }

    row.motivation_signals = signals

    // Only include rows that have at minimum an address
    if (row.address) {
      rows.push(row as LeadInsertRow)
    }
  }

  return rows
}
