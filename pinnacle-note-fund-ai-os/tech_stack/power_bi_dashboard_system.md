# Power BI Dashboard System — The Pinnacle Note Fund AI OS

**Fund:** The Pinnacle Note Fund
**Document:** Power BI Dashboard Design and Specifications
**Maintained By:** Agent 18 (Data, Automation, Dashboards & Security)
**Last Updated:** 2026-05-08

---

## System Architecture

**Connection:** Power BI → Supabase via PostgreSQL connector (port 5432, SSL required)
**Authentication:** `powerbi_readonly` service role — read-only, zero write access
**Credential Storage:** In 1Password (`Fund Operations` vault); entered once in Power BI Desktop; never stored in the report file

**Query Modes:**
- **DirectQuery** — Live data on every visual refresh. Used for the Approval Queue panel and Risk Status panel where real-time accuracy is critical. Higher latency; no data cached in Power BI.
- **Import** — Data loaded into Power BI at refresh time. Used for all historical analysis, trend charts, and reporting dashboards. Fast, rich visual capability.

**Mixed Mode:** Executive Dashboard uses Import for historical panels and DirectQuery for the Approval Queue and Risk Status panels. All other dashboards use Import only.

**Refresh Schedule:**
- Import dashboards: Daily at 6:00 AM CT (before Kerry starts his day)
- DirectQuery panels: Live (no scheduled refresh — data pulled on every page load)
- On-demand refresh: Kerry can trigger manual refresh from Power BI Service at any time

**Report File Organization:**
```
Power BI Service Workspace: Pinnacle Note Fund Operations
  /Reports
    01-Executive-Dashboard.pbix
    02-Acquisition-Pipeline-Dashboard.pbix
    03-Tape-Underwriting-Dashboard.pbix
    04-Individual-Note-Dashboard.pbix
    05-Portfolio-Performance-Dashboard.pbix
    06-Performing-Loan-Dashboard.pbix
    07-NPL-Workout-Dashboard.pbix
    08-Legal-Timeline-Dashboard.pbix
    09-Servicer-KPI-Dashboard.pbix
    10-Cash-and-Liquidity-Dashboard.pbix
    11-Distribution-Dashboard.pbix
    12-Investor-Reporting-Dashboard.pbix
    13-Risk-and-Stress-Testing-Dashboard.pbix
    14-Vendor-Performance-Dashboard.pbix
    15-Compliance-Dashboard.pbix
  /Datasets
    PNF-Core-Dataset.pbix (shared dataset used across reports)
```

**Color System (applied across all dashboards):**
| Status | Color | Hex |
|---|---|---|
| Healthy / On Track | Green | #2ECC71 |
| Warning / Watch | Amber | #F39C12 |
| Action Required / Breach | Red | #E74C3C |
| Informational / Neutral | Dark Blue | #2C3E50 |
| Background | Near White | #F8F9FA |
| Card Background | White | #FFFFFF |

**Typography:** Consistent font — Segoe UI. Headers: 16pt bold. Subheaders: 13pt. Body: 11pt. Data labels: 10pt.

**Mobile Layout:** Every dashboard has a mobile layout configured for portrait phone view. Kerry accesses from his phone at the dealership — critical metrics visible without scrolling.

---

## Dashboard 1: Executive Dashboard

**Purpose:** Kerry's command center — the single view he opens every morning. Synthesizes the entire fund into one screen: open approvals requiring action, fund health snapshot, risk status, active deal pipeline, portfolio status, and agent system health. Designed for 60-second situational awareness.

**Main Users:** Kerry Kelley Jr (CEO/CIO) — primary daily user. Not shared externally.

**Data Sources:**
- `approvals` (DirectQuery) — open approval queue
- `loan_tapes` — active pipeline
- `loans` — portfolio snapshot
- `risk_metrics` — most recent risk limit readings per limit
- `agent_tasks` — recent agent sessions
- `agent_logs` — session completeness and failure rate
- `diligence_exceptions` — open critical exceptions
- `distributions` — recent and pending distributions
- `cash_activity` — recent cash position snapshot
- `compliance_reviews` — pending compliance items

---

**Required Metrics:**

| Metric | Calculation | Display |
|---|---|---|
| Open Approvals | COUNT(approvals WHERE status = Pending) | Card — center top |
| URGENT Approvals | COUNT WHERE priority = URGENT | Card — red background if > 0 |
| Active Tapes | COUNT(loan_tapes WHERE status NOT IN Closed, Rejected) | Card |
| Active Portfolio UPB | SUM(loans.current_upb WHERE acquisition_status = Active) | Card |
| Portfolio Loan Count | COUNT(loans WHERE acquisition_status = Active) | Card |
| Watch List | COUNT(loans WHERE payment_status IN (30,60,90,120+,BK,REO)) | Card — amber/red |
| NPL Count | COUNT(loans WHERE loan_classification = NPL) | Card |
| Current Month Collections | SUM(cash_activity.amount WHERE category = Remittance AND month = current) | Card |
| Red Risk Limits | COUNT(risk_metrics WHERE status = Red AND most recent period) | Card — red if > 0 |
| Amber Risk Limits | COUNT(risk_metrics WHERE status = Amber) | Card — amber if > 0 |
| Agent Sessions Today | COUNT(agent_tasks WHERE DATE(created_at) = today) | Card |
| Failed Sessions (24h) | COUNT(agent_logs WHERE status = Failed AND within 24h) | Card — red if > 0 |
| Pending Compliance Reviews | COUNT(compliance_reviews WHERE review_result = Pending) | Card |

---

**Visual Components:**

**Row 1 — Action Strip (DirectQuery):**
- KPI Card: Open Approvals (URGENT count in red, Normal count in blue) — taps to Approval Queue detail table
- KPI Card: Failed Agent Sessions (24h) — red if any failures
- KPI Card: Red Risk Limits — red if > 0; amber if Amber only
- KPI Card: Open Critical Exceptions — red if > 0

**Row 2 — Fund Snapshot:**
- 3-column card row: Active UPB | Loan Count | Watch List Count
- Mini gauge: Portfolio health score (avg health score across all active loans, 0–100)

**Row 3 — Deal Pipeline:**
- Horizontal bar: Tape volume by status (Received → Screening → UW → Pricing → LOI Sent → Accepted → Closed). Each bar segment is a clickable filter.
- KPI: Active LOIs (count) with days-to-expiration mini table below

**Row 4 — Risk Status Panel (DirectQuery):**
- Horizontal status bar: all active risk limits displayed as colored pills (Green/Amber/Red) — limit name + current vs. limit value
- If any Red: red banner across top of this panel

**Row 5 — Portfolio Health:**
- Donut chart: Loan classification mix (Income % / NPL % / REO %)
- Stacked bar: Payment status distribution (Current / 30 / 60 / 90+ / BK / REO)
- Line sparkline: Delinquency rate trend — trailing 6 months

**Row 6 — Agent System Health:**
- Table: Last 10 agent sessions — Agent name, Task type, Status (Complete/Running/Failed), Completed time
- Mini bar: Agent sessions by status for current day (Complete/Running/Pending/Failed)

**Row 7 — Approval Queue Detail (DirectQuery):**
- Sortable table: Approval ID | Type | Description | Amount | Priority | Days Pending
- Color rows: URGENT = red, High = amber, Normal = white
- No approve/reject buttons (actions happen in Airtable — Power BI is read-only reference)

---

**Filters:** Date range (for historical panels only — DirectQuery panels always show current state)

**Alerts:**
- Open Approvals > 5 pending → data-driven alert email to Kerry
- Any Red risk limit → data-driven alert email to Kerry
- Failed agent sessions > 3 in 24h → data-driven alert
- Watch List loan count increases by > 5 week-over-week → alert

**Responsible Agents:** Agent 01 (briefing synthesis), Agent 13 (risk metrics), Agent 18 (system health monitoring)

**Refresh Frequency:** DirectQuery panels — live. Import panels — daily 6:00 AM CT.

**Human Review Requirements:** Kerry reviews this dashboard first thing every business day. No formal sign-off required — situational awareness tool. Action items identified here are executed in Airtable.

