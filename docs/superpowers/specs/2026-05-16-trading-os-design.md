# Standard Black Trading OS — Design Spec
**Date:** 2026-05-16  
**Status:** Approved  
**Route:** `/trading-os`  
**Platform:** Standard Black OS (React/Vite, localStorage)

---

## Goal

Build a Trading sub-OS under Standard Black OS that makes the trader **disciplined, consistent, and accountable**. Based on Aristotle's Stock Market Myths framework + the Trading OS spec doc.

This system does not connect to a broker. It helps the trader prepare, track, review, grade, and improve their trading behavior over time.

---

## Placement & Integration

- **Own route** at `/trading-os` — does not modify any existing OS pages or components
- **New venture card** added to the main dashboard linking to `/trading-os`
- **Back navigation** returns to main dashboard
- Existing routes (`/`, `/venture/:id`) are untouched

---

## Navigation Structure

Two top-level tabs inside `/trading-os`:

| Tab | Purpose |
|---|---|
| `Trading` | Manual trading command room — prepare, plan, execute |
| `Trading AIOS` | Development OS — track, grade, rank, review, improve |

---

## 1. Trading Tab — Command Room

### Session Flow (top of page)
Linear progress bar showing current trading phase:
- **Pre-Market** → Live Market Bias + Watchlist + Trade Plan
- **Live Trading** → Options Contract Tracker + Risk Rules
- **Review** → Trade Reviews + Daily Grade

### Dashboard Cards (Top Row)
- Today's Market Bias (live SPY/QQQ — bullish/bearish/neutral)
- Trade Limit: Maximum 4 Trades Per Day (counter)
- Risk Status (20/20 rule compliance)
- Main Rule Reminder (rotating from 4 pillars)

### Sections

**Daily Watchlist**
- Table: Ticker · Bias · Setup Type · Notes
- Add/edit/remove rows

**Market Bias**
- Live SPY and QQQ price + % move via Yahoo Finance free API
- Auto-scored: Bullish / Bearish / Neutral
- Refreshes on session start

**Chart Setups**
- Notes area per ticker — setup type, confluence count, quality score

**Options Contract Tracker**
- Log open contracts: Ticker · Strike · Expiry · Entry · Current · P&L

**Trade Plan Builder**
- Pre-trade checklist: setup type, confluences confirmed, risk amount, target
- Blocks entry if confluence count < 2 (enforces Aristotle discipline rule)

**Risk Rules**
- 20/20 Rule calculator — shows max position size based on portfolio input
- Daily trade counter (resets at midnight)
- Stop-loss input per trade

**Trade Reviews**
- Post-trade log: result, what worked, what broke the plan
- Grade: A / B / C / F

**Strategy Vault**
- Pre-loaded with Aristotle framework (editable)
- Add / edit / delete any setup or rule

### Strategy Vault — Pre-Loaded Content
| Item | Detail |
|---|---|
| 20/20 Rule | Trade 20% of portfolio · Target 20% gain per trade |
| 4 Pillars | Risk Management · High Probability Setups · Discipline · Patience |
| Market Read | SPY = overall sentiment · QQQ = tech sentiment |
| Setups | Bear Flags · Head & Shoulders · Confluence checklist |
| Fundamental Filters | Profitable · Economic moat · 52-wk dip · Avg daily volume |
| Bear Market Plays | Bear flags · Head & shoulders — work in any direction |
| Confluences | 2+ confirmations required before entering any trade |

---

## 2. Trading AIOS Tab — Development OS

### Dashboard Cards (Top Row)
- Current Trading Rank + badge
- Current XP / XP Needed for Next Rank (progress bar)
- Discipline Score (ring meter)
- Promotion Status

### Sections

**Trade Journal Database**
- Full log of all trades: date, ticker, setup, entry, exit, P&L, grade, notes
- Filterable by date, setup type, result

