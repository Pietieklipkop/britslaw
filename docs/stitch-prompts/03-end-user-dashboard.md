# Stitch Prompt: 03 — End User Dashboard

## Screen: Client Dashboard (My Contracts & Template Selection)

### Context

Main dashboard seen by end users (law firm clients) after logging in. Shows contracts in various states and allows starting a new contract from available templates.

---

### Design Direction — Neomorphic Light

**Style:** Neomorphism meets minimalism. Light theme. The entire UI is one continuous off-white surface — navigation, cards, and inputs all extruded from the same plane via shadow. Zero borders. Zero heavy graphics. Clean, calm, professional.

**Global Tokens (same across all screens):**

```
--bg-base:        #EEF2F7
--shadow-light:   rgba(255,255,255,0.85)
--shadow-dark:    rgba(174,185,204,0.7)
--text-primary:   #1E2A3B
--text-secondary: #6B7A94
--text-muted:     #9AAABB
--accent:         #5B6CF9   (indigo)
--accent-light:   #EEF0FE
--success:        #3DAA70
--warning:        #E09C3A
--error:          #D94F4F
```

**Neomorphic Raised Card:**

```css
background: #eef2f7;
border-radius: 20px;
box-shadow:
	-8px -8px 16px rgba(255, 255, 255, 0.85),
	8px 8px 16px rgba(174, 185, 204, 0.7);
```

**Neomorphic Inset (pressed/recessed):**

```css
box-shadow:
	inset -4px -4px 8px rgba(255, 255, 255, 0.85),
	inset 4px 4px 8px rgba(174, 185, 204, 0.6);
border-radius: 16px;
```

---

### Layout Structure

```
┌────────────┬──────────────────────────────────────────────┐
│            │  Top Bar                                     │
│  Sidebar   ├──────────────────────────────────────────────┤
│  (240px)   │                                              │
│            │  Main Content Area                           │
│            │                                              │
└────────────┴──────────────────────────────────────────────┘
```

Full page background: `--bg-base`. The sidebar and content area are the SAME colour — separation comes from the neomorphic raised sidebar panel.

---

### Sidebar

- **The sidebar itself** is a neomorphic raised panel: `border-radius: 0 20px 20px 0` on the right edges, soft shadow on right side only.
- **Top:** Law firm logo (48px) + firm name (13px, `--text-muted`). Below: a soft horizontal rule (`rgba(174,185,204,0.3)`).
- **Navigation items** (icon + label):
  - **Resting:** No background, `--text-secondary` text and icon.
  - **Active:** Small neomorphic inset pill behind the item — same `--bg-base` but with inset shadow — giving a "pressed in" feel. Accent indigo text and icon.
  - No highlights, badges, or coloured backgrounds on nav items.
- **Bottom:** "Powered by LegalForge" — 11px, `--text-muted`.

**Nav items:**

- 🏠 Dashboard
- 📄 My Contracts
- ➕ Start New Contract
- (separator: thin horizontal rule)
- 👤 My Profile
- 🚪 Log Out

---

### Top Bar

- Same `--bg-base` background, no border, minimal neomorphic bottom shadow.
- **Left:** Page title "Dashboard" — 20px, weight 700, `--text-primary`.
- **Right:** Notification bell (neomorphic raised circle icon button) + User avatar (neomorphic raised circle, 36px, initials text).

---

### Main Content

#### Welcome Banner (first visit only)

- Neomorphic raised card, `border-radius: 20px`, `padding: 32px`.
- Background: same `--bg-base`. A very subtle indigo tint to the left shadow only (`rgba(91,108,249,0.15)`) gives the card a warm indigo feel without adding colour.
- **Heading:** "Welcome, [Name] 👋" — 22px, weight 700, `--text-primary`.
- **Sub:** 14px, `--text-secondary`, weight 300.
- **CTA button:** Neomorphic raised, accent indigo fill — "Build My First Contract".
- **Dismiss:** Small `✕` top-right, `--text-muted`.

---

#### Section: "In Progress"

- Section label: "In Progress" — 13px, uppercase, letter-spacing, `--text-secondary`. Count chip: neomorphic inset small pill.
- **Horizontal scroll row** of draft cards.

**Draft Contract Card (220px wide, neomorphic raised):**

- Template type label (12px, weight 600, `--accent`).
- Contract name: 15px, weight 600, `--text-primary`.
- **Progress track:** Neomorphic inset track (recessed bar), filled portion is accent indigo.
- Step label: "Step 4 of 7" — 12px, `--text-muted`.
- Last edited: 12px, `--text-muted`.
- [Continue →] button: small neomorphic raised pill, accent fill.

---

#### Section: "Completed Contracts"

- Same section label pattern.
- **Grid (3 columns)** of completed contract cards (neomorphic raised).

**Completed Card:**

- PDF icon in a neomorphic inset circle (recessed).
- Contract name: weight 600.
- Status badge: neomorphic inset pill, `--success` text — "Completed".
- Completion date: `--text-muted`.
- [Download PDF] — neomorphic raised ghost button, `--accent` text.

---

#### Section: "Start a New Contract"

- Section label: "Available Templates".
- **Grid: 3 columns** desktop, 2 tablet, 1 mobile.

**Template Card (neomorphic raised, `border-radius: 20px`, `padding: 28px`):**

- **Icon area:** Neomorphic inset circle (~56px), a contract-type icon inside in `--accent`.
- **Template Name:** 17px, weight 700, `--text-primary`.
- **Description:** 13px, `--text-secondary`, 2 lines max.
- **Tags row:** Tiny neomorphic inset pills — "~15 min" | "Property" | "ZA".
- **CTA:** [Start Contract →] — neomorphic raised button, accent fill, full width within card.
- Hover: card shadow strengthens slightly — card appears to rise further. 150ms ease.

---

### Empty State (no contracts)

- Centered in main area, no card — just illustration + text on the flat background.
- Simple line-art illustration (light grey strokes, no fills).
- "You haven't started any contracts yet" — 18px, weight 600, `--text-primary`.
- Sub: 14px, `--text-secondary`.
- Arrow pointing down to the template grid.

---

### Mobile (< 768px)

- Sidebar hides. Bottom tab bar appears — same `--bg-base`, neomorphic raised bar at bottom. 4 tabs: Dashboard | Contracts | New | Profile. Active tab: inset pressed style + accent icon colour.
