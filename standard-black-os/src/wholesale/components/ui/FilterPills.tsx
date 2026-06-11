import React from 'react'
import { C, f } from '../../../tokens.js'
import { goldGradient } from './styles'

export type FilterPill = { label: string; value: string; count?: number }

export default function FilterPills({ filters, active, onChange }: {
  filters: FilterPill[]; active: string; onChange: (value: string) => void
}) {
  return (
    <div className="sb-hide-scrollbar" style={{ marginTop: 20, display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
      {filters.map((filter) => {
        const isActive = filter.value === active
        return (
          <button key={filter.value} onClick={() => onChange(filter.value)} style={{
            whiteSpace: 'nowrap', borderRadius: 999, padding: '8px 16px',
            fontFamily: f.mono, fontSize: 12, fontWeight: 500, cursor: 'pointer',
            transition: 'all 0.15s',
            ...(isActive
              ? { background: goldGradient, color: C.bg, border: '1px solid transparent' }
              : { background: C.surface, color: C.gold, border: `1px solid ${C.borderGold}` }),
          }}>
            {filter.label}{typeof filter.count === 'number' ? ` ${filter.count}` : ''}
          </button>
        )
      })}
    </div>
  )
}