**Rank Progression System**
- Visual rank ladder with locked/unlocked states
- Rank badges, level cards, promotion requirement checklists
- Achievement badges for milestones

**Points / XP System**
- XP earned per trade logged, per plan completed, per review done
- XP lost for rule breaks, skipped reviews
- Configurable in settings

**Discipline Tracker**
- Rule break log — what rule, what trade, what date
- Weekly discipline score (% of trades taken with full plan + confluence check)

**Setup Grader**
- Grade each setup after the trade: A (textbook) → F (gut trade)
- Tracks which setups perform best over time

**AI Trade Reviewer**
- Review form → AI feedback on the trade plan and execution
- Surfaces patterns in mistakes

**Weekly Review Engine**
- Auto-aggregates the week: trades taken, P&L, rule breaks, best setup, worst mistake
- Generates a weekly grade

**Strategy Performance Tracker**
- Win rate per setup type
- Average return per setup
- Charts over time

**Mistake Pattern Detector**
- Tags repeated mistakes (e.g., "entered without confluence", "broke 4-trade limit")
- Shows frequency and cost

**Rule Optimization Room**
- Review which rules are being broken most
- Edit or add rules from here

**Promotion / Demotion System**
- Promotion: hit XP threshold + discipline score ≥ X
- Demotion: rule breaks exceed limit in a rolling 7-day window
- Toggle on/off in settings

**Trading Coach Agent**
- AI suggestion card based on recent journal data
- Identifies the #1 area to improve

---

## 3. XP + Rank System

### Visual Elements
- Rank badge (per rank tier)
- XP progress bar
- Level cards
- Promotion requirement checklist (locked/unlocked per item)
- Achievement badges
- Discipline score ring

### Settings Panel
| Control | Description |
|---|---|
| Edit XP values | Per action (trade logged, plan completed, review done, rule break) |
| Edit rank names | Customize tier names |
| Edit XP thresholds | Points required per rank |
| Edit promotion requirements | What qualifies for promotion |
| Edit demotion rules | Rule break limits, window |
| Toggle demotions | On/off |
| Toggle achievement badges | On/off |
| Reset XP | Reset to 0 |
| Reset rank | Reset to base rank |
| Reset Trading AIOS | Full reset |
| Manually adjust XP | +/- any amount |
| Manually adjust rank | Set rank directly |
| View XP history | Log of all XP events |

---

## 4. Data Layer

| Source | What | How |
|---|---|---|
| Yahoo Finance (free API) | SPY + QQQ live price, % move | Fetched at session start, pre-market panel |
| localStorage | All trade data, journal, watchlist, XP, ranks, vault edits | Persistent across sessions |
| No broker API | — | No brokerage connection per spec |

---

## 5. File Structure (New Files Only)

```
src/
  pages/
    TradingOS.jsx           — top-level shell, tab nav (Trading / AIOS)
    trading/
      TradingCommandRoom.jsx — Trading tab, session flow + all sections
    aios/
      TradingAIOS.jsx        — AIOS tab, all development OS sections
  components/trading/
    SessionFlowBar.jsx       — Pre-Market → Live → Review progress
    MarketBiasCard.jsx       — Live SPY/QQQ + sentiment score
    TradeLogTable.jsx        — Reusable trade entry table
    XPProgressBar.jsx        — XP bar + rank badge
    DisciplineRing.jsx       — Discipline score meter
    StrategyVault.jsx        — Editable setup library
    RankCard.jsx             — Rank display + level card
    AICoachCard.jsx          — AI coaching suggestion
  data/
    tradingData.js           — localStorage layer for all Trading OS data
    tradingDefaults.js       — Aristotle framework default content
```

App.jsx gets one new route: `<Route path="/trading-os/*" element={<TradingOS />} />`  
data.js gets one new venture entry for the main dashboard card.

---

## Out of Scope (This Build)

- Broker API integration
- Real-time options pricing
- Mobile layout optimization
- Multi-user / team trading
