# Pinnacle Note Fund -- Agents Registry

**Generated:** 2026-05-08 15:19
**Model:** claude-opus-4-7
**API:** Anthropic Managed Agents (managed-agents-2026-04-01)

---

## Agent IDs

| Slug | Name | Agent ID |
|---|---|---|
| AGENT_01_ID | Pinnacle Note Fund - Agent 01: Chief Operating Coordinator | `agent_011CaqinHC4qRNA24W17evPe` |
| AGENT_02_ID | Pinnacle Note Fund - Agent 02: Acquisitions and Seller Relations | `agent_011CaqinPCyBJpYsTiXMpxX4` |
| AGENT_03_ID | Pinnacle Note Fund - Agent 03: Credit Underwriting | `agent_011CaqinVMoYddautjT4zbUE` |
| AGENT_04_ID | Pinnacle Note Fund - Agent 04: Pricing and Tape Analytics | `agent_011Caqinbqje5CMPxjSbYBqk` |
| AGENT_05_ID | Pinnacle Note Fund - Agent 05: Diligence, Collateral and Closing | `agent_011CaqinhoA7sA2TniMci69h` |
| AGENT_06_ID | Pinnacle Note Fund - Agent 06: Performing Portfolio and Cashflow | `agent_011CaqinrMbzn8t9WBPPDWFL` |
| AGENT_07_ID | Pinnacle Note Fund - Agent 07: Workout, Loss Mitigation and REO | `agent_011CaqinxyU4m2cdAMb9CSgN` |
| AGENT_08_ID | Pinnacle Note Fund - Agent 08: Servicer, Counsel and Vendor Oversight | `agent_011Caqio7STvDKKA2iVZraT2` |
| AGENT_09_ID | Pinnacle Note Fund - Agent 09: QA, Exceptions and Boarding Control | `agent_011CaqioGTwdd1g4XLtkVRDj` |
| AGENT_10_ID | Pinnacle Note Fund - Agent 10: Fund Controller and SPV Accounting | `agent_011CaqioNRsErXQZdNQUy1jF` |
| AGENT_11_ID | Pinnacle Note Fund - Agent 11: Cash Controls, Distributions and Treasury | `agent_011CaqioV1Fg25Tgr6X84SSr` |
| AGENT_12_ID | Pinnacle Note Fund - Agent 12: Capital Markets, Facility and Securitization | `agent_011CaqioaWtrg5HExFPPn2b3` |
| AGENT_13_ID | Pinnacle Note Fund - Agent 13: Risk Analytics and Stress Testing | `agent_011CaqioiSdjecuPm7G1sN6y` |
| AGENT_14_ID | Pinnacle Note Fund - Agent 14: Compliance, Marketing Review and Disclosure | `agent_011Caqiop7hXUrP4KJ4bL7Sp` |
| AGENT_15_ID | Pinnacle Note Fund - Agent 15: Conflicts, Audit Controls and Governance | `agent_011CaqiovcNbPRPPVT6d4Jsh` |
| AGENT_16_ID | Pinnacle Note Fund - Agent 16: Investor Relations, Sales and Client Service | `agent_011Caqip2JgFmxn57FPoESde` |
| AGENT_17_ID | Pinnacle Note Fund - Agent 17: DDQ, Data Room and Investor Reporting | `agent_011Caqip9ehGEkngGS3ZtbNM` |
| AGENT_18_ID | Pinnacle Note Fund - Agent 18: Data, Automation, Dashboards and Security | `agent_011CaqipFYetnGXe19k9fnbH` |


---

## Usage

To start a session with any agent:

```
POST https://api.anthropic.com/v1/agents/{agent_id}/sessions
Headers: anthropic-beta: managed-agents-2026-04-01
```

All agent IDs are also stored in the .env file at the root of the E.A workspace.

---

## Notes

- All 18 agents use the agent_toolset_20260401 toolset
- System prompts embed fund policies, buy box limits, and human approval gates
- Human approval required for all investments, wires, legal actions, investor communications
- No AI agent may authorize any action in the Human Approval Matrix
