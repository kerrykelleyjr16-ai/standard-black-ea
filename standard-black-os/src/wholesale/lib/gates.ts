import type { Deal } from './types'

export function isMaoApproved(deal: Deal): boolean {
  return deal.mao_approved_at != null
}

export function canDraftOffer(deal: Deal): boolean {
  return isMaoApproved(deal)
}

export function isOfferApproved(deal: Deal): boolean {
  return deal.offer_approved_at != null
}
