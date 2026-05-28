import { useState } from 'react'
import {
  Brain, Send, AlertTriangle, Square, TrendingUp,
  Mail, Calendar, HardDrive, Palette, FileSignature, Zap, Loader,
} from 'lucide-react'
import { C, f } from '../tokens.js'
import { loadTradingData, getRuleBreaksThisWeek } from '../data/tradingData.js'

// ─── Claude API Call ──────────────────────────────────────────────────────────

function buildSystemPrompt(data, trading) {
  const active = data.ventures.filter(v => v.status === 'active')
  const tasks  = (data.aios?.tasks ?? []).filter(t => t.owner === 'kerry' && t.status !== 'done')
  const fups   = (data.aios?.followUps ?? []).filter(f => !f.done)
  const cr     = data.aios?.cashReserve ?? { current: 0, target: 5000, label: 'Reserve' }
  const pct    = cr.target > 0 ? Math.round((cr.current / cr.target) * 100) : 0

  return `You are the Standard Black AIOS — Kerry Kelley Jr's executive assistant and strategic operator. You know his business cold.

ABOUT KERRY:
- CEO & Chairman of Standard Black | CEO of Kasino Family Holdings
- Building a multi-industry ownership empire. Phase I: build reserves, master note underwriting, form entity stack.
- Current income: Staples, $17/hr, Mon–Fri 9-5. Side hustle: Standard Black Creations (website dev via Lovable).
- Team: Kody Kelley (brother, CEO in training), TJ Henry (friend, execution-focused).
- Communication: direct, no fluff, no emojis, confident — plain language about big ambitions.

LIVE BUSINESS STATE:
Active Ventures (${active.length}):
${active.map(v => `• ${v.name} [P${v.priority}] — ${v.kpi.label}: ${v.kpi.value} / ${v.kpi.target}\n  Next: ${v.nextActions?.[0] ?? 'None defined'}`).join('\n')}

Tasks on Kerry (${tasks.length}):
${tasks.length ? tasks.map(t => `• ${t.title}${t.due ? ` (due ${t.due})` : ''}`).join('\n') : '• None — queue clear'}

Open Follow-Ups (${fups.length}):
${fups.length ? fups.map(fu => `• ${fu.contact}${fu.about ? ` — ${fu.about}` : ''}`).join('\n') : '• None'}

Finances:
• Cash Reserve: $${cr.current.toLocaleString()} / $${cr.target.toLocaleString()} (${pct}%)
• Team pool: $315/mo ($105/person), due 28th each month
• Mentorship debt: ~$2,832 remaining · est. payoff Oct 2027
${trading ? `\nTrading:\n• Discipline score: ${trading.disciplineScore ?? 0}%\n• Rule breaks this week: ${getRuleBreaksThisWeek(trading.trades ?? [])}\n• Trades logged: ${trading.trades?.length ?? 0}` : '\nTrading: No data logged yet.'}

OS Status: ${data.skills.filter(s => s.status === 'live').length} skills live · ${data.automations.filter(a => a.on).length} automations running

RESPONSE RULES:
- Be direct. Lead with the answer or the key fact.
- Bullets or short paragraphs — no walls of text, no filler.
- No emojis. No corporate softening. Match Kerry's voice.
- For briefings: hit ventures, tasks, follow-ups, and any risks.
- For priorities: rank what actually matters most right now, not what sounds good.
- Speak like a sharp exec assistant who has full context and no time to waste.`
}

async function callClaude(input, data, trading) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('Add VITE_ANTHROPIC_API_KEY to your .env.local file to enable AI responses.')
  }

  const res = await fetch('/api/claude/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: buildSystemPrompt(data, trading),
      messages: [{ role: 'user', content: input }],
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message ?? `API error ${res.status}`)
  }

  const json = await res.json()
  const text = json.content?.[0]?.type === 'text' ? json.content[0].text : ''
  return text.trim()
}

// ─── Risk Alerts ──────────────────────────────────────────────────────────────

function buildRiskAlerts(data, trading) {
  const alerts = []
  const openFU = (data.aios?.followUps ?? []).filter(f => !f.done).length
  if (openFU > 3) alerts.push(`${openFU} open follow-ups — risk of missed contacts`)
  if (data.automations.every(a => !a.on)) alerts.push('All automations paused — review automation health')
  if (trading) {
    const breaks = getRuleBreaksThisWeek(trading.trades ?? [])
    if (breaks > 3) alerts.push(`${breaks} rule breaks this week — demotion risk`)
    if ((trading.disciplineScore ?? 100) < 50) alerts.push(`Trading discipline at ${trading.disciplineScore}% — review before next session`)
  }
  if (data.ventures.find(v => v.id === 'fund')?.kpi?.pct === 0) {
    alerts.push('Fund I — no capital raised · investor outreach not started')
  }
  return alerts
}

