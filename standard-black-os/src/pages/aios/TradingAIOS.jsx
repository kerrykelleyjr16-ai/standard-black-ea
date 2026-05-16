import { useState } from 'react'
import { RotateCcw, Plus, Minus } from 'lucide-react'
import { C, f } from '../../tokens.js'
import { awardXP, getRankForXP, getDisciplineScore, getRuleBreaksThisWeek, resetTradingRankings } from '../../data/tradingData.js'
import Panel from '../../components/Panel.jsx'
import RankCard from '../../components/trading/RankCard.jsx'
import XPProgressBar from '../../components/trading/XPProgressBar.jsx'
import DisciplineRing from '../../components/trading/DisciplineRing.jsx'
import TradeLogTable from '../../components/trading/TradeLogTable.jsx'
import AICoachCard from '../../components/trading/AICoachCard.jsx'

const gradeColor = (g) => ({ A: C.green, B: C.gold, C: C.sub, F: C.red }[g] ?? C.mute);

function getSetupPerformance(trades) {
  const map = {};
  trades.forEach(t => {
    if (!t.setup) return;
    if (!map[t.setup]) map[t.setup] = { setup: t.setup, count: 0, wins: 0, total: 0 };
    map[t.setup].count++;
    const pnl = (parseFloat(t.exit) - parseFloat(t.entry)) * parseFloat(t.size) || 0;
    if (pnl > 0) map[t.setup].wins++;
    map[t.setup].total += pnl;
  });
  return Object.values(map).sort((a, b) => b.count - a.count);
}

function getMistakePatterns(trades) {
  const patterns = [];
  const noConfluence = trades.filter(t => t.confluenceCount < 2);
  if (noConfluence.length) patterns.push({ pattern: 'Entered without 2+ confluences', count: noConfluence.length, cost: noConfluence.reduce((s, t) => s + ((parseFloat(t.exit) - parseFloat(t.entry)) * parseFloat(t.size) || 0), 0) });
  const noPlan = trades.filter(t => !t.hadPlan);
  if (noPlan.length) patterns.push({ pattern: 'No written plan before entry', count: noPlan.length, cost: noPlan.reduce((s, t) => s + ((parseFloat(t.exit) - parseFloat(t.entry)) * parseFloat(t.size) || 0), 0) });
  const fGrades = trades.filter(t => t.grade === 'F');
  if (fGrades.length) patterns.push({ pattern: 'F-grade trades (gut/emotional)', count: fGrades.length, cost: fGrades.reduce((s, t) => s + ((parseFloat(t.exit) - parseFloat(t.entry)) * parseFloat(t.size) || 0), 0) });
  return patterns;
}

function getWeeklyTrades(trades) {
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return trades.filter(t => t.date > oneWeekAgo);
}

