# Reference Examples

Drop approved Docebo ad creatives in this folder. The render-image API will
auto-discover them and pass up to 4 of them as reference images to Gemini
2.5 Flash Image so generated mockups inherit the brand style.

## Naming convention

`{archetype}__{visual-style}.{png,jpg,jpeg}`

Where `archetype` is one of:
- `stat-ring`
- `photo-panel`
- `split-ui`
- `cobrand`
- `newsletter`
- `minimal`

And `visual-style` matches the 7-style taxonomy used in the system
(neon-intelligence, human-contrast, rebellious-editorial, data-as-power,
digital-rebellion, minimal-authority, system-ui).

Examples:
- `stat-ring__data-as-power.png`
- `photo-panel__human-contrast.jpg`
- `split-ui__system-ui.png`
- `cobrand__minimal-authority.png`
- `newsletter__rebellious-editorial.jpg`

## How references are selected at render time

The `/api/creative/render-image` endpoint picks reference images using a
two-tier match:

1. **Exact visual-style match** — files whose name contains the variant's
   `visual_style`. Up to 4 selected.
2. **Fallback** — if no exact matches, pick up to 4 files whose archetype
   prefix best matches the variant's composition cues (stat-pulse →
   stat-ring, photo-led → photo-panel, etc.).

Files are read fresh on each request (no build-time caching) so you can
iterate on the reference set without restarting the dev server.

## Size guidance

- 1080x1080 minimum for square ads
- 1200x628 minimum for feed/banner ads
- PNG or JPEG, under 5 MB each

## Brand DNA

`BRAND_DNA.md` in this folder is the textual style guide. It is always
included in the prompt regardless of which images are selected.
