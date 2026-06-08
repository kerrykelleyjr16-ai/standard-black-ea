import { C, f } from '../../tokens.js'

const PHASES = [
  { id: 'pre-market', label: 'Pre-Market',   desc: 'Bias · Watchlist · Plan' },
  { id: 'live',       label: 'Live Trading',  desc: 'Execute · Track · Manage' },
  { id: 'review',     label: 'Review',        desc: 'Grade · Journal · Improve' },
];

export default function SessionFlowBar({ phase, onPhaseChange }) {
  const currentIdx = PHASES.findIndex(p => p.id === phase);

  return (
    <div className="sfb-bar" style={{
      display: 'flex', alignItems: 'center', gap: 0,
      background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4,
      padding: '10px 16px', marginBottom: 20,
    }}>
      <div style={{ fontFamily: f.mono, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.mute, marginRight: 20, whiteSpace: 'nowrap' }}>
        Session Phase
      </div>
      <div className="sfb-track" style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
        {PHASES.map((p, idx) => {
          const done = idx < currentIdx;
          const active = idx === currentIdx;
          return (
            <div key={p.id} className="sfb-step" style={{ display: 'flex', alignItems: 'center', flex: idx < PHASES.length - 1 ? 1 : 0 }}>
              <button
                onClick={() => onPhaseChange(p.id)}
                className="sfb-btn"
                style={{
                  display: 'flex', flexDirection: 'column', gap: 2,
                  padding: '6px 14px', borderRadius: 2, cursor: 'pointer',
                  background: active ? 'rgba(201,162,74,0.08)' : 'transparent',
                  border: `1px solid ${active ? C.gold : done ? C.green : C.border}`,
                  color: active ? C.gold : done ? C.green : C.mute,
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ fontFamily: f.mono, fontSize: 11, fontWeight: active ? 600 : 400 }}>
                  {done ? '✓ ' : active ? '● ' : ''}{p.label}
                </span>
                <span style={{ fontFamily: f.body, fontSize: 10, color: C.mute }}>{p.desc}</span>
              </button>
              {idx < PHASES.length - 1 && (
                <div className="sfb-connector" style={{ flex: 1, height: 1, background: done ? C.green : C.border, margin: '0 8px' }} />
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 767px) {
          /* Stack session phases vertically so they don't overflow sideways */
          .sfb-bar { flex-direction: column; align-items: stretch; gap: 10px; }
          .sfb-bar > div:first-child { margin-right: 0 !important; }
          .sfb-track { flex-direction: column; align-items: stretch; gap: 8px; }
          .sfb-step { flex-direction: column; align-items: stretch; flex: 1 1 auto !important; }
          .sfb-btn { width: 100%; box-sizing: border-box; align-items: flex-start; white-space: normal !important; }
          .sfb-connector { display: none !important; }
        }
      `}</style>
    </div>
  );
}
