import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { C, f } from '../../tokens.js'

const GRADES = ['A', 'B', 'C', 'F'];
const BLANK_TRADE = { ticker: '', setup: '', entry: '', exit: '', size: '', result: '', grade: 'B', notes: '', hadPlan: true, confluenceCount: 2, ruleBreak: false, date: Date.now() };

export default function TradeLogTable({ trades, onUpdate, showGrade = true }) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ ...BLANK_TRADE });

  const inputStyle = { background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 2, color: C.text, fontFamily: f.mono, fontSize: 11, padding: '4px 8px', width: '100%', boxSizing: 'border-box' };

  const save = () => {
    if (!draft.ticker.trim()) return;
    onUpdate([{ ...draft, id: `trade-${Date.now()}`, date: Date.now() }, ...trades]);
    setDraft({ ...BLANK_TRADE });
    setAdding(false);
  };

  const remove = (id) => onUpdate(trades.filter(t => t.id !== id));

  const pnl = (t) => {
    if (!t.entry || !t.exit || !t.size) return null;
    return ((parseFloat(t.exit) - parseFloat(t.entry)) * parseFloat(t.size)).toFixed(0);
  };

  const gradeColor = (g) => ({ A: C.green, B: C.gold, C: C.sub, F: C.red }[g] ?? C.mute);

  return (
    <div>
      <div style={{ overflowX: 'auto' }}>
        <table className="tl-table" style={{ width: '100%', borderCollapse: 'collapse', fontFamily: f.mono, fontSize: 11 }}>
          <thead className="tl-head">
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['Ticker', 'Setup', 'Entry', 'Exit', 'Size', 'P&L', ...(showGrade ? ['Grade'] : []), 'Notes', ''].map(h => (
                <th key={h} style={{ padding: '6px 10px', textAlign: 'left', color: C.mute, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: 10 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {adding && (
              <tr className="tl-row tl-row-edit" style={{ borderBottom: `1px solid ${C.border}` }}>
                <td className="tl-cell" data-label="Ticker" style={{ padding: '6px 4px' }}><input value={draft.ticker} onChange={e => setDraft(p => ({ ...p, ticker: e.target.value.toUpperCase() }))} placeholder="SPY" style={inputStyle} /></td>
                <td className="tl-cell" data-label="Setup" style={{ padding: '6px 4px' }}><input value={draft.setup} onChange={e => setDraft(p => ({ ...p, setup: e.target.value }))} placeholder="Bear flag" style={inputStyle} /></td>
                <td className="tl-cell" data-label="Entry" style={{ padding: '6px 4px' }}><input value={draft.entry} onChange={e => setDraft(p => ({ ...p, entry: e.target.value }))} placeholder="0.00" style={inputStyle} /></td>
                <td className="tl-cell" data-label="Exit" style={{ padding: '6px 4px' }}><input value={draft.exit} onChange={e => setDraft(p => ({ ...p, exit: e.target.value }))} placeholder="0.00" style={inputStyle} /></td>
                <td className="tl-cell" data-label="Size" style={{ padding: '6px 4px' }}><input value={draft.size} onChange={e => setDraft(p => ({ ...p, size: e.target.value }))} placeholder="1" style={inputStyle} /></td>
                <td className="tl-cell" data-label="P&L" style={{ padding: '6px 10px', color: C.mute }}>—</td>
                {showGrade && (
                  <td className="tl-cell" data-label="Grade" style={{ padding: '6px 4px' }}>
                    <select value={draft.grade} onChange={e => setDraft(p => ({ ...p, grade: e.target.value }))} style={inputStyle}>
                      {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </td>
                )}
                <td className="tl-cell" data-label="Notes" style={{ padding: '6px 4px' }}><input value={draft.notes} onChange={e => setDraft(p => ({ ...p, notes: e.target.value }))} placeholder="Notes" style={inputStyle} /></td>
                <td className="tl-cell tl-actions" style={{ padding: '6px 4px', display: 'flex', gap: 4 }}>
                  <button onClick={save} style={{ fontFamily: f.mono, fontSize: 10, color: C.green, background: 'transparent', border: `1px solid ${C.green}33`, padding: '3px 8px', borderRadius: 2, cursor: 'pointer' }}>Save</button>
                  <button onClick={() => setAdding(false)} style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, background: 'transparent', border: `1px solid ${C.border}`, padding: '3px 8px', borderRadius: 2, cursor: 'pointer' }}>✕</button>
                </td>
              </tr>
            )}
            {trades.length === 0 && !adding && (
              <tr><td colSpan={showGrade ? 9 : 8} style={{ padding: '20px 10px', color: C.mute, textAlign: 'center' }}>No trades logged yet</td></tr>
            )}
            {trades.map(t => {
              const p = pnl(t);
              return (
                <tr key={t.id} className="tl-row" style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td className="tl-cell tl-ticker" data-label="Ticker" style={{ padding: '8px 10px', color: C.text, fontWeight: 600 }}>{t.ticker}</td>
                  <td className="tl-cell" data-label="Setup" style={{ padding: '8px 10px', color: C.sub }}>{t.setup || '—'}</td>
                  <td className="tl-cell" data-label="Entry" style={{ padding: '8px 10px', color: C.sub }}>{t.entry ? `$${t.entry}` : '—'}</td>
                  <td className="tl-cell" data-label="Exit" style={{ padding: '8px 10px', color: C.sub }}>{t.exit ? `$${t.exit}` : '—'}</td>
                  <td className="tl-cell" data-label="Size" style={{ padding: '8px 10px', color: C.sub }}>{t.size || '—'}</td>
                  <td className="tl-cell" data-label="P&L" style={{ padding: '8px 10px', color: p ? (parseFloat(p) >= 0 ? C.green : C.red) : C.mute, fontWeight: 600 }}>
                    {p ? `${parseFloat(p) >= 0 ? '+' : ''}$${p}` : '—'}
                  </td>
                  {showGrade && <td className="tl-cell" data-label="Grade" style={{ padding: '8px 10px', color: gradeColor(t.grade), fontWeight: 700 }}>{t.grade}</td>}
                  <td className="tl-cell tl-notes" data-label="Notes" style={{ padding: '8px 10px', color: C.mute, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.notes || '—'}</td>
                  <td className="tl-cell tl-actions" style={{ padding: '8px 4px' }}>
                    <button onClick={() => remove(t.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.mute }}><Trash2 size={11} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <style>{`
        @media (max-width: 767px) {
          /* Reflow the trade log table into stacked cards (label: value) */
          .tl-table, .tl-table tbody { display: block; width: 100%; }
          .tl-head { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
          .tl-row {
            display: block;
            border: 1px solid ${C.border} !important;
            border-radius: 4px;
            margin-bottom: 10px;
            padding: 6px 12px;
            background: ${C.surface2};
          }
          .tl-cell {
            display: flex !important;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            padding: 5px 0 !important;
            max-width: none !important;
            white-space: normal !important;
            overflow: visible !important;
            text-overflow: clip !important;
            border-bottom: 1px solid ${C.border}55;
            text-align: right;
          }
          .tl-row .tl-cell:last-child { border-bottom: none; }
          .tl-cell::before {
            content: attr(data-label);
            color: ${C.mute};
            font-family: ${f.mono};
            font-size: 10px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            text-align: left;
            flex: 0 0 auto;
          }
          .tl-cell.tl-actions { justify-content: flex-end; }
          .tl-cell.tl-actions::before { content: ''; }
          .tl-cell input, .tl-cell select { width: 60% !important; }
        }
      `}</style>
      {!adding && (
        <button onClick={() => setAdding(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: f.mono, fontSize: 10, color: C.gold, background: 'transparent', border: 'none', cursor: 'pointer', padding: '10px 0', letterSpacing: '0.08em' }}>
          <Plus size={11} /> Log Trade
        </button>
      )}
    </div>
  );
}
