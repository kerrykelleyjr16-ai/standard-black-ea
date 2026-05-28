import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@wholesale/lib/supabase'
import { calculateMAO, formatCurrency } from '@wholesale/lib/mao'
import Button from '@wholesale/components/ui/Button'
import Card from '@wholesale/components/ui/Card'
import type { Lead, RepairLevel } from '@wholesale/lib/types'
import WholesaleNav from '@wholesale/components/WholesaleNav'

const DISPLAY_MARGIN = 0.7

function parseCurrency(value: string): number | null {
  const cleaned = value.replace(/[^0-9.]/g, '')
  const num = parseFloat(cleaned)
  return isNaN(num) ? null : num
}

export default function NewDeal() {
  const navigate = useNavigate()
  const [leads, setLeads] = useState<Lead[]>([])
  const [leadsLoading, setLeadsLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Form state
  const [leadId, setLeadId] = useState('')
  const [arvInput, setArvInput] = useState('')
  const [repairLevel, setRepairLevel] = useState<RepairLevel | ''>('')
  const [repairEstimateInput, setRepairEstimateInput] = useState('')
  const [askingPriceInput, setAskingPriceInput] = useState('')
  const [assignmentFeeInput, setAssignmentFeeInput] = useState('10000')

  // Derived live MAO
  const arv = parseCurrency(arvInput) ?? 0
  const repairEstimate = parseCurrency(repairEstimateInput) ?? 0
  const assignmentFee = parseCurrency(assignmentFeeInput) ?? 10000

  const liveMao = arv > 0
    ? calculateMAO(arv, DISPLAY_MARGIN, repairEstimate, assignmentFee)
    : null

  useEffect(() => {
    async function fetchLeads() {
      const qualifiedStages = [
        'Qualified',
        'Analyzed',
        'Matched',
        'Offer Made',
        'Under Contract',
      ]
      const { data, error } = await supabase
        .from('leads')
        .select('id, address, city, state, zip, owner_name, stage')
        .in('stage', qualifiedStages)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setLeads(data as Lead[])
      }
      setLeadsLoading(false)
    }
    fetchLeads()
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!leadId) return

      setSubmitting(true)
      setSubmitError(null)

      const arvVal = parseCurrency(arvInput)
      const repairEstimateVal = parseCurrency(repairEstimateInput)
      const askingPriceVal = parseCurrency(askingPriceInput)
      const assignmentFeeVal = parseCurrency(assignmentFeeInput) ?? 10000

      const maoVal =
        arvVal != null
          ? calculateMAO(arvVal, DISPLAY_MARGIN, repairEstimateVal ?? 0, assignmentFeeVal)
          : null

      const { data, error } = await supabase
        .from('deals')
        .insert({
          lead_id: leadId,
          arv: arvVal,
          repair_level: repairLevel || null,
          repair_estimate: repairEstimateVal,
          asking_price: askingPriceVal,
          assignment_fee: assignmentFeeVal,
          mao: maoVal,
          offer_price: null,
          matched_buyer_ids: [],
          analyzed_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        setSubmitError(error.message)
        setSubmitting(false)
        return
      }

      navigate(`/wholesale/deals/${data.id}`)
    },
    [leadId, arvInput, repairLevel, repairEstimateInput, askingPriceInput, assignmentFeeInput, navigate]
  )

  const maoColor =
    liveMao == null
      ? '#666'
      : liveMao > 0
      ? '#7fff7b'
      : '#ff7b7b'

  return (
    <>
      <WholesaleNav />
      <div
        className="min-h-screen font-mono"
        style={{ background: '#0a0a0a', color: '#e5e5e5' }}
      >
        <div className="max-w-2xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#e5e5e5' }}>
              New Deal
            </h1>
            <p className="text-sm mt-1" style={{ color: '#666' }}>
              Run the numbers on a qualified lead.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5">
              {/* Lead selector */}
              <Card>
                <label className="block text-xs mb-2" style={{ color: '#aaa' }}>
                  Lead (Qualified or later)
                </label>
                {leadsLoading ? (
                  <p className="text-xs" style={{ color: '#666' }}>
                    Loading leads...
                  </p>
                ) : leads.length === 0 ? (
                  <p className="text-xs" style={{ color: '#ff7b7b' }}>
                    No qualified leads found. Qualify a lead first.
                  </p>
                ) : (
                  <select
                    required
                    value={leadId}
                    onChange={(e) => setLeadId(e.target.value)}
                    className="w-full rounded px-3 py-2 text-sm font-mono"
                    style={{
                      background: '#0a0a0a',
                      border: '1px solid #333',
                      color: '#e5e5e5',
                      outline: 'none',
                    }}
                  >
                    <option value="">— Select a lead —</option>
                    {leads.map((lead) => (
                      <option key={lead.id} value={lead.id}>
                        {lead.address}, {lead.city}
                        {lead.owner_name ? ` — ${lead.owner_name}` : ''}
                        {' '}[{lead.stage}]
                      </option>
                    ))}
                  </select>
                )}
              </Card>

              {/* ARV */}
              <Card>
                <label className="block text-xs mb-2" style={{ color: '#aaa' }}>
                  After Repair Value (ARV)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="$200,000"
                  value={arvInput}
                  onChange={(e) => setArvInput(e.target.value)}
                  className="w-full rounded px-3 py-2 text-sm font-mono"
                  style={{
                    background: '#0a0a0a',
                    border: '1px solid #333',
                    color: '#e5e5e5',
                    outline: 'none',
                  }}
                />
              </Card>

              {/* Repair Level */}
              <Card>
                <label className="block text-xs mb-2" style={{ color: '#aaa' }}>
                  Repair Level
                </label>
                <select
                  value={repairLevel}
                  onChange={(e) => setRepairLevel(e.target.value as RepairLevel | '')}
                  className="w-full rounded px-3 py-2 text-sm font-mono"
                  style={{
                    background: '#0a0a0a',
                    border: '1px solid #333',
                    color: repairLevel ? '#e5e5e5' : '#666',
                    outline: 'none',
                  }}
                >
                  <option value="">— Select —</option>
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="heavy">Heavy</option>
                </select>
              </Card>

              {/* Repair Estimate */}
              <Card>
                <label className="block text-xs mb-2" style={{ color: '#aaa' }}>
                  Repair Estimate
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="$25,000"
                  value={repairEstimateInput}
                  onChange={(e) => setRepairEstimateInput(e.target.value)}
                  className="w-full rounded px-3 py-2 text-sm font-mono"
                  style={{
                    background: '#0a0a0a',
                    border: '1px solid #333',
                    color: '#e5e5e5',
                    outline: 'none',
                  }}
                />
              </Card>

              {/* Asking Price */}
              <Card>
                <label className="block text-xs mb-2" style={{ color: '#aaa' }}>
                  Seller Asking Price
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="$120,000"
                  value={askingPriceInput}
                  onChange={(e) => setAskingPriceInput(e.target.value)}
                  className="w-full rounded px-3 py-2 text-sm font-mono"
                  style={{
                    background: '#0a0a0a',
                    border: '1px solid #333',
                    color: '#e5e5e5',
                    outline: 'none',
                  }}
                />
              </Card>

              {/* Assignment Fee */}
              <Card>
                <label className="block text-xs mb-2" style={{ color: '#aaa' }}>
                  Assignment Fee (default $10,000)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="$10,000"
                  value={assignmentFeeInput}
                  onChange={(e) => setAssignmentFeeInput(e.target.value)}
                  className="w-full rounded px-3 py-2 text-sm font-mono"
                  style={{
                    background: '#0a0a0a',
                    border: '1px solid #333',
                    color: '#e5e5e5',
                    outline: 'none',
                  }}
                />
              </Card>

              {/* Live MAO Calculator */}
              <div
                className="rounded-lg p-5"
                style={{
                  background: '#0f0f0f',
                  border: `1px solid ${liveMao != null && liveMao > 0 ? '#1a2e1a' : '#333'}`,
                }}
              >
                <p className="text-xs mb-3" style={{ color: '#aaa' }}>
                  Live MAO Preview (70% margin)
                </p>

                {arv > 0 ? (
                  <>
                    <div className="flex items-center gap-2 flex-wrap text-sm">
                      <span style={{ color: '#e5e5e5' }}>{formatCurrency(arv)}</span>
                      <span style={{ color: '#666' }}>×</span>
                      <span style={{ color: '#aaa' }}>70%</span>
                      <span style={{ color: '#666' }}>−</span>
                      <span style={{ color: '#e5e5e5' }}>{formatCurrency(repairEstimate)}</span>
                      <span style={{ color: '#666' }}>−</span>
                      <span style={{ color: '#e5e5e5' }}>{formatCurrency(assignmentFee)}</span>
                      <span style={{ color: '#666' }}>=</span>
                      <span className="text-base font-bold" style={{ color: maoColor }}>
                        {formatCurrency(liveMao)}
                      </span>
                    </div>
                    <p className="text-xs mt-3" style={{ color: '#555' }}>
                      Actual MAO varies by buyer margin — see matched buyers on deal detail.
                    </p>
                  </>
                ) : (
                  <p className="text-sm" style={{ color: '#555' }}>
                    Enter ARV to see MAO calculation.
                  </p>
                )}
              </div>

              {/* Submit */}
              {submitError && (
                <p className="text-xs" style={{ color: '#ff7b7b' }}>
                  Error: {submitError}
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                disabled={!leadId || submitting}
              >
                {submitting ? 'Creating Deal...' : 'Create Deal'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
