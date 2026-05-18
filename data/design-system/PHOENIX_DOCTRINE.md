# Phoenix Ad System — Current Doctrine

**Audience:** Docebo brand creative director.
**Purpose:** A complete picture of what the Creative Monitor currently believes about Phoenix — voice rules, color rules, the 10 ad templates that ship today, the routing logic that decides which template a variant gets, and the automated scoring gates that block off-brand work. Read this end-to-end, then mark it up. Anything you change here changes the system.

**Status as of:** 2026-05-15, branch `feat/phoenix-render`.

---

## How to read this document

The Creative Monitor generates Docebo ad variants through a fixed pipeline:

1. The model proposes a **variant** (headline, subtext, CTA, optional stat, partner, visual style).
2. A **theme** (background + accent palette) is selected for the variant.
3. The renderer maps the variant's `visual_style` to one of **10 templates** below, picks the right palette, and renders a 1080×1080 banner.
4. A **scorer** runs against the variant text and rejects anything that breaks the brand invariants.

This doc walks through each of those layers so you can mark up rules at the layer that owns them.

---

## 1 · Brand foundations (what the system believes Phoenix *is*)

These rules are the source of truth in [data/design-system/README.md](README.md). They are quoted verbatim where possible so you can mark up the actual text the system reads.

### 1.1 The Phoenix system in one sentence
> Italic expanded display headlines, layered on either deep navy / midnight or warm marble-beige, accented with one of four neon spot colors (pink, green, lavender, blue), arranged in editorial asymmetric grids with mono CTAs and a lowercase wordmark.

### 1.2 Voice (3 codified voices)

| Voice | When | Example |
|---|---|---|
| **Confident Swagger** *(default)* | Most variants | "Train smarter. Win bigger." |
| **Provocateur** | Stat-led / contrarian hooks | "Your LMS is lying to you." |
| **Trusted Advisor** | Exec-tier, proof-led | "60% faster onboarding. Audit-ready compliance." |

### 1.3 Layout invariants (rules the system will not break)
- **Lowercase `docebo` wordmark, always.** Never the icon mark in ads.
- **Italic display headline, always.** Even on white backgrounds.
- **One accent color per composition** (pink / green / lavender / blue). Mixing accents is reserved for the sanctioned Phoenix gradient and Digital Rebellion glitch.
- **CTA always ends with `→`.** The arrow is auto-appended by the renderer; copy should not include it.
- **Wordmark + CTA on opposite ends of the bottom edge** on standard layouts.
- **No emoji in production creative.** The only sanctioned glyph is the typographic arrow `→`.
- **Headlines are sentence case, 3–8 words.** UPPERCASE is reserved for Rebellious Editorial.
- **Mono eyebrow above headline:** IBM Plex Mono, 0.08em+ tracking, uppercase.
- **No sentence longer than 12 words in a hero headline.** Most are 3–7.

### 1.4 Color

| Token | Hex | Role |
|---|---|---|
| Navy ground | `#0033A0` | One of two brand grounds |
| Deep navy / midnight | `#06065D` | Dark text on light, dark card surface |
| Marble beige | `#E6DACB` | The other brand ground |
| Marble beige (warmer) | `#EBE6DD` | "Before" comparison card |
| Neon pink | `#FF5DD8` | Accent (most common) |
| Neon green (soft) | `#E3FFAB` | Accent |
| Neon green (vivid) | `#54FA77` | Accent (data-as-power default) |
| Neon lavender | `#DCB7FF` | Accent |
| Phoenix purple | `#7E2EE9` | Solid CTA fill on light |
| Sanctioned gradient | `linear-gradient(160deg, #0057FF 0%, #7E2EE9 45%, #B627C6 100%)` | Quote template only |

**Rule:** No drop shadows on flat color. Shadows only as **neon glow** around accent text on dark backgrounds.

### 1.5 Type

| Role | Family | Notes |
|---|---|---|
| Display (hero, wordmark, big stats) | **Special Gothic Expanded One Regular** — italic | Only Regular weight ships from Google Fonts. Italic via CSS `font-style: italic`. |
| Display fallback (largest banner sizes) | Mulish Bold / ExtraBold | Used in Figma for >250px frames. **Currently unused in this renderer** — flagged in §5. |
| Body | Figtree | 300–900 in active use; default 400/500. |
| Editorial / pull-quote | Lora Italic | Used in Rebellious Editorial sub-text and Quote template. |
| Mono (CTAs, eyebrows, stat chips) | IBM Plex Mono | Tracking ≥0.08em, uppercase. |

