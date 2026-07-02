# Stitch Prompt: 05 — Law Firm Admin Dashboard

## Screen: Firm Admin Home Dashboard

### Context

The law firm admin's operational home. At-a-glance view of client activity, contract volumes, and quick actions. Data-rich but visually calm.

---

### Design Direction — Neomorphic Light

**Style:** Neomorphism meets minimalism. Light theme. A data dashboard where every panel, card, and chart element appears to be softly pressed from or raised out of the same off-white surface. No borders, no card outlines — shadow creates all depth. Restraint is key: the data is the hero, not the decoration.

**Tokens:** Same global palette.

```
--bg-base: #EEF2F7 | --shadow-light: rgba(255,255,255,0.85) | --shadow-dark: rgba(174,185,204,0.7)
--text-primary: #1E2A3B | --text-secondary: #6B7A94 | --text-muted: #9AAABB
--accent: #5B6CF9 | --success: #3DAA70 | --warning: #E09C3A | --error: #D94F4F
```

---

### Sidebar Navigation (Firm Admin)

- Same neomorphic raised sidebar panel as end-user dashboard.
- **Top:** Firm logo + firm name + "Admin" neomorphic inset pill badge (12px, `--accent`).
- **Nav items:** Same active = inset, resting = flat pattern.
  - 📊 Dashboard
  - 📝 Templates
  - 👥 Clients
  - 📄 Contracts
  - 📈 Analytics
  - (separator)
  - ⚙️ Firm Settings
  - 🚪 Log Out

---

### Top Bar

- **Left:** "Firm Dashboard" — 20px, weight 700, `--text-primary`.
- **Right:** Date range selector (neomorphic inset pill — "This Month ▾") | [+ New Template] — neomorphic raised accent pill button.

---

### Row 1: KPI Cards

4 cards in a row. Each is a **neomorphic raised card** (`border-radius: 20px`, `padding: 28px 24px`).

**Icon:** Neomorphic inset circle (~44px). The icon colour is the only colour on the card — all other text is `--text-primary` / `--text-secondary`.

**Card layout:**

```
[Inset icon circle]

  47                    ← 32px, weight 800, --text-primary
  Active Clients        ← 13px, --text-secondary
  ↑ +8 this month       ← 12px, --success (trend up) / --error (down)
```

**The 4 cards:**

1. 👥 icon (`--accent`) — Active Clients
2. 🔄 icon (`--warning`) — Contracts In Progress
3. ✅ icon (`--success`) — Completed This Month
4. 📝 icon (`--accent`) — Published Templates

No colour fills on cards themselves — all `--bg-base`. The icon inside the inset circle is the only colour.

---

### Row 2: Charts

Two chart panels side by side. Both are **neomorphic raised panels** (`border-radius: 20px`, `padding: 28px`).

**Left panel (60%): "Contract Activity — Last 30 Days"**

- Heading: 14px, weight 600, `--text-primary`.
- Sub: "Contracts started vs completed" — 12px, `--text-muted`.
- **Chart area:** Neomorphic inset recessed area inside the panel (`border-radius: 12px`, inset shadow). The chart renders inside this recessed trough.
- Chart style: Minimal area chart. Two lines — `--accent` (started) and `--success` (completed). No fills, just strokes. Grid lines: very faint (`rgba(174,185,204,0.2)`).
- Axis labels: 11px, `--text-muted`.

**Right panel (40%): "Template Popularity"**

- Heading + sub as above.
- **Chart:** Horizontal bars inside a neomorphic inset area. Bars themselves are neomorphic raised strips — `--accent` fill, subtle bar-level shadow.
- Template name left, count right. 5–6 bars. Clean, no grid.

---

### Row 3: Activity Feed + Quick Actions

**Left panel (60%): "Recent Client Activity"** — neomorphic raised.

- List of 8–10 items. Each item: user avatar (neomorphic inset circle, initials) + name + action text + time.
- A small accent dot for new/unread activity.
- Dividing lines: `rgba(174,185,204,0.3)`, 1px.
- [View All Activity →] — text link, `--accent`, bottom.

**Right panel (40%): "Quick Actions"** — neomorphic raised.

- **Action buttons (stacked):**
  1. [Create New Template] — neomorphic raised, accent fill.
  2. [Invite a Client] — neomorphic raised, ghost.
  3. [View Analytics] — neomorphic raised, ghost.
- **Pending Reviews section** (if any exist):
  - Small neomorphic inset area inside the panel. Lists template drafts awaiting publish review.
  - Each: template name + editor name + [Review →] text link.

---

### Row 4: "Clients Needing Attention"

Neomorphic raised panel, full width.

- **Heading:** "Clients Needing Attention" — 14px, weight 600. Sub: "Contracts inactive for more than 3 days."
- **Table:** No hard borders. Rows separated by `rgba(174,185,204,0.25)` 1px lines.
  - Columns: Client Name | Template | Started | Days Inactive | Action
  - "Days Inactive" cell: if > 3 days, value shown in `--warning`. If > 7 days, `--error`.
  - [Remind] button per row: small neomorphic raised pill, ghost, `--accent` text.
- [View All →] text link, bottom right.

---

### Empty State (new account)

- Centered in main content area, no card. Simple line-art illustration.
- Heading + sub + [Create Your First Template] neomorphic raised accent button.

---

### Design Notes

- All data values animate counting up on initial load (e.g., 0 → 47 over 600ms). Subtle, purposeful.
- Chart tooltips: small neomorphic raised pill floating above the data point. White (base) background, standard shadow, `--text-primary` text.
- No coloured card backgrounds. No gradient fills. Shadow alone creates all depth.
