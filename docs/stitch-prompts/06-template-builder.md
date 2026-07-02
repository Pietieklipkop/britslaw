# Stitch Prompt: 06 — Template Builder (Firm Admin)

## Screen: Template List | Template Editor | Section Manager

### Context

The primary authoring tool for law firm admins to create and manage contract templates. Needs to feel structured and powerful — like a clean CMS — without feeling heavy. The firm's lawyers will use this daily.

---

### Design Direction — Neomorphic Light

**Style:** Neomorphism meets minimalism. Light theme. A focused split-pane editor where every panel, input, and action element is extruded from or recessed into the same off-white surface. The editor should feel like working on a clean desk — everything has a place, nothing competes for attention.

**Tokens:** Same global palette.

**Editor-specific pattern — Split Pane:**

- **Left pane** (section list): Neomorphic raised panel, same `--bg-base` as page. Right-side shadow only.
- **Right pane** (editor content): Flat `--bg-base` — no shadow — gives the feeling of a "working surface" vs the raised left panel.
- The boundary between panes: just slightly different shadow depth — no divider line.

---

### Screen A: Template List

Full content area (sidebar nav + main).

**Header row:**

- "Contract Templates" — 20px, weight 700, `--text-primary`.
- [+ Create Template] — neomorphic raised pill, accent fill.

**Status tab pills (neomorphic inset when active):**
All | Published (8) | Draft (2) | Archived (1)

- Active tab: neomorphic inset pill (`inset -3px -3px 6px ... , inset 3px 3px 6px ...`), accent text.
- Inactive: flat text, `--text-muted`.

**Table:**

- No card wrapper — the list sits directly on `--bg-base`.
- Rows separated by `rgba(174,185,204,0.25)` 1px lines.
- Hover row: very subtle background darken (`rgba(174,185,204,0.1)`).

Columns:

- **Cover/Icon:** Small neomorphic inset square (template icon inside).
- **Template Name:** 15px, weight 600, `--text-primary`.
- **Type:** 12px, `--text-muted`.
- **Sections:** Number, `--text-secondary`.
- **Clients Used:** Number, `--text-secondary`.
- **Status:** Neomorphic inset pill badge — "Published" (`--success` text), "Draft" (`--warning` text), "Archived" (`--text-muted`).
- **Last Updated:** 12px, `--text-muted`.
- **Actions:** [Edit] text link (`--accent`) | [⋮] overflow menu trigger.

**Overflow menu:** Small neomorphic raised card dropdown, `border-radius: 12px`. Items: Duplicate | Archive | Preview | Delete (delete in `--error`).

---

### Screen B: Template Editor (Split Pane)

**Top bar (within editor):**

- [← Templates] text link (`--text-muted`) | Template name (editable inline input — neomorphic inset on focus) | Status pill (inset, current status) | [Preview] ghost pill | [Save Draft] ghost pill | [Publish] accent pill.

**Left Pane — Section List (240px):**

Background: neomorphic raised panel.

Sections:

- Fixed at top: "General Info" | "Party Definitions" — `--text-secondary`.
- Horizontal rule.
- Section items (drag-reorderable):
  - Drag handle: `⠿` icon, `--text-muted`, left edge.
  - Section number + title: 14px, `--text-primary`.
  - **Active section:** Full-row neomorphic inset — the row "sinks in". `--accent` text.
  - Unsaved changes dot: small amber dot right of title.
- [+ Add Section] — text link with + icon, `--accent`, pinned to bottom of list.

**Right Pane — Editor Surface:**

Flat `--bg-base` surface. Content area max-width 680px, centered in the pane.

---

**General Info fields (all neomorphic inset inputs):**

- Template Name (large, 20px input, prominent)
- Description (textarea, inset)
- Contract Type (custom select — neomorphic raised dropdown trigger, inset list)
- Jurisdiction (select)
- Language (select)
- Estimated Completion Time (number + "minutes" suffix)
- Cover Image (neomorphic inset dropzone: dashed inset border effect via box-shadow, centered icon + "Drop image or click to upload")

---

**Party Definitions tab:**

- Heading + sub.
- **Party cards** (neomorphic raised, stacked):
  ```
  BUYER                                          [Edit ✏] [Delete 🗑]
  role key: buyer
  Display name: "Buyer / Purchaser"
  Description: "The person making an offer..."   (--text-muted, 13px)
  ☐ Allow multiple                               (custom neomorphic toggle)
  ```
- Custom toggle: A neomorphic raised pill that, when on, sinks into an inset state with accent indigo fill on the knob.
- [+ Add Party Role] — neomorphic raised ghost pill at bottom.

---

**Section Clause Editor:**

Tab bar (neomorphic inset pills when active): **Clauses** | **Conflict Rules** | **Settings**

**Clauses tab:**

Section title input (neomorphic inset, 20px, weight 600).
Section description textarea (neomorphic inset, smaller).

**Default Clause card (neomorphic raised, `border-radius: 16px`, `padding: 24px`):**

```
DEFAULT CLAUSE                              [★ Default — cannot remove]
───────────────────────────────────────────────────────────────────────
Clause Title:
[ neomorphic inset input _______________________________________ ]

Plain Language Explanation:
[ neomorphic inset textarea — "What does this mean in plain terms?" ]

Example(s):
[ neomorphic inset textarea — "Give 1–2 real-world examples..." ]

Legal Text:                           [Merge field tokens autocomplete]
[ neomorphic inset rich-text area — serif font (Georgia), 13px ]
[ {{buyer.fullName}} shown as a neomorphic raised indigo chip inline ]
```

Merge field chips inside legal text: small neomorphic raised pills, `--accent-light` background, `--accent` text. E.g., `[buyer.fullName]`.

**Alternative Clause cards:** Same layout, but with a [🗑 Remove] icon top-right and no "Default" label. Drag handle on left. Stacked below default with 16px gap.

[+ Add Alternative Clause] — neomorphic raised ghost pill, full-width of clause column.

---

**Publish confirmation modal:**

Neomorphic raised modal card (`border-radius: 24px`, `padding: 40px`).

- Heading: "Publish this template?" — 20px, weight 700.
- Checklist (neomorphic inset area inside modal):
  - ✓ 12 sections configured (`--success`)
  - ✓ 2 party roles defined (`--success`)
  - ⚠ 3 clauses have no explanation (`--warning`)
- [Publish Anyway] — accent raised pill. [Cancel] — ghost raised pill.

---

### Motion Notes

- Drag-and-drop section reorder: raised shadow increases while dragging (section "lifts off"). Drops back smoothly. 200ms ease.
- Auto-save toast: "Changes saved" — small neomorphic raised pill fades in at bottom-center, fades out after 2s.
- Tab switching: content fades (150ms) — no slide, keeps it calm.
