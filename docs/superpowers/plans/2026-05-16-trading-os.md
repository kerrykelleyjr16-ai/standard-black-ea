# Trading OS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Trading sub-OS under Standard Black OS at `/trading-os` with two categories — Trading (command room) and Trading AIOS (development OS) — pre-loaded with Aristotle's framework, XP/rank system, live SPY/QQQ market data, and full editability.

**Architecture:** Own route at `/trading-os` — nothing in the existing OS is modified except `data.js` (one new venture entry) and `App.jsx` (one new route). All Trading OS state lives in `tradingData.js` using the same localStorage pattern as the main OS. Two tab views share one shell component.

**Tech Stack:** React 18, Vite, React Router v6, Lucide React, inline styles using `C`/`f` tokens from `tokens.js`, localStorage for persistence, Yahoo Finance API (free, no key) for SPY/QQQ live data.

---

## File Map

**New files:**
- `src/data/tradingDefaults.js` — Aristotle framework content, rank definitions, default XP values
- `src/data/tradingData.js` — localStorage load/save functions for all Trading OS state
- `src/pages/TradingOS.jsx` — Shell: tab nav (Trading / AIOS), back button, shared layout
- `src/pages/trading/TradingCommandRoom.jsx` — Full Trading tab: session flow + all sections
- `src/pages/aios/TradingAIOS.jsx` — Full AIOS tab: journal, XP, ranks, grader, coach
- `src/components/trading/SessionFlowBar.jsx` — Pre-Market → Live → Review progress bar
- `src/components/trading/MarketBiasCard.jsx` — Live SPY/QQQ fetch + bullish/bearish score
- `src/components/trading/XPProgressBar.jsx` — XP bar with rank label
- `src/components/trading/DisciplineRing.jsx` — Discipline score SVG ring meter
- `src/components/trading/RankCard.jsx` — Current rank display with badge and promotion checklist
- `src/components/trading/StrategyVault.jsx` — Editable setup library (add/edit/delete)
- `src/components/trading/TradeLogTable.jsx` — Reusable trade entry/display table
- `src/components/trading/AICoachCard.jsx` — AI coaching suggestion card

**Modified files:**
- `src/data.js` — Add one Trading OS venture entry to `DEFAULT_VENTURES`
- `src/App.jsx` — Add `/trading-os/*` route
- `src/pages/Dashboard.jsx` — Make venture rows clickable (navigate to `/trading-os` for trading-os venture)

---

## Task 1: Trading Data Defaults

**Files:**
- Create: `src/data/tradingDefaults.js`

- [ ] **Step 1: Create the defaults file with Aristotle framework and rank data**

```js
// src/data/tradingDefaults.js

export const DEFAULT_SETUPS = [
  {
    id: 'setup-2020',
    name: '20/20 Rule',
    category: 'risk',
    description: 'Trade only 20% of total portfolio capital. Target a minimum 20% gain per trade.',
    confluences: ['Position size ≤ 20% of portfolio', 'Profit target ≥ 20%', 'Stop loss defined before entry'],
    editable: true,
  },
  {
    id: 'setup-4pillars',
    name: '4 Pillars Daily Check',
    category: 'discipline',
    description: 'State these 4 rules before every session: risk management, high probability setups, discipline, patience.',
    confluences: ['Risk management reviewed', 'Only high probability setups targeted', 'Discipline — no gut trades', 'Patience — wait for the setup'],
    editable: true,
  },
  {
    id: 'setup-spy-qqq',
    name: 'SPY/QQQ Market Read',
    category: 'market-read',
    description: 'SPY = overall market sentiment. QQQ = tech sentiment. Chart both every morning and evening.',
    confluences: ['SPY direction identified', 'QQQ direction identified', 'Both aligned before bias set'],
    editable: true,
  },
  {
    id: 'setup-bear-flag',
    name: 'Bear Flag',
    category: 'pattern',
    description: 'Strong downward move followed by a brief consolidation (flag) before continuation lower.',
    confluences: ['Strong prior downtrend confirmed', 'Tight consolidation channel visible', 'Volume drops during flag', 'Break below flag support with volume spike'],
    editable: true,
  },
  {
    id: 'setup-head-shoulders',
    name: 'Head & Shoulders',
    category: 'pattern',
    description: 'Reversal pattern: left shoulder, head (higher high), right shoulder (lower high). Break neckline = entry.',
    confluences: ['Neckline identified', 'Right shoulder formed below head', 'Break below neckline confirmed', 'Volume confirms on breakdown'],
    editable: true,
  },
  {
    id: 'setup-confluence',
    name: 'Confluence Checklist',
    category: 'entry-rule',
    description: 'Minimum 2 confluences required before any entry. More confluences = higher probability setup.',
    confluences: ['Trend direction confirmed', 'Pattern identified', 'Key level (support/resistance) aligns', 'Volume confirms'],
    editable: true,
  },
  {
    id: 'setup-fundamental',
    name: 'Fundamental Stock Filter',
    category: 'analysis',
    description: 'Criteria for long-term stock investing — not required for day trading options but useful for stock selection.',
    confluences: ['Company is profitable', 'Has an economic moat or competitive advantage', 'Stock at significant dip from 52-week high', 'Good average daily volume'],
    editable: true,
  },
];

export const DEFAULT_RANKS = [
  { id: 'recruit',    name: 'Recruit',    xpMin: 0,    xpMax: 499,  badge: '🪖', color: '#888888' },
  { id: 'cadet',      name: 'Cadet',      xpMin: 500,  xpMax: 999,  badge: '⭐', color: '#4a9eff' },
  { id: 'trader',     name: 'Trader',     xpMin: 1000, xpMax: 2499, badge: '💎', color: '#3ea676' },
  { id: 'specialist', name: 'Specialist', xpMin: 2500, xpMax: 4999, badge: '🏅', color: '#C9A24A' },
  { id: 'operator',   name: 'Operator',   xpMin: 5000, xpMax: 9999, badge: '🔱', color: '#E8BE6A' },
  { id: 'elite',      name: 'Elite',      xpMin: 10000, xpMax: Infinity, badge: '👑', color: '#ffffff' },
];

export const DEFAULT_XP_VALUES = {
  tradeLogged: 10,
  planCompleted: 15,
  reviewCompleted: 20,
  weeklyReviewCompleted: 50,
  ruleBreak: -25,
  blownDailyLimit: -50,
};

export const DEFAULT_TRADING_STATE = {
  // Session
  sessionPhase: 'pre-market', // 'pre-market' | 'live' | 'review'

  // Watchlist
  watchlist: [],

  // Market bias (manual fallback if API fails)
  marketBias: { spy: null, qqq: null, sentiment: 'neutral', lastUpdated: null },

  // Trades
  trades: [],

  // Trade plans
  tradePlans: [],

  // Strategy Vault
  setups: DEFAULT_SETUPS,

  // AIOS
  xp: 0,
  rankId: 'recruit',
  disciplineScore: 100,
  ruleBreaksThisWeek: 0,
  positiveTrackedTrades: 0,
  promotionStatus: 'on-track',
  demotionWarning: false,
  xpHistory: [],
  achievements: [],
  weeklyReviews: [],
  xpValues: DEFAULT_XP_VALUES,
  ranks: DEFAULT_RANKS,
  demotionsEnabled: true,
  achievementsEnabled: true,
};
```

