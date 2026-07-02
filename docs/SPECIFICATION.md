# SPECIFICATION.md — LegalForge Contract Builder

> **Version:** 1.0.0-draft
> **Date:** 2026-06-30
> **Status:** Planning Phase

---

## 1. Executive Summary

**LegalForge** is a multi-tenant SaaS platform that empowers law firms and their clients to build legally compliant, professional-grade contracts with guided, step-by-step workflows. Instead of hiring a lawyer for every standard agreement, clients can compose contracts from curated clause libraries authored and maintained by their trusted law firm. The result is a signed-ready, polished document — tailored to their specific situation — in minutes rather than days.

---

## 2. Problem Statement

Small and medium businesses frequently need legal contracts (offers to purchase, service agreements, shareholder agreements, leases, etc.) but face three core pain points:

1. **Cost** — Engaging a law firm for every routine contract is expensive.
2. **Speed** — Drafting and review cycles are slow.
3. **Risk** — Using off-the-shelf templates without legal guidance introduces hidden liability.

Law firms, on the other hand, want to extend their reach, create recurring revenue streams, and maintain quality control over the documents their brand is associated with.

---

## 3. Product Vision

> _"A legal contract should be as easy to build as filling out a form — but with the confidence of a lawyer guiding every decision."_

LegalForge bridges both worlds:

- Law firms author expert templates and clause libraries once.
- Clients compose contracts interactively, guided by embedded legal explanations.
- The platform detects contradictory clause combinations before they become problems.

---

## 4. Target Market

| Segment                         | Description                                                                    |
| ------------------------------- | ------------------------------------------------------------------------------ |
| **Law Firms (B2B Customer)**    | The paying SaaS subscriber. Purchases platform access to serve their clients.  |
| **Business Clients (End User)** | Clients of the law firm. Access the platform via the firm's branded workspace. |
| **Platform Admin**              | Internal LegalForge team. Full platform oversight and management.              |

---

## 5. User Roles & Permissions

### 5.1 Platform Admin (Super Admin)

- Full access to all tenants (law firms), templates, users, and analytics.
- Can impersonate any law firm workspace for support purposes.
- Manages global system settings, billing plans, and feature flags.
- Access to platform-wide analytics dashboard.

### 5.2 Law Firm Admin (Tenant Admin)

- Owns and manages their firm's workspace (tenant).
- Creates, edits, and publishes contract templates.
- Builds and manages clause libraries for each template section.
- Annotates clauses with legal explanations, examples, and conflict rules.
- Invites and manages end users (their clients).
- Views analytics for their workspace: active contracts, client activity, most-used templates.
- Can assign additional firm-level users (e.g., paralegals) as editors.

### 5.3 Law Firm Editor (Tenant Editor — Optional Sub-role)

- Assigned by a Law Firm Admin.
- Can create and edit templates and clauses but cannot manage users or billing.
- Cannot publish templates without Admin approval (configurable).

### 5.4 End User (Client)

- Invited by a law firm or self-registered via the firm's public URL.
- Selects from available contract templates.
- Steps through the guided contract builder wizard.
- Reviews, approves, and downloads the final generated contract (PDF).
- Can save in-progress drafts and return later.
- Can view a history of all their completed contracts.

---

## 6. Core Features

### 6.1 Contract Template System

- **Template Library:** A curated list of contract types per law firm workspace (e.g., Offer to Purchase, Service Agreement, Lease Agreement, Shareholders Agreement, NDA, Employment Contract).
- **Template Versioning:** Templates can be updated; existing in-progress contracts lock to the version they started with.
- **Template Publishing Workflow:** Draft → Review → Published. Clients only see published templates.
- **Template Metadata:** Name, description, jurisdiction (e.g., South Africa — Western Cape), language, estimated completion time, and cover image.

### 6.2 Dynamic Party Collection

- When a user selects a template, the wizard first collects information about all **parties** involved.
- Each party type is defined by the template author (e.g., "Seller", "Purchaser", "Landlord", "Tenant", "Director").
- The system explains each party role in plain language with examples.
- Supports variable party counts (e.g., multiple shareholders in a Shareholders Agreement).
- Collected party data is stored and used to auto-populate merge fields throughout the final document.

### 6.3 Guided Clause Builder (Step-by-Step Wizard)

- Each template is divided into **Sections** (e.g., "Purchase Price", "Occupation Date", "Suspensive Conditions").
- Each Section has a **default clause** and zero or more **alternative clauses**.
- For every section, the user is shown:
  - The clause title.
  - A plain-language explanation of what the clause means.
  - Practical examples of how it applies.
  - The full legal text of the clause (expandable).
  - Alternative clause options (if any) with their own explanations.
