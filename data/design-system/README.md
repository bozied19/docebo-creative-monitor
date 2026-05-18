# Docebo Phoenix Design System

A brand & ad-creation system for **Docebo** — the AI-native learning platform. This system codifies the **2026 "Phoenix" reskin**: an italic-display, neon-on-navy, editorial-confident visual identity used across paid social, webinar banners, email headers, case studies, and event collateral.

> **What this is for:** generating on-brand ad creative, slides, webinar banners, mocks, and prototypes for Docebo. Use it to design *with* Docebo's voice and visual rules — not to design new ones.

---

## Sources

This system was reverse-engineered from three sources the user attached:

| Source | Path / URL | What we pulled from it |
|---|---|---|
| **Docebo Brand Guide** (PDF) | `uploads/Docebo Brand Guide.pdf` | Pantone-mapped palette, 6-step tonal scales, brand naming. The PDF body is image-based; only the swatch values and codes were OCR-readable (`uploads/_brand-guide-text.txt`). |
| **Figma — "2026 Phoenix Social Asset Reskin"** | mounted as VFS (read-only) — pages: `SM-Development`, `Webinar-Banners`, `Email-Headers`, `Google-Forms-Headers`, `DRIP`, `Case-Study-Frames`, `Rock-Styling`, `Type-Scales`, `Colour-Scales`, `Gradients-Rules`, `IT-Assets`, `Sandbox` | Layout grids, type ramps, gradient rules, banner formats (1080×1080, 1920×1080, 1920×600, 1600×400, 1080×1350), partner co-brand patterns, "Rock" hero shape styling. |
| **GitHub — `bozied19/docebo-creative-monitor`** | `components/creative/visual-styles.tsx`, `ad-canvas.tsx`, `refresh-engine.ts`, `tailwind.config.ts` | The 7 canonical visual styles (Neon Intelligence, Human Contrast, Rebellious Editorial, Data-as-Power, Digital Rebellion, Minimal Authority, System UI) + 12 theme presets + the Brand Voice / Hook Type taxonomy. |

---

## What Docebo is

Docebo is an **enterprise LMS** (Learning Management System). Their 2026 "Phoenix" reskin re-positions them around four ideas the brand voice keeps returning to:

1. **AI-native learning** — every product surface uses AI to personalize, recommend, and measure.
2. **Measurable ROI** — they sell to L&D leaders who need to defend training spend; stats and proof are everywhere (3.2× ROI, 94% completion, 60% faster).
3. **Enterprise scale** — proof logos like Zoom, Samsung, Pret, La-Z-Boy, Walmart appear on social-proof variants.
4. **Confident swagger, not corporate softness** — Phoenix is Docebo's deliberate move *away* from clean-tech-blue toward **italic, expanded display type, neon accents, and editorial layouts** that read more like *Wired* or *The Atlantic* than a typical SaaS brand.

The core products represented in this system are **paid-social ad units, webinar banners, email headers, case-study layouts, and event collateral** — not a product UI. There is no "app" UI kit; the UI kit in this system is a **kit of ad templates, banner layouts, and editorial slide treatments**.

---

## CONTENT FUNDAMENTALS

The Phoenix voice is **confident, declarative, and short**. It lands in 3–8-word headlines that feel italicized in attitude as well as type. Three brand voices are codified in the creative engine:

### Brand voices (3)
- **Confident Swagger** *(default — most variants)* — assertive, punchy, future-leaning. *"Train smarter. Win bigger."* Easing: ease-out cubic.
- **Provocateur** — challenges the status quo, opens with a stat or contrarian hook. *"Your LMS is lying to you."* Easing: punchy bezier `(0.6, 0, 0.4, 1)`.
- **Trusted Advisor** — measured, proof-led, exec-tier. *"60% faster onboarding. Audit-ready compliance."* Easing: refined bezier `(0.4, 0, 0.2, 1)`.

### Casing & punctuation
- **Wordmark is always lowercase**: `docebo` — never "Docebo" inside the wordmark, even sentence-initial.
- **Hero headlines are sentence case, italic display, often split across two lines** with a color shift on the final 1–2 words for emphasis: `Train smarter./Win bigger.` (white → neon pink/green/lavender). Period-terminated short sentences are common.
- **Editorial / Rebellious** layouts use **UPPERCASE** italic display for shock value.
- **Eyebrows / chrome** (above headline, on stat chips, on CTA buttons) are **MONO + UPPERCASE + 0.08em tracking**, set in IBM Plex Mono.
- **CTAs** end with a hairline arrow: `Book a demo →`, `See the data →`, `Discover how →`.
- Stats use raw numerals + units, no decoration: `94%`, `3.2x`, `60% faster`, `4.5 G2`.