// ─── Card Shell ───────────────────────────────────────────────────────────────

function AIOSCard({ label, accent, children }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4,
      padding: '14px 16px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: accent ?? C.gold }} />
      <div style={{ fontFamily: f.mono, fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.mute, marginBottom: 10 }}>
        {label}
      </div>
      {children}
    </div>
  )
}

const inputStyle = {
  background: '#1A1A1A', border: `1px solid ${C.border}`, borderRadius: 2,
  color: C.text, fontFamily: f.mono, fontSize: 11, padding: '5px 8px',
  boxSizing: 'border-box', width: '100%',
}

const miniBtn = (color = C.gold) => ({
  background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 2,
  color, cursor: 'pointer', padding: '3px 8px', fontFamily: f.mono, fontSize: 10,
})

// ─── Cards ────────────────────────────────────────────────────────────────────

function BriefingCard({ data, trading }) {
  const active    = data.ventures.filter(v => v.status === 'active')
  const liveSkills = data.skills.filter(s => s.status === 'live').length
  const openFU    = (data.aios?.followUps ?? []).filter(f => !f.done).length
  const myTasks   = (data.aios?.tasks ?? []).filter(t => t.owner === 'kerry' && t.status !== 'done').length
  const disc      = trading?.disciplineScore ?? null

  const rows = [
    { text: `${active.length} ventures active`, color: C.sub },
    { text: `${liveSkills} skills live`, color: C.sub },
    openFU > 0
      ? { text: `${openFU} follow-up${openFU !== 1 ? 's' : ''} pending`, color: C.gold }
      : { text: '✓ Follow-ups clear', color: C.green },
    myTasks > 0
      ? { text: `${myTasks} task${myTasks !== 1 ? 's' : ''} on you`, color: myTasks > 2 ? C.red : C.gold }
      : { text: '✓ Tasks clear', color: C.green },
    disc !== null ? { text: `Trading: ${disc}% discipline`, color: disc >= 75 ? C.green : disc >= 50 ? C.gold : C.red } : null,
  ].filter(Boolean)

  return (
    <AIOSCard label="Daily Briefing">
      {rows.map((r, i) => (
        <div key={i} style={{ fontFamily: f.body, fontSize: 12, color: r.color, marginBottom: 4, lineHeight: 1.5 }}>{r.text}</div>
      ))}
    </AIOSCard>
  )
}

function PrioritiesCard({ data }) {
  const top3 = data.ventures.filter(v => v.status === 'active').slice(0, 3)
  return (
    <AIOSCard label="Top 3 Priorities">
      {top3.map((v, i) => (
        <div key={v.id} style={{ display: 'flex', gap: 8, marginBottom: 7 }}>
          <span style={{ fontFamily: f.mono, fontSize: 10, color: C.gold, minWidth: 14, paddingTop: 1 }}>{i + 1}.</span>
          <div>
            <div style={{ fontFamily: f.body, fontSize: 12, color: C.text }}>{v.name}</div>
            <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute }}>{v.kpi.label}: {v.kpi.value}</div>
          </div>
        </div>
      ))}
    </AIOSCard>
  )
}

function FollowUpsCard({ followUps, onAdd, onToggle }) {
  const [open, setOpen] = useState(false)
  const [contact, setContact] = useState('')
  const [about, setAbout] = useState('')
  const pending = followUps.filter(f => !f.done)
  const accent  = pending.length > 0 ? C.gold : C.green

  const handleAdd = () => {
    if (!contact.trim()) return
    onAdd({ id: `fu-${Date.now()}`, contact: contact.trim(), about: about.trim(), done: false })
    setContact('')
    setAbout('')
    setOpen(false)
  }

  return (
    <AIOSCard label="Follow-Ups Due" accent={accent}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontFamily: f.display, fontSize: 22, color: accent }}>{pending.length}</span>
        <button onClick={() => setOpen(p => !p)} style={miniBtn()}>{open ? '✕' : '+ Add'}</button>
      </div>
      {pending.slice(0, 2).map(fu => (
        <div key={fu.id} onClick={() => onToggle(fu.id)} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4, cursor: 'pointer' }}>
          <Square size={10} style={{ color: C.mute, flexShrink: 0 }} />
          <span style={{ fontFamily: f.body, fontSize: 11, color: C.sub }}>{fu.contact}{fu.about ? ` — ${fu.about}` : ''}</span>
        </div>
      ))}
      {pending.length > 2 && <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute }}>+{pending.length - 2} more</div>}
      {open && (
        <div style={{ marginTop: 10, display: 'grid', gap: 6 }}>
          <input value={contact} onChange={e => setContact(e.target.value)} placeholder="Contact name" style={inputStyle} />
          <input value={about} onChange={e => setAbout(e.target.value)} placeholder="About" style={inputStyle} onKeyDown={e => e.key === 'Enter' && handleAdd()} />
          <button onClick={handleAdd} style={{ background: `${C.gold}14`, border: `1px solid ${C.goldDim}`, borderRadius: 2, color: C.gold, cursor: 'pointer', padding: '5px', fontFamily: f.mono, fontSize: 10 }}>
            Save Follow-Up
          </button>
        </div>
      )}
    </AIOSCard>
  )
}

