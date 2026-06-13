import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@wholesale/lib/supabase'
import { calculateMAO, formatCurrency } from '@wholesale/lib/mao'
import type { Lead, RepairLevel } from '@wholesale/lib/types'
import { C, f } from '../../tokens.js'
import DesktopShell from '@wholesale/components/ui/DesktopShell'
import PageHeader from '@wholesale/components/ui/PageHeader'
import DetailPanel from '@wholesale/components/ui/DetailPanel'
import FormPanel, { Field, TextInput, SelectInput } from '@wholesale/components/ui/FormPanel'
import { PrimaryButton } from '@wholesale/components/ui/ActionBar'

const DISPLAY_MARGIN = 0.7

const innerWrap: React.CSSProperties = { maxWidth: 640, margin: '0 auto' }

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

  const maoColor = liveMao == null ? C.mute : liveMao > 0 ? C.success : C.danger

  return (
    <DesktopShell>
      <div style={innerWrap}>
        <PageHeader eyebrow="Deal Desk" title="New Deal" subtitle="Run the numbers on a qualified lead." />

        <form onSubmit={handleSubmit} style={{ marginTop: 20, display: 'grid', gap: 20 }}>
          <FormPanel title="Lead">
            <Field label="Lead (Qualified or later)">
              {leadsLoading ? (
                <p style={{ fontFamily: f.body, fontSize: 13, color: C.mute }}>Loading leads…</p>
              ) : leads.length === 0 ? (
                <p style={{ fontFamily: f.body, fontSize: 13, color: C.danger }}>No qualified leads found. Qualify a lead first.</p>
              ) : (
                <SelectInput required value={leadId} onChange={(e) => setLeadId(e.target.value)}>
                  <option value="">— Select a lead —</option>
                  {leads.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.address}, {lead.city}{lead.owner_name ? ` — ${lead.owner_name}` : ''} [{lead.stage}]
                    </option>
                  ))}
                </SelectInput>
              )}
            </Field>
          </FormPanel>

          <FormPanel title="Deal Numbers">
            <Field label="After Repair Value (ARV)">
              <TextInput inputMode="numeric" placeholder="$200,000" value={arvInput} onChange={(e) => setArvInput(e.target.value)} />
            </Field>
            <Field label="Repair Level">
              <SelectInput value={repairLevel} onChange={(e) => setRepairLevel(e.target.value as RepairLevel | '')}>
                <option value="">— Select —</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="heavy">Heavy</option>
              </SelectInput>
            </Field>
            <Field label="Repair Estimate">
              <TextInput inputMode="numeric" placeholder="$25,000" value={repairEstimateInput} onChange={(e) => setRepairEstimateInput(e.target.value)} />
            </Field>
            <Field label="Seller Asking Price">
              <TextInput inputMode="numeric" placeholder="$120,000" value={askingPriceInput} onChange={(e) => setAskingPriceInput(e.target.value)} />
            </Field>
            <Field label="Assignment Fee (default $10,000)">
              <TextInput inputMode="numeric" placeholder="$10,000" value={assignmentFeeInput} onChange={(e) => setAssignmentFeeInput(e.target.value)} />
            </Field>
          </FormPanel>

          <DetailPanel title="Live MAO Preview">
            <p style={{ marginBottom: 12, fontFamily: f.body, fontSize: 13, color: C.sub }}>70% margin</p>
            {arv > 0 ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', fontFamily: f.body, fontSize: 14 }}>
                  <span style={{ color: C.text }}>{formatCurrency(arv)}</span>
                  <span style={{ color: C.mute }}>×</span>
                  <span style={{ color: C.sub }}>70%</span>
                  <span style={{ color: C.mute }}>−</span>
                  <span style={{ color: C.text }}>{formatCurrency(repairEstimate)}</span>
                  <span style={{ color: C.mute }}>−</span>
                  <span style={{ color: C.text }}>{formatCurrency(assignmentFee)}</span>
                  <span style={{ color: C.mute }}>=</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: maoColor }}>{formatCurrency(liveMao)}</span>
                </div>
                <p style={{ marginTop: 12, fontFamily: f.mono, fontSize: 11, color: C.mute }}>
                  Actual MAO varies by buyer margin — see matched buyers on deal detail.
                </p>
              </>
            ) : (
              <p style={{ fontFamily: f.body, fontSize: 14, color: C.mute }}>Enter ARV to see MAO calculation.</p>
            )}
          </DetailPanel>

          {submitError && (
            <p style={{ fontFamily: f.mono, fontSize: 12, color: C.danger }}>Error: {submitError}</p>
          )}

          <PrimaryButton type="submit" label={submitting ? 'Creating Deal…' : 'Create Deal'} disabled={!leadId || submitting} />
        </form>
      </div>
    </DesktopShell>
  )
}
