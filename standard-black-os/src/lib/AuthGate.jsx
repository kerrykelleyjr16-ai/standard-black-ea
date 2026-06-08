import { useState, useEffect } from 'react'
import { supabase } from '../wholesale/lib/supabase'
import Login from '../components/Login.jsx'
import { C, f } from '../tokens.js'

// Wraps the entire app. No Supabase session -> show the Login screen.
// Valid session -> render the app. Listens for auth changes (including the
// magic-link redirect, which supabase-js resolves from the URL on load).
export default function AuthGate({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: C.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: C.mute, fontFamily: f.mono, fontSize: 12, letterSpacing: '0.16em',
        textTransform: 'uppercase',
      }}>
        Loading…
      </div>
    )
  }

  if (!session) return <Login />

  return children
}