function ActiveDealsCard({ data }) {
  const deals = data.ventures.filter(v => v.status === 'active' && ['fund', 'note-os', 'mentorship'].includes(v.id))
  return (
    <AIOSCard label="Active Deals">
      <div style={{ fontFamily: f.display, fontSize: 22, color: C.text, marginBottom: 6 }}>{deals.length}</div>
      {deals.slice(0, 2).map(v => (
        <div key={v.id} style={{ fontFamily: f.body, fontSize: 11, color: C.sub, marginBottom: 3 }}>
          {v.name} · {v.kpi.value}
        </div>
      ))}
    </AIOSCard>
  )
}

function TasksCard({ tasks, onAdd, onToggle }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [due, setDue] = useState('')
  const mine   = tasks.filter(t => t.owner === 'kerry' && t.status !== 'done')
  const accent = mine.length > 3 ? C.red : mine.length > 0 ? C.gold : C.green

  const handleAdd = () => {
    if (!title.trim()) return
    onAdd({ id: `task-${Date.now()}`, title: title.trim(), owner: 'kerry', status: 'pending', due: due.trim() })
    setTitle('')
    setDue('')
    setOpen(false)
  }

  return (
    <AIOSCard label="Tasks · Waiting on You" accent={accent}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontFamily: f.display, fontSize: 22, color: accent }}>{mine.length}</span>
        <button onClick={() => setOpen(p => !p)} style={miniBtn()}>{open ? '✕' : '+ Add'}</button>
      </div>
      {mine.slice(0, 2).map(t => (
        <div key={t.id} onClick={() => onToggle(t.id)} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4, cursor: 'pointer' }}>
          <Square size={10} style={{ color: C.mute, flexShrink: 0 }} />
          <span style={{ fontFamily: f.body, fontSize: 11, color: C.sub }}>{t.title}{t.due ? ` · ${t.due}` : ''}</span>
        </div>
      ))}
      {mine.length > 2 && <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute }}>+{mine.length - 2} more</div>}
      {open && (
        <div style={{ marginTop: 10, display: 'grid', gap: 6 }}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Task title" style={inputStyle} />
          <input value={due} onChange={e => setDue(e.target.value)} placeholder="Due date (optional)" style={inputStyle} onKeyDown={e => e.key === 'Enter' && handleAdd()} />
          <button onClick={handleAdd} style={{ background: `${C.gold}14`, border: `1px solid ${C.goldDim}`, borderRadius: 2, color: C.gold, cursor: 'pointer', padding: '5px', fontFamily: f.mono, fontSize: 10 }}>
            Save Task
          </button>
        </div>
      )}
    </AIOSCard>
  )
}

function CashReserveCard({ cashReserve, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({ current: cashReserve.current, target: cashReserve.target })
  const pct    = cashReserve.target > 0 ? Math.min(100, Math.round((cashReserve.current / cashReserve.target) * 100)) : 0
  const accent = pct >= 75 ? C.green : pct >= 40 ? C.gold : C.red

  const save = () => {
    onUpdate({ ...cashReserve, current: parseFloat(draft.current) || 0, target: parseFloat(draft.target) || 5000 })
    setEditing(false)
  }

  return (
    <AIOSCard label="Cash Reserve" accent={accent}>
      {!editing ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <span style={{ fontFamily: f.display, fontSize: 22, color: accent }}>{pct}%</span>
            <button onClick={() => { setDraft({ current: cashReserve.current, target: cashReserve.target }); setEditing(true) }} style={miniBtn(C.mute)}>
              Edit
            </button>
          </div>
          <div style={{ height: 4, background: C.border, borderRadius: 2, marginBottom: 6 }}>
            <div style={{ height: '100%', width: `${pct}%`, background: accent, borderRadius: 2, transition: 'width 0.3s' }} />
          </div>
          <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute }}>
            ${cashReserve.current.toLocaleString()} / ${cashReserve.target.toLocaleString()}
          </div>
        </>
      ) : (
        <div style={{ display: 'grid', gap: 6 }}>
          <input value={draft.current} onChange={e => setDraft(p => ({ ...p, current: e.target.value }))} placeholder="Current $" style={inputStyle} />
          <input value={draft.target} onChange={e => setDraft(p => ({ ...p, target: e.target.value }))} placeholder="Target $" style={inputStyle} onKeyDown={e => e.key === 'Enter' && save()} />
          <button onClick={save} style={{ background: `${C.gold}14`, border: `1px solid ${C.goldDim}`, borderRadius: 2, color: C.gold, cursor: 'pointer', padding: '5px', fontFamily: f.mono, fontSize: 10 }}>
            Save
          </button>
        </div>
      )}
    </AIOSCard>
  )
}

