import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@wholesale/lib/supabase'
import type { BuyerStrategy, RepairLevel } from '@wholesale/lib/types'
import Button from '@wholesale/components/ui/Button'
import Card from '@wholesale/components/ui/Card'
import WholesaleNav from '@wholesale/components/WholesaleNav'

const PROPERTY_TYPE_OPTIONS = ['SFR', 'Multi-Family', 'Condo', 'Commercial']
const STRATEGY_OPTIONS: BuyerStrategy[] = ['flip', 'rental', 'BRRRR', 'buy-hold']
const CONDITION_OPTIONS: RepairLevel[] = ['light', 'moderate', 'heavy']

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

const errorStyle: React.CSSProperties = {
  color: '#ff7b7b',
  fontSize: 11,
  marginTop: 4,
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
    <>
      <WholesaleNav />
      <div className="p-8 font-mono" style={{ background: '#0a0a0a', minHeight: '100vh' }}>
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-xl font-medium" style={{ color: '#e5e5e5' }}>Add Buyer</h1>
              <p className="text-xs mt-1" style={{ color: '#666' }}>New buyer profile and buy box</p>
            </div>
            <Button onClick={() => navigate('/wholesale/buyers')} variant="ghost" size="md">
              Cancel
            </Button>
          </div>

          {serverError && (
            <div
              className="mb-6 px-4 py-3 rounded text-sm"
              style={{ background: '#2e1a1a', border: '1px solid #ff7b7b33', color: '#ff7b7b' }}
            >
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Identity Section */}
            <Card className="mb-6">
              <SectionHeading>Identity</SectionHeading>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label style={labelStyle}>Name *</label>
                  <input
                    style={{
                      ...inputStyle,
                      borderColor: nameError ? '#ff7b7b' : '#333',
                    }}
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    placeholder="Marcus Webb"
                  />
                  {nameError && <div style={errorStyle}>{nameError}</div>}
                </div>
                <div>
                  <label style={labelStyle}>Company</label>
                  <input
                    style={inputStyle}
                    value={form.company}
                    onChange={e => set('company', e.target.value)}
                    placeholder="Webb Investments"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input
                    style={inputStyle}
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                    placeholder="214-555-0100"
                    type="tel"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    style={inputStyle}
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    placeholder="marcus@webb.com"
                    type="email"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label style={labelStyle}>Source</label>
                <input
                  style={inputStyle}
                  value={form.source}
                  onChange={e => set('source', e.target.value)}
                  placeholder="How you know them (REIA, referral, cold call...)"
                />
              </div>

              <div>
                <label style={labelStyle}>Notes</label>
                <textarea
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                  placeholder="Any relevant background..."
                />
              </div>
            </Card>

            {/* Buy Box Section */}
            <Card className="mb-8">
              <SectionHeading>Buy Box</SectionHeading>

              {/* Target Markets */}
              <div className="mb-4">
                <label style={labelStyle}>Target Markets</label>
                <input
                  style={inputStyle}
                  value={form.target_markets}
                  onChange={e => set('target_markets', e.target.value)}
                  placeholder="75208, 75203, Dallas, Irving — comma separated"
                />
                <p className="text-xs mt-1" style={{ color: '#555' }}>
                  Zip codes or city names, comma-separated
                </p>
              </div>

              {/* Property Types */}
              <div className="mb-4">
                <label style={labelStyle}>Property Types</label>
                <div className="flex flex-wrap gap-3 mt-1">
                  {PROPERTY_TYPE_OPTIONS.map(pt => {
                    const checked = form.property_types.includes(pt)
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
                          style={{ cursor: 'pointer' }}
                        />
                        {pt}
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label style={labelStyle}>Min Price ($)</label>
                  <input
                    style={inputStyle}
                    value={form.min_price}
                    onChange={e => set('min_price', e.target.value)}
                    placeholder="60000"
                    type="number"
                    min="0"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Max Price ($)</label>
                  <input
                    style={inputStyle}
                    value={form.max_price}
                    onChange={e => set('max_price', e.target.value)}
                    placeholder="180000"
                    type="number"
                    min="0"
                  />
                </div>
              </div>

              {/* Condition Max + Beds/Baths */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label style={labelStyle}>Condition Max</label>
                  <select
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    value={form.condition_max}
                    onChange={e => set('condition_max', e.target.value)}
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
                    value={form.min_beds}
                    onChange={e => set('min_beds', e.target.value)}
                    placeholder="3"
                    type="number"
                    min="0"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Min Baths</label>
                  <input
                    style={inputStyle}
                    value={form.min_baths}
                    onChange={e => set('min_baths', e.target.value)}
                    placeholder="2"
                    type="number"
                    min="0"
                    step="0.5"
                  />
                </div>
              </div>

              {/* Strategy */}
              <div className="mb-4">
                <label style={labelStyle}>Strategy</label>
                <select
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  value={form.strategy}
                  onChange={e => set('strategy', e.target.value)}
                >
                  <option value="">Select strategy</option>
                  {STRATEGY_OPTIONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Margin + ROI + Cap Rate */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label style={labelStyle}>Target Margin (%)</label>
                  <input
                    style={inputStyle}
                    value={form.target_margin}
                    onChange={e => set('target_margin', e.target.value)}
                    placeholder="70"
                    type="number"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Target ROI (%)</label>
                  <input
                    style={inputStyle}
                    value={form.target_roi}
                    onChange={e => set('target_roi', e.target.value)}
                    placeholder="12"
                    type="number"
                    min="0"
                  />
                  <p className="text-xs mt-1" style={{ color: '#555' }}>rental buyers only</p>
                </div>
                <div>
                  <label style={labelStyle}>Cap Rate (%)</label>
                  <input
                    style={inputStyle}
                    value={form.cap_rate}
                    onChange={e => set('cap_rate', e.target.value)}
                    placeholder="8"
                    type="number"
                    min="0"
                  />
                  <p className="text-xs mt-1" style={{ color: '#555' }}>rental buyers only</p>
                </div>
              </div>

              {/* Max Rehab + Financing + POF */}
              <div className="grid grid-cols-3 gap-4 mb-0">
                <div>
                  <label style={labelStyle}>Max Rehab ($)</label>
                  <input
                    style={inputStyle}
                    value={form.max_rehab}
                    onChange={e => set('max_rehab', e.target.value)}
                    placeholder="40000"
                    type="number"
                    min="0"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Financing</label>
                  <input
                    style={inputStyle}
                    value={form.financing}
                    onChange={e => set('financing', e.target.value)}
                    placeholder="Cash, Hard money..."
                  />
                </div>
                <div>
                  <label style={labelStyle}>Proof of Funds</label>
                  <input
                    style={inputStyle}
                    value={form.proof_of_funds}
                    onChange={e => set('proof_of_funds', e.target.value)}
                    placeholder="Verified, On file..."
                  />
                </div>
              </div>
            </Card>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                onClick={() => navigate('/wholesale/buyers')}
                variant="ghost"
                size="md"
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md" disabled={submitting}>
                {submitting ? 'Saving...' : 'Add Buyer'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