### 1.6 Casing & punctuation
- Wordmark is **always lowercase**: `docebo` — never "Docebo" inside the wordmark, even sentence-initial.
- Hero headlines are sentence case, italic display, often split across two lines with a color shift on the final 1–2 words.
- Eyebrows / chrome / stat chips: **MONO + UPPERCASE + 0.08em tracking**.
- Stats use raw numerals + units, no decoration: `94%`, `3.2x`, `60% faster`.
- Second person (`you`, `your`) dominates. First-person plural (`we`) only on co-brand.

---

## 2 · The 10 templates as built

Every template renders to a fixed **1080×1080 art board** that the page scales down to fit. All templates share the same shared elements:

- **Wordmark** — top-left, official Docebo SVG (no substitution).
- **Hero headline** — Special Gothic Expanded One italic.
- **PillCTA** — pill-shape, auto-appends `→`. Six modes: `outline-light`, `outline-dark`, `solid-pink` (`#FF5DD8`), `solid-green` (`#E3FFAB`), `solid-navy` (`#0033A0`), `solid-purple` (`#7E2EE9`).
- **Rock** — the recurring crystal/rock silhouette from the Figma `/Rock-Styling` page. Used as a focal hero shape.

For each template below: the intent, the default palette, the headline-size tiers (the renderer auto-shrinks the headline based on character count), and which `visual_style` keys can route to it.

---

### 1. Navy hero — `webinar` → `WebinarNavyPink`
**Intent:** Webinar / event banner. Big italic hero on navy with the rock filling the right edge in pink.
**Default palette:** bg `#06065D` · fg white · accent `#FF5DD8` (neon pink) · *dark*
**Layout:** Wordmark TL · headline left-aligned at y=280 in a 540px column · rock right edge (-180px offset) · CTA bottom-left, **outline pill**.
**Headline size tiers:** ≤18 chars → 96px · ≤32 → 76 · ≤45 → 60 · >45 → 50.
**Background texture:** 40px radial dot grid at 6% opacity (dark) / 5% (light).
**Default CTA:** `Register now`.
**Routes from:** `neon-intelligence`, `system-ui`.

---

### 2. Beige slash — `speakers` → `DULiveSpeakers`
**Intent:** Light-ground hero with a diagonal accent slash anchoring the bottom-left. Roomy headline (full 900px width).
**Default palette:** bg `#E6DACB` · fg `#06065D` · accent `#E3FFAB` (soft green) · *light*
**Layout:** Wordmark TL · headline at y=240 in a 900px column · diagonal accent slash (clip-path polygon, 720×220) anchored bottom-left · CTA bottom-right, **solid-navy**.
**Headline size tiers:** ≤18 → 110 · ≤32 → 92 · ≤45 → 72 · >45 → 60.
**Default CTA:** `Discover how`.
**Routes from:** `human-contrast`.

---

### 3. Data — big stat — `data` → `DataAsPower`
**Intent:** "Data is the hero." A 320px italic stat at the top of the composition with the headline as a smaller supporting line below.
**Default palette:** bg `#131E29` · fg white · accent `#54FA77` (vivid green) · *dark*
**Layout:** 80px line grid at 4% opacity · wordmark TL · stat (320px) at y=240 in accent color with neon glow on dark · supporting headline below at y≈540 · subtext below that · CTA bottom-right.
**Headline size tiers:** ≤18 → 64 · ≤32 → 52 · ≤45 → 42 · >45 → 36.
**Stat handling:** Uses `stat_value` from the variant. If absent, regex-extracts a stat (`\d+(\.\d+)?(x|%)`) from the headline. Falls back to `94%`.
**Default CTA:** `See the data`.
**Routes from:** `data-as-power`.

---

