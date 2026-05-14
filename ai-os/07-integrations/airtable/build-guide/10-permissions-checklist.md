# Permissions Review Checklist
## Set access levels for Kerry, Kody, and TJ

---

## Permission Levels in Airtable

| Level | Can Do |
|---|---|
| Owner | Everything — full admin |
| Creator | Build views, automations, edit all records; cannot delete the base or manage billing |
| Editor | Edit records in all tables; cannot change fields or build views |
| Commenter | View records, add comments; cannot edit |
| Read-only | View records only; cannot comment or edit |

---

## Access by Person

### Kerry Kelley Jr — Owner
- Full access to everything
- Manages billing and workspace settings
- Only person who can approve Approval Queue items
- Only person with access to Investors table

**Action:** Kerry's account is already the workspace owner — no changes needed

---

### Kody Kelley — Editor
Kody should be able to see deal progress and update task status but not modify the structure.

**Grant access:**
- Workspace: Invite Kody → set to Editor
- Tables he can see: Companies, Contacts, Deals, Tasks, Documents, Automations
- Tables he should NOT see: Investors

**How to restrict Investors from Kody:**
- In Airtable, you cannot hide individual tables from specific members at the base level on all plans
- Solution: Create a separate base called **Investor Relations** and move the Investors table there
- Only invite Kerry to that base — Kody and TJ are never added

**Action items:**
- [ ] Invite Kody to Standard Black Operations workspace as Editor
- [ ] Create a separate base: "Investor Relations"
- [ ] Move Investors table to that base (or rebuild it there)
- [ ] Do NOT invite Kody or TJ to the Investor Relations base

---

### TJ Henry — Commenter
TJ executes defined tasks. He needs to see what's assigned to him and add notes, but not edit records or build anything.

**Grant access:**
- Workspace: Invite TJ → set to Commenter
- In practice: TJ primarily uses Tasks table (his queue view)

**Action items:**
- [ ] Invite TJ to Standard Black Operations workspace as Commenter
- [ ] Walk TJ through "TJ's Queue" view — this is his daily interface
- [ ] Confirm TJ can view his tasks and add comments
- [ ] Confirm TJ cannot edit deal records or contact fields

---

## Security Rules Confirmed in Airtable

- [ ] "Anyone with link" sharing is OFF (check in Workspace Settings → Sharing)
- [ ] No public view links created on any table
- [ ] Investors table is in a separate base accessible only to Kerry
- [ ] Kerry's account has two-factor authentication enabled (check at airtable.com/account)
- [ ] All sensitive records are in the correct tables (no investor data in Contacts or Deals)

---

## What Kody and TJ Should NOT Be Able To

| Action | Kody | TJ |
|---|---|---|
| See Investors table | No | No |
| Edit deal financial fields (UPB, Purchase Price) | No — Editor but can; brief him not to | No |
| Add or delete fields | No (Editor can't do this) | No |
| Build views or automations | No (Editor can build views; brief him not to) | No |
| See Kerry's notes on deals | Yes (cannot hide this on Editor plan) | No (Commenter only) |
| Approve anything in Approval Queue | No — this is Kerry only | No |

---

## Completion Checklist

- [ ] Kerry confirmed as workspace Owner
- [ ] Kody invited with Editor access
- [ ] TJ invited with Commenter access
- [ ] Investors table moved to separate "Investor Relations" base
- [ ] Investor Relations base has only Kerry as a member
- [ ] "Anyone with link" sharing confirmed OFF
- [ ] No public view links exist
- [ ] Kerry has 2FA enabled on his Airtable account
- [ ] Kody has been walked through his views (Deals, his Tasks queue)
- [ ] TJ has been walked through "TJ's Queue" view in Tasks

**Done? Open `11-notion-sync-checklist.md`**
