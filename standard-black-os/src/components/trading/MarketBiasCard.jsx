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
          <RefreshCw size={10} />
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
