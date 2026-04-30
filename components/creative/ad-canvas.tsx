"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { toPng, toCanvas } from "html-to-image";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { GIFEncoder, quantize, applyPalette } from "gifenc";
import type { Variant, CanvasRenderContext } from "./refresh-engine";
import { BRAND_VOICE_OPTIONS, isGifFormat, type BrandVoiceOption } from "./refresh-engine";
import { renderVisualStyle, hasStyleRenderer, wrapForFormat, renderMultiCard, resolveSubtext, LogoBar, SocialProofBadge, MetricStrip } from "./visual-styles";
import { PhoenixRenderer, compatibleTemplatesFor, TEMPLATE_LABEL } from "./phoenix/PhoenixRenderer";
import { scoreVariant } from "./phoenix/score";
import { PhoenixScoreBadge, PhoenixScoreIssues } from "./phoenix/PhoenixScoreBadge";

/* ── Feedback types ────────────────────────────────────────────── */
interface FeedbackEntry {
  variant_id: string;
  theme: string;
  tags: string[];
  note: string;
  timestamp: string;
}

type ThemePenalties = Record<string, number>;

const QUICK_TAGS = [
  { label: "Unreadable text", icon: "🚫" },
  { label: "Low contrast", icon: "🌑" },
  { label: "Text overflow", icon: "↗️" },
  { label: "Wrong layout", icon: "📐" },
  { label: "Color mismatch", icon: "🎨" },
  { label: "Great mockup", icon: "✅" },
  { label: "On brand", icon: "💎" },
  { label: "Needs polish", icon: "🔧" },
];

interface AdCanvasProps {
  variants: Variant[];
  renderContext?: CanvasRenderContext;
}

/* ── Visual Style → Theme mapping (from PDF taxonomy) ──────────── */
const VISUAL_STYLE_THEME_MAP: Record<string, AdTheme[]> = {
  "neon-intelligence": ["navy-white", "navy-green", "navy-pink", "navy-lavender"],
  "human-contrast": ["beige-navy", "beige-purple", "beige-wave"],
  "rebellious-editorial": ["quote-gradient", "beige-wave"],
  "data-as-power": ["white-purple", "navy-white"],
  "digital-rebellion": ["gradient-pink", "navy-pink"],
  "minimal-authority": ["white-purple"],
  "system-ui": ["navy-white", "navy-green"],
};

/* ── Visual theme definitions matching real Docebo ads ──────────── */
export type AdTheme =
  | "navy-white"
  | "navy-green"
  | "navy-pink"
  | "navy-lavender"
  | "gradient-pink"
  | "beige-navy"
  | "beige-purple"
  | "beige-wave"
  | "white-purple"
  | "quote-gradient"
  | "cobrand-navy-green"
  | "cobrand-beige";

export interface ThemeConfig {
  layout: "standard" | "wave" | "quote" | "cobrand";
  bg: string;
  bgGradient?: string;
  headlineColor: string;
  accentColor: string;
  subColor: string;
  logoColor: string;
  ctaColor: string;
  ctaBg?: string;
  cornerGradient: string;
  bottomAccentColor?: string;
  bottomAccentShape?: "triangle" | "diagonal" | "pill";
  pinkShape?: boolean;
  limeBanner?: boolean;
}

/* Docebo Brand Colors (from brand guide)
 * Primary: Marble #2A2923, Neon Blue #0057FF, Neon Pink #FF5DD8, Neon Green #E3FFAB, Neon Purple #DCB7FF
 * Secondary: Navy #0033A0, Midnight #131E29, Light Blue #4C8DFF, Marble 10 #E6DACB
 * Tints: Neon Blue 90 #06065D, Neon Pink 80 #B627C6, Neon Green 40 #54FA77, Neon Purple 60 #7E2EE9
 * Fonts: Special Gothic Expanded (headlines), Figtree (body), Lora (quotes), IBM Plex Mono (CTAs)
 */

export const THEMES: Record<AdTheme, ThemeConfig> = {
  /* ── Navy backgrounds ───────────────────────────── */
  "navy-white": {
    layout: "standard",
    bg: "#0033A0",
    headlineColor: "#FFFFFF",
    accentColor: "#FFFFFF",
    subColor: "rgba(255,255,255,0.7)",
    logoColor: "#FFFFFF",
    ctaColor: "#FFFFFF",
    cornerGradient:
      "linear-gradient(225deg, #7E2EE9 0%, #06065D 40%, transparent 70%)",
  },
  "navy-green": {
    layout: "standard",
    bg: "#0033A0",
    headlineColor: "#FFFFFF",
    accentColor: "#E3FFAB",
    subColor: "rgba(255,255,255,0.7)",
    logoColor: "#FFFFFF",
    ctaColor: "#FFFFFF",
    cornerGradient:
      "linear-gradient(225deg, #54FA77 0%, #1EB83F 30%, transparent 60%)",
  },
  "navy-pink": {
    layout: "standard",
    bg: "#0033A0",
    headlineColor: "#FFFFFF",
    accentColor: "#FF5DD8",
    subColor: "rgba(255,255,255,0.7)",
    logoColor: "#FFFFFF",
    ctaColor: "#FFFFFF",
    cornerGradient: "none",
    bottomAccentColor: "#FF5DD8",
    bottomAccentShape: "diagonal",
  },
  "navy-lavender": {
    layout: "standard",
    bg: "#0033A0",
    headlineColor: "#FFFFFF",
    accentColor: "#DCB7FF",
    subColor: "rgba(255,255,255,0.7)",
    logoColor: "#FFFFFF",
    ctaColor: "#FFFFFF",
    ctaBg: "#DCB7FF40",
    cornerGradient: "none",
    bottomAccentColor: "#DCB7FF",
    bottomAccentShape: "diagonal",
  },

  /* ── Gradient backgrounds ───────────────────────── */
  "gradient-pink": {
    layout: "standard",
    bg: "#0033A0",
    bgGradient:
      "linear-gradient(160deg, #0057FF 0%, #7E2EE9 45%, #B627C6 100%)",
    headlineColor: "#FF5DD8",
    accentColor: "#FF5DD8",
    subColor: "rgba(255,255,255,0.85)",
    logoColor: "#FFFFFF",
    ctaColor: "#FFFFFF",
    cornerGradient: "none",
    pinkShape: true,
  },

  /* ── Quote / testimonial ────────────────────────── */
  "quote-gradient": {
    layout: "quote",
    bg: "#0033A0",
    bgGradient:
      "linear-gradient(165deg, #0057FF 0%, #7E2EE9 50%, #B627C6 100%)",
    headlineColor: "#FFFFFF",
    accentColor: "#FF5DD8",
    subColor: "rgba(255,255,255,0.7)",
    logoColor: "#FFFFFF",
    ctaColor: "#FFFFFF",
    cornerGradient: "none",
  },

  /* ── Beige (Marble 10) backgrounds ──────────────── */
  "beige-navy": {
    layout: "standard",
    bg: "#E6DACB",
    headlineColor: "#0033A0",
    accentColor: "#0057FF",
    subColor: "#0033A0",
    logoColor: "#0033A0",
    ctaColor: "#2A2923",
    cornerGradient: "none",
    bottomAccentColor: "#0057FF",
    bottomAccentShape: "diagonal",
  },
  "beige-purple": {
    layout: "standard",
    bg: "#E6DACB",
    headlineColor: "#0033A0",
    accentColor: "#7E2EE9",
    subColor: "#0033A0",
    logoColor: "#0033A0",
    ctaColor: "#FFFFFF",
    ctaBg: "#7E2EE9",
    cornerGradient: "none",
    bottomAccentColor: "#7E2EE9",
    bottomAccentShape: "diagonal",
  },
  "beige-wave": {
    layout: "wave",
    bg: "#E6DACB",
    headlineColor: "#0033A0",
    accentColor: "#0033A0",
    subColor: "#0033A0",
    logoColor: "#FFFFFF",
    ctaColor: "#FFFFFF",
    cornerGradient: "none",
  },

  /* ── White background ───────────────────────────── */
  "white-purple": {
    layout: "standard",
    bg: "#FFFFFF",
    headlineColor: "#0033A0",
    accentColor: "#7E2EE9",
    subColor: "#0033A0",
    logoColor: "#0033A0",
    ctaColor: "#2A2923",
    cornerGradient: "none",
    bottomAccentColor: "#0057FF",
    bottomAccentShape: "diagonal",
  },

  /* ── Co-brand layouts ───────────────────────────── */
  "cobrand-navy-green": {
    layout: "cobrand",
    bg: "#0033A0",
    headlineColor: "#FFFFFF",
    accentColor: "#E3FFAB",
    subColor: "rgba(255,255,255,0.7)",
    logoColor: "#0033A0",
    ctaColor: "#FFFFFF",
    cornerGradient: "none",
    limeBanner: true,
  },
  "cobrand-beige": {
    layout: "cobrand",
    bg: "#E6DACB",
    headlineColor: "#0033A0",
    accentColor: "#0057FF",
    subColor: "#0033A0",
    logoColor: "#0033A0",
    ctaColor: "#2A2923",
    cornerGradient: "none",
    limeBanner: true,
  },
};

const THEME_ORDER: AdTheme[] = [
  "navy-white",
  "gradient-pink",
  "beige-wave",
  "navy-green",
  "quote-gradient",
  "beige-navy",
  "navy-pink",
  "cobrand-navy-green",
  "beige-purple",
  "navy-lavender",
  "white-purple",
  "cobrand-beige",
];

const STYLE_OPTIONS: { theme: AdTheme; label: string; desc: string }[] = [
  { theme: "navy-white", label: "Navy Clean", desc: "Classic navy + white with purple gradient corner" },
  { theme: "navy-green", label: "Navy Neon", desc: "Navy + neon green accents" },
  { theme: "navy-pink", label: "Navy Pink", desc: "Navy + pink diagonal accent" },
  { theme: "navy-lavender", label: "Navy Lavender", desc: "Navy + soft purple tones" },
  { theme: "gradient-pink", label: "Gradient Glow", desc: "Blue-to-purple gradient + pink shape" },
  { theme: "quote-gradient", label: "Quote Card", desc: "Testimonial layout with gradient" },
  { theme: "beige-navy", label: "Beige Bold", desc: "Warm beige + navy blue text" },
  { theme: "beige-purple", label: "Beige Purple", desc: "Warm beige + purple accents" },
  { theme: "beige-wave", label: "Beige Wave", desc: "Beige top + navy wave bottom" },
  { theme: "white-purple", label: "White Clean", desc: "White + blue-purple accents" },
  { theme: "cobrand-navy-green", label: "Co-Brand Navy", desc: "Partner layout, navy + lime banner" },
  { theme: "cobrand-beige", label: "Co-Brand Beige", desc: "Partner layout, beige + lime banner" },
];

