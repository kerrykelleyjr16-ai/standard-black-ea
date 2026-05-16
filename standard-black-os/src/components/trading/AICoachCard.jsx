import { Brain } from 'lucide-react'
import { C, f } from '../../tokens.js'

function generateCoachSuggestion(data) {
  const { trades, disciplineScore, ruleBreaksThisWeek } = data;
  if (!trades.length) return { focus: 'Get Started', suggestion: 'Log your first trade to begin tracking your development. Complete the 4 Pillars checklist before entering any position.' };
  if (ruleBreaksThisWeek > 3) return { focus: 'Rule Discipline', suggestion: `You have ${ruleBreaksThisWeek} rule breaks this week. Stop trading until you review each break. Identify the trigger — emotional? rushed? — and write it in your journal.` };
  if (disciplineScore < 60) return { focus: 'Trade Planning', suggestion: 'Discipline score below 60%. Every trade needs a written plan with 2+ confluences before entry. No plan = no trade. Non-negotiable.' };
  const fTrades = trades.filter(t => t.grade === 'F');
  if (fTrades.length >= 3) return { focus: 'Setup Quality', suggestion: `${fTrades.length} F-grade trades logged. Review each one: was there a plan? Did you have confluences? Find the pattern and eliminate it.` };
  const wins = trades.filter(t => ((parseFloat(t.exit) - parseFloat(t.entry)) * parseFloat(t.size) || 0) > 0).length;
  const winRate = wins / trades.length;
  if (winRate < 0.5) return { focus: 'Setup Selection', suggestion: `Win rate at ${Math.round(winRate * 100)}%. Focus on your highest-grade setups only. Cut anything below a B from your playbook until win rate exceeds 50%.` };
  return { focus: 'Stay Consistent', suggestion: `Discipline at ${disciplineScore}%. You're in a good rhythm. Keep logging every trade, complete weekly reviews, and only increase size when win rate is consistently above 60%.` };
}

export default function AICoachCard({ data }) {
  const { focus, suggestion } = generateCoachSuggestion(data);

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: '16px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: C.gold }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Brain size={14} style={{ color: C.gold }} />
        <div style={{ fontFamily: f.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.mute }}>Trading Coach</div>
        <div style={{ marginLeft: 'auto', padding: '3px 10px', background: `${C.gold}14`, border: `1px solid ${C.goldDim}`, borderRadius: 2 }}>
          <span style={{ fontFamily: f.mono, fontSize: 9, color: C.gold, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Focus: {focus}</span>
        </div>
      </div>
      <p style={{ fontFamily: f.body, fontSize: 13, color: C.sub, lineHeight: 1.6, margin: 0 }}>{suggestion}</p>
    </div>
  );
}