### Person & vibe
- **Second person ("you", "your")** dominates — *"Your team. Your stack. One platform."*
- First-person plural ("we") only on co-brand and partnership banners — *"Together, we're rebuilding L&D."*
- Avoid "us vs them" framing; use "this vs that" instead — *"Compliance, not compliance theatre."*

### Emoji
- **No emoji in production creative.** Phoenix is post-emoji. The closest decorative symbol is a single oversized italic asterisk `*` (Rebellious Editorial) or a hairline `→` arrow.
- Emoji *do* appear in internal feedback chrome (`💎 On brand`, `🚫 Unreadable`) inside the creative-monitor tool — that's tooling, not creative.

### Specific copy examples (taken from the rendering engine + Figma)
- **Stat-led**: *"3.2x ROI. Audit-ready by design."*
- **Story-native**: *"How Pret moved 30,000 baristas to one LMS in 90 days."*
- **Social-proof**: *"Why Zoom, Samsung, and Walmart picked docebo."*
- **Provocation**: *"Your LMS is built for compliance. Ours is built for outcomes."*
- **Quote**: *"We replaced four tools and shipped onboarding in a week." — VP of Learning, Fortune 500.*
- **Co-brand**: *"docebo | partner — Discover how →"*

---

## VISUAL FOUNDATIONS

### The Phoenix system in one sentence
**Italic expanded display headlines, layered on either deep navy / midnight or warm marble-beige, accented with one of four neon spot colors (pink, green, lavender, blue), arranged in editorial asymmetric grids with mono CTAs and a lowercase wordmark.**

### Color
- **Two grounds**: navy (`#0033A0`) **or** marble-beige (`#E6DACB`). Almost every ad uses one of the two. Black/white/midnight are the variations on those grounds.
- **One accent per composition.** Neon pink, neon green (`#E3FFAB` soft / `#54FA77` vivid), neon lavender, or neon blue. Mixing two accents is reserved for Digital Rebellion (glitch) and the gradient-pink theme.
- **Gradient is rare and specific.** The only sanctioned gradient is the **Phoenix gradient**: `linear-gradient(160deg, #0057FF 0%, #7E2EE9 45%, #B627C6 100%)` — used for quote cards and a few "gradient-pink" banners. Bluish-purple gradients elsewhere are *off-brand*.
- **No drop-shadows on flat color.** Shadows only appear on cards over imagery (subtle, blurred) and as **neon glow** around accent text on dark backgrounds.

### Type
- **Display: Special Gothic Expanded One Regular** — the hero face. Always italic. Used for headlines, the wordmark, and big stats. Only one weight ships (400) — italic is achieved via CSS `font-style: italic`. Banner frames over ~250px use **Mulish Bold/ExtraBold** as a heavier display fallback.
- **Body: Figtree** — 300–900 in active use. Default body is Figtree 400/500. Logos and section heads use 700.
- **Editorial / quote: Lora Italic** — pull-quotes and rebellious-editorial sub-text only.
- **Mono: IBM Plex Mono** — CTAs, eyebrows, stat chips, browser-chrome URL bars in System UI mockups.

### Layout & grids
- **Margins:** 8–10% padding on square (1:1) ads; 6–8% on landscape banners. Headline starts at top-left or upper-center; CTA bottom-right; wordmark bottom-left.
- **Asymmetry by default.** Even on symmetric grids, one element (a thin accent rule, an oversized asterisk, a diagonal slash) breaks the grid.
- **The "Rock"** — a recurring hero shape on event banners: a stylized geometric rock/crystal silhouette, used as a focal element behind speaker portraits and event titles. Lives on `/Rock-Styling` page in Figma.
- **Diagonal slashes & clip-paths** appear as bottom-corner accents (12–14% tall, polygon-clipped) and as lime co-brand banners (top-left clip).

