import { useState } from 'react'
import { AlertTriangle, CheckSquare, Square } from 'lucide-react'
import { C, f } from '../../tokens.js'
import { awardXP, getDisciplineScore } from '../../data/tradingData.js'
import Panel from '../../components/Panel.jsx'
import SessionFlowBar from '../../components/trading/SessionFlowBar.jsx'
import MarketBiasCard from '../../components/trading/MarketBiasCard.jsx'
import StrategyVault from '../../components/trading/StrategyVault.jsx'
import TradeLogTable from '../../components/trading/TradeLogTable.jsx'

const MAX_DAILY_TRADES = 4;
const FOUR_PILLARS = [
  'Risk management reviewed',
  'Targeting high probability setups only',
  'Discipline — no gut trades today',
  'Patience — wait for the setup to come to me',
];

export default function TradingCommandRoom({ data, persist }) {
  const [pillarsChecked, setPillarsChecked] = useState([false, false, false, false]);
  const [portfolioSize, setPortfolioSize] = useState('');
  const [watchlistInput, setWatchlistInput] = useState('');
  const [planDraft, setPlanDraft] = useState({ ticker: '', setup: '', confluences: 0, riskAmount: '', target: '' });

  const todaysTrades = data.trades.filter(t => {
    const d = new Date(t.date);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });

  const tradeCount = todaysTrades.length;
  const limitReached = tradeCount >= MAX_DAILY_TRADES;
  const maxPosition = portfolioSize ? (parseFloat(portfolioSize) * 0.20).toFixed(2) : null;
  const target20 = maxPosition ? (parseFloat(maxPosition) * 0.20).toFixed(2) : null;

  const addWatchlistItem = () => {
    if (!watchlistInput.trim()) return;
    const item = { id: `w-${Date.now()}`, ticker: watchlistInput.toUpperCase().trim(), bias: 'neutral', setup: '', notes: '' };
    persist({ ...data, watchlist: [item, ...data.watchlist] });
    setWatchlistInput('');
  };

  const removeWatchlistItem = (id) => persist({ ...data, watchlist: data.watchlist.filter(w => w.id !== id) });

  const updateWatchlistItem = (id, field, value) =>
    persist({ ...data, watchlist: data.watchlist.map(w => w.id === id ? { ...w, [field]: value } : w) });

  const updateSetups = (setups) => persist({ ...data, setups });

  const updateTrades = (trades) => {
    let next = { ...data, trades };
    next = awardXP(next, 'tradeLogged');
    next = {
      ...next,
      disciplineScore: getDisciplineScore(next.trades),
      positiveTrackedTrades: next.trades.filter(t => {
        const p = (parseFloat(t.exit) - parseFloat(t.entry)) * parseFloat(t.size);
        return !isNaN(p) && p > 0;
      }).length,
    };
    persist(next);
  };

  const inputStyle = { background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 2, color: C.text, fontFamily: f.mono, fontSize: 12, padding: '6px 10px', boxSizing: 'border-box' };
  const smallLabel = { fontFamily: f.mono, fontSize: 10, color: C.mute, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4, display: 'block' };

  return (
    <div>
      <SessionFlowBar phase={data.sessionPhase} onPhaseChange={phase => persist({ ...data, sessionPhase: phase })} />

      {/* Top Row — 4 stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        <MarketBiasCard onBiasUpdate={b => persist({ ...data, marketBias: b })} />

        {/* Trade Limit */}
        <div style={{ background: C.surface, border: `1px solid ${limitReached ? C.red : C.border}`, borderRadius: 4, padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: limitReached ? C.red : C.gold }} />
          <div style={smallLabel}>Trade Limit</div>
          <div style={{ fontFamily: f.display, fontSize: 26, color: limitReached ? C.red : C.text }}>{tradeCount} / {MAX_DAILY_TRADES}</div>
          <div style={{ fontFamily: f.body, fontSize: 12, color: limitReached ? C.red : C.sub, marginTop: 6 }}>
            {limitReached ? '⚠ Daily limit reached — stop trading' : `${MAX_DAILY_TRADES - tradeCount} trades remaining today`}
          </div>
        </div>

        {/* 20/20 Rule Calculator */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: C.green }} />
          <div style={smallLabel}>20/20 Rule · Risk Status</div>
          <input
            value={portfolioSize}
            onChange={e => setPortfolioSize(e.target.value)}
            placeholder="Portfolio size $"
            style={{ ...inputStyle, width: '100%', marginBottom: 8 }}
          />
          {maxPosition && (
            <>
              <div style={{ fontFamily: f.display, fontSize: 20, color: C.green }}>${maxPosition}</div>
              <div style={{ fontFamily: f.body, fontSize: 11, color: C.sub, marginTop: 4 }}>Max position · Target +${target20}</div>
            </>
          )}
        </div>

        {/* 4 Pillars Checklist */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: C.gold }} />
          <div style={smallLabel}>4 Pillars Checklist</div>
          {FOUR_PILLARS.map((p, i) => (
            <div key={i} onClick={() => setPillarsChecked(prev => prev.map((v, j) => j === i ? !v : v))}
              style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, cursor: 'pointer' }}>
              {pillarsChecked[i]
                ? <CheckSquare size={12} style={{ color: C.green, flexShrink: 0 }} />
                : <Square size={12} style={{ color: C.mute, flexShrink: 0 }} />}
              <span style={{ fontFamily: f.body, fontSize: 11, color: pillarsChecked[i] ? C.text : C.mute }}>{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Middle — 3-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 20 }}>

        {/* Daily Watchlist */}
        <Panel title="Daily Watchlist" action={
          <div style={{ display: 'flex', gap: 6 }}>
            <input value={watchlistInput} onChange={e => setWatchlistInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addWatchlistItem()}
              placeholder="Add ticker…" style={{ ...inputStyle, width: 100, fontSize: 10 }} />
            <button onClick={addWatchlistItem} style={{ fontFamily: f.mono, fontSize: 10, color: C.gold, background: 'transparent', border: `1px solid ${C.goldDim}`, padding: '4px 10px', borderRadius: 2, cursor: 'pointer' }}>+ Add</button>
          </div>
        }>
          {data.watchlist.length === 0 && <div style={{ color: C.mute, fontSize: 12, padding: '10px 0' }}>No tickers added yet</div>}
          {data.watchlist.map(w => (
            <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 8, borderBottom: `1px solid ${C.border}`, marginBottom: 8 }}>
              <span style={{ fontFamily: f.mono, fontSize: 13, color: C.text, fontWeight: 700, minWidth: 50 }}>{w.ticker}</span>
              <select value={w.bias} onChange={e => updateWatchlistItem(w.id, 'bias', e.target.value)}
                style={{ ...inputStyle, flex: 1, fontSize: 10, padding: '3px 6px' }}>
                <option value="bullish">Bullish</option>
                <option value="bearish">Bearish</option>
                <option value="neutral">Neutral</option>
              </select>
              <input value={w.notes} onChange={e => updateWatchlistItem(w.id, 'notes', e.target.value)}
                placeholder="Notes" style={{ ...inputStyle, flex: 2, fontSize: 10, padding: '3px 6px' }} />
              <button onClick={() => removeWatchlistItem(w.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.mute, fontSize: 14 }}>✕</button>
            </div>
          ))}
        </Panel>

        {/* Trade Plan Builder */}
        <Panel title="Trade Plan Builder">
          <div style={{ display: 'grid', gap: 10 }}>
            <div>
              <span style={smallLabel}>Ticker</span>
              <input value={planDraft.ticker} onChange={e => setPlanDraft(p => ({ ...p, ticker: e.target.value.toUpperCase() }))} placeholder="SPY" style={{ ...inputStyle, width: '100%' }} />
            </div>
            <div>
              <span style={smallLabel}>Setup Type</span>
              <input value={planDraft.setup} onChange={e => setPlanDraft(p => ({ ...p, setup: e.target.value }))} placeholder="Bear flag, H&S, etc." style={{ ...inputStyle, width: '100%' }} />
            </div>
            <div>
              <span style={smallLabel}>Confluences Confirmed ({planDraft.confluences}/2 min)</span>
              <input type="number" min="0" max="10" value={planDraft.confluences} onChange={e => setPlanDraft(p => ({ ...p, confluences: parseInt(e.target.value) || 0 }))} style={{ ...inputStyle, width: '100%' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <span style={smallLabel}>Risk Amount $</span>
                <input value={planDraft.riskAmount} onChange={e => setPlanDraft(p => ({ ...p, riskAmount: e.target.value }))} placeholder="250" style={{ ...inputStyle, width: '100%' }} />
              </div>
              <div>
                <span style={smallLabel}>Target $</span>
                <input value={planDraft.target} onChange={e => setPlanDraft(p => ({ ...p, target: e.target.value }))} placeholder="500" style={{ ...inputStyle, width: '100%' }} />
              </div>
            </div>
            {planDraft.confluences < 2 && planDraft.ticker && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: `${C.red}14`, border: `1px solid ${C.red}33`, borderRadius: 3 }}>
                <AlertTriangle size={12} style={{ color: C.red }} />
                <span style={{ fontFamily: f.body, fontSize: 11, color: C.red }}>2+ confluences required — do not enter this trade</span>
              </div>
            )}
            {planDraft.confluences >= 2 && planDraft.ticker && (
              <div style={{ padding: '8px 12px', background: `${C.green}14`, border: `1px solid ${C.green}33`, borderRadius: 3 }}>
                <span style={{ fontFamily: f.body, fontSize: 11, color: C.green }}>✓ High probability setup — approved to execute</span>
              </div>
            )}
          </div>
        </Panel>

        {/* Options Contract Tracker */}
        <Panel title="Options Contract Tracker" dense>
          <TradeLogTable trades={todaysTrades} onUpdate={updateTrades} showGrade={false} />
        </Panel>
      </div>

      {/* Bottom — Strategy Vault + Trade Reviews */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Panel title="Strategy Vault" action={
          <span style={{ fontFamily: f.mono, fontSize: 10, color: C.mute }}>{data.setups.length} setups</span>
        }>
          <StrategyVault setups={data.setups} onUpdate={updateSetups} />
        </Panel>
        <Panel title="Trade Reviews · All Time" action={
          <span style={{ fontFamily: f.mono, fontSize: 10, color: C.mute }}>{data.trades.length} logged</span>
        } dense>
          <TradeLogTable trades={data.trades} onUpdate={updateTrades} showGrade={true} />
        </Panel>
      </div>
    </div>
  );
}
