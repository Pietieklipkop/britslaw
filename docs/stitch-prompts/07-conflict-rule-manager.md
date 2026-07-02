# Stitch Prompt: 07 — Conflict Rule Manager (Clause Editor)

## Screen: Conflict Rule Builder & Management

### Context

A sub-screen of the Template Builder used by law firm admins to define which clauses conflict with each other. Must make an inherently complex concept (a clause compatibility graph) feel simple and manageable.

---

### Design Direction — Neomorphic Light

**Style:** Neomorphism meets minimalism. Light theme. The conflict manager lives inside the Template Editor's right pane. Its unique challenge is communicating "incompatibility" through the neomorphic visual language — without adding aggressive colours or heavy visual noise.

**Key principle:** Use shadow depth to signal status:

- **Compatible pairs:** Normal raised surface — neutral.
- **Incompatible pairs:** Amber-tinted dark shadow (`rgba(224,156,58,0.35)`) — the card feels "warm" or "tense" without a coloured background.
- **Warning pairs:** Slightly amber-tinted shadow, less intense.

**Tokens:** Same global palette.

---

### Tab: Conflict Rules

Located as a tab inside the Section Clause Editor:
**[Clauses]** | **[Conflict Rules]** | **[Settings]**

Active tab: neomorphic inset pill, `--accent` text.

---

### Header

- "Clause Conflict Rules" — 16px, weight 600, `--text-primary`.
- Sub: "Define which clause combinations are incompatible or need a caution." — 13px, `--text-muted`.
- [+ Add Conflict Rule] — neomorphic raised pill, accent fill, right-aligned.

---

### Conflict Matrix

A read-only visual grid showing all clauses for this section on both axes. Appears at the top of the tab.

**Matrix container:** Neomorphic inset panel (`border-radius: 16px`, inset shadow, `padding: 16px`). The table renders inside this recessed area — it feels like a "board" pressed into the surface.

**Cell styling (all same `--bg-base`):**

- `—` (same clause): `--text-muted`, centered.
- `OK` (compatible): `--success`, small weight, `--text-muted` actually — muted green or just `--text-muted`.
- `✗` (incompatible): A small neomorphic raised circle with `--error` text inside. The circle has an amber-tinted shadow.
- `⚠` (warning): Same circle pattern with `--warning` text.

**Legend row** below the matrix: three small neomorphic raised pills as legend items — `✗ Incompatible` | `⚠ Warning` | `OK Compatible`.

---

### Conflict Rules List

Below the matrix. Heading: "Defined Rules" — 13px, weight 600, `--text-secondary`.

**Each rule — neomorphic raised card (`border-radius: 16px`, `padding: 20px 24px`):**

**Incompatible rule card:**

```
box-shadow: -6px -6px 14px rgba(255,255,255,0.85), 6px 6px 14px rgba(224,156,58,0.3);
/* Amber-tinted dark shadow — card feels "tense" without coloured background */
```

Content:

```
[✗ INCOMPATIBLE pill — inset, --error text]              [Edit ✏] [Delete 🗑]
─────────────────────────────────────────────────────────────────────────────
"Standard Finance Clause"    conflicts with    "Cash Purchase Clause"
(neomorphic inset pill)           →           (neomorphic inset pill)

WHAT THE USER SEES:
"You cannot simultaneously require bank financing and state the purchase
is cash-only. Please select one approach."    (13px, --text-muted, italic)
```

**Warning rule card:**

```
box-shadow: -6px -6px 14px rgba(255,255,255,0.85), 6px 6px 14px rgba(174,185,204,0.6);
/* Normal shadow — slightly less intense, neutral */
```

Same content layout but with `[⚠ WARNING pill]` and warning-tinted amber text on the pill.

**Empty state:**

- Neomorphic inset area (recessed panel), centered text: "No conflict rules yet. Add one to protect clients from incompatible combinations." + [+ Add Conflict Rule] pill.

---

### Add Conflict Rule Modal

Neomorphic raised modal card (`border-radius: 24px`, `padding: 40px 36px`, `max-width: 520px`). Same backdrop blur as conflict warning (white-tinted frosted).

```
Add Conflict Rule                                            [✕]
─────────────────────────────────────────────────────────────────

Clause A
[ Neomorphic inset select dropdown — "Select a clause ▾" ]
(Grouped by section: "— Section 3: Suspensive Conditions —" as optgroup)

Conflict Type
  ●  Incompatible — Cannot be selected together
  ○  Warning — Unusual combination, user is cautioned

(Custom neomorphic radio buttons: raised circle that sinks into inset when selected,
 with a small filled indigo circle inside as the indicator)

Clause B  (conflicts with Clause A)
[ Neomorphic inset select dropdown — "Select another clause ▾" ]
(Clause A excluded from this list)

Explanation shown to the user:
[ Neomorphic inset textarea — plain English, 300 char max ]
e.g., "You cannot have both a finance condition and a cash-only clause..."

Character count: 142 / 300   (12px, --text-muted, right-aligned)

────────────────────────────────────────────────────────────────
[Cancel]                              [Save Conflict Rule]
ghost raised pill                      accent raised pill
```

**Live preview section** (at bottom of modal, inside a neomorphic inset panel):

- Label: "PREVIEW — What the user will see:" — 11px, uppercase, `--text-muted`.
- Renders a miniaturised version of the conflict warning modal (read-only) using the explanation text typed above. Updates in real time as the user types.

---

### Cross-Section Conflicts

Below the same-section rules list.

- Heading: "Cross-Section Conflicts" — 13px, weight 600, `--text-secondary`.
- Same card format, but clause pills show the full section prefix: "Sec. 2 → [Clause Name]".

---

### Motion Notes

- Adding a new rule: new card animates in (`opacity 0 → 1` + height expand), 200ms.
- Deleting a rule: card height collapses + fade out, 200ms. Then matrix updates.
- Matrix cell updates: cell transitions its shadow colour change, 150ms.
- Modal enter: scale `0.95 → 1` + fade, 180ms ease-out.
