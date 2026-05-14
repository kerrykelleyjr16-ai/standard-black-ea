# Risk Limits Policy

**Fund:** The Pinnacle Note Fund
**Effective Date:** [DATE]
**Approved By:** CEO/CIO
**Last Reviewed:** [DATE]
**Monitored By:** Agent 13 (Risk Analytics & Stress Testing)

---

## Purpose

These risk limits govern the fund's portfolio construction and operational risk management. All limits are monitored by Agent 13 on a monthly basis. Any breach triggers an immediate escalation to the CEO/CIO. Any planned acquisition that would cause a limit breach requires CEO/CIO approval before the LOI is submitted.

---

## 1. Geographic Concentration Limits

| Limit | Maximum | Rationale |
|---|---|---|
| Single state — % of total portfolio balance | [25]% | Reduce legal and market concentration |
| Top 3 states combined — % of portfolio | [60]% | Maintain geographic diversification |
| Judicial state exposure (% of portfolio) | [50]% | Manage legal timeline risk |
| Single metropolitan area (% of portfolio) | [15]% | Reduce local market risk |

**Monitoring:** Monthly by Agent 13. Breach within 5% of limit → amber flag to Agent 02 and CEO/CIO.

---

## 2. Seller Concentration Limits

| Limit | Maximum |
|---|---|
| Single seller — % of total portfolio balance | [20]% |
| Any two sellers combined | [35]% |

**Rationale:** Reduces seller-related correlation risk, title chain concentration, and relationship dependency.

---

## 3. Servicer Concentration Limits

| Limit | Maximum |
|---|---|
| Single servicer — % of total portfolio balance | [50]% |
| Single special servicer — % of NPL portfolio | [70]% |

**Rationale:** Servicer failure or transition has operational and financial cost. Diversification protects continuity.

**Note:** Fund may exceed servicer limit temporarily during a ramp phase. CEO/CIO must document rationale and timeline to compliance.

---

## 4. NPL / Workout Sleeve Limits

| Limit | Target | Maximum |
|---|---|---|
| NPL allocation (% of total portfolio by balance) | 15% at launch; 30% long-term | 30% absolute ceiling — Fund I hard limit |
| Deep workout (health score 1–2) as % of total | 10% | 20% |

**Rationale:** Limits capital locked in extended legal timelines. Maintains adequate performing/income-generating assets for distributions.

---

## 5. LTV Limits

| Asset Type | Maximum LTV | Notes |
|---|---|---|
| Performing / RPL (Income Sleeve) | 75% | At current value |
| Performing / RPL (Purchase ITV) | 65% | Purchase price / current property value |
| NPL (Investment-to-Value) | 60% standard; up to 70% for near-performing NPLs | Purchase price / current estimated value — primary loss protection metric |
| 2nd Lien | Excluded — Fund I is 1st lien only | No 2nd lien exposure in Fund I |
| Portfolio Average LTV | 75% | Monthly monitoring by Agent 13 |

**LTV Exceptions:** Any loan above maximum requires CEO/CIO written approval with documented compensating factors (significant equity in another metric, exceptional other credit factors).

---

## 6. Legal Timeline Limits

| Limit | Threshold | Action |
|---|---|---|
| Maximum exposure to any single state where timeline >30 months | [15]% of portfolio | CEO/CIO awareness; pricing haircut required |
| Loans in foreclosure >24 months | Flag individually | Agent 07 strategy review required |
| Portfolio average time-to-resolution (NPL) | Track vs. model | Alert if actual exceeds model by >6 months |

---

## 7. Liquidity Reserve Limits

| Reserve | Minimum |
|---|---|
| Operating cash reserve | 3 months projected fund expenses |
| Distribution reserve (if distribution declared) | Amount declared + 10% buffer |
| Legal cost reserve (NPL portfolio) | $[X,000] per active foreclosure (estimate) |

**Monitoring:** Agent 11 confirms reserve adequacy monthly. Any reserve below minimum → immediate CEO/CIO alert.

---

## 8. Leverage Limits (if credit facility is used)

| Limit | Maximum |
|---|---|
| Debt-to-equity ratio (fund level) | [1.5]x |
| Advance rate on performing notes | [65]% of UPB |
| Advance rate on NPLs | [50]% of purchase price or [40]% of current value |
| Facility utilization warning threshold | [80]% of committed capacity |

**Covenant Compliance:** Agent 12 monitors all facility covenants monthly. Any covenant within 10% of breach → CEO/CIO notification.

---

## 9. Watchlist Thresholds

A performing loan is added to the watchlist when it meets any of the following:

| Trigger | Action |
|---|---|
| 30+ days delinquent for first time | Add to watchlist |
| Escrow shortage >3 months | Add to watchlist |
| Tax delinquency identified | Add to watchlist |
| Insurance lapse | Add to watchlist |
| Balloon payment within 90 days without confirmed payoff | Add to watchlist |
| LTV increase above policy limit due to value decline | Add to watchlist |
| Borrower bankruptcy filed | Transfer to workout immediately |
| 60+ days delinquent | Transfer to workout immediately |

---

## 10. Stress Test Thresholds

The fund must be able to withstand the following without requiring a capital call, covenant breach, or inability to meet fund obligations:

| Stress Scenario | Tolerance |
|---|---|
| Home price decline -10% | Portfolio must remain solvent; NAV decline acceptable |
| Home price decline -20% | Portfolio must remain solvent; distributions may be suspended |
| Legal timeline extension +12 months (all NPLs) | Fund must maintain liquidity reserves |
| Servicer failure / transfer | Fund must be able to transition within 90 days without investor loss |

Agent 13 runs these scenarios monthly and reports results to CEO/CIO.

---

## Breach Response Protocol

| Breach Level | Action |
|---|---|
| Within 90% of limit (approaching) | Agent 13 → amber flag to Agent 02 and CEO/CIO; no new acquisitions in that category pending review |
| Limit reached (100%) | Agent 13 → escalate to CEO/CIO immediately; no new acquisitions in that category without CEO/CIO waiver |
| Limit exceeded (breach) | Agent 13 → escalate to CEO/CIO immediately; document breach in decision log; remediation plan required |

All limit breaches and exceptions are logged in `/logs/decision_log.md`.