- [ ] **Step 2: Commit**

```bash
git add src/data/tradingDefaults.js
git commit -m "feat: add Trading OS default data — Aristotle framework, ranks, XP values"
```

---

## Task 2: Trading Data Layer

**Files:**
- Create: `src/data/tradingData.js`

- [ ] **Step 1: Create the localStorage load/save layer**

```js
// src/data/tradingData.js
import { DEFAULT_TRADING_STATE } from './tradingDefaults.js';

const STORAGE_KEY = 'sb-trading-os-v1';

export function loadTradingData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_TRADING_STATE };
    const stored = JSON.parse(raw);
    return {
      ...DEFAULT_TRADING_STATE,
      ...stored,
      // Always merge setups so new defaults appear if storage is old
      setups: stored.setups ?? DEFAULT_TRADING_STATE.setups,
      ranks: stored.ranks ?? DEFAULT_TRADING_STATE.ranks,
      xpValues: stored.xpValues ?? DEFAULT_TRADING_STATE.xpValues,
    };
  } catch {
    return { ...DEFAULT_TRADING_STATE };
  }
}

export function saveTradingData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage unavailable — ignore silently
  }
}

export function awardXP(data, action) {
  const amount = data.xpValues[action] ?? 0;
  const newXP = Math.max(0, data.xp + amount);
  const xpHistory = [
    { ts: Date.now(), action, amount },
    ...data.xpHistory,
  ].slice(0, 200);
  return { ...data, xp: newXP, xpHistory };
}

export function getRankForXP(xp, ranks) {
  const sorted = [...ranks].sort((a, b) => b.xpMin - a.xpMin);
  return sorted.find(r => xp >= r.xpMin) ?? ranks[0];
}

export function getDisciplineScore(trades) {
  if (!trades.length) return 100;
  const planned = trades.filter(t => t.hadPlan && t.confluenceCount >= 2).length;
  return Math.round((planned / trades.length) * 100);
}

export function getRuleBreaksThisWeek(trades) {
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return trades.filter(t => t.ruleBreak && t.date > oneWeekAgo).length;
}

export function resetTradingRankings(data) {
  return {
    ...data,
    xp: 0,
    rankId: 'recruit',
    disciplineScore: 100,
    ruleBreaksThisWeek: 0,
    positiveTrackedTrades: 0,
    promotionStatus: 'on-track',
    demotionWarning: false,
    xpHistory: [],
    achievements: [],
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/data/tradingData.js
git commit -m "feat: add Trading OS data layer — localStorage, XP, rank, discipline helpers"
```

---

## Task 3: Wire Trading OS Into Main Dashboard

**Files:**
- Modify: `src/data.js` — add Trading OS venture entry
- Modify: `src/pages/Dashboard.jsx` — make venture rows link to `/trading-os`
- Modify: `src/components/VentureRow.jsx` — accept `onClick` prop

- [ ] **Step 1: Read VentureRow to understand current structure**

Read `src/components/VentureRow.jsx` before editing.

- [ ] **Step 2: Add Trading OS venture to DEFAULT_VENTURES in data.js**

In `src/data.js`, add this entry to the `DEFAULT_VENTURES` array after the last existing entry:

```js
{
  id: "trading-os",
  name: "Trading OS",
  iconName: "TrendingUp",
  status: "active",
  priority: 7,
  kpi: { label: "Session Phase", value: "Pre-Market", target: "Live Trading", pct: 0 },
  sub: "Options trading command room · AIOS development tracker · Aristotle framework",
  about: "Full options trading operating system. Trading tab: manual command room with live SPY/QQQ market bias, watchlist, trade plan builder, risk rules, and strategy vault pre-loaded with Aristotle's framework. Trading AIOS tab: XP, ranks, discipline tracking, setup grader, AI coach, and weekly review engine.",
  nextActions: [
    "Complete pre-market checklist before first trade",
    "Log first trade in the Trade Journal",
    "Review discipline score at end of week",
  ],
},
```

