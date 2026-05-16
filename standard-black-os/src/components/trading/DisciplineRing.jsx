import { C, f } from '../../tokens.js'

export default function DisciplineRing({ score }) {
  const radius = 28;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - score / 100);
  const color = score >= 80 ? C.green : score >= 60 ? C.gold : C.red;

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: color }} />
      <div style={{ fontFamily: f.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.mute, marginBottom: 10 }}>Discipline Score</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <svg width={72} height={72} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={36} cy={36} r={radius} fill="none" stroke={C.border} strokeWidth={5} />
          <circle cx={36} cy={36} r={radius} fill="none" stroke={color} strokeWidth={5}
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
        </svg>
        <div>
          <div style={{ fontFamily: f.display, fontSize: 32, color, lineHeight: 1 }}>{score}%</div>
          <div style={{ fontFamily: f.body, fontSize: 11, color: C.mute, marginTop: 4 }}>
            {score >= 80 ? 'Excellent discipline' : score >= 60 ? 'Needs improvement' : 'Rule breaks detected'}
          </div>
        </div>
      </div>
    </div>
  );
}
