"use client";

import type { Ref } from "react";
import type { Variant } from "../refresh-engine";
import type { ThemeConfig } from "../ad-canvas";
import {
  CoBrandPartner,
  DataAsPower,
  DULiveSpeakers,
  PhoenixCTA,
  PhoenixComparison,
  PhoenixQuote,
  PhoenixStat,
  PhoenixTitle,
  RebelliousEditorial,
  WebinarNavyPink,
  type PhoenixTemplateProps,
  type TemplatePalette,
} from "./Templates";

export type TemplateKey =
  | "webinar"
  | "speakers"
  | "data"
  | "rebel"
  | "cobrand"
  | "title"
  | "quote"
  | "stat"
  | "comparison"
  | "cta";

type TemplateComponent = (props: PhoenixTemplateProps) => React.ReactElement;

const TEMPLATES: Record<TemplateKey, TemplateComponent> = {
  webinar: WebinarNavyPink,
  speakers: DULiveSpeakers,
  data: DataAsPower,
  rebel: RebelliousEditorial,
  cobrand: CoBrandPartner,
  title: PhoenixTitle,
  quote: PhoenixQuote,
  stat: PhoenixStat,
  comparison: PhoenixComparison,
  cta: PhoenixCTA,
};

/* Friendly names for the audition button label. */
export const TEMPLATE_LABEL: Record<TemplateKey, string> = {
  webinar: "Navy hero",
  speakers: "Beige slash",
  data: "Data — big stat",
  rebel: "Rebellious editorial",
  cobrand: "Co-brand",
  title: "Minimal hero",
  quote: "Gradient testimonial",
  stat: "Stat — alternate",
  comparison: "This / not that",
  cta: "Punchline",
};

type Tone = "dark" | "light" | "gradient";

const TEMPLATE_TONE: Record<TemplateKey, Tone> = {
  webinar: "dark",
  speakers: "light",
  data: "dark",
  rebel: "dark",
  cobrand: "light",
  title: "dark",
  quote: "gradient",
  stat: "dark",
  comparison: "light",
  cta: "dark",
};

const DEFAULT_PALETTE: Record<TemplateKey, TemplatePalette> = {
  webinar:    { bg: "#06065D", fg: "#FFFFFF", fgMuted: "rgba(255,255,255,0.78)", accent: "#FF5DD8", bgIsDark: true },
  speakers:   { bg: "#E6DACB", fg: "#06065D", fgMuted: "rgba(6,6,93,0.78)",      accent: "#E3FFAB", bgIsDark: false },
  data:       { bg: "#131E29", fg: "#FFFFFF", fgMuted: "rgba(255,255,255,0.75)", accent: "#54FA77", bgIsDark: true },
  rebel:      { bg: "#131E29", fg: "#FFFFFF", fgMuted: "rgba(255,255,255,0.78)", accent: "#FF5DD8", bgIsDark: true },
  cobrand:    { bg: "#E6DACB", fg: "#06065D", fgMuted: "rgba(6,6,93,0.78)",      accent: "#FF5DD8", bgIsDark: false },
  title:      { bg: "#06065D", fg: "#FFFFFF", fgMuted: "rgba(255,255,255,0.78)", accent: "#FF5DD8", bgIsDark: true },
  quote:      { bg: "gradient",  fg: "#FFFFFF", fgMuted: "rgba(255,255,255,0.78)", accent: "#FFFFFF", bgIsDark: true },
  stat:       { bg: "#131E29", fg: "#FFFFFF", fgMuted: "rgba(255,255,255,0.75)", accent: "#54FA77", bgIsDark: true },
  comparison: { bg: "#FFFFFF", fg: "#06065D", fgMuted: "rgba(6,6,93,0.7)",       accent: "#FF5DD8", bgIsDark: false },
  cta:        { bg: "#06065D", fg: "#FFFFFF", fgMuted: "rgba(255,255,255,0.78)", accent: "#E3FFAB", bgIsDark: true },
};

const LIGHT_BG_HEXES = new Set(["#FFFFFF", "#FFF", "#E6DACB", "#EBE6DD", "#F6F5F2"]);