export default function TradingAIOS({ data, persist }) {
  const [xpAdjust, setXpAdjust] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [xpValsDraft, setXpValsDraft] = useState({ ...data.xpValues });
  const [ranksDraft, setRanksDraft] = useState([...data.ranks]);

  const setupPerformance = getSetupPerformance(data.trades);
  const mistakePatterns = getMistakePatterns(data.trades);
  const weeklyTrades = getWeeklyTrades(data.trades);
  const weeklyPnL = weeklyTrades.reduce((s, t) => s + ((parseFloat(t.exit) - parseFloat(t.entry)) * parseFloat(t.size) || 0), 0);
  const weeklyGoodTrades = weeklyTrades.filter(t => t.grade === 'A' || t.grade === 'B').length;
  const weeklyGrade = weeklyTrades.length === 0 ? '—' : weeklyGoodTrades / weeklyTrades.length >= 0.7 ? 'A' : weeklyGoodTrades / weeklyTrades.length >= 0.5 ? 'B' : 'C';
  const ruleBreaks = getRuleBreaksThisWeek(data.trades);
  const bestSetup = setupPerformance[0];
  const worstMistake = [...mistakePatterns].sort((a, b) => b.count - a.count)[0];

  const manualAdjustXP = (dir) => {
    const amount = parseInt(xpAdjust) || 0;
    if (!amount) return;
    const newXP = Math.max(0, data.xp + (dir === 'add' ? amount : -amount));
    const rank = getRankForXP(newXP, data.ranks);
    persist({
      ...data,
      xp: newXP,
      rankId: rank.id,
      xpHistory: [{ ts: Date.now(), action: `manual-${dir}`, amount: dir === 'add' ? amount : -amount }, ...data.xpHistory].slice(0, 200),
    });
    setXpAdjust('');
  };

  const handleReset = () => {
    persist(resetTradingRankings(data));
    setShowResetConfirm(false);
  };

  const saveSettings = () => {
    persist({ ...data, xpValues: xpValsDraft, ranks: ranksDraft });
    setSettingsOpen(false);
  };

  const updateJournalTrades = (trades) => {
    const disc = getDisciplineScore(trades);
    const breaks = getRuleBreaksThisWeek(trades);
    const wins = trades.filter(t => (parseFloat(t.exit) - parseFloat(t.entry)) * parseFloat(t.size) > 0).length;
    const demotion = data.demotionsEnabled && breaks > 5;
    persist({
      ...data, trades, disciplineScore: disc, ruleBreaksThisWeek: breaks,
      positiveTrackedTrades: wins, demotionWarning: demotion,
      promotionStatus: disc >= 75 && breaks <= 2 ? 'on-track' : 'needs-improvement',
    });
  };

  const inputStyle = { background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 2, color: C.text, fontFamily: f.mono, fontSize: 12, padding: '6px 10px', boxSizing: 'border-box' };
  const smallLabel = { fontFamily: f.mono, fontSize: 10, color: C.mute, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4, display: 'block' };

  return (
    <div>
      {/* Top Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        <RankCard xp={data.xp} ranks={data.ranks} promotionStatus={data.promotionStatus} demotionWarning={data.demotionWarning} />
        <XPProgressBar xp={data.xp} ranks={data.ranks} />
        <DisciplineRing score={data.disciplineScore} />
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: data.promotionStatus === 'on-track' ? C.green : C.red }} />
          <div style={{ fontFamily: f.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.mute, marginBottom: 8 }}>Promotion Status</div>
          <div style={{ fontFamily: f.display, fontSize: 18, color: data.promotionStatus === 'on-track' ? C.green : C.red, marginBottom: 6 }}>
            {data.promotionStatus === 'on-track' ? '✓ On Track' : 'Needs Work'}
          </div>
          <div style={{ fontFamily: f.body, fontSize: 11, color: C.mute }}>
            {data.positiveTrackedTrades} profitable · {ruleBreaks} rule breaks this week
          </div>
          {data.demotionWarning && data.demotionsEnabled && (
            <div style={{ marginTop: 8, padding: '6px 10px', background: `${C.red}14`, border: `1px solid ${C.red}33`, borderRadius: 3, fontFamily: f.body, fontSize: 11, color: C.red }}>⚠ Demotion risk</div>
          )}
        </div>
      </div>

      {/* Middle */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 20 }}>

        <Panel title={`Trade Journal · ${data.trades.length} entries`} dense>
          <TradeLogTable trades={data.trades} onUpdate={updateJournalTrades} />
        </Panel>

        <Panel title="Setup Grader">
          {setupPerformance.length === 0 && <div style={{ color: C.mute, fontSize: 12 }}>Log trades with setup types to see grading</div>}
          {setupPerformance.map(sp => {
            const winRate = sp.count ? Math.round((sp.wins / sp.count) * 100) : 0;
            const avgGrade = winRate >= 70 ? 'A' : winRate >= 50 ? 'B' : winRate >= 30 ? 'C' : 'F';
            return (
              <div key={sp.setup} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 10, borderBottom: `1px solid ${C.border}`, marginBottom: 10 }}>
                <div>
                  <div style={{ fontFamily: f.body, fontSize: 13, color: C.text }}>{sp.setup}</div>
                  <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute }}>{sp.count} trades · {winRate}% win rate</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontFamily: f.mono, fontSize: 11, color: sp.total >= 0 ? C.green : C.red }}>{sp.total >= 0 ? '+' : ''}${sp.total.toFixed(0)}</span>
                  <span style={{ fontFamily: f.display, fontSize: 18, color: gradeColor(avgGrade), fontWeight: 700 }}>{avgGrade}</span>
                </div>
              </div>
            );
          })}
        </Panel>

        <Panel title="Mistake Pattern Detector">
          {mistakePatterns.length === 0 && <div style={{ color: C.green, fontSize: 12 }}>No patterns detected — clean execution</div>}
          {mistakePatterns.map((m, i) => (
            <div key={i} style={{ paddingBottom: 12, borderBottom: `1px solid ${C.border}`, marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontFamily: f.body, fontSize: 12, color: C.text }}>{m.pattern}</span>
                <span style={{ fontFamily: f.mono, fontSize: 11, background: `${C.red}14`, color: C.red, padding: '2px 8px', borderRadius: 2 }}>{m.count}×</span>
              </div>
              <div style={{ fontFamily: f.mono, fontSize: 11, color: m.cost < 0 ? C.red : C.mute }}>
                Net P&L impact: {m.cost >= 0 ? '+' : ''}${m.cost.toFixed(0)}
              </div>
            </div>
          ))}
        </Panel>
      </div>

      {/* Bottom */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 20 }}>

        <Panel title="Weekly Review Engine">
          <div style={{ display: 'grid', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div><span style={smallLabel}>Trades This Week</span><span style={{ fontFamily: f.display, fontSize: 22, color: C.text }}>{weeklyTrades.length}</span></div>
              <div><span style={smallLabel}>Weekly P&L</span><span style={{ fontFamily: f.display, fontSize: 22, color: weeklyPnL >= 0 ? C.green : C.red }}>{weeklyPnL >= 0 ? '+' : ''}${weeklyPnL.toFixed(0)}</span></div>
              <div><span style={smallLabel}>Weekly Grade</span><span style={{ fontFamily: f.display, fontSize: 22, color: gradeColor(weeklyGrade) }}>{weeklyGrade}</span></div>
            </div>
            <div style={{ paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
              <span style={smallLabel}>Best Setup This Week</span>
              <span style={{ fontFamily: f.body, fontSize: 13, color: C.text }}>{bestSetup?.setup ?? '—'}</span>
            </div>
            <div>
              <span style={smallLabel}>Top Mistake This Week</span>
              <span style={{ fontFamily: f.body, fontSize: 13, color: worstMistake ? C.red : C.mute }}>{worstMistake?.pattern ?? 'None detected'}</span>
            </div>
            <div>
              <span style={smallLabel}>Rule Breaks</span>
              <span style={{ fontFamily: f.mono, fontSize: 18, color: ruleBreaks > 3 ? C.red : ruleBreaks > 0 ? C.gold : C.green }}>{ruleBreaks}</span>
            </div>
          </div>
        </Panel>

        <Panel title="Strategy Performance Tracker">
          {setupPerformance.length === 0 && <div style={{ color: C.mute, fontSize: 12 }}>No data yet — log trades with setup types</div>}
          {setupPerformance.slice(0, 6).map(sp => {
            const wr = sp.count ? Math.round((sp.wins / sp.count) * 100) : 0;
            return (
              <div key={sp.setup} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontFamily: f.body, fontSize: 12, color: C.text }}>{sp.setup}</span>
                  <span style={{ fontFamily: f.mono, fontSize: 11, color: wr >= 60 ? C.green : wr >= 40 ? C.gold : C.red }}>{wr}%</span>
                </div>
                <div style={{ height: 4, background: C.border, borderRadius: 2 }}>
                  <div style={{ height: '100%', width: `${wr}%`, background: wr >= 60 ? C.green : wr >= 40 ? C.gold : C.red, borderRadius: 2 }} />
                </div>
                <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, marginTop: 3 }}>{sp.count} trades · ${sp.total.toFixed(0)} net</div>
              </div>
            );
          })}
        </Panel>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <AICoachCard data={data} />
          <Panel title="XP History" action={<span style={{ fontFamily: f.mono, fontSize: 10, color: C.mute }}>{data.xpHistory.length} events</span>}>
            {data.xpHistory.slice(0, 5).map((e, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < 4 ? `1px solid ${C.border}` : 'none' }}>
                <span style={{ fontFamily: f.body, fontSize: 11, color: C.sub }}>{e.action}</span>
                <span style={{ fontFamily: f.mono, fontSize: 11, color: e.amount >= 0 ? C.green : C.red }}>{e.amount >= 0 ? '+' : ''}{e.amount} XP</span>
              </div>
            ))}
            {!data.xpHistory.length && <div style={{ color: C.mute, fontSize: 11 }}>No XP events yet</div>}
          </Panel>
        </div>
      </div>

      {/* Settings Panel */}
      <Panel title="XP & Rank Settings" action={
        <button onClick={() => setSettingsOpen(p => !p)} style={{ fontFamily: f.mono, fontSize: 10, color: C.gold, background: 'transparent', border: `1px solid ${C.goldDim}`, padding: '4px 10px', borderRadius: 2, cursor: 'pointer' }}>
          {settingsOpen ? 'Close' : 'Edit Settings'}
        </button>
      }>
        {!settingsOpen && (
          <div style={{ fontFamily: f.body, fontSize: 12, color: C.mute }}>Edit XP values, rank names, thresholds, promotion/demotion rules, and reset controls.</div>
        )}
        {settingsOpen && (
          <div style={{ display: 'grid', gap: 20 }}>
            <div>
              <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>XP Per Action</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {Object.entries(xpValsDraft).map(([key, val]) => (
                  <div key={key}>
                    <span style={smallLabel}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <input type="number" value={val} onChange={e => setXpValsDraft(p => ({ ...p, [key]: parseInt(e.target.value) || 0 }))} style={{ ...inputStyle, width: '100%' }} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Rank Names & XP Thresholds</div>
              {ranksDraft.map((rank, i) => (
                <div key={rank.id} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 120px', gap: 10, marginBottom: 8, alignItems: 'center' }}>
                  <span style={{ fontFamily: f.mono, fontSize: 18 }}>{rank.badge}</span>
                  <input value={rank.name} onChange={e => setRanksDraft(r => r.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} style={{ ...inputStyle }} />
                  <input type="number" value={rank.xpMin} onChange={e => setRanksDraft(r => r.map((x, j) => j === i ? { ...x, xpMin: parseInt(e.target.value) || 0 } : x))} placeholder="Min XP" style={{ ...inputStyle }} />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: f.body, fontSize: 12, color: C.sub }}>Demotions</span>
                <button onClick={() => persist({ ...data, demotionsEnabled: !data.demotionsEnabled })} style={{ width: 36, height: 20, borderRadius: 10, background: data.demotionsEnabled ? C.gold : C.border, border: 'none', position: 'relative', cursor: 'pointer' }}>
                  <span style={{ position: 'absolute', top: 2, left: data.demotionsEnabled ? 18 : 2, width: 16, height: 16, borderRadius: 8, background: data.demotionsEnabled ? C.bg : C.sub, transition: 'left 0.2s' }} />
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: f.body, fontSize: 12, color: C.sub }}>Achievement Badges</span>
                <button onClick={() => persist({ ...data, achievementsEnabled: !data.achievementsEnabled })} style={{ width: 36, height: 20, borderRadius: 10, background: data.achievementsEnabled ? C.gold : C.border, border: 'none', position: 'relative', cursor: 'pointer' }}>
                  <span style={{ position: 'absolute', top: 2, left: data.achievementsEnabled ? 18 : 2, width: 16, height: 16, borderRadius: 8, background: data.achievementsEnabled ? C.bg : C.sub, transition: 'left 0.2s' }} />
                </button>
              </div>
            </div>

            <div>
              <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Manual XP Adjustment</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input type="number" value={xpAdjust} onChange={e => setXpAdjust(e.target.value)} placeholder="Amount" style={{ ...inputStyle, width: 120 }} />
                <button onClick={() => manualAdjustXP('add')} style={{ fontFamily: f.mono, fontSize: 10, color: C.green, background: 'transparent', border: `1px solid ${C.green}33`, padding: '6px 14px', borderRadius: 2, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><Plus size={11} /> Add XP</button>
                <button onClick={() => manualAdjustXP('subtract')} style={{ fontFamily: f.mono, fontSize: 10, color: C.red, background: 'transparent', border: `1px solid ${C.red}33`, padding: '6px 14px', borderRadius: 2, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><Minus size={11} /> Remove XP</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center', paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
              <button onClick={saveSettings} style={{ fontFamily: f.mono, fontSize: 11, color: C.green, background: 'transparent', border: `1px solid ${C.green}33`, padding: '8px 20px', borderRadius: 2, cursor: 'pointer' }}>Save Settings</button>
              {!showResetConfirm
                ? <button onClick={() => setShowResetConfirm(true)} style={{ fontFamily: f.mono, fontSize: 11, color: C.red, background: 'transparent', border: `1px solid ${C.red}33`, padding: '8px 20px', borderRadius: 2, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}><RotateCcw size={11} /> Reset Trading AIOS Rankings</button>
                : <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontFamily: f.body, fontSize: 12, color: C.red }}>This will reset all XP, rank, and discipline data. Confirm?</span>
                    <button onClick={handleReset} style={{ fontFamily: f.mono, fontSize: 11, color: C.red, background: `${C.red}14`, border: `1px solid ${C.red}33`, padding: '6px 14px', borderRadius: 2, cursor: 'pointer' }}>Yes, Reset</button>
                    <button onClick={() => setShowResetConfirm(false)} style={{ fontFamily: f.mono, fontSize: 11, color: C.mute, background: 'transparent', border: `1px solid ${C.border}`, padding: '6px 14px', borderRadius: 2, cursor: 'pointer' }}>Cancel</button>
                  </div>
              }
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}