---

## Dashboard 2: Acquisition Pipeline Dashboard

**Purpose:** Full deal pipeline view — every tape from receipt through close. Shows bid pipeline health, seller activity, win/loss rate, pricing analytics, and LOI status. Kerry uses this before acquisitions calls and when evaluating bid decisions.

**Main Users:** Kerry (primary), Kody (Operations oversight)

**Data Sources:**
- `loan_tapes` — full tape pipeline
- `sellers` — seller-level aggregations
- `pricing_models` — bid recommendations
- `underwriting_reviews` — UW outputs per tape
- `approvals` (LOI type) — bid authorization status
- `loans` — boarded loan outcomes from prior tapes

---

**Required Metrics:**

| Metric | Calculation |
|---|---|
| Active Tapes in Pipeline | COUNT WHERE status not in (Closed, Rejected) |
| Total UPB in Pipeline | SUM(loan_tapes.total_upb) active only |
| Tapes Awaiting Bid Decision | COUNT WHERE status = Pricing AND go_no_bid = Go |
| Average Data Quality Score | AVG(data_quality_score) active tapes |
| Go Rate | COUNT(Go) / COUNT(all screened tapes) |
| Win Rate | COUNT(Accepted LOIs) / COUNT(LOIs Sent) |
| Avg Days Tape to LOI | AVG(DATEDIFF(loi_sent_date, received_date)) |
| Avg Days LOI to Close | AVG(DATEDIFF(close_date, loi_accepted_date)) |
| UPB Won (YTD) | SUM(total_upb WHERE status = Closed AND year = current) |
| Active Sellers | COUNT(sellers WHERE status = Active AND last_tape_date > 90 days ago) |

---

**Visual Components:**

**Page 1 — Pipeline Overview:**
- Funnel chart: Tape count by stage (Received → Screening → UW → Pricing → LOI → Accepted → Closed). Funnel drop-off rate labeled.
- Card row: Active Tapes | Total UPB in Pipeline | Pending Bid Decisions | Avg Quality Score
- Horizontal bar: Top 10 sellers by UPB submitted YTD
- Scatter plot: Data quality score (x) vs. tape UPB (y) — size = loan count. Color = go/no-bid. Quickly shows whether high-quality tapes are larger.

**Page 2 — Bid Analytics:**
- Table: Active bid decisions — Tape ID, Seller, Total UPB, Rec Bid %, Rec Bid $, Max Bid $, Base IRR, Bid Deadline, Days Remaining. Sorted by Days Remaining ASC.
- Bar chart: Bid recommendations — Base / Upside / Downside IRR by tape
- Line chart: Bid prices vs. UPB (% of UPB over time) — are we paying more or less over time?
- Card: Win rate (Accepted / Sent LOIs) trailing 12 months

**Page 3 — LOI and Closing Status:**
- Timeline visual: LOIs in flight — sent date, expiration, seller response status
- Table: Active closings — Tape ID, Target Close Date, Wire Status, Boarding Status
- Gauge: Closings on track (% with target close date > today and no blocking exceptions)

**Page 4 — Seller Performance:**
- Bar chart: UPB submitted by seller (YTD, trailing 12M)
- Table: Seller scorecard — Company name, Tapes submitted, Go rate, Win rate, Avg quality score, Last tape date, Status
- Bar: Avg data quality score by seller — sorted DESC

**Page 5 — Historical Wins and Losses:**
- Stacked bar: Monthly tape volume by outcome (Won / Lost / Passed)
- Line: UPB won per month (trailing 12M)
- Table: Closed deals — Tape ID, Seller, UPB, Purchase price, Purchase %, Close date

---

**Filters:** Seller, Status, Date range (received date), Quarter, Go/No-Bid

**Alerts:** Bid deadline within 3 days and no approval on file → data-driven alert. Pipeline UPB drops below $1M → alert.

**Responsible Agents:** Agent 02 (screening and LOI data), Agent 04 (pricing model data), Agent 18 (data quality)

**Refresh Frequency:** Daily 6:00 AM CT (Import)

**Human Review Requirements:** Kerry reviews before any acquisitions call or bid decision meeting. No formal sign-off — reference tool.

---

## Dashboard 3: Tape Underwriting Dashboard

**Purpose:** UW-focused view per tape — health score distribution, classification breakdown, AVM analysis, exception summary, and data gap flags. Kerry and Kody use this when evaluating a specific tape's quality before authorizing an LOI.

**Main Users:** Kerry (bid authorization), Kody (Operations review)

**Data Sources:**
- `underwriting_reviews` — health scores, classifications, flags per loan
- `loans` — loan-level detail for the tape
- `property_values` — AVM data per loan
- `diligence_exceptions` — pre-close exceptions
- `loan_tapes` — tape-level context

---

**Required Metrics:**

| Metric | Calculation |
|---|---|
| Tape UW Completion Rate | COUNT(reviews) / COUNT(loans in tape) |
| Avg Health Score | AVG(underwriting_reviews.health_score) per tape |
| Classification Breakdown | COUNT by Income / Borderline / NPL |
| Avg LTV | AVG(calculated_ltv) |
| Avg ITV (estimated) | AVG(calculated_itv) |
| Loans Missing AVM | COUNT WHERE avm_value IS NULL |
| Out-of-Policy Loans | COUNT where LTV > 75% OR lien_position > 1 OR UPB out of range |
| UW Flags Count | COUNT of flagged loans with ≥ 1 uw_flag |
| Data Completeness | % of required fields populated (avg across tape) |

---

**Visual Components:**

**Page 1 — Tape Summary:**
- Page-level filter: Tape ID selector (dropdown from `loan_tapes`) — entire page filters to one tape
- Card row: Loan count | Avg health score | UW completion % | Avg LTV | Avg ITV
- Donut: Classification mix (Income / Borderline / NPL)
- Histogram: Health score distribution (0–100, binned in 10-point ranges) — visual of tape quality spread
- Bar: Loan count by payment status (Current / 30 / 60 / 90+)

**Page 2 — Loan-Level Detail:**
- Table: Full loan list — Loan ID, Property State, UPB, LTV, Payment Status, Health Score, Classification, UW Flags, AVM available (Y/N)
- Sorted by Health Score ASC (worst loans first) by default
- Conditional formatting: Red rows = health score < 50; Amber = 50–65; Green = 65+
- Map visual: Loans plotted by property_state — bubble size = UPB, color = health score range

**Page 3 — AVM and Valuation Analysis:**
- Scatter: UPB (x) vs. AVM value (y) — color = classification. Shows LTV relationship visually.
- Bar: AVM value vs. UPB by loan — sorted by LTV DESC. Red line at 75% LTV threshold.
- Card: Loans above LTV threshold count | Loans missing AVM count

**Page 4 — Flags and Exceptions:**
- Table: All UW flags across tape — Flag type | Count of loans flagged | Example loans
- Bar chart: Most common UW flags (horizontal bar — frequency of each flag type)
- Table: Out-of-policy loans — Loan ID, issue type, severity, notes

---

**Filters:** Tape ID, Property State, Classification, Payment Status, Health Score range

**Alerts:** Avg health score < 55 for an active tape → alert. Out-of-policy loan count > 20% of tape → alert.

**Responsible Agents:** Agent 03 (all UW data), Agent 18 (AVM/property data)

**Refresh Frequency:** Daily 6:00 AM CT (Import)

**Human Review Requirements:** Kerry reviews this dashboard before authorizing go/no-bid and before approving LOI bid amount. No formal sign-off on the dashboard — the authorization happens in Airtable Approval Queue.

---

## Dashboard 4: Individual Note Dashboard

**Purpose:** Single-loan deep dive — complete view of one note's history, status, valuation, exceptions, payment behavior, and workout status. Agent 07 references this for NPL strategy; Kerry reviews before closing authorization and NPL decisions.

**Main Users:** Kerry (deal review, NPL decisions), Kody (portfolio monitoring)

