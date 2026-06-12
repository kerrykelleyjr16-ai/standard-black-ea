import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@wholesale/lib/supabase'
import type { Lead, LeadStage } from '@wholesale/lib/types'
import { parsePropStreamCsv } from '@wholesale/lib/csvImport'
import { C, f } from '../../tokens.js'
import DesktopShell from '@wholesale/components/ui/DesktopShell'
import PageHeader from '@wholesale/components/ui/PageHeader'
import SearchBar from '@wholesale/components/ui/SearchBar'
import FilterPills, { type FilterPill } from '@wholesale/components/ui/FilterPills'
import LeadCard from '@wholesale/components/ui/LeadCard'
import EmptyState from '@wholesale/components/ui/EmptyState'
import { PrimaryButton } from '@wholesale/components/ui/ActionBar'

const STAGES: LeadStage[] = [
  'New', 'Skip Traced', 'Contacted', 'Responded',
  'Qualified', 'Analyzed', 'Matched', 'Offer Made',
  'Under Contract', 'Assigned', 'Closed',
]

export default function Leads() {
  const navigate = useNavigate()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [activeStage, setActiveStage] = useState<LeadStage | 'All'>('All')
  const [query, setQuery] = useState('')
  const [importMsg, setImportMsg] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function fetchLeads() {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) setLeads(data as Lead[])
    setLoading(false)
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  async function handleCsvImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    // Reset input so same file can be re-selected if needed
    e.target.value = ''
    setImporting(true)
    setImportMsg(null)
    try {
      const text = await file.text()
      const rows = parsePropStreamCsv(text)
      if (rows.length === 0) {
        setImportMsg('No rows parsed — check the CSV format.')
        return
      }
      const { error } = await supabase.from('leads').insert(rows)
      if (error) {
        setImportMsg(`Import error: ${error.message}`)
      } else {
        setImportMsg(`Imported ${rows.length} lead${rows.length === 1 ? '' : 's'}.`)
        await fetchLeads()
      }
    } catch (err) {
      setImportMsg(`Failed to read file: ${String(err)}`)
    } finally {
      setImporting(false)
    }
  }

  const stageCount = (stage: LeadStage) => leads.filter(l => l.stage === stage).length

  const filters: FilterPill[] = useMemo(() => [
    { label: 'All', value: 'All', count: leads.length },
    ...STAGES.map(stage => ({ label: stage, value: stage, count: stageCount(stage) })),
  ], [leads])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return leads.filter(l => {
      if (activeStage !== 'All' && l.stage !== activeStage) return false
      if (!q) return true
      return (
        l.address?.toLowerCase().includes(q) ||
        l.city?.toLowerCase().includes(q) ||
        (l.owner_name?.toLowerCase().includes(q) ?? false)
      )
    })
  }, [leads, activeStage, query])

  const importError = importMsg && (importMsg.startsWith('Import') || importMsg.startsWith('Failed') || importMsg.startsWith('No rows'))

  return (
    <DesktopShell>
      <PageHeader
        eyebrow="Acquisition Desk"
        title="Leads Pipeline"
        subtitle={loading ? 'Loading pipeline…' : `${leads.length} active acquisition opportunit${leads.length === 1 ? 'y' : 'ies'}.`}
        primaryAction="+ Import Leads"
        secondaryAction={importing ? 'Importing…' : 'Import PropStream CSV'}
        onPrimary={() => navigate('/wholesale/leads/import')}
        onSecondary={() => fileInputRef.current?.click()}
      >
        <SearchBar value={query} onChange={setQuery} placeholder="Search address, city, or owner…" />
      </PageHeader>

      {/* Hidden file input — triggered by the secondary header action */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        style={{ display: 'none' }}
        onChange={handleCsvImport}
      />

      {importMsg && (
        <p style={{
          marginTop: 16, fontFamily: f.mono, fontSize: 12,
          color: importError ? C.danger : C.success,
        }}>
          {importMsg}
        </p>
      )}

      <FilterPills filters={filters} active={activeStage} onChange={(v) => setActiveStage(v as LeadStage | 'All')} />

      {loading ? (
        <p style={{ marginTop: 24, fontFamily: f.body, fontSize: 14, color: C.mute }}>Loading leads…</p>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={activeStage === 'All' && !query ? 'No Leads Yet' : 'No Matching Leads'}
          body={activeStage === 'All' && !query
            ? 'Import your first batch from PropStream to start building the acquisition pipeline.'
            : 'No leads match the current filter. Adjust the stage or search to see more.'}
          actions={activeStage === 'All' && !query
            ? <PrimaryButton label="Import Leads" onClick={() => navigate('/wholesale/leads/import')} />
            : undefined}
        />
      ) : (
        <div style={{
          marginTop: 24,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
          gap: 16,
        }}>
          {filtered.map(lead => (
            <LeadCard key={lead.id} lead={lead} onClick={() => navigate(`/wholesale/leads/${lead.id}`)} />
          ))}
        </div>
      )}
    </DesktopShell>
  )
}
