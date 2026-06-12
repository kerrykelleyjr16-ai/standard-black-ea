import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listTasksSafe, setTaskStatus } from '@wholesale/lib/tasks'
import type { Task } from '@wholesale/lib/types'
import { C, f } from '../../tokens.js'
import DesktopShell from '@wholesale/components/ui/DesktopShell'
import PageHeader from '@wholesale/components/ui/PageHeader'
import FilterPills, { type FilterPill } from '@wholesale/components/ui/FilterPills'
import EntityCard from '@wholesale/components/ui/EntityCard'
import StatusBadge from '@wholesale/components/ui/StatusBadge'
import EmptyState from '@wholesale/components/ui/EmptyState'
import { PrimaryButton, SecondaryButton } from '@wholesale/components/ui/ActionBar'

const TYPE_LABELS: Record<Task['type'], string> = {
  call: 'Call',
  text: 'Text',
  approve_mao: 'Approve MAO',
  approve_offer: 'Approve Offer',
  contact_buyer: 'Contact Buyer',
  analyze: 'Analyze',
  other: 'Other',
}

const APPROVAL_TYPES = new Set<Task['type']>(['approve_mao', 'approve_offer'])

function typeColor(type: Task['type']): string {
  if (APPROVAL_TYPES.has(type)) return C.danger
  if (type === 'call') return C.warning
  if (type === 'text') return C.blue
  if (type === 'contact_buyer') return C.blue
  if (type === 'analyze') return C.purple
  return C.sub
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

export default function Tasks() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showClosed, setShowClosed] = useState(false)
  const [acting, setActing] = useState<string | null>(null)
  const [unavailable, setUnavailable] = useState(false)

  async function fetchTasks() {
    const { tasks: data, unavailable: offline } = await listTasksSafe()
    setTasks(data)
    setUnavailable(offline)
    setLoading(false)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  async function handleStatus(id: string, status: Task['status']) {
    setActing(id)
    try {
      await setTaskStatus(id, status)
      await fetchTasks()
    } finally {
      setActing(null)
    }
  }

  const openTasks = tasks.filter((t) => t.status === 'open')
  const closedTasks = tasks.filter((t) => t.status !== 'open')
  const displayTasks = showClosed ? tasks : openTasks

  const filters: FilterPill[] = useMemo(() => [
    { label: 'Open', value: 'open', count: openTasks.length },
    { label: 'All', value: 'all', count: tasks.length },
  ], [tasks])

  return (
    <DesktopShell>
      <PageHeader
        eyebrow="Operator Queue"
        title="Tasks"
        subtitle={loading ? 'Loading queue…' : `${openTasks.length} open${closedTasks.length > 0 ? ` · ${closedTasks.length} closed` : ''}`}
      />

      {!loading && !unavailable && tasks.length > 0 && (
        <FilterPills
          filters={filters}
          active={showClosed ? 'all' : 'open'}
          onChange={(v) => setShowClosed(v === 'all')}
        />
      )}

      {loading ? (
        <p style={{ marginTop: 24, fontFamily: f.body, fontSize: 14, color: C.mute }}>Loading tasks…</p>
      ) : unavailable ? (
        <EmptyState
          icon="!"
          title="Task queue offline"
          body="Task tables are not provisioned in this environment yet."
        />
      ) : displayTasks.length === 0 ? (
        <EmptyState
          icon="✓"
          title={showClosed ? 'No Tasks Yet' : 'Queue Clear'}
          body={showClosed ? 'Tasks will appear here as the pipeline generates work.' : 'No open tasks right now. Nicely done.'}
        />
      ) : (
        <div style={{ marginTop: 24, display: 'grid', gap: 12 }}>
          {displayTasks.map((task) => {
            const isClosed = task.status !== 'open'
            const isActing = acting === task.id
            return (
              <EntityCard key={task.id} style={{ opacity: isClosed ? 0.5 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: f.body, fontSize: 15, fontWeight: 600, color: isClosed ? C.mute : C.text }}>{task.title}</span>
                      <StatusBadge label={TYPE_LABELS[task.type] ?? task.type} color={typeColor(task.type)} />
                      {isClosed && <StatusBadge label={task.status} color={C.mute} />}
                    </div>
                    {task.detail && (
                      <p style={{ marginTop: 6, fontFamily: f.body, fontSize: 13, color: C.sub }}>{task.detail}</p>
                    )}
                    <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
                      {task.lead_id && (
                        <button onClick={() => navigate(`/wholesale/leads/${task.lead_id}`)} style={{
                          border: 'none', background: 'transparent', cursor: 'pointer',
                          fontFamily: f.mono, fontSize: 11, color: C.success,
                        }}>View Lead →</button>
                      )}
                      {task.deal_id && (
                        <button onClick={() => navigate(`/wholesale/deals/${task.deal_id}`)} style={{
                          border: 'none', background: 'transparent', cursor: 'pointer',
                          fontFamily: f.mono, fontSize: 11, color: C.gold,
                        }}>View Deal →</button>
                      )}
                      <span style={{ fontFamily: f.mono, fontSize: 11, color: C.mute }}>{timeAgo(task.created_at)}</span>
                    </div>
                  </div>
                  {!isClosed && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <PrimaryButton label={isActing ? '…' : 'Done'} onClick={() => handleStatus(task.id, 'done')} disabled={isActing} />
                      <SecondaryButton label="Dismiss" onClick={() => handleStatus(task.id, 'dismissed')} disabled={isActing} />
                    </div>
                  )}
                </div>
              </EntityCard>
            )
          })}
        </div>
      )}
    </DesktopShell>
  )
}
