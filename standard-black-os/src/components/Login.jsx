import { useState } from 'react'
import { supabase } from '../wholesale/lib/supabase'
import { C, f } from '../tokens.js'

// Login gate for the whole SB OS. Sends a Supabase magic link to the user's
// email. Only pre-created accounts can complete sign-in (public signups are
// disabled in the Supabase dashboard), so a link only works for Kerry's inbox.
export default function Login() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')

  async function sendLink(e) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('sending')
    setError('')
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin },
    })
    if (error) {
      setError(error.message)
      setStatus('error')
    } else {
      setStatus('sent')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: C.bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        width: '100%', maxWidth: 360,
        background: C.surface, border: `1px solid ${C.border}`,
        borderRadius: 4, padding: '36px 28px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22,
      }}>
        {/* Monogram */}
        <div style={{
          width: 44, height: 44, borderRadius: 2, background: C.gold,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: f.display, fontSize: 17, fontWeight: 700, color: C.bg,
          letterSpacing: '0.05em',
        }}>
          SB
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: f.display, fontSize: 18, fontWeight: 500,
            letterSpacing: '0.1em', color: C.text, textTransform: 'uppercase',
          }}>
            Standard Black OS
          </div>
          <div style={{
            fontFamily: f.mono, fontSize: 10, color: C.mute,
            letterSpacing: '0.16em', marginTop: 6, textTransform: 'uppercase',
          }}>
            Operator Access
          </div>
        </div>

        {status === 'sent' ? (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontFamily: f.body, fontSize: 14, color: C.text }}>
              Check your email.
            </div>
            <div style={{ fontFamily: f.mono, fontSize: 11, color: C.sub, lineHeight: 1.6 }}>
              A sign-in link is on its way to<br />
              <span style={{ color: C.gold }}>{email.trim()}</span>.<br />
              Tap it to open SB OS.
            </div>
            <button
              onClick={() => { setStatus('idle'); setError('') }}
              style={{
                marginTop: 8, background: 'transparent', border: 'none', cursor: 'pointer',
                fontFamily: f.mono, fontSize: 10, color: C.mute, letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={sendLink} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              autoComplete="email"
              required
              style={{
                width: '100%', boxSizing: 'border-box',
                background: C.bg, border: `1px solid ${C.border}`,
                borderRadius: 2, padding: '12px 14px',
                color: C.text, fontFamily: f.mono, fontSize: 13,
                outline: 'none',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = C.gold }}
              onBlur={e => { e.currentTarget.style.borderColor = C.border }}
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              style={{
                width: '100%', background: C.gold, border: 'none',
                borderRadius: 2, padding: '12px 14px',
                color: C.bg, fontFamily: f.mono, fontSize: 11, fontWeight: 600,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                cursor: status === 'sending' ? 'default' : 'pointer',
                opacity: status === 'sending' ? 0.6 : 1,
                transition: 'opacity 0.15s',
              }}
            >
              {status === 'sending' ? 'Sending…' : 'Send Magic Link'}
            </button>
            {status === 'error' && (
              <div style={{ fontFamily: f.mono, fontSize: 11, color: C.red, textAlign: 'center' }}>
                {error}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
