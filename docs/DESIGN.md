# DESIGN.md — LegalForge Visual & UX Design System

> **Version:** 1.0.0-draft
> **Date:** 2026-06-30
> **Status:** Planning Phase

---

## 1. Design Philosophy

LegalForge occupies a unique space: it must feel **authoritative and trustworthy** (like a law firm) while also being **approachable and clear** (unlike a law firm). The design language balances these two poles:

- **Precision** — Clean grids, consistent spacing, no clutter.
- **Warmth** — Generous white space, readable typography, encouraging copy.
- **Confidence** — Rich dark mode as default, subtle gradients, premium feel.
- **Clarity** — Legal jargon is surfaced but always explained. The UI never intimidates.

---

## 2. Brand Identity

### 2.1 Name & Positioning

- **Product Name:** LegalForge
- **Tagline:** _"Contracts. Clear. Confident."_
- **Tone of Voice:** Professional but human. Direct and encouraging. Never condescending.

### 2.2 Logo Concept

A minimalist wordmark with a subtle embossed "shield" or "scale" glyph — representing protection and balance. Clean sans-serif logotype.

---

## 3. Colour Palette

### Primary Palette (Dark Mode — Default)

| Token                   | Hex       | Usage                       |
| ----------------------- | --------- | --------------------------- |
| `--color-bg-base`       | `#0D0F14` | Main background             |
| `--color-bg-surface`    | `#161A23` | Cards, panels, modals       |
| `--color-bg-elevated`   | `#1E2330` | Elevated surfaces, sidebars |
| `--color-bg-hover`      | `#252B3B` | Hover states                |
| `--color-border`        | `#2A3147` | Dividers, input borders     |
| `--color-border-strong` | `#3D4A65` | Focused input borders       |

### Brand Accent

| Token                   | Hex       | Usage                                     |
| ----------------------- | --------- | ----------------------------------------- |
| `--color-accent`        | `#4F7FFF` | Primary CTA buttons, active states, links |
| `--color-accent-hover`  | `#3D6EF0` | Hover state for accent                    |
| `--color-accent-subtle` | `#1A2F66` | Accent background tints                   |

### Semantic Colours

| Token             | Hex       | Usage                           |
| ----------------- | --------- | ------------------------------- |
| `--color-success` | `#22C55E` | Completed steps, success states |
| `--color-warning` | `#F59E0B` | Conflict warnings, cautions     |
| `--color-error`   | `#EF4444` | Errors, destructive actions     |
| `--color-info`    | `#38BDF8` | Informational callouts          |

### Text

| Token                    | Hex       | Usage                            |
| ------------------------ | --------- | -------------------------------- |
| `--color-text-primary`   | `#F1F5F9` | Main body text                   |
| `--color-text-secondary` | `#94A3B8` | Secondary / muted text           |
| `--color-text-tertiary`  | `#64748B` | Placeholders, disabled           |
| `--color-text-inverse`   | `#0D0F14` | Text on light/accent backgrounds |

### Light Mode (System default fallback)

The app primarily ships in dark mode. A light mode is planned for V2. Light mode variables will be overridden via `[data-theme="light"]`.

---

## 4. Typography

### Font Stack

| Role                    | Font                   | Weight  | Size                        |
| ----------------------- | ---------------------- | ------- | --------------------------- |
| **Display**             | Inter                  | 700–900 | 32px–64px                   |
| **Heading**             | Inter                  | 600–700 | 20px–28px                   |
| **Body**                | Inter                  | 400–500 | 14px–16px                   |
| **Legal Text**          | Georgia / Lora (serif) | 400     | 14px–15px                   |
| **Code / Merge Fields** | JetBrains Mono         | 400     | 13px                        |
| **Label / Caps**        | Inter                  | 600     | 11px, letter-spacing 0.08em |

> **Rationale:** Inter is chosen for UI chrome — modern, legible, web-optimized. Legal clause text uses a serif (Georgia) to signal "document" and aid long-form reading. Monospace for merge field tokens aids clarity.

### Type Scale

```
xs:   11px / 1.4
sm:   13px / 1.5
base: 15px / 1.6
md:   17px / 1.5
lg:   20px / 1.4
xl:   24px / 1.3
2xl:  32px / 1.2
3xl:  40px / 1.15
4xl:  52px / 1.1
```

---

## 5. Spacing & Layout

- **Base unit:** 4px.
- **Spacing scale:** 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128.
- **Max content width:** 1280px.
- **Sidebar width:** 256px (collapsed: 64px).
- **Wizard max width:** 760px (centered).
- **Grid:** 12-column grid with 24px gutters on desktop, 16px on tablet.

---

## 6. Component Design

### 6.1 Buttons

| Variant       | Background             | Text                   | Border                  | Use Case                  |
| ------------- | ---------------------- | ---------------------- | ----------------------- | ------------------------- |
| **Primary**   | `--color-accent`       | white                  | none                    | Main CTA (Next, Generate) |
| **Secondary** | transparent            | `--color-text-primary` | `--color-border-strong` | Secondary actions         |
| **Ghost**     | transparent            | `--color-accent`       | none                    | Tertiary actions, links   |
| **Danger**    | `--color-error` at 15% | `--color-error`        | `--color-error`         | Destructive actions       |

All buttons: `border-radius: 8px`, `padding: 10px 20px`, `font-weight: 600`, `transition: all 150ms ease`.

### 6.2 Input Fields

