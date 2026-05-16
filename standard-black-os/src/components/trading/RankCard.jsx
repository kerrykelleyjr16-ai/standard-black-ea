import { C, f } from '../../tokens.js'
import { getRankForXP } from '../../data/tradingData.js'

export default function RankCard({ xp, ranks, promotionStatus, demotionWarning }) {
  const current = getRankForXP(xp, ranks);
  const nextRank = ranks.find(r => r.xpMin > current.xpMin);

  return (
    <div style={{ background: C.surface, border: `1px solid ${demotionWarning ? C.red : C.border}`, borderRadius: 4, padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: current.color }} />
      <div style={{ fontFamily: f.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.mute, marginBottom: 8 }}>Trading Rank</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <div style={{ fontSize: 36, lineHeight: 1 }}>{current.badge}</div>
        <div>
          <div style={{ fontFamily: f.display, fontSize: 22, color: current.color, letterSpacing: '0.05em' }}>{current.name}</div>
          <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, marginTop: 3 }}>
            {promotionStatus === 'on-track' ? '✓ On track for promotion' : promotionStatus}
          </div>
        </div>
      </div>
      {nextRank && (
        <div style={{ fontFamily: f.body, fontSize: 11, color: C.mute }}>
          Next: {nextRank.badge} {nextRank.name} at {nextRank.xpMin.toLocaleString()} XP
        </div>
      )}
      {demotionWarning && (
        <div style={{ marginTop: 8, padding: '6px 10px', background: `${C.red}14`, border: `1px solid ${C.red}33`, borderRadius: 3 }}>
          <span style={{ fontFamily: f.body, fontSize: 11, color: C.red }}>⚠ Demotion warning — reduce rule breaks</span>
        </div>
      )}
    </div>
  );
}