**Data Sources:**
- `loans` — all loan fields
- `loan_tapes` — source tape context
- `property_values` — full valuation history
- `underwriting_reviews` — all UW sessions for this loan
- `collateral_documents` — document inventory
- `diligence_exceptions` — all exceptions (open and resolved)
- `boarding_exceptions` — boarding QA record
- `npl_workouts` — workout plan (if NPL)
- `legal_matters` — all legal proceedings
- `cash_activity` — payment history (remittance records for this loan)

---

**Required Metrics (Loan-Level):**

| Metric | Value |
|---|---|
| Current UPB | loans.current_upb |
| Current AVM | property_values WHERE is_current = true |
| Current LTV | current_upb / avm_value |
| Estimated ITV | purchase_price / avm_value |
| Health Score | loans.health_score |
| Months Paid (12) | loans.months_paid_last_12 |
| Delinquency Days | loans.delinquency_days |
| Acquisition Status | loans.acquisition_status |
| Loan Classification | loans.loan_classification |
| Open Exceptions | COUNT(diligence_exceptions WHERE status = Open) |
| Collateral Document Completeness | % of required docs with status = Received |

---

**Visual Components:**

**Page Filter (Report-Level):** Loan ID slicer — all pages filter to the selected loan

**Page 1 — Loan Summary:**
- Header card strip: Loan ID | Property Address | Servicer | SPV | Boarding Date
- KPI card row: Current UPB | AVM | LTV | ITV | Health Score | Days Delinquent
- Timeline visual: Loan lifecycle — Received date → UW date → Closing date → Boarding date → today. Key milestones marked.
- Status flags: Classification (Income/NPL/REO), Payment Status, QA Status — colored pills

**Page 2 — Valuation History:**
- Line chart: Property value over time (all valuations from `property_values`) — multiple series if multiple sources (PropStream, HouseCanary, BPO, Appraisal)
- Reference line: Current UPB — shows LTV trend
- Reference line: Purchase price — shows ITV trend
- Table: Full valuation history — Date, Source, Type, Value, Confidence Score, AVM Range

**Page 3 — Payment and Performance History:**
- Bar chart: Monthly payment received vs. expected — trailing 24 months (from `cash_activity` remittance records)
- Card: Total collected since boarding | Total expected | Variance
- Line: Delinquency days over time
- Table: Remittance detail — Date, Principal, Interest, Escrow, Total, Status

**Page 4 — Collateral and Exceptions:**
- Table: Collateral document inventory — Document Type | Status | Condition | Custodian | Defect Notes
- Color rows: Missing = Red, Defective = Amber, Received = Green
- Table: All exceptions (diligence + boarding) — Type, Severity, Status, Owner, Deadline, Resolution Notes
- Donut: Exception status breakdown

**Page 5 — Workout and Legal (Visible only for NPL loans):**
- Card: Resolution path | Strategy approved date | Estimated recovery %
- Timeline: Legal milestones — filed date, milestone dates, next deadline (highlighted)
- Table: Legal matters — Matter type, Status, Case number, Attorney, Next deadline
- Card: Loss severity estimate (from `npl_workouts.estimated_recovery_pct`)

---

**Filters:** Loan ID (report-level)

**Alerts:** None at dashboard level — individual loan alerts generated in n8n (Automations 8, 9)

**Responsible Agents:** Agent 03 (UW data), Agent 05 (collateral, diligence exceptions), Agent 06 (payment history), Agent 07 (workout data), Agent 09 (boarding exceptions), Agent 18 (AVM/property data)

**Refresh Frequency:** Daily 6:00 AM CT (Import)

**Human Review Requirements:** Kerry reviews before closing authorization (signs off in Airtable), before NPL strategy approval, and before legal filing authorization.

---

## Dashboard 5: Portfolio Performance Dashboard

**Purpose:** Full active portfolio view — all boarded loans, performance by servicer, geography, classification, and time. The operational heartbeat of the fund — how is the portfolio performing right now and what does the trend look like?

**Main Users:** Kerry (strategic oversight), Kody (daily operational monitoring)

**Data Sources:**
- `loans` — all active portfolio loans
- `property_values` — current AVMs
- `cash_activity` — remittance collections
- `servicers` — servicer-level data
- `cashflow_forecast` — forward projections
- `npl_workouts` — resolution pipeline

---

**Required Metrics:**

| Metric | Calculation |
|---|---|
| Total Portfolio UPB | SUM(current_upb WHERE acquisition_status = Active) |
| Total Portfolio AVM | SUM(property_values.property_value WHERE is_current = true) — joined to active loans |
| Portfolio LTV | Total UPB / Total AVM |
| Portfolio ITV | SUM(purchase_price) / Total AVM |
| Income UPB | SUM WHERE classification = Income |
| NPL UPB | SUM WHERE classification = NPL |
| REO Count | COUNT WHERE payment_status = REO |
| Current Rate | COUNT(Current) / COUNT(all active) |
| 30+ Rate | COUNT(30+60+90+BK+REO) / COUNT(all active) |
| 60+ Rate | COUNT(60+90+BK+REO) / COUNT(all active) |
| Collection Rate (Month) | SUM(actual remittance) / SUM(expected) current month |
| Unrealized Value | Total AVM - Total UPB (equity cushion) |
| Avg Health Score | AVG(health_score) active portfolio |
| 30-Day Forecast | SUM(cashflow_forecast.forecast_30) |
| 60-Day Forecast | SUM(cashflow_forecast.forecast_60) |
| 90-Day Forecast | SUM(cashflow_forecast.forecast_90) |

---

**Visual Components:**

**Page 1 — Portfolio Snapshot:**
- Card strip: Total UPB | Loan Count | Portfolio LTV | Portfolio ITV | Avg Health Score
- Donut: Classification mix (Income / NPL / REO) — by UPB and by loan count (two donuts)
- Stacked bar: Payment status breakdown — Current / 30 / 60 / 90+ / BK / REO — by loan count and by UPB
- Line chart: Delinquency rate (30+ and 60+) — trailing 12 months. Shows trend clearly.
- Gauge: Current collection rate (this month actual / expected). Target line at 95%.

**Page 2 — Geographic Analysis:**
- Filled map (US states): Color intensity = loan count OR UPB by state. Immediate geographic concentration visibility.
- Bar: Top 10 states by UPB (horizontal bar)
- Table: State breakdown — State, Loan Count, UPB, % of Total, Avg LTV, Delinquency Rate, Avg Health Score
- Bar: Current rate by state — shows which states have higher delinquency

**Page 3 — Servicer Analysis:**
- Bar: UPB by servicer (horizontal bar, sorted DESC)
- Table: Servicer performance — Servicer, Loan Count, UPB, Collection Rate (MTD), 30+ Rate, 60+ Rate, Avg Health Score
- Scatter: Collection rate (x) vs. loan count (y) per servicer — size = UPB. Shows servicer quality instantly.

**Page 4 — Cashflow and Collections:**
- Clustered bar: Monthly collections — Actual vs. Expected — trailing 12 months
- Line: Collection variance (actual - expected) per month
- Card row: 30-Day Forecast | 60-Day Forecast | 90-Day Forecast
- Waterfall chart: Monthly cash build — opening balance + collections - expenses - distributions = closing balance

**Page 5 — Portfolio Trend (12-Month Historical):**
- Line: Total UPB trend (monthly) — shows portfolio growth/payoff
- Line: Delinquency rate trend (12M)
- Line: Avg health score trend (12M)
- Bar: Loans added vs. loans resolved per month

---

**Filters:** Servicer, State, Classification, Payment Status, SPV, Date range

**Alerts:** 30+ rate exceeds 15% → alert. 60+ rate exceeds 10% → alert. Collection rate below 90% → alert.

**Responsible Agents:** Agent 06 (payment status, collections), Agent 13 (reads this data for risk metrics)

**Refresh Frequency:** Daily 6:00 AM CT (Import)

**Human Review Requirements:** Kerry reviews monthly after servicer report cycle completes. Kody reviews weekly. No formal sign-off required.

---

## Dashboard 6: Performing Loan Dashboard