### Backgrounds
- **Flat color first**, no patterns or photos behind type. The dominant treatment is solid navy or solid beige.
- **Subtle grids** appear in two specific styles: a **circuit grid** (Neon Intelligence, dotted intersections, 6% opacity) and a **data grid** (Data-as-Power, 80px lines, 5% opacity).
- **Scan lines** appear only in Digital Rebellion (4px repeating, 2% opacity).
- **Photography is minimal** — when used, it's a single editorial portrait in a soft-rounded warm panel (Human Contrast). Photos are **warm, slightly desaturated, professional but not corporate-stock-blue**.
- **No hand-drawn illustrations. No 3D renders. No gradient mesh except the sanctioned Phoenix gradient.**

### Animation
- **Three sanctioned strategies for animated GIFs** (from `MOTION.md` in the engine):
  1. **word-swap** — outgoing headline slides up + fades, incoming slides up from below + fades. Outgoing 320ms, incoming 240ms (asymmetric). Per-voice easing.
  2. **stat-pulse** — a hero stat is always visible. On pulse beats it breathes: `scale 100% → 103%` + glow swell over 500ms ease-out, then settles ease-in-out.
  3. **type-on** — typewriter reveal on the hero headline, then hold, fade, reappear-as-block, hold complete. Cursor visible only during typing.
- **Transitions are 240–500ms** — never longer; never bouncy. No springs, no overshoot.
- **No looping micro-animations on static surfaces.** Stillness reads as confident.

### Hover / press / focus states (UI kit only)
- **Hover on dark surfaces:** brighten BG by 8% + accent glow ring (`box-shadow: 0 0 0 1px var(--accent)`). No color shift on text.
- **Hover on light surfaces:** darken BG to `--phx-marble-100`, no movement.
- **Press:** `transform: scale(0.98)`, no color change.
- **Focus:** 2px outline in current accent color, offset 2px. Never blue-default.
- **CTAs on dark:** outline pill, white text, no fill. On hover, fill flips to accent color.
- **CTAs on light:** filled pill in navy `#0033A0` or accent purple `#7E2EE9`, white text.

### Borders, rounding, shadows, cards
- **Radii:** 4 / 6 / 10 / 14 / 24 px and pill (999). Cards default to **10–14px**. Pills are pill. Editorial / Rebellious treatments use `radius: 0` for hard cuts.
- **Borders on dark:** 1px `rgba(255,255,255,0.10)` for cards, `0.18` for emphasis.
- **Borders on light:** 1px `rgba(0,51,160,0.18)` (navy at low alpha — never gray).
- **Shadows:** three tiers, all tinted **deep-navy** (`rgba(6, 6, 96, ...)`). No pure-black shadows. Plus four **neon glow** rings (pink/blue/green/lavender) for accent text on dark.
- **Cards** on Data-as-Power are dark, 1px translucent-white border, 4% white fill, 10–14px radius. On light layouts cards are warm-white (`--phx-marble-50`) over beige, no border, navy 8% shadow.

### Transparency & blur
- **Backdrop-blur** appears in two places: floating metric pills (`backdrop-filter: blur(8px)`) on Neon Intelligence, and modal overlays in System UI mockups.
- **Translucent fills** for chrome elements: `accent + alpha 10–15%` for soft chips, `accent + alpha 30–40%` for subtle borders.

### Imagery vibe
- **Warm-cool dichotomy:** beige/marble layouts run warm; navy/midnight layouts run cool. Never mix them in one composition.
- **No grain, no noise filter** (despite the Figma containing `NOISE` effects — those are approximations).
- **Black & white photos** appear only in long-form case study layouts on `/Case-Study-Frames`. Default is full color, professional, slightly desaturated.

### Layout invariants (rules to never break)
- **Lowercase `docebo` wordmark, always.** Never replace with the icon mark in ads.
- **Italic display headline, always.** Even on white backgrounds.
- **One accent color per composition** unless explicitly using the Phoenix gradient or Digital Rebellion glitch.
- **CTA always ends with `→`.** Always.
- **Wordmark + CTA on opposite ends of the bottom edge** on standard layouts.
- **No sentence longer than 12 words in a hero headline.** Most are 3–7.

---

## ICONOGRAPHY

Phoenix is **deliberately icon-light**. The system leans on type and color, not iconography, to do the talking. When icons appear, they're functional UI affordances — not decorative.