- Users select their preferred clause for that section and proceed.
- Progress is saved automatically after each section.

### 6.4 Clause Conflict Detection

- Each clause can be tagged with **conflict rules** by the law firm author (e.g., "Clause A is incompatible with Clause D").
- When the user selects a clause that conflicts with a previously selected clause, the system:
  - Displays a prominent warning explaining the conflict.
  - Explains why the two clauses are incompatible in plain language.
  - Offers options: keep the new clause (and change the old one), keep the old clause, or get more information.
- Conflict rules are stored as a directed graph and evaluated in real time during the wizard.

### 6.5 Contract Review & Summary

- Before final generation, the user is shown a **full summary screen**:
  - All parties and their details.
  - All selected clauses with their section headings.
  - Any unresolved warnings or recommended reviews.
- The user can navigate back to any section to change their selection.
- A checklist of required signatures is shown.

### 6.6 Document Generation

- Upon confirmation, the system generates a **polished PDF contract**:
  - All merge fields (party names, dates, amounts) are substituted.
  - Professional typesetting with the law firm's branding (logo, letterhead).
  - Numbered clauses, proper headings, page numbers, and footer.
- The PDF is stored and accessible from the user's contract history.
- A **signature-ready** block is included at the bottom for wet or e-signatures.

### 6.7 Multi-Tenancy & Branding

- Each law firm has an isolated workspace (tenant).
- Tenants can customize:
  - Firm name, logo, primary colour, and contact details shown in the app and on generated documents.
  - Custom subdomain (e.g., `smithandpartners.legalforge.co.za`).
- Data is row-level isolated per tenant.

### 6.8 Analytics Dashboard

| Role           | Metrics Available                                                                                        |
| -------------- | -------------------------------------------------------------------------------------------------------- |
| Platform Admin | Total tenants, MAU, contracts generated, revenue, churn                                                  |
| Law Firm Admin | Active clients, contracts in progress, completed contracts, most-used templates, average completion time |

### 6.9 Notifications

- Email notifications for:
  - Invitation to workspace.
  - Contract draft saved (reminder after 3 days of inactivity).
  - Contract generation complete (with download link).
  - Law firm admin notified when client completes a contract.

---

## 7. Non-Functional Requirements

| Category          | Requirement                                                                                                                                                |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Security**      | All data encrypted at rest and in transit (TLS 1.3). Row-level security enforced at DB layer. Authentication via Better Auth (email/password, magic link). |
| **Scalability**   | Deployed on Cloudflare Workers (edge compute). D1 SQLite for data. Designed for horizontal scale via Cloudflare's global network.                          |
| **Performance**   | Page loads < 2s on 4G. PDF generation < 10s.                                                                                                               |
| **Availability**  | 99.9% uptime SLA target.                                                                                                                                   |
| **Compliance**    | POPIA (South Africa) compliant data handling. GDPR-ready architecture for future expansion.                                                                |
| **Accessibility** | WCAG 2.1 AA compliance target.                                                                                                                             |
| **Audit Trail**   | All contract creation, clause selection, and document generation events logged with timestamps and user IDs.                                               |

---

## 8. Out of Scope (V1)

- E-signature integration (Docusign, HelloSign) — planned for V2.
- AI-generated clause suggestions — planned for V2.
- Court filing or notarization integrations.
- Payment processing within contracts.
- Real-time collaboration on a single contract by multiple users.
- Mobile native apps (PWA only in V1).

---

## 9. Success Metrics

| Metric                        | Target (12 months post-launch) |
| ----------------------------- | ------------------------------ |
| Law Firm Tenants              | 20 active tenants              |
| End Users                     | 500 active end users           |
| Contracts Generated           | 2,000 contracts                |
| NPS Score                     | > 45                           |
| Avg. Contract Completion Time | < 20 minutes                   |

---

## 10. Glossary

| Term              | Definition                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------------ |
| **Tenant**        | A law firm's isolated workspace on the platform.                                           |
| **Template**      | A reusable contract structure with sections and clause options.                            |
| **Section**       | A logical division of a contract (e.g., "Purchase Price").                                 |
| **Clause**        | The legal text that fills a section. Can be default or alternative.                        |
| **Merge Field**   | A placeholder in a clause replaced by party or contract data (e.g., `{{buyer.fullName}}`). |
| **Conflict Rule** | A constraint declaring two clauses incompatible.                                           |
| **Party**         | A named entity (person or company) that is a signatory or referenced in the contract.      |
| **Draft**         | An in-progress contract not yet generated as a PDF.                                        |
| **Contract**      | A completed, PDF-generated document.                                                       |
