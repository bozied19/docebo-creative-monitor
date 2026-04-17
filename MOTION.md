# Motion Spec — Dynamic-Word / GIF Ads

**Source of truth** for all GIF generation, rendering, and export in this
codebase. Synthesized from the B2B GIF Guidelines PDF (Version 1.0,
April 2026) with Docebo-specific placement + voice rules layered on top.

When the PDF and this doc disagree, this doc wins — the PDF is
channel-agnostic; this doc is tuned for the LinkedIn-led Docebo
campaign surface.

---

## 1 · The One-Element Rule

Only **one** element animates per variant. Everything else is perfectly
still — no background shimmer, no CTA hover pulse, no gradient drift.

This is the single rule that separates gold-standard motion from
stock-template motion. Enforced at prompt generation time and at render
time.

---

## 2 · Timing Floor (non-negotiable)

| Phase | Min | Max | Default |
|---|---|---|---|
| Hold (rest) per text state | 1800ms | 2400ms | **2000ms** |
| Transition in/out | 200ms | 320ms | **280ms** |
| Stat-pulse swell up | 400ms | 600ms | **500ms** |
| Stat-pulse settle down | 600ms | 800ms | **700ms** |
| CTA hold on loop-closing frame | 2000ms | — | **2200ms** |
| Total loop | 3500ms | 6000ms | **4800–5200ms** |

First frame gets a +400ms arrival hold (reader "lands" into the ad
before anything moves).

Asymmetric timing is the tell of professional work — exit is always
faster than entry ("whip out, ease in").

---

## 3 · Easing (never linear)

Easing is keyed to `brand_voice`:

| Voice | Curve | Feel |
|---|---|---|
| `provocateur`, `digital-rebellion` style | `cubic-bezier(0.6, 0, 0.4, 1)` | punchy |
| `trusted-advisor`, `data-as-power` style | `cubic-bezier(0.4, 0, 0.2, 1)` | refined |
| `learning-insurgent` (default), `empathetic-challenger`, `insider` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | confident swagger |

Linear is forbidden. Amateurish motion reads as "AI slop" to enterprise
buyers.

---

## 4 · Animation Strategies (pick one per variant)

### 4.1 Word-Swap

Best for: `statement`, `comparison-versus`, `pattern-interrupt`,
`curiosity-gap` hooks.

- `creative_overlay` swaps between **2–4** tonally-consistent phrases.
- Transition: outgoing text slides up 18% of its own height while
  fading (160ms ease-out); incoming text slides in from 18% below
  while fading in (260ms ease-out, offset 60ms after outgoing starts).
- Total transition envelope: 320ms.
- Everything else on canvas is frozen.

### 4.2 Stat-Pulse (breath)

Best for: `data-stat` hooks.

- `stat_value` is **always visible** at rest state (base accent color,
  100% scale, no glow).
- On pulse: scale `1.00 → 1.03`, glow swells `0 → 0 0 80px accentColor`
  over 500ms (ease-out).
- Settle: both return over 700ms (ease-in-out).
- One pulse per loop (occasionally two). Never more — crosses into
  noise.
- **Forbidden pattern**: appear/disappear. The stat never un-renders.

### 4.3 Stat-Pulse (count-up variant)

Reserved for launch/urgency ads (not default). Stat renders at "0" /
"—" on first impression, ticks to target over 800ms ease-out, then
holds the remainder of the loop (no repeat pulse).

### 4.4 Type-On

Best for: `statement`, `curiosity-gap`, `pattern-interrupt` hooks —
any place the message benefits from a "watch me say this" beat.

Loop shape (~5s):

1. **Typing** — `creative_overlay` reveals character-by-character,
   left to right. Classic thin `|` cursor in accent color trails the
   current tail.
2. **Hold (typed)** — fully-typed message holds ~1500ms with cursor
   visible.
3. **Fade out** — text + cursor fade to 0 over 400ms (ease-in-out).
   This is the "settle" beat.
4. **Reappear as complete block** — text returns instantly, no
   cursor, at full opacity (150ms quick fade-in). This final beat
   accentuates the message as a confident statement rather than
   "live typing."
5. **Hold (complete)** — ~1500ms final hold before loop restart.

No retyping on loop. The final "complete block" state is the
punchline; re-typing diminishes it.

Typing speed is voice-keyed:

| Voice | ms/char | Feel |
|---|---|---|
| `provocateur`, `digital-rebellion` | **35** | punchy |
| `trusted-advisor`, `data-as-power` | **60** | measured |
| default | **45** | confident |

Constraints:

- `creative_overlay` must fit within the typing budget. 25–40 chars
  is the sweet spot (types in 1200–1800ms at default speed).
- Over 50 chars → typing phase dominates the loop, reader fatigues.
  Enforced at prompt generation.
- Cursor does not blink — constant visible during typing + hold,
  hidden during fade + reappear. (Blink adds noise at GIF frame
  rates and bloats the palette.)

---

## 5 · Stat Placement (per base layout)

