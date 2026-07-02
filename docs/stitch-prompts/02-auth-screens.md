# Stitch Prompt: 02 — Auth Screens (Login & Register)

## Screens: Login Page | Register Page | Magic Link Sent | Forgot Password

### Context

Authentication screens for LegalForge. Appear when a user visits directly or via a law firm's subdomain. When accessed via a subdomain, the law firm's logo and name are shown.

---

### Design Direction — Neomorphic Light

**Style:** Neomorphism meets minimalism. A single centered card floats softly from the same off-white page background. No borders — depth is achieved entirely through dual shadows. Light theme only.

**Colour Tokens:**

```
--bg-base:        #EEF2F7
--shadow-light:   rgba(255,255,255,0.85)
--shadow-dark:    rgba(174,185,204,0.7)
--text-primary:   #1E2A3B
--text-secondary: #6B7A94
--text-muted:     #9AAABB
--accent:         #5B6CF9
--accent-light:   #EEF0FE
--error:          #D94F4F
--success:        #3DAA70
```

**Page:** Full viewport, `--bg-base` background. The card appears to rise from the same surface — same colour, separated only by shadow.

**Card:**

- `background: #EEF2F7`
- `border-radius: 24px`
- `padding: 48px 44px`
- `max-width: 440px`, centered both axes
- `box-shadow: -10px -10px 20px rgba(255,255,255,0.85), 10px 10px 20px rgba(174,185,204,0.7)`
- No border, no outline

**Input Fields:**

- Same background as page (`#EEF2F7`)
- `border-radius: 10px`
- `padding: 12px 16px`
- **Inset shadow (resting):** `box-shadow: inset -3px -3px 7px rgba(255,255,255,0.8), inset 3px 3px 7px rgba(174,185,204,0.55)`
- **Focus state:** Inset shadow remains + a thin `2px` indigo outline only (no border on blur)
- No visible border at rest — the inset gives the "recessed" feel

**Buttons:**

- Primary (accent): `background: #5B6CF9`, white text, `border-radius: 10px`
- `box-shadow: -3px -3px 8px rgba(255,255,255,0.7), 3px 3px 8px rgba(174,185,204,0.7)`
- Hover: shadow softens (element appears to rise less — subtle sinking)
- Active/click: full inset shadow (element sinks in)
- Ghost button: same neomorphic raised shadow, `--bg-base` fill, accent text

**Labels:** 11px, uppercase, letter-spacing 0.08em, `--text-secondary`.

**Typography:** Inter. No decorative elements — whitespace and shadow do the work.

---

### Screen A: Login

**Page background:** `#EEF2F7`, no pattern, no gradient.

**Card content (top to bottom):**

1. **Firm Logo** (if tenant subdomain): logo image, 48px height, centered. Firm name below in 13px, `--text-muted`. Soft horizontal rule (1px `rgba(174,185,204,0.3)`).
2. **Otherwise:** "LegalForge" wordmark centered, 20px, weight 700, `--text-primary`.
3. **Heading:** "Welcome back" — 26px, weight 700, `--text-primary`. 8px margin-top.
4. **Sub-heading:** "Sign in to your account" — 14px, `--text-secondary`, weight 300.
5. **Email field** — inset neomorphic input, label "EMAIL ADDRESS" above.
6. **Password field** — inset neomorphic input, label "PASSWORD", eye-toggle icon inside right edge (greyed, tappable).
7. **Forgot password** — right-aligned, 12px, `--accent`, no underline, weight 500.
8. **Sign In button** — full-width, accent fill, raised neomorphic shadow, "Sign In →".
9. **Divider:** thin line both sides of "or" — `rgba(174,185,204,0.4)`.
10. **Magic Link button** — full-width, ghost neomorphic, envelope icon left, "Send me a magic link".
11. **Footer text:** "Don't have an account? [Request access]" — 13px, `--text-muted`, link in `--accent`.

**Error state:** Input field inset shadow shifts to red tones (`inset ... rgba(217,79,79,0.3)`). Error message below field in 12px `--error`. No red border — shadow colour changes only.

---

### Screen B: Register / Invitation Acceptance

**Card content:**

1. Firm logo block (same as login).
2. **Heading:** "You've been invited!" — 26px, weight 700.
3. **Sub:** "Smith & Partners has invited you to set up your account." — 14px, `--text-secondary`.
4. **Email field** — pre-filled, **inset pressed state permanently** (deeper inset shadow, `--text-muted` text, not editable).
5. **Full Name field** — inset neomorphic input.
6. **Password field** — inset neomorphic input. Below: password strength bar — 4 neomorphic inset segments that fill left-to-right in green as password strength increases.
7. **Confirm Password field.**
8. **Terms checkbox** — custom neomorphic checkbox: a small raised square that switches to a pressed/inset state with a soft indigo checkmark when ticked.
9. **Create Account button** — full-width, accent.

---

### Screen C: Magic Link Sent

**Card content (centered vertically):**

1. **Icon area:** Large neomorphic raised circle (~80px diameter), same `--bg-base` colour, with an envelope icon in `--accent` inside. Soft raised shadow on the circle.
2. **Heading:** "Check your inbox" — 26px, weight 700.
3. **Body:** "We sent a sign-in link to **user@example.com**. It expires in 15 minutes." — 14px, `--text-secondary`.
4. **Resend link:** "Didn't receive it? Resend" — 13px, `--accent`.
5. **Back link:** "← Back to sign in" — 13px, `--text-muted`.

---

### Screen D: Forgot Password

**Card content:**

1. Firm logo / LegalForge logo.
2. **Heading:** "Reset your password" — 26px, weight 700.
3. **Body:** "Enter your email and we'll send a reset link." — 14px, `--text-secondary`.
4. **Email field** — inset neomorphic.
5. **Send Reset Link button** — full-width, accent.
6. **Back link:** "← Back to sign in".

---

### Motion Notes

- Card entrance: `opacity 0 → 1` + `translateY(8px → 0)`, 200ms ease-out.
- Input focus: smooth shadow transition, 120ms.
- Button click: inset shadow applies immediately, 80ms, releases 200ms.
- No page transitions or animations beyond the above — minimalist intent.
