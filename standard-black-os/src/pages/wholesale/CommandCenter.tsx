import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@wholesale/lib/supabase'
import { buildDigest } from '@wholesale/lib/digest'
import type { Digest } from '@wholesale/lib/digest'
import type { Lead, Task } from '@wholesale/lib/types'
import WholesaleNav from '@wholesale/components/WholesaleNav'

const DEALS_IN_FLIGHT_STAGES = new Set<Lead['stage']>([
  'Analyzed', 'Matched', 'Offer Made', 'Under Contract',
])

const STAGES: Lead['stage'][] = [
  'New', 'Skip Traced', 'Contacted', 'Responded',
  'Qualified', 'Analyzed', 'Matched', 'Offer Made',
  'Under Contract', 'Assigned', 'Closed',
]

function Skeleton({ className }: { className: string }) {
  return <div className={className} style={{ background: '#1a1a1a', borderRadius: 4 }} />
}

function todayLabel(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
}

export default function CommandCenter() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [digest, setDigest] = useState<Digest | null>(null)
  const [dealsInFlight, setDealsInFlight] = useState(0)

  useEffect(() => {
    async function load() {
      const [{ data: leadsData }, { data: tasksData }] = await Promise.all([
        supabase.from('leads').select('*'),
        supabase.from('tasks').select('*'),
      ])

      const leads = (leadsData ?? []) as Lead[]
      const tasks = (tasksData ?? []) as Task[]

      const d = buildDigest(leads, tasks)
      setDigest(d)
      setDealsInFlight(leads.filter((l) => DEALS_IN_FLIGHT_STAGES.has(l.stage)).length)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <>
      <WholesaleNav />
      <div className="min-h-screen font-mono" style={{ background: '#0a0a0a', color: '#e5e5e5' }}>
        {/* Header */}
        <div className="px-4 py-4 md:px-8 md:py-5 border-b" style={{ borderColor: '#333' }}>
          <h1 className="text-lg font-semibold" style={{ color: '#e5e5e5' }}>Command Center</h1>
          <p className="text-xs mt-0.5" style={{ color: '#666' }}>{todayLabel()}</p>
        </div>

        <div className="px-4 py-5 md:px-8 md:py-6 space-y-5 pb-[90px] md:pb-6">

          {/* Top stat row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Open Tasks */}
            <button
              onClick={() => navigate('/wholesale/tasks')}
              className="rounded-lg px-4 py-4 text-left hover:opacity-80 transition-opacity"
              style={{ background: '#0f0f0f', border: '1px solid #333' }}
            >
              <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: '#555' }}>Open Tasks</p>
              {loading
                ? <Skeleton className="h-7 w-12" />
                : <p className="text-2xl font-bold tabular-nums" style={{ color: '#C9A24A' }}>
                    {digest?.openTasks ?? 0}
                  </p>
              }
              <p className="text-[10px] mt-1" style={{ color: '#555' }}>View queue →</p>
            </button>

            {/* Pending Approvals */}
            <button
              onClick={() => navigate('/wholesale/tasks')}
              className="rounded-lg px-4 py-4 text-left hover:opacity-80 transition-opacity"
              style={{ background: '#0f0f0f', border: '1px solid #333' }}
            >
              <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: '#555' }}>Pending Approvals</p>
              {loading
                ? <Skeleton className="h-7 w-12" />
                : <p
                    className="text-2xl font-bold tabular-nums"
                    style={{ color: (digest?.pendingApprovals ?? 0) > 0 ? '#f87171' : '#e5e5e5' }}
                  >
                    {digest?.pendingApprovals ?? 0}
                  </p>
              }
              <p className="text-[10px] mt-1" style={{ color: '#555' }}>MAO / offer gates →</p>
            </button>

            {/* Deals In Flight */}
            <div
              className="rounded-lg px-4 py-4"
              style={{ background: '#0f0f0f', border: '1px solid #333' }}
            >
              <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: '#555' }}>Deals In Flight</p>
              {loading
                ? <Skeleton className="h-7 w-12" />
                : <p className="text-2xl font-bold tabular-nums" style={{ color: '#7fff7b' }}>
                    {dealsInFlight}
                  </p>
              }
              <p className="text-[10px] mt-1" style={{ color: '#555' }}>Analyzed → Under Contract</p>
            </div>

            {/* Total Leads */}
            <button
              onClick={() => navigate('/wholesale/leads')}
              className="rounded-lg px-4 py-4 text-left hover:opacity-80 transition-opacity"
              style={{ background: '#0f0f0f', border: '1px solid #333' }}
            >
              <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: '#555' }}>Total Leads</p>
              {loading
                ? <Skeleton className="h-7 w-12" />
                : <p className="text-2xl font-bold tabular-nums" style={{ color: '#e5e5e5' }}>
                    {Object.values(digest?.leadsByStage ?? {}).reduce((s, n) => s + n, 0)}
                  </p>
              }
              <p className="text-[10px] mt-1" style={{ color: '#555' }}>View pipeline →</p>
            </button>
          </div>

          {/* Leads by stage */}
          <div
            className="rounded-lg px-5 py-5"
            style={{ background: '#0f0f0f', border: '1px solid #333' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs uppercase tracking-widest" style={{ color: '#666' }}>Pipeline by Stage</h2>
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
                  <Skeleton key={s} className="h-3 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2.5">
                {STAGES.map(stage => {
                  const count = digest?.leadsByStage[stage] ?? 0
                  const total = Object.values(digest?.leadsByStage ?? {}).reduce((s, n) => s + n, 0)
                  const pct = total > 0 ? (count / total) * 100 : 0
                  const isEmpty = count === 0
                  const isInFlight = DEALS_IN_FLIGHT_STAGES.has(stage)
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
                          style={{ color: isEmpty ? '#333' : isInFlight ? '#C9A24A' : '#7fff7b' }}
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
                            background: isEmpty ? '#222' : isInFlight ? '#C9A24A' : '#7fff7b',
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

        </div>
      </div>
    </>
  )
}
