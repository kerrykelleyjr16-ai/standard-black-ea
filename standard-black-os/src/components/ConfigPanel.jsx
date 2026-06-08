import { useState } from 'react'
import { X, Save, CheckCircle2, Clock } from 'lucide-react'
import { C, f } from '../tokens.js'

const MCP_SERVERS = [
  { name: 'Gmail', status: 'connected' },
  { name: 'Google Calendar', status: 'connected' },
  { name: 'Google Drive', status: 'connected' },
  { name: 'Canva', status: 'connected' },
  { name: 'Docusign', status: 'connected' },
  { name: 'Zapier', status: 'connected' },
];

export default function ConfigPanel({ open, onClose, ventures, automations, onSaveVentures, onToggleAutomation }) {
  const [tab, setTab] = useState('kpi');
  const [editValues, setEditValues] = useState(() =>
    Object.fromEntries(ventures.map(v => [v.id, { value: v.kpi.value, target: v.kpi.target, status: v.status }]))
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const updated = ventures.map(v => ({
      ...v,
      status: editValues[v.id]?.status ?? v.status,
      kpi: { ...v.kpi, value: editValues[v.id]?.value ?? v.kpi.value, target: editValues[v.id]?.target ?? v.kpi.target },
    }));
    onSaveVentures(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
      />
      {/* Panel */}
      <div className="sb-config-panel" style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, maxWidth: '100vw',
        background: C.surface, borderLeft: `1px solid ${C.border}`,
        zIndex: 50, display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: `1px solid ${C.border}`, background: C.surface2,
        }}>
          <div style={{ fontFamily: f.display, fontSize: 14, color: C.text, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Config
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.mute, padding: 4 }}>
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}` }}>
          {[{ id: 'kpi', label: 'KPI Editor' }, { id: 'status', label: 'System Status' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '12px 16px', background: 'transparent', border: 'none',
              borderBottom: `2px solid ${tab === t.id ? C.gold : 'transparent'}`,
              color: tab === t.id ? C.gold : C.mute, fontFamily: f.mono, fontSize: 10,
              letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.15s',
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {tab === 'kpi' && (
            <div>
              {ventures.map(v => (
                <div key={v.id} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ fontFamily: f.body, fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 12 }}>
                    {v.name}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                    <div>
                      <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>
                        Current Value
                      </div>
                      <input
                        value={editValues[v.id]?.value ?? v.kpi.value}
                        onChange={e => setEditValues(ev => ({ ...ev, [v.id]: { ...ev[v.id], value: e.target.value } }))}
                        style={{
                          width: '100%', background: C.surface2, border: `1px solid ${C.border}`,
                          borderRadius: 2, padding: '7px 10px', color: C.text,
                          fontFamily: f.mono, fontSize: 12, outline: 'none',
                        }}
                      />
                    </div>
                    <div>
                      <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>
                        Target
                      </div>
                      <input
                        value={editValues[v.id]?.target ?? v.kpi.target}
                        onChange={e => setEditValues(ev => ({ ...ev, [v.id]: { ...ev[v.id], target: e.target.value } }))}
                        style={{
                          width: '100%', background: C.surface2, border: `1px solid ${C.border}`,
                          borderRadius: 2, padding: '7px 10px', color: C.text,
                          fontFamily: f.mono, fontSize: 12, outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5 }}>
                      Status
                    </div>
                    <select
                      value={editValues[v.id]?.status ?? v.status}
                      onChange={e => setEditValues(ev => ({ ...ev, [v.id]: { ...ev[v.id], status: e.target.value } }))}
                      style={{
                        background: C.surface2, border: `1px solid ${C.border}`,
                        borderRadius: 2, padding: '7px 10px', color: C.text,
                        fontFamily: f.mono, fontSize: 12, outline: 'none', width: '100%',
                      }}
                    >
                      <option value="active">active</option>
                      <option value="planning">planning</option>
                      <option value="paused">paused</option>
                      <option value="concept">concept</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'status' && (
            <div>
              <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>
                MCP Servers
              </div>
              {MCP_SERVERS.map(s => (
                <div key={s.name} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 0', borderBottom: `1px solid ${C.border}`,
                }}>
                  <span style={{ fontFamily: f.body, fontSize: 13, color: C.text }}>{s.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: 3, background: C.green, display: 'inline-block' }} />
                    <span style={{ fontFamily: f.mono, fontSize: 10, color: C.green, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {s.status}
                    </span>
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 24, fontFamily: f.mono, fontSize: 10, color: C.mute, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 14 }}>
                Automations
              </div>
              {automations.map(a => (
                <div key={a.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 0', borderBottom: `1px solid ${C.border}`,
                }}>
                  <div>
                    <div style={{ fontFamily: f.body, fontSize: 13, color: C.text }}>{a.name}</div>
                    <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, marginTop: 2 }}>
                      <Clock size={9} style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} />
                      {a.cron}
                    </div>
                  </div>
                  <button onClick={() => onToggleAutomation(a.id)} style={{
                    width: 36, height: 20, borderRadius: 10,
                    background: a.on ? C.gold : C.border,
                    border: 'none', position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
                  }}>
                    <span style={{
                      position: 'absolute', top: 2, left: a.on ? 18 : 2,
                      width: 16, height: 16, borderRadius: 8,
                      background: a.on ? C.bg : C.sub, transition: 'left 0.2s',
                    }} />
                  </button>
                </div>
              ))}

              <div style={{ marginTop: 24, padding: 14, background: C.surface2, borderRadius: 3, border: `1px solid ${C.border}` }}>
                <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
                  Agent Registry
                </div>
                <div style={{ fontFamily: f.body, fontSize: 13, color: C.text }}>18 agents registered</div>
                <div style={{ fontFamily: f.mono, fontSize: 11, color: C.mute, marginTop: 4 }}>Sprint 1 complete · Agents 02–07 active</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer — save button for KPI tab */}
        {tab === 'kpi' && (
          <div style={{ padding: '16px 20px', borderTop: `1px solid ${C.border}`, background: C.surface2 }}>
            <button
              onClick={handleSave}
              style={{
                width: '100%', padding: '10px', borderRadius: 2, cursor: 'pointer',
                background: saved ? 'rgba(62,166,118,0.15)' : 'rgba(201,162,74,0.1)',
                border: `1px solid ${saved ? C.green : C.goldDim}`,
                color: saved ? C.green : C.gold, fontFamily: f.mono, fontSize: 11,
                letterSpacing: '0.12em', textTransform: 'uppercase', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {saved ? <><CheckCircle2 size={14} /> Saved</> : <><Save size={14} /> Save Changes</>}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 767px) {
          .sb-config-panel { width: 100vw !important; }
        }
      `}</style>
    </>
  );
}
