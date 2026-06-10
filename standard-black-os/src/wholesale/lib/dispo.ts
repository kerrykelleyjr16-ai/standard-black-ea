import type { Buyer, Deal, Lead, BuyerMatchScore } from './types'
import { scoreAllBuyersForDeal } from './matching'

export function rankDispoBuyers(buyers: Buyer[], deal: Deal, lead: Lead): BuyerMatchScore[] {
  return scoreAllBuyersForDeal(buyers, deal, lead).filter((m) => !m.hard_pass)
}
