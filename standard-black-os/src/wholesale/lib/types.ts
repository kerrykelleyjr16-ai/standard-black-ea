export type BuyerStrategy = 'flip' | 'rental' | 'BRRRR' | 'buy-hold'
export type RepairLevel = 'light' | 'moderate' | 'heavy'
export type LeadStage =
  | 'New' | 'Skip Traced' | 'Contacted' | 'Responded'
  | 'Qualified' | 'Analyzed' | 'Matched' | 'Offer Made'
  | 'Under Contract' | 'Assigned' | 'Closed'
export type Channel = 'sms' | 'email'
export type Direction = 'inbound' | 'outbound'
export type Sentiment = 'positive' | 'neutral' | 'negative'

export interface Buyer {
  id: string
  name: string
  company: string | null
  phone: string | null
  email: string | null
  source: string | null
  notes: string | null
  active: boolean
  created_at: string
  target_markets: string[]
  property_types: string[]
  min_price: number | null
  max_price: number | null
  condition_max: RepairLevel | null
  min_beds: number | null
  min_baths: number | null
  strategy: BuyerStrategy | null
  target_margin: number | null
  target_roi: number | null
  cap_rate: number | null
  max_rehab: number | null
  financing: string | null
  proof_of_funds: string | null
}

export interface Lead {
  id: string
  address: string
  city: string
  state: string
  zip: string
  county: string | null
  property_type: string | null
  beds: number | null
  baths: number | null
  sqft: number | null
  year_built: number | null
  lot_size: number | null
  source: string | null
  owner_name: string | null
  owner_phone: string | null
  owner_email: string | null
  skip_trace_status: 'pending' | 'done' | null
  motivation_signals: string[]
  stage: LeadStage
  created_at: string
}

export interface Deal {
  id: string
  lead_id: string
  arv: number | null
  comps: CompRecord[] | null
  repair_level: RepairLevel | null
  repair_estimate: number | null
  asking_price: number | null
  mao: number | null
  mao_override: number | null
  mao_override_reason: string | null
  assignment_fee: number | null
  offer_price: number | null
  matched_buyer_ids: string[]
  analysis_notes: string | null
  analyzed_at: string | null
}

export interface CompRecord {
  address: string
  sale_price: number
  sqft: number | null
  sold_date: string | null
}

export interface Conversation {
  id: string
  lead_id: string
  channel: Channel
  direction: Direction
  body: string
  ai_generated: boolean
  motivation_score: number | null
  sentiment: Sentiment | null
  consent_status: string | null
  opted_out: boolean
  created_at: string
}

export interface BuyerMatchScore {
  buyer: Buyer
  score: number
  hard_pass: boolean
  reasons: string[]
}
