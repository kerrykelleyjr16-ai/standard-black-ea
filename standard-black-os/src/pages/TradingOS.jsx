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
      <header style={{
        borderBottom: `1px solid ${C.border}`,
        background: 'rgba(5,5,5,0.9)', backdropFilter: 'blur(8px)',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div className="trade-header-bar" style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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

          <div className="trade-tab-row" style={{ display: 'flex', gap: 4 }}>
            {TABS.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  className="trade-tab-btn"
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
                  <span className="trade-tab-sub" style={{ color: active ? 'rgba(201,162,74,0.5)' : C.mute, fontSize: 9 }}>
                    {tab.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <div className="trade-main-content" style={{ padding: 24, maxWidth: 1600, margin: '0 auto' }}>
        {activeTab === 'trading' && <TradingCommandRoom data={data} persist={persist} />}
        {activeTab === 'aios' && <TradingAIOS data={data} persist={persist} />}
      </div>

      <style>{`
        @media (max-width: 767px) {
          /* Header reflows to two rows; tabs become full-width scrollable */
          .trade-header-bar {
            flex-direction: column;
            align-items: stretch !important;
            gap: 12px;
            padding: 12px 16px !important;
          }
          .trade-tab-row {
            width: 100%;
            gap: 8px !important;
          }
          .trade-tab-btn {
            flex: 1 1 0;
            justify-content: center;
            min-height: 44px;
            padding: 8px 10px !important;
          }
          .trade-tab-sub { display: none !important; }

          /* Tighter page padding + bottom clearance for fixed tab bar */
          .trade-main-content {
            padding: 16px !important;
            padding-bottom: 90px !important;
          }
        }
      `}</style>
    </div>
  );
}
