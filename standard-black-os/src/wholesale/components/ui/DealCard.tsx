import React from 'react'
import { C, f } from '../../../tokens.js'
import EntityCard from './EntityCard'
import StatusBadge from './StatusBadge'
import Metric from './Metric'
import { microLabel } from './styles'
import { formatCurrency } from '../../lib/mao'
import type { Deal, Lead } from '../../lib/types'

export type DealCardDeal = Deal & {
  leads?: Pick<Lead, 'address' | 'city' | 'zip' | 'stage'> | null
}

function nextAction(deal: DealCardDeal): string {
  if (deal.mao_approved_at == null) return 'Approve MAO'
  if (deal.offer_approved_at == null) return 'Approve offer'
  return 'Prepare buyer package'
}

export default function DealCard({ deal, onClick }: { deal: DealCardDeal; onClick?: () => void }) {
  const lead = deal.leads
  const matchedCount = deal.matched_buyer_ids?.length ?? 0
  return (
    <EntityCard onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: f.body, fontSize: 16, fontWeight: 600, color: C.text }}>
            {lead?.address ?? 'Unknown address'}
          </h3>
          <p style={{ marginTop: 4, fontFamily: f.body, fontSize: 13, color: C.mute }}>
            {lead?.city ? `${lead.city}, ` : ''}{lead?.zip ?? ''}
          </p>
        </div>
        {lead?.stage ? <StatusBadge label={lead.stage} /> : null}
      </div>
      <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Metric label="ARV" value={formatCurrency(deal.arv)} />
        <Metric label="Asking" value={formatCurrency(deal.asking_price)} />
        <Metric label="Spread" value={formatCurrency(deal.assignment_fee)} highlight />
        <Metric label="Buyers" value={`${matchedCount} matched`} />
      </div>
      <div style={{ marginTop: 20, borderTop: `1px solid ${C.borderSoft}`, paddingTop: 16 }}>
        <p style={microLabel}>Next Action</p>
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <p style={{ fontFamily: f.body, fontSize: 14, color: C.sub }}>{nextAction(deal)}</p>
          <span style={{ flexShrink: 0, fontFamily: f.body, fontSize: 14, fontWeight: 500, color: C.gold }}>View Deal</span>
        </div>
      </div>
    </EntityCard>
  )
}
