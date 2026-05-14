# Valuation Policy

**Fund:** The Pinnacle Note Fund
**Effective Date:** [DATE]
**Approved By:** CEO/CIO
**Monitored By:** Agent 04 (Pricing), Agent 13 (Risk)

---

## 1. Purpose

This policy governs how the fund obtains, uses, applies, and updates property valuations across the investment lifecycle — from pre-bid pricing through monthly portfolio monitoring to final disposition. Consistent, conservative, and documented valuation is fundamental to accurate NAV reporting, appropriate risk management, and defensible investor disclosure.

---

## 2. Valuation Methods

### Automated Valuation Model (AVM)
- **Use:** Pre-bid tape screening, initial underwriting, ongoing monitoring of large pools
- **Acceptable Sources:** CoreLogic, Zillow (Zestimate with confidence score), Black Knight, ATTOM Data
- **Minimum Confidence Score:** [80%] or higher for reliance on AVM alone
- **Limitations:** Not acceptable as the sole valuation for any loan over $[X,000] UPB in final pricing; not acceptable for severely distressed properties or rural markets with limited comps

### Broker Price Opinion (BPO)
- **Use:** Standard valuation for NPL underwriting, ongoing NPL monitoring, pre-foreclosure analysis
- **Acceptable Sources:** Approved BPO vendors only (maintained by Agent 08)
- **Type Required:** Exterior BPO minimum; interior BPO preferred for high-value or distressed properties
- **Turnaround:** [10–15] business days from order
- **Validity Period:** 90 days — refresh required if asset has not resolved within 90 days of BPO date
- **Independence Requirement:** BPO must be ordered from an independent vendor — not from the seller's appraiser

### Appraisal (Full USPAP)
- **Use:** Required for: REO properties prior to listing; any property where BPO and AVM diverge by >15%; any single asset where UPB exceeds $[X,000]; any disputed valuation
- **Acceptable Sources:** State-licensed or state-certified appraisers; ordered through approved AMC
- **Validity Period:** 12 months (or sooner if market conditions change materially)

---

## 3. Valuation by Stage

| Stage | Method | Notes |
|---|---|---|
| Pre-bid tape screening | AVM (with confidence score) | Minimum 80% confidence |
| Loan-level underwriting (performing) | AVM or exterior BPO | BPO required if AVM confidence <80% |
| Loan-level underwriting (NPL) | Exterior BPO required | Interior BPO for high-value |
| Full diligence (pre-close) | BPO or appraisal | Appraisal required above $[X,000] UPB |
| Post-close monitoring (performing) | AVM refresh (annual) | Trigger review if value drops >10% |
| NPL ongoing monitoring | BPO refresh (every 90 days if unresolved) | |
| REO listing | Full appraisal | Before listing |
| Disputed valuation | Full appraisal (independent) | CEO/CIO authorizes |

---

## 4. Value Haircuts

The fund applies haircuts to estimated market values to account for uncertainty, condition, and disposition costs. Haircuts are applied by Agent 04 in the pricing model.

| Situation | Haircut Applied |
|---|---|
| AVM only (no physical inspection) | Minus [10]% |
| Exterior BPO (no interior access) | Minus [5]% |
| Interior BPO or Appraisal | Minus [0–5]% depending on condition |
| Vacant / abandoned property | Additional minus [5–10]% |
| Distressed condition (known damage) | Additional minus [10–20]% |
| Rural market (limited comps) | Additional minus [5]% |
| REO — carrying and selling costs | Minus [8–12]% of value for net recovery modeling |

Haircuts may be adjusted by CEO/CIO for specific assets with documented justification.

---

## 5. Downside Valuation

All NPL pricing and NAV calculations must include a downside valuation scenario. Agent 04 applies an additional stress haircut to the downside case.

**Standard Downside Stress:** minus [15–20]% from base value for downside scenario modeling.

**Severe Downside Stress:** minus [25–30]% from base value for stress testing (Agent 13).

---

## 6. Value Update Frequency

| Asset Type | Minimum Update Frequency |
|---|---|
| Performing loans | Annual AVM refresh |
| Reperforming loans | Annual BPO or AVM with high confidence |
| NPLs under active resolution | Every 90 days (BPO) |
| NPLs with no resolution activity | Every 90 days — required to maintain model accuracy |
| REO | At listing (appraisal); at 90 days if unsold (update) |

Agent 13 tracks valuation currency. Any asset whose value has not been updated within the required period is flagged.

---

## 7. Disputed Valuation Process

A valuation is disputed when:
- BPO and AVM diverge by more than [15]%
- Two BPOs on the same property diverge by more than [10]%
- Servicer valuation and fund's valuation diverge materially
- Borrower provides a conflicting appraisal in a loss mitigation context

**Resolution process:**
1. Agent 04 flags the dispute to Agent 07 (for NPLs) or Agent 06 (for performing)
2. A third-party independent appraisal is ordered (CEO/CIO authorization required)
3. The appraisal result becomes the basis for fund valuation
4. All dispute resolutions are logged in `/logs/decision_log.md`

---

## 8. Valuation Approval Requirements

| Action | Approver |
|---|---|
| Use of AVM alone (above $[X,000] UPB) | CEO/CIO acknowledgment |
| Waiver of appraisal requirement | CEO/CIO written approval |
| Use of seller-provided valuation | CEO/CIO approval + independent verification required |
| Downside valuation below policy floor | CEO/CIO awareness — documented |

---

## 9. NAV Valuation

For NAV calculation purposes, the fund administrator uses valuations provided by the fund (Agent 04 / Agent 10). The valuation methodology must be disclosed in the fund's PPM and consistently applied.

- Performing loans: carried at amortized cost or fair value per fund accounting method (as specified in fund documents)
- NPLs: carried at lower of cost or estimated net recoverable value
- REO: carried at lower of cost (purchase price at acquisition of deed) or estimated net realizable value

Any change to NAV valuation methodology requires CEO/CIO approval and LP disclosure per fund documents.
