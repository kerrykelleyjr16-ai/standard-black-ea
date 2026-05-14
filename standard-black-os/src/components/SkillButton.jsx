import { Play, Pause } from 'lucide-react'
import { C, f } from '../tokens.js'
import Pill from './Pill.jsx'

export default function SkillButton({ skill, running, onClick }) {
  const isPlanned = skill.status === 'planned';
  return (
    <button
      onClick={() => !isPlanned && !running && onClick(skill)}
      disabled={running || isPlanned}
      style={{
        width: '100%', textAlign: 'left',
        background: running ? 'rgba(201,162,74,0.08)' : C.surface2,
        border: `1px solid ${running ? C.gold : C.border}`,
        padding: '10px 12px', borderRadius: 3,
        cursor: isPlanned ? 'default' : running ? 'default' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
        transition: 'all 0.15s', marginBottom: 6, opacity: isPlanned ? 0.5 : 1,
      }}
      onMouseEnter={e => { if (!running && !isPlanned) { e.currentTarget.style.borderColor = C.borderHi; e.currentTarget.style.background = '#1c1c1c'; }}}
      onMouseLeave={e => { if (!running && !isPlanned) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.surface2; }}}
    >
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontFamily: f.body, fontSize: 13, color: C.text, fontWeight: 500, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
          {skill.name}
          {isPlanned && <Pill tone="planned">planned</Pill>}
        </div>
        <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, letterSpacing: '0.04em' }}>
          /{skill.id} · {skill.runs} runs · {skill.last}
        </div>
      </div>
      {!isPlanned && (
        <div style={{
          width: 24, height: 24, borderRadius: 12,
          background: running ? C.gold : 'transparent',
          border: `1px solid ${running ? C.gold : C.borderHi}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
        }}>
          {running ? <Pause size={10} style={{ color: C.bg }} /> : <Play size={10} style={{ color: C.gold }} />}
        </div>
      )}
    </button>
  );
}