### What is and isn't used
- **No custom icon font** ships with the brand. The codebase pulls icons inline from a small set.
- **Lucide-style** outlined SVGs are the closest match for the few UI affordances that do appear (chevrons, arrows, info dots, magnifier, person silhouettes inside attribution). Stroke width 2, rounded line caps, 24×24 viewBox.
- **Filled glyphs** appear for status — a shield (G2 / Gartner badge), a checkmark, a lock (compliance contexts).
- **No emoji in production creative.** Emoji appear only in internal tool chrome for feedback tagging.
- **No unicode-as-icon** (no ★, ✓, ► substitutions). The only sanctioned glyph is the **typographic arrow `→`** at the end of every CTA, set in the same font as the surrounding text.
- **Partner / customer logos** are imported as their own assets (`Edflex_Logo`, `LearningTech_Logo`, `RedThread`, `365 Talents`, `FEFAUR`) — never recreated, always kept in original color and rendered at the partner brand's preferred reverse/full-color treatment. The Figma carries explicit guidance: *"By default use reverse logo. Only use full color logo if required by partner."*

### Substitutions in this system
This system uses **Lucide icons via CDN** (`unpkg.com/lucide-static`) where the original codebase used inline-SVG icons. ⚠️ **Substitution flagged** — Lucide is the closest stroke-weight + style match for the Phoenix flat-outline icon vocabulary, but the originals are hand-authored SVGs in the codebase. If pixel fidelity matters for a specific surface, copy the inline SVG out of `components/creative/visual-styles.tsx` directly.

### The Docebo wordmark / glyph
- **Wordmark** (`assets/docebo-wordmark.svg`) — lowercase `docebo`, set in Special Gothic Expanded One italic. This is **the** logo. Use everywhere.
- **Glyph mark** (`assets/docebo-glyph.svg`) — a `d` in a navy capsule. Reserved for favicons, app icons, and very small footprints (<48px) where the full wordmark would be illegible. **Never** in ad creative.

---

## Index — what's in this system

| Path | What it is |
|---|---|
| `colors_and_type.css` | All design tokens — colors, type ramps, spacing, radii, shadows, font stacks, semantic CSS variables. Import this in every Phoenix surface. |
| `assets/docebo-wordmark.svg` | The lowercase italic wordmark. `currentColor`-aware. |
| `assets/docebo-glyph.svg` | The `d`-in-capsule app-icon mark. |
| `preview/*.html` | Design system review cards — color swatches, type specimens, components, spacing, motion. |
| `ui_kits/ad-templates/` | The Phoenix Ad Template Kit — 7 canonical visual-style mockups, 12 theme presets, all the reusable elements (LogoBar, SocialProofBadge, MetricStrip, QuoteAttribution, etc.). |
| `slides/` | Phoenix slide deck templates — title, section break, big-quote, stat, comparison, agenda. |
| `SKILL.md` | Cross-compatible skill manifest for Claude Code. |
| `uploads/Docebo Brand Guide.pdf` | The original brand guide. |
| `uploads/_brand-guide-text.txt` | OCR text from the brand guide (only color codes were extractable; PDF is image-based). |

---

## Caveats & substitutions

- **Brand Guide PDF is image-based.** Only swatch values were OCR-readable; the rest of the 49-page guide is in image form. If you have the editable source, share it and I'll fold in any non-color guidance.
- **Special Gothic Expanded One** ships only Regular weight on Google Fonts. Phoenix mocks that ship "Bold" or "ExtraBold" headlines fall back to **Mulish Bold** in this system, matching how the Figma uses Mulish for the largest banner sizes.
- **Docebo wordmark vector** is composed of 6 separate vector paths in Figma; no single clean SVG export was available. The wordmark in `assets/` is set in Special Gothic Expanded One italic — visually identical to the rendered Figma version. **If you have the official SVG, drop it in and replace `assets/docebo-wordmark.svg`.**
- **Lucide CDN** is substituted for the inline-SVG icon set in the creative-monitor codebase. Stroke weight + style match; pixel fidelity is close but not exact.
- **Partner logos** (Zoom, Samsung, Pret, La-Z-Boy, Walmart, Edflex, FEFAUR, 365 Talents, LearningTech UK, RedThread) are referenced by name only — ship the original SVGs from the partner brand kit when producing real co-brand creative.
