# User Flows — LegalForge

> **Version:** 1.0.0-draft
> **Date:** 2026-06-30

---

## Flow 1: End User — Build a Contract (Happy Path)

```
[User visits firm subdomain]
        │
        ▼
[Login / Magic Link Auth]
        │
        ▼
[End User Dashboard]
        │
        ├─── Has existing drafts? → [Resume Draft] → Go to Step 4
        │
        ▼
[Browse Template Library]
        │
        ▼
[Select Template e.g. "Offer to Purchase"]
        │
        ▼
[Wizard: Step 1 — Party Collection]
│  ├── Fill in Buyer details
│  ├── Fill in Seller details
│  └── [Next →]
        │
        ▼
[Wizard: Step 2 → N — Clause Selection (one per section)]
│  ├── Read section explanation
│  ├── Review default clause (+ explanation + example)
│  ├── Consider alternative clauses
│  │     └── [Conflict detected?]
│  │           ├── Yes → [Conflict Warning Modal]
│  │           │         ├── Keep new (swap old)
│  │           │         └── Keep old (cancel new)
│  │           └── No → Continue
│  ├── [Select Clause]
│  └── [Next →]
        │
        ▼
[Wizard: Review & Summary]
│  ├── Review all parties
│  ├── Review all clause selections
│  ├── [Edit any section if needed] → Go back to that step
│  └── [Generate My Contract 🚀]
        │
        ▼
[PDF Generated & Stored in R2]
        │
        ▼
[Confirmation Screen]
│  ├── [Download PDF]
│  └── [Return to Dashboard]
        │
        ▼
[Email sent with download link]
```

---

## Flow 2: Law Firm Admin — Create & Publish a Template

```
[Firm Admin logs in]
        │
        ▼
[Firm Admin Dashboard]
        │
        ▼
[Navigate to Templates]
        │
        ▼
[Click "+ Create Template"]
        │
        ▼
[Fill General Info: name, description, type, jurisdiction]
        │
        ▼
[Define Party Roles: Buyer, Seller, etc.]
        │
        ▼
[Add Sections (drag-reorder)]
        │
        ▼
[For each Section:]
│  ├── Write section title & description
│  ├── Write Default Clause:
│  │     ├── Clause title
│  │     ├── Plain-language explanation
│  │     ├── Example(s)
│  │     └── Legal text (with merge field tokens)
│  ├── Add Alternative Clauses (repeat above)
│  └── Define Conflict Rules (if any)
        │
        ▼
[Preview Template as Client View]
        │
        ├── Issues found? → Fix → Preview again
        │
        ▼
[Click "Publish"]
        │
        ▼
[Publish Confirmation Modal]
│  ├── Shows checklist of issues (missing explanations, etc.)
│  └── [Publish Anyway] or [Fix Issues]
        │
        ▼
[Template is live — visible to all firm clients]
```

---

## Flow 3: Platform Admin — Onboard a New Law Firm

```
[Platform Admin logs in to Admin Console]
        │
        ▼
[Navigate to Tenants]
        │
        ▼
[Click "+ New Tenant"]
        │
        ▼
[Fill: Firm name, slug (subdomain), plan, admin email]
        │
        ▼
[System creates tenant + sends invitation email to firm admin]
        │
        ▼
[Firm Admin receives email: "You've been invited to set up your LegalForge workspace"]
        │
        ▼
[Firm Admin clicks link → Registration screen (pre-filled email)]
        │
        ▼
[Firm Admin creates password + logs in]
        │
        ▼
[Firm onboarding checklist shown:]
│  1. ✅ Account created
│  2. ⬜ Upload your firm logo
│  3. ⬜ Set your brand colour
│  4. ⬜ Create your first template
│  5. ⬜ Invite your first client
        │
        ▼
[Firm Admin completes setup → Full dashboard unlocked]
```

---

## Flow 4: End User — Invited by Law Firm

```
[Firm Admin navigates to Clients → Invite Client]
        │
        ▼
[Enter client email + optional name]
        │
        ▼
[System sends invitation email to client]
│  Subject: "Smith & Partners has invited you to LegalForge"
│  Body: Explanation + [Accept Invitation] button
        │
        ▼
[Client clicks → Registration screen]
│  ├── Pre-filled email (non-editable)
│  ├── Enter name + password
│  └── Accept terms
        │
        ▼
[Client's account created, scoped to the firm's tenant]
        │
        ▼
[Redirect to End User Dashboard]
│  └── Welcome banner shown on first visit
        │
        ▼
[Client can now build contracts]
```

---

## Flow 5: Conflict Detection — Mid-Wizard

```
[User is on Step N: Suspensive Conditions]
        │
        ▼
[User clicks alternative clause: "Cash Purchase — No Finance Required"]
        │
        ▼
[System checks clause_conflicts table]
│  Query: Does this clause conflict with any previously selected clause?
        │
        ├── No conflict → clause selected, highlight card, auto-save
        │
        └── Conflict found →
                │
                ▼
        [Conflict Warning Modal appears]
        │  Shows: what was selected, what conflicts, why
        │
        ├── [Keep new clause & remove old]
        │     → Updates contract_clause_selections: swap the old selection
        │     → Modal closes, new clause now selected
        │
        ├── [Keep old clause]
        │     → Cancel new selection
        │     → Modal closes, original clause remains selected
        │
        └── [Learn more]
              → Expands detailed conflict explanation
              → Still shows the two choice buttons
```

---

## Flow 6: Resume a Draft Contract

```
[User logs in → Dashboard]
        │
        ▼
[Sees "Continue Where You Left Off" section]
        │
        ▼
[Clicks [Continue →] on a draft card]
        │
        ▼
[System loads contract from DB]
│  ├── Loads party data
│  ├── Loads all previous clause selections
│  └── Loads current_step (section index)
        │
        ▼
[Wizard opens at the last incomplete section]
│  └── All previously completed steps show as "Completed" in sidebar
        │
        ▼
[User continues from where they left off]
```
