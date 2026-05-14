# Notion Launch Checklist
## Standard Black Company Brain — Manual Setup

---

## Pre-Launch Requirements

Complete all of these before opening Notion to build:

- [ ] Airtable build guide reviewed (ai-os/07-integrations/airtable/build-guide/)
- [ ] You have a Notion account at notion.so — free plan is sufficient for Phase I
- [ ] You have the Notion Company Brain setup guide open: `tech_stack/notion_company_brain_setup.md`
- [ ] You have the templates folder open: `notion/templates/`
- [ ] You have 1–2 hours to build the initial structure

---

## Step 1: Create the Workspace

- [ ] Log into notion.so
- [ ] Create a new workspace named: **Standard Black**
- [ ] Set the workspace icon (use your logo or initials S/B)
- [ ] Confirm you are the workspace admin

---

## Step 2: Create All 15 Pages

Create these pages in the exact order listed. Each should be a top-level page (not nested under another).

- [ ] Company Overview
- [ ] Mission, Vision & Values
- [ ] Business Units
- [ ] Current Projects
- [ ] Team Directory
- [ ] SOP Library
- [ ] Team Docs
- [ ] Brand Guidelines
- [ ] Meeting Notes
- [ ] Weekly Updates
- [ ] Decision Log
- [ ] Tool Stack
- [ ] Login / Access Tracker
- [ ] Airtable Dashboard Links
- [ ] Automation Status

---

## Step 3: Add Initial Content to Each Page

For each page, paste the relevant template from `notion/templates/` and fill in the actual content.

- [ ] Company Overview — paste `company_overview_template.md`, fill in Standard Black details
- [ ] Mission, Vision & Values — write Kerry's actual mission, vision, and 3–5 values
- [ ] Business Units — write one paragraph per unit (Note Fund, Operating Acquisitions, Public Markets, Car Sales income note)
- [ ] Current Projects — paste `project_brief_template.md` for each active project
- [ ] Team Directory — paste `team_member_profile_template.md` for Kerry, Kody, TJ
- [ ] SOP Library — leave empty shell; add SOPs as they are written
- [ ] Team Docs — paste the team operating framework from `references/team-operating-framework.md`
- [ ] Brand Guidelines — paste `brand_guidelines_template.md`, fill in what is decided
- [ ] Meeting Notes — leave empty; add first entry after first Thursday check-in
- [ ] Weekly Updates — leave empty; add first entry at end of week
- [ ] Decision Log — paste `decision_log_template.md`, import entries from `decisions/log.md`
- [ ] Tool Stack — paste `tool_access_template.md`, fill in active tools
- [ ] Login / Access Tracker — add tool list with where credentials live (no passwords)
- [ ] Airtable Dashboard Links — add shared view links after Airtable is built
- [ ] Automation Status — paste `automation_status_template.md`, fill in Phase I Zapier automations

---

## Step 4: Set Permissions

- [ ] Kerry — Workspace Admin (already set as owner)
- [ ] Invite Kody as Member → confirm he can see all allowed pages
- [ ] Invite TJ as Guest → add him manually to: SOP Library, Team Docs, Meeting Notes, Airtable Dashboard Links, Automation Status
- [ ] Set Login / Access Tracker → private to Kerry only (click Share → restrict access)
- [ ] Confirm no pages have "Anyone with the link" sharing turned on
- [ ] Confirm Kody cannot see Login / Access Tracker
- [ ] Confirm TJ cannot see Company Overview, Decision Log, Tool Stack, Brand Guidelines (unless Kerry decides otherwise)

---

## Step 5: Connect to Airtable

This step requires Airtable to be built first. Do not do this until the Airtable Manual Build Guide steps 01–07 are complete.

- [ ] Airtable is built and verified
- [ ] Open Airtable → go to each view listed below → click Share → Create shared view link → copy URL
- [ ] Paste links into Notion → Airtable Dashboard Links page:
  - [ ] Active Pipeline (Deals table)
  - [ ] Kody's Queue (Tasks table)
  - [ ] TJ's Queue (Tasks table)
  - [ ] Deadline Watch (Deals table)
  - [ ] Overdue Tasks (Tasks table)
- [ ] Test: open each link in incognito mode to confirm they work without login

---

## Step 6: Data Review Before Opening to Team

Before inviting Kody and TJ, check every page for these issues:

- [ ] No borrower names, addresses, or SSNs anywhere in Notion
- [ ] No investor names, committed amounts, or accreditation details in Notion
- [ ] No API keys, passwords, or credentials visible on any page
- [ ] No raw loan tape data or Confidential-flagged documents
- [ ] No private financial deal modeling (LTV, purchase price, pricing models)
- [ ] Login / Access Tracker is confirmed private (only Kerry can open it)
- [ ] All template placeholder text has been replaced with real content

---

## Step 7: Team Walkthrough

Once the workspace is set and verified:

- [ ] Walk Kody through the workspace — Company Overview, Current Projects, his Task Queue link, SOP Library
- [ ] Walk TJ through his specific pages — SOP Library (where to find SOPs for his tasks), his Task Queue link in Airtable Dashboard Links
- [ ] Confirm Kody can navigate independently
- [ ] Confirm TJ can find his queue without help
- [ ] Confirm neither Kody nor TJ can see Login / Access Tracker

---

## Step 8: Establish the Weekly Sync Habit

Notion only stays accurate if it gets updated. Build this into the weekly review:

- [ ] During Friday review: copy closed deal summaries into Decision Log (summary only)
- [ ] Copy any new decisions from `decisions/log.md` into Notion Decision Log
- [ ] Add new SOPs to SOP Library as they are created
- [ ] Update Weekly Updates page — what got done, what's next, top 3
- [ ] Update automation status if any Zaps changed status

---

## Launch Complete When

- [ ] All 15 pages exist and have real content (no blank placeholders)
- [ ] All permissions are set and verified
- [ ] Airtable view links are embedded (after Airtable is built)
- [ ] No sensitive data exists anywhere in Notion
- [ ] Kody and TJ have been walked through their views
- [ ] Weekly sync habit is in place

---

## What Comes After Notion Launch

Once Notion is live and Airtable is built:

**Next milestone: Zapier Phase I**

Follow `ai-os/07-integrations/airtable/build-guide/08-zapier-checklist.md`

Build Zaps in this order:
1. ZAP-01: New deal → Slack alert
2. ZAP-02: Deal → Pricing → Bid review alert
3. ZAP-03: Approval pending → Notify Kerry
4. ZAP-04: Deal status change → Team update
5. ZAP-05: New contact → Follow-up task
6. ZAP-06: Overdue task → Slack alert
7. ZAP-07: Deal approved → DD checklist created

After all 7 Zaps are active and tested, run through `09-test-records-checklist.md`.
