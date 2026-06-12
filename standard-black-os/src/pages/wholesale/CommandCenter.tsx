import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@wholesale/lib/supabase'
import { buildDigest } from '@wholesale/lib/digest'
import type { Digest } from '@wholesale/lib/digest'
import { listTasksSafe } from '@wholesale/lib/tasks'
import type { Lead } from '@wholesale/lib/types'
import { C, f } from '../../tokens.js'
import DesktopShell from '@wholesale/components/ui/DesktopShell'
import PageHeader from '@wholesale/components/ui/PageHeader'
import DetailPanel from '@wholesale/components/ui/DetailPanel'
import Metric from '@wholesale/components/ui/Metric'

const DEALS_IN_FLIGHT_STAGES = new Set<Lead['stage']>([
  'Analyzed', 'Matched', 'Offer Made', 'Under Contract',
])

const STAGES: Lead['stage'][] = [
  'New', 'Skip Traced', 'Contacted', 'Responded',
  'Qualified', 'Analyzed', 'Matched', 'Offer Made',
  'Under Contract', 'Assigned', 'Closed',
]

function todayLabel(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
}

function statValue(n: number | string, color: string) {
  return <span style={{ fontFamily: f.display, fontSize: 26, fontWeight: 700, color }}>{n}</span>
}

function StatTile({ label, value, hint, onClick }: {
  label: string; value: React.ReactNode; hint: string; onClick?: () => void
}) {
  const inner = (
    <>
      <Metric label={label} value={value} />
      <p style={{ marginTop: 6, fontFamily: f.mono, fontSize: 10, color: C.mute }}>{hint}</p>
    </>
  )
  if (!onClick) return <div>{inner}</div>
  return (
    <button onClick={onClick} style={{
      display: 'block', width: '100%', textAlign: 'left',
      border: 'none', background: 'transparent', padding: 0, cursor: 'pointer',
    }}>{inner}</button>
  )
}

export default function CommandCenter() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [digest, setDigest] = useState<Digest | null>(null)
  const [dealsInFlight, setDealsInFlight] = useState(0)
  const [tasksUnavailable, setTasksUnavailable] = useState(false)

  useEffect(() => {
    async function load() {
      const [{ data: leadsData }, tasksResult] = await Promise.all([
        supabase.from('leads').select('*'),
        listTasksSafe(),
      ])

      const leads = (leadsData ?? []) as Lead[]
      const tasks = tasksResult.tasks
      setTasksUnavailable(tasksResult.unavailable)

      const d = buildDigest(leads, tasks)
      setDigest(d)
      setDealsInFlight(leads.filter((l) => DEALS_IN_FLIGHT_STAGES.has(l.stage)).length)
      setLoading(false)
    }
    load()
  }, [])

  const totalLeads = Object.values(digest?.leadsByStage ?? {}).reduce((s, n) => s + n, 0)
  const pendingApprovals = digest?.pendingApprovals ?? 0

  return (
    <DesktopShell>
      <PageHeader eyebrow="Operator Console" title="Command Center" subtitle={todayLabel()} />

      <div style={{
        marginTop: 24, display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12,
      }}>
        <StatTile
          label="Open Tasks"
          value={statValue(loading ? '—' : digest?.openTasks ?? 0, C.gold)}
          hint="View queue →"
          onClick={() => navigate('/wholesale/tasks')}
        />
        <StatTile
          label="Pending Approvals"
          value={statValue(loading ? '—' : pendingApprovals, pendingApprovals > 0 ? C.danger : C.text)}
          hint="MAO / offer gates →"
          onClick={() => navigate('/wholesale/tasks')}
        />
        <StatTile
          label="Deals In Flight"
          value={statValue(loading ? '—' : dealsInFlight, C.success)}
          hint="Analyzed → Under Contract"
        />
        <StatTile
          label="Total Leads"
          value={statValue(loading ? '—' : totalLeads, C.text)}
          hint="View pipeline →"
          onClick={() => navigate('/wholesale/leads')}
        />
      </div>

      {!loading && tasksUnavailable && (
        <p style={{ marginTop: 16, fontFamily: f.mono, fontSize: 12, color: C.mute }}>
          Task queue offline — task tables are not provisioned in this environment yet.
        </p>
      )}

      <div style={{ marginTop: 24 }}>
        <DetailPanel
          title="Pipeline by Stage"
          action={
            <button onClick={() => navigate('/wholesale/leads')} style={{
              border: 'none', background: 'transparent', cursor: 'pointer',
              fontFamily: f.mono, fontSize: 11, color: C.gold,
            }}>View all →</button>
          }
        >
          {loading ? (
            <p style={{ fontFamily: f.body, fontSize: 14, color: C.mute }}>Loading pipeline…</p>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {STAGES.map(stage => {
                const count = digest?.leadsByStage[stage] ?? 0
                const pct = totalLeads > 0 ? (count / totalLeads) * 100 : 0
                const isEmpty = count === 0
                const isInFlight = DEALS_IN_FLIGHT_STAGES.has(stage)
                const barColor = isEmpty ? C.dim : isInFlight ? C.gold : C.success
                return (
                  <button key={stage} onClick={() => navigate('/wholesale/leads')} style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    border: 'none', background: 'transparent', padding: 0, cursor: 'pointer',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontFamily: f.body, fontSize: 13, color: isEmpty ? C.mute : C.sub }}>{stage}</span>
                      <span style={{ fontFamily: f.mono, fontSize: 13, color: barColor }}>{count}</span>
                    </div>
                    <div style={{ width: '100%', height: 4, borderRadius: 999, background: C.surface2 }}>
                      <div style={{
                        width: `${pct}%`, height: 4, borderRadius: 999,
                        background: barColor, minWidth: count > 0 ? 4 : 0,
                      }} />
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </DetailPanel>
      </div>
    </DesktopShell>
  )
}
