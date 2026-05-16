import { useState } from 'react'
import { Plus, ChevronDown, ChevronRight, Edit2, Trash2, Check, X } from 'lucide-react'
import { C, f } from '../../tokens.js'

const CATEGORY_LABELS = {
  'risk': 'Risk Management',
  'discipline': 'Discipline',
  'market-read': 'Market Read',
  'pattern': 'Chart Pattern',
  'entry-rule': 'Entry Rule',
  'analysis': 'Analysis',
  'custom': 'Custom',
};

export default function StrategyVault({ setups, onUpdate }) {
  const [expanded, setExpanded] = useState({});
  const [editing, setEditing] = useState(null);
  const [editDraft, setEditDraft] = useState({});
  const [adding, setAdding] = useState(false);
  const [newSetup, setNewSetup] = useState({ name: '', category: 'custom', description: '', confluences: [''] });

  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const startEdit = (setup) => {
    setEditing(setup.id);
    setEditDraft({ ...setup, confluences: [...setup.confluences] });
  };

  const saveEdit = () => {
    onUpdate(setups.map(s => s.id === editing ? { ...editDraft } : s));
    setEditing(null);
  };

  const deleteSetup = (id) => {
    onUpdate(setups.filter(s => s.id !== id));
  };

  const saveNew = () => {
    if (!newSetup.name.trim()) return;
    const entry = {
      ...newSetup,
      id: `setup-${Date.now()}`,
      editable: true,
      confluences: newSetup.confluences.filter(c => c.trim()),
    };
    onUpdate([...setups, entry]);
    setAdding(false);
    setNewSetup({ name: '', category: 'custom', description: '', confluences: [''] });
  };

  const inputStyle = {
    background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 3,
    color: C.text, fontFamily: f.body, fontSize: 12, padding: '6px 10px', width: '100%', boxSizing: 'border-box',
  };

  return (
    <div>
      {setups.map(setup => {
        const isExpanded = expanded[setup.id];
        const isEditing = editing === setup.id;
        return (
          <div key={setup.id} style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 0 }}>
            <div
              onClick={() => !isEditing && toggle(setup.id)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {isExpanded ? <ChevronDown size={12} style={{ color: C.mute }} /> : <ChevronRight size={12} style={{ color: C.mute }} />}
                <div>
                  <span style={{ fontFamily: f.body, fontSize: 13, color: C.text, fontWeight: 500 }}>{setup.name}</span>
                  <span style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, marginLeft: 10 }}>{CATEGORY_LABELS[setup.category] ?? setup.category}</span>
                </div>
              </div>
              {setup.editable && !isEditing && (
                <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                  <button onClick={() => startEdit(setup)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.mute }}><Edit2 size={12} /></button>
                  <button onClick={() => deleteSetup(setup.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.mute }}><Trash2 size={12} /></button>
                </div>
              )}
            </div>
            {isExpanded && !isEditing && (
              <div style={{ paddingLeft: 22, paddingBottom: 12 }}>
                <div style={{ fontFamily: f.body, fontSize: 12, color: C.sub, marginBottom: 8 }}>{setup.description}</div>
                <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Confluences Required</div>
                {setup.confluences.map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, fontFamily: f.body, fontSize: 12, color: C.sub }}>
                    <span style={{ color: C.gold }}>→</span> {c}
                  </div>
                ))}
              </div>
            )}
            {isEditing && (
              <div style={{ paddingLeft: 22, paddingBottom: 12 }}>
                <input value={editDraft.name} onChange={e => setEditDraft(p => ({ ...p, name: e.target.value }))} placeholder="Setup name" style={{ ...inputStyle, marginBottom: 8 }} />
                <textarea value={editDraft.description} onChange={e => setEditDraft(p => ({ ...p, description: e.target.value }))} placeholder="Description" style={{ ...inputStyle, height: 60, resize: 'vertical', marginBottom: 8 }} />
                <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, marginBottom: 6 }}>CONFLUENCES</div>
                {editDraft.confluences.map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                    <input value={c} onChange={e => setEditDraft(p => ({ ...p, confluences: p.confluences.map((x, j) => j === i ? e.target.value : x) }))} style={{ ...inputStyle }} />
                    <button onClick={() => setEditDraft(p => ({ ...p, confluences: p.confluences.filter((_, j) => j !== i) }))} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.mute }}><X size={12} /></button>
                  </div>
                ))}
                <button onClick={() => setEditDraft(p => ({ ...p, confluences: [...p.confluences, ''] }))} style={{ fontFamily: f.mono, fontSize: 10, color: C.gold, background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: 10 }}>+ Add confluence</button>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={saveEdit} style={{ fontFamily: f.mono, fontSize: 10, color: C.green, background: 'transparent', border: `1px solid ${C.green}33`, padding: '4px 12px', borderRadius: 2, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><Check size={10} /> Save</button>
                  <button onClick={() => setEditing(null)} style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, background: 'transparent', border: `1px solid ${C.border}`, padding: '4px 12px', borderRadius: 2, cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {!adding ? (
        <button onClick={() => setAdding(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: f.mono, fontSize: 10, color: C.gold, background: 'transparent', border: 'none', cursor: 'pointer', padding: '12px 0', letterSpacing: '0.08em' }}>
          <Plus size={12} /> Add Setup
        </button>
      ) : (
        <div style={{ paddingTop: 12 }}>
          <input value={newSetup.name} onChange={e => setNewSetup(p => ({ ...p, name: e.target.value }))} placeholder="Setup name" style={{ ...inputStyle, marginBottom: 8 }} />
          <select value={newSetup.category} onChange={e => setNewSetup(p => ({ ...p, category: e.target.value }))} style={{ ...inputStyle, marginBottom: 8 }}>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <textarea value={newSetup.description} onChange={e => setNewSetup(p => ({ ...p, description: e.target.value }))} placeholder="Description" style={{ ...inputStyle, height: 60, resize: 'vertical', marginBottom: 8 }} />
          {newSetup.confluences.map((c, i) => (
            <input key={i} value={c} onChange={e => setNewSetup(p => ({ ...p, confluences: p.confluences.map((x, j) => j === i ? e.target.value : x) }))} placeholder={`Confluence ${i + 1}`} style={{ ...inputStyle, marginBottom: 6 }} />
          ))}
          <button onClick={() => setNewSetup(p => ({ ...p, confluences: [...p.confluences, ''] }))} style={{ fontFamily: f.mono, fontSize: 10, color: C.gold, background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: 10, display: 'block' }}>+ Add confluence</button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={saveNew} style={{ fontFamily: f.mono, fontSize: 10, color: C.green, background: 'transparent', border: `1px solid ${C.green}33`, padding: '4px 12px', borderRadius: 2, cursor: 'pointer' }}>Save Setup</button>
            <button onClick={() => setAdding(false)} style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, background: 'transparent', border: `1px solid ${C.border}`, padding: '4px 12px', borderRadius: 2, cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
