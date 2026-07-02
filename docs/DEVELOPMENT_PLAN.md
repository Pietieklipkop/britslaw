# DEVELOPMENT_PLAN.md — LegalForge Contract Builder

> **Version:** 1.0.0-draft
> **Date:** 2026-06-30
> **Status:** Planning Phase

---

## 1. Tech Stack

| Layer              | Technology                                                           | Rationale                                               |
| ------------------ | -------------------------------------------------------------------- | ------------------------------------------------------- |
| **Framework**      | SvelteKit 2 + Svelte 5                                               | File-based routing, server-side rendering, excellent DX |
| **Language**       | TypeScript                                                           | Type safety across the entire stack                     |
| **Styling**        | Tailwind CSS v4                                                      | Utility-first, rapid UI development                     |
| **Database**       | Cloudflare D1 (SQLite)                                               | Edge-native, zero-config, scales globally               |
| **ORM**            | Drizzle ORM                                                          | Type-safe queries, schema-first, D1 compatible          |
| **Auth**           | Better Auth                                                          | Multi-role auth, session management, email magic links  |
| **Hosting**        | Cloudflare Workers                                                   | Edge compute, global low-latency                        |
| **PDF Generation** | Puppeteer (via Cloudflare Worker) or `@react-pdf/renderer` / `jsPDF` | Server-side HTML-to-PDF rendering                       |
| **File Storage**   | Cloudflare R2                                                        | Store generated PDFs, template assets                   |
| **Email**          | Resend                                                               | Transactional email (invitations, notifications)        |
| **Toolchain**      | Vite+ (vp)                                                           | Unified build, lint, test runner                        |
| **Testing**        | Vitest (unit) + Playwright (e2e)                                     | Full test coverage                                      |
| **Linting**        | ESLint + Prettier (via Oxlint/Oxfmt)                                 | Code quality                                            |
| **CI/CD**          | GitHub Actions + Cloudflare Pages deploy hooks                       | Automated pipeline                                      |

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Cloudflare Edge                          │
│                                                              │
│  ┌──────────────┐   ┌────────────────┐   ┌───────────────┐  │
│  │  SvelteKit   │   │  Cloudflare D1 │   │ Cloudflare R2 │  │
│  │  Workers App │◄──│  (SQLite DB)   │   │  (File Store) │  │
│  │              │   └────────────────┘   └───────────────┘  │
│  │  - Routes    │                                            │
│  │  - API       │   ┌────────────────┐                      │
│  │  - Auth      │──►│   Resend       │                      │
│  │  - PDF Gen   │   │  (Email)       │                      │
│  └──────────────┘   └────────────────┘                      │
└─────────────────────────────────────────────────────────────┘
```

### Multi-Tenancy Strategy

- **Tenant isolation via `tenant_id`** column on all tenant-scoped tables.
- Tenant resolved from subdomain or path prefix on every request.
- Better Auth sessions carry `tenantId` and `role` claims.
- All Drizzle queries include a mandatory `where tenantId = $tenantId` guard enforced via a middleware wrapper.

---

## 3. Project Structure

```
britslaw/
├── src/
│   ├── app.html
│   ├── app.d.ts                     # Global type augmentations
│   ├── hooks.server.ts              # Auth session, tenant resolution
│   ├── lib/
│   │   ├── server/
│   │   │   ├── auth.ts              # Better Auth configuration
│   │   │   ├── db/
│   │   │   │   ├── index.ts         # Drizzle client
│   │   │   │   ├── schema/          # Drizzle schema files (one per domain)
│   │   │   │   │   ├── auth.schema.ts
│   │   │   │   │   ├── tenants.schema.ts
│   │   │   │   │   ├── templates.schema.ts
│   │   │   │   │   ├── clauses.schema.ts
│   │   │   │   │   ├── contracts.schema.ts
│   │   │   │   │   └── analytics.schema.ts
│   │   │   │   └── seed.sql
│   │   │   ├── pdf/
│   │   │   │   └── generator.ts     # PDF generation service
│   │   │   ├── email/
│   │   │   │   └── sender.ts        # Resend email service
│   │   │   └── tenant.ts            # Tenant resolution middleware
│   │   ├── components/
│   │   │   ├── ui/                  # Base UI primitives
│   │   │   ├── contract/            # Contract wizard components
│   │   │   ├── admin/               # Admin-specific components
│   │   │   └── layout/              # Layout shells
│   │   ├── stores/                  # Svelte 5 runes-based stores
│   │   ├── types/                   # Shared TypeScript types
│   │   └── utils/                   # Utility functions
│   └── routes/
│       ├── (public)/                # Unauthenticated routes
│       │   ├── +layout.svelte
│       │   ├── +page.svelte         # Landing page
│       │   └── login/
│       ├── (app)/                   # Authenticated end-user routes
│       │   ├── +layout.svelte
│       │   ├── dashboard/           # User dashboard
│       │   ├── contracts/           # My contracts list
│       │   └── build/               # Contract wizard
│       │       ├── [templateId]/
│       │       │   ├── parties/     # Step 1: Party collection
│       │       │   ├── [step]/      # Step N: Clause selection
│       │       │   └── review/      # Final review & generate
│       ├── (firm)/                  # Law firm admin routes
│       │   ├── +layout.svelte
│       │   ├── dashboard/
│       │   ├── templates/           # Template management
│       │   ├── clients/             # Client management
│       │   └── settings/            # Firm settings & branding
│       └── (platform)/             # Super admin routes
│           ├── +layout.svelte
│           ├── dashboard/
│           ├── tenants/
│           └── analytics/
├── docs/
│   ├── SPECIFICATION.md
│   ├── DEVELOPMENT_PLAN.md
│   ├── DESIGN.md
│   ├── ERD.md
│   └── stitch-prompts/
│       ├── 01-landing-page.md
│       ├── 02-auth-screens.md
│       ├── 03-end-user-dashboard.md
│       ├── 04-contract-wizard.md
│       ├── 05-firm-admin-dashboard.md
│       ├── 06-template-builder.md
│       ├── 07-clause-editor.md
│       └── 08-platform-admin.md
├── drizzle/                         # Migration files
├── static/
└── tests/
    ├── unit/
    └── e2e/