**Purpose:** Income loan focus — current and 30-day performing loans, payment trends, watch list monitoring, and re-performing tracking. Distinct from the full portfolio view; this is the "good book" — monitoring loans that are working as expected.

**Main Users:** Kody (daily monitoring), Kerry (weekly review)

**Data Sources:**
- `loans` WHERE classification = Income
- `cash_activity` — remittance data
- `cashflow_forecast` — projections
- `underwriting_reviews` — health scores

---

**Required Metrics:**

| Metric | Calculation |
|---|---|
| Income UPB | SUM(current_upb WHERE classification = Income) |
| Income Loan Count | COUNT WHERE classification = Income AND acquisition_status = Active |
| Currently Paying | COUNT WHERE payment_status = Current AND classification = Income |
| 30-Day Watch | COUNT WHERE payment_status = 30 AND classification = Income |
| Avg Months Paid (12) | AVG(months_paid_last_12) income loans |
| Collection Rate | Actual collections / Expected (income loans only) |
| Income Yield (Annualized) | (SUM monthly interest received × 12) / SUM(current_upb) |
| Re-performing Rate | COUNT where payment_status changed from delinquent to Current in last 6M / COUNT prior delinquent |

---

**Visual Components:**

**Page 1 — Income Book Snapshot:**
- Card strip: Income UPB | Loan Count | Current Rate | 30-Day Watch | Avg Months Paid
- Donut: Payment status within income loans (Current / 30 / Moving to NPL)
- Line: Income collection rate — monthly trailing 12. Target line at 97%.
- Bar: Income UPB by state — geographic breakdown of the performing book

**Page 2 — Watch List Detail:**
- Table: 30-day watch loans — Loan ID, Address, State, UPB, Last Payment Date, Servicer, Days Since Payment, Health Score
- Color rows: amber for 30-day, red for 60+ (even if still classified Income — reclassification pending)
- Card: Watch list count | Watch list UPB | % of income book on watch

**Page 3 — Payment Trend Analysis:**
- Line: Monthly payment receipt rate (% of loans paying) — trailing 24 months
- Bar: Collections by month — Principal | Interest | Escrow (stacked)
- Scatter: Health score (x) vs. months paid last 12 (y) per loan — shows relationship between UW quality and actual payment behavior

**Page 4 — Re-Performing Tracker:**
- Table: Loans that have transitioned from NPL to current in last 12 months — Loan ID, UPB, Prior status, Current status, Re-performing since date
- Card: Re-performing count | Re-performing UPB | Re-performing success rate (stayed current 6+ months)

---

**Filters:** State, Servicer, Health Score range, Months Paid range

**Alerts:** Income collection rate below 95% in any month → alert. Watch list > 10% of income book → alert.

**Responsible Agents:** Agent 06 (primary data source), Agent 03 (health scores)

**Refresh Frequency:** Daily 6:00 AM CT (Import)

**Human Review Requirements:** Kody reviews weekly. Kerry reviews monthly as part of portfolio cycle.

---

## Dashboard 7: NPL Workout Dashboard

**Purpose:** Full NPL strategy and resolution tracking — every non-performing loan, its workout strategy, legal status, resolution timeline, and outcome tracking. Kerry uses this to manage the NPL portfolio and track loss severity trends.

**Main Users:** Kerry (strategy approval, outcome monitoring), Kody (operational tracking)

**Data Sources:**
- `loans` WHERE loan_classification = NPL OR resolution_status = Active (workout)
- `npl_workouts` — strategy, milestones, resolution details
- `property_values` — current AVM (exit value)
- `legal_matters` — legal proceedings per loan
- `diligence_exceptions` — pre-existing title/lien issues
- `cash_activity` — REO sale proceeds

---

**Required Metrics:**

| Metric | Calculation |
|---|---|
| Active NPL Count | COUNT(npl_workouts WHERE resolution_status = Active) |
| Active NPL UPB | SUM(loans.current_upb WHERE classification = NPL) |
| NPL % of Portfolio | NPL UPB / Total Portfolio UPB |
| Avg ITV (NPL) | AVG(purchase_price / avm_value) NPL loans |
| By Resolution Path | COUNT per path (Reinstatement / Modification / DIL / Short Sale / FC / REO Sale) |
| Modifications Active | COUNT WHERE resolution_path = Modification AND mod_final_status IN (Pending, Trial, Permanent) |
| FC Active | COUNT WHERE resolution_path = Foreclosure AND resolution_status = Active |
| Legal Deadlines (14 days) | COUNT WHERE next_legal_deadline <= today + 14 |
| Avg Resolution Days | AVG(DATEDIFF(resolution_date, boarding_date)) resolved loans |
| Avg Loss Severity | AVG(loss_severity) resolved NPL loans |
| Recovery Rate | 1 - AVG(loss_severity) resolved |

---

**Visual Components:**

**Page 1 — NPL Book Overview:**
- Card strip: Active NPL Count | Active NPL UPB | NPL % of Portfolio | Avg ITV | Avg Loss Severity (resolved)
- Donut: Resolution path mix (Reinstatement / Modification / DIL / Short Sale / FC / REO)
- Bar: NPL UPB by state — geographic concentration
- Gauge: NPL % of portfolio vs. policy limit (15% launch limit / 30% absolute ceiling). Red zone at limit.
- Scatter: ITV (x) vs. Days Outstanding (y) — color by resolution path. Shows which strategies are taking longest relative to collateral coverage.

**Page 2 — Resolution Pipeline:**
- Table: All active workouts — Loan ID, State, UPB, AVM, ITV, Resolution Path, Strategy Approved Date, Current Milestone, Next Legal Deadline, Days to Deadline
- Color rows by proximity to deadline: Red = ≤ 7 days, Amber = ≤ 14 days
- Sort: Next Legal Deadline ASC
- Bar: Active workouts by resolution path + estimated timeline per path (avg days to resolution by path, historical)

**Page 3 — Modification Tracker:**
- Table: All modification cases — Loan ID, Mod Type, Trial Start Date, Trial End Date, Permanent Status, New Rate, New Payment, Modification Status
- Funnel: Modification pipeline stages (Pending → Trial → Permanent / Failed)
- Line: Modification success rate (permanent modifications / total started) — trailing 12M

**Page 4 — Foreclosure and Legal Status:**
- Table: Active FC cases — Loan ID, State, FC Attorney, Filed Date, Judgment Date, FC Sale Date, Next Deadline, Case Status
- Timeline visual: FC timeline per state (estimated) — shows state-specific timelines at a glance
- Card: Avg FC timeline (months) by state — top 5 states in portfolio

**Page 5 — Resolution Outcomes (Historical):**
- Bar: Resolved loans by outcome type (Reinstatement / Modification / DIL / Short Sale / FC Sale / REO Sale / Payoff)
- Box plot or range chart: Loss severity distribution — min, avg, max by resolution type
- Line: Avg loss severity trend — trailing 24 months (improving or worsening?)
- Table: Recently resolved — Loan ID, UPB, Purchase Price, Recovery Amount, Loss Severity %, Resolution Type, Resolution Date

---

**Filters:** State, Resolution Path, Agent 07 session date, Resolution status (Active/Resolved)

**Alerts:** NPL % of portfolio exceeds 25% → alert. Any legal deadline within 7 days → alert. Loss severity avg exceeds 40% in a rolling quarter → alert.

**Responsible Agents:** Agent 07 (primary — all workout data), Agent 13 (uses this data for stress testing)

**Refresh Frequency:** Daily 6:00 AM CT (Import)

**Human Review Requirements:** Kerry reviews weekly for active FC cases with upcoming deadlines. Monthly review as part of portfolio cycle. Legal actions require separate Approval Queue authorization reviewed before execution.

---

## Dashboard 8: Legal Timeline Dashboard

**Purpose:** Dedicated legal matter calendar — all active foreclosure cases, bankruptcy proceedings, and other legal matters with their key milestones and deadlines. Designed as a deadline management tool.

**Main Users:** Kerry (legal oversight), external FC attorney reference (screenshot/export only — no Power BI access)

