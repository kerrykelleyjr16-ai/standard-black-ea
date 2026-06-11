import React from 'react'
import { C, f } from '../../../tokens.js'
import EntityCard from './EntityCard'
import StatusBadge from './StatusBadge'
import TagBadge from './TagBadge'
import { microLabel } from './styles'
import { formatCurrency, formatPercent } from '../../lib/mao'
import type { Buyer } from '../../lib/types'

function marketDisplay(markets: string[] | null | undefined): string {
  if (!markets || markets.length === 0) return '—'
  const shown = markets.slice(0, 2).join(', ')
  const extra = markets.length > 2 ? ` +${markets.length - 2}` : ''
  return shown + extra
}

function priceRange(buyer: Buyer): string {
  if (buyer.min_price == null && buyer.max_price == null) return '—'
  return `${formatCurrency(buyer.min_price)} – ${formatCurrency(buyer.max_price)}`
}

export default function BuyerCard({ buyer, onClick }: { buyer: Buyer; onClick?: () => void }) {
  return (
    <EntityCard onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: f.body, fontSize: 16, fontWeight: 600, color: C.text }}>
            {buyer.name}
          </h3>
          {buyer.company ? (
            <p style={{ marginTop: 4, fontFamily: f.body, fontSize: 13, color: C.mute, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {buyer.company}
            </p>
          ) : null}
        </div>
        <StatusBadge label={buyer.active ? 'Active' : 'Inactive'} color={buyer.active ? C.success : C.mute} />
      </div>
      <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {buyer.strategy ? <TagBadge label={buyer.strategy} /> : null}
        {buyer.target_margin != null ? (
          <StatusBadge label={`${formatPercent(buyer.target_margin)} Margin`} color={C.gold} />
        ) : null}
      </div>
      <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
        <div>
          <p style={microLabel}>Markets</p>
          <p style={{ marginTop: 4, fontFamily: f.body, fontSize: 14, color: C.sub }}>{marketDisplay(buyer.target_markets)}</p>
        </div>
        <div>
          <p style={microLabel}>Price Range</p>
          <p style={{ marginTop: 4, fontFamily: f.body, fontSize: 14, color: C.sub }}>{priceRange(buyer)}</p>
        </div>
      </div>
      <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${C.borderSoft}`, paddingTop: 16 }}>
        <span style={{ fontFamily: f.mono, fontSize: 11, color: C.mute }}>Buyer profile</span>
        <span style={{ fontFamily: f.body, fontSize: 14, fontWeight: 500, color: C.gold }}>View Buyer</span>
      </div>
    </EntityCard>
  )
}