function TradingDisciplineCard({ trading }) {
  const disc   = trading?.disciplineScore ?? null
  const breaks = trading ? getRuleBreaksThisWeek(trading.trades ?? []) : null
  const accent = disc === null ? C.border : disc >= 75 ? C.green : disc >= 50 ? C.gold : C.red

  return (
    <AIOSCard label="Trading Discipline" accent={accent}>
      {disc === null ? (
        <div style={{ fontFamily: f.body, fontSize: 11, color: C.mute }}>Log trades in Trading OS to see discipline score</div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
            <span style={{ fontFamily: f.display, fontSize: 26, color: accent }}>{disc}%</span>
            <TrendingUp size={12} style={{ color: accent }} />
          </div>
          <div style={{ fontFamily: f.body, fontSize: 11, color: C.sub, marginBottom: 4 }}>
            {breaks} rule break{breaks !== 1 ? 's' : ''} this week
          </div>
          <div style={{ fontFamily: f.mono, fontSize: 10, color: accent }}>
            {disc >= 75 ? '✓ On track' : disc >= 50 ? '⚠ Below target' : '⚠ Review required'}
          </div>
        </>
      )}
    </AIOSCard>
  )
}

function RiskAlertsCard({ data, trading }) {
  const alerts = buildRiskAlerts(data, trading)
  const accent = alerts.length > 0 ? C.red : C.green

  return (
    <AIOSCard label="Risk Alerts" accent={accent}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: alerts.length ? 8 : 0 }}>
        <span style={{ fontFamily: f.display, fontSize: 22, color: accent }}>{alerts.length}</span>
        {alerts.length === 0 && <span style={{ fontFamily: f.body, fontSize: 11, color: C.green }}>All clear</span>}
      </div>
      {alerts.slice(0, 3).map((a, i) => (
        <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 4, alignItems: 'flex-start' }}>
          <AlertTriangle size={10} style={{ color: C.red, flexShrink: 0, marginTop: 2 }} />
          <span style={{ fontFamily: f.body, fontSize: 11, color: C.sub, lineHeight: 1.4 }}>{a}</span>
        </div>
      ))}
      {alerts.length > 3 && <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute }}>+{alerts.length - 3} more</div>}
    </AIOSCard>
  )
}

// ─── Connectors Strip ─────────────────────────────────────────────────────────

const CONNECTORS = [
  { id: 'gmail',    label: 'Gmail',     Icon: Mail,          status: 'live' },
  { id: 'calendar', label: 'Calendar',  Icon: Calendar,      status: 'live' },
  { id: 'drive',    label: 'Drive',     Icon: HardDrive,     status: 'live' },
  { id: 'canva',    label: 'Canva',     Icon: Palette,       status: 'live' },
  { id: 'docusign', label: 'Docusign',  Icon: FileSignature, status: 'live' },
  { id: 'zapier',   label: 'Zapier',    Icon: Zap,           status: 'live' },
]

