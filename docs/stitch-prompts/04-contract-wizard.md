# Stitch Prompt: 04 — Contract Wizard (Guided Builder)

## Screens: Party Collection | Clause Selection | Conflict Warning | Review & Generate

### Context

The Contract Wizard is the heart of LegalForge — a multi-step guided experience that takes an end user through building their contract section by section. It must be calm, focused, and trustworthy. Legal content is intimidating; the design must soothe.

---

### Design Direction — Neomorphic Light

**Style:** Neomorphism meets minimalism. Light theme. The wizard is a focused full-screen experience — everything is the same off-white surface, with wizard panels and interactive elements softly extruded via shadow. No hard borders. No distracting decoration.

**Tokens:** Same global palette as all other screens.

```
--bg-base: #EEF2F7 | --shadow-light: rgba(255,255,255,0.85) | --shadow-dark: rgba(174,185,204,0.7)
--text-primary: #1E2A3B | --text-secondary: #6B7A94 | --text-muted: #9AAABB
--accent: #5B6CF9 | --accent-light: #EEF0FE | --warning: #E09C3A | --success: #3DAA70
```

**Key neomorphic patterns used here:**

- **Raised panel:** sidebar and bottom bar float above the page.
- **Inset panel:** clause legal text expander recessed into the card.
- **Raised card:** each clause option is a raised card.
- **Selected clause:** inset shadow — the selected card "sinks in", feeling chosen.
- **Inset input:** all text inputs use inset shadow (recessed).

---

### Overall Wizard Layout

```
┌────────────────────────────────────────────────────────────────┐
│  Top Bar: ← Back  |  Template Name  |  [Save Draft]  ✓ Saved  │
├──────────────────┬─────────────────────────────────────────────┤
│                  │                                             │
│  PROGRESS        │  CURRENT STEP CONTENT                      │
│  SIDEBAR         │                                             │
│  (240px raised)  │                                             │
│                  │                                             │
├──────────────────┴─────────────────────────────────────────────┤
│  Bottom Bar: [← Back]        Step 4 of 9       [Next Step →]  │
└────────────────────────────────────────────────────────────────┘
```

Page background: `--bg-base` everywhere.

---

### Top Bar

- Minimal. Same `--bg-base`, soft neomorphic bottom shadow (very subtle).
- **Left:** "← Back to Dashboard" — 13px, `--text-muted`, no decoration.
- **Center:** Template name — 15px, `--text-secondary`.
- **Right:** [Save Draft] — neomorphic raised ghost pill button. Auto-save status: "✓ Saved 1 min ago" — 12px, `--success`, fades in/out.

---

### Progress Sidebar

- Neomorphic raised panel, same `--bg-base`. Right-edge shadow only (feels like page is raised under the sidebar).
- **Header:** "Progress" — 11px, uppercase, `--text-muted`.
- **Step list items:**
  - **Completed:** Small green circle (neomorphic raised, `--success` fill, white checkmark) + dim text + strikethrough. Clickable — navigates back.
  - **Active:** Neomorphic **inset** pill container behind the entire row. Accent indigo text + icon. The row "sinks in" — selected/pressed feeling.
  - **Upcoming:** Empty circle (neomorphic raised, unfilled) + `--text-muted` text.
  - Vertical connecting line between circles: `rgba(174,185,204,0.4)`, 1px.
- First item always: "Parties". Last item always: "Review & Generate".

---

### Bottom Bar

- Neomorphic raised bar at bottom — same `--bg-base`, shadow upward.
- **Left:** [← Back] — neomorphic raised ghost pill.
- **Center:** "Step 4 of 9" — 13px, `--text-muted`.
- **Right:** [Next Step →] — neomorphic raised pill, accent indigo fill, white text.

---

### Step: Party Collection

**Content area (centered, max-width 680px):**

- **Step label:** "STEP 1 OF 9" — 11px, uppercase, `--accent`, letter-spacing.
- **Heading:** "Who's involved?" — 28px, weight 700, `--text-primary`.
- **Sub:** "Fill in the details for everyone in this agreement." — 14px, `--text-secondary`, weight 300.

**Party section card (neomorphic raised, `border-radius: 20px`, `padding: 32px`):**

```
BUYER                                              Party 1 of 1
─────────────────────────────────────────────────────────────
Full Name                           ID / Reg. Number
[ inset input ________________ ]    [ inset input _________ ]

Email Address                       Phone Number
[ inset input ________________ ]    [ inset input _________ ]

Physical Address
[ inset input ______________________________________________ ]

ℹ️  The Buyer is the person making the offer to purchase.
    (13px, --text-muted, italic)
```

- ℹ️ info row: small neomorphic inset pill callout — same background, inset shadow, `--text-muted` text.
- If `allows_multiple`: [+ Add Another Buyer] — neomorphic raised ghost pill below the card. Tapping adds a new party card of the same type.

---

### Step: Clause Selection

**Content area (centered, max-width 680px):**

