# Table 4: Tasks
## Requires: Deals + Contacts must be complete first

---

## Purpose
Every action item for Kerry, Kody, and TJ. This replaces iMessage/text task assignment. When a task is assigned, it lives here — not in someone's head or a group chat. Every task has an owner, a due date, and a clear definition of done.

---

## How to Set Up

Click **+** → Add a table → Name it: **Tasks**

---

## Fields — Build in This Exact Order

### Field 1: Task Name
- **Type:** Single line text
- **Primary field** — rename default "Name" to "Task Name"
- Be specific: "Order BPO for Evans Portfolio" not "BPO"

### Field 2: Department
- **Type:** Single select
- **Options:**
  - Acquisitions
  - Underwriting
  - Diligence
  - Closing
  - Portfolio Management
  - Compliance
  - Team Operations
  - Admin
  - Finance

### Field 3: Related Deal
- **Type:** Linked to another record
- **Link to table:** Deals
- Allow multiple: **No**

### Field 4: Related Contact
- **Type:** Linked to another record
- **Link to table:** Contacts
- Allow multiple: **No**

### Field 5: Owner
- **Type:** Single select
- **Options:**
  - Kerry
  - Kody
  - TJ

### Field 6: Priority
- **Type:** Single select
- **Options:**
  - URGENT
  - High
  - Normal
  - Low

### Field 7: Status
- **Type:** Single select
- **Options:**
  - Not Started
  - In Progress
  - Complete
  - Blocked
  - Cancelled

### Field 8: Due Date
- **Type:** Date
- Format: M/D/YYYY

### Field 9: Days Until Due
- **Type:** Formula
- **Formula:**
```
IF({Due Date} = BLANK(), "", DATETIME_DIFF({Due Date}, TODAY(), 'days'))
```

### Field 10: Completed Date
- **Type:** Date
- Format: M/D/YYYY
- Entered manually when a task is marked complete

### Field 11: AI Agent / Skill Used
- **Type:** Single line text
- Which Claude Code skill generated or assigned this task (e.g., "note-investing-underwriter", "business-task-manager", "Manual")

### Field 12: Approval Required
- **Type:** Checkbox
- Check this if the task cannot be completed without Kerry's explicit sign-off

### Field 13: Notes
- **Type:** Long text

### Field 14: Created
- **Type:** Created time

---

## Views — Create These 7 Views

**View 1: All Tasks** (rename the default)
- No filter
- Sort: Due Date ASC

**View 2: Kerry's Queue**
- Filter: Owner = Kerry AND Status not in [Complete, Cancelled]
- Sort: Priority DESC, then Days Until Due ASC
- *This is Kerry's primary daily view*

**View 3: Kody's Queue**
- Filter: Owner = Kody AND Status not in [Complete, Cancelled]
- Sort: Priority DESC, Days Until Due ASC

**View 4: TJ's Queue**
- Filter: Owner = TJ AND Status not in [Complete, Cancelled]
- Sort: Priority DESC, Days Until Due ASC

**View 5: Due Today**
- Filter: Due Date = today AND Status not in [Complete, Cancelled]

**View 6: Overdue**
- Filter: Days Until Due < 0 AND Status not in [Complete, Cancelled]
- Color rows: Red
- Sort: Days Until Due ASC (most overdue first)

**View 7: Waiting on Approval**
- Filter: Approval Required = checked AND Status = Blocked

---

## First 3 Sample Records

**Record 1 — Active underwriting task**

| Field | Value |
|---|---|
| Task Name | Run Evans Portfolio through underwriting skill |
| Department | Underwriting |
| Related Deal | Evans Portfolio Q2-2026 |
| Owner | Kerry |
| Priority | High |
| Status | In Progress |
| Due Date | [3 days from today] |
| Notes | Use note-investing-underwriter skill. Paste IC memo into Deals table when complete. |

**Record 2 — Follow-up task**

| Field | Value |
|---|---|
| Task Name | Follow up with Marcus Evans — tape questions |
| Department | Acquisitions |
| Related Deal | Evans Portfolio Q2-2026 |
| Related Contact | Marcus Evans |
| Owner | Kerry |
| Priority | Normal |
| Status | Not Started |
| Due Date | [tomorrow] |

**Record 3 — Admin task for Kody**

| Field | Value |
|---|---|
| Task Name | Review foreclosure timeline for LA (Desi Arnez course reference) |
| Department | Underwriting |
| Owner | Kody |
| Priority | Normal |
| Status | Not Started |
| Due Date | [end of this week] |
| Notes | Reference State FC doc in Google Drive. Log findings in team notes. |

---

## Common Mistakes to Avoid

- **"Blocked" status requires an explanation in Notes** — don't mark something Blocked without writing why
- **Every task must have an Owner** — if it doesn't have an owner, it doesn't get done
- **Approval Required checkbox is not the same as the Approval Queue** — checking this just flags it. The actual approval happens in the Approval Queue table (added later in the note fund system)
- **Do not create tasks for recurring habits** (like "check Slack daily") — only create tasks for specific, completable items
- **Complete date is manual** — Airtable won't fill it automatically. When you mark a task Complete, also fill the Completed Date field

---

## Completion Checklist

- [ ] Table named "Tasks"
- [ ] All 14 fields created
- [ ] Department has all 9 options
- [ ] Owner has 3 options: Kerry, Kody, TJ
- [ ] Status has all 5 options
- [ ] Priority has all 4 options
- [ ] Related Deal links to Deals table (Evans Portfolio should appear)
- [ ] Related Contact links to Contacts table (Marcus Evans should appear)
- [ ] Days Until Due formula calculates correctly
- [ ] All 7 views created
- [ ] Kerry's Queue view shows only Kerry's incomplete tasks
- [ ] Overdue view colors rows red
- [ ] 3 sample records entered

**Done? Open `05-documents.md`**