- Background: `--color-bg-elevated`
- Border: `1px solid --color-border`
- Focus border: `1px solid --color-accent`
- Radius: `8px`
- Padding: `10px 14px`
- Label: uppercase, 11px, `--color-text-secondary`, letter-spacing 0.08em
- Error state: border `--color-error`, error message below in `--color-error`

### 6.3 Cards

- Background: `--color-bg-surface`
- Border: `1px solid --color-border`
- Radius: `12px`
- Padding: `24px`
- Shadow: `0 4px 24px rgba(0,0,0,0.3)`
- Hover: border transitions to `--color-border-strong`, subtle lift `translateY(-2px)`

### 6.4 Clause Card (Wizard)

A special card variant for displaying clause options:

```
┌─────────────────────────────────────────────┐
│  ● Selected indicator (left border accent)  │
│                                             │
│  SECTION TITLE                     [?] Help │
│                                             │
│  Clause Heading                             │
│  ─────────────────────────────              │
│  Plain language explanation text goes here  │
│  with enough detail to be useful.           │
│                                             │
│  [View Legal Text ▾]                        │
│                                             │
│  [Select This Clause]                       │
└─────────────────────────────────────────────┘
```

- Selected state: left `4px` border in `--color-accent`, background `--color-accent-subtle`
- Warning state: left `4px` border in `--color-warning`, warning icon and text

### 6.5 Progress Stepper (Wizard)

Horizontal stepper at top of wizard:

- Numbered circles (24px) for each section.
- Active: filled `--color-accent`, white number.
- Completed: filled `--color-success`, checkmark icon.
- Upcoming: `--color-bg-elevated`, `--color-text-tertiary` number.
- Connecting lines: `--color-border` (incomplete) / `--color-success` (complete).
- Section title below each circle (truncated on mobile).

### 6.6 Conflict Warning Modal

```
┌──────────────────────────────────────┐
│  ⚠️  Clause Conflict Detected         │
│  ─────────────────────────────────   │
│  "Clause B" conflicts with your      │
│  previously selected "Clause A".     │
│                                      │
│  [Why does this conflict?]           │
│                                      │
│  [Keep new clause → change old]      │
│  [Keep old clause]                   │
│  [Learn more]                        │
└──────────────────────────────────────┘
```

---

## 7. Page-Level Design Patterns

### 7.1 Landing Page

- Full-viewport hero with animated gradient background.
- Large display headline, tagline, two CTA buttons (Get Started, View Demo).
- Three-column feature grid below hero.
- Testimonials section (law firm logos).
- Pricing section (three tiers).
- Footer.

### 7.2 Auth Screens

- Centered card on dark background.
- Law firm logo shown when accessed via tenant subdomain.
- Email + password or magic link toggle.
- Clean, minimal, no distractions.

### 7.3 End User Dashboard

- Left sidebar: navigation (Dashboard, My Contracts, Start New).
- Main area: "Your Contracts" list with status chips (In Progress, Completed).
- Empty state: illustrated prompt to start first contract.
- Quick-start template cards in a grid.

### 7.4 Contract Wizard

- Full-screen layout (sidebar hidden on mobile).
- Left panel: progress stepper (collapsible on mobile).
- Right panel: current step content.
- Sticky bottom bar: Back / Next / Save Draft buttons.
- Auto-save indicator ("Saved 2 minutes ago").

### 7.5 Firm Admin Dashboard

- Left sidebar: Templates, Clients, Analytics, Settings.
- Dashboard home: metrics cards row, recent activity feed, quick actions.
- Template list: sortable table with status badges, action menus.
- Client list: searchable table with contract counts.

### 7.6 Template Builder

- Split-pane layout:
  - Left: Section list (drag-to-reorder).
  - Right: Active section editor.
- Clause editor: rich text area for legal text, plain text for explanation.
- Conflict rule builder: two-column clause pair selector with conflict type selector.

---

## 8. Motion & Animation

| Element                  | Animation                  | Duration | Easing      |
| ------------------------ | -------------------------- | -------- | ----------- |
| Page transitions         | Fade + subtle slide up     | 200ms    | ease-out    |
| Wizard step transitions  | Slide left/right           | 250ms    | ease-in-out |
| Modal open               | Scale from 0.95 + fade     | 180ms    | ease-out    |
| Card hover               | translateY(-2px)           | 150ms    | ease        |
| Conflict warning         | Shake + border flash       | 400ms    | ease        |
| Progress step completion | checkmark draw + pulse     | 300ms    | spring      |
| Auto-save indicator      | Fade in "Saved" → fade out | 2s       | ease        |

---

## 9. Responsive Breakpoints

| Name | Min Width | Description      |
| ---- | --------- | ---------------- |
| `xs` | 0         | Mobile portrait  |
| `sm` | 640px     | Mobile landscape |
| `md` | 768px     | Tablet           |
| `lg` | 1024px    | Desktop          |
| `xl` | 1280px    | Wide desktop     |

---

## 10. Accessibility

- All interactive elements have `:focus-visible` ring (2px, `--color-accent`, 2px offset).
- Colour contrast ratio ≥ 4.5:1 for normal text, 3:1 for large text.
- All modals trap focus.
- Wizard steps are keyboard navigable (Tab, Enter, Escape).
- Clause cards are selectable via keyboard (Space/Enter).
- All icons have aria-labels or are decorative (aria-hidden).
- Screen reader announcements for auto-save and conflict warnings.
