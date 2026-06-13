import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@wholesale/lib/supabase'
import type { Buyer, BuyerStrategy, RepairLevel } from '@wholesale/lib/types'
import { formatCurrency, formatPercent } from '@wholesale/lib/mao'
import { C, f } from '../../tokens.js'
import DesktopShell from '@wholesale/components/ui/DesktopShell'
import PageHeader from '@wholesale/components/ui/PageHeader'
import DetailPanel from '@wholesale/components/ui/DetailPanel'
import StatusBadge from '@wholesale/components/ui/StatusBadge'
import TagBadge from '@wholesale/components/ui/TagBadge'
import ActionBar, { PrimaryButton, SecondaryButton } from '@wholesale/components/ui/ActionBar'
import { Field, TextInput, SelectInput, TextArea } from '@wholesale/components/ui/FormPanel'
import { microLabel } from '@wholesale/components/ui/styles'

const PROPERTY_TYPE_OPTIONS = ['SFR', 'Multi-Family', 'Condo', 'Commercial']
const STRATEGY_OPTIONS: BuyerStrategy[] = ['flip', 'rental', 'BRRRR', 'buy-hold']
const CONDITION_OPTIONS: RepairLevel[] = ['light', 'moderate', 'heavy']

const innerWrap: React.CSSProperties = { maxWidth: 768, margin: '0 auto' }

function ViewField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p style={microLabel}>{label}</p>
      <div style={{ marginTop: 4, fontFamily: f.body, fontSize: 14, color: C.text }}>
        {value || <span style={{ color: C.mute }}>—</span>}
      </div>
    </div>
  )
}

