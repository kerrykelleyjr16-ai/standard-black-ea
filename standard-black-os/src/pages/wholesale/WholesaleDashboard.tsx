import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@wholesale/lib/supabase'
import { formatCurrency } from '@wholesale/lib/mao'
import type { LeadStage } from '@wholesale/lib/types'
import WholesaleNav from '@wholesale/components/WholesaleNav'

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
  light: '#7fff7b',
  moderate: '#ffff7b',
  heavy: '#ff7b7b',
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

function Skeleton({ className }: { className: string }) {
  return <div className={className} style={{ background: '#1a1a1a', borderRadius: 4 }} />
}

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

  return (
    <>
      <WholesaleNav />
      <div className="min-h-screen font-mono" style={{ background: '#0a0a0a', color: '#e5e5e5' }}>
        {/* Header */}
        <div className="px-8 py-5 border-b" style={{ borderColor: '#333' }}>
          <h1 className="text-lg font-semibold" style={{ color: '#e5e5e5' }}>Dashboard</h1>
          <p className="text-xs mt-0.5" style={{ color: '#666' }}>Standard Black Wholesale OS</p>
        </div>

        <div className="px-8 py-6 space-y-5">

          {/* Stat tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Total Leads */}
            <div className="rounded-lg px-4 py-4" style={{ background: '#0f0f0f', border: '1px solid #333' }}>
              <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: '#555' }}>Total Leads</p>
              {loading
                ? <Skeleton className="h-7 w-12" />
                : <p className="text-2xl font-bold tabular-nums" style={{ color: '#e5e5e5' }}>{leads.length}</p>
              }
            </div>

            {/* Active Deals */}
            <div className="rounded-lg px-4 py-4" style={{ background: '#0f0f0f', border: '1px solid #333' }}>
              <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: '#555' }}>Active Deals</p>
              {loading
                ? <Skeleton className="h-7 w-12" />
                : <p className="text-2xl font-bold tabular-nums" style={{ color: '#e5e5e5' }}>{deals.length}</p>
              }
            </div>

            {/* Active Buyers */}
            <div className="rounded-lg px-4 py-4" style={{ background: '#0f0f0f', border: '1px solid #333' }}>
              <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: '#555' }}>Active Buyers</p>
              {loading
                ? <Skeleton className="h-7 w-12" />
                : <p className="text-2xl font-bold tabular-nums" style={{ color: '#7fff7b' }}>{activeBuyers}</p>
              }
            </div>

            {/* Potential Fees */}
            <div className="rounded-lg px-4 py-4" style={{ background: '#0f0f0f', border: '1px solid #333' }}>
              <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: '#555' }}>Potential Fees</p>
              {loading
                ? <Skeleton className="h-7 w-20" />
                : <p className="text-2xl font-bold tabular-nums" style={{ color: '#7fff7b' }}>{formatCurrency(potentialFees)}</p>
              }
            </div>

            {/* Closed Deals */}
            <div className="rounded-lg px-4 py-4" style={{ background: '#0f0f0f', border: '1px solid #333' }}>
              <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: '#555' }}>Closed Deals</p>
              {loading ? (
                <>
                  <Skeleton className="h-7 w-10 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold tabular-nums" style={{ color: '#e5e5e5' }}>
                    {closedDeals.length}
                  </p>
                  <p className="text-[10px] mt-1" style={{ color: '#7fff7b' }}>
                    {formatCurrency(feesEarned)} earned
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Pipeline + Recent Deals */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

            {/* Pipeline Funnel */}
            <div
              className="lg:col-span-3 rounded-lg px-5 py-5"
              style={{ background: '#0f0f0f', border: '1px solid #333' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs uppercase tracking-widest" style={{ color: '#666' }}>Lead Pipeline</h2>
                <button
                  onClick={() => navigate('/wholesale/leads')}
                  className="text-[10px] hover:opacity-80"
                  style={{ color: '#C9A24A' }}
                >
                  View all →
                </button>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {STAGES.slice(0, 6).map(s => (
                    <div key={s}>
                      <Skeleton className="h-3 w-full mb-1" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {STAGES.map(stage => {
                    const count = stageCounts[stage]
                    const pct = (count / maxStageCount) * 100
                    const isEmpty = count === 0
                    return (
                      <button
                        key={stage}
                        onClick={() => navigate('/wholesale/leads')}
                        className="w-full text-left group"
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-xs" style={{ color: isEmpty ? '#444' : '#aaa' }}>
                            {stage}
                          </span>
                          <span
                            className="text-xs tabular-nums"
                            style={{ color: isEmpty ? '#333' : '#7fff7b' }}
                          >
                            {count}
                          </span>
                        </div>
                        <div className="w-full rounded-full" style={{ background: '#1a1a1a', height: '3px' }}>
                          <div
                            className="rounded-full"
                            style={{
                              width: `${pct}%`,
                              height: '3px',
                              background: isEmpty ? '#222' : '#7fff7b',
                              minWidth: count > 0 ? '4px' : '0',
                            }}
                          />
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Recent Deals */}
            <div
              className="lg:col-span-2 rounded-lg px-5 py-5"
              style={{ background: '#0f0f0f', border: '1px solid #333' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs uppercase tracking-widest" style={{ color: '#666' }}>Recent Deals</h2>
                <button
                  onClick={() => navigate('/wholesale/deals')}
                  className="text-[10px] hover:opacity-80"
                  style={{ color: '#C9A24A' }}
                >
                  View all →
                </button>
              </div>

              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : recentDeals.length === 0 ? (
                <p className="text-xs" style={{ color: '#444' }}>No deals yet.</p>
              ) : (
                <div className="space-y-2">
                  {recentDeals.map(deal => (
                    <button
                      key={deal.id}
                      onClick={() => navigate(`/wholesale/deals/${deal.id}`)}
                      className="w-full text-left rounded px-3 py-2 transition-opacity hover:opacity-80"
                      style={{ background: '#111', border: '1px solid #222' }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium truncate" style={{ color: '#e5e5e5' }}>
                            {deal.leads?.address ?? 'Unknown'}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px]" style={{ color: '#555' }}>
                              ARV {formatCurrency(deal.arv)}
                            </span>
                            {deal.repair_level && (
                              <span
                                className="text-[10px] px-1 rounded"
                                style={{
                                  background: '#1a1a1a',
                                  color: REPAIR_COLOR[deal.repair_level] ?? '#aaa',
                                }}
                              >
                                {deal.repair_level}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs shrink-0 font-medium" style={{ color: '#7fff7b' }}>
                          {formatCurrency(deal.assignment_fee)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <div
            className="rounded-lg px-5 py-5"
            style={{ background: '#0f0f0f', border: '1px solid #333' }}
          >
            <h2 className="text-xs uppercase tracking-widest mb-4" style={{ color: '#666' }}>Recent Activity</h2>

            {loading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-4 w-full" />)}
              </div>
            ) : activity.length === 0 ? (
              <p className="text-xs" style={{ color: '#444' }}>
                No activity yet — import leads to get started.
              </p>
            ) : (
              <div className="space-y-2">
                {activity.map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: item.type === 'lead' ? '#7fff7b' : '#C9A24A' }}
                      />
                      <span className="text-xs truncate" style={{ color: '#aaa' }}>
                        {item.text}
                      </span>
                    </div>
                    <span className="text-[10px] shrink-0" style={{ color: '#444' }}>
                      {timeAgo(item.time)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}
