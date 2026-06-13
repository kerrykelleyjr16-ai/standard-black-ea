import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@wholesale/lib/supabase'
import type { Lead, LeadStage, Conversation } from '@wholesale/lib/types'
import { isContactable } from '@wholesale/lib/compliance'
import { C, f } from '../../tokens.js'
import DesktopShell from '@wholesale/components/ui/DesktopShell'
import PageHeader from '@wholesale/components/ui/PageHeader'
import DetailPanel from '@wholesale/components/ui/DetailPanel'
import StatusBadge from '@wholesale/components/ui/StatusBadge'
import TagBadge from '@wholesale/components/ui/TagBadge'
import { PrimaryButton, SecondaryButton } from '@wholesale/components/ui/ActionBar'
import { inputBase, microLabel } from '@wholesale/components/ui/styles'

const STAGES: LeadStage[] = [
  'New', 'Skip Traced', 'Contacted', 'Responded',
  'Qualified', 'Analyzed', 'Matched', 'Offer Made',
  'Under Contract', 'Assigned', 'Closed',
]

const SENTIMENT_COLORS: Record<string, string> = {
  positive: C.success,
  neutral: C.gold,
  negative: C.danger,
}

const innerWrap: React.CSSProperties = { maxWidth: 768, margin: '0 auto' }