interface EditFormState {
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

function buyerToEditForm(b: Buyer): EditFormState {
  return {
    name: b.name,
    company: b.company ?? '',
    phone: b.phone ?? '',
    email: b.email ?? '',
    source: b.source ?? '',
    notes: b.notes ?? '',
    target_markets: (b.target_markets ?? []).join(', '),
    property_types: b.property_types ?? [],
    min_price: b.min_price != null ? String(b.min_price) : '',
    max_price: b.max_price != null ? String(b.max_price) : '',
    condition_max: b.condition_max ?? '',
    min_beds: b.min_beds != null ? String(b.min_beds) : '',
    min_baths: b.min_baths != null ? String(b.min_baths) : '',
    strategy: b.strategy ?? '',
    target_margin: b.target_margin != null ? String(Math.round(b.target_margin * 100)) : '',
    target_roi: b.target_roi != null ? String(Math.round(b.target_roi * 100)) : '',
    cap_rate: b.cap_rate != null ? String(Math.round(b.cap_rate * 100)) : '',
    max_rehab: b.max_rehab != null ? String(b.max_rehab) : '',
    financing: b.financing ?? '',
    proof_of_funds: b.proof_of_funds ?? '',
  }
}

const gridStyle = (cols: number): React.CSSProperties => ({
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fit, minmax(${cols >= 3 ? 140 : 180}px, 1fr))`,
  gap: 16,
})

export default function BuyerDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [buyer, setBuyer] = useState<Buyer | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState<EditFormState | null>(null)
  const [nameError, setNameError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const [toggling, setToggling] = useState(false)

  useEffect(() => {
    async function fetchBuyer() {
      if (!id) return
      const { data, error } = await supabase
        .from('buyers')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !data) {
        setNotFound(true)
      } else {
        setBuyer(data as Buyer)
      }
      setLoading(false)
    }
    if (id) fetchBuyer()
  }, [id])

  function startEdit() {
    if (!buyer) return
    setEditForm(buyerToEditForm(buyer))
    setNameError('')
    setSaveError('')
    setEditing(true)
  }

  function cancelEdit() {
    setEditing(false)
    setEditForm(null)
    setNameError('')
    setSaveError('')
  }

  function setField(field: keyof EditFormState, value: string) {
    setEditForm(prev => prev ? { ...prev, [field]: value } : prev)
  }

  function togglePropertyType(pt: string) {
    setEditForm(prev => {
      if (!prev) return prev
      const exists = prev.property_types.includes(pt)
      return {
        ...prev,
        property_types: exists
          ? prev.property_types.filter(x => x !== pt)
          : [...prev.property_types, pt],
      }
    })
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!editForm || !buyer) return
    setNameError('')
    setSaveError('')

    if (!editForm.name.trim()) {
      setNameError('Name is required.')
      return
    }

    setSaving(true)

    const payload = {
      name: editForm.name.trim(),
      company: editForm.company.trim() || null,
      phone: editForm.phone.trim() || null,
      email: editForm.email.trim() || null,
      source: editForm.source.trim() || null,
      notes: editForm.notes.trim() || null,
      target_markets: editForm.target_markets
        ? editForm.target_markets.split(',').map(s => s.trim()).filter(Boolean)
        : [],
      property_types: editForm.property_types,
      min_price: editForm.min_price ? parseFloat(editForm.min_price) : null,
      max_price: editForm.max_price ? parseFloat(editForm.max_price) : null,
      condition_max: (editForm.condition_max as RepairLevel) || null,
      min_beds: editForm.min_beds ? parseFloat(editForm.min_beds) : null,
      min_baths: editForm.min_baths ? parseFloat(editForm.min_baths) : null,
      strategy: (editForm.strategy as BuyerStrategy) || null,
      target_margin: editForm.target_margin ? parseFloat(editForm.target_margin) / 100 : null,
      target_roi: editForm.target_roi ? parseFloat(editForm.target_roi) / 100 : null,
      cap_rate: editForm.cap_rate ? parseFloat(editForm.cap_rate) / 100 : null,
      max_rehab: editForm.max_rehab ? parseFloat(editForm.max_rehab) : null,
      financing: editForm.financing.trim() || null,
      proof_of_funds: editForm.proof_of_funds.trim() || null,
    }

    const { data, error } = await supabase
      .from('buyers')
      .update(payload)
      .eq('id', buyer.id)
      .select()
      .single()

    if (error) {
      setSaveError(error.message)
      setSaving(false)
      return
    }

    setBuyer(data as Buyer)
    setSaving(false)
    setEditing(false)
    setEditForm(null)
  }

  async function handleToggleActive() {
    if (!buyer) return
    setToggling(true)
    const { data, error } = await supabase
      .from('buyers')
      .update({ active: !buyer.active })
      .eq('id', buyer.id)
      .select()
      .single()

    if (!error && data) {
      setBuyer(data as Buyer)
    }
    setToggling(false)
  }

  if (loading) {
    return (
      <DesktopShell>
        <p style={{ fontFamily: f.body, fontSize: 14, color: C.mute }}>Loading buyer…</p>
      </DesktopShell>
    )
  }

  if (notFound || !buyer) {
    return (
      <DesktopShell>
        <div style={innerWrap}>
          <p style={{ fontFamily: f.body, fontSize: 14, color: C.sub, marginBottom: 16 }}>Buyer not found.</p>
          <SecondaryButton label="Back to Buyers" onClick={() => navigate('/wholesale/buyers')} />
        </div>
      </DesktopShell>
    )
  }

  const marginDisplay = buyer.target_margin != null
    ? `${Math.round(buyer.target_margin * 100)}% — MAO = ARV × ${buyer.target_margin.toFixed(2)} − repairs − fee`
    : '—'

  // ---- EDIT MODE ----
  if (editing && editForm) {
    return (
      <DesktopShell>
        <div style={innerWrap}>
          <PageHeader eyebrow="Editing" title="Edit Buyer" subtitle={buyer.name}>
            <SecondaryButton label="Cancel" onClick={cancelEdit} />
          </PageHeader>

          {saveError && (
            <div style={{
              marginTop: 16, padding: '12px 16px', borderRadius: 12,
              background: 'rgba(248,113,113,0.08)', border: `1px solid ${C.danger}`,
              fontFamily: f.body, fontSize: 14, color: C.danger,
            }}>
              {saveError}
            </div>
          )}

          <form onSubmit={handleSave} noValidate style={{ marginTop: 20, display: 'grid', gap: 20 }}>
            {/* Identity */}
            <DetailPanel title="Identity">
              <div style={{ display: 'grid', gap: 16 }}>
                <div style={gridStyle(2)}>
                  <Field label="Name *">
                    <TextInput
                      style={{ borderColor: nameError ? C.danger : undefined }}
                      value={editForm.name}
                      onChange={e => setField('name', e.target.value)}
                    />
                    {nameError && <div style={{ color: C.danger, fontFamily: f.mono, fontSize: 11, marginTop: 4 }}>{nameError}</div>}
                  </Field>
                  <Field label="Company">
                    <TextInput value={editForm.company} onChange={e => setField('company', e.target.value)} />
                  </Field>
                </div>
                <div style={gridStyle(2)}>
                  <Field label="Phone">
                    <TextInput type="tel" value={editForm.phone} onChange={e => setField('phone', e.target.value)} />
                  </Field>
                  <Field label="Email">
                    <TextInput type="email" value={editForm.email} onChange={e => setField('email', e.target.value)} />
                  </Field>
                </div>
                <Field label="Source">
                  <TextInput value={editForm.source} onChange={e => setField('source', e.target.value)} />
                </Field>
                <Field label="Notes">
                  <TextArea value={editForm.notes} onChange={e => setField('notes', e.target.value)} />
                </Field>
              </div>
            </DetailPanel>

            {/* Buy Box */}
            <DetailPanel title="Buy Box">
              <div style={{ display: 'grid', gap: 16 }}>
                <Field label="Target Markets">
                  <TextInput
                    value={editForm.target_markets}
                    onChange={e => setField('target_markets', e.target.value)}
                    placeholder="75208, 75203, Dallas — comma separated"
                  />
                </Field>

                <div>
                  <p style={{ ...microLabel, marginBottom: 8 }}>Property Types</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                    {PROPERTY_TYPE_OPTIONS.map(pt => {
                      const checked = editForm.property_types.includes(pt)
                      return (
                        <label key={pt} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: f.body, fontSize: 14, color: checked ? C.text : C.mute }}>
                          <input type="checkbox" checked={checked} onChange={() => togglePropertyType(pt)} style={{ accentColor: C.gold }} />
                          {pt}
                        </label>
                      )
                    })}
                  </div>
                </div>

                <div style={gridStyle(2)}>
                  <Field label="Min Price ($)">
                    <TextInput type="number" min="0" value={editForm.min_price} onChange={e => setField('min_price', e.target.value)} />
                  </Field>
                  <Field label="Max Price ($)">
                    <TextInput type="number" min="0" value={editForm.max_price} onChange={e => setField('max_price', e.target.value)} />
                  </Field>
                </div>

                <div style={gridStyle(3)}>
                  <Field label="Condition Max">
                    <SelectInput value={editForm.condition_max} onChange={e => setField('condition_max', e.target.value)}>
                      <option value="">Any</option>
                      {CONDITION_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                    </SelectInput>
                  </Field>
                  <Field label="Min Beds">
                    <TextInput type="number" min="0" value={editForm.min_beds} onChange={e => setField('min_beds', e.target.value)} />
                  </Field>
                  <Field label="Min Baths">
                    <TextInput type="number" min="0" step="0.5" value={editForm.min_baths} onChange={e => setField('min_baths', e.target.value)} />
                  </Field>
                </div>

                <Field label="Strategy">
                  <SelectInput value={editForm.strategy} onChange={e => setField('strategy', e.target.value)}>
                    <option value="">Select strategy</option>
                    {STRATEGY_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </SelectInput>
                </Field>

                <div style={gridStyle(3)}>
                  <Field label="Target Margin (%)">
                    <TextInput type="number" min="0" max="100" value={editForm.target_margin} onChange={e => setField('target_margin', e.target.value)} />
                  </Field>
                  <Field label="Target ROI (%)">
                    <TextInput type="number" min="0" value={editForm.target_roi} onChange={e => setField('target_roi', e.target.value)} />
                    <p style={{ fontFamily: f.mono, fontSize: 11, color: C.mute, marginTop: 4 }}>rental buyers only</p>
                  </Field>
                  <Field label="Cap Rate (%)">
                    <TextInput type="number" min="0" value={editForm.cap_rate} onChange={e => setField('cap_rate', e.target.value)} />
                    <p style={{ fontFamily: f.mono, fontSize: 11, color: C.mute, marginTop: 4 }}>rental buyers only</p>
                  </Field>
                </div>

                <div style={gridStyle(3)}>
                  <Field label="Max Rehab ($)">
                    <TextInput type="number" min="0" value={editForm.max_rehab} onChange={e => setField('max_rehab', e.target.value)} />
                  </Field>
                  <Field label="Financing">
                    <TextInput value={editForm.financing} onChange={e => setField('financing', e.target.value)} />
                  </Field>
                  <Field label="Proof of Funds">
                    <TextInput value={editForm.proof_of_funds} onChange={e => setField('proof_of_funds', e.target.value)} />
                  </Field>
                </div>
              </div>
            </DetailPanel>

            <ActionBar style={{ justifyContent: 'flex-end' }}>
              <SecondaryButton type="button" label="Cancel" onClick={cancelEdit} />
              <PrimaryButton type="submit" label={saving ? 'Saving…' : 'Save Changes'} disabled={saving} />
            </ActionBar>
          </form>
        </div>
      </DesktopShell>
    )
  }

  // ---- VIEW MODE ----
  return (
    <DesktopShell>
      <div style={innerWrap}>
        {/* Back nav */}
        <button
          onClick={() => navigate('/wholesale/buyers')}
          style={{ marginBottom: 16, display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontFamily: f.mono, fontSize: 12, color: C.mute }}
        >
          ← All Buyers
        </button>

        <PageHeader
          eyebrow="Buyer"
          title={buyer.name}
          subtitle={buyer.company || undefined}
        >
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {buyer.strategy && <TagBadge label={buyer.strategy} />}
              <StatusBadge label={buyer.active ? 'Active' : 'Inactive'} color={buyer.active ? C.success : C.mute} />
            </div>
            <ActionBar>
              <SecondaryButton label="Edit" onClick={startEdit} />
              <SecondaryButton label={toggling ? '…' : buyer.active ? 'Deactivate' : 'Activate'} onClick={handleToggleActive} disabled={toggling} />
            </ActionBar>
          </div>
        </PageHeader>

        <div style={{ marginTop: 20, display: 'grid', gap: 20 }}>
          {/* Contact */}
          <DetailPanel title="Contact">
            <div style={gridStyle(3)}>
              <ViewField label="Phone" value={buyer.phone} />
              <ViewField label="Email" value={buyer.email} />
              <ViewField label="Source" value={buyer.source} />
            </div>
            {buyer.notes && (
              <div style={{ marginTop: 16 }}>
                <p style={microLabel}>Notes</p>
                <p style={{ marginTop: 4, fontFamily: f.body, fontSize: 14, lineHeight: 1.6, color: C.sub }}>{buyer.notes}</p>
              </div>
            )}
          </DetailPanel>

          {/* Buy Box */}
          <DetailPanel title="Buy Box">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 24 }}>
              {/* Left column */}
              <div style={{ display: 'grid', gap: 16 }}>
                <div>
                  <p style={microLabel}>Target Markets</p>
                  <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {buyer.target_markets && buyer.target_markets.length > 0
                      ? buyer.target_markets.map((m, i) => <TagBadge key={i} label={m} />)
                      : <span style={{ color: C.mute, fontFamily: f.body, fontSize: 14 }}>—</span>}
                  </div>
                </div>
                <div>
                  <p style={microLabel}>Property Types</p>
                  <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {buyer.property_types && buyer.property_types.length > 0
                      ? buyer.property_types.map((pt, i) => <StatusBadge key={i} label={pt} color={C.sub} />)
                      : <span style={{ color: C.mute, fontFamily: f.body, fontSize: 14 }}>—</span>}
                  </div>
                </div>
                <ViewField
                  label="Price Range"
                  value={buyer.min_price || buyer.max_price
                    ? `${formatCurrency(buyer.min_price)} – ${formatCurrency(buyer.max_price)}`
                    : null}
                />
                <ViewField
                  label="Condition Max"
                  value={buyer.condition_max ? <StatusBadge label={buyer.condition_max} color={C.warning} /> : null}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <ViewField label="Min Beds" value={buyer.min_beds != null ? String(buyer.min_beds) : null} />
                  <ViewField label="Min Baths" value={buyer.min_baths != null ? String(buyer.min_baths) : null} />
                </div>
              </div>

              {/* Right column */}
              <div style={{ display: 'grid', gap: 16 }}>
                <ViewField label="Strategy" value={buyer.strategy ? <TagBadge label={buyer.strategy} /> : null} />
                <div>
                  <p style={microLabel}>Target Margin</p>
                  <p style={{ marginTop: 4, fontFamily: f.body, fontSize: 14, color: C.gold }}>{marginDisplay}</p>
                </div>
                <ViewField
                  label="Target ROI"
                  value={buyer.target_roi != null ? <span style={{ color: C.gold }}>{formatPercent(buyer.target_roi)}</span> : null}
                />
                <ViewField
                  label="Cap Rate"
                  value={buyer.cap_rate != null ? <span style={{ color: C.gold }}>{formatPercent(buyer.cap_rate)}</span> : null}
                />
                <ViewField label="Max Rehab" value={buyer.max_rehab != null ? formatCurrency(buyer.max_rehab) : null} />
                <ViewField label="Financing" value={buyer.financing} />
                <ViewField label="Proof of Funds" value={buyer.proof_of_funds} />
              </div>
            </div>
          </DetailPanel>

          {/* Matched Deals stub */}
          <DetailPanel title="Matched Deals">
            <div style={{
              padding: '24px', textAlign: 'center', borderRadius: 12,
              color: C.mute, background: 'rgba(0,0,0,0.3)', border: `1px dashed ${C.border}`,
              fontFamily: f.body, fontSize: 14,
            }}>
              Matched Deals — available after Sprint 3 dashboard build
            </div>
          </DetailPanel>
        </div>
      </div>
    </DesktopShell>
  )
}
