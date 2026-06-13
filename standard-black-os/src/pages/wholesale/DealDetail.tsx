import { useEffect, useState, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '@wholesale/lib/supabase'
import { calculateMAO, formatCurrency, formatPercent } from '@wholesale/lib/mao'
import { scoreAllBuyersForDeal } from '@wholesale/lib/matching'
import { rankDispoBuyers } from '@wholesale/lib/dispo'
import { isMaoApproved, canDraftOffer, isOfferApproved } from '@wholesale/lib/gates'
import { createTask } from '@wholesale/lib/tasks'
import type { Deal, Lead, Buyer, BuyerMatchScore } from '@wholesale/lib/types'
import { C, f } from '../../tokens.js'
import DesktopShell from '@wholesale/components/ui/DesktopShell'
import PageHeader from '@wholesale/components/ui/PageHeader'
import DetailPanel from '@wholesale/components/ui/DetailPanel'
import Metric from '@wholesale/components/ui/Metric'
import StatusBadge from '@wholesale/components/ui/StatusBadge'
import TagBadge from '@wholesale/components/ui/TagBadge'
import { PrimaryButton, SecondaryButton } from '@wholesale/components/ui/ActionBar'
import { inputBase, microLabel } from '@wholesale/components/ui/styles'

type DealWithLead = Deal & {
  leads: Lead | null
}

const innerWrap: React.CSSProperties = { maxWidth: 768, margin: '0 auto' }

const repairColor: Record<string, string> = {
  light: C.success,
  moderate: C.warning,
  heavy: C.danger,
}

function scoreColor(score: number): string {
  if (score >= 70) return C.success
  if (score >= 40) return C.warning
  return C.danger
}

function strategyColor(strategy: string): string {
  if (strategy === 'flip') return C.danger
  if (strategy === 'rental') return C.blue
  if (strategy === 'BRRRR') return C.purple
  return C.sub
}

function parseCurrency(value: string): number | null {
  const cleaned = value.replace(/[^0-9.]/g, '')
  const num = parseFloat(cleaned)
  return isNaN(num) ? null : num
}

const codeBlock: React.CSSProperties = {
  borderRadius: 12, padding: 16, background: 'rgba(0,0,0,0.3)', border: `1px solid ${C.borderSoft}`,
}

export default function DealDetail() {
  const { id } = useParams<{ id: string }>()
  const [deal, setDeal] = useState<DealWithLead | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Offer price edit
  const [offerInput, setOfferInput] = useState('')
  const [savingOffer, setSavingOffer] = useState(false)
  const [offerSaved, setOfferSaved] = useState(false)

  // MAO override
  const [showOverrideForm, setShowOverrideForm] = useState(false)
  const [overrideAmount, setOverrideAmount] = useState('')
  const [overrideReason, setOverrideReason] = useState('')
  const [savingOverride, setSavingOverride] = useState(false)
  const [removingOverride, setRemovingOverride] = useState(false)

  // MAO approval gate
  const [approvingMao, setApprovingMao] = useState(false)

  // Matching
  const [matching, setMatching] = useState(false)
  const [scores, setScores] = useState<BuyerMatchScore[] | null>(null)
  const [matchError, setMatchError] = useState<string | null>(null)
  const [generatingSummary, setGeneratingSummary] = useState(false)
  const [dealSummary, setDealSummary] = useState<string | null>(null)
  const [summaryError, setSummaryError] = useState<string | null>(null)

  // Offer drafting (W7)
  const [draftingOffer, setDraftingOffer] = useState(false)
  const [draftedLetter, setDraftedLetter] = useState<string | null>(null)
  const [draftedPrice, setDraftedPrice] = useState<string>('')
  const [offerDraftError, setOfferDraftError] = useState<string | null>(null)
  const [approvingOffer, setApprovingOffer] = useState(false)

  // Disposition (W8)
  const [dispoRanked, setDispoRanked] = useState<BuyerMatchScore[] | null>(null)
  const [draftingDispo, setDraftingDispo] = useState(false)
  const [dispoBlast, setDispoBlast] = useState<string | null>(null)
  const [dispoError, setDispoError] = useState<string | null>(null)
  const [assigningBuyer, setAssigningBuyer] = useState<string | null>(null)

  // Surface a pending-MAO approval in the cockpit task queue (once per deal)
  const ensureMaoTask = useCallback(async (d: DealWithLead) => {
    if (d.mao == null || d.mao_approved_at != null) return
    const { data: existing } = await supabase
      .from('tasks')
      .select('id')
      .eq('deal_id', d.id)
      .eq('type', 'approve_mao')
      .eq('status', 'open')
      .limit(1)
    if (existing && existing.length > 0) return
    await createTask({
      type: 'approve_mao',
      deal_id: d.id,
      lead_id: d.lead_id,
      title: `Approve MAO — ${d.leads?.address ?? 'deal'}`,
      detail: `Effective MAO ${formatCurrency(d.mao_override ?? d.mao)}`,
    })
  }, [])

  // Ensure an approve_offer cockpit task exists (once per deal, when offer drafted but not approved)
  const ensureOfferTask = useCallback(async (d: DealWithLead) => {
    if (d.offer_approved_at != null) return
    const { data: existing } = await supabase
      .from('tasks')
      .select('id')
      .eq('deal_id', d.id)
      .eq('type', 'approve_offer')
      .eq('status', 'open')
      .limit(1)
    if (existing && existing.length > 0) return
    await createTask({
      type: 'approve_offer',
      deal_id: d.id,
      lead_id: d.lead_id,
      title: `Approve Offer — ${d.leads?.address ?? 'deal'}`,
      detail: `Review and approve the drafted offer before marking Offer Made`,
    })
  }, [])

  const fetchDeal = useCallback(async () => {
    if (!id) return
    const { data, error } = await supabase
      .from('deals')
      .select(`*, leads (*)`)
      .eq('id', id)
      .single()

    if (error) {
      setError(error.message)
    } else {
      const d = data as DealWithLead
      setDeal(d)
      setOfferInput(d.offer_price != null ? String(d.offer_price) : '')
      ensureMaoTask(d).catch(() => {})
    }
    setLoading(false)
  }, [id, ensureMaoTask])

  useEffect(() => {
    fetchDeal()
  }, [fetchDeal])

  // Save offer price
  const handleSaveOffer = useCallback(async () => {
    if (!deal) return
    setSavingOffer(true)
    const val = parseCurrency(offerInput)
    const { error } = await supabase
      .from('deals')
      .update({ offer_price: val })
      .eq('id', deal.id)

    if (!error) {
      setDeal((prev) => prev ? { ...prev, offer_price: val } : prev)
      setOfferSaved(true)
      setTimeout(() => setOfferSaved(false), 2000)
    }
    setSavingOffer(false)
  }, [deal, offerInput])

  // Approve MAO — the human judgment gate (W5)
  const handleApproveMao = useCallback(async () => {
    if (!deal) return
    setApprovingMao(true)
    const ts = new Date().toISOString()
    const { error } = await supabase
      .from('deals')
      .update({ mao_approved_at: ts })
      .eq('id', deal.id)

    if (!error) {
      setDeal((prev) => (prev ? { ...prev, mao_approved_at: ts } : prev))
      // Close out the open cockpit task for this approval
      await supabase
        .from('tasks')
        .update({ status: 'done' })
        .eq('deal_id', deal.id)
        .eq('type', 'approve_mao')
        .eq('status', 'open')
    }
    setApprovingMao(false)
  }, [deal])

  // Save MAO override
  const handleSaveOverride = useCallback(async () => {
    if (!deal || !overrideReason.trim()) return
    setSavingOverride(true)
    const val = parseCurrency(overrideAmount)
    const { error } = await supabase
      .from('deals')
      .update({ mao_override: val, mao_override_reason: overrideReason.trim() })
      .eq('id', deal.id)

    if (!error) {
      setDeal((prev) =>
        prev
          ? { ...prev, mao_override: val, mao_override_reason: overrideReason.trim() }
          : prev
      )
      setShowOverrideForm(false)
      setOverrideAmount('')
      setOverrideReason('')
    }
    setSavingOverride(false)
  }, [deal, overrideAmount, overrideReason])

  // Remove MAO override
  const handleRemoveOverride = useCallback(async () => {
    if (!deal) return
    setRemovingOverride(true)
    const { error } = await supabase
      .from('deals')
      .update({ mao_override: null, mao_override_reason: null })
      .eq('id', deal.id)

    if (!error) {
      setDeal((prev) =>
        prev ? { ...prev, mao_override: null, mao_override_reason: null } : prev
      )
    }
    setRemovingOverride(false)
  }, [deal])

  // Draft offer via edge function (W7)
  const handleDraftOffer = useCallback(async () => {
    if (!deal) return
    setDraftingOffer(true)
    setOfferDraftError(null)
    try {
      const { data, error } = await supabase.functions.invoke('draft-offer', {
        body: { dealId: deal.id },
      })
      if (error) throw error
      setDraftedLetter(data.letter ?? '')
      setDraftedPrice(data.offer_price != null ? String(data.offer_price) : '')
      // Surface an approve_offer task in the cockpit
      await ensureOfferTask(deal).catch(() => {})
    } catch (err) {
      setOfferDraftError(err instanceof Error ? err.message : 'Failed to draft offer')
    } finally {
      setDraftingOffer(false)
    }
  }, [deal, ensureOfferTask])

  // Approve offer and advance lead stage to 'Offer Made' (W7)
  const handleApproveOffer = useCallback(async () => {
    if (!deal) return
    setApprovingOffer(true)
    try {
      const priceVal = parseFloat(draftedPrice.replace(/[^0-9.]/g, ''))
      const offerPrice = isNaN(priceVal) ? null : priceVal
      const ts = new Date().toISOString()

      const { error: dealError } = await supabase
        .from('deals')
        .update({ offer_price: offerPrice, offer_approved_at: ts })
        .eq('id', deal.id)
      if (dealError) throw dealError

      const { error: leadError } = await supabase
        .from('leads')
        .update({ stage: 'Offer Made' })
        .eq('id', deal.lead_id)
      if (leadError) throw leadError

      // Close open approve_offer tasks for this deal
      await supabase
        .from('tasks')
        .update({ status: 'done' })
        .eq('deal_id', deal.id)
        .eq('type', 'approve_offer')
        .eq('status', 'open')

      setDeal((prev) =>
        prev
          ? {
              ...prev,
              offer_price: offerPrice,
              offer_approved_at: ts,
              leads: prev.leads ? { ...prev.leads, stage: 'Offer Made' } : prev.leads,
            }
          : prev
      )
    } catch (err) {
      setOfferDraftError(err instanceof Error ? err.message : 'Failed to approve offer')
    } finally {
      setApprovingOffer(false)
    }
  }, [deal, draftedPrice])

  // Load dispo ranked buyers (W8) — called lazily when section mounts
  const handleLoadDispoRanking = useCallback(async () => {
    if (!deal) return
    try {
      const { data: leadData } = await supabase.from('leads').select('*').eq('id', deal.lead_id).single()
      const { data: buyerData } = await supabase.from('buyers').select('*').eq('active', true)
      if (!leadData || !buyerData) return
      const ranked = rankDispoBuyers(buyerData as Buyer[], deal, leadData as Lead)
      setDispoRanked(ranked)
    } catch {
      // fail silently; user can retry
    }
  }, [deal])

  // Draft disposition blast via edge function (W8)
  const handleDraftDispo = useCallback(async () => {
    if (!deal) return
    setDraftingDispo(true)
    setDispoError(null)
    try {
      const { data, error } = await supabase.functions.invoke('draft-dispo', {
        body: { dealId: deal.id },
      })
      if (error) throw error
      setDispoBlast(data.blast ?? '')

      // Create contact_buyer tasks for top 3 ranked buyers (avoid duplicates)
      if (dispoRanked && dispoRanked.length > 0) {
        const top3 = dispoRanked.slice(0, 3)
        for (const match of top3) {
          const { data: existing } = await supabase
            .from('tasks')
            .select('id')
            .eq('deal_id', deal.id)
            .eq('type', 'contact_buyer')
            .eq('status', 'open')
            .eq('detail', match.buyer.id)
            .limit(1)
          if (existing && existing.length > 0) continue
          await createTask({
            type: 'contact_buyer',
            deal_id: deal.id,
            lead_id: deal.lead_id,
            title: `Contact buyer: ${match.buyer.name}`,
            detail: match.buyer.id,
          }).catch(() => {})
        }
      }
    } catch (err) {
      setDispoError(err instanceof Error ? err.message : 'Failed to draft dispo blast')
    } finally {
      setDraftingDispo(false)
    }
  }, [deal, dispoRanked])

  // Mark deal as Assigned to a specific buyer (W8)
  const handleMarkAssigned = useCallback(async (buyerId: string) => {
    if (!deal) return
    setAssigningBuyer(buyerId)
    try {
      const existingIds: string[] = deal.matched_buyer_ids ?? []
      const updatedIds = existingIds.includes(buyerId)
        ? existingIds
        : [...existingIds, buyerId]

      await supabase
        .from('deals')
        .update({ matched_buyer_ids: updatedIds })
        .eq('id', deal.id)

      await supabase
        .from('leads')
        .update({ stage: 'Assigned' })
        .eq('id', deal.lead_id)

      setDeal((prev) =>
        prev
          ? {
              ...prev,
              matched_buyer_ids: updatedIds,
              leads: prev.leads ? { ...prev.leads, stage: 'Assigned' } : prev.leads,
            }
          : prev
      )
    } catch {
      // fail silently
    } finally {
      setAssigningBuyer(null)
    }
  }, [deal])

  // Run matching — client-side using matching lib
  const handleMatchBuyers = useCallback(async () => {
    if (!deal) return
    setMatching(true)
    setMatchError(null)
    try {
      const { data: lead } = await supabase.from('leads').select('*').eq('id', deal.lead_id).single()
      const { data: buyers } = await supabase.from('buyers').select('*').eq('active', true)
      if (!lead || !buyers) throw new Error('Could not load lead or buyers')
      const matchScores = scoreAllBuyersForDeal(buyers as Buyer[], deal, lead as Lead)
      const matchedBuyerIds = matchScores.filter(s => !s.hard_pass && s.score > 0).map(s => s.buyer.id)
      await supabase.from('deals').update({ matched_buyer_ids: matchedBuyerIds }).eq('id', deal.id)
      setScores(matchScores)
      setDeal(prev => prev ? { ...prev, matched_buyer_ids: matchedBuyerIds } : prev)
    } catch (err) {
      setMatchError(err instanceof Error ? err.message : 'Matching failed')
    } finally {
      setMatching(false)
    }
  }, [deal])

  const handleGenerateSummary = useCallback(async () => {
    if (!deal) return
    setGeneratingSummary(true)
    setSummaryError(null)
    try {
      const { data, error } = await supabase.functions.invoke('deal-summary', {
        body: { dealId: deal.id },
      })
      if (error) throw error
      setDealSummary(data.summary)
    } catch (err) {
      setSummaryError(err instanceof Error ? err.message : 'Failed to generate summary')
    } finally {
      setGeneratingSummary(false)
    }
  }, [deal])

  if (loading) {
    return (
      <DesktopShell>
        <p style={{ fontFamily: f.body, fontSize: 14, color: C.mute }}>Loading deal…</p>
      </DesktopShell>
    )
  }

  if (error || !deal) {
    return (
      <DesktopShell>
        <p style={{ fontFamily: f.body, fontSize: 14, color: C.danger }}>{error ?? 'Deal not found'}</p>
      </DesktopShell>
    )
  }

  const lead = deal.leads
  const effectiveMao = deal.mao_override ?? deal.mao
  const arv = deal.arv ?? 0
  const margin = 0.7
  const repairs = deal.repair_estimate ?? 0
  const fee = deal.assignment_fee ?? 10000

  // MAO status for border color
  let maoStatus: 'good' | 'warn' | 'over' = 'good'
  if (deal.offer_price != null && effectiveMao != null) {
    const overage = (deal.offer_price - effectiveMao) / effectiveMao
    if (overage > 0.1) maoStatus = 'over'
    else if (overage > 0) maoStatus = 'warn'
  }

  const maoValueColor =
    maoStatus === 'good' ? C.success : maoStatus === 'warn' ? C.warning : C.danger

  return (
    <DesktopShell>
      <div style={innerWrap}>
        {/* Header */}
        <PageHeader
          eyebrow="Deal"
          title={lead?.address ?? 'Unknown Address'}
          subtitle={`${lead?.city ? `${lead.city}, ` : ''}${lead?.state ?? ''} ${lead?.zip ?? ''}`.trim()}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            {deal.repair_level && <StatusBadge label={deal.repair_level} color={repairColor[deal.repair_level]} />}
            {lead?.stage && <StatusBadge label={lead.stage} color={C.blue} />}
            {deal.mao_override != null && <StatusBadge label="MAO Override Active" color={C.warning} />}
            {lead?.id && (
              <Link to={`/wholesale/leads/${lead.id}`} style={{ fontFamily: f.mono, fontSize: 11, color: C.gold }}>
                View Lead →
              </Link>
            )}
          </div>
        </PageHeader>

        <div style={{ marginTop: 20, display: 'grid', gap: 20 }}>
          {/* MAO Formula Panel */}
          <DetailPanel title="MAO Formula">
            <p style={{ marginBottom: 12, fontFamily: f.body, fontSize: 13, color: C.sub }}>70% display margin</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(96px, 1fr))', gap: 12 }}>
              <Metric label="ARV" value={formatCurrency(arv)} />
              <Metric label="Margin" value={`× ${formatPercent(margin)}`} />
              <Metric label="Repairs" value={`− ${formatCurrency(repairs)}`} />
              <Metric label="Fee" value={`− ${formatCurrency(fee)}`} />
              <Metric label="MAO" value={<span style={{ color: maoValueColor, fontWeight: 700 }}>= {formatCurrency(effectiveMao ?? calculateMAO(arv, margin, repairs, fee))}</span>} />
            </div>
            {maoStatus === 'warn' && deal.offer_price != null && (
              <p style={{ marginTop: 12, fontFamily: f.mono, fontSize: 12, color: C.warning }}>
                Offer price is above MAO — confirm buyer absorption.
              </p>
            )}
            {maoStatus === 'over' && deal.offer_price != null && (
              <p style={{ marginTop: 12, fontFamily: f.mono, fontSize: 12, color: C.danger }}>
                Offer price is more than 10% over MAO — deal is tight.
              </p>
            )}

            {/* MAO approval gate (W5) */}
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              {isMaoApproved(deal) ? (
                <>
                  <StatusBadge label="MAO Approved" color={C.success} />
                  <span style={{ fontFamily: f.mono, fontSize: 11, color: C.mute }}>
                    {new Date(deal.mao_approved_at!).toLocaleString()}
                  </span>
                </>
              ) : (
                <>
                  <PrimaryButton
                    label={approvingMao ? 'Approving…' : `Approve MAO ${effectiveMao != null ? formatCurrency(effectiveMao) : ''}`}
                    onClick={handleApproveMao}
                    disabled={approvingMao || effectiveMao == null}
                  />
                  <span style={{ fontFamily: f.mono, fontSize: 11, color: C.warning }}>
                    Approval required before an offer can be drafted
                  </span>
                </>
              )}
            </div>
          </DetailPanel>

          {/* MAO Override */}
          <DetailPanel
            title="MAO Override"
            action={deal.mao_override == null && !showOverrideForm ? (
              <SecondaryButton label="Override MAO" onClick={() => setShowOverrideForm(true)} />
            ) : undefined}
          >
            {deal.mao_override != null ? (
              <div>
                <div style={{ borderRadius: 12, padding: '10px 12px', marginBottom: 8, background: 'rgba(250,204,21,0.08)', border: `1px solid rgba(250,204,21,0.25)` }}>
                  <span style={{ fontFamily: f.body, fontSize: 14, color: C.warning }}>Override: {formatCurrency(deal.mao_override)}</span>
                  <span style={{ marginLeft: 8, fontFamily: f.body, fontSize: 13, color: C.mute }}>— {deal.mao_override_reason}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <StatusBadge label="Override active" color={C.warning} />
                  <span style={{ fontFamily: f.body, fontSize: 12, color: C.mute }}>{deal.mao_override_reason}</span>
                </div>
                <div style={{ marginTop: 12 }}>
                  <SecondaryButton label={removingOverride ? 'Removing…' : 'Remove Override'} onClick={handleRemoveOverride} disabled={removingOverride} />
                </div>
              </div>
            ) : showOverrideForm ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ ...microLabel, display: 'block', marginBottom: 6 }}>Override Amount</label>
                  <input type="text" inputMode="numeric" placeholder="$95,000" value={overrideAmount} onChange={(e) => setOverrideAmount(e.target.value)} style={inputBase} />
                </div>
                <div>
                  <label style={{ ...microLabel, display: 'block', marginBottom: 6 }}>Reason (required)</label>
                  <input type="text" placeholder="e.g. Buyer wants a specific spread, market conditions..." value={overrideReason} onChange={(e) => setOverrideReason(e.target.value)} style={inputBase} />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <PrimaryButton label={savingOverride ? 'Saving…' : 'Save Override'} onClick={handleSaveOverride} disabled={!overrideReason.trim() || savingOverride} />
                  <SecondaryButton label="Cancel" onClick={() => { setShowOverrideForm(false); setOverrideAmount(''); setOverrideReason('') }} />
                </div>
                {!overrideReason.trim() && overrideAmount && (
                  <p style={{ fontFamily: f.mono, fontSize: 12, color: C.danger }}>Reason is required before saving an override.</p>
                )}
              </div>
            ) : (
              <p style={{ fontFamily: f.body, fontSize: 13, color: C.mute }}>No override set. Formula MAO is active.</p>
            )}
          </DetailPanel>

          {/* Offer Price */}
          <DetailPanel title="Offer Price">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="text" inputMode="numeric" placeholder="$105,000" value={offerInput} onChange={(e) => setOfferInput(e.target.value)} style={{ ...inputBase, flex: 1 }} />
              <PrimaryButton label={savingOffer ? 'Saving…' : offerSaved ? 'Saved ✓' : 'Save'} onClick={handleSaveOffer} disabled={savingOffer} />
            </div>
            {deal.offer_price != null && effectiveMao != null && (
              <p style={{
                marginTop: 12, fontFamily: f.mono, fontSize: 12,
                color: deal.offer_price <= effectiveMao ? C.success : deal.offer_price <= effectiveMao * 1.1 ? C.warning : C.danger,
              }}>
                {deal.offer_price <= effectiveMao
                  ? `At or under MAO — ${formatCurrency(effectiveMao - deal.offer_price)} spread`
                  : `${formatCurrency(deal.offer_price - effectiveMao)} over MAO`}
              </p>
            )}
          </DetailPanel>

          {/* Offer Drafting (W7) — only visible when MAO approved */}
          {canDraftOffer(deal) && (
            <DetailPanel
              title="Offer Draft"
              action={isOfferApproved(deal) ? (
                <span style={{ fontFamily: f.mono, fontSize: 11, color: C.mute }}>{new Date(deal.offer_approved_at!).toLocaleString()}</span>
              ) : (
                <PrimaryButton label={draftingOffer ? 'Drafting…' : 'Draft Offer'} onClick={handleDraftOffer} disabled={draftingOffer} />
              )}
            >
              {isOfferApproved(deal) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                  <StatusBadge label="Offer Approved" color={C.success} />
                  <span style={{ fontFamily: f.body, fontSize: 12, color: C.success }}>Lead marked Offer Made</span>
                </div>
              )}

              {offerDraftError && (
                <p style={{ marginBottom: 12, fontFamily: f.mono, fontSize: 12, color: C.danger }}>{offerDraftError}</p>
              )}

              {draftedLetter && !isOfferApproved(deal) && (
                <div>
                  <div style={{ ...codeBlock, marginBottom: 16 }}>
                    <p style={{ ...microLabel, color: C.gold, marginBottom: 8 }}>Drafted Offer Letter</p>
                    <pre style={{ margin: 0, fontFamily: f.mono, fontSize: 12, lineHeight: 1.6, whiteSpace: 'pre-wrap', color: C.text }}>{draftedLetter}</pre>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ ...microLabel, display: 'block', marginBottom: 6 }}>Offer Price (editable)</label>
                    <input type="text" inputMode="numeric" value={draftedPrice} onChange={(e) => setDraftedPrice(e.target.value)} style={inputBase} />
                  </div>
                  <PrimaryButton label={approvingOffer ? 'Approving…' : 'Approve & Mark Offer Made'} onClick={handleApproveOffer} disabled={approvingOffer} />
                </div>
              )}
            </DetailPanel>
          )}

          {/* Disposition (W8) — visible when Offer Approved or Under Contract */}
          {(isOfferApproved(deal) || deal.leads?.stage === 'Under Contract') && (
            <DetailPanel
              title="Disposition"
              action={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {dispoRanked == null && <SecondaryButton label="Load Rankings" onClick={handleLoadDispoRanking} />}
                  <PrimaryButton label={draftingDispo ? 'Drafting…' : 'Draft Dispo Blast'} onClick={handleDraftDispo} disabled={draftingDispo} />
                </div>
              }
            >
              <p style={{ marginBottom: 12, fontFamily: f.body, fontSize: 13, color: C.sub }}>Rank buyers and draft a blast to your cash buyer list</p>

              {dispoError && <p style={{ marginBottom: 12, fontFamily: f.mono, fontSize: 12, color: C.danger }}>{dispoError}</p>}

              {dispoBlast && (
                <div style={{ ...codeBlock, marginBottom: 16 }}>
                  <p style={{ ...microLabel, color: C.gold, marginBottom: 8 }}>Disposition Blast</p>
                  <p style={{ fontFamily: f.body, fontSize: 14, lineHeight: 1.6, color: C.text }}>{dispoBlast}</p>
                </div>
              )}

              {dispoRanked != null && (
                <div>
                  <p style={{ ...microLabel, marginBottom: 8 }}>Ranked Buyers ({dispoRanked.length})</p>
                  {dispoRanked.length === 0 ? (
                    <p style={{ fontFamily: f.body, fontSize: 13, color: C.mute }}>No qualified buyers found. Add buyers to the database to run dispo.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {dispoRanked.map((m, idx) => (
                        <div key={m.buyer.id} style={{ ...codeBlock, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                            <span style={{ fontFamily: f.mono, fontSize: 11, color: C.mute }}>#{idx + 1}</span>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: f.body, fontSize: 14, fontWeight: 500, color: C.text }}>{m.buyer.name}</span>
                            {m.buyer.company && <span style={{ fontFamily: f.body, fontSize: 12, color: C.mute }}>{m.buyer.company}</span>}
                            <span style={{ fontFamily: f.mono, fontSize: 14, fontWeight: 700, color: scoreColor(m.score) }}>{m.score}</span>
                          </div>
                          <SecondaryButton
                            label={deal.leads?.stage === 'Assigned' && deal.matched_buyer_ids?.includes(m.buyer.id) ? 'Assigned' : assigningBuyer === m.buyer.id ? 'Assigning…' : 'Mark Assigned'}
                            onClick={() => handleMarkAssigned(m.buyer.id)}
                            disabled={assigningBuyer === m.buyer.id || deal.leads?.stage === 'Assigned'}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </DetailPanel>
          )}

          {/* Run Matching */}
          <DetailPanel
            title="Buyer Matching"
            action={<PrimaryButton label={matching ? 'Matching…' : 'Match Buyers'} onClick={handleMatchBuyers} disabled={matching} />}
          >
            <p style={{ fontFamily: f.body, fontSize: 13, color: C.sub }}>
              {deal.matched_buyer_ids?.length > 0
                ? `${deal.matched_buyer_ids.length} buyers matched previously`
                : 'No matching run yet'}
            </p>

            {matchError && <p style={{ marginTop: 8, fontFamily: f.mono, fontSize: 12, color: C.danger }}>{matchError}</p>}

            {/* Matched buyer scores */}
            {scores != null && scores.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {scores.map((s, idx) => {
                    const isHardPass = s.hard_pass
                    return (
                      <div key={s.buyer.id} style={{ ...codeBlock, opacity: isHardPass ? 0.5 : 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flexWrap: 'wrap' }}>
                            <span style={{ fontFamily: f.mono, fontSize: 11, color: C.mute }}>#{idx + 1}</span>
                            <Link to={`/wholesale/buyers/${s.buyer.id}`} style={{ fontFamily: f.body, fontSize: 14, fontWeight: 500, color: isHardPass ? C.mute : C.text }}>{s.buyer.name}</Link>
                            {s.buyer.company && <span style={{ fontFamily: f.body, fontSize: 12, color: C.mute }}>{s.buyer.company}</span>}
                            {s.buyer.strategy && <TagBadge label={s.buyer.strategy} />}
                          </div>
                          {isHardPass ? (
                            <span style={{ fontFamily: f.mono, fontSize: 11, color: C.mute }}>Outside buy box</span>
                          ) : (
                            <span style={{ fontFamily: f.mono, fontSize: 14, fontWeight: 700, color: scoreColor(s.score) }}>{s.score}</span>
                          )}
                        </div>
                        {!isHardPass && (
                          <div style={{ width: '100%', height: 4, borderRadius: 999, marginBottom: 8, background: C.surface2 }}>
                            <div style={{ width: `${s.score}%`, height: 4, borderRadius: 999, background: scoreColor(s.score) }} />
                          </div>
                        )}
                        {s.reasons.length > 0 && (
                          <p style={{ fontFamily: f.body, fontSize: 12, color: C.mute }}>{isHardPass ? s.reasons[0] : s.reasons[1] ?? s.reasons[0]}</p>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div style={{ marginTop: 16 }}>
                  <SecondaryButton
                    label={generatingSummary ? 'Generating…' : 'Generate Deal Summary'}
                    onClick={handleGenerateSummary}
                    disabled={generatingSummary || (scores == null && (deal.matched_buyer_ids?.length ?? 0) === 0)}
                  />
                  {summaryError && <p style={{ marginTop: 8, fontFamily: f.mono, fontSize: 12, color: C.danger }}>{summaryError}</p>}
                  {dealSummary && (
                    <div style={{ ...codeBlock, marginTop: 12 }}>
                      <p style={{ ...microLabel, color: C.gold, marginBottom: 8 }}>Deal Brief</p>
                      <p style={{ fontFamily: f.body, fontSize: 14, lineHeight: 1.6, color: C.text }}>{dealSummary}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {scores != null && scores.length === 0 && (
              <p style={{ marginTop: 12, fontFamily: f.body, fontSize: 13, color: C.mute }}>No active buyers found in the database.</p>
            )}
          </DetailPanel>
        </div>
      </div>
    </DesktopShell>
  )
}