/* ── Style Picker (shown before rendering) ──────────────────────── */
function StylePicker({
  onSelect,
}: {
  onSelect: (style: AdTheme | "mix") => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-docebo-border">
        <h2 className="text-sm font-semibold text-white font-headline">
          Choose a rendering style
        </h2>
        <p className="text-xs text-docebo-muted mt-0.5">
          Select how your mockups should look
        </p>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-3">
        {/* Mix option — always first */}
        <button
          onClick={() => onSelect("mix")}
          className="w-full text-left rounded-lg border-2 border-dashed border-docebo-blue/40 bg-docebo-blue/5 hover:border-docebo-blue/60 hover:bg-docebo-blue/10 transition-all cursor-pointer p-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden flex">
              {["#0033A0", "#E6DACB", "#7E2EE9", "#FF5DD8", "#E3FFAB"].map((c) => (
                <div key={c} className="flex-1 h-full" style={{ backgroundColor: c }} />
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-docebo-light-blue">
                Show me a mix
              </p>
              <p className="text-xs text-docebo-muted mt-0.5">
                3+ different styles across your variants
              </p>
            </div>
          </div>
        </button>

        {/* Individual themes */}
        <div className="grid grid-cols-2 gap-2">
          {STYLE_OPTIONS.map(({ theme, label, desc }) => {
            const cfg = THEMES[theme];
            return (
              <button
                key={theme}
                onClick={() => onSelect(theme)}
                className="text-left rounded-lg border border-docebo-border bg-docebo-card/30 hover:border-docebo-muted/40 hover:bg-docebo-card/60 transition-all cursor-pointer p-2.5 group"
              >
                {/* Color swatch */}
                <div
                  className="w-full h-8 rounded mb-2 relative overflow-hidden"
                  style={{
                    background: cfg.bgGradient || cfg.bg,
                  }}
                >
                  {/* Accent stripe */}
                  <div
                    className="absolute right-0 top-0 bottom-0 w-1/4"
                    style={{
                      backgroundColor: cfg.accentColor,
                      opacity: 0.85,
                      clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0% 100%)",
                    }}
                  />
                  {/* Layout label */}
                  <span
                    className="absolute bottom-0.5 left-1.5 text-[9px] font-mono uppercase tracking-wider"
                    style={{ color: cfg.headlineColor, opacity: 0.7 }}
                  >
                    {cfg.layout}
                  </span>
                </div>
                <p className="text-xs font-medium text-white/80 group-hover:text-white transition-colors">
                  {label}
                </p>
                <p className="text-[10px] text-docebo-muted/60 mt-0.5 leading-snug">
                  {desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Pick a theme for variant at `index`, demoting themes with negative feedback.
 *  When a visual style is specified, restrict to that style's theme pool.
 *  Themes with high penalty scores get pushed to the end of the rotation. */
function pickTheme(index: number, penalties: ThemePenalties = {}, visualStyle?: string): AdTheme {
  // Use visual-style-restricted pool if available, otherwise full pool
  const pool: AdTheme[] = (visualStyle && VISUAL_STYLE_THEME_MAP[visualStyle])
    ? VISUAL_STYLE_THEME_MAP[visualStyle]
    : THEME_ORDER;

  if (Object.keys(penalties).length === 0) {
    return pool[index % pool.length];
  }
  // Sort themes: lower penalty first, preserving original order as tiebreaker
  const ranked = [...pool].sort((a, b) => {
    const pa = penalties[a] || 0;
    const pb = penalties[b] || 0;
    if (pa !== pb) return pa - pb;
    return pool.indexOf(a) - pool.indexOf(b);
  });
  return ranked[index % ranked.length];
}

/* ── Score badge ────────────────────────────────────────────────── */
function ScoreBadge({ label, value }: { label: string; value: number }) {
  const color =
    value >= 9
      ? "text-docebo-bright-green"
      : value >= 7
        ? "text-docebo-blue"
        : "text-amber-400";
  return (
    <span className="text-xs text-docebo-muted">
      {label}: <span className={`font-mono ${color}`}>{value}</span>
    </span>
  );
}

/* ── Standard layout (navy-*, beige-navy, beige-blue, gradient-pink) ── */
function StandardMockup({
  variant,
  theme,
  mockupRef,
  aspectRatio,
}: {
  variant: Variant;
  theme: ThemeConfig;
  mockupRef: React.RefObject<HTMLDivElement | null>;
  aspectRatio?: string;
}) {
  const overlayWords = variant.creative_overlay.split(" ");
  const splitAt = Math.max(1, overlayWords.length - 2);
  const headlinePrimary = overlayWords.slice(0, splitAt).join(" ");
  const headlineAccent = overlayWords.slice(splitAt).join(" ");
  const subtext = resolveSubtext(variant);

  return (
    <div
      ref={mockupRef}
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: theme.bg,
        background: theme.bgGradient || theme.bg,
        aspectRatio: aspectRatio || "1 / 1",
        containerType: "inline-size",
      }}
    >
      {/* Corner gradient accent */}
      {theme.cornerGradient !== "none" && (
        <div
          className="absolute"
          style={{
            top: 0,
            right: 0,
            width: "55%",
            height: "55%",
            background: theme.cornerGradient,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Pink geometric shape (left side accent) */}
      {theme.pinkShape && (
        <div
          className="absolute"
          style={{
            bottom: "8%",
            left: 0,
            width: "12%",
            height: "25%",
            backgroundColor: "#FF5DD8",
            borderRadius: "0 12px 12px 0",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Bottom accent shape */}
      {theme.bottomAccentColor && theme.bottomAccentShape === "diagonal" && (
        <div
          className="absolute"
          style={{
            bottom: 0,
            left: 0,
            width: "38%",
            height: "14%",
            backgroundColor: theme.bottomAccentColor,
            clipPath: "polygon(0 25%, 90% 0, 100% 100%, 0% 100%)",
            opacity: 0.9,
            pointerEvents: "none",
          }}
        />
      )}
      {theme.bottomAccentColor && theme.bottomAccentShape === "triangle" && (
        <div
          className="absolute"
          style={{
            bottom: 0,
            left: 0,
            width: "30%",
            height: "12%",
            backgroundColor: theme.bottomAccentColor,
            clipPath: "polygon(0 0, 100% 100%, 0% 100%)",
            opacity: 0.9,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Main content */}
      <div
        className="absolute inset-0 flex flex-col justify-between"
        style={{ padding: "10%" }}
      >
        <div style={{ maxWidth: "95%", marginTop: "2%" }}>
          <h2
            style={{
              color: theme.headlineColor,
              fontFamily:
                "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(40px, 13cqw, 150px)",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              margin: 0,
              fontStyle:
                "italic",
            }}
          >
            {headlinePrimary}
          </h2>
          {headlineAccent && (
            <h2
              style={{
                color: theme.accentColor,
                fontFamily:
                  "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(40px, 13cqw, 150px)",
                lineHeight: 1.0,
                letterSpacing: "-0.03em",
                margin: 0,
                fontStyle:
                  "italic",
              }}
            >
              {headlineAccent}
            </h2>
          )}

          {subtext && (
            <p
              style={{
                color: theme.subColor,
                fontFamily: "'Figtree', 'Inter', sans-serif",
                fontWeight: 500,
                fontSize: "clamp(16px, 3.2cqw, 34px)",
                lineHeight: 1.35,
                letterSpacing: "-0.005em",
                marginTop: "5%",
                maxWidth: "85%",
              }}
            >
              {subtext}
            </p>
          )}

          {/* Conditional: Logo bar for social-proof hooks */}
          {variant.hook_type === "social-proof" && (
            <LogoBar
              color={theme.subColor}
              bgColor={theme.bg === "#FFFFFF" || theme.bg === "#E6DACB" ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)"}
              style={{ marginTop: "5%" }}
            />
          )}

          {/* Conditional: Metric strip for data-stat hooks */}
          {variant.hook_type === "data-stat" && (
            <MetricStrip
              metrics={[
                { value: "94%", label: "Completion" },
                { value: "3.2x", label: "ROI" },
                { value: "60%", label: "Faster" },
              ]}
              accentColor={theme.accentColor}
              textColor={theme.subColor}
              style={{ marginTop: "5%" }}
            />
          )}

          {/* Conditional: Social proof badge for proof messaging */}
          {variant.messaging_angle === "proof" && variant.hook_type !== "social-proof" && variant.hook_type !== "data-stat" && (
            <SocialProofBadge
              accentColor={theme.accentColor}
              textColor={theme.headlineColor}
              style={{ marginTop: "5%" }}
            />
          )}
        </div>

        {/* Bottom row */}
        <div
          className="flex items-end justify-between"
          style={{ width: "100%" }}
        >
          <span
            style={{
              color: theme.logoColor,
              fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(14px, 2.8cqw, 24px)",
              letterSpacing: "-0.01em",
            }}
          >
            docebo
          </span>
          <span
            style={{
              color: theme.ctaColor,
              fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "clamp(11px, 2cqw, 16px)",
              ...(theme.ctaBg
                ? {
                    backgroundColor: theme.ctaBg,
                    padding: "2% 5%",
                    borderRadius: "999px",
                  }
                : {}),
            }}
          >
            {variant.cta_text} →
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Wave layout (beige top / navy bottom with organic curve) ───── */
function WaveMockup({
  variant,
  theme,
  mockupRef,
  aspectRatio,
}: {
  variant: Variant;
  theme: ThemeConfig;
  mockupRef: React.RefObject<HTMLDivElement | null>;
  aspectRatio?: string;
}) {
  const subtext = resolveSubtext(variant);
  return (
    <div
      ref={mockupRef}
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: theme.bg,
        aspectRatio: aspectRatio || "1 / 1",
        containerType: "inline-size",
      }}
    >
      {/* Navy bottom section with wave curve */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: "35%" }}
      >
        {/* Wavy top edge via SVG */}
        <svg
          viewBox="0 0 1080 80"
          preserveAspectRatio="none"
          className="absolute w-full"
          style={{ top: "-79px", height: "80px" }}
        >
          <path
            d="M0,80 C200,20 400,60 540,35 C680,10 880,50 1080,20 L1080,80 Z"
            fill="#0033A0"
          />
        </svg>
        <div
          className="w-full h-full"
          style={{
            background:
              "linear-gradient(180deg, #0033A0 0%, #1a0a5c 60%, #6B21A8 100%)",
          }}
        >
          {/* CTA inside navy section */}
          <div
            className="absolute bottom-0 right-0"
            style={{ padding: "8% 10%" }}
          >
            <span
              style={{
                color: "#FFFFFF",
                fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(14px, 3cqw, 22px)",
              }}
            >
              {variant.cta_text} →
            </span>
          </div>
        </div>
      </div>

      {/* Beige content area */}
      <div
        className="absolute inset-0 flex flex-col"
        style={{ padding: "8% 10%", paddingBottom: "40%" }}
      >
        {/* Logo top-left */}
        <span
          style={{
            color: "#0033A0",
            fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(14px, 2.8cqw, 22px)",
            letterSpacing: "-0.01em",
            marginBottom: "8%",
          }}
        >
          docebo
        </span>

        {/* Headline — uses creative_overlay as the dominant in-image text */}
        <h2
          style={{
            color: "#0033A0",
            fontFamily:
              "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(40px, 13cqw, 150px)",
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          {variant.creative_overlay}
        </h2>
        {subtext && (
          <p
            style={{
              color: "#0033A0",
              fontFamily: "'Figtree', 'Inter', sans-serif",
              fontWeight: 500,
              fontSize: "clamp(15px, 3cqw, 30px)",
              lineHeight: 1.35,
              marginTop: "5%",
              maxWidth: "85%",
              opacity: 0.85,
            }}
          >
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Quote / testimonial layout ────────────────────────────────── */
function QuoteMockup({
  variant,
  theme,
  mockupRef,
  aspectRatio,
}: {
  variant: Variant;
  theme: ThemeConfig;
  mockupRef: React.RefObject<HTMLDivElement | null>;
  aspectRatio?: string;
}) {
  return (
    <div
      ref={mockupRef}
      className="relative w-full overflow-hidden"
      style={{
        background:
          theme.bgGradient ||
          "linear-gradient(165deg, #0033CC 0%, #4C1D95 50%, #9333EA 100%)",
        aspectRatio: aspectRatio || "1 / 1",
        containerType: "inline-size",
      }}
    >
      {/* Large quote marks */}
      <div
        className="absolute"
        style={{
          top: "6%",
          left: "8%",
          color: "#FFFFFF",
          fontFamily: "'Lora', Georgia, serif",
          fontSize: "clamp(60px, 16cqw, 120px)",
          lineHeight: 1,
          opacity: 0.95,
          fontWeight: 800,
        }}
      >
        {"\u201C"}
      </div>

      {/* Quote text (using the headline as the quote) */}
      <div
        className="absolute"
        style={{
          top: "18%",
          left: "8%",
          right: "8%",
          maxHeight: "52%",
        }}
      >
        <p
          style={{
            color: "#FFFFFF",
            fontFamily:
              "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(20px, 5.5cqw, 42px)",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
          }}
        >
          {variant.creative_overlay}
        </p>
      </div>

      {/* Attribution area (bottom) */}
      <div
        className="absolute flex items-end gap-4"
        style={{
          bottom: "8%",
          left: "8%",
          right: "8%",
        }}
      >
        {/* Pink headshot placeholder */}
        <div
          style={{
            width: "18%",
            aspectRatio: "1 / 1",
            backgroundColor: "#FF5DD8",
            borderRadius: "16%",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="rgba(255,255,255,0.6)"
            style={{ width: "50%", height: "50%" }}
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>

        {/* Name + title */}
        <div>
          <p
            style={{
              color: "#FFFFFF",
              fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(14px, 3cqw, 22px)",
              margin: 0,
            }}
          >
            {variant.headline}
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
              fontWeight: 400,
              fontSize: "clamp(10px, 2cqw, 15px)",
              margin: "2px 0 0",
            }}
          >
            {variant.cta_text}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Co-brand layout (partner logos + lime banner) ─────────────── */
function CoBrandMockup({
  variant,
  theme,
  mockupRef,
  aspectRatio,
}: {
  variant: Variant;
  theme: ThemeConfig;
  mockupRef: React.RefObject<HTMLDivElement | null>;
  aspectRatio?: string;
}) {
  const isNavy = theme.bg === "#0033A0";

  return (
    <div
      ref={mockupRef}
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: theme.bg,
        aspectRatio: aspectRatio || "1 / 1",
        containerType: "inline-size",
      }}
    >
      {/* Lime banner top-left */}
      {theme.limeBanner && (
        <div
          className="absolute"
          style={{
            top: 0,
            left: 0,
            width: "42%",
            height: "12%",
            backgroundColor: "#D4FF4D",
            clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Logo area on lime banner */}
      <div
        className="absolute flex items-center gap-2"
        style={{ top: "2.5%", left: "5%", zIndex: 2 }}
      >
        <span
          style={{
            color: "#0033A0",
            fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(12px, 2.5cqw, 20px)",
          }}
        >
          docebo
        </span>
        <span
          style={{
            color: "#0033A0",
            fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
            fontWeight: 300,
            fontSize: "clamp(10px, 2cqw, 16px)",
          }}
        >
          |
        </span>
        <span
          style={{
            color: "#0033A0",
            fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(10px, 2cqw, 16px)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          partner
        </span>
      </div>

      {/* Headline — uses creative_overlay as the dominant in-image text */}
      <div
        className="absolute"
        style={{
          top: "18%",
          left: "8%",
          right: "8%",
          maxHeight: "55%",
        }}
      >
        <h2
          style={{
            color: theme.headlineColor,
            fontFamily:
              "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
            fontWeight: 800,
            fontStyle: "italic",
            fontSize: "clamp(38px, 12cqw, 140px)",
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          {variant.creative_overlay}
        </h2>
      </div>

      {/* CTA bottom-right */}
      <div
        className="absolute"
        style={{ bottom: "8%", right: "8%" }}
      >
        <span
          style={{
            color: isNavy ? "#FFFFFF" : "#1a1a1a",
            fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
            fontWeight: 600,
            fontSize: "clamp(12px, 2.5cqw, 18px)",
          }}
        >
          Discover how →
        </span>
      </div>
    </div>
  );
}

/* ── Feedback panel per variant ─────────────────────────────────── */
function FeedbackPanel({
  variantId,
  themeName,
  onSubmit,
}: {
  variantId: string;
  themeName: string;
  onSubmit: (entry: FeedbackEntry) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (selectedTags.length === 0 && !note.trim()) return;
    onSubmit({
      variant_id: variantId,
      theme: themeName,
      tags: selectedTags,
      note: note.trim(),
      timestamp: new Date().toISOString(),
    });
    setSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setSubmitted(false);
      setSelectedTags([]);
      setNote("");
    }, 1500);
  };

  if (!isOpen) {
    return (
      <div className="px-3 py-2 border-t border-docebo-border/30">
        <button
          onClick={() => setIsOpen(true)}
          className="text-xs text-docebo-muted hover:text-docebo-pink transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>💬</span> Add feedback for rendering engine
        </button>
      </div>
    );
  }

  return (
    <div className="px-3 py-3 border-t border-docebo-border/30 bg-docebo-card/50">
      {submitted ? (
        <div className="flex items-center gap-2 text-xs text-docebo-bright-green">
          <span>✓</span> Feedback saved — active in generation loop + theme ranking
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-white/80">
              Rendering feedback
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-docebo-muted/50 hover:text-docebo-muted cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Quick tags */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag.label}
                onClick={() => toggleTag(tag.label)}
                className={`text-xs px-2 py-1 rounded-full border transition-colors cursor-pointer ${
                  selectedTags.includes(tag.label)
                    ? "border-docebo-pink/50 bg-docebo-pink/15 text-docebo-pink"
                    : "border-docebo-border bg-docebo-card text-docebo-muted hover:border-docebo-muted/40 hover:text-white/70"
                }`}
              >
                {tag.icon} {tag.label}
              </button>
            ))}
          </div>

          {/* Free-form note */}
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Navy text on dark purple background is unreadable — avoid this combo for long headlines"
            rows={2}
            className="w-full text-xs bg-docebo-midnight/60 border border-docebo-border rounded px-2 py-1.5 text-white/80 placeholder-docebo-muted/40 resize-none focus:outline-none focus:border-docebo-blue/50 mb-2"
          />

          <button
            onClick={handleSubmit}
            disabled={selectedTags.length === 0 && !note.trim()}
            className="text-xs px-3 py-1 rounded bg-docebo-blue text-white hover:bg-docebo-light-blue disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Save feedback
          </button>
        </>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   GIF mockup — MOTION.md compliant
   ══════════════════════════════════════════════════════════════════

   Delegates to Standard / Wave / Quote / CoBrand so all 12 themes
   work for GIFs. Adds two motion strategies on top:

   - word-swap: two layered base mockups; outgoing slides up + fades,
     incoming slides in from below + fades. Per-voice easing. No hard
     cut. Transition 320ms with asymmetric timing (outgoing faster).

   - stat-pulse: persistent stat (always visible). On pulse frames it
     breathes — scale 100%→103% + glow swell over 500ms (ease-out),
     then settles over remaining frame duration (ease-in-out). Stat
     never appears/disappears. Placement is per-layout safe zone.

   Live preview runs a rAF-driven orchestrator. GIF export drives
   deterministic sub-frames via `exportState`.
   ══════════════════════════════════════════════════════════════════ */

/** Approximated easing curves keyed to brand_voice. */
function easeForVoice(voice?: string): (t: number) => number {
  if (voice === "provocateur") {
    // Punchy symmetric ease (approx cubic-bezier(0.6, 0, 0.4, 1))
    return (t) => (t < 0.5 ? 4 * t ** 3 : 1 - ((-2 * t + 2) ** 3) / 2);
  }
  if (voice === "trusted-advisor") {
    // Refined (approx cubic-bezier(0.4, 0, 0.2, 1))
    return (t) => 1 - Math.pow(1 - t, 2.5);
  }
  // Default: confident swagger — ease-out cubic
  return (t) => 1 - Math.pow(1 - t, 3);
}

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t ** 3 : 1 - ((-2 * t + 2) ** 3) / 2;

/** Typing speed per brand voice, in milliseconds per character.
 *  Matches MOTION.md §4.4. */
function typingSpeedFor(voice?: string): number {
  if (voice === "provocateur") return 35; // punchy
  if (voice === "trusted-advisor") return 60; // measured
  return 45; // default: confident
}

/** State describing what the GIF mockup should render at any instant. */
type GifAnimState =
  | {
      kind: "word-swap";
      /** Index of the frame whose headline text is currently animating. */
      frameIndex: number;
      /** Characters revealed from frames[frameIndex].overlay_text. */
      charsRevealed: number;
      /** Headline opacity. 1 during typing/holding, fades to 0 between frames. */
      opacity: number;
      /** Cursor visible during typing + holding only. */
      showCursor: boolean;
      /** Beat of the per-frame loop — useful for the encoder sampler. */
      phase: "typing" | "holding" | "fading";
    }
  | {
      kind: "stat-pulse";
      /** Current frame. */
      frameIndex: number;
      /** 0 = rest, 1 = peak pulse. Smoothly animates during pulse frames. */
      pulseProgress: number;
    }
  | {
      kind: "type-on";
      /** Which beat of the loop we're in. */
      phase: "typing" | "hold-typed" | "fading" | "reappear" | "hold-complete";
      /** Characters revealed from creative_overlay (0..text.length). */
      charsRevealed: number;
      /** 0..1. Driven during fading + reappear; 1 otherwise. */
      opacity: number;
      /** Cursor visible. True during typing + hold-typed only. */
      showCursor: boolean;
    };

/** Remove the stat_value substring from supporting copy so it doesn't
 *  duplicate the pulsing headline stat. Handles non-word chars like
 *  %, +, $ which \b regex can't. Collapses resulting whitespace. */
function stripStatFromText(text: string | undefined, stat: string): string {
  if (!text) return "";
  if (!stat) return text;
  const escaped = stat.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text
    .replace(new RegExp(`${escaped}\\s*`, "g"), "")
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s.,;:]+/, "")
    .trim();
}

/** Placement for the stat-as-headline block, per base layout.
 *  The stat occupies the headline zone (not a side safe zone), so it
 *  reads as the ad's hero element rather than a floating decoration. */
function statHeadlinePlacementFor(
  layout: ThemeConfig["layout"],
  visualStyle?: string,
): {
  container: React.CSSProperties;
  textAlign: React.CSSProperties["textAlign"];
  /** Font-size override for the stat-pulse hero stat. When omitted,
   *  stat-pulse uses its default clamp. */
  heroFontSize?: string;
  /** Font-size override for typewriter overlays (word-swap + type-on).
   *  When omitted, each strategy uses its own default clamp. */
  typewriterFontSize?: string;
  /** Overlay text color. Each visual style hard-codes its background,
   *  so the overlay needs a color that is guaranteed to contrast with
   *  that fixed bg — independent of whichever theme the picker chose.
   *  When omitted, callers fall back to theme.headlineColor. */
  textColor?: string;
} {
  // Visual-style-specific placements take priority — each branch is
  // calibrated to the native headline zone of its mockup so the overlay
  // lands where the style naturally places its headline.
  switch (visualStyle) {
    case "data-as-power":
      // Cards occupy ~6–31% of the canvas; chip row ~86–94%. Center the
      // overlay in the 31–89% free band; cap the stat at 20cqw so italic
      // glyphs clear the card edge with breathing room above and below.
      return {
        container: {
          left: "10%",
          top: "60%",
          transform: "translateY(-50%)",
          maxWidth: "80%",
        },
        textAlign: "left",
        heroFontSize: "clamp(60px, 20cqw, 240px)",
        textColor: "#FFFFFF", // white on midnight bg
      };
    case "minimal-authority":
      // Native layout now places the headline near the top; the
      // logo + CTA button sit on a footer row. Anchor the overlay in
      // the upper zone so the typewriter leads the read, with the
      // rule, subtext, and footer chrome falling below it.
      return {
        container: { left: "10%", top: "14%", maxWidth: "80%" },
        textAlign: "left",
        heroFontSize: "clamp(60px, 20cqw, 240px)",
        textColor: "#0A0A0A", // near-black on hardcoded white bg
      };
    case "neon-intelligence":
      // Native headline sits at padding 10% + marginTop 2% + marginLeft 4%.
      return {
        container: { left: "14%", top: "14%", maxWidth: "72%" },
        textAlign: "left",
        textColor: "#FFFFFF", // white on near-black bg
      };
    case "human-contrast":
      // Native headline is vertically centered inside a 46%-wide left
      // column; right 46% is a portrait placeholder. Keep the overlay
      // narrow so it doesn't spill across the image area. Beige bg —
      // theme.headlineColor already matches, leave textColor unset.
      return {
        container: {
          left: "7%",
          top: "50%",
          transform: "translateY(-50%)",
          maxWidth: "46%",
        },
        textAlign: "left",
        heroFontSize: "clamp(48px, 14cqw, 150px)",
        typewriterFontSize: "clamp(24px, 6.5cqw, 68px)",
      };
    case "rebellious-editorial":
      // Logo top, large uppercase headline in upper-middle, subtext
      // right-aligned. Anchor the overlay at ~28% to match the h2 zone
      // and size it up to the native h2 clamp so the typewriter fills
      // the editorial hero slot instead of leaving a sparse middle band.
      return {
        container: {
          left: "7%",
          top: "28%",
          maxWidth: "86%",
          textTransform: "uppercase", // match native editorial treatment
        },
        textAlign: "left",
        textColor: "#E6DACB", // marble-10 on marble-dark bg
        heroFontSize: "clamp(42px, 12cqw, 140px)",
        typewriterFontSize: "clamp(32px, 11cqw, 120px)",
      };
    case "digital-rebellion":
      // Glitch layout with RGB-offset ghost text near the top.
      return {
        container: { left: "6%", top: "14%", maxWidth: "88%" },
        textAlign: "left",
        textColor: "#FFFFFF", // white on midnight bg
      };
    case "system-ui":
      // Headline renders inside the browser chrome's main area, to the
      // right of a 22% sidebar (plus padding), below the stat cards and
      // line chart. Constrain width and font so it fits the panel.
      return {
        container: { left: "34%", top: "65%", maxWidth: "58%" },
        textAlign: "left",
        heroFontSize: "clamp(30px, 10cqw, 110px)",
        typewriterFontSize: "clamp(20px, 6cqw, 60px)",
        textColor: "#FFFFFF", // white on dark-blue bg
      };
  }
  // Fallback: theme-layout-based placement when visualStyle is absent
  // or unknown (keeps legacy StandardMockup / WaveMockup / etc. working).
  switch (layout) {
    case "cobrand":
      return {
        container: {
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          maxWidth: "80%",
        },
        textAlign: "center",
      };
    case "quote":
      return {
        container: { left: "10%", top: "14%", maxWidth: "80%" },
        textAlign: "left",
      };
    case "wave":
      return {
        container: { left: "10%", top: "52%", maxWidth: "80%" },
        textAlign: "left",
      };
    default: // standard
      return {
        container: { left: "10%", top: "12%", maxWidth: "80%" },
        textAlign: "left",
      };
  }
}

function GifMockup({
  variant,
  theme,
  mockupRef,
  aspectRatio,
  exportState,
}: {
  variant: Variant;
  theme: ThemeConfig;
  mockupRef: React.RefObject<HTMLDivElement | null>;
  aspectRatio?: string;
  /** When provided, forces the displayed animation state (used during GIF export).
   *  When null/undefined, the component drives its own live loop. */
  exportState?: GifAnimState | null;
}) {
  const frames = variant.animation_frames ?? [];
  const strategy: "word-swap" | "stat-pulse" | "type-on" =
    variant.animation_strategy === "stat-pulse"
      ? "stat-pulse"
      : variant.animation_strategy === "type-on"
        ? "type-on"
        : "word-swap";

  // Internal state for live preview. Export drives its own state via exportState.
  const [liveState, setLiveState] = useState<GifAnimState>(() => {
    if (strategy === "stat-pulse") return { kind: "stat-pulse", frameIndex: 0, pulseProgress: 0 };
    if (strategy === "type-on")
      return {
        kind: "type-on",
        phase: "typing",
        charsRevealed: 0,
        opacity: 1,
        showCursor: true,
      };
    return {
      kind: "word-swap",
      frameIndex: 0,
      charsRevealed: 0,
      opacity: 1,
      showCursor: true,
      phase: "typing",
    };
  });
  const display: GifAnimState = exportState ?? liveState;

  // Discard-ref for the base mockup — the outer wrapper holds the capture ref.
  const baseRefSolo = useRef<HTMLDivElement>(null);

  // Live orchestrator — runs only when no exportState is provided.
  // Depends ONLY on stable primitives (variant_id, strategy, brand_voice,
  // and whether we're in export mode). Frames and easing are captured
  // inside the effect so fresh-reference re-renders don't restart the loop.
  useEffect(() => {
    if (exportState) return;
    const localFrames = variant.animation_frames ?? [];
    if (localFrames.length === 0) return;
    const localEase = easeForVoice(variant.brand_voice);

    let cancelled = false;
    const rafIds: number[] = [];
    const timerIds: number[] = [];

    const hold = (ms: number) =>
      new Promise<void>((resolve) => {
        const t = window.setTimeout(resolve, ms);
        timerIds.push(t);
      });

    const animate = (
      duration: number,
      ease: (t: number) => number,
      onUpdate: (eased: number) => void,
    ) =>
      new Promise<void>((resolve) => {
        const start = performance.now();
        const tick = (now: number) => {
          if (cancelled) return resolve();
          const raw = Math.min(1, (now - start) / duration);
          onUpdate(ease(raw));
          if (raw < 1) rafIds.push(requestAnimationFrame(tick));
          else resolve();
        };
        rafIds.push(requestAnimationFrame(tick));
      });

    const run = async () => {
      const SWELL_MS = 500;
      const WORD_SWAP_FADE_MS = 400;
      let idx = 0;

      // Type-on has a single linear beat sequence — no per-frame loop.
      if (strategy === "type-on") {
        const fullText = variant.creative_overlay || "";
        const charCount = fullText.length;
        const typingSpeed = typingSpeedFor(variant.brand_voice);
        const HOLD_TYPED_MS = 1500;
        const FADE_MS = 400;
        const REAPPEAR_MS = 150;
        const HOLD_COMPLETE_MS = 1500;

        while (!cancelled) {
          // Typing phase — reveal char-by-char
          for (let c = 1; c <= charCount; c++) {
            if (cancelled) return;
            setLiveState({
              kind: "type-on",
              phase: "typing",
              charsRevealed: c,
              opacity: 1,
              showCursor: true,
            });
            await hold(typingSpeed);
          }
          if (cancelled) return;
          // Hold typed (cursor visible)
          setLiveState({
            kind: "type-on",
            phase: "hold-typed",
            charsRevealed: charCount,
            opacity: 1,
            showCursor: true,
          });
          await hold(HOLD_TYPED_MS);
          if (cancelled) return;
          // Fade out (text + cursor)
          await animate(FADE_MS, easeInOutCubic, (p) =>
            setLiveState({
              kind: "type-on",
              phase: "fading",
              charsRevealed: charCount,
              opacity: 1 - p,
              showCursor: false,
            }),
          );
          if (cancelled) return;
          // Reappear as complete block (no cursor)
          await animate(REAPPEAR_MS, localEase, (p) =>
            setLiveState({
              kind: "type-on",
              phase: "reappear",
              charsRevealed: charCount,
              opacity: p,
              showCursor: false,
            }),
          );
          if (cancelled) return;
          // Hold complete
          setLiveState({
            kind: "type-on",
            phase: "hold-complete",
            charsRevealed: charCount,
            opacity: 1,
            showCursor: false,
          });
          await hold(HOLD_COMPLETE_MS);
        }
        return;
      }

      while (!cancelled) {
        const frame = localFrames[idx];

        if (strategy === "word-swap") {
          const text = frame.overlay_text || variant.creative_overlay || "";
          const charCount = text.length;
          const typingSpeed = typingSpeedFor(variant.brand_voice);
          // Clear the headline at the start of each frame so the next
          // phrase types in from empty rather than jump-cutting from the
          // previous frame's completed text.
          setLiveState({
            kind: "word-swap",
            frameIndex: idx,
            charsRevealed: 0,
            opacity: 1,
            showCursor: true,
            phase: "typing",
          });
          // Type char-by-char
          for (let c = 1; c <= charCount; c++) {
            if (cancelled) return;
            setLiveState({
              kind: "word-swap",
              frameIndex: idx,
              charsRevealed: c,
              opacity: 1,
              showCursor: true,
              phase: "typing",
            });
            await hold(typingSpeed);
          }
          if (cancelled) return;
          // Hold completed text with cursor — frame.duration_ms controls
          // how long the viewer has to read before the fade kicks in.
          setLiveState({
            kind: "word-swap",
            frameIndex: idx,
            charsRevealed: charCount,
            opacity: 1,
            showCursor: true,
            phase: "holding",
          });
          await hold(frame.duration_ms);
          if (cancelled) return;
          // Fade the headline out so the next frame's typing starts
          // from a visually empty headline slot. Subtext stays visible.
          if (localFrames.length > 1) {
            await animate(WORD_SWAP_FADE_MS, easeInOutCubic, (p) =>
              setLiveState({
                kind: "word-swap",
                frameIndex: idx,
                charsRevealed: charCount,
                opacity: 1 - p,
                showCursor: false,
                phase: "fading",
              }),
            );
          }
          idx = (idx + 1) % localFrames.length;
        } else {
          // stat-pulse
          const isPulse = frame.stat_pulse === true;
          if (isPulse) {
            const settleMs = Math.max(frame.duration_ms - SWELL_MS, 200);
            // Swell up
            await animate(SWELL_MS, localEase, (p) =>
              setLiveState({ kind: "stat-pulse", frameIndex: idx, pulseProgress: p }),
            );
            if (cancelled) return;
            // Settle down
            await animate(settleMs, easeInOutCubic, (p) =>
              setLiveState({ kind: "stat-pulse", frameIndex: idx, pulseProgress: 1 - p }),
            );
          } else {
            setLiveState({ kind: "stat-pulse", frameIndex: idx, pulseProgress: 0 });
            await hold(frame.duration_ms);
          }
          idx = (idx + 1) % localFrames.length;
        }
      }
    };

    run();
    return () => {
      cancelled = true;
      rafIds.forEach((id) => cancelAnimationFrame(id));
      timerIds.forEach((id) => clearTimeout(id));
    };
  }, [exportState, variant.variant_id, variant.brand_voice, variant.animation_frames, strategy]);

  // Build variants for each layer. Word-swap now renders its headline
  // as an overlay (same pattern as type-on and stat-pulse), so the base
  // always gets a quieted variant with creative_overlay + overlay_subtext
  // + intro_text cleared — the overlay owns all headline copy.
  const variantForFrame = (idx: number): Variant => {
    if (strategy === "word-swap") {
      return { ...variant, creative_overlay: "", overlay_subtext: "", intro_text: "" };
    }
    const f = frames[idx];
    if (f?.overlay_text) {
      return { ...variant, creative_overlay: f.overlay_text };
    }
    return variant;
  };

  const renderBase = (
    v: Variant,
    ref: React.RefObject<HTMLDivElement | null>,
  ) => {
    // Try visual-style-specific renderer first
    const vs = v.visual_style;
    if (vs && hasStyleRenderer(vs)) {
      return renderVisualStyle(vs, { variant: v, theme, mockupRef: ref, aspectRatio });
    }
    // Fallback to theme-layout-based renderers
    switch (theme.layout) {
      case "wave":
        return <WaveMockup variant={v} theme={theme} mockupRef={ref} aspectRatio={aspectRatio} />;
      case "quote":
        return <QuoteMockup variant={v} theme={theme} mockupRef={ref} aspectRatio={aspectRatio} />;
      case "cobrand":
        return <CoBrandMockup variant={v} theme={theme} mockupRef={ref} aspectRatio={aspectRatio} />;
      default:
        return <StandardMockup variant={v} theme={theme} mockupRef={ref} aspectRatio={aspectRatio} />;
    }
  };

  // ── Word-swap render (typewriter per frame) ──────────────────────
  // Each frame's overlay_text is typed char-by-char, holds with a
  // cursor, then fades out so the next frame types in from empty.
  // overlay_subtext is intentionally NOT rendered here — the typewriter
  // headline carries the full message; any short supporting line would
  // either repeat the headline's beat or read as orphaned under it.
  if (display.kind === "word-swap") {
    const { frameIndex, charsRevealed, opacity, showCursor } = display;
    const frame = frames[frameIndex];
    const fullText = frame?.overlay_text || variant.creative_overlay || "";
    const typed = fullText.slice(0, Math.max(0, Math.min(fullText.length, charsRevealed)));
    const quietedVariant = variantForFrame(frameIndex);
    const wsPlacement = statHeadlinePlacementFor(theme.layout, variant.visual_style);

    return (
      <div
        ref={mockupRef}
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: aspectRatio || "1 / 1",
          containerType: "inline-size",
        }}
      >
        <div className="absolute inset-0">{renderBase(quietedVariant, baseRefSolo)}</div>
        <div
          style={{
            position: "absolute",
            pointerEvents: "none",
            textAlign: wsPlacement.textAlign,
            ...wsPlacement.container,
          }}
        >
          <h2
            style={{
              color: wsPlacement.textColor ?? theme.headlineColor,
              fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
              fontWeight: 800,
              fontSize: wsPlacement.typewriterFontSize ?? "clamp(32px, 8cqw, 90px)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              margin: 0,
              fontStyle: "italic",
              opacity,
            }}
          >
            {typed}
            {showCursor && (
              <span
                style={{
                  display: "inline-block",
                  width: "0.05em",
                  height: "0.9em",
                  marginLeft: "0.04em",
                  verticalAlign: "baseline",
                  backgroundColor: theme.accentColor,
                  transform: "translateY(0.05em)",
                }}
              />
            )}
          </h2>
        </div>
      </div>
    );
  }

  // ── Type-on render ───────────────────────────────────────────────
  // Classic thin-cursor typing. Base mockup is quieted (empty overlay
  // + subtext); GifMockup draws the progressively-revealed text in
  // the headline zone with a "|" cursor during typing and hold-typed.
  if (display.kind === "type-on") {
    const fullText = variant.creative_overlay || "";
    const typed = fullText.slice(0, Math.max(0, Math.min(fullText.length, display.charsRevealed)));
    const overlaySubtext = variant.overlay_subtext || "";
    const quietedTypeVariant: Variant = {
      ...variant,
      creative_overlay: "",
      overlay_subtext: "",
      // Clear intro_text so visual style renderers don't fall back to it
      // when overlay_subtext is empty (falsy "" triggers the fallback).
      intro_text: "",
    };
    const typePlacement = statHeadlinePlacementFor(theme.layout, variant.visual_style);

    return (
      <div
        ref={mockupRef}
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: aspectRatio || "1 / 1",
          containerType: "inline-size",
        }}
      >
        <div className="absolute inset-0">{renderBase(quietedTypeVariant, baseRefSolo)}</div>
        <div
          style={{
            position: "absolute",
            pointerEvents: "none",
            textAlign: typePlacement.textAlign,
            opacity: display.opacity,
            ...typePlacement.container,
          }}
        >
          <h2
            style={{
              color: typePlacement.textColor ?? theme.headlineColor,
              fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
              fontWeight: 800,
              fontSize: typePlacement.typewriterFontSize ?? "clamp(40px, 13cqw, 150px)",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              margin: 0,
              fontStyle: "italic",
            }}
          >
            {typed}
            {display.showCursor && (
              <span
                style={{
                  display: "inline-block",
                  width: "0.05em",
                  height: "0.9em",
                  marginLeft: "0.04em",
                  verticalAlign: "baseline",
                  backgroundColor: theme.accentColor,
                  transform: "translateY(0.05em)",
                }}
              />
            )}
          </h2>
          {overlaySubtext && (
            <p
              style={{
                color: theme.subColor,
                fontFamily: "'Figtree', 'Inter', sans-serif",
                fontWeight: 500,
                fontSize: "clamp(16px, 3.2cqw, 34px)",
                lineHeight: 1.35,
                letterSpacing: "-0.005em",
                marginTop: "4%",
                maxWidth: "100%",
              }}
            >
              {overlaySubtext}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── Stat-pulse render (Option A — stat IS the headline) ────────
  // The base mockup renders only background + logo + CTA (headline and
  // subtext quieted). GifMockup draws the stat in the headline position
  // with a subtext "because" line underneath. One hero number, one
  // supporting beat — the gold-standard B2B stat-ad shape.
  const { frameIndex, pulseProgress } = display;
  const currentFrame = frames[frameIndex];
  const statValue = currentFrame?.stat_value ?? variant.stat_value ?? "";
  const cleanSubtext = stripStatFromText(variant.overlay_subtext, statValue);
  const quietedVariant: Variant = {
    ...variant,
    creative_overlay: "",
    overlay_subtext: "",
    // Clear intro_text so visual style renderers don't fall back to it
    // when overlay_subtext is empty (falsy "" triggers the fallback).
    intro_text: "",
  };
  const placement = statHeadlinePlacementFor(theme.layout, variant.visual_style);

  // Pick a stat color that reads well on the base mockup's background.
  // Visual styles with dark backgrounds need bright, saturated accents —
  // not the muted lime/lavender that some theme configs use.
  const VISUAL_STYLE_STAT_COLORS: Record<string, string> = {
    "neon-intelligence": "#54FA77",   // bright green on black
    "digital-rebellion": "#FF5DD8",   // neon pink on midnight
    // data-as-power intentionally omitted — hero stat uses theme.accentColor
    // so it matches the CTA and trend-bar highlight in the same composition.
    "system-ui": "#4C8DFF",           // blue on dark
    "rebellious-editorial": "#FF5DD8", // pink on marble-dark
    "minimal-authority": "#7E2EE9",   // purple on white
    "human-contrast": "#0057FF",      // blue on beige
  };
  const vs = variant.visual_style;
  const statColor = (vs && VISUAL_STYLE_STAT_COLORS[vs]) || theme.accentColor;

  // Breath curve: scale 1.00 → 1.03, glow 0 → moderate.
  // Glow kept tight (max 30px outer) so neon accents read as clean
  // color rather than washing out into a muddy halo on dark backgrounds.
  const pulseScale = 1 + 0.03 * pulseProgress;
  const glowOuter = 30 * pulseProgress;
  const glowInner = 10 * pulseProgress;
  const statShadow =
    pulseProgress > 0.01
      ? `0 0 ${glowOuter}px ${statColor}90, 0 0 ${glowInner}px ${statColor}60`
      : "none";

  return (
    <div
      ref={mockupRef}
      className="relative w-full overflow-hidden"
      style={{
        aspectRatio: aspectRatio || "1 / 1",
        containerType: "inline-size",
      }}
    >
      <div className="absolute inset-0">{renderBase(quietedVariant, baseRefSolo)}</div>
      {statValue && (
        <div
          style={{
            position: "absolute",
            pointerEvents: "none",
            textAlign: placement.textAlign,
            ...placement.container,
          }}
        >
          <div
            style={{
              color: statColor,
              fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
              fontWeight: 900,
              fontSize: placement.heroFontSize ?? "clamp(80px, 28cqw, 360px)",
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              fontStyle: "italic",
              display: "inline-block",
              transform: `scale(${pulseScale})`,
              textShadow: statShadow,
              transformOrigin:
                placement.textAlign === "right"
                  ? "right center"
                  : placement.textAlign === "center"
                    ? "center center"
                    : "left center",
            }}
          >
            {statValue}
          </div>
          {cleanSubtext && (
            <p
              style={{
                color: theme.subColor,
                fontFamily: "'Figtree', 'Inter', sans-serif",
                fontWeight: 500,
                fontSize: "clamp(16px, 3.2cqw, 34px)",
                lineHeight: 1.35,
                letterSpacing: "-0.005em",
                marginTop: "4%",
                maxWidth: "100%",
              }}
            >
              {cleanSubtext}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Single ad mockup (picks renderer based on theme layout) ───── */
function AdMockup({
  variant,
  index,
  onFeedback,
  approved,
  onToggleApprove,
  themePenalties,
  forcedTheme,
  mockupRefs,
  gifExporters,
  renderContext,
}: {
  variant: Variant;
  index: number;
  onFeedback: (entry: FeedbackEntry) => void;
  approved: boolean;
  onToggleApprove: () => void;
  themePenalties: ThemePenalties;
  forcedTheme?: AdTheme;
  mockupRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
  gifExporters: React.MutableRefObject<Map<string, () => Promise<Blob | null>>>;
  renderContext?: CanvasRenderContext;
}) {
  const mockupRef = useRef<HTMLDivElement>(null);
  const visualStyle = renderContext?.visual_style || variant.visual_style;
  const themeName = forcedTheme || pickTheme(index, themePenalties, visualStyle);
  const theme = THEMES[themeName];
  const aspectRatio = renderContext?.aspectRatio;
  const isGif =
    isGifFormat(variant.ad_format) &&
    !!variant.animation_frames &&
    variant.animation_frames.length > 0;
  const [exportState, setExportState] = useState<GifAnimState | null>(null);
  const [exportingGif, setExportingGif] = useState(false);
  const [showPhoenix, setShowPhoenix] = useState(false);
  const [scoreExpanded, setScoreExpanded] = useState(false);
  const [templateIndex, setTemplateIndex] = useState(0);
  const scoreResult = scoreVariant(variant, theme);
  const phoenixCandidates = compatibleTemplatesFor(variant, theme);
  const currentTemplateKey =
    phoenixCandidates[templateIndex % phoenixCandidates.length];

  // Register this mockup's DOM ref so FigmaSendPanel can render it to PNG
  useEffect(() => {
    const el = mockupRef.current;
    if (el) {
      mockupRefs.current.set(variant.variant_id, el);
    }
    return () => { mockupRefs.current.delete(variant.variant_id); };
  }, [variant.variant_id, mockupRefs]);

  const handleDownload = useCallback(async () => {
    if (!mockupRef.current) return;
    try {
      const dataUrl = await toPng(mockupRef.current, {
        quality: 1,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `docebo-ad-${variant.variant_id || index + 1}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export image:", err);
    }
  }, [variant.variant_id, index]);

  const encodeGifBlob = useCallback(async (): Promise<Blob | null> => {
    if (!mockupRef.current) return null;
    const frames = variant.animation_frames ?? [];
    if (frames.length === 0) return null;
    const strategy: "word-swap" | "stat-pulse" | "type-on" =
      variant.animation_strategy === "stat-pulse"
        ? "stat-pulse"
        : variant.animation_strategy === "type-on"
          ? "type-on"
          : "word-swap";
    const voiceEase = easeForVoice(variant.brand_voice);

    // Build the deterministic sub-frame schedule per MOTION.md §7.
    // Rest segments collapse to a single encoded frame with full delay
    // (gifenc's frame-diff optimizer keeps the file tight).
    // Transition segments sample at ~80ms intervals.
    type Sample = { state: GifAnimState; delay_ms: number };
    const samples: Sample[] = [];

    const SWELL_MS = 500;
    const SWELL_STEPS = 6;
    const WORD_SWAP_FADE_MS = 400;
    const WORD_SWAP_FADE_STEPS = 4;

    if (strategy === "word-swap") {
      // Word-swap is now a typewriter per frame: type char-by-char,
      // hold the completed text for frame.duration_ms, then fade out
      // so the next frame types in from an empty headline slot.
      const typingSpeed = typingSpeedFor(variant.brand_voice);
      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        const text = frame.overlay_text || variant.creative_overlay || "";
        const charCount = text.length;
        // Typing phase — one sub-frame per character
        for (let c = 1; c <= charCount; c++) {
          samples.push({
            state: {
              kind: "word-swap",
              frameIndex: i,
              charsRevealed: c,
              opacity: 1,
              showCursor: true,
              phase: "typing",
            },
            delay_ms: typingSpeed,
          });
        }
        // Hold completed text with cursor for the full frame duration
        samples.push({
          state: {
            kind: "word-swap",
            frameIndex: i,
            charsRevealed: charCount,
            opacity: 1,
            showCursor: true,
            phase: "holding",
          },
          delay_ms: frame.duration_ms,
        });
        // Fade out between frames (skip on single-frame GIFs)
        if (frames.length > 1) {
          const fadeStepDelay = Math.round(WORD_SWAP_FADE_MS / WORD_SWAP_FADE_STEPS);
          for (let s = 1; s <= WORD_SWAP_FADE_STEPS; s++) {
            samples.push({
              state: {
                kind: "word-swap",
                frameIndex: i,
                charsRevealed: charCount,
                opacity: 1 - easeInOutCubic(s / WORD_SWAP_FADE_STEPS),
                showCursor: false,
                phase: "fading",
              },
              delay_ms: fadeStepDelay,
            });
          }
        }
      }
    } else if (strategy === "type-on") {
      // Type-on: one sub-frame per revealed character during typing,
      // one held frame for each steady state, and a short fade+reappear.
      const fullText = variant.creative_overlay || "";
      const charCount = fullText.length;
      const typingSpeed = typingSpeedFor(variant.brand_voice);
      const HOLD_TYPED_MS = 1500;
      const FADE_MS = 400;
      const FADE_STEPS = 4;
      const REAPPEAR_MS = 150;
      const HOLD_COMPLETE_MS = 1500;

      // Typing phase — one frame per character
      for (let c = 1; c <= charCount; c++) {
        samples.push({
          state: {
            kind: "type-on",
            phase: "typing",
            charsRevealed: c,
            opacity: 1,
            showCursor: true,
          },
          delay_ms: typingSpeed,
        });
      }
      // Hold typed
      samples.push({
        state: {
          kind: "type-on",
          phase: "hold-typed",
          charsRevealed: charCount,
          opacity: 1,
          showCursor: true,
        },
        delay_ms: HOLD_TYPED_MS,
      });
      // Fade out
      const fadeStepDelay = Math.round(FADE_MS / FADE_STEPS);
      for (let s = 1; s <= FADE_STEPS; s++) {
        samples.push({
          state: {
            kind: "type-on",
            phase: "fading",
            charsRevealed: charCount,
            opacity: 1 - easeInOutCubic(s / FADE_STEPS),
            showCursor: false,
          },
          delay_ms: fadeStepDelay,
        });
      }
      // Reappear — single quick frame (150ms) at full opacity, no cursor
      samples.push({
        state: {
          kind: "type-on",
          phase: "reappear",
          charsRevealed: charCount,
          opacity: 1,
          showCursor: false,
        },
        delay_ms: REAPPEAR_MS,
      });
      // Hold complete
      samples.push({
        state: {
          kind: "type-on",
          phase: "hold-complete",
          charsRevealed: charCount,
          opacity: 1,
          showCursor: false,
        },
        delay_ms: HOLD_COMPLETE_MS,
      });
    } else {
      // stat-pulse
      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        if (frame.stat_pulse === true) {
          // Swell up (500ms)
          const swellStepDelay = Math.round(SWELL_MS / SWELL_STEPS);
          for (let s = 1; s <= SWELL_STEPS; s++) {
            samples.push({
              state: {
                kind: "stat-pulse",
                frameIndex: i,
                pulseProgress: voiceEase(s / SWELL_STEPS),
              },
              delay_ms: swellStepDelay,
            });
          }
          // Settle down (remaining)
          const settleMs = Math.max(frame.duration_ms - SWELL_MS, 200);
          const settleSteps = 5;
          const settleStepDelay = Math.round(settleMs / settleSteps);
          for (let s = 1; s <= settleSteps; s++) {
            samples.push({
              state: {
                kind: "stat-pulse",
                frameIndex: i,
                pulseProgress: 1 - easeInOutCubic(s / settleSteps),
              },
              delay_ms: settleStepDelay,
            });
          }
        } else {
          // Rest: single encoded frame with full delay
          samples.push({
            state: { kind: "stat-pulse", frameIndex: i, pulseProgress: 0 },
            delay_ms: frame.duration_ms,
          });
        }
      }
    }

    try {
      const encoder = GIFEncoder();
      // Use a global palette from frame 1 so colors stay consistent across
      // the animation and neon brand accents don't get quantized away.
      let globalPalette: number[][] | null = null;

      for (const sample of samples) {
        setExportState(sample.state);
        // Wait two paints so React commits the frame before capture.
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        );
        if (!mockupRef.current) break;
        const canvas = await toCanvas(mockupRef.current, { pixelRatio: 1 });
        const ctx = canvas.getContext("2d");
        if (!ctx) continue;
        const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // 256-color palette (GIF max). Build global palette from first frame
        // so brand colors (neon accents on dark backgrounds) stay faithful.
        if (!globalPalette) {
          globalPalette = quantize(data, 256);
        }
        const indexed = applyPalette(data, globalPalette);
        encoder.writeFrame(indexed, width, height, {
          palette: globalPalette,
          delay: sample.delay_ms,
        });
      }
      encoder.finish();
      return new Blob([encoder.bytes() as BlobPart], { type: "image/gif" });
    } finally {
      setExportState(null);
    }
  }, [variant.animation_frames, variant.animation_strategy, variant.brand_voice]);

  // Register encoder so FigmaSendPanel can produce GIFs for the ZIP.
  // Uses a ref to the latest encoder so we register once per variant_id.
  const encodeGifBlobRef = useRef(encodeGifBlob);
  useEffect(() => {
    encodeGifBlobRef.current = encodeGifBlob;
  }, [encodeGifBlob]);
  useEffect(() => {
    if (!isGif) return;
    const stable = () => encodeGifBlobRef.current();
    gifExporters.current.set(variant.variant_id, stable);
    return () => { gifExporters.current.delete(variant.variant_id); };
  }, [variant.variant_id, isGif, gifExporters]);

  const handleDownloadGif = useCallback(async () => {
    setExportingGif(true);
    try {
      const blob = await encodeGifBlob();
      if (!blob) return;
      saveAs(blob, `docebo-ad-${variant.variant_id || index + 1}.gif`);
    } catch (err) {
      console.error("Failed to export GIF:", err);
    } finally {
      setExportingGif(false);
    }
  }, [encodeGifBlob, variant.variant_id, index]);

  const togglePhoenix = useCallback(() => {
    setShowPhoenix((v) => !v);
  }, []);

  const renderMockup = () => {
    if (showPhoenix) {
      return (
        <PhoenixRenderer
          variant={variant}
          theme={theme}
          templateIndex={templateIndex}
          mockupRef={mockupRef}
        />
      );
    }

    let mockupContent: React.ReactElement;

    if (isGif) {
      mockupContent = (
        <GifMockup
          variant={variant}
          theme={theme}
          mockupRef={mockupRef}
          aspectRatio={aspectRatio}
          exportState={exportState}
        />
      );
    } else {
      const adFormat = renderContext?.ad_format || variant.ad_format;

      // Try multi-card renderer first (carousel/document with cards data)
      const multiCard = renderMultiCard(adFormat, { variant, theme, mockupRef, aspectRatio });
      if (multiCard) {
        // Multi-card renderers handle their own chrome — no wrapper needed
        return multiCard;
      }

      // Try visual-style-specific renderer
      const vs = renderContext?.visual_style || variant.visual_style;
      const styleResult = vs ? renderVisualStyle(vs, { variant, theme, mockupRef, aspectRatio }) : null;

      if (styleResult) {
        mockupContent = styleResult;
      } else {
        // Fallback to theme-layout-based renderers
        switch (theme.layout) {
          case "wave":
            mockupContent = <WaveMockup variant={variant} theme={theme} mockupRef={mockupRef} aspectRatio={aspectRatio} />;
            break;
          case "quote":
            mockupContent = <QuoteMockup variant={variant} theme={theme} mockupRef={mockupRef} aspectRatio={aspectRatio} />;
            break;
          case "cobrand":
            mockupContent = <CoBrandMockup variant={variant} theme={theme} mockupRef={mockupRef} aspectRatio={aspectRatio} />;
            break;
          default:
            mockupContent = <StandardMockup variant={variant} theme={theme} mockupRef={mockupRef} aspectRatio={aspectRatio} />;
        }
      }
    }

    // Wrap with format-specific chrome (carousel dots, document pages, etc.)
    const adFormat = renderContext?.ad_format || variant.ad_format;
    return <>{wrapForFormat(adFormat, variant, mockupContent)}</>;
  };

  return (
    <div className={`rounded-lg border overflow-hidden transition-colors ${approved ? "border-docebo-bright-green/50 bg-docebo-bright-green/5" : "border-docebo-border bg-docebo-card/30"}`}>
      {/* Approve bar */}
      <div className={`flex items-center justify-between px-3 py-1.5 ${approved ? "bg-docebo-bright-green/15" : "bg-docebo-card/40"}`}>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleApprove}
            className={`flex items-center gap-2 text-xs font-medium px-2 py-1 rounded transition-colors cursor-pointer ${
              approved
                ? "text-docebo-bright-green"
                : "text-docebo-muted hover:text-white"
            }`}
          >
            <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
              approved
                ? "bg-docebo-bright-green border-docebo-bright-green text-docebo-midnight"
                : "border-docebo-muted hover:border-white/50"
            }`}>
              {approved && (
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            {approved ? "Approved for Figma" : "Approve for Figma"}
          </button>
          <PhoenixScoreBadge
            result={scoreResult}
            expanded={scoreExpanded}
            onToggle={() => setScoreExpanded((v) => !v)}
          />
        </div>
        <div className="flex items-center gap-1.5">
          {!isGif && showPhoenix && phoenixCandidates.length > 1 && (
            <button
              onClick={() => setTemplateIndex((i) => i + 1)}
              title={`Audition: ${TEMPLATE_LABEL[currentTemplateKey]} (${(templateIndex % phoenixCandidates.length) + 1}/${phoenixCandidates.length})`}
              className="text-xs px-2 py-1 rounded bg-docebo-blue/20 text-docebo-light-blue hover:bg-docebo-blue/40 hover:text-white transition-colors cursor-pointer font-mono"
            >
              🎲 {TEMPLATE_LABEL[currentTemplateKey]}{" "}
              <span className="opacity-60">
                {(templateIndex % phoenixCandidates.length) + 1}/{phoenixCandidates.length}
              </span>
            </button>
          )}
          {!isGif && (
            <button
              onClick={togglePhoenix}
              title="Render with the Docebo Phoenix design system"
              className="text-xs px-2 py-1 rounded bg-docebo-electric-purple/30 text-docebo-purple hover:bg-docebo-electric-purple/50 hover:text-white transition-colors cursor-pointer"
            >
              {showPhoenix ? "Show wireframe" : "✨ Phoenix render"}
            </button>
          )}
          {isGif ? (
            <button
              onClick={handleDownloadGif}
              disabled={exportingGif}
              className="text-xs px-2 py-1 rounded bg-docebo-card text-docebo-muted hover:bg-docebo-border hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              {exportingGif ? "Encoding…" : "↓ GIF"}
            </button>
          ) : (
            <button
              onClick={handleDownload}
              className="text-xs px-2 py-1 rounded bg-docebo-card text-docebo-muted hover:bg-docebo-border hover:text-white transition-colors cursor-pointer"
            >
              ↓ PNG
            </button>
          )}
        </div>
      </div>
      {scoreExpanded && <PhoenixScoreIssues result={scoreResult} />}
      {/* Variant header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-docebo-border/30">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-docebo-blue">
            {variant.variant_id}
          </span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-docebo-electric-purple/20 text-docebo-purple">
            {variant.messaging_angle || variant.ad_type}
          </span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-docebo-card text-docebo-muted">
            {variant.hook_type}
          </span>
          {variant.brand_voice && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-docebo-magenta/15 text-docebo-purple">
              {variant.brand_voice}
            </span>
          )}
          {variant.visual_style && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-docebo-pink/15 text-docebo-pink">
              {variant.visual_style}
            </span>
          )}
          <span className="text-xs px-1.5 py-0.5 rounded bg-docebo-navy/15 text-docebo-light-blue">
            {themeName}
          </span>
        </div>
      </div>

      {/* LinkedIn-style intro text */}
      <div className="px-3 pt-3">
        <p className="text-xs text-docebo-muted leading-relaxed">
          {variant.intro_text}
        </p>
      </div>

      {/* The renderable ad image */}
      <div className="p-3">
        {renderMockup()}

        {/* Below-image headline (LinkedIn feed style) */}
        <div className="mt-2 px-1">
          <p className="text-sm font-semibold text-white">
            {variant.headline}
          </p>
          <p className="text-xs text-docebo-muted mt-0.5">docebo.com</p>
        </div>
      </div>

      {/* Scores */}
      <div className="px-3 py-2 border-t border-docebo-border/30 flex items-center gap-3 flex-wrap">
        <ScoreBadge label="Voice" value={variant.self_score.voice_compliance} />
        <ScoreBadge label="Brand" value={variant.self_score.visual_brand_fit} />
        <ScoreBadge label="Diff" value={variant.self_score.differentiation} />
        <ScoreBadge label="Term" value={variant.self_score.terminology} />
      </div>

      {/* UTM tag */}
      <div className="px-3 py-2 border-t border-docebo-border/30">
        <p className="text-xs text-docebo-muted/50 font-mono break-all">
          utm: {variant.utm_content_tag}
        </p>
      </div>

      {/* Collapsible details */}
      <details className="px-3 py-2 border-t border-docebo-border/30">
        <summary className="text-xs text-docebo-muted cursor-pointer hover:text-white">
          Visual direction & image prompt
        </summary>
        <div className="mt-2 space-y-2">
          <p className="text-xs text-docebo-muted">{variant.visual_direction}</p>
          <div className="bg-docebo-midnight/50 rounded p-2">
            <p className="text-xs text-docebo-muted mb-1 font-medium">
              Gemini Image Prompt:
            </p>
            <p className="text-xs text-white/60 leading-relaxed">
              {variant.gemini_image_prompt}
            </p>
          </div>
          <div className="bg-docebo-midnight/50 rounded p-2">
            <p className="text-xs text-docebo-muted mb-1 font-medium">
              Full Mockup Description:
            </p>
            <p className="text-xs text-white/60 leading-relaxed">
              {variant.full_ad_mockup_description}
            </p>
          </div>
        </div>
      </details>

      {/* Rendering feedback */}
      <FeedbackPanel
        variantId={variant.variant_id}
        themeName={themeName}
        onSubmit={onFeedback}
      />
    </div>
  );
}

/* ── Feedback log (collapsible summary of all feedback) ─────────── */
function FeedbackLog({ entries, penalties }: { entries: FeedbackEntry[]; penalties: ThemePenalties }) {
  if (entries.length === 0) return null;

  const demotedThemes = Object.entries(penalties)
    .filter(([, p]) => p > 0)
    .sort(([, a], [, b]) => b - a);
  const promotedThemes = Object.entries(penalties)
    .filter(([, p]) => p < 0)
    .sort(([, a], [, b]) => a - b);

  return (
    <details className="mx-4 mb-3 rounded-lg border border-docebo-pink/20 bg-docebo-pink/5 overflow-hidden">
      <summary className="px-3 py-2 text-xs font-medium text-docebo-pink cursor-pointer hover:text-docebo-pink/80 flex items-center gap-1.5">
        <span>📋</span> Rendering feedback loop ({entries.length}{" "}
        {entries.length === 1 ? "note" : "notes"}) — active
        <span className="ml-auto text-docebo-bright-green/70 text-[10px] font-normal">
          feeding generation + theme ranking
        </span>
      </summary>
      {/* Loop status */}
      {(demotedThemes.length > 0 || promotedThemes.length > 0) && (
        <div className="px-3 py-2 border-b border-docebo-pink/10 bg-docebo-midnight/40">
          <p className="text-[10px] uppercase tracking-wider text-docebo-muted mb-1 font-mono">Feedback loop effects</p>
          {demotedThemes.length > 0 && (
            <p className="text-xs text-docebo-pink/80">
              Demoted: {demotedThemes.map(([t, p]) => `${t} (−${p})`).join(", ")}
            </p>
          )}
          {promotedThemes.length > 0 && (
            <p className="text-xs text-docebo-bright-green/80">
              Promoted: {promotedThemes.map(([t, p]) => `${t} (+${Math.abs(p)})`).join(", ")}
            </p>
          )}
        </div>
      )}
      <div className="px-3 pb-3 space-y-2">
        {entries.map((entry, i) => (
          <div
            key={i}
            className="text-xs border-t border-docebo-pink/10 pt-2 first:border-0 first:pt-0"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-docebo-blue">
                {entry.variant_id}
              </span>
              <span className="text-docebo-muted/40">•</span>
              <span className="text-docebo-light-blue">{entry.theme}</span>
            </div>
            {entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-1">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 rounded-full bg-docebo-pink/15 text-docebo-pink text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {entry.note && (
              <p className="text-docebo-muted italic">&ldquo;{entry.note}&rdquo;</p>
            )}
          </div>
        ))}
      </div>
    </details>
  );
}

/* ── Figma send panel ──────────────────────────────────────────── */
function FigmaSendPanel({
  variants,
  approvedIds,
  mockupRefs,
  gifExporters,
}: {
  variants: Variant[];
  approvedIds: Set<string>;
  mockupRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
  gifExporters: React.MutableRefObject<Map<string, () => Promise<Blob | null>>>;
}) {
  const [figmaUrl, setFigmaUrl] = useState("");
  const [sending, setSending] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; error?: string; figma_url?: string; zipReady?: boolean } | null>(null);

  const approvedVariants = variants.filter((v) => approvedIds.has(v.variant_id));
  const count = approvedVariants.length;

  if (count === 0) return null;

  /** Render approved mockups to PNGs and bundle into a ZIP download */
  const handleExportZip = async () => {
    setExporting(true);
    try {
      const zip = new JSZip();
      const imgFolder = zip.folder("docebo-approved-mockups");

      for (const v of approvedVariants) {
        const isGifVariant =
          isGifFormat(v.ad_format) &&
          !!v.animation_frames &&
          v.animation_frames.length > 0;

        if (isGifVariant) {
          const exporter = gifExporters.current.get(v.variant_id);
          if (!exporter) continue;
          const blob = await exporter();
          if (!blob) continue;
          const buf = await blob.arrayBuffer();
          const filename = `docebo-${v.variant_id}-${v.ad_type ?? "gif"}.gif`;
          imgFolder!.file(filename, buf);
          continue;
        }

        const el = mockupRefs.current.get(v.variant_id);
        if (!el) continue;
        const dataUrl = await toPng(el, { quality: 1, pixelRatio: 2 });
        // Convert data URL to binary
        const base64 = dataUrl.split(",")[1];
        const filename = `docebo-${v.variant_id}-${v.ad_type}.png`;
        imgFolder!.file(filename, base64, { base64: true });
      }

      // Add a brief.txt with the creative details
      const briefLines = approvedVariants.map((v) => {
        const isGifVariant =
          isGifFormat(v.ad_format) && !!v.animation_frames?.length;
        const ext = isGifVariant ? "gif" : "png";
        return [
          `━━━ ${v.variant_id} | ${v.ad_type} | ${v.hook_type} ━━━`,
          `File: docebo-${v.variant_id}-${v.ad_type}.${ext}`,
          `Headline: ${v.headline}`,
          `Overlay: ${v.creative_overlay}`,
          `CTA: ${v.cta_text}`,
          `Intro: ${v.intro_text}`,
          `Visual direction: ${v.visual_direction}`,
          `UTM: ${v.utm_content_tag}`,
          `Scores — Voice: ${v.self_score?.voice_compliance} | Brand: ${v.self_score?.visual_brand_fit} | Diff: ${v.self_score?.differentiation} | Term: ${v.self_score?.terminology}`,
          "",
        ].join("\n");
      });
      imgFolder!.file("brief.txt", briefLines.join("\n"));

      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, `docebo-approved-${count}-variants.zip`);
      setResult((prev) => ({ ...prev, zipReady: true }));
    } catch (err) {
      console.error("ZIP export failed:", err);
      setResult({ error: "Failed to export mockup PNGs" });
    } finally {
      setExporting(false);
    }
  };

  /** Post the creative brief as a Figma comment */
  const handleSendComment = async () => {
    if (!figmaUrl.trim()) return;
    setSending(true);
    setResult(null);

    try {
      // Build comment with filename references so designers can match PNGs
      const commentVariants = approvedVariants.map((v) => ({
        ...v,
        _filename: `docebo-${v.variant_id}-${v.ad_type}.png`,
      }));

      const res = await fetch("/api/figma", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          figma_url: figmaUrl.trim(),
          variants: commentVariants,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult({ success: true, figma_url: data.figma_url });
      } else {
        setResult({ error: data.error || "Failed to send" });
      }
    } catch (err) {
      setResult({ error: err instanceof Error ? err.message : "Network error" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="mx-4 mb-3 rounded-lg border border-docebo-bright-green/30 bg-docebo-bright-green/5 p-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-docebo-bright-green text-sm">✓</span>
        <span className="text-xs font-medium text-docebo-bright-green">
          {count} variant{count > 1 ? "s" : ""} approved
        </span>
      </div>

      {/* Export PNGs as ZIP */}
      <button
        onClick={handleExportZip}
        disabled={exporting}
        className="w-full text-xs px-3 py-2 rounded bg-docebo-bright-green text-docebo-midnight font-semibold hover:bg-docebo-neon-green disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center justify-center gap-2 mb-2"
      >
        {exporting ? (
          <>
            <span className="inline-block w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
            Rendering {count} mockup{count > 1 ? "s" : ""}...
          </>
        ) : (
          <>Download {count} mockup{count > 1 ? "s" : ""} + brief (ZIP)</>
        )}
      </button>

      {result?.zipReady && (
        <p className="text-[10px] text-docebo-bright-green/70 mb-2">
          ZIP downloaded — drag PNGs into your Figma file
        </p>
      )}

      {/* Optional: also post brief as Figma comment */}
      <details className="group">
        <summary className="text-[10px] text-docebo-muted cursor-pointer hover:text-white/70 mb-1">
          Also post brief as Figma comment (optional)
        </summary>
        <div className="flex gap-2 mt-1">
          <input
            type="text"
            value={figmaUrl}
            onChange={(e) => setFigmaUrl(e.target.value)}
            placeholder="Paste Figma file URL..."
            className="flex-1 text-xs bg-docebo-midnight/60 border border-docebo-border rounded px-2 py-1.5 text-white/80 placeholder-docebo-muted/40 focus:outline-none focus:border-docebo-blue/50"
          />
          <button
            onClick={handleSendComment}
            disabled={!figmaUrl.trim() || sending}
            className="text-xs px-3 py-1.5 rounded bg-docebo-card text-docebo-muted hover:bg-docebo-border hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5"
          >
            {sending ? (
              <>
                <span className="inline-block w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>Post comment</>
            )}
          </button>
        </div>
      </details>

      {result?.success && (
        <div className="mt-2 flex items-center gap-2 text-xs text-docebo-bright-green">
          <span>✓</span> Brief posted as comment —{" "}
          <a
            href={result.figma_url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-docebo-neon-green"
          >
            Open in Figma
          </a>
        </div>
      )}
      {result?.error && (
        <div className="mt-2 text-xs text-red-400">
          Error: {result.error}
        </div>
      )}
    </div>
  );
}

/* ── Compute theme penalty scores from feedback history ────────── */
function computeThemePenalties(entries: FeedbackEntry[]): ThemePenalties {
  const penalties: ThemePenalties = {};
  const positiveLabels = new Set(["Great mockup", "On brand"]);

  for (const entry of entries) {
    if (!penalties[entry.theme]) penalties[entry.theme] = 0;
    for (const tag of entry.tags) {
      if (positiveLabels.has(tag)) {
        penalties[entry.theme] -= 1; // reward good themes
      } else {
        penalties[entry.theme] += 2; // penalise bad themes more heavily
      }
    }
  }
  return penalties;
}

/* ── Brand Voice Card (pre-prompt showcase) ───────────────────── */
const STAGE_COLORS: Record<string, string> = {
  "Brand Foundation": "bg-docebo-blue/15 text-docebo-light-blue",
  "Cold — Awareness": "bg-docebo-pink/15 text-docebo-pink",
  "Warm — Consideration": "bg-docebo-neon-green/15 text-docebo-neon-green",
  "Pain-Aware — Mid-Funnel": "bg-docebo-electric-purple/15 text-docebo-purple",
  "Niche — Use-Case Specific": "bg-docebo-bright-green/15 text-docebo-bright-green",
};

function BrandVoiceCard({ voice }: { voice: BrandVoiceOption }) {
  const [expanded, setExpanded] = useState(false);
  const stageClass = STAGE_COLORS[voice.stage] ?? "bg-docebo-card text-docebo-muted";
  const toneParts = voice.toneMix.split(" / ");
  const hasFullGuide = !!(voice.voicePillars || voice.examples);

  return (
    <div className="rounded-lg border border-docebo-border bg-docebo-card/60 hover:border-docebo-muted/40 transition-colors">
      {/* Header — always visible */}
      <button
        onClick={() => hasFullGuide && setExpanded(!expanded)}
        className={`w-full text-left p-3 ${hasFullGuide ? "cursor-pointer" : "cursor-default"}`}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-white leading-tight">
              {voice.label}
            </h3>
            {hasFullGuide && (
              <span className="text-[10px] px-1 py-0.5 rounded bg-docebo-blue/15 text-docebo-blue font-medium">
                Full Guide
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap font-medium ${stageClass}`}>
              {voice.stage}
            </span>
            {hasFullGuide && (
              <svg className={`w-3.5 h-3.5 text-docebo-muted transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </div>
        </div>
        <p className="text-xs text-docebo-muted line-clamp-2">{voice.desc}</p>
        {(!hasFullGuide || expanded) && (
          <>
            {voice.positioning && (
              <div className="text-[10px] text-docebo-muted mt-2 border-l-2 border-docebo-border pl-2">
                <span className="text-docebo-muted/50">From:</span> {voice.positioning.from}<br />
                <span className="text-docebo-muted/50">To:</span> <span className="text-white/80">{voice.positioning.to}</span>
              </div>
            )}
            <p className="text-[10px] text-docebo-muted mt-2">
              <span className="text-white/70 font-medium">Core Energy:</span> {voice.coreEnergy}
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {toneParts.map((part) => (
                <span key={part} className="text-[10px] px-1.5 py-0.5 rounded bg-docebo-card text-docebo-muted">
                  {part.trim()}
                </span>
              ))}
            </div>
          </>
        )}
      </button>

      {/* Expanded guide content */}
      {expanded && (
        <div className="border-t border-docebo-border p-3 space-y-3">
          {/* Voice Pillars */}
          {voice.voicePillars && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-docebo-muted mb-1.5 font-mono">Voice Pillars</p>
              <div className="space-y-2">
                {voice.voicePillars.map((p) => (
                  <div key={p.name} className="bg-docebo-midnight/60 rounded p-2">
                    <p className="text-xs font-medium text-white mb-1">{p.name}</p>
                    <p className="text-[10px] text-docebo-muted mb-1.5">{p.desc}</p>
                    <div className="grid grid-cols-[auto_1fr] gap-x-1.5 text-[10px]">
                      <span className="text-docebo-pink/70">Instead of:</span>
                      <span className="text-docebo-muted italic line-through decoration-docebo-border">{p.insteadOf}</span>
                      <span className="text-docebo-bright-green/70">Say:</span>
                      <span className="text-white/80">{p.say}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tone Spectrum */}
          {voice.toneSpectrum && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-docebo-muted mb-1.5 font-mono">Tone Spectrum</p>
              <div className="space-y-1">
                {voice.toneSpectrum.map((t) => (
                  <div key={t.context} className="text-[10px]">
                    <span className="text-white/70 font-medium">{t.context}:</span>{" "}
                    <span className="text-docebo-muted">{t.mix}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Examples */}
          {voice.examples && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-docebo-muted mb-1.5 font-mono">Examples</p>
              <div className="space-y-1.5">
                {voice.examples.map((e) => (
                  <div key={e.format} className="text-[10px]">
                    <span className="text-docebo-blue/70 font-medium">{e.format}:</span>{" "}
                    <span className="text-white/80 italic">"{e.text}"</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Don'ts */}
          {voice.donts && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-docebo-muted mb-1.5 font-mono">Don'ts</p>
              <ul className="space-y-0.5">
                {voice.donts.map((d) => (
                  <li key={d} className="text-[10px] text-docebo-pink/70">{d}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Principles */}
          {voice.principles && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-docebo-muted mb-1.5 font-mono">Voice Principles</p>
              <div className="space-y-1">
                {voice.principles.map((p) => (
                  <div key={p.name} className="text-[10px]">
                    <span className="text-white/80 font-medium">{p.name}:</span>{" "}
                    <span className="text-docebo-muted">{p.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Taglines */}
          {voice.taglines && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-docebo-muted mb-1.5 font-mono">Tagline Options</p>
              <div className="flex flex-wrap gap-1.5">
                {voice.taglines.map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-docebo-card text-white/80 italic">
                    "{t}"
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Promise */}
          {voice.promise && (
            <div className="border-t border-docebo-border/30 pt-2 mt-2">
              <p className="text-[10px] italic text-docebo-muted">{voice.promise}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Grid of all variants ──────────────────────────────────────── */
export default function AdCanvas({ variants, renderContext }: AdCanvasProps) {
  const [feedbackLog, setFeedbackLog] = useState<FeedbackEntry[]>([]);
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());
  const [selectedStyle, setSelectedStyle] = useState<AdTheme | "mix" | null>(null);
  const mockupRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const gifExporters = useRef<Map<string, () => Promise<Blob | null>>>(new Map());

  // Reset style selection when new variants arrive
  useEffect(() => {
    setSelectedStyle(null);
    setApprovedIds(new Set());
  }, [variants]);

  // Load persisted feedback on mount
  useEffect(() => {
    fetch("/api/feedback")
      .then((r) => r.json())
      .then((data) => {
        if (data.entries?.length) setFeedbackLog(data.entries);
      })
      .catch(() => {}); // silent — feedback is non-critical
  }, []);

  const themePenalties = computeThemePenalties(feedbackLog);

  const handleFeedback = useCallback((entry: FeedbackEntry) => {
    setFeedbackLog((prev) => [...prev, entry]);
    // Persist to API (fire-and-forget)
    fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    }).catch(() => {});
  }, []);

  const toggleApprove = useCallback((variantId: string) => {
    setApprovedIds((prev) => {
      const next = new Set(prev);
      if (next.has(variantId)) {
        next.delete(variantId);
      } else {
        next.add(variantId);
      }
      return next;
    });
  }, []);

  if (variants.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 border-b border-docebo-border">
          <h2 className="text-base font-semibold text-white font-headline tracking-tight">Brand voice guides</h2>
          <p className="text-xs text-docebo-muted mt-0.5">
            {BRAND_VOICE_OPTIONS.length} voices — select a campaign to generate mockups
          </p>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {BRAND_VOICE_OPTIONS.map((voice) => (
            <BrandVoiceCard key={voice.id} voice={voice} />
          ))}
        </div>
      </div>
    );
  }

  // Show style picker before rendering
  if (selectedStyle === null) {
    return <StylePicker onSelect={setSelectedStyle} />;
  }

  // Compute forced theme for individual style selection
  const forcedTheme = selectedStyle !== "mix" ? selectedStyle : undefined;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-docebo-border flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-sm font-semibold text-white font-headline">
            Ad mockups ({variants.length})
          </h2>
          <span className="text-xs px-1.5 py-0.5 rounded bg-docebo-blue/15 text-docebo-blue font-mono">
            {selectedStyle === "mix"
              ? "Mix"
              : STYLE_OPTIONS.find((s) => s.theme === selectedStyle)?.label ?? selectedStyle}
          </span>
          {renderContext && (
            <>
              <span className="text-xs px-1.5 py-0.5 rounded bg-docebo-pink/15 text-docebo-pink">
                {renderContext.visual_style}
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-docebo-bright-green/15 text-docebo-bright-green">
                {renderContext.ad_format} ({renderContext.dimensions.label})
              </span>
            </>
          )}
        </div>
        <button
          onClick={() => setSelectedStyle(null)}
          className="text-xs text-docebo-muted hover:text-docebo-blue transition-colors cursor-pointer"
        >
          Change style
        </button>
      </div>

      {/* Figma send panel (shows when variants are approved) */}
      <FigmaSendPanel variants={variants} approvedIds={approvedIds} mockupRefs={mockupRefs} gifExporters={gifExporters} />

      {/* Feedback log (shows after any feedback is submitted) */}
      <FeedbackLog entries={feedbackLog} penalties={themePenalties} />

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {variants.map((v, i) => (
          <AdMockup
            key={v.variant_id || i}
            variant={v}
            index={i}
            onFeedback={handleFeedback}
            approved={approvedIds.has(v.variant_id)}
            onToggleApprove={() => toggleApprove(v.variant_id)}
            themePenalties={themePenalties}
            forcedTheme={forcedTheme}
            mockupRefs={mockupRefs}
            gifExporters={gifExporters}
            renderContext={renderContext}
          />
        ))}
      </div>
    </div>
  );
}