**Data Sources:**
- `legal_matters` — all active legal proceedings
- `npl_workouts` — workout plan context
- `loans` — loan detail
- `vendors` (vendor_type = Attorney) — attorney assignments

---

**Required Metrics:**

| Metric | Calculation |
|---|---|
| Active Legal Matters | COUNT WHERE current_status = Active |
| FC Active | COUNT WHERE matter_type = Foreclosure AND current_status = Active |
| BK Active | COUNT WHERE matter_type = Bankruptcy AND current_status = Active |
| Deadlines (7 days) | COUNT WHERE next_deadline <= today + 7 |
| Deadlines (14 days) | COUNT WHERE next_deadline <= today + 14 |
| Avg FC Age (days) | AVG(DATEDIFF(today, filing_date)) active FC |
| FC Judgments Pending | COUNT WHERE fc_judgment_date IS NULL AND matter_type = Foreclosure |
| BK Relief Granted Rate | COUNT(bk_relief_granted = true) / COUNT(BK matters) |

---

**Visual Components:**

**Page 1 — Legal Calendar View:**
- Gantt-style table: Active matters plotted against timeline — Filing Date → key milestone dates → Next Deadline. Each row = one legal matter.
- Color intensity: darker = sooner deadline
- Card row: Active FC count | Active BK count | Deadlines next 7 days | Deadlines next 30 days

**Page 2 — Deadline Tracker:**
- Table: ALL active matters with next_deadline — sorted ASC. Columns: Loan ID, Matter Type, State, Attorney, Current Milestone, Next Deadline, Days Remaining.
- Red rows: ≤ 7 days. Amber: ≤ 14 days.
- Filter: By days remaining (0–7, 8–14, 15–30, 30+)

**Page 3 — State and Attorney Analysis:**
- Map: Active legal matters by state — bubble size = count, color = avg days outstanding
- Table: By attorney/firm — Attorney name, Active matters, Avg resolution days, Matters in deadline risk (≤ 14 days)
- Bar: Avg FC timeline by state — horizontal bar (some states take 6 months, others 3+ years)

**Page 4 — Bankruptcy Detail:**
- Table: All active BK cases — Chapter, Filed date, 341 date, Plan confirmed, Relief status, Dismissed date
- Funnel: BK outcomes — Active → Relief Granted / Plan Confirmed / Dismissed → FC resumed
- Card: Avg time from BK filing to resolution (days)

---

**Filters:** Matter type, State, Attorney, Days to deadline range

**Alerts:** Any matter with next_deadline ≤ 5 days → alert email to Kerry daily. FC sale date within 14 days and no final KC sign-off → alert.

**Responsible Agents:** Agent 07 (creates and tracks all legal matters), Agent 01 (reads for daily briefing)

**Refresh Frequency:** Daily 6:00 AM CT (Import)

**Human Review Requirements:** Kerry reviews weekly — specifically the Deadline Tracker page. Any legal filing action requires separate Approval Queue authorization (tracked in Airtable, not in Power BI).

---

## Dashboard 9: Servicer KPI Dashboard

**Purpose:** Servicer performance monitoring — SLA compliance rates, collection performance, report timeliness, issue tracking, and scorecard trends. Agent 08 data; Kerry uses for servicer accountability decisions.

**Main Users:** Kerry (contract and performance decisions), Kody (operational monitoring)

**Data Sources:**
- `servicers` — servicer profiles
- `vendors` (WHERE vendor_type = Servicer) — contract and status
- `vendor_scorecards` — monthly performance scores
- `vendor_issues` — open and resolved issues
- `loans` — loan count and delinquency per servicer
- `cash_activity` — actual collections per servicer

---

**Required Metrics:**

| Metric | Calculation |
|---|---|
| Active Servicers | COUNT(servicers WHERE status = Active) |
| Servicers Below Threshold | COUNT WHERE current_sla_score < 70 |
| Servicers on Probation | COUNT WHERE status = Probation |
| Avg SLA Score (Portfolio) | AVG(current_sla_score) all active servicers |
| Open Critical Issues | COUNT(vendor_issues WHERE severity = Critical AND status = Open) |
| Total Open Issues | COUNT WHERE status in (Open, In Progress) |
| Report Timeliness Rate | COUNT(on-time reports this month) / COUNT(all active servicers) |
| Avg Collection Rate | AVG(avg_collection_rate) active servicers |

---

**Visual Components:**

**Page 1 — Servicer Scorecard Summary:**
- Table: All active servicers — Servicer Name, Active Loans, Active UPB, Overall Score, Communication Score, Accuracy Score, Collection Rate (MTD), Open Issues, Status
- Color rows: Red = score < 70 or status = Probation; Amber = score 70–79; Green = 80+
- Bar: Overall SLA score by servicer — horizontal, sorted ASC (worst on top)
- Donut: Servicers by status (Active / Probation / Terminated)

**Page 2 — Collection Performance:**
- Clustered bar: Actual vs. expected collections by servicer — current month
- Scatter: Collection rate (x) vs. loan count (y) — size = UPB. Shows performance vs. scale.
- Line: Avg collection rate per servicer — trailing 6 months. Multiple series (one line per servicer). Shows trend clearly.
- Card: Portfolio-wide collection rate MTD | Variance from expected

**Page 3 — Issue Tracker:**
- Table: All open issues — Issue ID, Servicer, Issue Type, Severity, Description, Days Open, Deadline, Status
- Color by severity: Red = Critical, Amber = Major
- Bar: Open issues by servicer — sorted DESC
- Bar: Issue count by type (SLA Miss / Error / Communication / Billing) — shows systemic patterns
- Line: Issue volume by month (trailing 12M) — is issue rate improving or worsening?

**Page 4 — Report Timeliness:**
- Table: Servicer report submission history — Servicer, Expected Date, Actual Date, Days Late, Status (On Time / Late / Missing)
- Bar: Days late by servicer — trailing 12 months, averaged
- Calendar heat map: Report submission punctuality per servicer per month

**Page 5 — Scorecard Trend:**
- Line: Monthly overall SLA score per servicer — trailing 12 months. Multiple series.
- Table: Score change MoM — Servicer, Prior Month Score, Current Month Score, Change (Δ). Color: Improving = green, Declining = red.

---

**Filters:** Servicer, Date range, Issue severity, Score range

**Alerts:** Any servicer SLA score drops below 70 → alert. Critical issue open > 5 days → alert. Servicer report missing by 5th of month → alert.

**Responsible Agents:** Agent 08 (all scorecard and issue data), Agent 06 (collection rates)

**Refresh Frequency:** Daily 6:00 AM CT (Import). Scorecard data updates monthly after Agent 08 session.

**Human Review Requirements:** Kerry reviews monthly after Agent 08 scorecard session. Servicer contract decisions (probation, termination) require Kerry approval in Airtable.

---

## Dashboard 10: Cash and Liquidity Dashboard

**Purpose:** Full cash visibility — fund-level cash position, monthly collections vs. expenses, cashflow forecast, facility utilization, and distribution cash requirements. Kerry and the future Controller use this for treasury management.

**Main Users:** Kerry (cash management decisions), Controller (when hired)

**Data Sources:**
- `cash_activity` — all cash movements
- `cashflow_forecast` — 30/60/90-day projections
- `distributions` — pending and historical distributions
- `nav_history` — NAV and fund-level capital
- `facility_status` — credit facility utilization and capacity

---

**Required Metrics:**

| Metric | Calculation |
|---|---|
| Cash Collected (Month) | SUM(cash_activity.amount WHERE category = Remittance AND current month) |
| Total Expenses (Month) | SUM WHERE category = Expense AND current month |
| Net Cash (Month) | Collections - Expenses |
| 30-Day Forecast | SUM(cashflow_forecast.forecast_30) all active loans |
| 60-Day Forecast | SUM(cashflow_forecast.forecast_60) |
| 90-Day Forecast | SUM(cashflow_forecast.forecast_90) |
| Pending Distributions | SUM(distributions.total_distribution WHERE wire_status = Pending) |
| Facility Drawn | facility_status.utilization_amount |
| Facility Available | facility_status.available_capacity |
| Facility Utilization % | facility_status.utilization_pct |
| Management Fee (YTD) | SUM(cash_activity WHERE subcategory = Management Fee AND current year) |