function themeTone(theme: ThemeConfig): Tone {
  if (theme.bgGradient) return "gradient";
  return LIGHT_BG_HEXES.has(theme.bg.toUpperCase()) ? "light" : "dark";
}

/* Build a palette for the given template by overlaying the theme on top
   of the template's defaults — but only when the tones match. Mismatched
   themes (e.g. light theme on dark template) fall back to defaults. */
function paletteFor(key: TemplateKey, theme: ThemeConfig): TemplatePalette {
  const def = DEFAULT_PALETTE[key];
  if (key === "quote") return def; // gradient template ignores theme
  const tone = TEMPLATE_TONE[key];
  if (themeTone(theme) !== tone) return def;
  return {
    bg: theme.bg,
    fg: theme.headlineColor,
    fgMuted: theme.subColor,
    accent: theme.accentColor,
    bgIsDark: tone === "dark",
  };
}

/* Which templates can render a given visual_style? Order = audition cycle.
   Cobrand themes always force the cobrand template regardless. */
const COMPATIBLE: Record<string, TemplateKey[]> = {
  "neon-intelligence":    ["webinar", "title", "cta"],
  "human-contrast":       ["speakers", "comparison"],
  "rebellious-editorial": ["rebel", "quote"],
  "data-as-power":        ["data", "stat"],
  "digital-rebellion":    ["rebel", "cta"],
  "minimal-authority":    ["cobrand", "title"],
  "system-ui":            ["webinar", "comparison"],
};

export function compatibleTemplatesFor(
  variant: Variant,
  theme: ThemeConfig,
): TemplateKey[] {
  if (theme.layout === "cobrand") return ["cobrand"];
  return COMPATIBLE[variant.visual_style] ?? ["webinar"];
}

interface PhoenixRendererProps {
  variant: Variant;
  theme: ThemeConfig;
  /** Index into the compatible-templates list. Wraps. Defaults to 0. */
  templateIndex?: number;
  mockupRef?: Ref<HTMLDivElement>;
}

function buildBaseProps(variant: Variant): Omit<PhoenixTemplateProps, "palette"> {
  const frameZero = variant.animation_frames?.[0];
  return {
    overlay: frameZero?.overlay_text || variant.creative_overlay,
    subtext: variant.overlay_subtext,
    cta: variant.cta_text,
    stat: frameZero?.stat_value || variant.stat_value,
  };
}

function buildCardProps(
  variant: Variant,
  card: NonNullable<Variant["cards"]>[number],
): Omit<PhoenixTemplateProps, "palette"> {
  return {
    overlay: card.card_overlay,
    subtext: card.card_subtext,
    cta: card.card_cta || variant.cta_text,
    stat: variant.stat_value,
  };
}

export function PhoenixRenderer({
  variant,
  theme,
  templateIndex = 0,
  mockupRef,
}: PhoenixRendererProps) {
  const candidates = compatibleTemplatesFor(variant, theme);
  const key = candidates[templateIndex % candidates.length];
  const Template = TEMPLATES[key];
  const palette = paletteFor(key, theme);
  const cards = variant.cards?.length ? variant.cards : null;

  return (
    <div
      ref={mockupRef}
      className="phx-base"
      style={{ display: "flex", flexDirection: "column", gap: 12 }}
    >
      {cards
        ? cards.map((card, i) => (
            <PhoenixFrame key={i}>
              <Template {...buildCardProps(variant, card)} palette={palette} />
            </PhoenixFrame>
          ))
        : (
            <PhoenixFrame>
              <Template {...buildBaseProps(variant)} palette={palette} />
            </PhoenixFrame>
          )}
    </div>
  );
}

/* Wraps a 1080x1080 absolute-positioned scene and scales it to the
   container's actual width using container-query units. */
function PhoenixFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "1 / 1",
        position: "relative",
        overflow: "hidden",
        borderRadius: 8,
        containerType: "inline-size",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1080,
          height: 1080,
          transformOrigin: "top left",
          transform: "scale(calc(100cqw / 1080px))",
        }}
      >
        {children}
      </div>
    </div>
  );
}
