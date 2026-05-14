import { useState, useMemo, useCallback } from 'react'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid
} from 'recharts'
import { Database, Cpu, Radio, GitBranch, Sparkles } from 'lucide-react'
import { C, f } from '../tokens.js'
import { loadData, saveData, FUND_SERIES, CREATIONS_SERIES } from '../data.js'
import Header from '../components/Header.jsx'
import Panel from '../components/Panel.jsx'
import StatCard from '../components/StatCard.jsx'
import VentureRow from '../components/VentureRow.jsx'
import SkillButton from '../components/SkillButton.jsx'
import ActivityLog from '../components/ActivityLog.jsx'
import ConfigPanel from '../components/ConfigPanel.jsx'
import NewSkillModal from '../components/NewSkillModal.jsx'

const VENTURE_FILTERS = ['all', 'fund', 'creations', 'team', 'os'];

export default function Dashboard() {
  const [data, setData] = useState(() => loadData());
  const [selectedVenture, setSelectedVenture] = useState('all');
  const [runningSkill, setRunningSkill] = useState(null);
  const [configOpen, setConfigOpen] = useState(false);
  const [newSkillOpen, setNewSkillOpen] = useState(false);

  const persist = useCallback((next) => {
    setData(next);
    saveData(next);
  }, []);

  const ts = () => new Date().toLocaleTimeString('en-US', { hour12: false });

  const addActivity = useCallback((entry) => {
    setData(prev => {
      const next = { ...prev, activity: [entry, ...prev.activity].slice(0, 30) };
      saveData(next);
      return next;
    });
  }, []);

  const visibleSkills = useMemo(() => {
    if (selectedVenture === 'all') return data.skills;
    return data.skills.filter(s => s.venture === selectedVenture || s.venture === 'general');
  }, [selectedVenture, data.skills]);

  const runSkill = (skill) => {
    if (runningSkill) return;
    setRunningSkill(skill.id);
    const entry = { t: ts(), who: 'claude-code', msg: `Invoking /${skill.id} …`, kind: 'info' };
    const updatedSkills = data.skills.map(s => s.id === skill.id ? { ...s, runs: s.runs + 1, last: ts() } : s);
    persist({ ...data, skills: updatedSkills, activity: [entry, ...data.activity].slice(0, 30) });
    setTimeout(() => {
      addActivity({ t: ts(), who: 'claude-code', msg: `/${skill.id} completed · output saved`, kind: 'ok' });
      setRunningSkill(null);
    }, 2200);
  };

  const toggleAutomation = (id) => {
    const updated = data.automations.map(a => a.id === id ? { ...a, on: !a.on } : a);
    const a = updated.find(x => x.id === id);
    const entry = { t: ts(), who: 'automation', msg: `${a.name} ${a.on ? 'enabled' : 'paused'}`, kind: a.on ? 'ok' : 'warn' };
    persist({ ...data, automations: updated, activity: [entry, ...data.activity].slice(0, 30) });
  };

  const saveVentures = (updated) => {
    const entry = { t: ts(), who: 'config', msg: 'KPI values updated and saved', kind: 'ok' };
    persist({ ...data, ventures: updated, activity: [entry, ...data.activity].slice(0, 30) });
  };

  const registerSkill = (skill) => {
    const entry = { t: ts(), who: 'skills', msg: `/${skill.id} registered · status: planned`, kind: 'ok' };
    persist({ ...data, skills: [...data.skills, skill], activity: [entry, ...data.activity].slice(0, 30) });
  };

  const activeCount = data.ventures.filter(v => v.status === 'active').length;
  const liveSkillCount = data.skills.filter(s => s.status === 'live').length;

  const tooltipStyle = { background: C.surface, border: `1px solid ${C.borderHi}`, fontFamily: f.mono, fontSize: 11 };

  return (
    <div style={{
      minHeight: '100vh', background: C.bg, color: C.text, fontFamily: f.body,
      backgroundImage: `radial-gradient(circle at 15% 0%, rgba(201,162,74,0.04), transparent 45%), radial-gradient(circle at 85% 100%, rgba(201,162,74,0.03), transparent 45%)`,
    }}>
      <Header onConfigOpen={() => setConfigOpen(true)} />

      <div style={{ padding: 24, display: 'grid', gap: 20, maxWidth: 1600, margin: '0 auto' }}>

        {/* KPI Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
          <StatCard label="Capital Raised · Fund I" value="$0" sub="Target $1M–$5M · accredited" accent={C.gold} mini={FUND_SERIES} />
          <StatCard label="Note OS Sprint" value="2 / 6" sub="Sprint 1 complete · Supabase pending" accent={C.gold} />
          <StatCard label="SB Creations · Sites" value="1" sub="Delivered · 100 visits" accent={C.gold} mini={CREATIONS_SERIES} />
          <StatCard label="Active Ventures" value={`${activeCount} / ${data.ventures.length}`} sub={`${data.ventures.length - activeCount} in planning`} accent={C.gold} />
          <StatCard label="OS Status" value="Nominal" sub={`${liveSkillCount} skills live · ${data.automations.length} automations`} accent={C.green} />
        </div>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)', gap: 20 }}>

          {/* Left column */}
          <div style={{ display: 'grid', gap: 20 }}>
            <Panel
              title="Ventures"
              action={
                <div style={{ display: 'flex', gap: 6 }}>
                  {VENTURE_FILTERS.map(t => (
                    <button key={t} onClick={() => setSelectedVenture(t)} style={{
                      fontFamily: f.mono, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
                      padding: '4px 10px', borderRadius: 2,
                      background: selectedVenture === t ? 'rgba(201,162,74,0.1)' : 'transparent',
                      border: `1px solid ${selectedVenture === t ? C.goldDim : C.border}`,
                      color: selectedVenture === t ? C.gold : C.sub, cursor: 'pointer',
                    }}>{t}</button>
                  ))}
                </div>
              }
              dense
            >
              {data.ventures.map(v => <VentureRow key={v.id} venture={v} />)}
            </Panel>

            {/* Charts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <Panel title="Fund I · Capital Raise (YTD)">
                <div style={{ height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={FUND_SERIES} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gFund" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={C.gold} stopOpacity={0.5} />
                          <stop offset="100%" stopColor={C.gold} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke={C.border} strokeDasharray="2 4" vertical={false} />
                      <XAxis dataKey="m" stroke={C.mute} tick={{ fontSize: 10, fontFamily: f.mono, fill: C.mute }} axisLine={false} tickLine={false} />
                      <YAxis stroke={C.mute} tick={{ fontSize: 10, fontFamily: f.mono, fill: C.mute }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Area type="monotone" dataKey="v" stroke={C.gold} strokeWidth={2} fill="url(#gFund)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
              <Panel title="SB Creations · Sites Delivered">
                <div style={{ height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={CREATIONS_SERIES} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <CartesianGrid stroke={C.border} strokeDasharray="2 4" vertical={false} />
                      <XAxis dataKey="m" stroke={C.mute} tick={{ fontSize: 10, fontFamily: f.mono, fill: C.mute }} axisLine={false} tickLine={false} />
                      <YAxis stroke={C.mute} tick={{ fontSize: 10, fontFamily: f.mono, fill: C.mute }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(201,162,74,0.04)' }} />
                      <Bar dataKey="v" fill={C.gold} radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Panel>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: 'grid', gap: 20, gridAutoRows: 'max-content' }}>
            <Panel
              title={`Skills · ${visibleSkills.length} shown`}
              action={
                <button onClick={() => setNewSkillOpen(true)} style={{
                  fontFamily: f.mono, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: C.gold, background: 'transparent', border: `1px solid ${C.goldDim}`,
                  padding: '4px 10px', borderRadius: 2, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  <Sparkles size={10} /> New
                </button>
              }
            >
              <div style={{ maxHeight: 360, overflowY: 'auto', paddingRight: 2 }}>
                {visibleSkills.map(s => (
                  <SkillButton key={s.id} skill={s} running={runningSkill === s.id} onClick={runSkill} />
                ))}
              </div>
            </Panel>

            <Panel title="Automations">
              {data.automations.map((a, i) => (
                <div key={a.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 0', borderBottom: i < data.automations.length - 1 ? `1px solid ${C.border}` : 'none',
                }}>
                  <div>
                    <div style={{ fontFamily: f.body, fontSize: 13, color: C.text, fontWeight: 500 }}>{a.name}</div>
                    <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, marginTop: 2, letterSpacing: '0.06em' }}>{a.cron}</div>
                  </div>
                  <button onClick={() => toggleAutomation(a.id)} style={{
                    width: 36, height: 20, borderRadius: 10,
                    background: a.on ? C.gold : C.border,
                    border: 'none', position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
                  }}>
                    <span style={{
                      position: 'absolute', top: 2, left: a.on ? 18 : 2,
                      width: 16, height: 16, borderRadius: 8,
                      background: a.on ? C.bg : C.sub, transition: 'left 0.2s',
                    }} />
                  </button>
                </div>
              ))}
            </Panel>

            <Panel title="Activity · Live Log" dense>
              <ActivityLog items={data.activity} />
            </Panel>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: `1px solid ${C.border}`, paddingTop: 14, marginTop: 6,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: f.mono, fontSize: 10, letterSpacing: '0.08em', color: C.mute, textTransform: 'uppercase',
        }}>
          <div style={{ display: 'flex', gap: 18 }}>
            <span><Database size={10} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle', color: C.green }} />Vault · synced</span>
            <span><Cpu size={10} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle', color: C.green }} />Claude Code · connected</span>
            <span><Radio size={10} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle', color: C.green }} />6 MCP servers</span>
            <span><GitBranch size={10} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle', color: C.gold }} />main · clean</span>
          </div>
          <div>Standard Black OS v0.1 · {new Date().toISOString().slice(0, 10)}</div>
        </div>
      </div>

      <ConfigPanel
        open={configOpen}
        onClose={() => setConfigOpen(false)}
        ventures={data.ventures}
        automations={data.automations}
        onSaveVentures={saveVentures}
        onToggleAutomation={toggleAutomation}
      />
      <NewSkillModal
        open={newSkillOpen}
        onClose={() => setNewSkillOpen(false)}
        onRegister={registerSkill}
      />
    </div>
  );
}
