# Stitch Prompt: 08 — Platform Admin Dashboard

## Screen: Super Admin — Platform Overview, Tenant Management & Analytics

### Context

Internal LegalForge team dashboard. Full platform visibility across all law firm tenants. Operational command centre for health monitoring, tenant management, and support. Must feel authoritative and data-dense without being visually overwhelming.

---

### Design Direction — Neomorphic Light

**Style:** Neomorphism meets minimalism. Light theme. The platform admin console shares the same visual language as the rest of the application — but with a subtle tonal shift that makes it feel like a distinct operational context.

**Tonal distinction from firm admin:** The base background shifts one tone lighter — `#F2F6FB` instead of `#EEF2F7`. This is a barely perceptible difference but signals "you are in a different context". The sidebar role badge is the clearest differentiator.

**Tokens:**

```
--bg-base:        #F2F6FB   ← slightly lighter than firm/user views
--shadow-light:   rgba(255,255,255,0.9)
--shadow-dark:    rgba(174,185,204,0.65)
--text-primary:   #1E2A3B
--text-secondary: #6B7A94
--text-muted:     #9AAABB
--accent:         #5B6CF9
--success:        #3DAA70
--warning:        #E09C3A
--error:          #D94F4F
--platform-tag:   #7B4FBE   (purple — used only in platform admin context)
```

**Platform accent = purple (`#7B4FBE`)** for elements that are platform-level (tenant counts, platform KPIs, impersonation banner). All other interactive elements remain `--accent` (indigo). This colour is used minimally — only on the role badge and platform-specific metric icons.

---

### Sidebar Navigation (Platform Admin)

- Same neomorphic raised panel.
- **Top:** "LegalForge" logo + monogram. Below it: "Admin Console" — 11px, uppercase, `--text-muted`.
- **Role badge:** "Platform Admin" — neomorphic inset pill, `--platform-tag` text. Visually distinct from the "Admin" badge in firm-admin view.
- **Nav items:**
  - 🌍 Platform Overview
  - 🏢 Tenants
  - 👥 All Users
  - 📊 Analytics
  - 🔧 Feature Flags
  - 🕵️ Audit Log
  - (separator)
  - 💬 Support
  - ⚙️ Platform Settings
  - 🚪 Log Out

---

### ⚠️ Impersonation Banner

When impersonating a tenant: a full-width neomorphic raised bar at the very top of the viewport (above everything, including sidebar).

```
box-shadow: -4px -4px 8px rgba(255,255,255,0.85), 4px 4px 8px rgba(224,156,58,0.4);
/* Amber-tinted shadow — the bar has a "warm alert" feel without a coloured background */
```

Content: `⚠ You are currently viewing as: Smith & Partners Attorneys` (centered, `--text-primary`, 14px) | [Exit Impersonation] — small neomorphic raised pill, accent, right-aligned.

This bar cannot be dismissed — it persists until "Exit Impersonation" is clicked.

---

### Screen A: Platform Overview

**Header row:**

- "Platform Overview" — 20px, weight 700. Current date — 13px, `--text-muted`, right.

---

#### Row 1: Platform KPIs (5 cards)

Same neomorphic raised card pattern as firm admin. **Platform-level cards use `--platform-tag` (purple) for their icon** to visually distinguish them.

1. 🌍 icon (`--platform-tag`) — **Total Tenants** — 23 — "3 added this month" (↑ `--success`)
2. 👥 icon (`--accent`) — **MAU** — 412 — "+18% vs last month"
3. 📄 icon (`--accent`) — **Contracts Generated** — 1,847 — "284 this month"
4. 💰 icon (`--platform-tag`) — **MRR** — "R 87,500" — "+R10,500 vs last month"
5. ⚠️ icon (`--warning`) — **Churned Tenants (LTM)** — 2 — "8.7% annual" (amber if above target threshold)

---

#### Row 2: Growth Charts

Same neomorphic raised panel + inset chart area pattern as firm admin.

**Left (60%): "Tenant & User Growth (12 months)"**

- Dual-line chart. `--platform-tag` (purple) for tenant count line. `--accent` (indigo) for MAU line.
- Inset chart area. Minimal grid. Monthly axis.

**Right (40%): "Contract Volume by Month"**

- Neomorphic raised bar strips inside the inset area. `--accent` bars.

---

#### Row 3: Tenant Health Table

Neomorphic raised full-width panel.

Heading: "Tenant Status" + [View All →] text link.

Table (same borderless style as template list):
| Firm Name | Plan | Users | Contracts/mo | Last Active | Health | Action |
|---|---|---|---|---|---|---|

**Health column:** Small neomorphic raised circle indicator:

- 🟢 Healthy: `--success` filled inset circle.
- 🟡 Low Activity: `--warning` filled inset circle.
- 🔴 Churning Risk: `--error` filled inset circle.

"Churning Risk" rows: The row shadow shifts slightly — amber-tinted dark shadow on the row hover, signalling urgency without a coloured row background.

[View] per row: text link, `--accent`.

---

#### Row 4: Platform Events Feed

Neomorphic raised panel, half-width.

Recent 10 events, most recent first. Each: icon + description + time.

- Normal events: `--text-secondary` text.
- System alerts (e.g., latency spike): amber-tinted card shadow on that item.

---

### Screen B: Tenant Management

**Header:** "Tenants" + [+ New Tenant] accent pill.

**Search bar:** Neomorphic inset search input (full width). Filter pills (neomorphic inset when active): All Plans | Starter | Professional | Enterprise | Health Status.

**Table:** Same borderless table pattern. Wider columns. [View] | [Impersonate] | [⋮] per row.

**[Impersonate] button:** Small neomorphic raised pill. `--warning` text (amber — signals careful action). On click: confirmation modal before impersonation activates.

**Impersonation confirmation modal:**

Neomorphic raised modal (`border-radius: 24px`, `padding: 40px`). Amber-tinted dark shadow.

- Heading: "Impersonate Smith & Partners?" — 20px, weight 700.
- Body: "You will view the platform as their Firm Admin. This action is logged." — 14px, `--text-secondary`.
- [Begin Impersonation] — accent raised pill. [Cancel] — ghost raised pill.

---

### Screen C: Tenant Detail Page

**Breadcrumb:** Tenants → Smith & Partners (13px, `--text-muted`)

**Header card (neomorphic raised):**

- Firm logo (inset circle) + firm name (20px, weight 700) + plan badge (inset pill) + status badge.
- Action buttons right: [Impersonate] (amber ghost pill) | [Edit Tenant] (ghost) | [Suspend] (error ghost).

**Tab bar (neomorphic inset pills when active):** Overview | Users | Templates | Contracts | Billing | Audit Log

**Tab content:** Same card/table/inset patterns as above.

**Destructive actions (Suspend, Delete):**

- Require a typed-confirmation input. A neomorphic inset text field: "Type 'smith-partners' to confirm."
- The confirm button remains disabled (deeply inset, `--text-muted` — visually "inactive") until the correct text is typed, at which point it transitions to a raised, `--error`-fill button.

---

### Motion Notes

- Health indicator circles: pulse animation (very subtle scale 1 → 1.05 → 1, 2s loop) for "Churning Risk" status only. Draws attention without being distracting.
- Impersonation banner: slides down from top of viewport (height expand + fade), 250ms ease-out.
- Exit impersonation: slides up and disappears, 200ms ease-in.
- Table row hover: shadow depth increases very slightly, 100ms — the row appears to rise.
