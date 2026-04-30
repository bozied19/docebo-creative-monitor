---
name: docebo-phoenix-design
description: Use this skill to generate well-branded interfaces and assets for Docebo's 2026 "Phoenix" brand reskin — paid social ads, webinar banners, email headers, case studies, slide decks, and editorial layouts. Contains essential design guidelines (italic Special Gothic Expanded display, navy + neon palette, mono CTAs, lowercase wordmark), colors, type, fonts, brand assets, and a Phoenix Ad Template Kit.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, banners, ads, etc), copy assets out and create static HTML files for the user to view. Always import `colors_and_type.css` from the skill root and use the design tokens — do not invent new colors, type sizes, or spacing values.

Phoenix has strict invariants — review them before producing creative:
1. Lowercase `docebo` wordmark, always (never "Docebo" inside the wordmark).
2. Italic Special Gothic Expanded One headlines, always — even on white backgrounds.
3. One accent color per composition (pink / green / lavender / blue), unless explicitly using the sanctioned Phoenix gradient or Digital Rebellion glitch.
4. CTAs always end with `→`.
5. Wordmark + CTA on opposite ends of the bottom edge on standard layouts.
6. No emoji in production creative. The only sanctioned glyph is the typographic arrow.
7. Headlines are sentence case, 3–8 words. UPPERCASE only for Rebellious Editorial.
8. Mono eyebrow above headline, IBM Plex Mono, 0.08em+ tracking, uppercase.

If working on production code, you can copy assets and read the rules in `README.md` to become an expert in designing with this brand. The `ui_kits/ad-templates/` folder contains five canonical, prop-driven banner layouts you can compose.

If the user invokes this skill without any other guidance, ask them what they want to build or design (slide deck? webinar banner? case study layout? email header?), what voice (Confident Swagger / Provocateur / Trusted Advisor), what accent color, then produce HTML artifacts. Act as an expert designer — Phoenix is editorial, confident, and post-emoji; reflect that in both copy and layout.
