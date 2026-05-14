import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, DollarSign, Layers, BookOpen, Monitor, Building2, Users, CheckSquare, Square, Play, Pause } from 'lucide-react'
import { C, f } from '../tokens.js'
import { loadData, saveData } from '../data.js'
import Header from '../components/Header.jsx'
import Panel from '../components/Panel.jsx'
import Pill from '../components/Pill.jsx'
import ActivityLog from '../components/ActivityLog.jsx'
import ConfigPanel from '../components/ConfigPanel.jsx'

const ICONS = { DollarSign, Layers, BookOpen, Monitor, Building2, Users };

export default function VentureDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(() => loadData());
  const [runningSkill, setRunningSkill] = useState(null);
  const [configOpen, setConfigOpen] = useState(false);

  const venture = data.ventures.find(v => v.id === id);
  const ventureSkills = data.skills.filter(s => s.venture === id);
  const ventureActivity = data.activity.filter(a =>
    a.msg.includes(id) || ventureSkills.some(sk => a.msg.includes(sk.id))
  );

  const persist = useCallback((next) => { setData(next); saveData(next); }, []);
  const ts = () => new Date().toLocaleTimeString('en-US', { hour12: false });

  const saveVentures = (updated) => persist({ ...data, ventures: updated });
  const toggleAutomation = (aid) => {
    persist({ ...data, automations: data.automations.map(a => a.id === aid ? { ...a, on: !a.on } : a) });
  };

  const toggleAction = (index) => {
    const updated = data.ventures.map(v => {
      if (v.id !== id) return v;
      const actions = [...v.nextActions];
      const item = actions[index];
      actions[index] = item.startsWith('✓ ') ? item.slice(2) : '✓ ' + item;
      return { ...v, nextActions: actions };
    });
    persist({ ...data, ventures: updated });
  };

  const runSkill = (skill) => {
    if (runningSkill || skill.status === 'planned') return;
    setRunningSkill(skill.id);
    const newEntry = { t: ts(), who: 'claude-code', msg: `Invoking /${skill.id} …`, kind: 'info' };
    const updatedSkills = data.skills.map(s => s.id === skill.id ? { ...s, runs: s.runs + 1, last: ts() } : s);
    const next = { ...data, skills: updatedSkills, activity: [newEntry, ...data.activity].slice(0, 30) };
    persist(next);
    setTimeout(() => {
      setData(prev => {
        const doneEntry = { t: ts(), who: 'claude-code', msg: `/${skill.id} completed`, kind: 'ok' };
        const withDone = { ...prev, activity: [doneEntry, ...prev.activity].slice(0, 30) };
        saveData(withDone);
        return withDone;
      });
      setRunningSkill(null);
    }, 2200);
  };

  if (!venture) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, color: C.text, padding: 40, fontFamily: f.body }}>
        Venture not found.{' '}
        <button onClick={() => navigate('/')} style={{ color: C.gold, background: 'none', border: 'none', cursor: 'pointer', fontFamily: f.body }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const Icon = ICONS[venture.iconName] ?? DollarSign;
  const tone = venture.status === 'active' ? 'gold' : venture.status === 'planning' ? 'warn' : 'off';

  return (
    <div style={{
      minHeight: '100vh', background: C.bg, color: C.text, fontFamily: f.body,
      backgroundImage: `radial-gradient(circle at 15% 0%, rgba(201,162,74,0.04), transparent 45%)`,
    }}>
      <Header onConfigOpen={() => setConfigOpen(true)} />

      <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>

        {/* Back nav */}
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none',
            color: C.mute, fontFamily: f.mono, fontSize: 11, letterSpacing: '0.1em',
            textTransform: 'uppercase', cursor: 'pointer', marginBottom: 24, padding: 0,
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = C.sub}
          onMouseLeave={e => e.currentTarget.style.color = C.mute}
        >
          <ArrowLeft size={14} /> Dashboard
        </button>

        {/* Venture header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28,
          paddingBottom: 24, borderBottom: `1px solid ${C.border}`,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 4,
            background: 'rgba(201,162,74,0.06)', border: `1px solid ${C.goldDim}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={22} style={{ color: C.gold }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <h1 style={{ fontFamily: f.display, fontSize: 24, fontWeight: 500, color: C.text, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {venture.name}
              </h1>
              <Pill tone={tone}>{venture.status}</Pill>
              <Pill tone="off">Priority {venture.priority}</Pill>
            </div>
            <div style={{ fontFamily: f.body, fontSize: 13, color: C.mute }}>{venture.sub}</div>
          </div>
        </div>

        {/* Content grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

          {/* KPI block */}
          <Panel title="Key Metric">
            <div style={{ padding: '8px 0' }}>
              <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 8 }}>
                {venture.kpi.label}
              </div>
              <div style={{ fontFamily: f.display, fontSize: 40, fontWeight: 500, color: C.text, letterSpacing: '-0.01em', lineHeight: 1, marginBottom: 8 }}>
                {venture.kpi.value}
              </div>
              <div style={{ fontFamily: f.mono, fontSize: 12, color: C.mute, marginBottom: 16 }}>
                Target: {venture.kpi.target}
              </div>
              <div style={{ height: 3, background: C.border, borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 2, background: C.gold,
                  width: `${Math.min(venture.kpi.pct, 100)}%`, transition: 'width 0.3s',
                }} />
              </div>
              <div style={{ fontFamily: f.mono, fontSize: 10, color: C.dim, marginTop: 6 }}>
                {venture.kpi.pct}% toward target
              </div>
            </div>
          </Panel>

          {/* About */}
          <Panel title="About">
            <p style={{ fontFamily: f.body, fontSize: 13, color: C.sub, lineHeight: 1.7 }}>
              {venture.about}
            </p>
          </Panel>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

          {/* Next actions */}
          <Panel title="Next Actions">
            {venture.nextActions.length === 0 ? (
              <div style={{ fontFamily: f.body, fontSize: 13, color: C.mute }}>No actions defined.</div>
            ) : (
              venture.nextActions.map((action, i) => {
                const done = action.startsWith('✓ ');
                const label = done ? action.slice(2) : action;
                return (
                  <div
                    key={i}
                    onClick={() => toggleAction(i)}
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                      padding: '10px 0', borderBottom: i < venture.nextActions.length - 1 ? `1px solid ${C.border}` : 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {done
                      ? <CheckSquare size={16} style={{ color: C.green, marginTop: 1, flexShrink: 0 }} />
                      : <Square size={16} style={{ color: C.dim, marginTop: 1, flexShrink: 0 }} />
                    }
                    <span style={{
                      fontFamily: f.body, fontSize: 13,
                      color: done ? C.mute : C.sub,
                      textDecoration: done ? 'line-through' : 'none',
                      lineHeight: 1.5,
                    }}>
                      {label}
                    </span>
                  </div>
                );
              })
            )}
          </Panel>

          {/* Linked skills */}
          <Panel title={`Skills · ${ventureSkills.length}`}>
            {ventureSkills.length === 0 ? (
              <div style={{ fontFamily: f.body, fontSize: 13, color: C.mute }}>No skills linked to this venture.</div>
            ) : (
              <div>
                {ventureSkills.map(skill => {
                  const isPlanned = skill.status === 'planned';
                  const running = runningSkill === skill.id;
                  return (
                    <button
                      key={skill.id}
                      onClick={() => runSkill(skill)}
                      disabled={running || isPlanned}
                      style={{
                        width: '100%', textAlign: 'left',
                        background: running ? 'rgba(201,162,74,0.08)' : C.surface2,
                        border: `1px solid ${running ? C.gold : C.border}`,
                        padding: '10px 12px', borderRadius: 3, marginBottom: 6,
                        cursor: isPlanned ? 'default' : running ? 'default' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                        opacity: isPlanned ? 0.5 : 1, transition: 'all 0.15s',
                      }}
                    >
                      <div>
                        <div style={{ fontFamily: f.body, fontSize: 13, color: C.text, fontWeight: 500, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                          {skill.name}
                          {isPlanned && <Pill tone="planned">planned</Pill>}
                        </div>
                        <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute }}>
                          {skill.runs} runs · {skill.last}
                        </div>
                      </div>
                      {!isPlanned && (
                        <div style={{
                          width: 24, height: 24, borderRadius: 12,
                          background: running ? C.gold : 'transparent',
                          border: `1px solid ${running ? C.gold : C.borderHi}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {running ? <Pause size={10} style={{ color: C.bg }} /> : <Play size={10} style={{ color: C.gold }} />}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </Panel>
        </div>

        {/* Activity log */}
        <Panel title="Activity · This Venture" dense>
          {ventureActivity.length === 0 ? (
            <div style={{ padding: 14, fontFamily: f.body, fontSize: 13, color: C.mute }}>
              No activity logged for this venture yet.
            </div>
          ) : (
            <ActivityLog items={ventureActivity} />
          )}
        </Panel>
      </div>

      <ConfigPanel
        open={configOpen}
        onClose={() => setConfigOpen(false)}
        ventures={data.ventures}
        automations={data.automations}
        onSaveVentures={saveVentures}
        onToggleAutomation={toggleAutomation}
      />
    </div>
  );
}
