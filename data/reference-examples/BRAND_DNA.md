# Docebo Brand DNA — Reference for AI Image Generation

This file is read on every AI render call and prepended to the per-variant
image prompt. It captures the brand system observed across the approved
reference ads. Update this file when the brand evolves; do NOT inline this
content into prompts elsewhere.

## Palette (HEX, in priority order)

Primary backgrounds:
- Deep purple violet `#5B17C8`
- Royal purple `#7E2EE9`
- Deep navy `#0B1545`
- Midnight `#131E29`
- Purple-to-violet gradients (top-left lighter, bottom-right deeper)

Primary accents (use ONE per ad, never both at full saturation):
- Lime green `#E3FFAB` (subtle, for one-word emphasis or stat fills)
- Hot pink / magenta `#FF5DD8` (for headline accents, ring graphics)

CTA pill fill (when present):
- Bright neon green `#54FA77` with dark navy text `#131E29`

Wordmark color:
- Always pure white `#FFFFFF` for the docebo lockup.

## Typography

Headlines: Heavy condensed grotesk display face, bold weight, slight italic
optional. Looks like Special Gothic Expanded / Druk Wide / similar. Tight
line-height (~0.95). All-lowercase OR sentence-case only, never all-caps for
body headlines.

Body / supporting text: Clean modern sans (Figtree-like). Weight 400-500.

CTA pill text: Uppercase, letter-spaced, mono-flavored or condensed sans.

One-word color emphasis is a signature move: a single key word in the
headline is set in lime green while the rest is white. Pick the most loaded
word (the verb or the payoff noun). Example: "Your AI investment has an
[impact] problem" with "impact" in lime.

## Wordmark Rules

- Always lowercase "docebo" wordmark, white.
- Always in a corner (top-left, top-right, bottom-left, or bottom-right).
- Never larger than ~10% of canvas width.
- Never centered, never tilted, never recolored.
- Always present on every ad (no exceptions).

## Composition Patterns (5 archetypes from reference set)

1. **Stat ring** — purple gradient bg, large pink/magenta circular ring
   graphic with one lighter "completed" segment, huge lime stat number
   (e.g. "85%") centered inside the ring, white explainer caption below
   the number, wordmark bottom-right.

2. **Photo + translucent panel** — real human photography (mid-shot,
   diverse professionals, candid not posed), purple semi-transparent
   rectangle covering bottom-left ~60% of frame, huge white headline
   inside the panel with one-word lime accent, wordmark top-left.

3. **Split-pane product UI** — left half is dark navy with a large lime
   headline, right half (or right ~45%) shows a clean product UI card
   floating on the navy background (rounded corners, soft drop shadow),
   wordmark bottom-left.

4. **Co-brand / partnership** — dark navy or deep purple bg, partner
   lockup centered top with "BETTER TOGETHER" or similar tagline below,
   huge white headline center, neon-green pill CTA with arrow at bottom.

5. **Newsletter / subscribe** — dark navy bg, hot pink gradient or solid
   pink wordmark-style headline ("Latest in Learning"), white subtext,
   blue-to-pink gradient curved corner shape with white "Subscribe →"
   pill, wordmark top-left.

## Photography Direction (when archetype 2 is used)

- Real humans, not stock-feeling. Diverse: mix of ethnicities, ages 25-45,
  modern professional dress.
- Mid-shots and over-shoulder framing. Slight depth-of-field blur.
- Warm office or co-working light, not corporate fluorescent.
- Candid expressions: thinking, talking, problem-solving. NOT smiling
  at the camera. NOT shaking hands. NOT pointing at laptops.

## Anti-patterns (NEVER do these)

- No stock-photo cliches: handshakes, tilted laptops, holographic data
  hovering over cupped hands, lens flares, gear icons.
- No drop-shadow on text. No outer glow on text.
- No gradient-on-text fills (text is always solid white, lime, or pink).
- No skewed/3D type. Never warp or distort the headline.
- No center-aligned headlines longer than 5 words. Long headlines are
  left-aligned only.
- No "AI-tell" punctuation in rendered text: em-dashes (—), en-dashes
  (–) are forbidden inside the image. Use periods, commas, colons.
- No more than 2 colors in any single ad besides white + bg.
- Never put the wordmark on top of a face or important detail.
