import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { listTasksSafe, setTaskStatus } from '@wholesale/lib/tasks'
import type { Task } from '@wholesale/lib/types'
import Badge from '@wholesale/components/ui/Badge'
import Button from '@wholesale/components/ui/Button'
import EmptyState from '@wholesale/components/ui/EmptyState'
import WholesaleNav from '@wholesale/components/WholesaleNav'

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

function typeBadgeColor(type: Task['type']): 'red' | 'yellow' | 'blue' | 'cyan' | 'purple' | 'green' | 'gray' {
  if (APPROVAL_TYPES.has(type)) return 'red'
  if (type === 'call') return 'yellow'
  if (type === 'text') return 'cyan'
  if (type === 'contact_buyer') return 'blue'
  if (type === 'analyze') return 'purple'
  return 'gray'
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

  return (
    <>
      <WholesaleNav />
      <div className="min-h-screen font-mono" style={{ background: '#0a0a0a', color: '#e5e5e5' }}>
        {/* Header */}
        <div
          className="flex items-center justify-between gap-3 px-4 py-4 md:px-8 md:py-5 border-b"
          style={{ borderColor: '#333' }}
        >
          <div>
            <h1 className="text-lg font-semibold tracking-wide" style={{ color: '#C9A24A' }}>
              Task Queue
            </h1>
            <p className="text-xs mt-0.5" style={{ color: '#666' }}>
              {loading ? '—' : `${openTasks.length} open${closedTasks.length > 0 ? ` · ${closedTasks.length} closed` : ''}`}
            </p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowClosed((v) => !v)}
          >
            {showClosed ? 'Hide closed' : 'Show closed'}
          </Button>
        </div>

        {/* Task list */}
        <div className="px-4 py-5 md:px-8 md:py-6 space-y-2 pb-[90px] md:pb-6">
          {loading && (
            <p className="text-sm" style={{ color: '#666' }}>Loading tasks...</p>
          )}

          {!loading && unavailable && (
            <EmptyState
              title="Task queue offline"
              body="Task tables are not provisioned in this environment yet."
            />
          )}

          {!loading && !unavailable && displayTasks.length === 0 && (
            <div
              className="rounded-lg px-6 py-10 text-center"
              style={{ background: '#0f0f0f', border: '1px solid #222', color: '#555' }}
            >
              <p className="text-sm">
                {showClosed ? 'No tasks yet.' : 'Queue clear — no open tasks.'}
              </p>
            </div>
          )}

          {!loading && displayTasks.map((task) => {
            const isClosed = task.status !== 'open'
            const isActing = acting === task.id

            return (
              <div
                key={task.id}
                className="rounded-lg px-5 py-4"
                style={{
                  background: '#0f0f0f',
                  border: `1px solid ${isClosed ? '#1a1a1a' : '#333'}`,
                  opacity: isClosed ? 0.45 : 1,
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: title + detail + link */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className="text-sm font-medium"
                        style={{ color: isClosed ? '#666' : '#e5e5e5' }}
                      >
                        {task.title}
                      </span>
                      <Badge
                        label={TYPE_LABELS[task.type] ?? task.type}
                        color={typeBadgeColor(task.type)}
                      />
                    </div>

                    {task.detail && (
                      <p className="text-xs mb-1.5" style={{ color: '#888' }}>
                        {task.detail}
                      </p>
                    )}

                    <div className="flex items-center gap-3 flex-wrap">
                      {task.lead_id && (
                        <button
                          onClick={() => navigate(`/wholesale/leads/${task.lead_id}`)}
                          className="text-[10px] hover:opacity-70"
                          style={{ color: '#7fff7b' }}
                        >
                          View Lead →
                        </button>
                      )}
                      {task.deal_id && (
                        <button
                          onClick={() => navigate(`/wholesale/deals/${task.deal_id}`)}
                          className="text-[10px] hover:opacity-70"
                          style={{ color: '#C9A24A' }}
                        >
                          View Deal →
                        </button>
                      )}
                      <span className="text-[10px]" style={{ color: '#444' }}>
                        {timeAgo(task.created_at)}
                      </span>
                      {isClosed && (
                        <span
                          className="text-[10px] uppercase tracking-widest"
                          style={{ color: '#444' }}
                        >
                          {task.status}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: action buttons (open tasks only) */}
                  {!isClosed && (
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        disabled={isActing}
                        onClick={() => handleStatus(task.id, 'done')}
                      >
                        {isActing ? '...' : 'Done'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={isActing}
                        onClick={() => handleStatus(task.id, 'dismissed')}
                      >
                        Dismiss
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
