# Table 7: Automations
## Standalone registry — no dependencies

---

## Purpose
The master registry of every automation in the system — Zapier zaps, Airtable-native automations, and Phase II n8n workflows. This is documentation, not execution. Every automation gets a record here before it's built anywhere else. Keeps the system auditable and prevents duplicate or conflicting automations.

---

## How to Set Up

Click **+** → Add a table → Name it: **Automations**

---

## Fields — Build in This Exact Order

### Field 1: Automation Name
- **Type:** Single line text
- **Primary field** — rename default "Name" to "Automation Name"
- Format: "[Tool]-[Number]: [Short description]" (e.g., "ZAP-01: New deal → Slack alert")

### Field 2: Tool
- **Type:** Single select
- **Options:**
  - Zapier
  - Airtable Native
  - n8n (Phase II)
  - Google Apps Script
  - Claude Code / MCP
  - Manual

### Field 3: Department
- **Type:** Single select
- **Options:**
  - Acquisitions
  - Underwriting
  - Diligence
  - Portfolio Management
  - Compliance
  - Team Operations
  - Admin
  - Finance

### Field 4: Trigger
- **Type:** Long text
- Describe exactly what starts this automation (e.g., "New record created in Deals table")

### Field 5: Condition
- **Type:** Long text
- Any filter applied to the trigger (e.g., "Only when Status = Pricing")

### Field 6: Action
- **Type:** Long text
- What the automation does (e.g., "Send Slack message to #team-notifications")

### Field 7: Output
- **Type:** Single line text
- What is produced (e.g., "Slack alert", "New Airtable record", "Email")

### Field 8: Human Approval Required
- **Type:** Checkbox
- Check if this automation cannot fire without Kerry's explicit prior approval

### Field 9: Risk Level
- **Type:** Single select
- **Options:**
  - Low
  - Medium
  - High
  - Critical

### Field 10: Status
- **Type:** Single select
- **Options:**
  - Planned
  - Active
  - Paused
  - Deactivated
  - Testing

### Field 11: Last Tested
- **Type:** Date
- Format: M/D/YYYY

### Field 12: Phase
- **Type:** Single select
- **Options:**
  - Phase I (Zapier)
  - Phase II (n8n)
  - Future

### Field 13: Notes
- **Type:** Long text

### Field 14: Date Added
- **Type:** Created time

---

## Views — Create These 5 Views

**View 1: All Automations** (rename the default)
- No filter
- Sort: Tool, then Automation Name

**View 2: Active**
- Filter: Status = Active
- Group by: Tool

**View 3: Planned (Ready to Build)**
- Filter: Status = Planned

**View 4: Needs Testing**
- Filter: Status = Testing OR Last Tested is empty AND Status = Active

**View 5: High Risk**
- Filter: Risk Level in [High, Critical]
- Sort: Status

---

## First 7 Records — Phase I Automation Registry

Enter all 7 Zapier automations from the plan as Planned records. They get activated after Airtable is fully built.

**Record 1**
| Field | Value |
|---|---|
| Automation Name | ZAP-01: New deal → Slack alert |
| Tool | Zapier |
| Department | Acquisitions |
| Trigger | New record created in Deals table |
| Action | Send Slack message to #team-notifications with deal name, note type, UPB, assigned owner |
| Human Approval Required | Unchecked |
| Risk Level | Low |
| Status | Planned |
| Phase | Phase I (Zapier) |

**Record 2**
| Field | Value |
|---|---|
| Automation Name | ZAP-02: Deal status → Pricing → Slack alert |
| Tool | Zapier |
| Department | Acquisitions |
| Trigger | Deal Status updated to "Pricing" |
| Action | Send Slack alert: bid review needed, deadline date |
| Human Approval Required | Unchecked |
| Risk Level | Low |
| Status | Planned |
| Phase | Phase I (Zapier) |

**Record 3**
| Field | Value |
|---|---|
| Automation Name | ZAP-03: Approval Status → Pending → Notify Kerry |
| Tool | Zapier |
| Department | Acquisitions |
| Trigger | Approval Status changes to "Pending" in Deals |
| Action | Slack channel message + DM to Kerry |
| Human Approval Required | Unchecked (this IS the approval notification) |
| Risk Level | Low |
| Status | Planned |
| Phase | Phase I (Zapier) |

**Record 4**
| Field | Value |
|---|---|
| Automation Name | ZAP-04: Deal status change → team update |
| Tool | Zapier |
| Department | Acquisitions |
| Trigger | Status field changes in Deals (filtered to key statuses only) |
| Action | Slack message with deal name, new status, next action |
| Human Approval Required | Unchecked |
| Risk Level | Low |
| Status | Planned |
| Phase | Phase I (Zapier) |

**Record 5**
| Field | Value |
|---|---|
| Automation Name | ZAP-05: New contact → create follow-up task |
| Tool | Zapier |
| Department | Acquisitions |
| Trigger | New record in Contacts table |
| Action | Create Task record: "Initial follow-up: [Name]" assigned to Kerry, due in 3 days |
| Human Approval Required | Unchecked |
| Risk Level | Low |
| Status | Planned |
| Phase | Phase I (Zapier) |

**Record 6**
| Field | Value |
|---|---|
| Automation Name | ZAP-06: Task overdue → Slack alert |
| Tool | Zapier |
| Department | Team Operations |
| Trigger | Daily check: Tasks where Days Until Due < 0 and Status not Complete |
| Action | Slack message listing overdue tasks and owners |
| Human Approval Required | Unchecked |
| Risk Level | Low |
| Status | Planned |
| Phase | Phase I (Zapier) |

**Record 7**
| Field | Value |
|---|---|
| Automation Name | ZAP-07: Deal approved → create DD checklist tasks |
| Tool | Zapier |
| Department | Diligence |
| Trigger | Approval Status changes to "Approved" in Deals |
| Action | Create 8 due diligence tasks in Tasks table linked to that deal |
| Human Approval Required | Unchecked |
| Risk Level | Medium |
| Status | Planned |
| Phase | Phase I (Zapier) |

---

## Common Mistakes to Avoid

- **Register before you build** — never build a Zapier zap or automation without creating the registry record first
- **Human Approval Required = checked** means the automation should NEVER fire automatically for that action — it's a flag that a human must initiate
- **Do not mark anything Active until it has been tested** — keep status at "Testing" until Slack messages confirm correctly
- **Phase II automations stay as Planned** — n8n is not being built yet. Record them, don't build them

---

## Completion Checklist

- [ ] Table named "Automations"
- [ ] All 14 fields created
- [ ] Tool has all 6 options
- [ ] Risk Level has all 4 options
- [ ] Status has all 5 options
- [ ] Phase has all 3 options
- [ ] All 5 views created
- [ ] All 7 Phase I automation records entered with Status = Planned
- [ ] Active view is currently empty (nothing is active yet — correct)

**Done with all 7 tables. Open `08-zapier-checklist.md`**