- [ ] **Step 3: Add onClick prop to VentureRow**

In `src/components/VentureRow.jsx`, wrap the outer container with a click handler. Add `onClick` to the props and apply it:

Read the file first, then add `onClick` prop to the root div. The component signature becomes:

```jsx
export default function VentureRow({ venture, onClick }) {
```

And on the outermost div, add:
```jsx
onClick={onClick}
style={{ ...existingStyles, cursor: onClick ? 'pointer' : 'default' }}
```

- [ ] **Step 4: Wire click navigation in Dashboard.jsx**

In `src/pages/Dashboard.jsx`, import `useNavigate` from `react-router-dom`:

```jsx
import { useNavigate } from 'react-router-dom'
```

Add inside the `Dashboard` component:
```jsx
const navigate = useNavigate();

const handleVentureClick = (venture) => {
  if (venture.id === 'trading-os') navigate('/trading-os');
};
```

Update the VentureRow render to pass the handler:
```jsx
{data.ventures.map(v => (
  <VentureRow key={v.id} venture={v} onClick={() => handleVentureClick(v)} />
))}
```

- [ ] **Step 5: Verify in browser**

Open http://localhost:5175. Confirm the Trading OS venture card appears in the ventures list. Clicking it should navigate to `/trading-os` (which will 404 until Task 4 — that's expected).

- [ ] **Step 6: Commit**

```bash
git add src/data.js src/components/VentureRow.jsx src/pages/Dashboard.jsx
git commit -m "feat: add Trading OS venture card and dashboard click navigation"
```

---

## Task 4: App Routing + TradingOS Shell

**Files:**
- Modify: `src/App.jsx` — add `/trading-os/*` route
- Create: `src/pages/TradingOS.jsx` — shell with tab nav and back button

- [ ] **Step 1: Create the TradingOS shell**

```jsx
// src/pages/TradingOS.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, Brain } from 'lucide-react'
import { C, f } from '../tokens.js'
import { loadTradingData, saveTradingData } from '../data/tradingData.js'
import TradingCommandRoom from './trading/TradingCommandRoom.jsx'
import TradingAIOS from './aios/TradingAIOS.jsx'

const TABS = [
  { id: 'trading', label: 'Trading', icon: TrendingUp, sub: 'Command Room' },
  { id: 'aios',    label: 'Trading AIOS', icon: Brain, sub: 'Development OS' },
];

export default function TradingOS() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('trading');
  const [data, setData] = useState(() => loadTradingData());

  const persist = (next) => {
    setData(next);
    saveTradingData(next);
  };

  return (
    <div style={{
      minHeight: '100vh', background: C.bg, color: C.text, fontFamily: f.body,
      backgroundImage: `radial-gradient(circle at 15% 0%, rgba(201,162,74,0.04), transparent 45%), radial-gradient(circle at 85% 100%, rgba(201,162,74,0.03), transparent 45%)`,
    }}>
      {/* Header */}
      <header style={{
        borderBottom: `1px solid ${C.border}`,
        background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(8px)',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Left: back + brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'transparent', border: `1px solid ${C.border}`,
                padding: '6px 10px', borderRadius: 2, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
                color: C.sub, fontFamily: f.mono, fontSize: 11,
              }}
            >
              <ArrowLeft size={12} /> Dashboard
            </button>
            <div style={{ width: 1, height: 16, background: C.border }} />
            <div>
              <div style={{ fontFamily: f.display, fontSize: 14, fontWeight: 500, letterSpacing: '0.1em', color: C.text, textTransform: 'uppercase' }}>
                Trading OS
              </div>
              <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, letterSpacing: '0.16em', marginTop: 2, textTransform: 'uppercase' }}>
                Standard Black · Options Division
              </div>
            </div>
          </div>

          {/* Tab Nav */}
          <div style={{ display: 'flex', gap: 4 }}>
            {TABS.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '8px 16px', borderRadius: 2, cursor: 'pointer',
                    fontFamily: f.mono, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase',
                    background: active ? 'rgba(201,162,74,0.08)' : 'transparent',
                    border: `1px solid ${active ? C.goldDim : C.border}`,
                    color: active ? C.gold : C.sub,
                    transition: 'all 0.15s',
                  }}
                >
                  <Icon size={12} />
                  <span>{tab.label}</span>
                  <span style={{ color: active ? 'rgba(201,162,74,0.5)' : C.mute, fontSize: 9 }}>
                    {tab.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Content */}
      <div style={{ padding: 24, maxWidth: 1600, margin: '0 auto' }}>
        {activeTab === 'trading' && <TradingCommandRoom data={data} persist={persist} />}
        {activeTab === 'aios' && <TradingAIOS data={data} persist={persist} />}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add route in App.jsx**

In `src/App.jsx`, add the import and route:

```jsx
import TradingOS from './pages/TradingOS.jsx'
```

Inside `<Routes>`, add after the existing routes:
```jsx
<Route path="/trading-os/*" element={<TradingOS />} />
```

- [ ] **Step 3: Create placeholder pages so the shell renders without errors**

Create `src/pages/trading/TradingCommandRoom.jsx`:
```jsx
// src/pages/trading/TradingCommandRoom.jsx
export default function TradingCommandRoom({ data, persist }) {
  return <div style={{ color: '#666', fontFamily: 'monospace', padding: 20 }}>Trading Command Room — coming in next task</div>;
}
```

Create `src/pages/aios/TradingAIOS.jsx`:
```jsx
// src/pages/aios/TradingAIOS.jsx
export default function TradingAIOS({ data, persist }) {
  return <div style={{ color: '#666', fontFamily: 'monospace', padding: 20 }}>Trading AIOS — coming in next task</div>;
}
```

- [ ] **Step 4: Verify in browser**

Open http://localhost:5175. Click the Trading OS venture card. Confirm:
- Navigates to `/trading-os`
- Header shows "Trading OS" with back button
- Two tabs: Trading and Trading AIOS
- Back button returns to main dashboard
- Tab switching works

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx src/pages/TradingOS.jsx src/pages/trading/TradingCommandRoom.jsx src/pages/aios/TradingAIOS.jsx
git commit -m "feat: add TradingOS shell — routing, tab nav, back navigation"
```