---

**Visual Components:**

**Page 1 — Cash Position:**
- Card strip: Cash Collected (Month) | Total Expenses (Month) | Net Cash (Month) | Pending Distributions
- Waterfall chart: Monthly cash flow — Opening Balance + Collections + Facility Draw - Expenses - Distributions - Facility Paydown = Closing Balance
- Line: Net cash position — trailing 12 months (shows cash build trend)
- Gauge: 30-day liquidity (30-day forecast / pending distributions + expenses) — "can we cover the next 30 days?"

**Page 2 — Collections Detail:**
- Stacked bar: Monthly collections by category — Principal | Interest | Escrow | Fees — trailing 12 months
- Line: Collection rate — actual / expected — trailing 12 months
- Table: Collections by servicer — current month — Servicer, Expected, Actual, Variance, Status
- Variance bar: Positive = green (overcollection), negative = red (shortfall)

**Page 3 — Cashflow Forecast:**
- Clustered bar: 30 / 60 / 90-day forecast by month — forward projections
- Table: Forecast by servicer — Servicer, 30-day, 60-day, 90-day
- Line: Cumulative forecast cash build over next 90 days
- Card: Expected acquisitions cash need (wires pending for approved LOIs)

**Page 4 — Distribution Cash Planning:**
- Table: Pending distributions — Event, Total Amount, LP Count, Expected Payment Date, Wire Status
- Bar: Historical distributions by quarter — Total amount per quarter
- Line: LP capital returned vs. preferred return paid — cumulative — shows fund obligation to LPs over time
- Card: Preferred return accrued and unpaid (aggregate across all LPs)

**Page 5 — Facility:**
- Gauge: Facility utilization % — Green zone (< 60%), Amber (60–80%), Red (> 80%)
- Card: Amount drawn | Available capacity | Total facility size
- Line: Utilization % trend — trailing 12 months
- Bar: Facility draws and paydowns by month — shows facility usage pattern
- Table: Covenant status — from `facility_status.covenant_status`; Red rows for any covenant in breach

---

**Filters:** Date range, Category, Servicer, SPV

**Alerts:** Net cash position (month) goes negative → URGENT alert. Facility utilization > 80% → alert. Pending distribution wire total exceeds available cash → alert.

**Responsible Agents:** Agent 06 (collection data), Agent 10 (NAV, financial statements), Agent 11 (distribution data), Agent 12 (facility utilization)

**Refresh Frequency:** Daily 6:00 AM CT (Import). Facility status updated monthly from Agent 12 session.

**Human Review Requirements:** Kerry reviews monthly as part of treasury management. Distribution decisions reviewed in Airtable before initiating. Wire authorizations require dual approval (never in Power BI).

---

## Dashboard 11: Distribution Dashboard

**Purpose:** Full distribution tracking — historical distributions by LP, waterfall components, wire status, and pending distribution events. Agent 11 data; Kerry and the Controller use this for distribution management.

**Main Users:** Kerry, Controller (when hired), Investors (PDF export of their individual record only)

**Data Sources:**
- `distributions` — all distribution records
- `investors` — LP context
- `capital_accounts` — LP capital account balances
- `approvals` (Distribution type) — authorization records

---

**Required Metrics:**

| Metric | Calculation |
|---|---|
| Total Distributions Paid (YTD) | SUM(total_distribution WHERE year = current AND wire_status = Confirmed) |
| Total Distributions Pending | SUM WHERE wire_status = Pending |
| LP Count (Received Distributions) | COUNT DISTINCT(investor_id WHERE wire_status = Confirmed) |
| Avg LP Distribution (YTD) | SUM / COUNT active LPs |
| Preferred Return Paid (YTD) | SUM(preferred_return_paid) current year |
| Return of Capital (YTD) | SUM(return_of_capital) current year |
| GP Carry (YTD) | Calculated separately — 20% of residual |
| Wire Confirmation Rate | COUNT(Confirmed) / COUNT(all distribution records) |

---

**Visual Components:**

**Page 1 — Distribution Overview:**
- Card strip: Total Paid (YTD) | Total Pending | LP Count | Avg Per LP | Preferred Return Paid (YTD)
- Bar: Total distributions by quarter — trailing 8 quarters (2 years). Shows distribution cadence and growth.
- Waterfall: Waterfall component breakdown for most recent distribution event — Total distributable → Expenses → Mgmt Fee → Preferred Return → Return of Capital → LP Residual → GP Carry
- Donut: Distribution component mix (% each waterfall tier)

**Page 2 — Per-LP Distribution History:**
- Table: All LPs — Investor ID, Name, Committed, Funded, Total Distributions Received, Preferred Return Paid, Return of Capital, Current Balance
- Bar: Total distributions received per LP — sorted DESC
- Line: Per-LP cumulative distributions — trailing 12 months (multiple series — one per LP)

**Page 3 — Wire Status (Current Event):**
- Table: Current distribution event — LP Name, Amount, Wire Status, Wire Date, Wire Reference. Color: Confirmed = Green, Pending = Amber, Failed = Red.
- Card: Total wired | Total pending | Total failed (current event)
- Gauge: Wire completion rate for current event (% wired of total LPs)

**Page 4 — Distribution Performance Analysis:**
- Line: Annualized distribution yield per LP — (TTM distributions / funded capital). Shows who is receiving what return.
- Bar: Preferred return coverage — how much of each LP's 8% preferred return has been paid to date
- Scatter: Funded capital (x) vs. total distributions received (y) — should be proportional; outliers flag data issues

---

**Filters:** Investor, Distribution event, Year, Quarter, Wire status

**Alerts:** Wire failure (wire_status = Failed) → alert immediately. Distribution total doesn't balance to waterfall calculation → alert.

**Responsible Agents:** Agent 10 (NAV confirmation), Agent 11 (waterfall calculation, distribution records)

**Refresh Frequency:** Daily 6:00 AM CT (Import). Distribution data written monthly from Agent 11 session.

**Human Review Requirements:** Kerry reviews before any distribution event is finalized. Wire authorization requires dual approval (Airtable Approval Queue). Investor-facing distribution statements require compliance review before distribution.

---

## Dashboard 12: Investor Reporting Dashboard

**Purpose:** LP relationship and reporting view — pipeline status, capital account summaries, report lifecycle, and data room activity. Kerry uses this for investor relations oversight; Agent 16 and Agent 17 data.

**Main Users:** Kerry (IR oversight), future IR staff

**Data Sources:**
- `investors` — LP CRM data
- `capital_accounts` — LP capital balances, IRR, MOIC
- `distributions` — distribution history
- `investor_reports` — quarterly report lifecycle
- `data_room_items` — data room document inventory
- `data_room_access_log` — LP access events
- `compliance_reviews` — report clearance status

---

**Required Metrics:**

| Metric | Calculation |
|---|---|
| Total Committed Capital | SUM(investors.committed_amount WHERE onboarding_status = Active) |
| Total Funded Capital | SUM(investors.funded_amount WHERE onboarding_status = Active) |
| Unfunded Commitments | Committed - Funded |
| Active LP Count | COUNT WHERE onboarding_status = Active |
| Pipeline LP Count | COUNT WHERE onboarding_status in (Prospect, Onboarding) |
| Pipeline Committed | SUM(committed_amount WHERE pipeline_stage in (Soft Commit, Signed)) |
| Avg LP IRR (Portfolio) | AVG(capital_accounts.current_irr) |
| Avg LP MOIC | AVG(capital_accounts.current_moic) |
| Current Report Status | investor_reports.status WHERE period = current quarter |
| Data Room Documents | COUNT(data_room_items WHERE is_active = true) |

---

**Visual Components:**

**Page 1 — LP Overview:**
- Card strip: Active LPs | Total Funded Capital | Total Committed | Unfunded | Pipeline Capital
- Funnel: Investor pipeline — Prospect → Soft Commit → Signed → Funded
- Donut: LP mix by investor type (Individual / Trust / LLC / LP)
- Bar: Funded capital by LP — horizontal bar (sorted DESC) — anonymized for screenshot sharing

