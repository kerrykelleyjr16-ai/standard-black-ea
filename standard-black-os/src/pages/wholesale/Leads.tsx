import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@wholesale/lib/supabase'
import type { Lead, LeadStage } from '@wholesale/lib/types'
import Badge from '@wholesale/components/ui/Badge'
import Button from '@wholesale/components/ui/Button'
import WholesaleNav from '@wholesale/components/WholesaleNav'

const STAGES: LeadStage[] = [
  'New', 'Skip Traced', 'Contacted', 'Responded',
  'Qualified', 'Analyzed', 'Matched', 'Offer Made',
  'Under Contract', 'Assigned', 'Closed',
]

const MOTIVATION_COLORS: Record<string, 'blue' | 'yellow' | 'red' | 'purple' | 'cyan'> = {
  absentee: 'blue',
  vacant: 'yellow',
  tax_delinquent: 'red',
  pre_foreclosure: 'red',
  inherited: 'purple',
  tired_landlord: 'cyan',
}

function formatSignal(signal: string): string {
  return signal.replace(/_/g, ' ')
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return '1d ago'
  if (days < 30) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 8) return `${weeks}w ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

export default function Leads() {
  const navigate = useNavigate()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [activeStage, setActiveStage] = useState<LeadStage | 'All'>('All')

  useEffect(() => {
    async function fetchLeads() {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data) setLeads(data as Lead[])
      setLoading(false)
    }
    fetchLeads()
  }, [])

  const stageCount = (stage: LeadStage) => leads.filter(l => l.stage === stage).length
  const filtered = activeStage === 'All' ? leads : leads.filter(l => l.stage === activeStage)

  return (
    <>
      <WholesaleNav />
      <div className="min-h-screen font-mono" style={{ background: '#0a0a0a', color: '#e5e5e5' }}>
        {/* Header */}
        <div
          className="flex items-center justify-between px-8 py-5 border-b"
          style={{ borderColor: '#333' }}
        >
          <div>
            <h1 className="text-lg font-semibold tracking-wide" style={{ color: '#7fff7b' }}>
              Leads Pipeline
            </h1>
            <p className="text-xs mt-0.5" style={{ color: '#666' }}>
              {loading ? '—' : `${leads.length} leads in pipeline`}
            </p>
          </div>
          <Button onClick={() => navigate('/wholesale/leads/import')} size="sm">
            + Import Leads
          </Button>
        </div>

        {/* Stage filter tabs */}
        <div
          className="flex items-center gap-0 overflow-x-auto border-b"
          style={{ borderColor: '#333' }}
        >
          {(['All', ...STAGES] as const).map(stage => {
            const count = stage === 'All' ? leads.length : stageCount(stage)
            const isActive = activeStage === stage
            return (
              <button
                key={stage}
                onClick={() => setActiveStage(stage)}
                className="relative shrink-0 px-4 py-3 text-xs font-mono transition-colors"
                style={{
                  color: isActive ? '#7fff7b' : '#666',
                  background: 'transparent',
                  borderBottom: isActive ? '2px solid #7fff7b' : '2px solid transparent',
                }}
              >
                {stage}
                <span
                  className="ml-1.5 px-1 rounded text-[10px]"
                  style={{
                    background: isActive ? '#1a2e1a' : '#1a1a1a',
                    color: isActive ? '#7fff7b' : '#555',
                  }}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Lead list */}
        <div className="px-8 py-6 space-y-2">
          {loading && (
            <p className="text-sm" style={{ color: '#666' }}>Loading leads...</p>
          )}
          {!loading && filtered.length === 0 && (
            <div
              className="rounded-lg px-6 py-10 text-center"
              style={{ background: '#0f0f0f', border: '1px solid #222', color: '#555' }}
            >
              <p className="text-sm">
                {activeStage === 'All' ? 'No leads yet — import your first batch.' : `No leads in ${activeStage}`}
              </p>
            </div>
          )}
          {!loading && filtered.map(lead => (
            <button
              key={lead.id}
              onClick={() => navigate(`/wholesale/leads/${lead.id}`)}
              className="w-full text-left rounded-lg px-5 py-4 transition-colors hover:opacity-90"
              style={{ background: '#0f0f0f', border: '1px solid #333' }}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left: address + signals */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium truncate" style={{ color: '#e5e5e5' }}>
                      {lead.address}
                    </span>
                    <span className="text-xs" style={{ color: '#666' }}>
                      {lead.city}, {lead.zip}
                    </span>
                  </div>
                  {lead.owner_name && (
                    <p className="text-xs mt-0.5" style={{ color: '#aaa' }}>
                      {lead.owner_name}
                    </p>
                  )}
                  {lead.motivation_signals?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {lead.motivation_signals.map(signal => (
                        <Badge
                          key={signal}
                          label={formatSignal(signal)}
                          color={MOTIVATION_COLORS[signal] ?? 'gray'}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: stage + time */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <Badge label={lead.stage} color="green" />
                  <span className="text-[10px]" style={{ color: '#555' }}>
                    {timeAgo(lead.created_at)}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
