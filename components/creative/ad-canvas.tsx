"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { Variant, CanvasRenderContext } from "./refresh-engine";
import { BRAND_VOICE_OPTIONS, type BrandVoiceOption } from "./refresh-engine";

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
type AdTheme =
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

interface ThemeConfig {
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

const THEMES: Record<AdTheme, ThemeConfig> = {
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
      <div className="px-4 py-3 border-b border-gray-700/50">
        <h2 className="text-sm font-semibold text-white">
          Choose a Rendering Style
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Select how your mockups should look
        </p>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-3">
        {/* Mix option — always first */}
        <button
          onClick={() => onSelect("mix")}
          className="w-full text-left rounded-lg border-2 border-dashed border-cyan-500/40 bg-cyan-500/5 hover:border-cyan-400/60 hover:bg-cyan-500/10 transition-all cursor-pointer p-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden flex">
              {["#0033A0", "#E6DACB", "#7E2EE9", "#FF5DD8", "#E3FFAB"].map((c) => (
                <div key={c} className="flex-1 h-full" style={{ backgroundColor: c }} />
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-cyan-300">
                Show me a mix
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
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
                className="text-left rounded-lg border border-gray-700/50 bg-gray-800/30 hover:border-gray-500/50 hover:bg-gray-800/60 transition-all cursor-pointer p-2.5 group"
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
                <p className="text-xs font-medium text-gray-200 group-hover:text-white transition-colors">
                  {label}
                </p>
                <p className="text-[10px] text-gray-600 mt-0.5 leading-snug">
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
      ? "text-emerald-400"
      : value >= 7
        ? "text-cyan-400"
        : "text-amber-400";
  return (
    <span className="text-xs text-gray-500">
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
  const headlineWords = variant.headline.split(" ");
  const splitAt = Math.max(1, headlineWords.length - 2);
  const headlinePrimary = headlineWords.slice(0, splitAt).join(" ");
  const headlineAccent = headlineWords.slice(splitAt).join(" ");

  return (
    <div
      ref={mockupRef}
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: theme.bg,
        background: theme.bgGradient || theme.bg,
        aspectRatio: aspectRatio || "1 / 1",
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
        <div style={{ maxWidth: "85%", marginTop: "5%" }}>
          <h2
            style={{
              color: theme.headlineColor,
              fontFamily:
                "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(24px, 7vw, 52px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
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
                fontSize: "clamp(24px, 7vw, 52px)",
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                margin: 0,
                fontStyle:
                  "italic",
              }}
            >
              {headlineAccent}
            </h2>
          )}

          <p
            style={{
              color: theme.subColor,
              fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
              fontWeight: 400,
              fontSize: "clamp(12px, 2.5vw, 20px)",
              lineHeight: 1.4,
              marginTop: "6%",
              maxWidth: "90%",
            }}
          >
            {variant.creative_overlay}
          </p>
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
              fontSize: "clamp(14px, 2.8vw, 24px)",
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
              fontSize: "clamp(11px, 2vw, 16px)",
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
  return (
    <div
      ref={mockupRef}
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: theme.bg,
        aspectRatio: aspectRatio || "1 / 1",
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
                fontSize: "clamp(14px, 3vw, 22px)",
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
            fontSize: "clamp(14px, 2.8vw, 22px)",
            letterSpacing: "-0.01em",
            marginBottom: "8%",
          }}
        >
          docebo
        </span>

        {/* Headline */}
        <h2
          style={{
            color: "#0033A0",
            fontFamily:
              "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(28px, 8vw, 56px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          {variant.headline}
        </h2>

        {/* Subtitle */}
        <p
          style={{
            color: "#0033A0",
            fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(13px, 2.8vw, 22px)",
            lineHeight: 1.35,
            marginTop: "5%",
            maxWidth: "80%",
          }}
        >
          {variant.creative_overlay}
        </p>
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
          fontSize: "clamp(60px, 16vw, 120px)",
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
            fontSize: "clamp(20px, 5.5vw, 42px)",
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
              fontSize: "clamp(14px, 3vw, 22px)",
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
              fontSize: "clamp(10px, 2vw, 15px)",
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
            fontSize: "clamp(12px, 2.5vw, 20px)",
          }}
        >
          docebo
        </span>
        <span
          style={{
            color: "#0033A0",
            fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
            fontWeight: 300,
            fontSize: "clamp(10px, 2vw, 16px)",
          }}
        >
          |
        </span>
        <span
          style={{
            color: "#0033A0",
            fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(10px, 2vw, 16px)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          partner
        </span>
      </div>

      {/* Headline */}
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
            fontSize: "clamp(26px, 8vw, 58px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          {variant.headline}
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
            fontSize: "clamp(12px, 2.5vw, 18px)",
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
      <div className="px-3 py-2 border-t border-gray-700/30">
        <button
          onClick={() => setIsOpen(true)}
          className="text-xs text-gray-500 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>💬</span> Add feedback for rendering engine
        </button>
      </div>
    );
  }

  return (
    <div className="px-3 py-3 border-t border-gray-700/30 bg-gray-800/50">
      {submitted ? (
        <div className="flex items-center gap-2 text-xs text-emerald-400">
          <span>✓</span> Feedback saved — active in generation loop + theme ranking
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-300">
              Rendering feedback
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-gray-600 hover:text-gray-400 cursor-pointer"
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
                    ? "border-amber-500/50 bg-amber-500/15 text-amber-300"
                    : "border-gray-700 bg-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-400"
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
            className="w-full text-xs bg-gray-900/60 border border-gray-700/50 rounded px-2 py-1.5 text-gray-300 placeholder-gray-600 resize-none focus:outline-none focus:border-gray-500 mb-2"
          />

          <button
            onClick={handleSubmit}
            disabled={selectedTags.length === 0 && !note.trim()}
            className="text-xs px-3 py-1 rounded bg-amber-600 text-white hover:bg-amber-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Save feedback
          </button>
        </>
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
  renderContext?: CanvasRenderContext;
}) {
  const mockupRef = useRef<HTMLDivElement>(null);
  const visualStyle = renderContext?.visual_style || variant.visual_style;
  const themeName = forcedTheme || pickTheme(index, themePenalties, visualStyle);
  const theme = THEMES[themeName];
  const aspectRatio = renderContext?.aspectRatio;

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

  const renderMockup = () => {
    switch (theme.layout) {
      case "wave":
        return (
          <WaveMockup
            variant={variant}
            theme={theme}
            mockupRef={mockupRef}
            aspectRatio={aspectRatio}
          />
        );
      case "quote":
        return (
          <QuoteMockup
            variant={variant}
            theme={theme}
            mockupRef={mockupRef}
            aspectRatio={aspectRatio}
          />
        );
      case "cobrand":
        return (
          <CoBrandMockup
            variant={variant}
            theme={theme}
            mockupRef={mockupRef}
            aspectRatio={aspectRatio}
          />
        );
      default:
        return (
          <StandardMockup
            variant={variant}
            theme={theme}
            mockupRef={mockupRef}
            aspectRatio={aspectRatio}
          />
        );
    }
  };

  return (
    <div className={`rounded-lg border overflow-hidden transition-colors ${approved ? "border-emerald-500/50 bg-emerald-500/5" : "border-gray-700/50 bg-gray-800/30"}`}>
      {/* Approve bar */}
      <div className={`flex items-center justify-between px-3 py-1.5 ${approved ? "bg-emerald-500/15" : "bg-gray-700/20"}`}>
        <button
          onClick={onToggleApprove}
          className={`flex items-center gap-2 text-xs font-medium px-2 py-1 rounded transition-colors cursor-pointer ${
            approved
              ? "text-emerald-300"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${
            approved
              ? "bg-emerald-500 border-emerald-500 text-white"
              : "border-gray-500 hover:border-gray-300"
          }`}>
            {approved && (
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </span>
          {approved ? "Approved for Figma" : "Approve for Figma"}
        </button>
        <button
          onClick={handleDownload}
          className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors cursor-pointer"
        >
          ↓ PNG
        </button>
      </div>

      {/* Variant header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700/30">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-cyan-400">
            {variant.variant_id}
          </span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">
            {variant.messaging_angle || variant.ad_type}
          </span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-gray-700/50 text-gray-400">
            {variant.hook_type}
          </span>
          {variant.brand_voice && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400">
              {variant.brand_voice}
            </span>
          )}
          {variant.visual_style && (
            <span className="text-xs px-1.5 py-0.5 rounded bg-pink-500/15 text-pink-400">
              {variant.visual_style}
            </span>
          )}
          <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">
            {themeName}
          </span>
        </div>
      </div>

      {/* LinkedIn-style intro text */}
      <div className="px-3 pt-3">
        <p className="text-xs text-gray-400 leading-relaxed">
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
          <p className="text-xs text-gray-500 mt-0.5">docebo.com</p>
        </div>
      </div>

      {/* Scores */}
      <div className="px-3 py-2 border-t border-gray-700/30 flex items-center gap-3 flex-wrap">
        <ScoreBadge label="Voice" value={variant.self_score.voice_compliance} />
        <ScoreBadge label="Brand" value={variant.self_score.visual_brand_fit} />
        <ScoreBadge label="Diff" value={variant.self_score.differentiation} />
        <ScoreBadge label="Term" value={variant.self_score.terminology} />
      </div>

      {/* UTM tag */}
      <div className="px-3 py-2 border-t border-gray-700/30">
        <p className="text-xs text-gray-600 font-mono break-all">
          utm: {variant.utm_content_tag}
        </p>
      </div>

      {/* Collapsible details */}
      <details className="px-3 py-2 border-t border-gray-700/30">
        <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-300">
          Visual direction & image prompt
        </summary>
        <div className="mt-2 space-y-2">
          <p className="text-xs text-gray-400">{variant.visual_direction}</p>
          <div className="bg-gray-900/50 rounded p-2">
            <p className="text-xs text-gray-500 mb-1 font-medium">
              Gemini Image Prompt:
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              {variant.gemini_image_prompt}
            </p>
          </div>
          <div className="bg-gray-900/50 rounded p-2">
            <p className="text-xs text-gray-500 mb-1 font-medium">
              Full Mockup Description:
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
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
    <details className="mx-4 mb-3 rounded-lg border border-amber-500/20 bg-amber-500/5 overflow-hidden">
      <summary className="px-3 py-2 text-xs font-medium text-amber-400 cursor-pointer hover:text-amber-300 flex items-center gap-1.5">
        <span>📋</span> Rendering feedback loop ({entries.length}{" "}
        {entries.length === 1 ? "note" : "notes"}) — active
        <span className="ml-auto text-emerald-400/70 text-[10px] font-normal">
          feeding generation + theme ranking
        </span>
      </summary>
      {/* Loop status */}
      {(demotedThemes.length > 0 || promotedThemes.length > 0) && (
        <div className="px-3 py-2 border-b border-amber-500/10 bg-gray-900/40">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Feedback loop effects</p>
          {demotedThemes.length > 0 && (
            <p className="text-xs text-red-400/80">
              Demoted: {demotedThemes.map(([t, p]) => `${t} (−${p})`).join(", ")}
            </p>
          )}
          {promotedThemes.length > 0 && (
            <p className="text-xs text-emerald-400/80">
              Promoted: {promotedThemes.map(([t, p]) => `${t} (+${Math.abs(p)})`).join(", ")}
            </p>
          )}
        </div>
      )}
      <div className="px-3 pb-3 space-y-2">
        {entries.map((entry, i) => (
          <div
            key={i}
            className="text-xs border-t border-amber-500/10 pt-2 first:border-0 first:pt-0"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-cyan-400">
                {entry.variant_id}
              </span>
              <span className="text-gray-600">•</span>
              <span className="text-blue-400">{entry.theme}</span>
            </div>
            {entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-1">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {entry.note && (
              <p className="text-gray-400 italic">&ldquo;{entry.note}&rdquo;</p>
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
}: {
  variants: Variant[];
  approvedIds: Set<string>;
  mockupRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
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
        const el = mockupRefs.current.get(v.variant_id);
        if (!el) continue;
        const dataUrl = await toPng(el, { quality: 1, pixelRatio: 2 });
        // Convert data URL to binary
        const base64 = dataUrl.split(",")[1];
        const filename = `docebo-${v.variant_id}-${v.ad_type}.png`;
        imgFolder!.file(filename, base64, { base64: true });
      }

      // Add a brief.txt with the creative details
      const briefLines = approvedVariants.map((v) =>
        [
          `━━━ ${v.variant_id} | ${v.ad_type} | ${v.hook_type} ━━━`,
          `File: docebo-${v.variant_id}-${v.ad_type}.png`,
          `Headline: ${v.headline}`,
          `Overlay: ${v.creative_overlay}`,
          `CTA: ${v.cta_text}`,
          `Intro: ${v.intro_text}`,
          `Visual direction: ${v.visual_direction}`,
          `UTM: ${v.utm_content_tag}`,
          `Scores — Voice: ${v.self_score?.voice_compliance} | Brand: ${v.self_score?.visual_brand_fit} | Diff: ${v.self_score?.differentiation} | Term: ${v.self_score?.terminology}`,
          "",
        ].join("\n")
      );
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
    <div className="mx-4 mb-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-emerald-400 text-sm">✓</span>
        <span className="text-xs font-medium text-emerald-300">
          {count} variant{count > 1 ? "s" : ""} approved
        </span>
      </div>

      {/* Export PNGs as ZIP */}
      <button
        onClick={handleExportZip}
        disabled={exporting}
        className="w-full text-xs px-3 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center justify-center gap-2 mb-2"
      >
        {exporting ? (
          <>
            <span className="inline-block w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
            Rendering {count} mockup{count > 1 ? "s" : ""} to PNG...
          </>
        ) : (
          <>Download {count} PNG{count > 1 ? "s" : ""} + brief (ZIP)</>
        )}
      </button>

      {result?.zipReady && (
        <p className="text-[10px] text-emerald-400/70 mb-2">
          ZIP downloaded — drag PNGs into your Figma file
        </p>
      )}

      {/* Optional: also post brief as Figma comment */}
      <details className="group">
        <summary className="text-[10px] text-gray-500 cursor-pointer hover:text-gray-400 mb-1">
          Also post brief as Figma comment (optional)
        </summary>
        <div className="flex gap-2 mt-1">
          <input
            type="text"
            value={figmaUrl}
            onChange={(e) => setFigmaUrl(e.target.value)}
            placeholder="Paste Figma file URL..."
            className="flex-1 text-xs bg-gray-900/60 border border-gray-700/50 rounded px-2 py-1.5 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-emerald-500/50"
          />
          <button
            onClick={handleSendComment}
            disabled={!figmaUrl.trim() || sending}
            className="text-xs px-3 py-1.5 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5"
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
        <div className="mt-2 flex items-center gap-2 text-xs text-emerald-400">
          <span>✓</span> Brief posted as comment —{" "}
          <a
            href={result.figma_url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-emerald-300"
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
  "Brand Foundation": "bg-cyan-500/15 text-cyan-400",
  "Cold — Awareness": "bg-red-500/15 text-red-400",
  "Warm — Consideration": "bg-amber-500/15 text-amber-400",
  "Pain-Aware — Mid-Funnel": "bg-purple-500/15 text-purple-400",
  "Niche — Use-Case Specific": "bg-emerald-500/15 text-emerald-400",
};

function BrandVoiceCard({ voice }: { voice: BrandVoiceOption }) {
  const [expanded, setExpanded] = useState(false);
  const stageClass = STAGE_COLORS[voice.stage] ?? "bg-gray-500/15 text-gray-400";
  const toneParts = voice.toneMix.split(" / ");
  const hasFullGuide = !!(voice.voicePillars || voice.examples);

  return (
    <div className="rounded-lg border border-gray-700/50 bg-gray-800/60 hover:border-gray-600 transition-colors">
      {/* Header — always visible */}
      <button
        onClick={() => hasFullGuide && setExpanded(!expanded)}
        className={`w-full text-left p-3 ${hasFullGuide ? "cursor-pointer" : "cursor-default"}`}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white leading-tight">
              {voice.label}
            </h3>
            {hasFullGuide && (
              <span className="text-[10px] px-1 py-0.5 rounded bg-cyan-500/15 text-cyan-400 font-medium">
                Full Guide
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap font-medium ${stageClass}`}>
              {voice.stage}
            </span>
            {hasFullGuide && (
              <svg className={`w-3.5 h-3.5 text-gray-500 transition-transform ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-400 mb-2">{voice.desc}</p>
        {voice.positioning && (
          <div className="text-[10px] text-gray-500 mb-2 border-l-2 border-gray-700 pl-2">
            <span className="text-gray-600">From:</span> {voice.positioning.from}<br />
            <span className="text-gray-600">To:</span> <span className="text-gray-300">{voice.positioning.to}</span>
          </div>
        )}
        <p className="text-[10px] text-gray-500 mb-1.5">
          <span className="text-gray-400 font-medium">Core Energy:</span> {voice.coreEnergy}
        </p>
        <div className="flex flex-wrap gap-1">
          {toneParts.map((part) => (
            <span key={part} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-700/60 text-gray-400">
              {part.trim()}
            </span>
          ))}
        </div>
      </button>

      {/* Expanded guide content */}
      {expanded && (
        <div className="border-t border-gray-700/50 p-3 space-y-3">
          {/* Voice Pillars */}
          {voice.voicePillars && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1.5">Voice Pillars</p>
              <div className="space-y-2">
                {voice.voicePillars.map((p) => (
                  <div key={p.name} className="bg-gray-900/60 rounded p-2">
                    <p className="text-xs font-medium text-white mb-1">{p.name}</p>
                    <p className="text-[10px] text-gray-400 mb-1.5">{p.desc}</p>
                    <div className="grid grid-cols-[auto_1fr] gap-x-1.5 text-[10px]">
                      <span className="text-red-400/70">Instead of:</span>
                      <span className="text-gray-500 italic line-through decoration-gray-700">{p.insteadOf}</span>
                      <span className="text-emerald-400/70">Say:</span>
                      <span className="text-gray-300">{p.say}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tone Spectrum */}
          {voice.toneSpectrum && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1.5">Tone Spectrum</p>
              <div className="space-y-1">
                {voice.toneSpectrum.map((t) => (
                  <div key={t.context} className="text-[10px]">
                    <span className="text-gray-400 font-medium">{t.context}:</span>{" "}
                    <span className="text-gray-500">{t.mix}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Examples */}
          {voice.examples && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1.5">Examples</p>
              <div className="space-y-1.5">
                {voice.examples.map((e) => (
                  <div key={e.format} className="text-[10px]">
                    <span className="text-cyan-400/70 font-medium">{e.format}:</span>{" "}
                    <span className="text-gray-300 italic">"{e.text}"</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Don'ts */}
          {voice.donts && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1.5">Don'ts</p>
              <ul className="space-y-0.5">
                {voice.donts.map((d) => (
                  <li key={d} className="text-[10px] text-red-400/70">{d}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Principles */}
          {voice.principles && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1.5">Voice Principles</p>
              <div className="space-y-1">
                {voice.principles.map((p) => (
                  <div key={p.name} className="text-[10px]">
                    <span className="text-gray-300 font-medium">{p.name}:</span>{" "}
                    <span className="text-gray-500">{p.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Taglines */}
          {voice.taglines && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1.5">Tagline Options</p>
              <div className="flex flex-wrap gap-1.5">
                {voice.taglines.map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-700/60 text-gray-300 italic">
                    "{t}"
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Promise */}
          {voice.promise && (
            <div className="border-t border-gray-700/30 pt-2 mt-2">
              <p className="text-[10px] italic text-gray-400">{voice.promise}</p>
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
        <div className="px-4 py-3 border-b border-gray-700/50">
          <h2 className="text-sm font-semibold text-white">Brand Voice Guides</h2>
          <p className="text-xs text-gray-500 mt-0.5">
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
      <div className="px-4 py-3 border-b border-gray-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-sm font-semibold text-white">
            Ad Mockups ({variants.length})
          </h2>
          <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-400 font-mono">
            {selectedStyle === "mix"
              ? "Mix"
              : STYLE_OPTIONS.find((s) => s.theme === selectedStyle)?.label ?? selectedStyle}
          </span>
          {renderContext && (
            <>
              <span className="text-xs px-1.5 py-0.5 rounded bg-pink-500/15 text-pink-400">
                {renderContext.visual_style}
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400">
                {renderContext.ad_format} ({renderContext.dimensions.label})
              </span>
            </>
          )}
        </div>
        <button
          onClick={() => setSelectedStyle(null)}
          className="text-xs text-gray-500 hover:text-cyan-400 transition-colors cursor-pointer"
        >
          Change style
        </button>
      </div>

      {/* Figma send panel (shows when variants are approved) */}
      <FigmaSendPanel variants={variants} approvedIds={approvedIds} mockupRefs={mockupRefs} />

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
            renderContext={renderContext}
          />
        ))}
      </div>
    </div>
  );
}