### 4. Rebellious editorial — `rebel` → `RebelliousEditorial`
**Intent:** UPPERCASE italic headline + giant decorative asterisk. Editorial / shock-value layout. Lora italic for sub-text.
**Default palette:** bg `#131E29` · fg white · accent `#FF5DD8` · *dark*
**Layout:** Wordmark TL · 320px italic asterisk top-right in accent · UPPERCASE italic headline at y=300 in a 920px column · subtext (Lora Italic, 38px) at y=bottom-200 · CTA bottom-right.
**Headline size tiers:** ≤18 → 110 · ≤32 → 88 · ≤45 → 68 · >45 → 56.
**Default CTA:** `Read the truth`.
**Routes from:** `rebellious-editorial`, `digital-rebellion`.

---

### 5. Co-brand — `cobrand` → `CoBrandPartner`
**Intent:** Light-ground partnership lockup. Wordmark + 1px navy divider + partner name in the top bar.
**Default palette:** bg `#E6DACB` · fg `#06065D` · accent `#FF5DD8` · *light*
**Layout:** Wordmark + divider + partner name at TL · rock right edge (-180px offset) in pink · headline at y=280 in a 540px column · CTA bottom-left, **solid-navy**.
**Headline size tiers:** ≤18 → 96 · ≤32 → 76 · ≤45 → 60 · >45 → 50.
**Default CTA:** `Discover how`.
**Routes from:** Any variant where the **theme layout is `cobrand`** — this overrides the visual_style routing entirely.
**Known limitation:** Partner is text-only. No partner-logo support yet (see §5).

---

### 6. Minimal hero — `title` → `PhoenixTitle`
**Intent:** Quietest, most editorial hero. Rock floats top-right at 620×620, headline drops lower (y=380) in a 900px column. Reads like a long-form report cover.
**Default palette:** bg `#06065D` · fg white · accent `#FF5DD8` · *dark*
**Layout:** Radial dot grid · wordmark TL · rock TR at -100, -80 offset · headline at y=380 · CTA bottom-left, **outline pill on dark**, **solid-navy on light**.
**Headline size tiers:** ≤18 → 120 · ≤32 → 92 · ≤45 → 72 · >45 → 60.
**Default CTA:** `Read the report`.
**Routes from:** `neon-intelligence`, `minimal-authority`.

---

### 7. Gradient testimonial — `quote` → `PhoenixQuote`
**Intent:** Pull-quote on the sanctioned Phoenix gradient. Lora Italic body, oversized open-quote glyph.
**Palette:** **Always** the sanctioned gradient (`#0057FF → #7E2EE9 → #B627C6`). White text. **Ignores variant theme entirely.**
**Layout:** Wordmark TL in white · giant translucent open-quote at y=220 · Lora italic quote at y=360 in a 920px column · attribution (Figtree 700, 28px) at y=bottom-200 · CTA bottom-right, always **outline-light**.
**Headline size tiers:** ≤18 → 76 · ≤32 → 60 · >32 → 46 (no xlong tier).
**Default CTA:** `Read the story`.
**Routes from:** `rebellious-editorial`.
**Note:** The attribution sits in `subtext`. Quote layouts treat subtext as the citation, not a supporting line.

---

### 8. Stat — alternate — `stat` → `PhoenixStat`
**Intent:** Stat-first version of #3 — the stat is **even larger** (420px) and sits high; the supporting label drops to y=700 in display italic. Different rhythm from DataAsPower (which leads with stat then has a headline + subtext stack).
**Default palette:** bg `#131E29` · fg white · accent `#54FA77` · *dark*
**Layout:** 80px line grid · wordmark TL · 420px italic stat at y=200 with strong neon glow · italic display label at y=700 in 920px column · subtext (26px Figtree) bottom-left · CTA bottom-right.
**Headline size tiers:** ≤18 → 84 · ≤32 → 64 · >32 → 48 (no xlong tier).
**Stat handling:** Same as DataAsPower (`stat_value` → regex extract → `94%` fallback).
**Default CTA:** `See the data`.
**Routes from:** `data-as-power`.

---