interface InboundScore {
  score: number
  sentiment: 'positive' | 'neutral' | 'negative'
  qualifying_questions: string[]
  summary: string
  optedOut: boolean
}

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  // Conversations + opt-out state
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [contactable, setContactable] = useState(true)

  // Stage update
  const [updatingStage, setUpdatingStage] = useState(false)

  // Outreach
  const [channel, setChannel] = useState<'sms' | 'email'>('sms')
  const [drafting, setDrafting] = useState(false)
  const [draft, setDraft] = useState('')
  const [draftSubject, setDraftSubject] = useState('')
  const [draftError, setDraftError] = useState('')
  const [sending, setSending] = useState(false)
  const [sendSuccess, setSendSuccess] = useState(false)
  const [sendError, setSendError] = useState('')

  // Inbound scoring
  const [replyText, setReplyText] = useState('')
  const [scoring, setScoring] = useState(false)
  const [scoreResult, setScoreResult] = useState<InboundScore | null>(null)
  const [scoreError, setScoreError] = useState('')

  const loadConversations = useCallback(async () => {
    if (!id) return
    const { data } = await supabase
      .from('conversations')
      .select('*')
      .eq('lead_id', id)
      .order('created_at', { ascending: false })
    const convos = (data ?? []) as Conversation[]
    setConversations(convos)
    setContactable(isContactable(convos))
  }, [id])

  useEffect(() => {
    if (!id) return
    Promise.all([
      supabase.from('leads').select('*').eq('id', id).single(),
    ]).then(([leadRes]) => {
      if (leadRes.error || !leadRes.data) setNotFound(true)
      else setLead(leadRes.data as Lead)
      setLoading(false)
    })
    loadConversations()
  }, [id, loadConversations])

  const handleStageChange = useCallback(async (stage: LeadStage) => {
    if (!lead || !id) return
    setUpdatingStage(true)
    const { data, error } = await supabase.from('leads').update({ stage }).eq('id', id).select().single()
    if (!error && data) setLead(data as Lead)
    setUpdatingStage(false)
  }, [lead, id])

  const handleDraftOutreach = useCallback(async () => {
    if (!id) return
    setDrafting(true)
    setDraftError('')
    setDraft('')
    setDraftSubject('')
    try {
      const { data, error } = await supabase.functions.invoke('draft-outreach', {
        body: { leadId: id, channel },
      })
      if (error) throw error
      setDraft(data.draft ?? '')
      setDraftSubject(data.subject ?? '')
    } catch (err) {
      setDraftError(err instanceof Error ? err.message : 'Failed to draft outreach')
    } finally {
      setDrafting(false)
    }
  }, [id, channel])

  const handleSend = useCallback(async () => {
    if (!id || !draft) return
    setSending(true)
    setSendError('')
    try {
      const { error } = await supabase.functions.invoke('send-message', {
        body: { leadId: id, body: draft, channel, aiGenerated: true },
      })
      if (error) throw error
      setSendSuccess(true)
      setDraft('')
      setTimeout(() => setSendSuccess(false), 3000)
    } catch (err) {
      setSendError(err instanceof Error ? err.message : 'Failed to send')
    } finally {
      setSending(false)
    }
  }, [id, draft, channel])

  const handleScoreReply = useCallback(async () => {
    if (!id || !replyText.trim()) return
    setScoring(true)
    setScoreError('')
    setScoreResult(null)
    try {
      const { data, error } = await supabase.functions.invoke('score-inbound', {
        body: { leadId: id, message: replyText.trim() },
      })
      if (error) throw error
      const result = data as InboundScore
      setScoreResult(result)
      if (result.optedOut) {
        // Reload conversations so opt-out banner appears immediately
        await loadConversations()
      } else {
        await loadConversations()
        setReplyText('')
      }
    } catch (err) {
      setScoreError(err instanceof Error ? err.message : 'Failed to score reply')
    } finally {
      setScoring(false)
    }
  }, [id, replyText, loadConversations])

  if (loading) return (
    <DesktopShell>
      <p style={{ fontFamily: f.body, fontSize: 14, color: C.mute }}>Loading…</p>
    </DesktopShell>
  )
  if (notFound || !lead) return (
    <DesktopShell>
      <div style={innerWrap}>
        <p style={{ fontFamily: f.body, fontSize: 14, color: C.sub, marginBottom: 16 }}>Lead not found.</p>
        <SecondaryButton label="Back to Leads" onClick={() => navigate('/wholesale/leads')} />
      </div>
    </DesktopShell>
  )

  return (
    <DesktopShell>
      <div style={innerWrap}>
        {/* Back */}
        <button
          onClick={() => navigate('/wholesale/leads')}
          style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontFamily: f.mono, fontSize: 12, color: C.mute }}
        >
          ← All Leads
        </button>

        {/* Opt-out banner */}
        {!contactable && (
          <div style={{
            marginBottom: 20, padding: '12px 16px', borderRadius: 12,
            background: 'rgba(248,113,113,0.08)', border: `1px solid ${C.danger}`,
            fontFamily: f.body, fontSize: 14, color: C.danger,
          }}>
            Opted out — do not contact. This seller has replied with a stop keyword and must be removed from all outreach.
          </div>
        )}

        {/* Header */}
        <PageHeader
          eyebrow="Lead"
          title={lead.address}
          subtitle={`${lead.city}, ${lead.state} ${lead.zip}${lead.owner_name ? ` · Owner: ${lead.owner_name}` : ''}`}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <StatusBadge label={lead.stage} color={C.gold} />
            {lead.motivation_signals?.map(s => (
              <TagBadge key={s} label={s.replace(/_/g, ' ')} />
            ))}
          </div>
        </PageHeader>

        <div style={{ marginTop: 20, display: 'grid', gap: 20 }}>
          {/* Stage Selector */}
          <DetailPanel title="Pipeline Stage">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {STAGES.map(stage => {
                const active = lead.stage === stage
                return (
                  <button
                    key={stage}
                    onClick={() => handleStageChange(stage)}
                    disabled={updatingStage}
                    style={{
                      padding: '6px 12px', borderRadius: 999, fontFamily: f.mono, fontSize: 12,
                      background: active ? 'rgba(201,162,74,0.12)' : 'transparent',
                      border: `1px solid ${active ? C.gold : C.border}`,
                      color: active ? C.gold : C.mute,
                      cursor: updatingStage ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {stage}
                  </button>
                )
              })}
            </div>
          </DetailPanel>

          {/* Quick stage advance: Responded → Qualified */}
          {(lead.stage === 'Responded') && (
            <DetailPanel title="Advance Stage">
              <p style={{ fontFamily: f.body, fontSize: 13, color: C.sub, marginBottom: 12 }}>
                Seller has responded. Mark as Qualified once you have confirmed motivation and basic criteria.
              </p>
              <PrimaryButton
                label={updatingStage ? 'Updating…' : 'Mark Qualified →'}
                onClick={() => handleStageChange('Qualified')}
                disabled={updatingStage}
              />
            </DetailPanel>
          )}

          {/* Property Details */}
          <DetailPanel title="Property Details">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16 }}>
              {lead.property_type && <div><p style={microLabel}>Type</p><p style={{ marginTop: 4, fontFamily: f.body, fontSize: 14, color: C.text }}>{lead.property_type}</p></div>}
              {lead.beds != null && <div><p style={microLabel}>Beds</p><p style={{ marginTop: 4, fontFamily: f.body, fontSize: 14, color: C.text }}>{lead.beds}</p></div>}
              {lead.baths != null && <div><p style={microLabel}>Baths</p><p style={{ marginTop: 4, fontFamily: f.body, fontSize: 14, color: C.text }}>{lead.baths}</p></div>}
              {lead.sqft != null && <div><p style={microLabel}>Sqft</p><p style={{ marginTop: 4, fontFamily: f.body, fontSize: 14, color: C.text }}>{lead.sqft.toLocaleString()}</p></div>}
              {lead.year_built != null && <div><p style={microLabel}>Year Built</p><p style={{ marginTop: 4, fontFamily: f.body, fontSize: 14, color: C.text }}>{lead.year_built}</p></div>}
              {lead.owner_phone && <div><p style={microLabel}>Phone</p><p style={{ marginTop: 4, fontFamily: f.body, fontSize: 14, color: C.text }}>{lead.owner_phone}</p></div>}
            </div>
          </DetailPanel>

          {/* Log Seller Reply + Score */}
          <DetailPanel title="Log Seller Reply">
            <textarea
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Paste or type the seller's reply..."
              style={{ ...inputBase, minHeight: 80, resize: 'vertical', marginBottom: 12 }}
            />
            <PrimaryButton
              label={scoring ? 'Scoring…' : 'Score Reply'}
              onClick={handleScoreReply}
              disabled={scoring || !replyText.trim()}
            />

            {scoreError && (
              <p style={{ marginTop: 8, fontFamily: f.mono, fontSize: 12, color: C.danger }}>{scoreError}</p>
            )}

            {/* Score results */}
            {scoreResult && !scoreResult.optedOut && (
              <div style={{ marginTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 16 }}>
                  <span style={{
                    fontFamily: f.display, fontSize: 48, fontWeight: 700, lineHeight: 1,
                    color: scoreResult.score >= 60 ? C.success : scoreResult.score >= 35 ? C.gold : C.danger,
                  }}>
                    {scoreResult.score}
                  </span>
                  <span style={{ marginBottom: 8, fontFamily: f.body, fontSize: 14, color: C.mute }}>/ 100 motivation score</span>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <p style={microLabel}>Sentiment</p>
                  <span style={{ marginTop: 4, display: 'inline-block', fontFamily: f.mono, fontSize: 14, textTransform: 'capitalize', color: SENTIMENT_COLORS[scoreResult.sentiment] ?? C.sub }}>
                    {scoreResult.sentiment}
                  </span>
                </div>

                {scoreResult.summary && (
                  <div style={{ marginBottom: 16 }}>
                    <p style={microLabel}>AI Summary</p>
                    <p style={{ marginTop: 4, fontFamily: f.body, fontSize: 14, color: C.sub }}>{scoreResult.summary}</p>
                  </div>
                )}

                {scoreResult.qualifying_questions.length > 0 && (
                  <div>
                    <p style={{ ...microLabel, marginBottom: 8 }}>Suggested Follow-Up Questions</p>
                    <ol style={{ display: 'grid', gap: 8, listStyle: 'none', padding: 0, margin: 0 }}>
                      {scoreResult.qualifying_questions.map((q, i) => (
                        <li key={i} style={{ display: 'flex', gap: 8, fontFamily: f.body, fontSize: 14, color: C.sub }}>
                          <span style={{ color: C.gold, minWidth: 16 }}>{i + 1}.</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}

            {/* Opt-out result from scoring */}
            {scoreResult?.optedOut && (
              <div style={{
                marginTop: 16, padding: '12px 16px', borderRadius: 12,
                background: 'rgba(248,113,113,0.08)', border: `1px solid ${C.danger}`,
                fontFamily: f.body, fontSize: 14, color: C.danger,
              }}>
                STOP keyword detected — this seller has opted out. All contact actions are now suppressed.
              </div>
            )}
          </DetailPanel>

          {/* Outreach — hidden when opted out */}
          {contactable && (
            <DetailPanel title="AI Outreach">
              {/* Channel selector */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                {(['sms', 'email'] as const).map(ch => {
                  const active = channel === ch
                  return (
                    <button
                      key={ch}
                      onClick={() => { setChannel(ch); setDraft(''); setDraftSubject('') }}
                      style={{
                        padding: '6px 12px', borderRadius: 999, fontFamily: f.mono, fontSize: 12,
                        textTransform: 'uppercase',
                        background: active ? 'rgba(201,162,74,0.12)' : 'transparent',
                        border: `1px solid ${active ? C.gold : C.border}`,
                        color: active ? C.gold : C.mute, cursor: 'pointer',
                      }}
                    >
                      {ch.toUpperCase()}
                    </button>
                  )
                })}
              </div>

              <SecondaryButton
                label={drafting ? 'Drafting…' : `Draft ${channel.toUpperCase()} with AI`}
                onClick={handleDraftOutreach}
                disabled={drafting}
              />

              {draftError && <p style={{ marginTop: 8, fontFamily: f.mono, fontSize: 12, color: C.danger }}>{draftError}</p>}

              {draft && (
                <div style={{ marginTop: 16 }}>
                  {draftSubject && (
                    <div style={{ marginBottom: 8 }}>
                      <p style={microLabel}>Subject</p>
                      <p style={{ marginTop: 4, fontFamily: f.body, fontSize: 14, color: C.text }}>{draftSubject}</p>
                    </div>
                  )}
                  <p style={{ ...microLabel, marginBottom: 8 }}>Message</p>
                  <textarea
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    style={{ ...inputBase, minHeight: 100, resize: 'vertical' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                    <PrimaryButton
                      label={sending ? 'Sending…' : sendSuccess ? 'Sent ✓' : `Send ${channel.toUpperCase()}`}
                      onClick={handleSend}
                      disabled={sending || !draft}
                    />
                    {sendError && <p style={{ fontFamily: f.mono, fontSize: 12, color: C.danger }}>{sendError}</p>}
                  </div>
                </div>
              )}
            </DetailPanel>
          )}
        </div>
      </div>
    </DesktopShell>
  )
}
