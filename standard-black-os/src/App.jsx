import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import VentureDetail from './pages/VentureDetail.jsx'
import { C } from './tokens.js'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: C.bg }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/venture/:id" element={<VentureDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