function ConnectorsStrip() {
  return (
    <div style={{
      borderTop: `1px solid ${C.border}`, padding: '10px 20px',
      display: 'flex', alignItems: 'center', gap: 20,
      background: `${C.gold}04`,
    }}>
      <span style={{ fontFamily: f.mono, fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.mute }}>
        Connectors
      </span>
      {CONNECTORS.map(({ id, label, Icon, status }) => (
        <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: status === 'live' ? C.green : C.mute }} />
          <Icon size={11} style={{ color: status === 'live' ? C.sub : C.mute }} />
          <span style={{ fontFamily: f.mono, fontSize: 9, color: status === 'live' ? C.sub : C.mute, letterSpacing: '0.06em' }}>
            {label}
          </span>
        </div>
      ))}
      <span style={{ marginLeft: 'auto', fontFamily: f.mono, fontSize: 9, color: C.mute }}>
        Claude Haiku 4.5 · Claude Code MCP
      </span>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AIOSAgent({ data, persist }) {
  const [trading]  = useState(() => { try { return loadTradingData() } catch { return null } })
  const [input, setInput]     = useState('')
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const aios = data.aios ?? { followUps: [], tasks: [], cashReserve: { current: 0, target: 5000, label: 'Operating Reserve' } }

  const updateAIOS     = (updated) => persist({ ...data, aios: updated })
  const addFollowUp    = (fu) => updateAIOS({ ...aios, followUps: [fu, ...aios.followUps] })
  const toggleFollowUp = (id) => updateAIOS({ ...aios, followUps: aios.followUps.map(f => f.id === id ? { ...f, done: !f.done } : f) })
  const addTask        = (t)  => updateAIOS({ ...aios, tasks: [t, ...aios.tasks] })
  const toggleTask     = (id) => updateAIOS({ ...aios, tasks: aios.tasks.map(t => t.id === id ? { ...t, status: t.status === 'done' ? 'pending' : 'done' } : t) })
  const updateCash     = (cr) => updateAIOS({ ...aios, cashReserve: cr })

  const handleSubmit = async () => {
    const q = input.trim()
    if (!q || loading) return
    setInput('')
    setError(null)
    setLoading(true)
    try {
      const text = await callClaude(q, data, trading)
      setResponse({ question: q, text })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, overflow: 'hidden' }}>

      {/* Header */}
      <div style={{
        padding: '14px 20px', borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', gap: 10, background: `${C.gold}08`,
      }}>
        <Brain size={14} style={{ color: C.gold }} />
        <span style={{ fontFamily: f.mono, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.gold }}>
          Standard Black AIOS · Super Agent
        </span>
        <span style={{ marginLeft: 'auto', fontFamily: f.mono, fontSize: 9, color: C.mute }}>
          Claude Haiku 4.5 · live context
        </span>
      </div>

      <div style={{ padding: 20 }}>

        {/* Chat Input */}
        <div style={{ display: 'flex', gap: 10, marginBottom: (response || error) ? 14 : 20 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            disabled={loading}
            placeholder="Ask the Standard Black AIOS anything — briefing, priorities, deals, trades, tasks, risks..."
            style={{
              flex: 1, background: '#1A1A1A', border: `1px solid ${C.border}`, borderRadius: 3,
              color: loading ? C.mute : C.text, fontFamily: f.body, fontSize: 13, padding: '10px 14px',
              outline: 'none', boxSizing: 'border-box', opacity: loading ? 0.7 : 1,
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              background: `${C.gold}14`, border: `1px solid ${C.goldDim}`, borderRadius: 3,
              color: loading ? C.mute : C.gold, cursor: loading ? 'default' : 'pointer',
              padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: f.mono, fontSize: 11, whiteSpace: 'nowrap', opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? <Loader size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={12} />}
            {loading ? 'Thinking...' : 'Send'}
          </button>
        </div>

        {/* Response */}
        {response && !loading && (
          <div style={{
            marginBottom: 20, padding: '12px 16px',
            background: '#1A1A1A', border: `1px solid ${C.border}`, borderRadius: 3,
            borderLeft: `3px solid ${C.gold}`,
          }}>
            <div style={{ fontFamily: f.mono, fontSize: 9, color: C.mute, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
              {response.question}
            </div>
            <div style={{ fontFamily: f.body, fontSize: 13, color: C.sub, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {response.text}
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{
            marginBottom: 20, padding: '10px 14px',
            background: `${C.red}0A`, border: `1px solid ${C.red}40`, borderRadius: 3,
            borderLeft: `3px solid ${C.red}`,
          }}>
            <div style={{ fontFamily: f.mono, fontSize: 9, color: C.red, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
              Error
            </div>
            <div style={{ fontFamily: f.body, fontSize: 12, color: C.sub }}>{error}</div>
          </div>
        )}

        {/* 8-Card Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          <BriefingCard data={data} trading={trading} />
          <PrioritiesCard data={data} />
          <FollowUpsCard followUps={aios.followUps} onAdd={addFollowUp} onToggle={toggleFollowUp} />
          <ActiveDealsCard data={data} />
          <TasksCard tasks={aios.tasks} onAdd={addTask} onToggle={toggleTask} />
          <CashReserveCard cashReserve={aios.cashReserve} onUpdate={updateCash} />
          <TradingDisciplineCard trading={trading} />
          <RiskAlertsCard data={data} trading={trading} />
        </div>
      </div>

      {/* Connectors */}
      <ConnectorsStrip />

      <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
