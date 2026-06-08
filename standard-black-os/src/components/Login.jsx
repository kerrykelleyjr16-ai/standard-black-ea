import { useState } from 'react'
import { supabase } from '../wholesale/lib/supabase'
import { C, f } from '../tokens.js'

// Login gate for the whole SB OS. Email + password — no email round-trip,
// no rate limits. The account is pre-created in the Supabase dashboard with a
// password; public signups are disabled, so only that account can sign in.
export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle') // idle | signing-in | error
  const [error, setError] = useState('')

  async function signIn(e) {
    e.preventDefault()
    if (!email.trim() || !password) return
    setStatus('signing-in')
    setError('')
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })
    if (error) {
      setError(error.message)
      setStatus('error')
    }
    // On success, AuthGate's onAuthStateChange swaps in the app — nothing to do here.
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

        <form onSubmit={signIn} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@email.com"
            autoComplete="email"
            required
            style={inputStyle}
            onFocus={e => { e.currentTarget.style.borderColor = C.gold }}
            onBlur={e => { e.currentTarget.style.borderColor = C.border }}
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            required
            style={inputStyle}
            onFocus={e => { e.currentTarget.style.borderColor = C.gold }}
            onBlur={e => { e.currentTarget.style.borderColor = C.border }}
          />
          <button
            type="submit"
            disabled={status === 'signing-in'}
            style={{
              width: '100%', background: C.gold, border: 'none',
              borderRadius: 2, padding: '13px 14px',
              color: C.bg, fontFamily: f.mono, fontSize: 11, fontWeight: 600,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              cursor: status === 'signing-in' ? 'default' : 'pointer',
              opacity: status === 'signing-in' ? 0.6 : 1,
              transition: 'opacity 0.15s',
            }}
          >
            {status === 'signing-in' ? 'Signing in…' : 'Sign In'}
          </button>
          {status === 'error' && (
            <div style={{ fontFamily: f.mono, fontSize: 11, color: C.red, textAlign: 'center' }}>
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  background: C.bg, border: `1px solid ${C.border}`,
  borderRadius: 2, padding: '13px 14px',
  color: C.text, fontFamily: f.mono, fontSize: 13,
  outline: 'none',
}