**Page 2 — Capital Account Summary:**
- Table: All active LPs — LP ID, Committed, Funded, Total Distributions, Preferred Return Paid, Current Balance, Current IRR, Current MOIC
- Scatter: Funded capital (x) vs. current IRR (y) — shows LP performance distribution
- Card: Avg IRR across all LPs | Avg MOIC | Total preferred return accrued but unpaid

**Page 3 — Report Lifecycle:**
- Table: All quarterly reports — Report ID, Period, Status, Generated Date, Compliance Cleared, CEO/CIO Approved, Distributed Date, LP Count
- Gantt (or stepped funnel): Current quarter report — stage progress (Generation → Compliance → Approval → Distribution)
- Timeline: Historical reports — distributed dates vs. target dates (on time / late)

**Page 4 — Data Room Activity:**
- Table: Data room documents — Name, Type, Published Date, Access Level, Active
- Bar: Data room access events by document type — trailing 90 days (which docs are being accessed most?)
- Line: Data room access events by week — trailing 12 weeks (engagement trend)
- Card: Total active documents | Documents accessed in last 30 days

**Page 5 — Investor Communication Log:**
- Table: Recent communications — LP Name, Date, Type, Summary, Follow-Up Date
- Bar: Communication volume by month — trailing 6 months
- Filter: By LP, by communication type

---

**Filters:** Investor type, Onboarding status, Pipeline stage, Report period

**Alerts:** Unfunded commitment > 60 days from commitment date → alert. Report past target distribution date → alert. LP without any communication in 90 days → alert.

**Responsible Agents:** Agent 16 (CRM data), Agent 17 (report lifecycle, data room), Agent 10 (capital account data)

**Refresh Frequency:** Daily 6:00 AM CT (Import)

**Human Review Requirements:** Kerry reviews quarterly as part of reporting cycle. All investor-facing materials reviewed in Airtable Compliance / Approval Queue before distribution.

---

## Dashboard 13: Risk and Stress Testing Dashboard

**Purpose:** All risk limits and stress test outputs — current status (Green/Amber/Red per limit), trend analysis, concentration analytics, and scenario stress test results. Agent 13 data. This is the governance and risk management command center.

**Main Users:** Kerry (primary — risk oversight), future CRO or Risk Committee

**Data Sources:**
- `risk_metrics` — all monthly risk limit readings (current and historical)
- `loans` — loan-level data for concentration calculations
- `property_values` — current AVMs for portfolio LTV
- `facility_status` — leverage and covenant data
- `cash_activity` — liquidity data
- `nav_history` — fund-level NAV

---

**Risk Limits Tracked (from `risk_limits.md`):**

| Limit | Threshold |
|---|---|
| NPL Concentration | 15% launch / 30% absolute ceiling |
| Geographic Concentration | No single state > 25% of UPB |
| Single Loan Concentration | No single loan > 5% of UPB |
| Servicer Concentration | No servicer > 35% of UPB |
| Lien Position | 1st lien only — any 2nd lien = Red |
| Income LTV | ≤ 75% portfolio average |
| NPL ITV | ≤ 60% (up to 70% near-performing) |
| Leverage Ratio | TBD per facility terms |
| Liquidity Buffer | Minimum 60 days of fund expenses in cash |

---

**Required Metrics:**

| Metric | Calculation |
|---|---|
| Red Limit Count | COUNT(risk_metrics WHERE status = Red AND most recent) |
| Amber Limit Count | COUNT WHERE status = Amber AND most recent |
| All Green | BOOL — all limits Green |
| NPL % | NPL UPB / Total UPB |
| Largest State % | MAX(state UPB) / Total UPB |
| Largest Loan % | MAX(current_upb) / Total UPB |
| Largest Servicer % | MAX(servicer UPB) / Total UPB |
| Portfolio Avg LTV | AVG(current_upb / avm_value) |
| NPL Avg ITV | AVG(purchase_price / avm_value) NPL loans |
| Facility Utilization | facility_status.utilization_pct |
| Liquidity Buffer Days | Cash balance / avg monthly expenses |

---

**Visual Components:**

**Page 1 — Risk Status Board (Primary View):**
- Risk limit status grid: Each limit displayed as a colored box (Green/Amber/Red) with current value and limit value visible. This is the one-page governance view.
- Large gauge per critical limit (NPL %, Geographic max, LTV) with zones colored Green/Amber/Red
- Card: Red count | Amber count | All Green flag
- Date filter: Compare current period vs. prior month to see changes

**Page 2 — Concentration Analytics:**
- Map: Loan UPB by state — filled map with state concentration % labeled. Red states where concentration approaches 25% limit.
- Treemap: Loan UPB by servicer — visual representation of servicer concentration
- Horizontal bar: Top 10 individual loans by UPB — with % of total portfolio. Red line at 5% threshold.
- Donut: Lien position distribution (should be 100% 1st lien — any 2nd lien visible immediately)

**Page 3 — LTV and Valuation Risk:**
- Scatter: Current UPB (y) vs. AVM value (x) per loan — red dashed line at 75% LTV slope. Points above line = above policy.
- Histogram: LTV distribution (binned 10% ranges) — how many loans in each LTV bucket
- Card: % of portfolio with LTV > 75% | Avg portfolio LTV
- Line: Avg portfolio LTV trend — trailing 12 months (is collateral coverage improving?)

**Page 4 — Stress Test Results:**
- Filter: Stress scenario (Base / Downside / Severe Downside)
- Card row: Stressed NPL % | Stressed LTV | Stressed Loss Severity | Stressed IRR
- Waterfall: Base case portfolio value vs. downside case → severe downside case. Shows value at risk.
- Table: Stress test by risk limit — Limit Name, Base Value, Downside Value, Severe Downside Value, Limit, Status under each scenario
- Scenario selector: Kerry can view all three scenarios and see which limits breach under stress

**Page 5 — Risk Trend (Historical):**
- Line (multi-series): All risk limit values — monthly trailing 12M. Each limit its own line. Limit line shown as horizontal dashed reference.
- Table: Monthly risk status log — Period, each limit status. Shows at-a-glance if status is stable, improving, or worsening over time.
- Bar: Count of Amber and Red limits per month — trailing 12M (governance health trend)

---

**Filters:** Period, Stress scenario, Limit category

**Alerts (DirectQuery on risk_metrics):**
- Any Red limit → immediate data-driven alert email
- Amber count > 3 → alert
- NPL % crosses 20% → alert

**Responsible Agents:** Agent 13 (primary — all risk metrics and stress test data), Agent 01 (reads for briefing)

**Refresh Frequency:** Daily 6:00 AM CT (Import for historical). Risk Status Board page uses DirectQuery for real-time status.

**Human Review Requirements:** Kerry reviews monthly after Agent 13 session. Red limit breaches require mandatory CEO/CIO acknowledgment in Airtable Approval Queue before any new acquisition or investment activity in the breaching category.

---

## Dashboard 14: Vendor Performance Dashboard

**Purpose:** All vendor performance — servicers, attorneys, title companies, BPO providers — in one view. Scorecard trends, issue patterns, contract expiry, and SLA compliance. Consolidates what the Servicer KPI Dashboard shows for servicers and extends it to all vendor types.

**Main Users:** Kerry (vendor governance), Kody (operational vendor management)

**Data Sources:**
- `vendors` — full vendor registry
- `vendor_scorecards` — monthly scores (all vendor types)
- `vendor_issues` — open and resolved issues
- `servicers` — servicer-specific performance data (via vendors join)
- `legal_matters` — attorney performance (cases assigned)

---

**Required Metrics:**

| Metric | Calculation |
|---|---|
| Active Vendors | COUNT WHERE status = Active |
| Vendors on Probation | COUNT WHERE status = Probation |
| Total Open Issues | COUNT WHERE status in (Open, In Progress) |
| Critical Open Issues | COUNT WHERE severity = Critical |
| Contracts Expiring (90 days) | COUNT WHERE contract_end <= today + 90 |
| Avg Overall Score (all vendors) | AVG(vendor_scorecards.overall_score) most recent period |
| Below Threshold | COUNT WHERE overall_score < 70 |