- **Section label:** "SECTION 3 OF 8 — SUSPENSIVE CONDITIONS" — 11px, uppercase, `--accent`.
- **Heading:** "Choose your Suspensive Conditions clause" — 24px, weight 700, `--text-primary`.
- **Help text:** 14px, `--text-secondary`, weight 300, line-height 1.7.

**Clause Cards:**

Each clause option is a **neomorphic raised card** (`border-radius: 20px`, `padding: 28px`).

**Unselected state:**

```
box-shadow: -8px -8px 16px rgba(255,255,255,0.85), 8px 8px 16px rgba(174,185,204,0.7);
```

**Selected state (feels "chosen"/pressed):**

```
box-shadow: inset -4px -4px 10px rgba(255,255,255,0.85), inset 4px 4px 10px rgba(174,185,204,0.7);
/* A thin 2px left border in --accent is the ONLY colour accent on selected state */
border-left: 3px solid #5B6CF9;
```

**Recommended badge (default clause only):**

- Small neomorphic inset pill — "★ Firm Recommendation" — `--accent` text, `--accent-light` background.

**Clause card content:**

```
[★ Firm Recommendation pill]                    [Selected ✓ / Select button]

Standard Finance Clause
─────────────────────────────────────────────

WHAT THIS MEANS
This clause makes the sale conditional on the buyer obtaining a
home loan from a bank within 30 days...    (14px, --text-secondary)

EXAMPLE
"John agrees to buy, but only if the bank approves his loan by
15 March 2026."    (13px, --text-muted, italic)

[View Full Legal Text ▾]   (13px, --accent, no border, text-only toggle)
```

**Legal text expander:** Slides open below the explanation. Content area uses neomorphic inset styling — the text appears recessed into the card. Monospace-adjacent serif font (Georgia) at 13px, `--text-secondary`.

**"Select This Clause" button (unselected cards):** Small neomorphic raised pill, accent fill, right-aligned.

**"Selected ✓" indicator (selected card):** Replaced by a neomorphic inset small pill — green fill, white checkmark + "Selected". No button.

**Spacing between clause cards:** 20px gap. No dividers — shadow separation.

---

### Conflict Warning Modal

A modal overlaid on the wizard. Backdrop: `rgba(238, 242, 247, 0.75)` blur (same colour, frosted).

**Modal card (neomorphic raised, `border-radius: 24px`, `padding: 40px 36px`, `max-width: 480px`):**

- **Icon:** Large neomorphic raised circle (~64px) with an amber ⚠ icon inside.
- **Heading:** "Clause Conflict Detected" — 20px, weight 700, `--text-primary`.
- **Conflict description:** Two clause titles separated by "conflicts with" — small neomorphic inset pills for the clause names.
- **Explanation:** 14px, `--text-secondary`, plain English explanation of why they conflict.
- **Action buttons (stacked, full-width):**
  1. [Keep new clause & remove the old one] — neomorphic raised, accent fill. Primary action.
  2. [Keep old clause] — neomorphic raised, ghost (same base colour).
  3. [Learn more] — text-only link, `--accent`, no button chrome.

**Warning modal shadow:** Add amber tint to the dark shadow — `rgba(224,156,58,0.2)` — giving the card a very subtle amber glow without adding colour explicitly.

---

### Step: Review & Summary

**Content area (centered, max-width 680px):**

- **Heading:** "Review Your Contract" — 28px, weight 700.
- **Sub:** 14px, `--text-secondary`.

**Parties card (neomorphic raised):**

```
┌────────────────────────────────────────────────┐
│  PARTIES                                [Edit] │
│  ─────────────────────────────────────────     │
│  BUYER    John Smith (ID: 8001015800085)        │
│  SELLER   Jane Doe (ID: 7502124800086)          │
└────────────────────────────────────────────────┘
```

**Section clause cards (neomorphic raised, one per section):**

```
┌────────────────────────────────────────────────┐
│  PURCHASE PRICE                         [Edit] │
│  ─────────────────────────────────────────     │
│  ✓  Fixed Purchase Price Clause                │
│     R 3,500,000 — payable on registration.     │
└────────────────────────────────────────────────┘
```

- Green `✓` (neomorphic inset small circle, `--success`) for complete sections.
- Amber `⚠` for sections with unresolved warnings.
- [Edit] — small text-only link, `--accent`.

**Generate block (bottom, inside a wider neomorphic raised card):**

- Heading: "Ready to generate?" — 20px, weight 700.
- Sub: 14px, `--text-secondary`, brief note about the PDF.
- [Generate My Contract 🚀] — large, full-width, neomorphic raised, accent fill. Strongest shadow of any button on the page.
- Disclaimer: 11px, `--text-muted`, italic.

---

### Contract Generated Confirmation

Replace wizard content with a centered confirmation:

- **Large animated circle** (neomorphic raised, ~80px) with a green checkmark drawn via SVG animation.
- **Heading:** "Your Contract is Ready! 🎉" — 26px, weight 700.
- **Sub:** 14px, `--text-secondary`.
- [Download PDF] — large neomorphic raised pill, accent fill.
- [View Summary] — neomorphic raised ghost pill.
- [Start Another Contract] — text link, `--accent`.
- Email confirmation note: 13px, `--text-muted`.
