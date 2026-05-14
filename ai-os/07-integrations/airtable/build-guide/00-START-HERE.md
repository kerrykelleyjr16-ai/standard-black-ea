# Airtable Manual Build Guide — Standard Black
## START HERE

---

## Before You Touch Airtable

1. Go to airtable.com → Sign in
2. Click "Add a workspace" → Name it: **Standard Black Operations**
3. Inside that workspace, click "Create a base" → Name it: **Command Center**
4. You will now see one empty table called "Table 1" — rename it to "Companies"
5. The remaining 6 tables get added one by one as you complete each guide

---

## Build Order (Do Not Skip Ahead)

Tables link to each other. Build in this exact order or the linked fields won't work.

| Step | Table | File to Open |
|---|---|---|
| 1 | Companies | `01-companies.md` |
| 2 | Contacts | `02-contacts.md` |
| 3 | Deals | `03-deals.md` |
| 4 | Tasks | `04-tasks.md` |
| 5 | Documents | `05-documents.md` |
| 6 | Investors | `06-investors.md` |
| 7 | Automations | `07-automations.md` |

---

## After All Tables Are Built

| Checklist | File |
|---|---|
| Zapier Phase I connection | `08-zapier-checklist.md` |
| Test records | `09-test-records-checklist.md` |
| Permissions review | `10-permissions-checklist.md` |
| Airtable-to-Notion sync plan | `11-notion-sync-checklist.md` |

---

## How to Add a New Table in Airtable

At the bottom of the screen, click the **+** tab next to your existing tables.
Name it exactly as shown in each guide.

---

## General Rules While Building

- Name every field exactly as written — spelling matters for Zapier triggers
- Set the primary field (first field) before adding others
- Linked record fields: when prompted "Link to existing table or new table?" → always choose existing
- Do not add extra fields beyond what's listed — keep it clean
- Build all fields before building views
- Build all views before adding sample records
- Complete the checklist at the end of each table before opening the next guide

---

## Plan + Visual Map

```
Command Center (Base)
│
├── Companies          ← build first (no dependencies)
├── Contacts           ← links to Companies
├── Deals              ← links to Contacts + Companies
├── Tasks              ← links to Deals + Contacts
├── Documents          ← links to Deals + Contacts + Companies
├── Investors          ← links to Companies + Deals
└── Automations        ← standalone registry
```

**API key security note:** If you ever automate Airtable builds via API later, use a scoped Personal Access Token stored as an environment variable. Never paste it into chat logs, code files, or frontend files.

---

Open `01-companies.md` and start building.
