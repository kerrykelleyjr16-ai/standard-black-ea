import { f } from './tokens.js'
import { loadData } from './data.js'
console.log('data check:', loadData())
export default function App() {
  return (
    <div style={{ background: '#050505', minHeight: '100vh', padding: 40 }}>
      <div style={{ fontFamily: f.display, fontSize: 32, color: '#F5F1E8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        Standard Black
      </div>
    </div>
  )
}
