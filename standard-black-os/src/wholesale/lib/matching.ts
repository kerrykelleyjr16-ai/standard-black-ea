import type { Buyer, Deal, Lead, BuyerMatchScore } from './types'
import { calculateMAO } from './mao'

type RepairLevelOrder = 'light' | 'moderate' | 'heavy'

const REPAIR_LEVEL_INDEX: Record<RepairLevelOrder, number> = {
  light: 0,
  moderate: 1,
  heavy: 2,
}

export function scoreBuyerForDeal(buyer: Buyer, deal: Deal, lead: Lead): BuyerMatchScore {
  const reasons: string[] = []

  // --- Hard Filters ---

  // 1. ZIP must be in target_markets (case-insensitive)
  const zipMatch = buyer.target_markets.some(
    (m) => m.trim().toLowerCase() === lead.zip.trim().toLowerCase()
  )
  if (!zipMatch) {
    return {
      buyer,
      score: 0,
      hard_pass: true,
      reasons: [`ZIP ${lead.zip} not in buyer's target markets`],
    }
  }

  // 2. Property type must match (if buyer has restrictions)
  if (buyer.property_types.length > 0 && lead.property_type) {
    const typeMatch = buyer.property_types.some(
      (t) => t.trim().toLowerCase() === lead.property_type!.trim().toLowerCase()
    )
    if (!typeMatch) {
      return {
        buyer,
        score: 0,
        hard_pass: true,
        reasons: [`Property type "${lead.property_type}" not in buyer's accepted types`],
      }
    }
  }

  // 3. Offer price must be within buyer's price range (if set)
  if (deal.offer_price != null) {
    if (buyer.min_price != null && deal.offer_price < buyer.min_price) {
      return {
        buyer,
        score: 0,
        hard_pass: true,
        reasons: [
          `Offer price too low for buyer (min $${buyer.min_price.toLocaleString()})`,
        ],
      }
    }
    if (buyer.max_price != null && deal.offer_price > buyer.max_price) {
      return {
        buyer,
        score: 0,
        hard_pass: true,
        reasons: [
          `Offer price exceeds buyer's max (max $${buyer.max_price.toLocaleString()})`,
        ],
      }
    }
  }

  // Hard filters passed
  reasons.push(`In target market ✓`)

  // --- Soft Scoring ---
  let score = 0

  // 1. Condition match (30 pts)
  const dealRepairLevel = deal.repair_level
  const buyerConditionMax = buyer.condition_max

  if (dealRepairLevel && buyerConditionMax) {
    const dealIdx = REPAIR_LEVEL_INDEX[dealRepairLevel]
    const buyerIdx = REPAIR_LEVEL_INDEX[buyerConditionMax]
    const diff = dealIdx - buyerIdx

    if (diff <= 0) {
      score += 30
      reasons.push(`Repair level within buyer tolerance ✓`)
    } else if (diff === 1) {
      score += 15
      reasons.push(`Repair level slightly exceeds buyer tolerance (-1 level)`)
    } else {
      reasons.push(`Repair level exceeds buyer tolerance`)
    }
  } else {
    // No condition preference set — award partial
    score += 15
    reasons.push(`No condition preference set by buyer`)
  }

  // 2. Spread quality (40 pts)
  const arv = deal.arv ?? 0
  const repairEstimate = deal.repair_estimate ?? 0
  const assignmentFee = deal.assignment_fee ?? 10000
  const targetMargin = buyer.target_margin ?? 0.7

  const maoForBuyer = calculateMAO(arv, targetMargin, repairEstimate, assignmentFee)

  if (deal.offer_price != null && maoForBuyer > 0) {
    const offerPrice = deal.offer_price
    const overageRatio = (offerPrice - maoForBuyer) / maoForBuyer

    if (offerPrice <= maoForBuyer) {
      score += 40
      reasons.push(`At or under MAO — strong spread ✓`)
    } else if (overageRatio <= 0.05) {
      score += 25
      reasons.push(`Offer price 0–5% over buyer MAO`)
    } else if (overageRatio <= 0.1) {
      score += 10
      reasons.push(`Offer price 5–10% over buyer MAO`)
    } else {
      reasons.push(`Offer price >10% over buyer MAO — tight deal`)
    }
  } else {
    // No offer price yet — neutral score
    score += 20
    reasons.push(`No offer price set yet`)
  }

  // 3. Beds/Baths (10 pts)
  const dealBeds = lead.beds
  const dealBaths = lead.baths
  const meetsBeds = buyer.min_beds != null && dealBeds != null ? dealBeds >= buyer.min_beds : null
  const meetsBaths = buyer.min_baths != null && dealBaths != null ? dealBaths >= buyer.min_baths : null

  if (meetsBeds === null && meetsBaths === null) {
    // No bed/bath preferences — award partial
    score += 5
    reasons.push(`No bed/bath preferences set`)
  } else if (meetsBeds !== false && meetsBaths !== false) {
    score += 10
    reasons.push(`Meets bed/bath requirements ✓`)
  } else if (meetsBeds !== false || meetsBaths !== false) {
    score += 5
    reasons.push(`Meets one of bed/bath requirements`)
  } else {
    reasons.push(`Does not meet bed/bath requirements`)
  }

  // 4. ROI/Cap Rate (20 pts)
  const strategy = buyer.strategy
  if (strategy === 'rental' || strategy === 'BRRRR') {
    if (buyer.target_roi != null || buyer.cap_rate != null) {
      score += 10
      reasons.push(`Rental strategy match — ROI scoring pending deal close data`)
    } else {
      score += 10
      reasons.push(`Rental/BRRRR buyer — confirm cash flow targets`)
    }
  } else if (strategy === 'flip') {
    score += 10
    reasons.push(`Flip strategy — spread-focused buyer ✓`)
  } else if (strategy === 'buy-hold') {
    score += 10
    reasons.push(`Buy-and-hold strategy match`)
  } else {
    score += 5
    reasons.push(`No strategy specified by buyer`)
  }

  return {
    buyer,
    score: Math.min(100, score),
    hard_pass: false,
    reasons,
  }
}

export function scoreAllBuyersForDeal(
  buyers: Buyer[],
  deal: Deal,
  lead: Lead
): BuyerMatchScore[] {
  const results = buyers.map((buyer) => scoreBuyerForDeal(buyer, deal, lead))

  // Sort: non-hard-passes by score descending, hard passes at bottom
  return results.sort((a, b) => {
    if (a.hard_pass && !b.hard_pass) return 1
    if (!a.hard_pass && b.hard_pass) return -1
    return b.score - a.score
  })
}