---

**Visual Components:**

**Page 1 — All Vendor Summary:**
- Card strip: Active vendors | Probation | Expiring contracts (90d) | Open issues | Critical issues
- Table: All active vendors — Company, Type, Status, Current Score, Open Issues, Contract Expiry, Days to Expiry
- Color rows: Red = probation or critical issues; Amber = score < 80 or expiry < 90 days
- Bar: Score distribution by vendor type (Servicer / Attorney / Title / BPO / Other)
- Donut: Vendors by type

**Page 2 — Issue Tracker (All Vendors):**
- Table: All open issues — Vendor, Type, Issue Type, Severity, Days Open, Deadline, Status
- Bar: Issue volume by vendor type — where are issues concentrated?
- Line: Issue count by month — trailing 12M (trend up or down?)
- Bar: Days to resolve (avg by vendor and by issue type) — SLA management view

**Page 3 — Scorecard Trends:**
- Line: Monthly score by vendor — each vendor a separate series — trailing 12M
- Table: Score MoM change — Vendor, Prior Score, Current Score, Δ, Trend (↑ ↓ →)
- Bar: Bottom 5 vendors by current score

**Page 4 — Contract Management:**
- Table: All vendor contracts — Vendor, Type, Contract Start, Contract End, Days to Expiry, Status, Renewal Decision
- Sorted: Days to Expiry ASC
- Color: Red = ≤ 30 days; Amber = ≤ 90 days
- Card: Count of contracts expiring in each window (30d, 60d, 90d)

**Page 5 — Attorney Performance:**
- Table: All attorneys — Firm, Active Cases, Avg Case Age (days), Cases Won (FC completed), Avg FC Timeline
- Bar: Avg resolution days by attorney
- Map: Attorney coverage by state — shows which attorneys cover which geographic areas

---

**Filters:** Vendor type, Status, Date range, Issue severity

**Alerts:** Vendor score drops below 70 → alert. Critical issue open > 5 days → alert. Contract expiry within 30 days → alert.

**Responsible Agents:** Agent 08 (scorecards, issues for all vendor types), Agent 07 (attorney case data via legal_matters)

**Refresh Frequency:** Daily 6:00 AM CT (Import). Scorecard data updates monthly.

**Human Review Requirements:** Kerry reviews monthly after Agent 08 session. Vendor contract renewal decisions tracked in Airtable Approval Queue.

---

## Dashboard 15: Compliance Dashboard

**Purpose:** Compliance monitoring — review queue status, Agent 14 clearance history, Agent 15 quarterly control test results, regulatory deadline tracking, and annual compliance health. The governance and audit view.

**Main Users:** Kerry (governance oversight), future Compliance Officer, external auditor (read-only export)

**Data Sources:**
- `compliance_reviews` — all review records
- `agent_logs` WHERE agent_number = 14 OR 15 — session history
- `approvals` WHERE approval_type = Compliance — authorization records
- `investor_reports` — report lifecycle and compliance status
- `audit_log` (if implemented separately) — Agent 15 control test outputs
- `agent_tasks` WHERE agent_number = 15 — control test sessions

---

**Required Metrics:**

| Metric | Calculation |
|---|---|
| Pending Reviews | COUNT WHERE review_result = Pending |
| Cleared (YTD) | COUNT WHERE review_result = Cleared AND year = current |
| Not Cleared (YTD) | COUNT WHERE review_result = Not Cleared |
| Clearance Rate | Cleared / (Cleared + Not Cleared) |
| Avg Review Days | AVG(DATEDIFF(review_date, submitted_date)) |
| Control Tests (YTD) | COUNT(agent_tasks WHERE agent_number = 15 AND status = Complete AND year = current) |
| Control Test Pass Rate | Based on agent_logs output structured data |
| Failed Controls (Last Test) | COUNT from most recent control test output |

---

**Visual Components:**

**Page 1 — Compliance Queue:**
- Card strip: Pending reviews | Cleared YTD | Not Cleared YTD | Clearance rate | Avg days to review
- Table: All pending reviews — Material Name, Type, Submitted Date, Days Pending, Status
- Color: Red = pending > 10 business days
- Bar: Review volume by month and type — trailing 12M
- Funnel: Review lifecycle — Submitted → Under Review → Cleared / Not Cleared / Conditions

**Page 2 — Clearance History:**
- Table: All reviews — Material, Type, Submitted, Review Date, Result, Issues Count, CEO/CIO Approved, Released Date
- Bar: Clearance rate by material type — which categories are most likely to have issues?
- Line: Clearance rate by month — trailing 12M (should trend toward 100%)
- Table: Not Cleared materials — Material, Issues Found, Resolution Required, Current Status

**Page 3 — Agent 15 Control Tests:**
- Table: All control tests — Period, Date, Controls Tested, Passed, Failed, Pass Rate, Status
- Color rows: Red = any failures; Green = 100% pass
- Detailed table: Most recent test — Control Name | Required | Result (Pass/Fail) | Notes
- Line: Pass rate trend — quarterly (should be 100% every quarter)
- Card: Quarters since last failed control

**Page 4 — Report Compliance Tracking:**
- Table: Quarterly reports — Period, Generation Date, Compliance Submitted, Compliance Cleared, Clearance Date, Days in Review, CEO/CIO Approved, Distribution Date
- Benchmark: Target distribution timeline (e.g., within 45 days of quarter-end)
- Line: Days from quarter-end to distribution — trailing 8 quarters. Trend line.
- Card: Current quarter report status (large status pill — Draft / Under Review / Cleared / Distributed)

**Page 5 — Compliance Calendar:**
- Table: All regulatory and operational deadlines — Category, Deadline Name, Due Date, Days Remaining, Responsible, Status
- Color: Red = ≤ 7 days; Amber = ≤ 30 days; Green = 30+ days
- Sorted: Due Date ASC
- Bar: Upcoming deadlines by category and month — forward 6 months

---

**Filters:** Material type, Review result, Date range, Agent (14 vs. 15), Quarter

**Alerts:** Any pending compliance review > 10 business days → alert. Failed control test → URGENT alert. Regulatory deadline missed → URGENT alert. Current quarter report not distributed within 45 days of quarter-end → alert.

**Responsible Agents:** Agent 14 (compliance reviews, clearance records), Agent 15 (control tests, governance audit)

**Refresh Frequency:** Daily 6:00 AM CT (Import)

**Human Review Requirements:** Kerry reviews Control Tests page quarterly after Agent 15 session. Any Not Cleared material or failed control requires Kerry decision in Airtable Approval Queue. Compliance dashboard exported as PDF and reviewed by legal counsel annually.

---

## Power BI Governance and Access

**Workspace Access:**
| Role | Access |
|---|---|
| Kerry (Workspace Admin) | Full admin — create, edit, delete, publish all reports |
| Kody (Member) | View and download reports; cannot publish or edit |
| TJ (Viewer) | View assigned reports only (Portfolio, Servicer KPI); no download |
| Controller (future — Member) | View all financial dashboards; cannot edit |
| External Auditor (Viewer — temporary) | View only Export/Reporting dashboards during engagement; removed after audit |
| LP Investors | No Power BI access — reports distributed as PDF only |

**PDF Export Rules:**
- All 15 dashboards can be exported to PDF manually by Kerry
- Investor Reporting Dashboard — export function used for LP quarterly report PDF (routed through Agent 17 → compliance review → Kerry approval → distribution)
- No dashboard auto-exports to external parties — export is always a human-initiated action

**Report Embedding:** Not enabled at lean stage. Phase 6 consideration: embed Executive Dashboard in a secure internal portal for Kerry's mobile access.

**Audit Trail:** All Power BI workspace access events are logged in the Microsoft 365 audit log. Agent 15 reviews Power BI access log in quarterly control test to confirm `powerbi_readonly` credentials have not been shared or misused.
