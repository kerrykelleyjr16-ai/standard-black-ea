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
    // localStorage unavailable
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
