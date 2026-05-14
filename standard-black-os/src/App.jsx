import { f } from './tokens.js'
export default function App() {
  return (
    <div style={{ background: '#050505', minHeight: '100vh', padding: 40 }}>
      <div style={{ fontFamily: f.display, fontSize: 32, color: '#F5F1E8', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
        Standard Black
      </div>
      <div style={{ fontFamily: f.body, fontSize: 16, color: 'rgba(245,241,232,0.65)' }}>
        We acquire and scale cash-flowing businesses.
      </div>
    </div>
  )
}
