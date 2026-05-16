import { C, f } from '../../tokens.js'
import { getRankForXP } from '../../data/tradingData.js'

export default function XPProgressBar({ xp, ranks }) {
  const current = getRankForXP(xp, ranks);
  const nextRank = ranks.find(r => r.xpMin > current.xpMin);
  const progress = nextRank
    ? Math.min(100, ((xp - current.xpMin) / (nextRank.xpMin - current.xpMin)) * 100)
    : 100;

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: current.color }} />
      <div style={{ fontFamily: f.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.mute, marginBottom: 6 }}>Current XP</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
        <span style={{ fontFamily: f.display, fontSize: 26, color: current.color }}>{xp.toLocaleString()}</span>
        {nextRank && <span style={{ fontFamily: f.mono, fontSize: 11, color: C.mute }}>/ {nextRank.xpMin.toLocaleString()} for {nextRank.badge} {nextRank.name}</span>}
      </div>
      <div style={{ height: 4, background: C.border, borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: current.color, borderRadius: 2, transition: 'width 0.4s ease' }} />
      </div>
    </div>
  );
}
