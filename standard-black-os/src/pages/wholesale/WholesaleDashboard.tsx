import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@wholesale/lib/supabase'
import { formatCurrency } from '@wholesale/lib/mao'
import type { LeadStage } from '@wholesale/lib/types'
import { C, f } from '../../tokens.js'
import DesktopShell from '@wholesale/components/ui/DesktopShell'
import PageHeader from '@wholesale/components/ui/PageHeader'
import DetailPanel from '@wholesale/components/ui/DetailPanel'
import Metric from '@wholesale/components/ui/Metric'

const STAGES: LeadStage[] = [
  'New', 'Skip Traced', 'Contacted', 'Responded',
  'Qualified', 'Analyzed', 'Matched', 'Offer Made',
  'Under Contract', 'Assigned', 'Closed',
]

type LeadRow = { stage: LeadStage; created_at: string; address: string; city: string }
type DealRow = {
  id: string
  arv: number | null
  assignment_fee: number | null
  analyzed_at: string | null
  repair_level: 'light' | 'moderate' | 'heavy' | null
  leads: { address: string; city: string; stage: string } | null
}

const REPAIR_COLOR: Record<string, string> = {
  light: C.success,
  moderate: C.warning,
  heavy: C.danger,
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return '1d ago'
  if (days < 30) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 8) return `${weeks}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

function statValue(n: React.ReactNode, color: string) {
  return <span style={{ fontFamily: f.display, fontSize: 26, fontWeight: 700, color }}>{n}</span>
}

const sectionAction = (label: string, onClick: () => void) => (
  <button onClick={onClick} style={{
    border: 'none', background: 'transparent', cursor: 'pointer',
    fontFamily: f.mono, fontSize: 11, color: C.gold,
  }}>{label}</button>
)

export default function WholesaleDashboard() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [leads, setLeads] = useState<LeadRow[]>([])
  const [deals, setDeals] = useState<DealRow[]>([])
  const [activeBuyers, setActiveBuyers] = useState(0)

  useEffect(() => {
    async function load() {
      const [
        { data: leadsData },
        { data: dealsData },
        { count: buyerCount },
      ] = await Promise.all([
        supabase
          .from('leads')
          .select('stage, created_at, address, city')
          .order('created_at', { ascending: false }),
        supabase
          .from('deals')
          .select('id, arv, assignment_fee, analyzed_at, repair_level, leads(address, city, stage)')
          .order('analyzed_at', { ascending: false, nullsFirst: false }),
        supabase
          .from('buyers')
          .select('id', { count: 'exact', head: true })
          .eq('active', true),
      ])

      if (leadsData) setLeads(leadsData as LeadRow[])
      if (dealsData) setDeals(dealsData as unknown as DealRow[])
      if (buyerCount != null) setActiveBuyers(buyerCount)
      setLoading(false)
    }
    load()
  }, [])

  const closedStages = new Set(['Closed', 'Assigned'])
  const closedDeals = deals.filter(d => closedStages.has(d.leads?.stage ?? ''))
  const openDeals = deals.filter(d => !closedStages.has(d.leads?.stage ?? ''))

  const potentialFees = openDeals.reduce((sum, d) => sum + (d.assignment_fee ?? 0), 0)
  const feesEarned = closedDeals.reduce((sum, d) => sum + (d.assignment_fee ?? 0), 0)

  const stageCounts = STAGES.reduce(
    (acc, stage) => {
      acc[stage] = leads.filter(l => l.stage === stage).length
      return acc
    },
    {} as Record<LeadStage, number>
  )
  const maxStageCount = Math.max(...Object.values(stageCounts), 1)

  const recentDeals = deals.slice(0, 5)

  const leadActivity = leads.slice(0, 5).map(l => ({
    text: `Lead added — ${l.address}${l.city ? `, ${l.city}` : ''}`,
    time: l.created_at,
    type: 'lead' as const,
  }))
  const dealActivity = deals
    .filter(d => d.analyzed_at)
    .slice(0, 5)
    .map(d => ({
      text: `Deal analyzed — ${d.leads?.address ?? 'Unknown'}${d.leads?.city ? `, ${d.leads.city}` : ''}`,
      time: d.analyzed_at!,
      type: 'deal' as const,
    }))
  const activity = [...leadActivity, ...dealActivity]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 8)

  const dash = loading ? '—' : undefined

  return (
    <DesktopShell>
      <PageHeader eyebrow="Executive Desk" title="Wholesale Dashboard" subtitle="Standard Black Wholesale OS" />

      {/* Stat tiles */}
      <div style={{
        marginTop: 24, display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12,
      }}>
        <Metric label="Total Leads" value={statValue(dash ?? leads.length, C.text)} />
        <Metric label="Active Deals" value={statValue(dash ?? deals.length, C.text)} />
        <Metric label="Active Buyers" value={statValue(dash ?? activeBuyers, C.success)} />
        <Metric label="Potential Fees" value={statValue(dash ?? formatCurrency(potentialFees), C.success)} />
        <Metric
          label="Closed Deals"
          value={
            <span>
              {statValue(dash ?? closedDeals.length, C.text)}
              {!loading && (
                <span style={{ marginLeft: 8, fontFamily: f.mono, fontSize: 11, color: C.success }}>
                  {formatCurrency(feesEarned)} earned
                </span>
              )}
            </span>
          }
        />
      </div>

      {/* Pipeline + Recent Deals */}
      <div style={{
        marginTop: 24, display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 16,
      }}>
        <DetailPanel title="Lead Pipeline" action={sectionAction('View all →', () => navigate('/wholesale/leads'))}>
          {loading ? (
            <p style={{ fontFamily: f.body, fontSize: 14, color: C.mute }}>Loading pipeline…</p>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {STAGES.map(stage => {
                const count = stageCounts[stage]
                const pct = (count / maxStageCount) * 100
                const isEmpty = count === 0
                const barColor = isEmpty ? C.dim : C.gold
                return (
                  <button key={stage} onClick={() => navigate('/wholesale/leads')} style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    border: 'none', background: 'transparent', padding: 0, cursor: 'pointer',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontFamily: f.body, fontSize: 13, color: isEmpty ? C.mute : C.sub }}>{stage}</span>
                      <span style={{ fontFamily: f.mono, fontSize: 13, color: isEmpty ? C.mute : C.gold }}>{count}</span>
                    </div>
                    <div style={{ width: '100%', height: 4, borderRadius: 999, background: C.surface2 }}>
                      <div style={{ width: `${pct}%`, height: 4, borderRadius: 999, background: barColor, minWidth: count > 0 ? 4 : 0 }} />
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </DetailPanel>

        <DetailPanel title="Recent Deals" action={sectionAction('View all →', () => navigate('/wholesale/deals'))}>
          {loading ? (
            <p style={{ fontFamily: f.body, fontSize: 14, color: C.mute }}>Loading deals…</p>
          ) : recentDeals.length === 0 ? (
            <p style={{ fontFamily: f.body, fontSize: 13, color: C.mute }}>No deals yet.</p>
          ) : (
            <div style={{ display: 'grid', gap: 8 }}>
              {recentDeals.map(deal => (
                <button key={deal.id} onClick={() => navigate(`/wholesale/deals/${deal.id}`)} style={{
                  display: 'block', width: '100%', textAlign: 'left', cursor: 'pointer',
                  borderRadius: 12, border: `1px solid ${C.borderSoft}`, background: 'rgba(0,0,0,0.3)',
                  padding: '12px 14px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: f.body, fontSize: 14, fontWeight: 500, color: C.text }}>
                        {deal.leads?.address ?? 'Unknown'}
                      </p>
                      <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontFamily: f.mono, fontSize: 11, color: C.mute }}>ARV {formatCurrency(deal.arv)}</span>
                        {deal.repair_level && (
                          <span style={{
                            fontFamily: f.mono, fontSize: 11, padding: '1px 6px', borderRadius: 6,
                            background: C.surface2, color: REPAIR_COLOR[deal.repair_level] ?? C.sub,
                          }}>{deal.repair_level}</span>
                        )}
                      </div>
                    </div>
                    <span style={{ flexShrink: 0, fontFamily: f.body, fontSize: 14, fontWeight: 600, color: C.success }}>
                      {formatCurrency(deal.assignment_fee)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </DetailPanel>
      </div>

      {/* Activity Feed */}
      <div style={{ marginTop: 24 }}>
        <DetailPanel title="Recent Activity">
          {loading ? (
            <p style={{ fontFamily: f.body, fontSize: 14, color: C.mute }}>Loading activity…</p>
          ) : activity.length === 0 ? (
            <p style={{ fontFamily: f.body, fontSize: 13, color: C.mute }}>No activity yet — import leads to get started.</p>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {activity.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    <span style={{ width: 6, height: 6, borderRadius: 999, flexShrink: 0, background: item.type === 'lead' ? C.success : C.gold }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: f.body, fontSize: 13, color: C.sub }}>{item.text}</span>
                  </div>
                  <span style={{ flexShrink: 0, fontFamily: f.mono, fontSize: 11, color: C.mute }}>{timeAgo(item.time)}</span>
                </div>
              ))}
            </div>
          )}
        </DetailPanel>
      </div>
    </DesktopShell>
  )
}