### 9. This / not that — `comparison` → `PhoenixComparison`
**Intent:** Side-by-side "before vs. with docebo" two-card comparison. Forces the "this not that" framing the brand voice prefers.
**Default palette:** bg white · fg `#06065D` · accent `#FF5DD8` · *light*
**Layout:** Wordmark TL · italic display label "This, not that." at y=180 · **before card** at y=340 (warm beige `#EBE6DD` on light, white-04 on dark) · **with-docebo card** at y=600 (always navy `#06065D` with white text) · subtext bottom-left · CTA bottom-right.
**Card structure:** Mono eyebrow ("— BEFORE" / "— WITH DOCEBO") + display italic 52px statement.
**Headline parsing:** Splits the headline on " vs ", " not ", " — ", or ". " to get before/after halves. Falls back to splitting at the midpoint at the nearest space.
**Default CTA:** `See the difference`.
**Routes from:** `human-contrast`, `system-ui`.

---

### 10. Punchline — `cta` → `PhoenixCTA`
**Intent:** Maximum hero — biggest headline tier in the system (140px on short copy). Rock anchors bottom-right corner, CTA pill is bigger (size=26).
**Default palette:** bg `#06065D` · fg white · accent `#E3FFAB` · *dark*
**Layout:** Wordmark TL · headline at y=320 in 820px column · rock anchored bottom-right (-120, -120 offset) · CTA bottom-left at size=26 (vs. default 22).
**Headline size tiers:** ≤18 → 140 · ≤32 → 108 · ≤45 → 80 · >45 → 66.
**Default CTA:** `Book a demo`.
**Routes from:** `neon-intelligence`, `digital-rebellion`.

---

## 3 · Routing rules (which template a variant gets)

A variant carries a `visual_style` field. The renderer maps it to a list of compatible templates. The **first** template in the list is rendered by default; the audition mode in the UI cycles through the list.

| visual_style | Compatible templates (in audition order) |
|---|---|
| `neon-intelligence` | Navy hero · Minimal hero · Punchline |
| `human-contrast` | Beige slash · This / not that |
| `rebellious-editorial` | Rebellious editorial · Gradient testimonial |
| `data-as-power` | Data — big stat · Stat — alternate |
| `digital-rebellion` | Rebellious editorial · Punchline |
| `minimal-authority` | Co-brand · Minimal hero |
| `system-ui` | Navy hero · This / not that |

### Overrides
- **Co-brand overrides everything.** If the theme layout is `cobrand`, the variant always renders in the Co-brand template regardless of `visual_style`.
- **Quote ignores theme.** The Gradient testimonial template always uses the sanctioned Phoenix gradient and white text.
- **Tone mismatch falls back to defaults.** If a variant's theme is light but the chosen template is dark (or vice versa), the renderer ignores the theme palette and uses the template's default palette. This prevents (e.g.) a beige headline on a beige background. The director should know: the system would rather render a *safe* palette than the *requested* one when they conflict.

### Light backgrounds the system recognizes as "light"
`#FFFFFF`, `#FFF`, `#E6DACB`, `#EBE6DD`, `#F6F5F2`. Anything else is treated as dark.

---

## 4 · Automated scorer rules

Every variant is scored before it can render. Threshold to pass: **score ≥ 7 out of 10**. Each issue subtracts:

- **Error:** −2
- **Warning:** −1
- **Info:** −0.5

### Rules currently checked

| # | Rule | Severity | Trigger |
|---|---|---|---|
| 1 | Headline fit | Error / Warning | Predicts line count given the template's content-box width and font-size tier. >4 lines = error; >3 = warning. |
| 2 | Headline word count | Error | >12 words. |
| 2 | Headline word count | Warning | 9–12 words ("Phoenix prefers 3–8"). |
| 2 | Headline word count | Info | <2 words. |
| 3 | Subtext length | Warning | >140 characters. |
| 4 | CTA length | Warning | >24 characters ("≤24 fits the pill cleanly"). |
| 4 | CTA punctuation | Warning | CTA ends in a period (the `→` is auto-appended). |
| 4 | CTA emoji | Error | Any emoji in CTA. |
| 5 | Headline emoji | Error | Any emoji in headline. |
| 5 | Subtext emoji | Error | Any emoji in subtext. |
| 5 | Capitalized "Docebo" | Warning | "Docebo" appears anywhere in headline or subtext (wordmark must be lowercase). |
| 6 | Stat present (DataAsPower only) | Warning | No `stat_value` and no regex-extractable stat. |

