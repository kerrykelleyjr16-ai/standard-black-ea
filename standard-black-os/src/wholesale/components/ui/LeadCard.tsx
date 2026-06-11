import React from 'react'
import { C, f } from '../../../tokens.js'
import EntityCard from './EntityCard'
import StatusBadge from './StatusBadge'
import TagBadge from './TagBadge'
import { getLeadPriority } from '../../lib/priority'
import type { Lead } from '../../lib/types'

function formatSignal(signal: string): string {
  return signal.replace(/_/g, ' ')
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days <= 0) return 'today'
  if (days === 1) return '1d ago'
  if (days < 30) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 8) return `${weeks}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

export default function LeadCard({ lead, onClick }: { lead: Lead; onClick?: () => void }) {
  const signals = (lead.motivation_signals ?? []).map(formatSignal)
  const priority = getLeadPriority({ status: lead.stage, tags: signals })
  const priorityColor = priority === 'Hot' ? C.danger : priority === 'Warm' ? C.warning : C.blue
  return (
    <EntityCard onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <h3 style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: f.body, fontSize: 16, fontWeight: 600, color: C.text }}>
            {lead.address}
          </h3>
          <p style={{ marginTop: 4, fontFamily: f.body, fontSize: 13, color: C.mute }}>
            {lead.city}, {lead.state} {lead.zip}
          </p>
        </div>
        <StatusBadge label={priority} color={priorityColor} />
      </div>
      {lead.owner_name ? (
        <p style={{ marginTop: 16, fontFamily: f.body, fontSize: 14, color: C.sub }}>{lead.owner_name}</p>
      ) : null}
      {signals.length > 0 ? (
        <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {signals.map((tag) => <TagBadge key={tag} label={tag} />)}
        </div>
      ) : null}
      <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${C.borderSoft}`, paddingTop: 16 }}>
        <StatusBadge label={lead.stage} />
        <span style={{ fontFamily: f.mono, fontSize: 11, color: C.mute }}>{timeAgo(lead.created_at)}</span>
      </div>
    </EntityCard>
  )
}
