import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@wholesale/lib/supabase'
import type { Lead, LeadStage } from '@wholesale/lib/types'
import WholesaleNav from '@wholesale/components/WholesaleNav'
import Button from '@wholesale/components/ui/Button'
import Badge from '@wholesale/components/ui/Badge'
import Card from '@wholesale/components/ui/Card'

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

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [lead, setLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

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

  useEffect(() => {
    if (!id) return
    supabase.from('leads').select('*').eq('id', id).single().then(({ data, error }) => {
      if (error || !data) setNotFound(true)
      else setLead(data as Lead)
      setLoading(false)
    })
  }, [id])

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

  if (loading) return (
    <><WholesaleNav /><div className="min-h-screen font-mono flex items-center justify-center" style={{ background: '#050505', color: '#666' }}>Loading...</div></>
  )
  if (notFound || !lead) return (
    <><WholesaleNav /><div className="p-8 font-mono" style={{ background: '#050505' }}><p className="text-sm mb-4" style={{ color: '#aaa' }}>Lead not found.</p><Button onClick={() => navigate('/wholesale/leads')} variant="ghost" size="sm">Back to Leads</Button></div></>
  )

  return (
    <>
      <WholesaleNav />
      <div className="min-h-screen font-mono" style={{ background: '#050505', color: '#F5F1E8' }}>
        <div className="max-w-3xl mx-auto px-4 py-6 md:px-6 md:py-8 pb-[90px] md:pb-8">

          {/* Back */}
          <button
            onClick={() => navigate('/wholesale/leads')}
            className="text-xs mb-6 flex items-center gap-1 hover:opacity-70 transition-opacity"
            style={{ color: '#666', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            ← All Leads
          </button>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-1" style={{ color: '#F5F1E8' }}>{lead.address}</h1>
            <p className="text-sm" style={{ color: '#666' }}>{lead.city}, {lead.state} {lead.zip}</p>
            {lead.owner_name && <p className="text-sm mt-1" style={{ color: '#aaa' }}>Owner: {lead.owner_name}</p>}
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge label={lead.stage} color="gold" />
              {lead.motivation_signals?.map(s => (
                <Badge key={s} label={s.replace(/_/g, ' ')} color={MOTIVATION_COLORS[s] ?? 'gray'} />
              ))}
            </div>
          </div>

          {/* Stage Selector */}
          <Card className="mb-5">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#555' }}>Pipeline Stage</p>
            <div className="flex flex-wrap gap-2">
              {STAGES.map(stage => (
                <button
                  key={stage}
                  onClick={() => handleStageChange(stage)}
                  disabled={updatingStage}
                  className="px-3 py-1 rounded text-xs font-mono transition-all"
                  style={{
                    background: lead.stage === stage ? 'rgba(201,162,74,0.12)' : 'transparent',
                    border: `1px solid ${lead.stage === stage ? '#C9A24A' : '#222'}`,
                    color: lead.stage === stage ? '#C9A24A' : '#666',
                    cursor: updatingStage ? 'not-allowed' : 'pointer',
                  }}
                >
                  {stage}
                </button>
              ))}
            </div>
          </Card>

          {/* Property Details */}
          <Card className="mb-5">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#555' }}>Property Details</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              {lead.property_type && <div><p className="text-xs mb-1" style={{ color: '#555' }}>Type</p><p style={{ color: '#F5F1E8' }}>{lead.property_type}</p></div>}
              {lead.beds != null && <div><p className="text-xs mb-1" style={{ color: '#555' }}>Beds</p><p style={{ color: '#F5F1E8' }}>{lead.beds}</p></div>}
              {lead.baths != null && <div><p className="text-xs mb-1" style={{ color: '#555' }}>Baths</p><p style={{ color: '#F5F1E8' }}>{lead.baths}</p></div>}
              {lead.sqft != null && <div><p className="text-xs mb-1" style={{ color: '#555' }}>Sqft</p><p style={{ color: '#F5F1E8' }}>{lead.sqft.toLocaleString()}</p></div>}
              {lead.year_built != null && <div><p className="text-xs mb-1" style={{ color: '#555' }}>Year Built</p><p style={{ color: '#F5F1E8' }}>{lead.year_built}</p></div>}
              {lead.owner_phone && <div><p className="text-xs mb-1" style={{ color: '#555' }}>Phone</p><p style={{ color: '#F5F1E8' }}>{lead.owner_phone}</p></div>}
            </div>
          </Card>

          {/* Outreach */}
          <Card>
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: '#555' }}>AI Outreach</p>

            {/* Channel selector */}
            <div className="flex gap-2 mb-4">
              {(['sms', 'email'] as const).map(ch => (
                <button
                  key={ch}
                  onClick={() => { setChannel(ch); setDraft(''); setDraftSubject('') }}
                  className="px-3 py-1 rounded text-xs font-mono transition-all"
                  style={{
                    background: channel === ch ? 'rgba(201,162,74,0.12)' : 'transparent',
                    border: `1px solid ${channel === ch ? '#C9A24A' : '#222'}`,
                    color: channel === ch ? '#C9A24A' : '#666',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                  }}
                >
                  {ch.toUpperCase()}
                </button>
              ))}
            </div>

            <Button onClick={handleDraftOutreach} disabled={drafting} variant="ghost" size="sm">
              {drafting ? 'Drafting...' : `Draft ${channel.toUpperCase()} with AI`}
            </Button>

            {draftError && <p className="text-xs mt-2" style={{ color: '#ff7b7b' }}>{draftError}</p>}

            {draft && (
              <div className="mt-4">
                {draftSubject && (
                  <div className="mb-2">
                    <p className="text-xs mb-1" style={{ color: '#555' }}>Subject</p>
                    <p className="text-sm" style={{ color: '#F5F1E8' }}>{draftSubject}</p>
                  </div>
                )}
                <p className="text-xs mb-2" style={{ color: '#555' }}>Message</p>
                <textarea
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  className="w-full rounded px-3 py-2 text-sm font-mono"
                  style={{ background: '#0a0a0a', border: '1px solid #333', color: '#F5F1E8', outline: 'none', resize: 'vertical', minHeight: 100 }}
                />
                <div className="flex items-center gap-2 mt-2">
                  <Button onClick={handleSend} disabled={sending || !draft} variant="primary" size="sm">
                    {sending ? 'Sending...' : sendSuccess ? 'Sent ✓' : `Send ${channel.toUpperCase()}`}
                  </Button>
                  {sendError && <p className="text-xs" style={{ color: '#ff7b7b' }}>{sendError}</p>}
                </div>
              </div>
            )}
          </Card>

        </div>
      </div>
    </>
  )
}