```

---

## 4. Development Phases

### Phase 0: Foundation (Week 1–2)

**Goal:** Project skeleton, auth, multi-tenancy, and CI are all working.

- [x] SvelteKit + Cloudflare Workers scaffold (already done via `sv create`)
- [x] Configure Drizzle schema (auth, tenants, users)
- [x] Set up Better Auth with roles (platform_admin, firm_admin, firm_editor, end_user)
- [x] Implement tenant resolution in `hooks.server.ts`
- [ ] Set up Cloudflare R2 bucket for file storage
- [ ] Configure Resend for transactional email
- [x] Set up GitHub Actions CI (lint → type-check → test → deploy preview)
- [x] Seed database with test tenant, admin user, and sample data

**Deliverable:** Working login, session, and tenant isolation. No UI beyond auth pages.

#### 🧪 Phase 0 — Testing Requirements

**Unit Tests (Vitest)**

- `auth.ts` — Verify that a user with role `end_user` cannot be assigned `platform_admin` via the registration handler.
- `tenant.ts` — Test the tenant-resolution helper: correct tenant returned for a known slug, `null` returned for an unknown slug, `null` returned for a platform host (`app`, `localhost`).
- `db/schema` — Verify that Drizzle schema constraints exist: `users.tenant_id` FK, `users.role` CHECK constraint, unique index on `users.email`.
- `hooks.server.ts` — Unit-test the user-tenant scope enforcement: a user whose `tenantId` doesn't match `locals.tenant.id` gets a 403 response.

**End-to-End Tests (Playwright)**

- Navigate to `/login` → log in with seeded test credentials → assert redirect to `/dashboard`.
- Attempt to log in with incorrect password → assert error message is displayed.
- Log in as a `firm_admin` user → assert redirect to `/firm/dashboard` (not `/dashboard`).
- Access a protected route (`/dashboard`) while logged out → assert redirect to `/login`.
- Log in as `end_user` of Tenant A → attempt to access a URL scoped to Tenant B → assert 403 or redirect.

**🟢 Human Tester Sign-Off Checklist**

A tester must be able to perform the following without developer assistance before Phase 0 is approved:

1. Open the app in a browser. Confirm the login page loads with no console errors.
2. Log in using the seeded `firm_admin@test.com` account. Confirm you land on the firm admin area.
3. Log out. Log in as `client@test.com`. Confirm you land on the end-user dashboard.
4. Log out. Attempt to navigate directly to `/firm/dashboard`. Confirm you are redirected to `/login`.
5. Log in as `client@test.com`. Manually edit the browser URL to a firm-admin route. Confirm you are blocked (redirected or shown an error).
6. Open a second browser (or incognito window) set to a different tenant's subdomain (or path prefix). Confirm the first user's session does not carry over.
7. Confirm the GitHub Actions CI pipeline shows green on a fresh PR (lint + type-check + tests all passing).

---

### Phase 1: Law Firm Admin — Template Builder (Week 3–5)

**Goal:** Law firm admins can create, edit, and publish contract templates with sections and clauses.

- [ ] Template CRUD (Create/Read/Update/Delete)
- [ ] Template versioning system
- [ ] Section management within a template (ordered list)
- [ ] Clause editor per section (rich text for legal text, plain-text for explanation)
- [ ] Alternative clause management per section
- [ ] Clause conflict rule author UI (select clause pairs that conflict)
- [ ] Template publishing workflow (Draft → Published)
- [ ] Party definition editor (define roles per template)
- [ ] Merge field token system (`{{buyer.fullName}}` etc.)
- [ ] Template preview (read-only rendered view)

**Deliverable:** A law firm admin can build a complete "Offer to Purchase" template with all sections, default and alternative clauses, explanations, and conflict rules.

#### 🧪 Phase 1 — Testing Requirements

**Unit Tests (Vitest)**

- `templates.service.ts` — Test template CRUD: create returns a new record with `status = 'draft'`; publish transitions status to `'published'`; cannot publish a template with zero sections.
- `sections.service.ts` — Test section reordering: given an array of section IDs in a new order, the `sort_order` values are updated correctly.
- `clauses.service.ts` — Test that a section always has exactly one `is_default = true` clause; setting a new clause as default automatically unsets the previous default.
- `conflict-rules.service.ts` — Test that the normalisation rule (`clause_id_a < clause_id_b` lexicographically) is enforced on insert; test that inserting a duplicate pair throws a unique-constraint error.
- `merge-fields.ts` — Test the token parser: `{{buyer.fullName}}` is detected; invalid tokens like `{{}}` are rejected; a text with no tokens returns an empty array.
- `template-versioning.ts` — Test that publishing a previously published template increments the `version` counter.

**End-to-End Tests (Playwright)**

- Log in as `firm_admin` → navigate to Templates → click "+ Create Template" → fill in all fields → save as draft → assert template appears in the list with status "Draft".
- Open the draft template → add 2 sections → add a default and one alternative clause per section → assert both clauses are saved.
- Add a conflict rule between two clauses → assert the conflict matrix cell updates to show ✗.
- Click "Publish" → confirm modal → assert template status changes to "Published".
- Log out and log in as `end_user` → navigate to template selection → assert the newly published template is visible (and draft templates are NOT visible).
- Attempt to publish a template with no sections → assert an error is shown and publish is blocked.

**🟢 Human Tester Sign-Off Checklist**

A tester must be able to perform the following without developer assistance before Phase 1 is approved:

1. Log in as a firm admin. Navigate to Templates. Create a new template named "Test Offer to Purchase" and fill in all required metadata fields.
2. Add at least 3 sections (e.g., "Purchase Price", "Deposit", "Suspensive Conditions"). Confirm drag-to-reorder works — drag Section 3 to position 1 and verify the order is saved after a page refresh.
3. For each section, add a default clause with a title, plain-language explanation, at least one example, and legal text containing a merge field token (e.g., `{{buyer.fullName}}`).
4. Add one alternative clause to at least one section.
5. Define a conflict rule between two clauses (one default, one alternative). Confirm the conflict matrix shows the rule visually.
6. Click "Preview" and confirm the template renders in a read-only end-user view.
7. Click "Publish". Confirm the template status changes to "Published".
8. Log out. Log in as an end-user. Confirm the published template appears in the template selection list.

---

### Phase 2: End User — Contract Wizard (Week 6–9)

**Goal:** End users can complete a full contract build through the guided wizard.

- [ ] Template selection screen (browse available templates)
- [ ] Party collection wizard step (dynamic form based on template party definitions)
- [ ] Clause selection wizard step (section by section)
  - [ ] Clause explanation panel
  - [ ] Alternative clause switcher
  - [ ] Real-time conflict detection engine
  - [ ] Conflict resolution UX (warning modal, user choice)
- [ ] Auto-save draft after every step
- [ ] Progress indicator (wizard stepper component)
- [ ] Contract review / summary screen
- [ ] "Generate Contract" action
- [ ] PDF generation service (merge fields, law firm branding, typesetting)
- [ ] PDF stored in Cloudflare R2
- [ ] Download link delivered to user (and email notification)
- [ ] My Contracts history page

**Deliverable:** A client can start from template selection and receive a signed-ready PDF in their inbox.

#### 🧪 Phase 2 — Testing Requirements

**Unit Tests (Vitest)**

- `conflict-detection.ts` — Test the core detection algorithm:
  - Selecting a clause with no conflicts returns `{ status: 'ok' }`.
  - Selecting a clause that conflicts with a previously selected clause returns `{ status: 'conflict', conflicts: [...] }`.
  - A `warning`-type conflict returns `{ status: 'warning' }` (not `'conflict'`).
  - Selecting the same clause twice is a no-op (no conflict triggered).
  - Bidirectional conflict: conflict defined as A→B also fires when B is selected after A.
- `merge-substitution.ts` — Test field substitution:
  - All `{{party.field}}` tokens are replaced correctly.
  - A token with no corresponding value is replaced with `[MISSING: fieldName]`.
  - The returned `missingFields` array is populated for every unresolved token.
  - Multiple instances of the same token in one clause are all replaced.
- `draft-persistence.ts` — Test that `contract_clause_selections` upsert replaces the old selection for a section rather than inserting a duplicate.
- `pdf/generator.ts` — Unit-test the substitution step in isolation (pass in a clause text and field map, assert output string).

**End-to-End Tests (Playwright)**

- Log in as end-user → select the published "Offer to Purchase" template → complete Step 1 (party collection) with valid data → assert progress moves to Step 2.
- On a clause step, select an alternative clause → assert the card becomes visually selected.
- Select a clause known to conflict with a previous selection → assert the conflict modal appears with an explanation.
  - Choose "Keep new clause" → assert the old clause is deselected and new one is active.
  - Return to the step → choose "Keep old clause" → assert no change.
- Refresh the browser mid-wizard → assert the wizard resumes at the last completed step with all previous selections intact.
- Complete all steps through to the Review screen → assert all selected clauses and party details are displayed correctly.
- Click "Generate My Contract" → wait for confirmation screen → assert a download button appears.
- Click "Download PDF" → assert a PDF file is downloaded (verify MIME type and file is non-empty).
- Navigate to "My Contracts" → assert the completed contract appears with status "Completed".

**🟢 Human Tester Sign-Off Checklist**

A tester must be able to perform the following without developer assistance before Phase 2 is approved:

1. Log in as an end-user. Select the "Offer to Purchase" template. Confirm the party collection form shows the correct party roles (Buyer, Seller) with explanatory text.
2. Fill in all party fields and proceed. Confirm you arrive at Section 1 with the default clause pre-selected, its plain-language explanation, and at least one example shown.
3. Navigate through all sections, selecting a mix of default and alternative clauses.
4. On at least one step, attempt to select a clause that you know conflicts with a prior selection. Confirm the conflict modal appears, is clearly worded, and both resolution options work correctly.
5. Close the browser tab mid-wizard. Reopen the app and confirm your draft is visible on the dashboard and resumes from where you left off.
6. Complete the wizard to the Review screen. Confirm all your selections are summarised accurately. Navigate back to one section, change your clause, and return — confirm the review reflects the change.
7. Generate the contract. Confirm you receive a success confirmation. Download the PDF and open it — verify: all party names are filled in correctly, the law firm's name appears in the header, no `{{token}}` placeholders remain visible, and a signature block is present at the end.
8. Confirm you receive an email notification with a download link.

---

### Phase 3: Law Firm Admin — Client & Analytics (Week 10–11)

**Goal:** Law firm admins have full visibility into their client activity.

- [ ] Client management (invite, list, view profile, deactivate)
- [ ] View individual client's contracts and their clause selections
- [ ] Analytics dashboard:
  - [ ] Total clients, active this month
  - [ ] Contracts in progress, completed this period
  - [ ] Most popular templates
  - [ ] Average completion time per template
- [ ] Firm settings: logo, branding colours, contact details
- [ ] Subdomain configuration

**Deliverable:** Law firm admin has a fully operational management console.

#### 🧪 Phase 3 — Testing Requirements

**Unit Tests (Vitest)**

- `analytics.service.ts` — Test each analytics query in isolation against a seeded in-memory D1 database:
  - Active clients count returns the correct number of users who have started a contract this month.
  - Contracts-in-progress count returns only contracts with `status IN ('draft', 'in_progress', 'review')`.
  - Most-popular template is the one with the highest number of associated contracts.
  - Average completion time calculation: verify the arithmetic against a known seed dataset.
- `invitations.service.ts` — Test that an invitation token is correctly signed with an expiry; a token past expiry is rejected on validation; a used token cannot be reused.
- `branding.service.ts` — Test that updating `tenants.primary_colour` only affects the calling tenant's row (i.e., another tenant's colour is unchanged after the update).
- `clients.service.ts` — Test deactivation: a deactivated user cannot authenticate (session is invalidated); their contracts remain readable by the firm admin.

**End-to-End Tests (Playwright)**

- Log in as firm admin → navigate to Clients → click "Invite Client" → enter an email address → assert a success message is shown.
- Open the invitation email link (in test environment use the token from the DB) → complete registration → log in → assert the new client appears in the Clients list.
- As firm admin, view an individual client's profile → assert their in-progress and completed contracts are listed.
- Navigate to the Analytics dashboard → assert all four KPI cards display non-null values.
- Navigate to Firm Settings → upload a logo → set a brand colour → save → assert the logo and colour update in the sidebar immediately.
- Deactivate a client account → assert the client can no longer log in (session invalidated) but their contracts remain in the admin view.

**🟢 Human Tester Sign-Off Checklist**

A tester must be able to perform the following without developer assistance before Phase 3 is approved:

1. Log in as a firm admin. Navigate to Clients. Send an invitation to a test email address. Confirm the invitation email arrives and contains a working registration link.
2. Complete registration as the invited client. Confirm you are automatically scoped to the correct law firm's workspace (correct branding, correct templates visible).
3. As the firm admin, view the newly registered client in the Clients list. Build a contract as that client (use a separate browser session) then switch back to the admin view and confirm the contract appears under that client's profile.
4. Navigate to the Analytics dashboard. Confirm all KPI cards display meaningful numbers that match the actual data you know is in the system.
5. Go to Firm Settings. Upload a logo file and set a custom brand colour. Save. Confirm the logo and colour are applied across the UI without a page reload.
6. Deactivate the test client account. Attempt to log in as that client in a separate browser — confirm login fails. Log back in as admin and confirm the client's contracts are still visible.

---

### Phase 4: Platform Admin (Week 12)

**Goal:** Super admin has full platform oversight.

- [ ] Tenant (law firm) management: create, suspend, delete
- [ ] Platform analytics: MRR, DAU/MAU, contract volume
- [ ] Feature flags management
- [ ] Impersonate tenant for support
- [ ] Audit log viewer

**Deliverable:** Platform admin can manage all tenants and monitor platform health.

#### 🧪 Phase 4 — Testing Requirements

**Unit Tests (Vitest)**

- `tenants.service.ts` — Test tenant creation: a new tenant gets a unique `id` and correctly slugified `slug`; a duplicate slug throws a unique-constraint error.
- `tenants.service.ts` — Test tenant suspension: all `users` belonging to the tenant have their sessions invalidated; the tenant's templates are no longer returned by the published-templates query.
- `impersonation.ts` — Test that an impersonation session correctly carries `impersonatedTenantId` in the session metadata; test that every data access during impersonation is scoped to the impersonated tenant.
- `audit-log.service.ts` — Test that all auditable actions (create tenant, suspend tenant, impersonate) produce a corresponding `audit_log` row with correct `action`, `entity_type`, and `user_id`.
- `feature-flags.service.ts` — Test that a disabled feature flag causes the corresponding route/action to return 403 for all non-platform-admin roles.

**End-to-End Tests (Playwright)**

- Log in as platform admin → navigate to Tenants → click "+ New Tenant" → fill in all fields → submit → assert the new tenant appears in the list.
- Click into the new tenant → click "Impersonate" → confirm the amber impersonation banner appears → navigate the firm admin UI → assert data is scoped to that tenant.
- Click "Exit Impersonation" → assert the banner disappears and you are back in the platform admin context.
- Suspend a tenant → log in as a user of that tenant in a separate session → assert login is rejected or session is invalidated.
- Navigate to the Audit Log → assert that the impersonation event, tenant creation, and suspension all appear as distinct log entries with timestamps and actor names.
- Attempt to navigate to the platform admin console as a `firm_admin` user → assert 403 or redirect to firm dashboard.

**🟢 Human Tester Sign-Off Checklist**

A tester must be able to perform the following without developer assistance before Phase 4 is approved:

1. Log in as a platform admin. Navigate to Tenants. Create a new tenant (law firm) by filling in all required fields. Confirm the new tenant appears in the list immediately.
2. Open the new tenant's detail page. Confirm you can see all its users, templates, and contracts (initially empty).
3. Click "Impersonate" on the new tenant. Confirm the amber banner "You are impersonating [Firm Name]" appears at the top of the screen. Navigate to the firm's template list — confirm it only shows that firm's templates.
4. Click "Exit Impersonation". Confirm the banner disappears and you are back in the platform admin context.
5. Suspend the test tenant. Open a new incognito window and attempt to log in as a user of that tenant. Confirm login fails with a clear error.
6. Navigate to the Audit Log as platform admin. Confirm the following events appear as separate entries: tenant created, impersonation started, impersonation ended, tenant suspended — each with the correct timestamp and your admin username as the actor.
7. Open the Platform Overview dashboard. Confirm all KPI cards and charts render without errors and reflect the correct aggregate counts.

---

### Phase 5: Polish & Launch (Week 13–14)

**Goal:** Ship a production-ready, accessible, performant, and secure platform.

- [ ] WCAG 2.1 AA accessibility audit and fixes
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Performance audit (Lighthouse ≥ 90)
- [ ] Security review (OWASP Top 10 checklist)
- [ ] POPIA compliance review
- [ ] Final E2E test suite
- [ ] Staging → Production deployment
- [ ] Onboarding documentation for law firm admins

#### 🧪 Phase 5 — Testing Requirements

**Unit Tests (Vitest) — Final Coverage Pass**

- Achieve ≥ 80% line coverage across all `src/lib/server` modules (run `vp test --coverage` and review the report).
- Ensure all edge-case and regression tests identified during E2E testing are captured as targeted unit tests.
- Verify the merge field substitution engine handles malformed inputs without throwing (fuzzing with random strings).
- Audit log entries: test that every service function that writes data produces the expected audit log row (integration test with in-memory D1).

**End-to-End Tests (Playwright) — Full Regression Suite**

- Re-run all E2E tests from Phases 0–4 against the staging environment (full regression).
- Cross-browser: run the core wizard flow (login → select template → complete wizard → download PDF) on Chrome, Firefox, and Safari/WebKit using Playwright's multi-browser runner.
- Mobile viewport: run the wizard flow at 390×844 (iPhone 14) — assert no horizontal overflow, all buttons are tappable, and the progress sidebar collapses correctly.
- Accessibility: run `axe-core` checks on every major page (via `@axe-core/playwright`) and assert zero critical/serious violations.
- Performance: measure Time to Interactive for the dashboard and wizard pages using Playwright's performance API; assert TTI < 3 seconds on a simulated 4G connection.
- Security smoke tests: assert all API endpoints return 401/403 when called without authentication or with a mismatched tenant session.

**🟢 Human Tester Sign-Off Checklist (Launch Gate)**

This is the final quality gate before production deployment. A non-technical tester (ideally a representative from a pilot law firm) must complete the following end-to-end scenario unaided:

**Scenario: Full Platform Walkthrough**

1. **As Platform Admin:** Create a new tenant for "Pilot Law Firm". Set up their subdomain. Note the invitation link for the firm admin.
2. **As Firm Admin (new tab):** Accept the invitation, register, and log in. Upload the firm's logo and set a brand colour. Confirm branding appears correctly.
3. **As Firm Admin:** Create and publish a new template — "Simple NDA" — with 3 sections, one alternative clause per section, and one conflict rule between two clauses.
4. **Invite a test client** via the Clients screen. Confirm the invitation email arrives.
5. **As End User (new incognito window):** Accept the invitation. Build the "Simple NDA" from start to finish — enter party details, select clauses, trigger the conflict warning (and resolve it), review the summary, and generate the PDF.
6. **Confirm the PDF** downloads successfully, contains no unfilled tokens, includes the firm's logo and name, and has a signature block at the end.
7. **As Firm Admin:** Confirm the completed contract appears under the client's profile in the Clients view.
8. **As Firm Admin:** Check the Analytics dashboard — confirm the NDA template appears in the "Most Popular Templates" chart and the contract count has incremented.
9. **Accessibility check:** A tester using only a keyboard (no mouse) must be able to navigate the entire wizard from start to finish.
10. **Performance check:** Measure page load time on the dashboard and wizard — confirm both load within 2 seconds on a standard office Wi-Fi connection.

> ✅ All 10 items must be checked off by the designated QA approver before the production deployment tag is cut.

---

## 5. API Design

All server interactions use SvelteKit's form actions and `+server.ts` API routes.

### Key API Endpoints

| Method | Path                              | Description                          | Auth           |
| ------ | --------------------------------- | ------------------------------------ | -------------- |
| `POST` | `/api/auth/*`                     | Better Auth handlers                 | Public         |
| `GET`  | `/api/templates`                  | List published templates             | End User       |
| `POST` | `/api/contracts`                  | Create a new draft contract          | End User       |
| `PUT`  | `/api/contracts/:id/clauses`      | Save clause selection for a step     | End User       |
| `POST` | `/api/contracts/:id/generate`     | Trigger PDF generation               | End User       |
| `GET`  | `/api/contracts/:id/download`     | Signed R2 URL for PDF download       | End User       |
| `GET`  | `/api/firm/templates`             | List all templates (draft+published) | Firm Admin     |
| `POST` | `/api/firm/templates`             | Create a template                    | Firm Admin     |
| `PUT`  | `/api/firm/templates/:id`         | Update a template                    | Firm Admin     |
| `POST` | `/api/firm/templates/:id/publish` | Publish a template                   | Firm Admin     |
| `GET`  | `/api/firm/clients`               | List all clients                     | Firm Admin     |
| `GET`  | `/api/firm/analytics`             | Firm analytics data                  | Firm Admin     |
| `GET`  | `/api/admin/tenants`              | List all tenants                     | Platform Admin |
| `POST` | `/api/admin/tenants`              | Create a tenant                      | Platform Admin |

---

## 6. Testing Strategy

| Layer             | Tool                  | Coverage Target                                                             |
| ----------------- | --------------------- | --------------------------------------------------------------------------- |
| Unit tests        | Vitest                | Conflict detection engine, merge field substitution, PDF generation helpers |
| Integration tests | Vitest + D1 in-memory | API route handlers, DB queries                                              |
| E2E tests         | Playwright            | Full wizard flow, PDF download, admin CRUD                                  |

### Critical Test Scenarios

1. **Conflict detection** — Selecting conflicting clause combinations triggers correct warning.
2. **Merge field substitution** — All `{{party.field}}` tokens are correctly replaced in generated PDF.
3. **Tenant isolation** — User from Tenant A cannot access Tenant B's data.
4. **Auth role enforcement** — End user cannot access firm admin routes.
5. **Draft persistence** — Page refresh mid-wizard resumes from last saved step.

---

## 7. Environment Variables

```bash
# Cloudflare (from wrangler.jsonc bindings)
DATABASE_URL=          # D1 binding (auto via wrangler)
R2_BUCKET=             # R2 binding name

# Auth
BETTER_AUTH_SECRET=    # 32-char random secret
BETTER_AUTH_URL=       # App base URL

# Email
RESEND_API_KEY=        # Resend API key

# App
PUBLIC_APP_NAME=LegalForge
PUBLIC_APP_URL=https://app.legalforge.co.za
```

---

## 8. Deployment

```
main branch ──► GitHub Actions ──► wrangler deploy ──► Production Worker
                                └──► Preview Deploy ──► PR Environments
```

- Every PR gets an isolated Cloudflare Workers preview environment.
- `main` deploys to production automatically after all checks pass.
- D1 migrations run as part of the deploy script.
