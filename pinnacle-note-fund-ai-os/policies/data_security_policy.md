# Data Security Policy

**Fund:** The Pinnacle Note Fund
**Effective Date:** [DATE]
**Approved By:** CEO/CIO
**Maintained By:** Agent 18 (Data, Automation, Dashboards & Security)

---

## 1. Purpose

This policy governs how the fund collects, stores, accesses, transmits, and protects sensitive data — including borrower personally identifiable information (PII), investor data, wire and banking data, legal data, and fund operational data. Data security is not a technology problem — it is an operational and fiduciary obligation.

---

## 2. Data Classification

All data handled by the fund is classified into one of four categories:

| Class | Description | Examples |
|---|---|---|
| **Public** | Non-sensitive; may be disclosed publicly | Fund strategy description, general market commentary |
| **Internal** | Non-sensitive operational data; internal use only | Internal meeting notes, operating reports, non-financial agent outputs |
| **Confidential** | Sensitive; strict access controls required | Borrower PII, investor PII, wire instructions, bank account data, legal files, fund performance data, investor capital accounts |
| **Restricted** | Highest sensitivity; CEO/CIO access only or dual-key control | Wire authorization records, investor SSNs, fund banking credentials, legal settlement records |

---

## 3. Sensitive Data Types

### Borrower Data (Confidential)
- Full name, address, SSN/EIN
- Loan account numbers
- Payment history and account balances
- Bankruptcy and legal records related to the borrower
- Contact information (phone, email)

**Governance:** Borrower PII may only be accessed by agents and team members with a legitimate operational need (e.g., servicer setup, legal filing). It may never be transmitted via unencrypted email.

### Investor Data (Confidential / Restricted)
- Full legal name, entity documents, SSN/EIN/TIN
- Bank account and wire instructions
- Capital account balances and transaction history
- Subscription documents
- DDQ information

**Governance:** Investor data may only be accessed by: CEO/CIO, Agent 10 (accounting), Agent 11 (treasury), Agent 16 (IR), Agent 17 (reporting). All access is logged.

### Wire and Banking Data (Restricted)
- Fund bank account numbers and routing numbers
- Wire instructions for all accounts
- Servicer remittance account details
- Vendor payment account details

**Governance:** Wire instructions may only be stored in the fund's designated secure document system. Wire instruction changes from any counterparty must be verified by phone call to a known number — never by email alone. CEO/CIO maintains sole access to fund wire initiation.

### Legal Data (Confidential)
- Foreclosure case files
- Bankruptcy case files
- Settlement agreements
- Legal correspondence

**Governance:** Legal files are maintained in the fund's secure document system with access limited to agents and team members with active need.

---

## 4. Access Controls

### Principle of Least Privilege
Every agent, team member, and vendor is granted access only to the data and systems they need to perform their specific function. Access is not granted by default — it is requested, authorized, and logged.

### Access Authorization Matrix

| System / Data | Who May Access | Authorization Required |
|---|---|---|
| Fund bank accounts | CEO/CIO, Controller | CEO/CIO |
| Investor data room | CEO/CIO, Agent 17, authorized investors | CEO/CIO + Agent 17 |
| Borrower PII | CEO/CIO, servicer (via secure portal), Agents 06, 07, 08 | CEO/CIO |
| Wire instructions | CEO/CIO, Controller | CEO/CIO |
| Legal files | CEO/CIO, Agent 07, Agent 08, legal counsel | CEO/CIO |
| Agent system outputs | All agents (read); Agent 01 (routing) | Agent 18 manages |
| Investor capital accounts | CEO/CIO, Agent 10, Agent 11, Agent 17 | CEO/CIO |

### Access Logging
All access to Confidential and Restricted data must be logged. Agent 18 reviews access logs quarterly and flags any anomalous or unauthorized access to Agent 15 and CEO/CIO.

---

## 5. Vendor Access

Third-party vendors (servicers, special servicers, fund admin, auditors, counsel) are granted access to fund data only as required for their contracted services.

- All vendor access must be documented in the vendor agreement
- Vendor access to Confidential data requires CEO/CIO authorization
- Vendor access logs are reviewed by Agent 08 (Vendor Oversight) and Agent 18 quarterly
- Upon vendor termination, access is revoked within 24 hours by Agent 18

---

## 6. Data Storage and Transmission Standards

### Storage
- Confidential and Restricted data must be stored in encrypted systems
- No Confidential data may be stored in unprotected shared drives or personal devices
- Agent 18 confirms storage standards are met for all fund data systems

### Transmission
- Confidential data may not be transmitted via unencrypted email
- Investor reports and statements: transmitted via encrypted email or secure data room portal
- Wire instructions: transmitted via fund's secure document system only; never modified via email instruction
- Legal files: transmitted via secure file transfer or secure portal only

---

## 7. Incident Response

If a data breach or suspected unauthorized access is identified:

### Immediate Actions (within 4 hours)
1. Agent 18 escalates to CEO/CIO immediately
2. Incident is logged with full detail: what data, how accessed, when discovered
3. CEO/CIO determines whether to initiate formal incident response
4. Affected systems are assessed for ongoing exposure

### Short-Term Actions (within 48 hours)
5. Affected access is revoked or contained
6. Scope of breach is determined: what data was accessed, who is affected
7. Legal counsel is engaged to assess notification obligations (investors, regulators, borrowers)
8. Fund admin and relevant counterparties are notified if their data was involved

### Documentation
All incidents are logged in `/logs/audit_log.md` with full detail and resolution.

---

## 8. Audit and Review

- Agent 18 completes a quarterly access control audit: all access grants reviewed, anomalies flagged
- Agent 15 tests data security controls as part of quarterly internal audit
- Any material finding is escalated to CEO/CIO
- Annual security review is delivered to CEO/CIO

---

## 9. Team Member Responsibilities

Every team member handling fund data is responsible for:
- Accessing only data they are authorized to access
- Reporting any suspected unauthorized access immediately to CEO/CIO and Agent 18
- Not sharing credentials or providing access to unauthorized parties
- Not storing Confidential fund data on personal devices or unprotected personal accounts
- Following wire instruction verification protocols at all times