---

## Task 5: SessionFlowBar + MarketBiasCard Components

**Files:**
- Create: `src/components/trading/SessionFlowBar.jsx`
- Create: `src/components/trading/MarketBiasCard.jsx`

- [ ] **Step 1: Create SessionFlowBar**

```jsx
// src/components/trading/SessionFlowBar.jsx
import { C, f } from '../../tokens.js'

const PHASES = [
  { id: 'pre-market', label: 'Pre-Market', desc: 'Bias · Watchlist · Plan' },
  { id: 'live',       label: 'Live Trading', desc: 'Execute · Track · Manage' },
  { id: 'review',     label: 'Review',       desc: 'Grade · Journal · Improve' },
];

export default function SessionFlowBar({ phase, onPhaseChange }) {
  const currentIdx = PHASES.findIndex(p => p.id === phase);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 0,
      background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4,
      padding: '10px 16px', marginBottom: 20,
    }}>
      <div style={{ fontFamily: f.mono, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.mute, marginRight: 20, whiteSpace: 'nowrap' }}>
        Session Phase
      </div>
      <div style={{ display: 'flex', flex: 1, alignItems: 'center' }}>
        {PHASES.map((p, idx) => {
          const done = idx < currentIdx;
          const active = idx === currentIdx;
          return (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', flex: idx < PHASES.length - 1 ? 1 : 0 }}>
              <button
                onClick={() => onPhaseChange(p.id)}
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
                <div style={{ flex: 1, height: 1, background: done ? C.green : C.border, margin: '0 8px' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create MarketBiasCard**

```jsx
// src/components/trading/MarketBiasCard.jsx
import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react'
import { C, f } from '../../tokens.js'

async function fetchQuote(ticker) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1d`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('fetch failed');
    const json = await res.json();
    const meta = json.chart.result[0].meta;
    const price = meta.regularMarketPrice;
    const prev = meta.chartPreviousClose;
    const pct = ((price - prev) / prev) * 100;
    return { price: price.toFixed(2), pct: pct.toFixed(2), direction: pct > 0.2 ? 'up' : pct < -0.2 ? 'down' : 'flat' };
  } catch {
    return null;
  }
}

function scoreSentiment(spy, qqq) {
  if (!spy || !qqq) return 'neutral';
  const spyUp = spy.direction === 'up';
  const qqqUp = qqq.direction === 'up';
  if (spyUp && qqqUp) return 'bullish';
  if (!spyUp && !qqqUp) return 'bearish';
  return 'neutral';
}

export default function MarketBiasCard({ onBiasUpdate }) {
  const [spy, setSpy] = useState(null);
  const [qqq, setQqq] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const load = async () => {
    setLoading(true);
    const [s, q] = await Promise.all([fetchQuote('SPY'), fetchQuote('QQQ')]);
    setSpy(s);
    setQqq(q);
    setLastUpdated(new Date().toLocaleTimeString('en-US', { hour12: false }));
    const sentiment = scoreSentiment(s, q);
    onBiasUpdate?.({ spy: s, qqq: q, sentiment, lastUpdated: Date.now() });
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const sentiment = scoreSentiment(spy, qqq);
  const sentimentColor = sentiment === 'bullish' ? C.green : sentiment === 'bearish' ? C.red : C.gold;
  const SentimentIcon = sentiment === 'bullish' ? TrendingUp : sentiment === 'bearish' ? TrendingDown : Minus;

  const QuoteBlock = ({ label, quote, sub }) => (
    <div style={{ flex: 1, background: C.surface2, borderRadius: 3, padding: '10px 14px' }}>
      <div style={{ fontFamily: f.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.mute, marginBottom: 6 }}>{label}</div>
      {quote ? (
        <>
          <div style={{ fontFamily: f.display, fontSize: 22, color: C.text }}>${quote.price}</div>
          <div style={{ fontFamily: f.mono, fontSize: 11, marginTop: 4, color: parseFloat(quote.pct) >= 0 ? C.green : C.red }}>
            {parseFloat(quote.pct) >= 0 ? '+' : ''}{quote.pct}%
          </div>
        </>
      ) : (
        <div style={{ color: C.mute, fontSize: 12 }}>{loading ? 'Loading...' : 'Unavailable'}</div>
      )}
      <div style={{ fontFamily: f.body, fontSize: 10, color: C.mute, marginTop: 4 }}>{sub}</div>
    </div>
  );

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: sentimentColor }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontFamily: f.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.mute }}>Market Bias</div>
        <button onClick={load} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.mute, display: 'flex', alignItems: 'center', gap: 4 }}>
          <RefreshCw size={10} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          <span style={{ fontFamily: f.mono, fontSize: 9, color: C.mute }}>{lastUpdated ?? '—'}</span>
        </button>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <QuoteBlock label="SPY" quote={spy} sub="Overall market sentiment" />
        <QuoteBlock label="QQQ" quote={qqq} sub="Tech sentiment" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: `${sentimentColor}14`, borderRadius: 3, border: `1px solid ${sentimentColor}33` }}>
        <SentimentIcon size={14} style={{ color: sentimentColor }} />
        <span style={{ fontFamily: f.mono, fontSize: 12, color: sentimentColor, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
          {sentiment}
        </span>
        <span style={{ fontFamily: f.body, fontSize: 11, color: C.mute, marginLeft: 4 }}>
          {sentiment === 'bullish' ? 'Look for long setups · buy calls' : sentiment === 'bearish' ? 'Look for short setups · buy puts' : 'Mixed signals · wait for clarity'}
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/trading/SessionFlowBar.jsx src/components/trading/MarketBiasCard.jsx
git commit -m "feat: add SessionFlowBar and MarketBiasCard with live SPY/QQQ fetch"
```

