import { useState } from 'react'
import { X, Copy, Check, Plus } from 'lucide-react'
import { C, f } from '../tokens.js'

const VENTURES = [
  { id: 'fund', label: 'Note Fund I' },
  { id: 'note-os', label: 'Note Business System' },
  { id: 'mentorship', label: 'Note Mentorship' },
  { id: 'creations', label: 'Standard Black Creations' },
  { id: 'entity', label: 'Entity Structure' },
  { id: 'team-payment', label: 'Team Payment Structure' },
  { id: 'team', label: 'Team (general)' },
  { id: 'os', label: 'OS (general)' },
  { id: 'general', label: 'General' },
];

function toSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function NewSkillModal({ open, onClose, onRegister }) {
  const [step, setStep] = useState(1);
  const [venture, setVenture] = useState('fund');
  const [skillName, setSkillName] = useState('');
  const [description, setDescription] = useState('');
  const [copied, setCopied] = useState(false);
  const [registered, setRegistered] = useState(false);

  const skillId = venture + ':' + toSlug(skillName);
  const skillPath = `.claude/skills/${toSlug(skillName)}/SKILL.md`;

  const prompt = skillName
    ? `Build a new skill called "${skillName}" for the ${VENTURES.find(v => v.id === venture)?.label ?? venture} venture in the Standard Black OS workspace.\n\nUse the dev-workflow skill.\n\nSkill file: ${skillPath}\nSkill ID: ${skillId}\nDescription: ${description || '(add description)'}\n\nFollow Standard Black's communication style: direct, applicable, no fluff.`
    : '';

  const handleCopy = async () => {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => { setCopied(false); setStep(2); }, 1200);
  };

  const handleRegister = () => {
    if (!skillName.trim()) return;
    onRegister({
      id: skillId,
      name: skillName.trim(),
      venture,
      runs: 0,
      last: '—',
      status: 'planned',
    });
    setRegistered(true);
    setTimeout(() => {
      setRegistered(false);
      setStep(1);
      setSkillName('');
      setDescription('');
      setVenture('fund');
      onClose();
    }, 1500);
  };

  const handleClose = () => {
    setStep(1); setSkillName(''); setDescription(''); setVenture('fund');
    setCopied(false); setRegistered(false);
    onClose();
  };

  if (!open) return null;

  const inputStyle = {
    width: '100%', background: C.surface2, border: `1px solid ${C.border}`,
    borderRadius: 2, padding: '8px 12px', color: C.text,
    fontFamily: f.body, fontSize: 13, outline: 'none',
  };

  const labelStyle = {
    fontFamily: f.mono, fontSize: 10, color: C.mute, letterSpacing: '0.1em',
    textTransform: 'uppercase', display: 'block', marginBottom: 6,
  };

  return (
    <>
      <div onClick={handleClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40 }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 480, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4,
        zIndex: 50, overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: `1px solid ${C.border}`, background: C.surface2,
        }}>
          <div>
            <div style={{ fontFamily: f.display, fontSize: 14, color: C.text, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              New Skill
            </div>
            <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, marginTop: 3, letterSpacing: '0.08em' }}>
              Step {step} of 2 — {step === 1 ? 'Build' : 'Register'}
            </div>
          </div>
          <button onClick={handleClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: C.mute, padding: 4 }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: 24 }}>
          {step === 1 && (
            <div>
              <p style={{ fontFamily: f.body, fontSize: 13, color: C.sub, marginBottom: 20, lineHeight: 1.6 }}>
                Fill in the details below. A Claude Code prompt will be generated — copy it and paste it into Claude Code to build the skill.
              </p>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Venture</label>
                <select value={venture} onChange={e => setVenture(e.target.value)} style={{ ...inputStyle, fontFamily: f.mono }}>
                  {VENTURES.map(v => <option key={v.id} value={v.id}>{v.label}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Skill Name</label>
                <input
                  value={skillName}
                  onChange={e => setSkillName(e.target.value)}
                  placeholder="e.g. Client Intake + Proposal"
                  style={inputStyle}
                />
                {skillName && (
                  <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, marginTop: 5 }}>
                    ID: {skillId} · Path: {skillPath}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Description (optional)</label>
                <input
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="What does this skill do?"
                  style={inputStyle}
                />
              </div>

              {prompt && (
                <div style={{
                  background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 3,
                  padding: 14, marginBottom: 20,
                  fontFamily: f.mono, fontSize: 11, color: C.sub, lineHeight: 1.7,
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                }}>
                  {prompt}
                </div>
              )}

              <button
                onClick={handleCopy}
                disabled={!skillName.trim()}
                style={{
                  width: '100%', padding: '10px', borderRadius: 2,
                  background: copied ? 'rgba(62,166,118,0.15)' : 'rgba(201,162,74,0.1)',
                  border: `1px solid ${copied ? C.green : C.goldDim}`,
                  color: copied ? C.green : C.gold,
                  fontFamily: f.mono, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
                  cursor: skillName.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  opacity: skillName.trim() ? 1 : 0.4, transition: 'all 0.15s',
                }}
              >
                {copied ? <><Check size={14} /> Copied — advancing to Step 2</> : <><Copy size={14} /> Copy Prompt to Claude Code</>}
              </button>

              <button
                onClick={() => setStep(2)}
                style={{
                  width: '100%', marginTop: 8, padding: '8px', borderRadius: 2,
                  background: 'transparent', border: `1px solid ${C.border}`,
                  color: C.mute, fontFamily: f.mono, fontSize: 10,
                  letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                }}
              >
                Skip to Register
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <p style={{ fontFamily: f.body, fontSize: 13, color: C.sub, marginBottom: 20, lineHeight: 1.6 }}>
                Once the skill is built in Claude Code, register it here so it appears in the dashboard.
              </p>

              <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 3, padding: 14, marginBottom: 20 }}>
                <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                  Skill Summary
                </div>
                <div style={{ fontFamily: f.body, fontSize: 13, color: C.text, fontWeight: 500 }}>{skillName || '—'}</div>
                <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, marginTop: 4 }}>{skillId}</div>
                <div style={{ fontFamily: f.mono, fontSize: 10, color: C.mute, marginTop: 2 }}>{skillPath}</div>
              </div>

              <button
                onClick={handleRegister}
                disabled={!skillName.trim()}
                style={{
                  width: '100%', padding: '10px', borderRadius: 2,
                  background: registered ? 'rgba(62,166,118,0.15)' : 'rgba(201,162,74,0.1)',
                  border: `1px solid ${registered ? C.green : C.goldDim}`,
                  color: registered ? C.green : C.gold,
                  fontFamily: f.mono, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
                  cursor: skillName.trim() ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  opacity: skillName.trim() ? 1 : 0.4, transition: 'all 0.15s',
                }}
              >
                {registered ? <><Check size={14} /> Registered</> : <><Plus size={14} /> Register Skill</>}
              </button>

              <button
                onClick={() => setStep(1)}
                style={{
                  width: '100%', marginTop: 8, padding: '8px', borderRadius: 2,
                  background: 'transparent', border: `1px solid ${C.border}`,
                  color: C.mute, fontFamily: f.mono, fontSize: 10,
                  letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                }}
              >
                ← Back to Step 1
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