### Headline fit details (per template)

| Template family | Content-box width | Headline size tiers used by scorer |
|---|---|---|
| Data — big stat / Stat / Rebellious editorial | 920px | 110 / 88 / 68 / 56 |
| Beige slash | 900px | 110 / 92 / 72 / 60 |
| Navy hero / Minimal hero / Co-brand / Punchline | 540px | 96 / 76 / 60 / 50 |

The scorer estimates Special Gothic Expanded italic at **0.55× font-size per character** (spaces ~0.3×). It's accurate to ~10% — close enough to predict line wrapping, not pixel-perfect.

---

## 5 · Known gaps & open questions

These are things noticed during recon. They are open questions for the director, not resolved decisions.

1. **Special Gothic Expanded ships only Regular weight.** Phoenix Figma uses heavier weights on the largest banner sizes (Mulish Bold/ExtraBold per the README) — this renderer does not currently swap fonts at any size threshold. **Question:** should it?
2. **Partner logos are text-only.** The Co-brand template renders partner names as Figtree 700, not as their official SVG. The README explicitly says: *"By default use reverse logo. Only use full color logo if required by partner."* **Question:** is text-only OK for the monitor, or do we need partner-SVG ingestion?
3. **No animated motion.** The README documents three motion strategies (`word-swap`, `stat-pulse`, `type-on`). The Phoenix renderer here is currently static — animations live in a separate GIF pipeline. **Question:** is the static doctrine the right place for motion rules, or do they live elsewhere?
4. **Quote template ignores theme.** This is intentional (gradient is sanctioned only here) but worth flagging — there is no way to tune the quote palette per-variant.
5. **Tone-mismatch fallback is silent.** When a theme conflicts with a template's tone (light vs. dark), the system silently uses the template default. The variant author has no signal that their theme was overridden. **Question:** should this surface as a scorer warning?
6. **Scorer does not enforce wordmark size, CTA position, or grid asymmetry.** It enforces *copy* — not *layout*. Layout invariants are enforced by the templates being hard-coded. **Question:** is that the right separation, or should the scorer also check things the templates can't see (e.g., subtext+CTA together exceeding the safe area)?
7. **No "neon glow" rule for accent text.** The README calls for neon glow as the only sanctioned shadow on dark backgrounds. Currently glow is applied only on big stats (DataAsPower, Stat) — not on headline accent words. **Question:** extend to headline accent spans?
8. **The "headline accent split" pattern is unused.** The README's voice section says headlines often shift color on the final 1–2 words ("Train smarter./*Win bigger*."). The `HeroHeadline` component supports an `accent` prop for this — but no template currently uses it. **Question:** wire this into one or more templates as a default behavior?
9. **No "Rock" alternative shapes.** The Rock SVG is one fixed silhouette. Figma's `/Rock-Styling` page has variations.
10. **Iconography.** The README says Phoenix is icon-light; the templates use no icons at all. There is no `Icon` component shipped. **Question:** is "no icons in ads" the right read?

---

## 6 · How to give feedback

The cleanest way to mark this up depends on where the change lives:

- **Brand foundations (§1)** → edit [data/design-system/README.md](README.md) directly. That file is the source of truth; this doc is summarized from it.
- **Template behavior (§2)** → mark up this doc inline. Each template has named props (palette colors, headline-size tiers, default CTA, layout offsets) that map 1:1 to the implementation in [components/creative/phoenix/Templates.tsx](../../components/creative/phoenix/Templates.tsx).
- **Routing rules (§3)** → mark up the table in this doc. The mapping lives in [components/creative/phoenix/PhoenixRenderer.tsx](../../components/creative/phoenix/PhoenixRenderer.tsx).
- **Scorer rules (§4)** → mark up the table. Each row maps to a rule block in [components/creative/phoenix/score.ts](../../components/creative/phoenix/score.ts) — including the threshold (currently 7) and the severity weights (−2 / −1 / −0.5).
- **Open questions (§5)** → answer inline. Anything you green-light becomes a follow-up plan.

Suggested format: track-changes / inline comments in this file. We can also accept annotated screenshots if it's easier to point at pixels, but specifying *which template* and *which color value* will get the change made fastest.