---

## Task 6: Trading Command Room — Full Implementation

**Files:**
- Create: `src/components/trading/StrategyVault.jsx`
- Create: `src/components/trading/TradeLogTable.jsx`
- Modify: `src/pages/trading/TradingCommandRoom.jsx` — replace placeholder with full implementation

- [ ] **Step 1: Create StrategyVault component**

```jsx
// src/components/trading/StrategyVault.jsx
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
                  <button onClick={saveEdit} style={{ fontFamily: f.mono, fontSize: 10, color: C.green, background: 'transparent', border: `1px solid ${C.green}33`, padding: '4px 12px', borderRadius: 2, cursor: 'pointer' }}><Check size={10} /> Save</button>
                  <button onClick={() => setEditing(null)} style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, background: 'transparent', border: `1px solid ${C.border}`, padding: '4px 12px', borderRadius: 2, cursor: 'pointer' }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Add new setup */}
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
```

- [ ] **Step 2: Create TradeLogTable component**

```jsx
// src/components/trading/TradeLogTable.jsx
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
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: f.mono, fontSize: 11 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${C.border}` }}>
              {['Ticker', 'Setup', 'Entry', 'Exit', 'Size', 'P&L', showGrade && 'Grade', 'Notes', ''].filter(Boolean).map(h => (
                <th key={h} style={{ padding: '6px 10px', textAlign: 'left', color: C.mute, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: 10 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {adding && (
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: '6px 4px' }}><input value={draft.ticker} onChange={e => setDraft(p => ({ ...p, ticker: e.target.value.toUpperCase() }))} placeholder="SPY" style={inputStyle} /></td>
                <td style={{ padding: '6px 4px' }}><input value={draft.setup} onChange={e => setDraft(p => ({ ...p, setup: e.target.value }))} placeholder="Bear flag" style={inputStyle} /></td>
                <td style={{ padding: '6px 4px' }}><input value={draft.entry} onChange={e => setDraft(p => ({ ...p, entry: e.target.value }))} placeholder="0.00" style={inputStyle} /></td>
                <td style={{ padding: '6px 4px' }}><input value={draft.exit} onChange={e => setDraft(p => ({ ...p, exit: e.target.value }))} placeholder="0.00" style={inputStyle} /></td>
                <td style={{ padding: '6px 4px' }}><input value={draft.size} onChange={e => setDraft(p => ({ ...p, size: e.target.value }))} placeholder="1" style={inputStyle} /></td>
                <td style={{ padding: '6px 10px', color: C.mute }}>—</td>
                {showGrade && <td style={{ padding: '6px 4px' }}>
                  <select value={draft.grade} onChange={e => setDraft(p => ({ ...p, grade: e.target.value }))} style={inputStyle}>
                    {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </td>}
                <td style={{ padding: '6px 4px' }}><input value={draft.notes} onChange={e => setDraft(p => ({ ...p, notes: e.target.value }))} placeholder="Notes" style={inputStyle} /></td>
                <td style={{ padding: '6px 4px', display: 'flex', gap: 4 }}>
                  <button onClick={save} style={{ fontFamily: f.mono, fontSize: 10, color: C.green, background: 'transparent', border: `1px solid ${C.green}33`, padding: '3px 8px', borderRadius: 2, cursor: 'pointer' }}>Save</button>
                  <button onClick={() => setAdding(false)} style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, background: 'transparent', border: `1px solid ${C.border}`, padding: '3px 8px', borderRadius: 2, cursor: 'pointer' }}>✕</button>
                </td>
              </tr>
            )}
            {trades.length === 0 && !adding && (
              <tr><td colSpan={8} style={{ padding: '20px 10px', color: C.mute, textAlign: 'center' }}>No trades logged yet</td></tr>
            )}
            {trades.map(t => {
              const p = pnl(t);
              return (
                <tr key={t.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '8px 10px', color: C.text, fontWeight: 600 }}>{t.ticker}</td>
                  <td style={{ padding: '8px 10px', color: C.sub }}>{t.setup || '—'}</td>
                  <td style={{ padding: '8px 10px', color: C.sub }}>{t.entry ? `$${t.entry}` : '—'}</td>
                  <td style={{ padding: '8px 10px', color: C.sub }}>{t.exit ? `$${t.exit}` : '—'}</td>
                  <td style={{ padding: '8px 10px', color: C.sub }}>{t.size || '—'}</td>
                  <td style={{ padding: '8px 10px', color: p ? (parseFloat(p) >= 0 ? C.green : C.red) : C.mute, fontWeight: 600 }}>
                    {p ? `${parseFloat(p) >= 0 ? '+' : ''}$${p}` : '—'}
                  </td>
                  {showGrade && <td style={{ padding: '8px 10px', color: gradeColor(t.grade), fontWeight: 700 }}>{t.grade}</td>}
                  <td style={{ padding: '8px 10px', color: C.mute, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.notes || '—'}</td>
                  <td style={{ padding: '8px 4px' }}>
                    <button onClick={() => remove(t.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.mute }}><Trash2 size={11} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!adding && (
        <button onClick={() => setAdding(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: f.mono, fontSize: 10, color: C.gold, background: 'transparent', border: 'none', cursor: 'pointer', padding: '10px 0', letterSpacing: '0.08em' }}>
          <Plus size={11} /> Log Trade
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Build TradingCommandRoom — full implementation**

Replace the placeholder at `src/pages/trading/TradingCommandRoom.jsx`:

```jsx
// src/pages/trading/TradingCommandRoom.jsx
import { useState } from 'react'
import { AlertTriangle, BookOpen, CheckSquare, Square } from 'lucide-react'
import { C, f } from '../../tokens.js'
import { awardXP, getDisciplineScore } from '../../data/tradingData.js'
import Panel from '../../components/Panel.jsx'
import SessionFlowBar from '../../components/trading/SessionFlowBar.jsx'
import MarketBiasCard from '../../components/trading/MarketBiasCard.jsx'
import StrategyVault from '../../components/trading/StrategyVault.jsx'
import TradeLogTable from '../../components/trading/TradeLogTable.jsx'

const MAX_DAILY_TRADES = 4;
const FOUR_PILLARS = ['Risk management reviewed', 'Targeting high probability setups only', 'Discipline — no gut trades today', 'Patience — wait for the setup to come to me'];

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
    next = { ...next, disciplineScore: getDisciplineScore(next.trades), positiveTrackedTrades: next.trades.filter(t => parseFloat((((parseFloat(t.exit) - parseFloat(t.entry)) * parseFloat(t.size)) || 0).toFixed(0)) > 0).length };
    persist(next);
  };

  const inputStyle = { background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 2, color: C.text, fontFamily: f.mono, fontSize: 12, padding: '6px 10px', boxSizing: 'border-box' };
  const smallLabel = { fontFamily: f.mono, fontSize: 10, color: C.mute, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4, display: 'block' };

  return (
    <div>
      <SessionFlowBar phase={data.sessionPhase} onPhaseChange={phase => persist({ ...data, sessionPhase: phase })} />

      {/* Top Row — 4 stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {/* Market Bias */}
        <div style={{ gridColumn: 'span 1' }}>
          <MarketBiasCard onBiasUpdate={b => persist({ ...data, marketBias: b })} />
        </div>

        {/* Trade Limit */}
        <div style={{ background: C.surface, border: `1px solid ${limitReached ? C.red : C.border}`, borderRadius: 4, padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: limitReached ? C.red : C.gold }} />
          <div style={{ ...smallLabel }}>Trade Limit</div>
          <div style={{ fontFamily: f.display, fontSize: 26, color: limitReached ? C.red : C.text }}>{tradeCount} / {MAX_DAILY_TRADES}</div>
          <div style={{ fontFamily: f.body, fontSize: 12, color: limitReached ? C.red : C.sub, marginTop: 6 }}>
            {limitReached ? '⚠ Daily limit reached — stop trading' : `${MAX_DAILY_TRADES - tradeCount} trades remaining today`}
          </div>
        </div>

        {/* Risk Status — 20/20 calculator */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: C.green }} />
          <div style={{ ...smallLabel }}>20/20 Rule · Risk Status</div>
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

        {/* Rule Reminder */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: C.gold }} />
          <div style={{ ...smallLabel }}>4 Pillars Checklist</div>
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

      {/* Bottom — Strategy Vault + Full Trade Reviews */}
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
```

- [ ] **Step 4: Verify in browser**

Open http://localhost:5175 → click Trading OS → Trading tab. Confirm:
- Session flow bar shows 3 phases, clickable
- Top row: Market Bias (SPY/QQQ live), Trade Limit counter, 20/20 calculator, 4 Pillars checklist
- Middle: Watchlist (add/remove tickers), Trade Plan Builder (blocks if < 2 confluences), Contract Tracker
- Bottom: Strategy Vault (expand/edit/delete setups), Trade Reviews table
- Logging a trade in Contract Tracker also appears in Trade Reviews

- [ ] **Step 5: Commit**

```bash
git add src/components/trading/ src/pages/trading/TradingCommandRoom.jsx
git commit -m "feat: build Trading Command Room — watchlist, plan builder, contract tracker, strategy vault"
```

---

## Task 7: XP + Rank Components

**Files:**
- Create: `src/components/trading/XPProgressBar.jsx`
- Create: `src/components/trading/DisciplineRing.jsx`
- Create: `src/components/trading/RankCard.jsx`

- [ ] **Step 1: Create XPProgressBar**

```jsx
// src/components/trading/XPProgressBar.jsx
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
```

- [ ] **Step 2: Create DisciplineRing**

```jsx
// src/components/trading/DisciplineRing.jsx
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
```

- [ ] **Step 3: Create RankCard**

```jsx
// src/components/trading/RankCard.jsx
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
```

- [ ] **Step 4: Commit**

```bash
git add src/components/trading/XPProgressBar.jsx src/components/trading/DisciplineRing.jsx src/components/trading/RankCard.jsx
git commit -m "feat: add XPProgressBar, DisciplineRing, and RankCard components"
```

---

## Task 8: AICoachCard Component

**Files:**
- Create: `src/components/trading/AICoachCard.jsx`

- [ ] **Step 1: Create AICoachCard**

```jsx
// src/components/trading/AICoachCard.jsx
import { Brain, RefreshCw } from 'lucide-react'
import { C, f } from '../../tokens.js'

function generateCoachSuggestion(data) {
  const { trades, disciplineScore, ruleBreaksThisWeek } = data;
  if (!trades.length) return { focus: 'Get Started', suggestion: 'Log your first trade to begin tracking your development. Complete the 4 Pillars checklist before entering any position.' };
  if (ruleBreaksThisWeek > 3) return { focus: 'Rule Discipline', suggestion: `You have ${ruleBreaksThisWeek} rule breaks this week. Stop trading until you review each break. Identify the trigger — emotional? rushed? — and write it in your journal.` };
  if (disciplineScore < 60) return { focus: 'Trade Planning', suggestion: 'Discipline score below 60%. Every trade needs a written plan with 2+ confluences before entry. No plan = no trade. Non-negotiable.' };
  const fTrades = trades.filter(t => t.grade === 'F');
  if (fTrades.length >= 3) return { focus: 'Setup Quality', suggestion: `${fTrades.length} F-grade trades logged. Review each one: was there a plan? Did you have confluences? Find the pattern and eliminate it.` };
  const winRate = trades.filter(t => parseFloat(((parseFloat(t.exit) - parseFloat(t.entry)) * parseFloat(t.size)) || 0) > 0).length / trades.length;
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/trading/AICoachCard.jsx
git commit -m "feat: add AICoachCard with data-driven coaching suggestions"
```

---

## Task 9: Trading AIOS — Full Implementation

**Files:**
- Modify: `src/pages/aios/TradingAIOS.jsx` — replace placeholder with full implementation

- [ ] **Step 1: Build TradingAIOS full page**

Replace the placeholder at `src/pages/aios/TradingAIOS.jsx`:

```jsx
// src/pages/aios/TradingAIOS.jsx
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

const SETUP_GRADES = ['A', 'B', 'C', 'F'];
const gradeColor = (g) => ({ A: C.green, B: C.gold, C: C.sub, F: C.red }[g] ?? C.mute);
const gradePoints = { A: 15, B: 10, C: 5, F: 0 };

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
  const noConfluence = trades.filter(t => t.confluenceCount < 2).length;
  if (noConfluence > 0) patterns.push({ pattern: 'Entered without 2+ confluences', count: noConfluence, cost: trades.filter(t => t.confluenceCount < 2).reduce((s, t) => s + ((parseFloat(t.exit) - parseFloat(t.entry)) * parseFloat(t.size) || 0), 0) });
  const noPlan = trades.filter(t => !t.hadPlan).length;
  if (noPlan > 0) patterns.push({ pattern: 'No written plan before entry', count: noPlan, cost: trades.filter(t => !t.hadPlan).reduce((s, t) => s + ((parseFloat(t.exit) - parseFloat(t.entry)) * parseFloat(t.size) || 0), 0) });
  const fGrades = trades.filter(t => t.grade === 'F').length;
  if (fGrades > 0) patterns.push({ pattern: 'F-grade trades (gut/emotional)', count: fGrades, cost: trades.filter(t => t.grade === 'F').reduce((s, t) => s + ((parseFloat(t.exit) - parseFloat(t.entry)) * parseFloat(t.size) || 0), 0) });
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

  const currentRank = getRankForXP(data.xp, data.ranks);
  const setupPerformance = getSetupPerformance(data.trades);
  const mistakePatterns = getMistakePatterns(data.trades);
  const weeklyTrades = getWeeklyTrades(data.trades);
  const weeklyPnL = weeklyTrades.reduce((s, t) => s + ((parseFloat(t.exit) - parseFloat(t.entry)) * parseFloat(t.size) || 0), 0);
  const weeklyGrade = weeklyTrades.length === 0 ? '—' : weeklyTrades.filter(t => t.grade === 'A' || t.grade === 'B').length / weeklyTrades.length >= 0.7 ? 'A' : weeklyTrades.filter(t => t.grade === 'A' || t.grade === 'B').length / weeklyTrades.length >= 0.5 ? 'B' : 'C';
  const ruleBreaks = getRuleBreaksThisWeek(data.trades);
  const bestSetup = setupPerformance[0];
  const worstMistake = mistakePatterns.sort((a, b) => b.count - a.count)[0];

  const manualAdjustXP = (dir) => {
    const amount = parseInt(xpAdjust) || 0;
    if (!amount) return;
    const newXP = Math.max(0, data.xp + (dir === 'add' ? amount : -amount));
    const rank = getRankForXP(newXP, data.ranks);
    persist({ ...data, xp: newXP, rankId: rank.id, xpHistory: [{ ts: Date.now(), action: `manual-${dir}`, amount: dir === 'add' ? amount : -amount }, ...data.xpHistory].slice(0, 200) });
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

  const inputStyle = { background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 2, color: C.text, fontFamily: f.mono, fontSize: 12, padding: '6px 10px', boxSizing: 'border-box' };
  const smallLabel = { fontFamily: f.mono, fontSize: 10, color: C.mute, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4, display: 'block' };

  return (
    <div>
      {/* Top Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        <RankCard xp={data.xp} ranks={data.ranks} promotionStatus={data.promotionStatus} demotionWarning={data.demotionWarning} />
        <XPProgressBar xp={data.xp} ranks={data.ranks} />
        <DisciplineRing score={data.disciplineScore} />
        {/* Promotion Status card */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: data.promotionStatus === 'on-track' ? C.green : C.red }} />
          <div style={{ fontFamily: f.mono, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.mute, marginBottom: 8 }}>Promotion Status</div>
          <div style={{ fontFamily: f.display, fontSize: 18, color: data.promotionStatus === 'on-track' ? C.green : C.red, marginBottom: 6 }}>
            {data.promotionStatus === 'on-track' ? '✓ On Track' : data.promotionStatus}
          </div>
          <div style={{ fontFamily: f.body, fontSize: 11, color: C.mute }}>
            {`${data.positiveTrackedTrades} profitable · ${ruleBreaks} rule breaks this week`}
          </div>
          {data.demotionWarning && data.demotionsEnabled && (
            <div style={{ marginTop: 8, padding: '6px 10px', background: `${C.red}14`, border: `1px solid ${C.red}33`, borderRadius: 3, fontFamily: f.body, fontSize: 11, color: C.red }}>⚠ Demotion risk</div>
          )}
        </div>
      </div>

      {/* Middle */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 20 }}>

        {/* Trade Journal */}
        <Panel title={`Trade Journal · ${data.trades.length} entries`} dense>
          <TradeLogTable trades={data.trades}
            onUpdate={trades => {
              const disc = getDisciplineScore(trades);
              const breaks = getRuleBreaksThisWeek(trades);
              const wins = trades.filter(t => (parseFloat(t.exit) - parseFloat(t.entry)) * parseFloat(t.size) > 0).length;
              const demotion = data.demotionsEnabled && breaks > 5;
              persist({ ...data, trades, disciplineScore: disc, ruleBreaksThisWeek: breaks, positiveTrackedTrades: wins, demotionWarning: demotion, promotionStatus: disc >= 75 && breaks <= 2 ? 'on-track' : 'needs-improvement' });
            }}
          />
        </Panel>

        {/* Setup Grader */}
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

        {/* Mistake Pattern Detector */}
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

        {/* Weekly Review */}
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

        {/* Strategy Performance */}
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

        {/* AI Coach */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <AICoachCard data={data} />

          {/* XP History preview */}
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
            {/* XP Values */}
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

            {/* Rank Names & Thresholds */}
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

            {/* Toggles */}
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

            {/* Manual XP adjust */}
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
```

- [ ] **Step 2: Verify in browser**

Open http://localhost:5175 → Trading OS → Trading AIOS tab. Confirm:
- Top row: Rank card with badge, XP progress bar, discipline ring, promotion status
- Middle: Trade Journal (full log), Setup Grader (win rates per setup), Mistake Pattern Detector
- Bottom: Weekly Review (trades/P&L/grade this week), Strategy Performance (bar charts per setup), AI Coach card + XP History
- Settings panel: edit XP values, rank names/thresholds, toggle demotions + badges, manual XP adjust, reset button with confirmation

- [ ] **Step 3: Commit**

```bash
git add src/pages/aios/TradingAIOS.jsx
git commit -m "feat: build Trading AIOS — journal, rank/XP system, grader, coach, weekly review, settings"
```

---

## Task 10: Log Decision + Final Verification

**Files:**
- Modify: `decisions/log.md`

- [ ] **Step 1: Log the build decision**

Append to `decisions/log.md`:

```
[2026-05-16] DECISION: Built Trading OS as a separate route (/trading-os) under Standard Black OS | REASONING: Two-category system (Trading Command Room + Trading AIOS) is too complex for an embedded panel — needs its own full-screen environment with independent state management | CONTEXT: Based on Aristotle's Stock Market Myths framework + Trading OS spec doc from Google Drive. Pre-loaded with 20/20 rule, 4 pillars, SPY/QQQ market read, bear flags, H&S, confluence checklist. XP/rank system with 6 ranks (Recruit → Elite). Live SPY/QQQ via Yahoo Finance free API. All data in localStorage.
```

- [ ] **Step 2: Full end-to-end browser verification**

Walk through each step:
1. Open http://localhost:5175 — confirm Trading OS venture card on main dashboard
2. Click Trading OS card — confirm navigates to `/trading-os`
3. Trading tab:
   - Session flow bar shows 3 phases — click each, confirm phase changes
   - Market Bias card loads SPY/QQQ (may show "Unavailable" if Yahoo blocks — confirm graceful fallback)
   - Trade Limit counter shows 0/4
   - 20/20 calculator: enter a portfolio size, confirm max position and target appear
   - 4 Pillars: check each box, confirm checkmarks appear
   - Watchlist: add a ticker (e.g. "SPY"), confirm it appears with bias/notes fields
   - Trade Plan Builder: enter ticker, set confluences to 1, confirm red warning. Set to 2+, confirm green approval
   - Log a trade in Contract Tracker — confirm it appears in Trade Reviews below
   - Strategy Vault: expand a setup, edit it, confirm save works, add a new setup
4. Trading AIOS tab:
   - Rank card shows Recruit badge with 0 XP
   - Discipline ring shows 100%
   - Trade Journal shows all logged trades
   - Settings: open, adjust an XP value, save, confirm change persists on reload
   - Manual XP adjust: add 500 XP, confirm XP bar updates
   - Demotion/badge toggles: click each, confirm toggle state persists
5. Back button → confirm returns to main dashboard

- [ ] **Step 3: Final commit**

```bash
git add decisions/log.md
git commit -m "docs: log Trading OS build decision"
```
