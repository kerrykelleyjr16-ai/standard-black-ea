import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import VentureDetail from './pages/VentureDetail.jsx'
import TradingOS from './pages/TradingOS.jsx'
import WholesaleDashboard from './pages/wholesale/WholesaleDashboard.tsx'
import Leads from './pages/wholesale/Leads.tsx'
import LeadDetail from './pages/wholesale/LeadDetail.tsx'
import Deals from './pages/wholesale/Deals.tsx'
import NewDeal from './pages/wholesale/NewDeal.tsx'
import DealDetail from './pages/wholesale/DealDetail.tsx'
import Buyers from './pages/wholesale/Buyers.tsx'
import NewBuyer from './pages/wholesale/NewBuyer.tsx'
import BuyerDetail from './pages/wholesale/BuyerDetail.tsx'
import CommandCenter from './pages/wholesale/CommandCenter.tsx'
import Tasks from './pages/wholesale/Tasks.tsx'
import AuthGate from './lib/AuthGate.jsx'
import MobileTabBar from './components/MobileTabBar.jsx'
import { C } from './tokens.js'

export default function App() {
  return (
    <AuthGate>
      <BrowserRouter>
      <div style={{ minHeight: '100vh', background: C.bg }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/venture/:id" element={<VentureDetail />} />
          <Route path="/trading-os/*" element={<TradingOS />} />
          <Route path="/wholesale/dashboard" element={<WholesaleDashboard />} />
          <Route path="/wholesale/leads" element={<Leads />} />
          <Route path="/wholesale/leads/:id" element={<LeadDetail />} />
          <Route path="/wholesale/deals" element={<Deals />} />
          <Route path="/wholesale/deals/new" element={<NewDeal />} />
          <Route path="/wholesale/deals/:id" element={<DealDetail />} />
          <Route path="/wholesale/buyers" element={<Buyers />} />
          <Route path="/wholesale/buyers/new" element={<NewBuyer />} />
          <Route path="/wholesale/buyers/:id" element={<BuyerDetail />} />
          <Route path="/wholesale/command" element={<CommandCenter />} />
          <Route path="/wholesale/tasks" element={<Tasks />} />
        </Routes>
      </div>
      <MobileTabBar />
      </BrowserRouter>
    </AuthGate>
  )
}