The stat never overlaps `creative_overlay`, logo, or CTA. Placement is
layout-scoped:

| Base layout | Placement |
|---|---|
| `standard` | Right third, vertical center of supporting zone (y: 55–70%, x-right aligned) |
| `wave` | Inside the navy band below the curve, right-justified above CTA row |
| `quote` | Bottom-left of quote block, replaces attribution slot |
| `cobrand` | Centered in the brand-bar gutter between the two logos |

Dead-center over the headline is **forbidden**.

---

## 6 · First-Frame Fallback (PDF §4.4, Critical Rule)

Outlook desktop, corporate firewalls, and slow connections display only
frame 1. Every GIF's frame 1 must independently answer:

1. What is this? → Docebo logo visible
2. Why should I care? → `creative_overlay` readable
3. What do I do next? → CTA visible

All four base layouts (Standard, Wave, Quote, CoBrand) already satisfy
this since logo/CTA/headline are always rendered. Word-swap's frame 1
uses the *first* `animation_frames[0].overlay_text`. Stat-pulse's
frame 1 shows the stat at rest (not pulsed).

**Never** put the CTA, logo, or headline in middle or later frames
only.

---

## 7 · Encoder Settings

| Setting | Value | Source |
|---|---|---|
| Palette | 128 colors, perceptual quantization | PDF §3.4, §8.1 |
| Dither | gifenc default (pattern); noise-dither preprocess if banding | PDF §3.4 |
| Frame count | 12–40 encoded frames per loop | PDF §3.3 |
| Sub-frame sampling (transitions) | ~80ms interval (~12 fps during motion) | Keeps total frames under budget |
| Rest frames | Single encoded frame per rest segment with full delay | Enables gifenc frame diffing |
| Loop behavior | Infinite (-1) | PDF §3.3 |

Transition sub-frames are rendered at discrete progress steps (0,
0.33, 0.66, 1.0) so the exported GIF visually matches the live preview.
Rest segments are encoded as a single frame with full duration — this
lets gifenc's frame-diff optimizer produce the smallest file.

---

## 8 · Channel / Placement Dimensions

Our ad_format taxonomy supports two GIF surfaces:

| ad_format | Dimensions | Ratio | Surface |
|---|---|---|---|
| `dynamic-word-gif-square` | 1080×1080 | 1:1 | LinkedIn/IG mobile feed, universal |
| `dynamic-word-gif-feed` | 1200×627 | 1.91:1 | LinkedIn desktop feed, email hero |

### File size targets (PDF §3.1, §7.2)

| Channel | Hard max | Target |
|---|---|---|
| LinkedIn | 5 MB | **< 2 MB** |
| Email | 1 MB | **< 500 KB** |
| GDN | 150 KB | **< 100 KB** |

If the 1080×1080 export exceeds 2 MB, reduce palette to 64 or drop the
1.03 scale-up on stat-pulse (scale causes more pixel churn than glow).

---

## 9 · Accessibility (PDF §9.1, WCAG 2.1 Level A)

- **No flashing >3Hz** — stat-pulse at our rhythm (≤1 pulse per 2s
  segment) is ~0.4Hz, well under. Verify per variant.
- **Alt text**: every GIF delivered with meaningful alt text that
  conveys the *message*, not visuals. E.g., `alt="94% completion
  rates — see how Docebo customers got there"`.
- **Text contrast**: ≥4.5:1 versus background (WCAG AA). All 12 themes
  in `ad-canvas.tsx` meet this by construction; verify for new themes.

---

## 10 · Generation Rules (for the API prompt)

When `ad_format` starts with `dynamic-word-gif`, the variant generator
must:

1. Pick exactly one `animation_strategy`, tied to `hook_type`:
   - `data-stat` → `stat-pulse`
   - `statement`, `curiosity-gap`, `pattern-interrupt` → `type-on`
   - `comparison-versus`, `identity-persona` → `word-swap`
   - Any other hook → `word-swap` (default safe)
2. Emit `animation_frames` that sum to 4000–5500ms total loop.
3. For word-swap: 2–4 frames, each with `overlay_text` set, each rest
   1800–2200ms.
4. For stat-pulse: 2 frames minimum — one rest (≥2000ms, `stat_pulse:
   false`), one pulse (1200ms total = 500ms swell + 700ms settle,
   `stat_pulse: true`). Optionally repeat once for a double-breath.
5. `stat_value` required for stat-pulse, must be a specific number
   (`94%`, `3.2x`, `$2.4M`), 2–6 characters.
6. `loop_count`: always `-1` (infinite) for ads.

---

## 11 · Common Mistakes (from PDF §13 + our shop)

- Stat "appear/disappears" instead of breathing → amateurish
- Hard-cut word-swap with no transition → template feel
- Stat dead-center over the headline → visual collision
- Hold times under 1500ms → reader can't comprehend
- Linear easing → robotic
- CTA only visible mid-loop → fails Outlook fallback
- Multiple elements animating → diluted focus, off-spec
- 256 colors when 128 would suffice → bloated file
