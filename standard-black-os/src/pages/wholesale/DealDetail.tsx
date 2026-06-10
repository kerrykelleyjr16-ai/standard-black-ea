import { useEffect, useState, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '@wholesale/lib/supabase'
import { calculateMAO, formatCurrency, formatPercent } from '@wholesale/lib/mao'
import { scoreAllBuyersForDeal } from '@wholesale/lib/matching'
import { isMaoApproved } from '@wholesale/lib/gates'
import { createTask } from '@wholesale/lib/tasks'
import Badge from '@wholesale/components/ui/Badge'
import Button from '@wholesale/components/ui/Button'
import Card from '@wholesale/components/ui/Card'
import type { Deal, Lead, Buyer, BuyerMatchScore, RepairLevel } from '@wholesale/lib/types'
import WholesaleNav from '@wholesale/components/WholesaleNav'

type DealWithLead = Deal & {
  leads: Lead | null
}

const repairBadgeColor: Record<RepairLevel, 'green' | 'yellow' | 'red'> = {
  light: 'green',
  moderate: 'yellow',
  heavy: 'red',
}

function scoreColor(score: number): string {
  if (score >= 70) return '#7fff7b'
  if (score >= 40) return '#ffff7b'
  return '#ff7b7b'
}

function parseCurrency(value: string): number | null {
  const cleaned = value.replace(/[^0-9.]/g, '')
  const num = parseFloat(cleaned)
  return isNaN(num) ? null : num
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
      <>
        <WholesaleNav />
        <div
          className="min-h-screen font-mono flex items-center justify-center"
          style={{ background: '#0a0a0a', color: '#666' }}
        >
          Loading deal...
        </div>
      </>
    )
  }

  if (error || !deal) {
    return (
      <>
        <WholesaleNav />
        <div
          className="min-h-screen font-mono flex items-center justify-center"
          style={{ background: '#0a0a0a', color: '#ff7b7b' }}
        >
          {error ?? 'Deal not found'}
        </div>
      </>
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

  const maoBorderColor =
    maoStatus === 'good' ? 'rgba(201,162,74,0.15)' : maoStatus === 'warn' ? '#2e2e1a' : '#2e1a1a'
  const maoValueColor =
    maoStatus === 'good' ? '#7fff7b' : maoStatus === 'warn' ? '#ffff7b' : '#ff7b7b'

  return (
    <>
      <WholesaleNav />
      <div
        className="min-h-screen font-mono"
        style={{ background: '#0a0a0a', color: '#e5e5e5' }}
      >
        <div className="max-w-3xl mx-auto px-4 py-6 md:px-6 md:py-10 pb-[90px] md:pb-10">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start gap-3 mb-2">
              {deal.repair_level && (
                <Badge
                  label={deal.repair_level}
                  color={repairBadgeColor[deal.repair_level]}
                />
              )}
              {lead?.stage && <Badge label={lead.stage} color="blue" />}
              {deal.mao_override != null && <Badge label="MAO Override Active" color="yellow" />}
            </div>
            <h1 className="text-2xl font-bold" style={{ color: '#e5e5e5' }}>
              {lead?.address ?? 'Unknown Address'}
            </h1>
            <p className="text-sm mt-1" style={{ color: '#666' }}>
              {lead?.city ? `${lead.city}, ` : ''}
              {lead?.state ?? ''} {lead?.zip ?? ''}
            </p>
            {lead?.id && (
              <Link
                to={`/wholesale/leads/${lead.id}`}
                className="text-xs mt-1 inline-block hover:underline"
                style={{ color: '#C9A24A' }}
              >
                View Lead →
              </Link>
            )}
          </div>

          {/* MAO Formula Panel */}
          <Card className="mb-5">
            <p className="text-xs mb-4" style={{ color: '#aaa' }}>
              MAO Formula (70% display margin)
            </p>
            <div
              className="rounded-lg p-4"
              style={{
                background: '#0a0a0a',
                border: `1px solid ${maoBorderColor}`,
              }}
            >
              <div className="grid grid-cols-5 gap-2 text-center text-sm">
                <div>
                  <p className="text-xs mb-1" style={{ color: '#666' }}>
                    ARV
                  </p>
                  <p style={{ color: '#e5e5e5' }}>{formatCurrency(arv)}</p>
                </div>
                <div>
                  <p className="text-xs mb-1" style={{ color: '#666' }}>
                    Margin
                  </p>
                  <p style={{ color: '#aaa' }}>× {formatPercent(margin)}</p>
                </div>
                <div>
                  <p className="text-xs mb-1" style={{ color: '#666' }}>
                    Repairs
                  </p>
                  <p style={{ color: '#e5e5e5' }}>− {formatCurrency(repairs)}</p>
                </div>
                <div>
                  <p className="text-xs mb-1" style={{ color: '#666' }}>
                    Fee
                  </p>
                  <p style={{ color: '#e5e5e5' }}>− {formatCurrency(fee)}</p>
                </div>
                <div>
                  <p className="text-xs mb-1" style={{ color: '#666' }}>
                    MAO
                  </p>
                  <p className="font-bold" style={{ color: maoValueColor }}>
                    = {formatCurrency(effectiveMao ?? calculateMAO(arv, margin, repairs, fee))}
                  </p>
                </div>
              </div>
            </div>
            {maoStatus === 'warn' && deal.offer_price != null && (
              <p className="text-xs mt-2" style={{ color: '#ffff7b' }}>
                Offer price is above MAO — confirm buyer absorption.
              </p>
            )}
            {maoStatus === 'over' && deal.offer_price != null && (
              <p className="text-xs mt-2" style={{ color: '#ff7b7b' }}>
                Offer price is more than 10% over MAO — deal is tight.
              </p>
            )}

            {/* MAO approval gate (W5) */}
            <div className="mt-4 flex items-center gap-3 flex-wrap">
              {isMaoApproved(deal) ? (
                <>
                  <Badge label="MAO Approved" color="green" />
                  <span className="text-xs" style={{ color: '#666' }}>
                    {new Date(deal.mao_approved_at!).toLocaleString()}
                  </span>
                </>
              ) : (
                <>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleApproveMao}
                    disabled={approvingMao || effectiveMao == null}
                  >
                    {approvingMao ? 'Approving...' : `Approve MAO ${effectiveMao != null ? formatCurrency(effectiveMao) : ''}`}
                  </Button>
                  <span className="text-xs" style={{ color: '#ffff7b' }}>
                    Approval required before an offer can be drafted
                  </span>
                </>
              )}
            </div>
          </Card>

          {/* MAO Override */}
          <Card className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium" style={{ color: '#e5e5e5' }}>
                MAO Override
              </p>
              {deal.mao_override == null && !showOverrideForm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOverrideForm(true)}
                >
                  <span style={{ color: '#ffff7b' }}>Override MAO</span>
                </Button>
              )}
            </div>

            {deal.mao_override != null ? (
              <div>
                <div
                  className="rounded px-3 py-2 mb-2 text-sm"
                  style={{ background: '#2e2e1a', border: '1px solid #3a3a1a' }}
                >
                  <span style={{ color: '#ffff7b' }}>
                    Override: {formatCurrency(deal.mao_override)}
                  </span>
                  <span className="ml-2" style={{ color: '#666' }}>
                    — {deal.mao_override_reason}
                  </span>
                </div>
                <Badge label="Override active" color="yellow" />
                <span className="ml-3 text-xs" style={{ color: '#666' }}>
                  {deal.mao_override_reason}
                </span>
                <div className="mt-3">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleRemoveOverride}
                    disabled={removingOverride}
                  >
                    {removingOverride ? 'Removing...' : 'Remove Override'}
                  </Button>
                </div>
              </div>
            ) : showOverrideForm ? (
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-xs mb-1" style={{ color: '#aaa' }}>
                    Override Amount
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="$95,000"
                    value={overrideAmount}
                    onChange={(e) => setOverrideAmount(e.target.value)}
                    className="w-full rounded px-3 py-2 text-sm font-mono"
                    style={{
                      background: '#0a0a0a',
                      border: '1px solid #333',
                      color: '#e5e5e5',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: '#aaa' }}>
                    Reason (required)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Buyer wants a specific spread, market conditions..."
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    className="w-full rounded px-3 py-2 text-sm font-mono"
                    style={{
                      background: '#0a0a0a',
                      border: '1px solid #333',
                      color: '#e5e5e5',
                      outline: 'none',
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveOverride}
                    disabled={!overrideReason.trim() || savingOverride}
                  >
                    {savingOverride ? 'Saving...' : 'Save Override'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowOverrideForm(false)
                      setOverrideAmount('')
                      setOverrideReason('')
                    }}
                  >
                    Cancel
                  </Button>
                </div>
                {!overrideReason.trim() && overrideAmount && (
                  <p className="text-xs" style={{ color: '#ff7b7b' }}>
                    Reason is required before saving an override.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs" style={{ color: '#555' }}>
                No override set. Formula MAO is active.
              </p>
            )}
          </Card>

          {/* Offer Price */}
          <Card className="mb-5">
            <p className="text-sm font-medium mb-3" style={{ color: '#e5e5e5' }}>
              Offer Price
            </p>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                inputMode="numeric"
                placeholder="$105,000"
                value={offerInput}
                onChange={(e) => setOfferInput(e.target.value)}
                className="flex-1 rounded px-3 py-2 text-sm font-mono"
                style={{
                  background: '#0a0a0a',
                  border: '1px solid #333',
                  color: '#e5e5e5',
                  outline: 'none',
                }}
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveOffer}
                disabled={savingOffer}
              >
                {savingOffer ? 'Saving...' : offerSaved ? 'Saved ✓' : 'Save'}
              </Button>
            </div>
            {deal.offer_price != null && effectiveMao != null && (
              <p
                className="text-xs mt-2"
                style={{
                  color:
                    deal.offer_price <= effectiveMao
                      ? '#7fff7b'
                      : deal.offer_price <= effectiveMao * 1.1
                      ? '#ffff7b'
                      : '#ff7b7b',
                }}
              >
                {deal.offer_price <= effectiveMao
                  ? `At or under MAO — ${formatCurrency(effectiveMao - deal.offer_price)} spread`
                  : `${formatCurrency(deal.offer_price - effectiveMao)} over MAO`}
              </p>
            )}
          </Card>

          {/* Run Matching */}
          <Card className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium" style={{ color: '#e5e5e5' }}>
                  Buyer Matching
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#666' }}>
                  {deal.matched_buyer_ids?.length > 0
                    ? `${deal.matched_buyer_ids.length} buyers matched previously`
                    : 'No matching run yet'}
                </p>
              </div>
              <Button
                variant="primary"
                onClick={handleMatchBuyers}
                disabled={matching}
              >
                {matching ? 'Matching...' : 'Match Buyers'}
              </Button>
            </div>

            {matchError && (
              <p className="text-xs mt-2" style={{ color: '#ff7b7b' }}>
                {matchError}
              </p>
            )}

            {/* Matched buyer scores */}
            {scores != null && scores.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-col gap-2">
                  {scores.map((s, idx) => {
                    const isHardPass = s.hard_pass

                    return (
                      <div
                        key={s.buyer.id}
                        className="rounded px-3 py-3"
                        style={{
                          background: '#0a0a0a',
                          border: `1px solid ${isHardPass ? '#222' : '#333'}`,
                          opacity: isHardPass ? 0.5 : 1,
                        }}
                      >
                        <div className="flex items-center justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs" style={{ color: '#555' }}>
                              #{idx + 1}
                            </span>
                            <Link
                              to={`/wholesale/buyers/${s.buyer.id}`}
                              className="text-sm font-medium hover:underline"
                              style={{ color: isHardPass ? '#555' : '#e5e5e5' }}
                            >
                              {s.buyer.name}
                            </Link>
                            {s.buyer.company && (
                              <span className="text-xs" style={{ color: '#555' }}>
                                {s.buyer.company}
                              </span>
                            )}
                            {s.buyer.strategy && (
                              <Badge
                                label={s.buyer.strategy}
                                color={
                                  s.buyer.strategy === 'flip'
                                    ? 'red'
                                    : s.buyer.strategy === 'rental'
                                    ? 'blue'
                                    : s.buyer.strategy === 'BRRRR'
                                    ? 'purple'
                                    : 'gray'
                                }
                              />
                            )}
                          </div>

                          {isHardPass ? (
                            <span className="text-xs" style={{ color: '#555' }}>
                              Outside buy box
                            </span>
                          ) : (
                            <span
                              className="text-sm font-bold tabular-nums"
                              style={{ color: scoreColor(s.score) }}
                            >
                              {s.score}
                            </span>
                          )}
                        </div>

                        {/* Score bar */}
                        {!isHardPass && (
                          <div
                            className="w-full rounded-full mb-2"
                            style={{ background: '#1a1a1a', height: '4px' }}
                          >
                            <div
                              className="rounded-full"
                              style={{
                                width: `${s.score}%`,
                                height: '4px',
                                background: scoreColor(s.score),
                              }}
                            />
                          </div>
                        )}

                        {/* Key reason */}
                        {s.reasons.length > 0 && (
                          <p className="text-xs" style={{ color: '#555' }}>
                            {isHardPass ? s.reasons[0] : s.reasons[1] ?? s.reasons[0]}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleGenerateSummary}
                    disabled={
                      generatingSummary ||
                      (scores == null && (deal.matched_buyer_ids?.length ?? 0) === 0)
                    }
                  >
                    {generatingSummary ? 'Generating...' : 'Generate Deal Summary'}
                  </Button>
                  {summaryError && (
                    <p className="text-xs mt-2" style={{ color: '#ff7b7b' }}>{summaryError}</p>
                  )}
                  {dealSummary && (
                    <div
                      className="mt-3 rounded-lg p-4"
                      style={{ background: '#0f0f0f', border: '1px solid #333' }}
                    >
                      <p
                        className="text-xs uppercase tracking-widest mb-2"
                        style={{ color: '#C9A24A' }}
                      >
                        Deal Brief
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: '#e5e5e5' }}>
                        {dealSummary}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {scores != null && scores.length === 0 && (
              <p className="text-xs mt-3" style={{ color: '#555' }}>
                No active buyers found in the database.
              </p>
            )}
          </Card>

        </div>
      </div>
    </>
  )
}
