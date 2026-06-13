import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@wholesale/lib/supabase'
import type { BuyerStrategy, RepairLevel } from '@wholesale/lib/types'
import { C, f } from '../../tokens.js'
import DesktopShell from '@wholesale/components/ui/DesktopShell'
import PageHeader from '@wholesale/components/ui/PageHeader'
import DetailPanel from '@wholesale/components/ui/DetailPanel'
import ActionBar, { PrimaryButton, SecondaryButton } from '@wholesale/components/ui/ActionBar'
import { Field, TextInput, SelectInput, TextArea } from '@wholesale/components/ui/FormPanel'
import { microLabel } from '@wholesale/components/ui/styles'

const PROPERTY_TYPE_OPTIONS = ['SFR', 'Multi-Family', 'Condo', 'Commercial']
const STRATEGY_OPTIONS: BuyerStrategy[] = ['flip', 'rental', 'BRRRR', 'buy-hold']
const CONDITION_OPTIONS: RepairLevel[] = ['light', 'moderate', 'heavy']

const innerWrap: React.CSSProperties = { maxWidth: 768, margin: '0 auto' }

const gridStyle = (cols: number): React.CSSProperties => ({
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fit, minmax(${cols >= 3 ? 140 : 180}px, 1fr))`,
  gap: 16,
})

interface FormState {
  name: string
  company: string
  phone: string
  email: string
  source: string
  notes: string
  target_markets: string
  property_types: string[]
  min_price: string
  max_price: string
  condition_max: RepairLevel | ''
  min_beds: string
  min_baths: string
  strategy: BuyerStrategy | ''
  target_margin: string
  target_roi: string
  cap_rate: string
  max_rehab: string
  financing: string
  proof_of_funds: string
}

const initialForm: FormState = {
  name: '',
  company: '',
  phone: '',
  email: '',
  source: '',
  notes: '',
  target_markets: '',
  property_types: [],
  min_price: '',
  max_price: '',
  condition_max: '',
  min_beds: '',
  min_baths: '',
  strategy: '',
  target_margin: '',
  target_roi: '',
  cap_rate: '',
  max_rehab: '',
  financing: '',
  proof_of_funds: '',
}

export default function NewBuyer() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>(initialForm)
  const [nameError, setNameError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  function set(field: keyof FormState, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function togglePropertyType(pt: string) {
    setForm(prev => {
      const exists = prev.property_types.includes(pt)
      return {
        ...prev,
        property_types: exists
          ? prev.property_types.filter(x => x !== pt)
          : [...prev.property_types, pt],
      }
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setNameError('')
    setServerError('')

    if (!form.name.trim()) {
      setNameError('Name is required.')
      return
    }

    setSubmitting(true)

    const payload = {
      name: form.name.trim(),
      company: form.company.trim() || null,
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      source: form.source.trim() || null,
      notes: form.notes.trim() || null,
      target_markets: form.target_markets
        ? form.target_markets.split(',').map(s => s.trim()).filter(Boolean)
        : [],
      property_types: form.property_types,
      min_price: form.min_price ? parseFloat(form.min_price) : null,
      max_price: form.max_price ? parseFloat(form.max_price) : null,
      condition_max: (form.condition_max as RepairLevel) || null,
      min_beds: form.min_beds ? parseFloat(form.min_beds) : null,
      min_baths: form.min_baths ? parseFloat(form.min_baths) : null,
      strategy: (form.strategy as BuyerStrategy) || null,
      target_margin: form.target_margin ? parseFloat(form.target_margin) / 100 : null,
      target_roi: form.target_roi ? parseFloat(form.target_roi) / 100 : null,
      cap_rate: form.cap_rate ? parseFloat(form.cap_rate) / 100 : null,
      max_rehab: form.max_rehab ? parseFloat(form.max_rehab) : null,
      financing: form.financing.trim() || null,
      proof_of_funds: form.proof_of_funds.trim() || null,
      active: true,
    }

    const { error } = await supabase.from('buyers').insert([payload])

    if (error) {
      setServerError(error.message)
      setSubmitting(false)
      return
    }

    navigate('/wholesale/buyers')
  }

  return (
    <DesktopShell>
      <div style={innerWrap}>
        <PageHeader eyebrow="Disposition Network" title="Add Buyer" subtitle="New buyer profile and buy box">
          <SecondaryButton label="Cancel" onClick={() => navigate('/wholesale/buyers')} />
        </PageHeader>

        {serverError && (
          <div style={{
            marginTop: 16, padding: '12px 16px', borderRadius: 12,
            background: 'rgba(248,113,113,0.08)', border: `1px solid ${C.danger}`,
            fontFamily: f.body, fontSize: 14, color: C.danger,
          }}>
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate style={{ marginTop: 20, display: 'grid', gap: 20 }}>
          {/* Identity */}
          <DetailPanel title="Identity">
            <div style={{ display: 'grid', gap: 16 }}>
              <div style={gridStyle(2)}>
                <Field label="Name *">
                  <TextInput
                    style={{ borderColor: nameError ? C.danger : undefined }}
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    placeholder="Marcus Webb"
                  />
                  {nameError && <div style={{ color: C.danger, fontFamily: f.mono, fontSize: 11, marginTop: 4 }}>{nameError}</div>}
                </Field>
                <Field label="Company">
                  <TextInput value={form.company} onChange={e => set('company', e.target.value)} placeholder="Webb Investments" />
                </Field>
              </div>
              <div style={gridStyle(2)}>
                <Field label="Phone">
                  <TextInput type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="214-555-0100" />
                </Field>
                <Field label="Email">
                  <TextInput type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="marcus@webb.com" />
                </Field>
              </div>
              <Field label="Source">
                <TextInput value={form.source} onChange={e => set('source', e.target.value)} placeholder="How you know them (REIA, referral, cold call...)" />
              </Field>
              <Field label="Notes">
                <TextArea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any relevant background..." />
              </Field>
            </div>
          </DetailPanel>

          {/* Buy Box */}
          <DetailPanel title="Buy Box">
            <div style={{ display: 'grid', gap: 16 }}>
              <Field label="Target Markets">
                <TextInput value={form.target_markets} onChange={e => set('target_markets', e.target.value)} placeholder="75208, 75203, Dallas, Irving — comma separated" />
                <p style={{ fontFamily: f.mono, fontSize: 11, color: C.mute, marginTop: 4 }}>Zip codes or city names, comma-separated</p>
              </Field>

              <div>
                <p style={{ ...microLabel, marginBottom: 8 }}>Property Types</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  {PROPERTY_TYPE_OPTIONS.map(pt => {
                    const checked = form.property_types.includes(pt)
                    return (
                      <label key={pt} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: f.body, fontSize: 14, color: checked ? C.text : C.mute }}>
                        <input type="checkbox" checked={checked} onChange={() => togglePropertyType(pt)} style={{ accentColor: C.gold, cursor: 'pointer' }} />
                        {pt}
                      </label>
                    )
                  })}
                </div>
              </div>

              <div style={gridStyle(2)}>
                <Field label="Min Price ($)">
                  <TextInput type="number" min="0" value={form.min_price} onChange={e => set('min_price', e.target.value)} placeholder="60000" />
                </Field>
                <Field label="Max Price ($)">
                  <TextInput type="number" min="0" value={form.max_price} onChange={e => set('max_price', e.target.value)} placeholder="180000" />
                </Field>
              </div>

              <div style={gridStyle(3)}>
                <Field label="Condition Max">
                  <SelectInput value={form.condition_max} onChange={e => set('condition_max', e.target.value)}>
                    <option value="">Any</option>
                    {CONDITION_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </SelectInput>
                </Field>
                <Field label="Min Beds">
                  <TextInput type="number" min="0" value={form.min_beds} onChange={e => set('min_beds', e.target.value)} placeholder="3" />
                </Field>
                <Field label="Min Baths">
                  <TextInput type="number" min="0" step="0.5" value={form.min_baths} onChange={e => set('min_baths', e.target.value)} placeholder="2" />
                </Field>
              </div>

              <Field label="Strategy">
                <SelectInput value={form.strategy} onChange={e => set('strategy', e.target.value)}>
                  <option value="">Select strategy</option>
                  {STRATEGY_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </SelectInput>
              </Field>

              <div style={gridStyle(3)}>
                <Field label="Target Margin (%)">
                  <TextInput type="number" min="0" max="100" value={form.target_margin} onChange={e => set('target_margin', e.target.value)} placeholder="70" />
                </Field>
                <Field label="Target ROI (%)">
                  <TextInput type="number" min="0" value={form.target_roi} onChange={e => set('target_roi', e.target.value)} placeholder="12" />
                  <p style={{ fontFamily: f.mono, fontSize: 11, color: C.mute, marginTop: 4 }}>rental buyers only</p>
                </Field>
                <Field label="Cap Rate (%)">
                  <TextInput type="number" min="0" value={form.cap_rate} onChange={e => set('cap_rate', e.target.value)} placeholder="8" />
                  <p style={{ fontFamily: f.mono, fontSize: 11, color: C.mute, marginTop: 4 }}>rental buyers only</p>
                </Field>
              </div>

              <div style={gridStyle(3)}>
                <Field label="Max Rehab ($)">
                  <TextInput type="number" min="0" value={form.max_rehab} onChange={e => set('max_rehab', e.target.value)} placeholder="40000" />
                </Field>
                <Field label="Financing">
                  <TextInput value={form.financing} onChange={e => set('financing', e.target.value)} placeholder="Cash, Hard money..." />
                </Field>
                <Field label="Proof of Funds">
                  <TextInput value={form.proof_of_funds} onChange={e => set('proof_of_funds', e.target.value)} placeholder="Verified, On file..." />
                </Field>
              </div>
            </div>
          </DetailPanel>

          <ActionBar style={{ justifyContent: 'flex-end' }}>
            <SecondaryButton type="button" label="Cancel" onClick={() => navigate('/wholesale/buyers')} />
            <PrimaryButton type="submit" label={submitting ? 'Saving…' : 'Add Buyer'} disabled={submitting} />
          </ActionBar>
        </form>
      </div>
    </DesktopShell>
  )
}
