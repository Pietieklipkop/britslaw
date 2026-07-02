# Stitch Prompt: 01 — Landing Page

## Screen: Marketing Landing Page

### Context

Public-facing marketing homepage for **LegalForge**, a SaaS contract builder for law firms and their clients.

---

### Design Direction — Neomorphic Light

**Style Philosophy:**

- **Neomorphism meets minimalism.** Surfaces appear to be softly extruded from the page — no borders, no heavy cards. Depth comes entirely from dual shadows.
- **Light theme only.** The entire palette lives in the off-white and light grey range.
- **Restrained colour.** A single accent (soft indigo `#5B6CF9`) used sparingly — CTAs, active states, highlights only. Everything else is neutral.
- **Generous whitespace.** Sections breathe. No visual clutter.

**Base Colour Tokens:**

```
--bg-base:        #EEF2F7   (page background — warm off-white)
--bg-surface:     #EEF2F7   (same as base — neomorphic surfaces float from the same plane)
--shadow-light:   rgba(255,255,255,0.85)
--shadow-dark:    rgba(174,185,204,0.7)
--text-primary:   #1E2A3B
--text-secondary: #6B7A94
--text-muted:     #9AAABB
--accent:         #5B6CF9   (indigo — CTAs only)
--accent-light:   #EEF0FE   (accent tint for backgrounds)
```

**Neomorphic Shadow Recipe:**

```css
/* Raised element (default) */
box-shadow:
	-6px -6px 14px rgba(255, 255, 255, 0.85),
	6px 6px 14px rgba(174, 185, 204, 0.7);

/* Inset / pressed element (active input, selected state) */
box-shadow:
	inset -4px -4px 8px rgba(255, 255, 255, 0.85),
	inset 4px 4px 8px rgba(174, 185, 204, 0.6);

/* Button (stronger raise) */
box-shadow:
	-4px -4px 10px rgba(255, 255, 255, 0.9),
	4px 4px 10px rgba(174, 185, 204, 0.8);
```

**Typography:** Inter. Weights: 300 (body), 500 (labels), 700 (headings), 800 (display).
**Border-radius:** Consistent 16px for cards, 10px for inputs/buttons, 50px for pill badges.

---

### Navigation Bar

- **Background:** `#EEF2F7`, no border — just a very subtle bottom drop shadow on scroll.
- **Logo:** "LegalForge" wordmark — dark indigo text, small scale icon.
- **Nav links:** `--text-secondary` colour, no underlines.
- **Right:** [Log in] ghost (text only, indigo) | [Get Started] — neomorphic raised button, accent indigo fill.
- Sticky, minimal, clean.

---

### Section 1: Hero

- **Background:** `#EEF2F7` full-width.
- **Layout:** Centered single column, max-width 680px.
- **Headline (H1):** "Contracts. Clear. Confident." — 56px, weight 800, `--text-primary`. One word per line visual rhythm.
- **Sub-headline:** 18px, `--text-secondary`, weight 300, line-height 1.7.
- **CTA Row:**
  - Primary: neomorphic raised pill button, accent indigo fill, white text — "Start Building Contracts"
  - Secondary: neomorphic raised pill button, `--bg-base` fill, indigo text — "Watch Demo"
  - Both buttons: `box-shadow: -4px -4px 10px rgba(255,255,255,0.9), 4px 4px 10px rgba(174,185,204,0.8)`
- **Below CTAs:** "Trusted by 20+ South African law firms" — small caps, `--text-muted`, a row of small greyscale firm logo marks.
- **Hero visual:** A single large neomorphic card (raised, `border-radius: 24px`, same `--bg-base` colour) showing a mockup of the contract wizard step — floating slightly above the page with a strong neomorphic shadow.

---

### Section 2: How It Works

- **Background:** Same `#EEF2F7`.
- **Heading:** "From Template to Signed in 3 Steps" — centered, 32px bold.
- **Layout:** 3 neomorphic raised cards side by side (equal width). Each card: `border-radius: 20px`, raised shadow, `padding: 36px 28px`.
- **Step number:** Very large (64px, weight 800), `--accent-light` colour — decorative, fades into background.
- **Icon:** Simple thin-line icon in a small neomorphic inset circle (inset shadow inside circle).
- **Title:** 18px, weight 700, `--text-primary`.
- **Body:** 14px, weight 300, `--text-secondary`.
- No borders, no separating lines — shadow alone creates the card.

---

### Section 3: Feature Grid

- **Heading:** "Everything You Need to Contract with Confidence" — centered.
- **Layout:** 2-column grid of 6 feature cards (neomorphic raised, identical to step cards).
- **Icon:** Inset neomorphic circle, accent indigo icon inside.
- No colours, badges, or decorative elements other than the shadows.

---

### Section 4: Testimonials

- **Background:** Slightly deeper off-white `#E4E9F0` — a gentle tonal shift to create a new "layer".
- **Cards:** Neomorphic raised, `border-radius: 20px`. Quote text in italic, `--text-secondary`. Attribution below in small, `--text-muted`.
- Star ratings: five small filled stars in `--accent`.

---

### Section 5: Pricing

- **3 cards side by side.** All start as neomorphic raised.
- **Middle card (recommended):** Deeper inset shadow style replaced by a flat accent indigo fill — the one exception to the neomorphic rule, drawing the eye to the recommended tier. White text inside.
- Plan name, price, feature list with soft checkmarks, CTA button.

---

### Section 6: Footer

- **Background:** `#E0E5ED` — slightly deeper, signals closure.
- **Layout:** Logo + tagline left, link columns right.
- **No heavy dividers** — tonal background difference and whitespace do the work.
- Text: `--text-secondary` and `--text-muted`.

---

### Interaction & Motion Notes

- Buttons: on hover, shadow softens slightly (reduces depth) giving a "sinking" feeling. On click: full inset shadow (pressed state). Transition: 120ms ease.
- Feature cards: on hover, shadow becomes slightly stronger (rises more). Transition: 150ms ease.
- Page scroll: nav bar gains a more pronounced shadow as page scrolls.
- All transitions are subtle — this is minimalist, not animated.
