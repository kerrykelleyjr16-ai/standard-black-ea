import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '@wholesale/lib/supabase'
import type { Buyer, BuyerStrategy, RepairLevel } from '@wholesale/lib/types'
import { formatCurrency, formatPercent } from '@wholesale/lib/mao'
import Button from '@wholesale/components/ui/Button'
import Badge from '@wholesale/components/ui/Badge'
import Card from '@wholesale/components/ui/Card'
import WholesaleNav from '@wholesale/components/WholesaleNav'

const PROPERTY_TYPE_OPTIONS = ['SFR', 'Multi-Family', 'Condo', 'Commercial']
const STRATEGY_OPTIONS: BuyerStrategy[] = ['flip', 'rental', 'BRRRR', 'buy-hold']
const CONDITION_OPTIONS: RepairLevel[] = ['light', 'moderate', 'heavy']

const inputStyle: React.CSSProperties = {
  background: '#111',
  border: '1px solid #333',
  color: '#e5e5e5',
  borderRadius: 6,
  padding: '8px 12px',
  fontSize: 13,
  fontFamily: 'inherit',
  width: '100%',
  outline: 'none',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  color: '#666',
  marginBottom: 4,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}

const fieldLabelStyle: React.CSSProperties = {
  fontSize: 11,
  color: '#666',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}

