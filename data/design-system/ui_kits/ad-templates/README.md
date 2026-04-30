# Phoenix Ad Template Kit

Five canonical Phoenix banner layouts, all 1920×1080 (the dominant ad size in the Figma file). Edit by passing props.

## Files

- `PhoenixBanner.jsx` — building blocks: `Wordmark`, `Eyebrow`, `HeroHeadline`, `PillCTA`, `Rock`, `SpeakerCard`, `Stat`, `LogoBar`, `DateChip`, `phoenixGradient`.
- `Templates.jsx` — five canonical compositions:
  - `WebinarNavyPink` — the dominant Phoenix layout (deep navy + pink "rock")
  - `DULiveSpeakers` — beige event banner with up to 3 speaker rows
  - `DataAsPower` — midnight + lime, oversized italic stat
  - `RebelliousEditorial` — marble black, uppercase italic, oversized `*`
  - `CoBrandPartner` — beige + partner lockup
- `index.html` — preview gallery at ⅔ scale.

## Usage

```jsx
<WebinarNavyPink
  title="What's new in Docebo"
  subtitle="February 2026"
  date="Feb 12, 2026"
  time="10:00 – 11:00 AM EST"
/>
```

All templates are absolute-positioned within a 1920×1080 art board. Wrap in a scaled container for any other size.

## What this kit *isn't*

This is an **ad / banner / event collateral kit**, not a product UI kit. Docebo's actual LMS application UI is **not** in the source Figma file — that file is the marketing reskin only. If you need the LMS UI, that's a separate ask.