const fieldValueStyle: React.CSSProperties = {
  fontSize: 13,
  color: '#e5e5e5',
  marginTop: 2,
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-xs uppercase tracking-widest mb-4"
      style={{ color: '#C9A24A', borderBottom: '1px solid rgba(201,162,74,0.15)', paddingBottom: 8 }}
    >
      {children}
    </h3>
  )
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div style={fieldLabelStyle}>{label}</div>
      <div style={fieldValueStyle}>{value || <span style={{ color: '#555' }}>—</span>}</div>
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
      <>
        <WholesaleNav />
        <div className="p-8 font-mono text-sm" style={{ color: '#666' }}>
          Loading buyer...
        </div>
      </>
    )
  }

  if (notFound || !buyer) {
    return (
      <>
        <WholesaleNav />
        <div className="p-8 font-mono">
          <p className="text-sm mb-4" style={{ color: '#aaa' }}>Buyer not found.</p>
          <Button onClick={() => navigate('/wholesale/buyers')} variant="ghost" size="sm">
            Back to Buyers
          </Button>
        </div>
      </>
    )
  }

  const marginDisplay = buyer.target_margin != null
    ? `${Math.round(buyer.target_margin * 100)}% — MAO = ARV × ${buyer.target_margin.toFixed(2)} − repairs − fee`
    : '—'

  // ---- EDIT MODE ----
  if (editing && editForm) {
    return (
      <>
        <WholesaleNav />
        <div className="p-8 font-mono" style={{ background: '#0a0a0a', minHeight: '100vh' }}>
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-xl font-medium" style={{ color: '#e5e5e5' }}>Edit Buyer</h1>
                <p className="text-xs mt-1" style={{ color: '#666' }}>{buyer.name}</p>
              </div>
              <Button onClick={cancelEdit} variant="ghost" size="md">Cancel</Button>
            </div>

            {saveError && (
              <div
                className="mb-6 px-4 py-3 rounded text-sm"
                style={{ background: '#2e1a1a', border: '1px solid #ff7b7b33', color: '#ff7b7b' }}
              >
                {saveError}
              </div>
            )}

            <form onSubmit={handleSave} noValidate>
              {/* Identity */}
              <Card className="mb-6">
                <SectionHeading>Identity</SectionHeading>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label style={labelStyle}>Name *</label>
                    <input
                      style={{ ...inputStyle, borderColor: nameError ? '#ff7b7b' : '#333' }}
                      value={editForm.name}
                      onChange={e => setField('name', e.target.value)}
                    />
                    {nameError && (
                      <div style={{ color: '#ff7b7b', fontSize: 11, marginTop: 4 }}>{nameError}</div>
                    )}
                  </div>
                  <div>
                    <label style={labelStyle}>Company</label>
                    <input
                      style={inputStyle}
                      value={editForm.company}
                      onChange={e => setField('company', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label style={labelStyle}>Phone</label>
                    <input
                      style={inputStyle}
                      value={editForm.phone}
                      onChange={e => setField('phone', e.target.value)}
                      type="tel"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input
                      style={inputStyle}
                      value={editForm.email}
                      onChange={e => setField('email', e.target.value)}
                      type="email"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label style={labelStyle}>Source</label>
                  <input
                    style={inputStyle}
                    value={editForm.source}
                    onChange={e => setField('source', e.target.value)}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Notes</label>
                  <textarea
                    style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
                    value={editForm.notes}
                    onChange={e => setField('notes', e.target.value)}
                  />
                </div>
              </Card>

              {/* Buy Box */}
              <Card className="mb-8">
                <SectionHeading>Buy Box</SectionHeading>

                <div className="mb-4">
                  <label style={labelStyle}>Target Markets</label>
                  <input
                    style={inputStyle}
                    value={editForm.target_markets}
                    onChange={e => setField('target_markets', e.target.value)}
                    placeholder="75208, 75203, Dallas — comma separated"
                  />
                </div>

                <div className="mb-4">
                  <label style={labelStyle}>Property Types</label>
                  <div className="flex flex-wrap gap-3 mt-1">
                    {PROPERTY_TYPE_OPTIONS.map(pt => {
                      const checked = editForm.property_types.includes(pt)
                      return (
                        <label
                          key={pt}
                          className="flex items-center gap-2 cursor-pointer text-sm"
                          style={{ color: checked ? '#e5e5e5' : '#666' }}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => togglePropertyType(pt)}
                            className="accent-[#C9A24A]"
                          />
                          {pt}
                        </label>
                      )
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label style={labelStyle}>Min Price ($)</label>
                    <input
                      style={inputStyle}
                      value={editForm.min_price}
                      onChange={e => setField('min_price', e.target.value)}
                      type="number"
                      min="0"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Max Price ($)</label>
                    <input
                      style={inputStyle}
                      value={editForm.max_price}
                      onChange={e => setField('max_price', e.target.value)}
                      type="number"
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label style={labelStyle}>Condition Max</label>
                    <select
                      style={{ ...inputStyle, cursor: 'pointer' }}
                      value={editForm.condition_max}
                      onChange={e => setField('condition_max', e.target.value)}
                    >
                      <option value="">Any</option>
                      {CONDITION_OPTIONS.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Min Beds</label>
                    <input
                      style={inputStyle}
                      value={editForm.min_beds}
                      onChange={e => setField('min_beds', e.target.value)}
                      type="number"
                      min="0"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Min Baths</label>
                    <input
                      style={inputStyle}
                      value={editForm.min_baths}
                      onChange={e => setField('min_baths', e.target.value)}
                      type="number"
                      min="0"
                      step="0.5"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label style={labelStyle}>Strategy</label>
                  <select
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    value={editForm.strategy}
                    onChange={e => setField('strategy', e.target.value)}
                  >
                    <option value="">Select strategy</option>
                    {STRATEGY_OPTIONS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label style={labelStyle}>Target Margin (%)</label>
                    <input
                      style={inputStyle}
                      value={editForm.target_margin}
                      onChange={e => setField('target_margin', e.target.value)}
                      type="number"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Target ROI (%)</label>
                    <input
                      style={inputStyle}
                      value={editForm.target_roi}
                      onChange={e => setField('target_roi', e.target.value)}
                      type="number"
                      min="0"
                    />
                    <p className="text-xs mt-1" style={{ color: '#555' }}>rental buyers only</p>
                  </div>
                  <div>
                    <label style={labelStyle}>Cap Rate (%)</label>
                    <input
                      style={inputStyle}
                      value={editForm.cap_rate}
                      onChange={e => setField('cap_rate', e.target.value)}
                      type="number"
                      min="0"
                    />
                    <p className="text-xs mt-1" style={{ color: '#555' }}>rental buyers only</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label style={labelStyle}>Max Rehab ($)</label>
                    <input
                      style={inputStyle}
                      value={editForm.max_rehab}
                      onChange={e => setField('max_rehab', e.target.value)}
                      type="number"
                      min="0"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Financing</label>
                    <input
                      style={inputStyle}
                      value={editForm.financing}
                      onChange={e => setField('financing', e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Proof of Funds</label>
                    <input
                      style={inputStyle}
                      value={editForm.proof_of_funds}
                      onChange={e => setField('proof_of_funds', e.target.value)}
                    />
                  </div>
                </div>
              </Card>

              <div className="flex items-center justify-end gap-3">
                <Button type="button" onClick={cancelEdit} variant="ghost" size="md">
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </>
    )
  }

  // ---- VIEW MODE ----
  return (
    <>
      <WholesaleNav />
      <div className="p-8 font-mono" style={{ background: '#0a0a0a', minHeight: '100vh' }}>
        <div className="max-w-3xl mx-auto">
          {/* Back nav */}
          <button
            onClick={() => navigate('/wholesale/buyers')}
            className="text-xs mb-6 flex items-center gap-1 hover:opacity-70 transition-opacity"
            style={{ color: '#666', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            &larr; All Buyers
          </button>

          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-medium mb-2" style={{ color: '#e5e5e5' }}>
                {buyer.name}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                {buyer.company && (
                  <span className="text-sm" style={{ color: '#aaa' }}>{buyer.company}</span>
                )}
                {buyer.strategy && (
                  <Badge label={buyer.strategy} color="blue" />
                )}
                <Badge
                  label={buyer.active ? 'Active' : 'Inactive'}
                  color={buyer.active ? 'green' : 'gray'}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button onClick={startEdit} variant="ghost" size="sm">
                Edit
              </Button>
              <Button
                onClick={handleToggleActive}
                variant={buyer.active ? 'danger' : 'ghost'}
                size="sm"
                disabled={toggling}
              >
                {toggling ? '...' : buyer.active ? 'Deactivate' : 'Activate'}
              </Button>
            </div>
          </div>

          {/* Contact + Identity card */}
          <Card className="mb-6">
            <SectionHeading>Contact</SectionHeading>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Phone" value={buyer.phone} />
              <Field label="Email" value={buyer.email} />
              <Field label="Source" value={buyer.source} />
            </div>
            {buyer.notes && (
              <div className="mt-2">
                <div style={fieldLabelStyle}>Notes</div>
                <div className="text-sm mt-1 leading-relaxed" style={{ color: '#aaa' }}>
                  {buyer.notes}
                </div>
              </div>
            )}
          </Card>

          {/* Buy Box panel */}
          <Card className="mb-6">
            <SectionHeading>Buy Box</SectionHeading>

            <div className="grid grid-cols-2 gap-x-8">
              {/* Left column */}
              <div>
                <div className="mb-4">
                  <div style={fieldLabelStyle}>Target Markets</div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {buyer.target_markets && buyer.target_markets.length > 0 ? (
                      buyer.target_markets.map((m, i) => (
                        <Badge key={i} label={m} color="blue" />
                      ))
                    ) : (
                      <span style={{ color: '#555', fontSize: 13 }}>—</span>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <div style={fieldLabelStyle}>Property Types</div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {buyer.property_types && buyer.property_types.length > 0 ? (
                      buyer.property_types.map((pt, i) => (
                        <Badge key={i} label={pt} color="gray" />
                      ))
                    ) : (
                      <span style={{ color: '#555', fontSize: 13 }}>—</span>
                    )}
                  </div>
                </div>

                <Field
                  label="Price Range"
                  value={
                    buyer.min_price || buyer.max_price
                      ? `${formatCurrency(buyer.min_price)} – ${formatCurrency(buyer.max_price)}`
                      : null
                  }
                />

                <Field
                  label="Condition Max"
                  value={buyer.condition_max
                    ? <Badge label={buyer.condition_max} color="yellow" />
                    : null
                  }
                />

                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="Min Beds"
                    value={buyer.min_beds != null ? String(buyer.min_beds) : null}
                  />
                  <Field
                    label="Min Baths"
                    value={buyer.min_baths != null ? String(buyer.min_baths) : null}
                  />
                </div>
              </div>

              {/* Right column */}
              <div>
                <Field
                  label="Strategy"
                  value={buyer.strategy ? <Badge label={buyer.strategy} color="blue" /> : null}
                />

                <div className="mb-4">
                  <div style={fieldLabelStyle}>Target Margin</div>
                  <div className="text-sm mt-1" style={{ color: '#C9A24A' }}>
                    {marginDisplay}
                  </div>
                </div>

                <Field
                  label="Target ROI"
                  value={buyer.target_roi != null
                    ? <span style={{ color: '#C9A24A' }}>{formatPercent(buyer.target_roi)}</span>
                    : null
                  }
                />

                <Field
                  label="Cap Rate"
                  value={buyer.cap_rate != null
                    ? <span style={{ color: '#C9A24A' }}>{formatPercent(buyer.cap_rate)}</span>
                    : null
                  }
                />

                <Field
                  label="Max Rehab"
                  value={buyer.max_rehab != null ? formatCurrency(buyer.max_rehab) : null}
                />

                <Field label="Financing" value={buyer.financing} />
                <Field label="Proof of Funds" value={buyer.proof_of_funds} />
              </div>
            </div>
          </Card>

          {/* Matched Deals stub */}
          <Card>
            <SectionHeading>Matched Deals</SectionHeading>
            <div
              className="py-6 text-center rounded text-sm"
              style={{ color: '#555', background: '#111', border: '1px dashed #222' }}
            >
              Matched Deals — available after Sprint 3 dashboard build
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}
