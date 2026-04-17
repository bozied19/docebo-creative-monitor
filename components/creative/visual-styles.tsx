"use client";

import { useState } from "react";
import type { ThemeConfig } from "./ad-canvas";
import type { Variant } from "./refresh-engine";

/* ══════════════════════════════════════════════════════════════════
   VISUAL STYLE RENDERERS

   Each of the 7 visual styles from the UTM taxonomy gets its own
   renderer producing a genuinely distinctive layout, not just a
   color swap. The ThemeConfig still controls the palette — the
   style renderer controls layout, decorative elements, and
   visual personality.
   ══════════════════════════════════════════════════════════════════ */

export interface StyleRendererProps {
  variant: Variant;
  theme: ThemeConfig;
  mockupRef: React.RefObject<HTMLDivElement | null>;
  aspectRatio?: string;
}

/* ── Shared helper: split overlay into primary + accent ─────────── */
function splitOverlay(text: string) {
  const words = text.split(" ");
  const splitAt = Math.max(1, words.length - 2);
  return {
    primary: words.slice(0, splitAt).join(" "),
    accent: words.slice(splitAt).join(" "),
  };
}

/* ══════════════════════════════════════════════════════════════════
   1. NEON INTELLIGENCE
   Dark base, circuit grid pattern, glowing headline, neon accents,
   floating metric pill. High-conversion performance energy.
   ══════════════════════════════════════════════════════════════════ */

export function NeonIntelligenceMockup({ variant, theme, mockupRef, aspectRatio }: StyleRendererProps) {
  const { primary, accent } = splitOverlay(variant.creative_overlay);
  const subtext = variant.overlay_subtext || variant.intro_text?.split(/\.\s+/)[0]?.slice(0, 100) || "";

  return (
    <div
      ref={mockupRef}
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: "#0A0A0A",
        aspectRatio: aspectRatio || "1 / 1",
        containerType: "inline-size",
      }}
    >
      {/* Circuit grid pattern */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.06, pointerEvents: "none" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="neon-grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M60 0 L0 0 0 60" fill="none" stroke={theme.accentColor} strokeWidth="0.5" />
            <circle cx="0" cy="0" r="1.5" fill={theme.accentColor} />
            <circle cx="60" cy="0" r="1.5" fill={theme.accentColor} />
            <circle cx="0" cy="60" r="1.5" fill={theme.accentColor} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#neon-grid)" />
      </svg>

      {/* Corner glow — radial gradient */}
      <div
        className="absolute"
        style={{
          top: "-20%",
          right: "-20%",
          width: "70%",
          height: "70%",
          background: `radial-gradient(circle, ${theme.accentColor}25 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Bottom edge glow line */}
      <div
        className="absolute"
        style={{
          bottom: 0,
          left: "8%",
          right: "8%",
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${theme.accentColor}, transparent)`,
          boxShadow: `0 0 20px ${theme.accentColor}60, 0 0 60px ${theme.accentColor}30`,
          pointerEvents: "none",
        }}
      />

      {/* Vertical accent bar left */}
      <div
        className="absolute"
        style={{
          top: "15%",
          left: "6%",
          width: "3px",
          height: "30%",
          background: theme.accentColor,
          boxShadow: `0 0 12px ${theme.accentColor}80`,
          borderRadius: "2px",
          pointerEvents: "none",
        }}
      />

      {/* Main content */}
      <div
        className="absolute inset-0 flex flex-col justify-between"
        style={{ padding: "10%" }}
      >
        <div style={{ maxWidth: "95%", marginTop: "2%", marginLeft: "4%" }}>
          {/* Headline with glow */}
          <h2
            style={{
              color: "#FFFFFF",
              fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(40px, 13cqw, 150px)",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              margin: 0,
              fontStyle: "italic",
              textShadow: `0 0 40px ${theme.accentColor}40, 0 0 80px ${theme.accentColor}20`,
            }}
          >
            {primary}
          </h2>
          {accent && (
            <h2
              style={{
                color: theme.accentColor,
                fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(40px, 13cqw, 150px)",
                lineHeight: 1.0,
                letterSpacing: "-0.03em",
                margin: 0,
                fontStyle: "italic",
                textShadow: `0 0 30px ${theme.accentColor}60`,
              }}
            >
              {accent}
            </h2>
          )}

          {subtext && (
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
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
        </div>

        {/* Floating metric pill (when stat_value exists) */}
        {variant.stat_value && (
          <div
            className="absolute"
            style={{
              top: "10%",
              right: "8%",
              padding: "2% 4%",
              borderRadius: "999px",
              border: `1px solid ${theme.accentColor}40`,
              backgroundColor: `${theme.accentColor}15`,
              backdropFilter: "blur(8px)",
            }}
          >
            <span
              style={{
                color: theme.accentColor,
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 700,
                fontSize: "clamp(14px, 3cqw, 28px)",
                textShadow: `0 0 12px ${theme.accentColor}60`,
              }}
            >
              {variant.stat_value}
            </span>
          </div>
        )}

        {/* Bottom row */}
        <div className="flex items-end justify-between" style={{ width: "100%" }}>
          <span
            style={{
              color: "#FFFFFF",
              fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(14px, 2.8cqw, 24px)",
              letterSpacing: "-0.01em",
              opacity: 0.9,
            }}
          >
            docebo
          </span>
          <span
            style={{
              color: theme.accentColor,
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 600,
              fontSize: "clamp(11px, 2cqw, 16px)",
              padding: "1.5% 4%",
              border: `1px solid ${theme.accentColor}50`,
              borderRadius: "4px",
              textShadow: `0 0 8px ${theme.accentColor}40`,
            }}
          >
            {variant.cta_text} →
          </span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   2. HUMAN CONTRAST
   Light neutral bg, large image placeholder, editorial spacing,
   single bold accent. Soft humanity vs sharp intelligence.
   ══════════════════════════════════════════════════════════════════ */

export function HumanContrastMockup({ variant, theme, mockupRef, aspectRatio }: StyleRendererProps) {
  const subtext = variant.overlay_subtext || variant.intro_text?.split(/\.\s+/)[0]?.slice(0, 100) || "";

  return (
    <div
      ref={mockupRef}
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: "#F6F5F2",
        aspectRatio: aspectRatio || "1 / 1",
        containerType: "inline-size",
      }}
    >
      {/* Image placeholder — large right-side block */}
      <div
        className="absolute"
        style={{
          top: "6%",
          right: "6%",
          width: "42%",
          height: "65%",
          backgroundColor: "#EBE6DD",
          borderRadius: "clamp(8px, 2cqw, 20px)",
          overflow: "hidden",
        }}
      >
        {/* Silhouette placeholder */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: 0.25 }}
        >
          <svg viewBox="0 0 120 160" style={{ width: "60%", height: "70%" }}>
            <ellipse cx="60" cy="50" rx="28" ry="32" fill={theme.accentColor || "#0033A0"} />
            <ellipse cx="60" cy="140" rx="48" ry="45" fill={theme.accentColor || "#0033A0"} />
          </svg>
        </div>

        {/* Accent stripe along bottom */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: "6%",
            backgroundColor: theme.accentColor,
          }}
        />
      </div>

      {/* Text content — left editorial column */}
      <div
        className="absolute flex flex-col justify-between"
        style={{
          top: "6%",
          left: "6%",
          width: "44%",
          height: "88%",
        }}
      >
        {/* Logo */}
        <span
          style={{
            color: theme.headlineColor || "#0033A0",
            fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(14px, 2.8cqw, 22px)",
            letterSpacing: "-0.01em",
          }}
        >
          docebo
        </span>

        {/* Headline area */}
        <div style={{ marginTop: "12%" }}>
          {/* Thin accent bar */}
          <div
            style={{
              width: "clamp(30px, 8cqw, 60px)",
              height: "3px",
              backgroundColor: theme.accentColor,
              marginBottom: "6%",
              borderRadius: "2px",
            }}
          />

          <h2
            style={{
              color: theme.headlineColor || "#0033A0",
              fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(28px, 9cqw, 100px)",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              margin: 0,
              fontStyle: "italic",
            }}
          >
            {variant.creative_overlay}
          </h2>

          {subtext && (
            <p
              style={{
                color: theme.subColor || "#0033A0",
                fontFamily: "'Figtree', 'Inter', sans-serif",
                fontWeight: 400,
                fontSize: "clamp(13px, 2.6cqw, 26px)",
                lineHeight: 1.4,
                marginTop: "6%",
                opacity: 0.75,
              }}
            >
              {subtext}
            </p>
          )}
        </div>

        {/* CTA at bottom */}
        <div style={{ marginTop: "auto" }}>
          <span
            style={{
              color: "#FFFFFF",
              fontFamily: "'Figtree', 'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "clamp(11px, 2cqw, 16px)",
              backgroundColor: theme.accentColor,
              padding: "2.5% 6%",
              borderRadius: "999px",
              display: "inline-block",
            }}
          >
            {variant.cta_text} →
          </span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   3. REBELLIOUS EDITORIAL
   Asymmetric layouts, overlapping text, cropped typography,
   diagonal cuts. Magazine meets manifesto.
   ══════════════════════════════════════════════════════════════════ */

export function RebelliousEditorialMockup({ variant, theme, mockupRef, aspectRatio }: StyleRendererProps) {
  const { primary, accent } = splitOverlay(variant.creative_overlay);
  const subtext = variant.overlay_subtext || variant.intro_text?.split(/\.\s+/)[0]?.slice(0, 100) || "";

  return (
    <div
      ref={mockupRef}
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: "#2A2923",
        aspectRatio: aspectRatio || "1 / 1",
        containerType: "inline-size",
      }}
    >
      {/* Diagonal color slash */}
      <div
        className="absolute"
        style={{
          top: 0,
          right: 0,
          width: "55%",
          height: "100%",
          backgroundColor: theme.accentColor,
          clipPath: "polygon(35% 0, 100% 0, 100% 100%, 15% 100%)",
          opacity: 0.12,
          pointerEvents: "none",
        }}
      />

      {/* Large decorative asterisk */}
      <div
        className="absolute"
        style={{
          top: "4%",
          right: "6%",
          color: theme.accentColor,
          fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
          fontSize: "clamp(80px, 22cqw, 240px)",
          fontWeight: 900,
          lineHeight: 0.8,
          opacity: 0.15,
          pointerEvents: "none",
        }}
      >
        *
      </div>

      {/* Oversized headline — intentionally bleeds off left edge */}
      <div
        className="absolute"
        style={{
          top: "12%",
          left: "-2%",
          right: "5%",
        }}
      >
        <h2
          style={{
            color: "#E6DACB",
            fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(48px, 15cqw, 180px)",
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
            margin: 0,
            fontStyle: "italic",
            textTransform: "uppercase",
          }}
        >
          {primary}
        </h2>
        {accent && (
          <h2
            style={{
              color: theme.accentColor,
              fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(48px, 15cqw, 180px)",
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              margin: 0,
              fontStyle: "italic",
              textTransform: "uppercase",
              marginLeft: "12%",
            }}
          >
            {accent}
          </h2>
        )}
      </div>

      {/* Subtext — offset right, smaller editorial type */}
      {subtext && (
        <div
          className="absolute"
          style={{
            bottom: "22%",
            right: "8%",
            maxWidth: "55%",
            textAlign: "right",
          }}
        >
          <div
            style={{
              width: "clamp(25px, 6cqw, 50px)",
              height: "2px",
              backgroundColor: theme.accentColor,
              marginLeft: "auto",
              marginBottom: "4%",
            }}
          />
          <p
            style={{
              color: "#E6DACB",
              fontFamily: "'Lora', Georgia, serif",
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: "clamp(14px, 2.8cqw, 28px)",
              lineHeight: 1.4,
              opacity: 0.8,
            }}
          >
            {subtext}
          </p>
        </div>
      )}

      {/* Bottom bar */}
      <div
        className="absolute flex items-end justify-between"
        style={{
          bottom: "6%",
          left: "6%",
          right: "6%",
        }}
      >
        <span
          style={{
            color: "#E6DACB",
            fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(14px, 2.8cqw, 22px)",
            opacity: 0.7,
          }}
        >
          docebo
        </span>
        <span
          style={{
            color: theme.accentColor,
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: "clamp(11px, 2cqw, 16px)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          {variant.cta_text} →
        </span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   4. DATA AS POWER
   Graph-inspired layouts, modular UI blocks, metric cards,
   structured grid. Make intelligence visible.
   ══════════════════════════════════════════════════════════════════ */

export function DataAsPowerMockup({ variant, theme, mockupRef, aspectRatio }: StyleRendererProps) {
  const subtext = variant.overlay_subtext || variant.intro_text?.split(/\.\s+/)[0]?.slice(0, 100) || "";
  const statVal = variant.stat_value || "94%";

  return (
    <div
      ref={mockupRef}
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: "#131E29",
        aspectRatio: aspectRatio || "1 / 1",
        containerType: "inline-size",
      }}
    >
      {/* Subtle grid lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.05, pointerEvents: "none" }}
      >
        <defs>
          <pattern id="data-grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M80 0 L0 0 0 80" fill="none" stroke="#FFFFFF" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#data-grid)" />
      </svg>

      {/* Top row: Logo + label */}
      <div
        className="absolute flex items-center justify-between"
        style={{ top: "6%", left: "6%", right: "6%" }}
      >
        <span
          style={{
            color: "#FFFFFF",
            fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(14px, 2.5cqw, 20px)",
          }}
        >
          docebo
        </span>
        <span
          style={{
            color: "rgba(255,255,255,0.4)",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "clamp(9px, 1.5cqw, 13px)",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
          }}
        >
          Performance Data
        </span>
      </div>

      {/* Hero metric card */}
      <div
        className="absolute"
        style={{
          top: "16%",
          left: "6%",
          width: "50%",
          padding: "4%",
          borderRadius: "clamp(6px, 1.5cqw, 14px)",
          border: "1px solid rgba(255,255,255,0.1)",
          backgroundColor: "rgba(255,255,255,0.04)",
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "clamp(9px, 1.5cqw, 13px)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            margin: 0,
          }}
        >
          Key Metric
        </p>
        <p
          style={{
            color: theme.accentColor || "#54FA77",
            fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(36px, 10cqw, 100px)",
            lineHeight: 1.0,
            margin: "2% 0 0",
          }}
        >
          {statVal}
        </p>
      </div>

      {/* Mini bar chart */}
      <div
        className="absolute"
        style={{
          top: "16%",
          right: "6%",
          width: "32%",
          padding: "4%",
          borderRadius: "clamp(6px, 1.5cqw, 14px)",
          border: "1px solid rgba(255,255,255,0.1)",
          backgroundColor: "rgba(255,255,255,0.04)",
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "clamp(8px, 1.2cqw, 11px)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            margin: "0 0 8%",
          }}
        >
          Trend
        </p>
        <svg viewBox="0 0 100 50" style={{ width: "100%" }}>
          {/* Bar chart */}
          {[15, 25, 35, 28, 42, 38, 48].map((h, i) => (
            <rect
              key={i}
              x={i * 14 + 2}
              y={50 - h}
              width="10"
              height={h}
              rx="2"
              fill={i === 6 ? (theme.accentColor || "#54FA77") : "rgba(255,255,255,0.15)"}
            />
          ))}
        </svg>
      </div>

      {/* Headline area */}
      <div
        className="absolute"
        style={{
          top: "50%",
          left: "6%",
          right: "6%",
        }}
      >
        <h2
          style={{
            color: "#FFFFFF",
            fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(28px, 9cqw, 100px)",
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            margin: 0,
            fontStyle: "italic",
          }}
        >
          {variant.creative_overlay}
        </h2>

        {subtext && (
          <p
            style={{
              color: "rgba(255,255,255,0.5)",
              fontFamily: "'Figtree', 'Inter', sans-serif",
              fontWeight: 400,
              fontSize: "clamp(13px, 2.4cqw, 24px)",
              lineHeight: 1.35,
              marginTop: "4%",
              maxWidth: "80%",
            }}
          >
            {subtext}
          </p>
        )}
      </div>

      {/* Bottom row: mini metrics + CTA */}
      <div
        className="absolute flex items-end justify-between"
        style={{ bottom: "6%", left: "6%", right: "6%" }}
      >
        <div className="flex items-center" style={{ gap: "clamp(8px, 2cqw, 20px)" }}>
          {["3.2x ROI", "60% faster", "Audit-ready"].map((metric) => (
            <span
              key={metric}
              style={{
                color: "rgba(255,255,255,0.5)",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "clamp(8px, 1.4cqw, 12px)",
                padding: "1% 3%",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "4px",
              }}
            >
              {metric}
            </span>
          ))}
        </div>

        <span
          style={{
            color: "#131E29",
            fontFamily: "'Figtree', 'Inter', sans-serif",
            fontWeight: 600,
            fontSize: "clamp(11px, 2cqw, 16px)",
            backgroundColor: theme.accentColor || "#54FA77",
            padding: "1.5% 4%",
            borderRadius: "6px",
          }}
        >
          {variant.cta_text} →
        </span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   5. DIGITAL REBELLION
   Glitch effects, scan lines, RGB offset shadows, broken grid,
   fragmented layouts. Break the system visually.
   ══════════════════════════════════════════════════════════════════ */

export function DigitalRebellionMockup({ variant, theme, mockupRef, aspectRatio }: StyleRendererProps) {
  const { primary, accent } = splitOverlay(variant.creative_overlay);
  const subtext = variant.overlay_subtext || variant.intro_text?.split(/\.\s+/)[0]?.slice(0, 100) || "";

  return (
    <div
      ref={mockupRef}
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: "#131E29",
        aspectRatio: aspectRatio || "1 / 1",
        containerType: "inline-size",
      }}
    >
      {/* Scan lines */}
      <div
        className="absolute inset-0"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.02) 3px, rgba(255,255,255,0.02) 4px)",
          pointerEvents: "none",
          zIndex: 5,
        }}
      />

      {/* Corrupted horizontal bars */}
      <div
        className="absolute"
        style={{
          top: "28%",
          left: 0,
          right: 0,
          height: "3px",
          backgroundColor: "#FF5DD8",
          opacity: 0.4,
          transform: "scaleX(1.05)",
          pointerEvents: "none",
        }}
      />
      <div
        className="absolute"
        style={{
          top: "72%",
          left: "5%",
          width: "60%",
          height: "2px",
          backgroundColor: "#54FA77",
          opacity: 0.3,
          pointerEvents: "none",
        }}
      />

      {/* Offset color blocks (glitch fragments) */}
      <div
        className="absolute"
        style={{
          top: "15%",
          right: "4%",
          width: "18%",
          height: "12%",
          backgroundColor: "#FF5DD8",
          opacity: 0.08,
          clipPath: "polygon(10% 0, 100% 0, 90% 100%, 0% 100%)",
          pointerEvents: "none",
        }}
      />
      <div
        className="absolute"
        style={{
          bottom: "18%",
          left: "3%",
          width: "22%",
          height: "8%",
          backgroundColor: "#0057FF",
          opacity: 0.1,
          clipPath: "polygon(5% 0, 100% 0, 95% 100%, 0% 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Headline with RGB offset / glitch shadow */}
      <div
        className="absolute"
        style={{
          top: "18%",
          left: "6%",
          right: "6%",
          zIndex: 2,
        }}
      >
        {/* Ghost red offset */}
        <h2
          className="absolute"
          style={{
            color: "#FF5DD8",
            fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(44px, 14cqw, 170px)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            margin: 0,
            fontStyle: "italic",
            opacity: 0.2,
            transform: "translate(-2px, 2px)",
            pointerEvents: "none",
          }}
        >
          {primary}
        </h2>
        {/* Ghost blue offset */}
        <h2
          className="absolute"
          style={{
            color: "#0057FF",
            fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(44px, 14cqw, 170px)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            margin: 0,
            fontStyle: "italic",
            opacity: 0.15,
            transform: "translate(3px, -1px)",
            pointerEvents: "none",
          }}
        >
          {primary}
        </h2>
        {/* Main text */}
        <h2
          style={{
            color: "#FFFFFF",
            fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
            fontWeight: 900,
            fontSize: "clamp(44px, 14cqw, 170px)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            margin: 0,
            fontStyle: "italic",
            position: "relative",
          }}
        >
          {primary}
        </h2>
        {accent && (
          <h2
            style={{
              color: theme.accentColor || "#FF5DD8",
              fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(44px, 14cqw, 170px)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              margin: 0,
              fontStyle: "italic",
              position: "relative",
              textShadow: `3px 0 #0057FF30, -2px 0 #FF5DD830`,
            }}
          >
            {accent}
          </h2>
        )}
      </div>

      {/* Subtext in monospace — "corrupted data" feel */}
      {subtext && (
        <div
          className="absolute"
          style={{
            bottom: "20%",
            left: "6%",
            right: "6%",
            zIndex: 2,
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.55)",
              fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 400,
              fontSize: "clamp(12px, 2.2cqw, 22px)",
              lineHeight: 1.5,
              maxWidth: "75%",
            }}
          >
            {subtext}
          </p>
        </div>
      )}

      {/* Bottom bar */}
      <div
        className="absolute flex items-end justify-between"
        style={{ bottom: "5%", left: "6%", right: "6%", zIndex: 2 }}
      >
        <span
          style={{
            color: "rgba(255,255,255,0.5)",
            fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(14px, 2.8cqw, 22px)",
          }}
        >
          docebo
        </span>
        <span
          style={{
            color: "#FFFFFF",
            fontFamily: "'IBM Plex Mono', monospace",
            fontWeight: 600,
            fontSize: "clamp(11px, 2cqw, 16px)",
            padding: "1.5% 4%",
            backgroundColor: theme.accentColor || "#FF5DD8",
            borderRadius: "2px",
          }}
        >
          {variant.cta_text} →
        </span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   6. MINIMAL AUTHORITY
   Extreme whitespace, one strong statement, stripped-down,
   ultra-clean. Confidence without noise.
   ══════════════════════════════════════════════════════════════════ */

export function MinimalAuthorityMockup({ variant, theme, mockupRef, aspectRatio }: StyleRendererProps) {
  const subtext = variant.overlay_subtext || "";

  return (
    <div
      ref={mockupRef}
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: "#FFFFFF",
        aspectRatio: aspectRatio || "1 / 1",
        containerType: "inline-size",
      }}
    >
      {/* Thin top accent line */}
      <div
        className="absolute"
        style={{
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          backgroundColor: theme.accentColor || "#7E2EE9",
        }}
      />

      {/* Logo — top left, understated */}
      <div
        className="absolute"
        style={{ top: "8%", left: "10%" }}
      >
        <span
          style={{
            color: "#0033A0",
            fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(13px, 2.5cqw, 20px)",
            letterSpacing: "-0.01em",
            opacity: 0.6,
          }}
        >
          docebo
        </span>
      </div>

      {/* Single powerful headline — bottom-left anchored with maximum whitespace above */}
      <div
        className="absolute"
        style={{
          bottom: "18%",
          left: "10%",
          right: "10%",
        }}
      >
        <h2
          style={{
            color: "#0A0A0A",
            fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(36px, 11cqw, 130px)",
            lineHeight: 1.0,
            letterSpacing: "-0.04em",
            margin: 0,
            fontStyle: "italic",
          }}
        >
          {variant.creative_overlay}
        </h2>

        {/* Thin horizontal rule */}
        <div
          style={{
            width: "clamp(40px, 10cqw, 80px)",
            height: "2px",
            backgroundColor: theme.accentColor || "#7E2EE9",
            marginTop: "4%",
          }}
        />

        {subtext && (
          <p
            style={{
              color: "#0A0A0A",
              fontFamily: "'Figtree', 'Inter', sans-serif",
              fontWeight: 400,
              fontSize: "clamp(13px, 2.4cqw, 24px)",
              lineHeight: 1.4,
              marginTop: "3%",
              opacity: 0.5,
              maxWidth: "70%",
            }}
          >
            {subtext}
          </p>
        )}
      </div>

      {/* CTA — bottom right, minimal */}
      <div
        className="absolute"
        style={{ bottom: "8%", right: "10%" }}
      >
        <span
          style={{
            color: theme.accentColor || "#7E2EE9",
            fontFamily: "'Figtree', 'Inter', sans-serif",
            fontWeight: 500,
            fontSize: "clamp(11px, 2cqw, 16px)",
          }}
        >
          {variant.cta_text} →
        </span>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   7. SYSTEM UI AESTHETIC
   Product UI feel: browser chrome, dashboard panels, sidebar nav,
   cursor, layered interface. The product in their hands.
   ══════════════════════════════════════════════════════════════════ */

export function SystemUIMockup({ variant, theme, mockupRef, aspectRatio }: StyleRendererProps) {
  const subtext = variant.overlay_subtext || variant.intro_text?.split(/\.\s+/)[0]?.slice(0, 100) || "";

  return (
    <div
      ref={mockupRef}
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: "#0B1120",
        aspectRatio: aspectRatio || "1 / 1",
        containerType: "inline-size",
      }}
    >
      {/* Browser window chrome */}
      <div
        className="absolute"
        style={{
          top: "6%",
          left: "6%",
          right: "6%",
          bottom: "14%",
          borderRadius: "clamp(8px, 1.5cqw, 14px)",
          border: "1px solid rgba(255,255,255,0.1)",
          backgroundColor: "rgba(255,255,255,0.03)",
          overflow: "hidden",
        }}
      >
        {/* Title bar with dots */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(4px, 0.8cqw, 8px)",
            padding: "1.8% 3%",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            backgroundColor: "rgba(255,255,255,0.02)",
          }}
        >
          {["#FF5F57", "#FFBD2E", "#28CA42"].map((color) => (
            <div
              key={color}
              style={{
                width: "clamp(6px, 1.2cqw, 11px)",
                height: "clamp(6px, 1.2cqw, 11px)",
                borderRadius: "50%",
                backgroundColor: color,
                opacity: 0.8,
              }}
            />
          ))}
          <div
            style={{
              marginLeft: "clamp(6px, 1.5cqw, 14px)",
              flex: 1,
              height: "clamp(14px, 2.5cqw, 24px)",
              borderRadius: "clamp(4px, 0.8cqw, 8px)",
              backgroundColor: "rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "center",
              paddingLeft: "2%",
            }}
          >
            <span
              style={{
                color: "rgba(255,255,255,0.25)",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "clamp(7px, 1.2cqw, 11px)",
              }}
            >
              app.docebo.com/dashboard
            </span>
          </div>
        </div>

        {/* Dashboard body — sidebar + main area */}
        <div style={{ display: "flex", height: "100%" }}>
          {/* Sidebar */}
          <div
            style={{
              width: "22%",
              borderRight: "1px solid rgba(255,255,255,0.06)",
              padding: "4% 3%",
            }}
          >
            {/* Sidebar nav items */}
            {["Overview", "Analytics", "Courses", "Users", "Reports"].map((item, i) => (
              <div
                key={item}
                style={{
                  padding: "4% 6%",
                  borderRadius: "clamp(3px, 0.6cqw, 6px)",
                  marginBottom: "3%",
                  backgroundColor: i === 1 ? `${theme.accentColor || "#0057FF"}20` : "transparent",
                  display: "flex",
                  alignItems: "center",
                  gap: "6%",
                }}
              >
                <div
                  style={{
                    width: "clamp(8px, 1.5cqw, 14px)",
                    height: "clamp(8px, 1.5cqw, 14px)",
                    borderRadius: "3px",
                    backgroundColor: i === 1 ? (theme.accentColor || "#0057FF") : "rgba(255,255,255,0.1)",
                    opacity: i === 1 ? 0.8 : 0.4,
                  }}
                />
                <span
                  style={{
                    color: i === 1 ? "#FFFFFF" : "rgba(255,255,255,0.35)",
                    fontFamily: "'Figtree', 'Inter', sans-serif",
                    fontSize: "clamp(7px, 1.2cqw, 11px)",
                    fontWeight: i === 1 ? 600 : 400,
                  }}
                >
                  {item}
                </span>
              </div>
            ))}

            {/* Docebo logo at sidebar bottom */}
            <div style={{ marginTop: "auto", paddingTop: "20%" }}>
              <span
                style={{
                  color: "rgba(255,255,255,0.25)",
                  fontFamily: "'Special Gothic Expanded', 'Figtree', sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(9px, 1.6cqw, 14px)",
                }}
              >
                docebo
              </span>
            </div>
          </div>

          {/* Main content area — headline overlaid on dashboard */}
          <div
            style={{
              flex: 1,
              position: "relative",
              padding: "4%",
            }}
          >
            {/* Mini stat cards row */}
            <div style={{ display: "flex", gap: "3%", marginBottom: "5%" }}>
              {[
                { label: "Completion", val: "94%", color: theme.accentColor || "#54FA77" },
                { label: "Active Users", val: "3,847", color: "#4C8DFF" },
                { label: "Avg. Score", val: "8.2", color: "#DCB7FF" },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    flex: 1,
                    padding: "3% 4%",
                    borderRadius: "clamp(4px, 0.8cqw, 8px)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backgroundColor: "rgba(255,255,255,0.02)",
                  }}
                >
                  <p
                    style={{
                      color: "rgba(255,255,255,0.35)",
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: "clamp(6px, 1cqw, 9px)",
                      margin: 0,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {s.label}
                  </p>
                  <p
                    style={{
                      color: s.color,
                      fontFamily: "'Special Gothic Expanded', 'Figtree', sans-serif",
                      fontWeight: 800,
                      fontSize: "clamp(14px, 3cqw, 30px)",
                      margin: "2% 0 0",
                      lineHeight: 1.1,
                    }}
                  >
                    {s.val}
                  </p>
                </div>
              ))}
            </div>

            {/* Mini line chart */}
            <div
              style={{
                padding: "3%",
                borderRadius: "clamp(4px, 0.8cqw, 8px)",
                border: "1px solid rgba(255,255,255,0.08)",
                backgroundColor: "rgba(255,255,255,0.02)",
                marginBottom: "5%",
              }}
            >
              <svg viewBox="0 0 200 50" style={{ width: "100%", display: "block" }}>
                <polyline
                  points="0,40 20,35 40,38 60,28 80,30 100,22 120,18 140,20 160,12 180,15 200,8"
                  fill="none"
                  stroke={theme.accentColor || "#54FA77"}
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <polyline
                  points="0,40 20,35 40,38 60,28 80,30 100,22 120,18 140,20 160,12 180,15 200,8"
                  fill={`${theme.accentColor || "#54FA77"}15`}
                  stroke="none"
                  strokeWidth="0"
                />
                {/* Fill under */}
                <polygon
                  points="0,40 20,35 40,38 60,28 80,30 100,22 120,18 140,20 160,12 180,15 200,8 200,50 0,50"
                  fill={`${theme.accentColor || "#54FA77"}`}
                  opacity="0.08"
                />
              </svg>
            </div>

            {/* Headline overlay on dashboard */}
            <h2
              style={{
                color: "#FFFFFF",
                fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(20px, 6cqw, 60px)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                margin: 0,
                fontStyle: "italic",
              }}
            >
              {variant.creative_overlay}
            </h2>
            {subtext && (
              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "'Figtree', 'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: "clamp(10px, 1.8cqw, 18px)",
                  lineHeight: 1.35,
                  marginTop: "3%",
                  maxWidth: "90%",
                }}
              >
                {subtext}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Cursor icon — floating over the dashboard */}
      <svg
        className="absolute"
        viewBox="0 0 24 24"
        style={{
          bottom: "28%",
          right: "18%",
          width: "clamp(16px, 3cqw, 32px)",
          height: "clamp(16px, 3cqw, 32px)",
          filter: `drop-shadow(0 2px 8px rgba(0,0,0,0.4))`,
          zIndex: 3,
          pointerEvents: "none",
        }}
      >
        <path
          d="M5 3l14 8-6.5 1.5L11 19z"
          fill="#FFFFFF"
          stroke="#0A0A0A"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>

      {/* Bottom CTA bar — outside the browser chrome */}
      <div
        className="absolute flex items-center justify-between"
        style={{ bottom: "5%", left: "6%", right: "6%" }}
      >
        <span
          style={{
            color: "rgba(255,255,255,0.4)",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "clamp(9px, 1.4cqw, 12px)",
          }}
        >
          See it live
        </span>
        <span
          style={{
            color: "#FFFFFF",
            fontFamily: "'Figtree', 'Inter', sans-serif",
            fontWeight: 600,
            fontSize: "clamp(11px, 2cqw, 16px)",
            backgroundColor: theme.accentColor || "#0057FF",
            padding: "1.5% 4%",
            borderRadius: "6px",
          }}
        >
          {variant.cta_text} →
        </span>
      </div>
    </div>
  );
}


/* ══════════════════════════════════════════════════════════════════
   FORMAT WRAPPERS

   These wrap the mockup card with platform-specific chrome to
   indicate the ad format context (carousel dots, document pages,
   article framing, thought-leader post).
   ══════════════════════════════════════════════════════════════════ */

export function CarouselWrapper({ children, totalCards = 5 }: { children: React.ReactNode; totalCards?: number }) {
  return (
    <div className="relative">
      {children}
      {/* Carousel indicators */}
      <div
        className="flex items-center justify-center gap-1.5 py-2"
        style={{ backgroundColor: "rgba(19,30,41,0.6)" }}
      >
        {Array.from({ length: totalCards }).map((_, i) => (
          <div
            key={i}
            style={{
              width: i === 0 ? "16px" : "6px",
              height: "6px",
              borderRadius: "3px",
              backgroundColor: i === 0 ? "#FFFFFF" : "rgba(255,255,255,0.3)",
              transition: "width 0.2s",
            }}
          />
        ))}
      </div>
      {/* Left/right arrows */}
      <div
        className="absolute top-1/2 left-2 -translate-y-1/2"
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.3,
        }}
      >
        <svg viewBox="0 0 24 24" fill="white" style={{ width: "14px", height: "14px" }}>
          <path d="M15 19l-7-7 7-7" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div
        className="absolute top-1/2 right-2 -translate-y-1/2"
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.6,
        }}
      >
        <svg viewBox="0 0 24 24" fill="white" style={{ width: "14px", height: "14px" }}>
          <path d="M9 5l7 7-7 7" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

export function DocumentWrapper({ children, currentPage = 1, totalPages = 8 }: { children: React.ReactNode; currentPage?: number; totalPages?: number }) {
  return (
    <div className="relative">
      {/* Stacked page shadow effect */}
      <div
        className="absolute"
        style={{
          top: "4px",
          left: "4px",
          right: "-4px",
          bottom: "-4px",
          backgroundColor: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "4px",
        }}
      />
      <div
        className="absolute"
        style={{
          top: "8px",
          left: "8px",
          right: "-8px",
          bottom: "-8px",
          backgroundColor: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.04)",
          borderRadius: "4px",
        }}
      />
      <div className="relative">{children}</div>
      {/* Page indicator */}
      <div
        className="flex items-center justify-center py-1.5"
        style={{ backgroundColor: "rgba(19,30,41,0.6)" }}
      >
        <span
          style={{
            color: "rgba(255,255,255,0.5)",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "10px",
          }}
        >
          {currentPage} / {totalPages}
        </span>
      </div>
    </div>
  );
}

export function ArticleWrapper({ children, variant }: { children: React.ReactNode; variant: Variant }) {
  return (
    <div>
      {/* Article cover image */}
      {children}
      {/* Article meta below */}
      <div
        className="px-3 py-2"
        style={{
          backgroundColor: "rgba(19,30,41,0.8)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "9px",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            margin: "0 0 4px",
          }}
        >
          Sponsored Article
        </p>
        <p
          style={{
            color: "#FFFFFF",
            fontFamily: "'Figtree', 'Inter', sans-serif",
            fontSize: "13px",
            fontWeight: 600,
            margin: 0,
            lineHeight: 1.3,
          }}
        >
          {variant.headline}
        </p>
        <p
          style={{
            color: "rgba(255,255,255,0.5)",
            fontFamily: "'Figtree', 'Inter', sans-serif",
            fontSize: "11px",
            margin: "4px 0 0",
          }}
        >
          docebo.com · 8 min read
        </p>
      </div>
    </div>
  );
}

export function ThoughtLeaderWrapper({ children, variant }: { children: React.ReactNode; variant: Variant }) {
  return (
    <div>
      {/* Post header — profile info */}
      <div
        className="flex items-start gap-2 px-3 py-2.5"
        style={{
          backgroundColor: "rgba(19,30,41,0.8)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Avatar placeholder */}
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: "#0057FF",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)" style={{ width: "18px", height: "18px" }}>
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              color: "#FFFFFF",
              fontFamily: "'Figtree', 'Inter', sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              margin: 0,
            }}
          >
            Docebo Team Member
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.4)",
              fontFamily: "'Figtree', 'Inter', sans-serif",
              fontSize: "10px",
              margin: "2px 0 0",
            }}
          >
            VP of Learning · Promoted
          </p>
        </div>
      </div>

      {/* Post text */}
      <div className="px-3 py-2" style={{ backgroundColor: "rgba(19,30,41,0.6)" }}>
        <p
          style={{
            color: "rgba(255,255,255,0.8)",
            fontFamily: "'Figtree', 'Inter', sans-serif",
            fontSize: "12px",
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {variant.intro_text?.slice(0, 120)}
          {(variant.intro_text?.length ?? 0) > 120 ? "..." : ""}
        </p>
      </div>

      {/* Image */}
      {children}
    </div>
  );
}


/* ══════════════════════════════════════════════════════════════════
   MULTI-CARD RENDERERS

   CarouselMockup: renders the variant's `cards` array as a
   horizontal card strip with prev/next navigation and dot indicators.
   Each card is a mini-mockup applying the visual style's palette.

   DocumentMockup: renders cards as stacked pages with the hook page
   prominent and subsequent pages visible as a peek/stack behind it.
   ══════════════════════════════════════════════════════════════════ */

/** Single card within a carousel or document — renders one card_overlay + card_subtext. */
function CardFace({
  card,
  index,
  total,
  theme,
  isCarousel,
}: {
  card: { card_overlay: string; card_subtext?: string; card_cta?: string; card_visual_note?: string };
  index: number;
  total: number;
  theme: ThemeConfig;
  isCarousel: boolean;
}) {
  const isLast = index === total - 1;
  const isFirst = index === 0;

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        backgroundColor: theme.bgGradient ? undefined : theme.bg,
        background: theme.bgGradient || theme.bg,
      }}
    >
      {/* Corner accent on first card */}
      {isFirst && theme.cornerGradient !== "none" && (
        <div
          className="absolute"
          style={{
            top: 0,
            right: 0,
            width: "50%",
            height: "50%",
            background: theme.cornerGradient,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Card content */}
      <div
        className="absolute inset-0 flex flex-col justify-between"
        style={{ padding: isCarousel ? "10% 8%" : "8% 8%" }}
      >
        {/* Top: page number or logo */}
        <div className="flex items-center justify-between">
          {isFirst ? (
            <span
              style={{
                color: theme.logoColor,
                fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(10px, 2.2cqw, 18px)",
                opacity: 0.9,
              }}
            >
              docebo
            </span>
          ) : (
            <span
              style={{
                color: theme.subColor,
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "clamp(8px, 1.5cqw, 12px)",
                opacity: 0.5,
              }}
            >
              {isCarousel ? `${index + 1}/${total}` : `Page ${index + 1}`}
            </span>
          )}
        </div>

        {/* Main text */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h3
            style={{
              color: isLast ? theme.accentColor : theme.headlineColor,
              fontFamily: "'Special Gothic Expanded', 'Figtree', 'Inter', sans-serif",
              fontWeight: 800,
              fontSize: isFirst
                ? "clamp(20px, 7cqw, 60px)"
                : "clamp(16px, 5.5cqw, 48px)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              margin: 0,
              fontStyle: "italic",
            }}
          >
            {card.card_overlay}
          </h3>

          {card.card_subtext && (
            <p
              style={{
                color: theme.subColor,
                fontFamily: "'Figtree', 'Inter', sans-serif",
                fontWeight: 400,
                fontSize: "clamp(10px, 2.2cqw, 20px)",
                lineHeight: 1.4,
                marginTop: "5%",
                opacity: 0.75,
                maxWidth: "90%",
              }}
            >
              {card.card_subtext}
            </p>
          )}
        </div>

        {/* CTA on last card */}
        {card.card_cta && (
          <div>
            <span
              style={{
                color: theme.ctaColor,
                fontFamily: "'Figtree', 'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "clamp(10px, 2cqw, 16px)",
                ...(theme.ctaBg
                  ? { backgroundColor: theme.ctaBg, padding: "2% 5%", borderRadius: "999px" }
                  : {}),
              }}
            >
              {card.card_cta}
            </span>
          </div>
        )}

        {/* Bottom accent on non-CTA cards */}
        {!card.card_cta && theme.bottomAccentColor && (
          <div
            className="absolute"
            style={{
              bottom: 0,
              left: 0,
              width: "30%",
              height: "4px",
              backgroundColor: theme.bottomAccentColor,
              borderRadius: "0 2px 0 0",
            }}
          />
        )}
      </div>
    </div>
  );
}

/** Carousel: horizontal strip of cards with prev/next + dots. */
export function CarouselMockup({
  variant,
  theme,
  mockupRef,
  aspectRatio,
}: StyleRendererProps) {
  const cards = variant.cards;
  const [activeCard, setActiveCard] = useState(0);

  if (!cards || cards.length === 0) {
    // Fallback: no cards data, just render creative_overlay as single card
    return null;
  }

  const total = cards.length;
  const card = cards[activeCard];

  return (
    <div
      ref={mockupRef}
      className="relative w-full overflow-hidden"
      style={{
        aspectRatio: aspectRatio || "1 / 1",
        containerType: "inline-size",
      }}
    >
      {/* Active card */}
      <CardFace
        card={card}
        index={activeCard}
        total={total}
        theme={theme}
        isCarousel={true}
      />

      {/* Peek of next card (right edge) */}
      {activeCard < total - 1 && (
        <div
          className="absolute"
          style={{
            top: "3%",
            right: 0,
            width: "8%",
            bottom: "3%",
            backgroundColor: theme.bg,
            opacity: 0.6,
            borderRadius: "clamp(4px, 0.8cqw, 8px) 0 0 clamp(4px, 0.8cqw, 8px)",
            boxShadow: "-4px 0 12px rgba(0,0,0,0.3)",
          }}
        />
      )}

      {/* Navigation arrows */}
      {activeCard > 0 && (
        <button
          onClick={() => setActiveCard(activeCard - 1)}
          className="absolute cursor-pointer"
          style={{
            top: "50%",
            left: "2%",
            transform: "translateY(-50%)",
            width: "clamp(20px, 4cqw, 32px)",
            height: "clamp(20px, 4cqw, 32px)",
            borderRadius: "50%",
            backgroundColor: "rgba(0,0,0,0.5)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 3,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" style={{ width: "60%", height: "60%" }}>
            <path d="M15 19l-7-7 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      {activeCard < total - 1 && (
        <button
          onClick={() => setActiveCard(activeCard + 1)}
          className="absolute cursor-pointer"
          style={{
            top: "50%",
            right: "2%",
            transform: "translateY(-50%)",
            width: "clamp(20px, 4cqw, 32px)",
            height: "clamp(20px, 4cqw, 32px)",
            borderRadius: "50%",
            backgroundColor: "rgba(0,0,0,0.5)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 3,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" style={{ width: "60%", height: "60%" }}>
            <path d="M9 5l7 7-7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Dot indicators */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          bottom: "3%",
          left: 0,
          right: 0,
          gap: "clamp(3px, 0.6cqw, 6px)",
          zIndex: 3,
        }}
      >
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveCard(i)}
            className="cursor-pointer"
            style={{
              width: i === activeCard ? "clamp(12px, 2.5cqw, 20px)" : "clamp(5px, 1cqw, 8px)",
              height: "clamp(5px, 1cqw, 8px)",
              borderRadius: "clamp(3px, 0.5cqw, 4px)",
              backgroundColor: i === activeCard ? "#FFFFFF" : "rgba(255,255,255,0.35)",
              border: "none",
              padding: 0,
              transition: "width 0.2s, background-color 0.2s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/** Document: stacked pages with hook page prominent + page peek behind. */
export function DocumentMockup({
  variant,
  theme,
  mockupRef,
  aspectRatio,
}: StyleRendererProps) {
  const cards = variant.cards;
  const [activePage, setActivePage] = useState(0);

  if (!cards || cards.length === 0) {
    return null;
  }

  const total = cards.length;
  const card = cards[activePage];

  return (
    <div
      ref={mockupRef}
      className="relative w-full overflow-hidden"
      style={{
        aspectRatio: aspectRatio || "1 / 1",
        containerType: "inline-size",
      }}
    >
      {/* Background stack effect — two offset layers */}
      <div
        className="absolute"
        style={{
          top: "2%",
          left: "2%",
          right: "-1.5%",
          bottom: "-1.5%",
          backgroundColor: theme.bg,
          opacity: 0.3,
          borderRadius: "clamp(4px, 0.8cqw, 8px)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      />
      <div
        className="absolute"
        style={{
          top: "1%",
          left: "1%",
          right: "-0.75%",
          bottom: "-0.75%",
          backgroundColor: theme.bg,
          opacity: 0.5,
          borderRadius: "clamp(4px, 0.8cqw, 8px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      />

      {/* Active page */}
      <div
        className="relative w-full h-full"
        style={{ borderRadius: "clamp(4px, 0.8cqw, 8px)", overflow: "hidden" }}
      >
        <CardFace
          card={card}
          index={activePage}
          total={total}
          theme={theme}
          isCarousel={false}
        />
      </div>

      {/* Page navigation strip at bottom */}
      <div
        className="absolute flex items-center justify-center"
        style={{
          bottom: "2.5%",
          left: "10%",
          right: "10%",
          gap: "clamp(2px, 0.4cqw, 4px)",
          zIndex: 3,
        }}
      >
        {cards.map((_, i) => (
          <button
            key={i}
            onClick={() => setActivePage(i)}
            className="cursor-pointer"
            style={{
              flex: i === activePage ? 2 : 1,
              height: "clamp(3px, 0.6cqw, 5px)",
              borderRadius: "2px",
              backgroundColor: i === activePage
                ? theme.accentColor
                : i < activePage
                  ? "rgba(255,255,255,0.3)"
                  : "rgba(255,255,255,0.12)",
              border: "none",
              padding: 0,
              transition: "flex 0.2s, background-color 0.2s",
            }}
          />
        ))}
      </div>

      {/* Page counter badge */}
      <div
        className="absolute"
        style={{
          top: "3%",
          right: "3%",
          padding: "1% 3%",
          borderRadius: "clamp(3px, 0.6cqw, 6px)",
          backgroundColor: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
          zIndex: 3,
        }}
      >
        <span
          style={{
            color: "rgba(255,255,255,0.7)",
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: "clamp(8px, 1.4cqw, 12px)",
          }}
        >
          {activePage + 1} / {total}
        </span>
      </div>
    </div>
  );
}


/* ══════════════════════════════════════════════════════════════════
   ROUTER — picks the right renderer for a given visual_style
   ══════════════════════════════════════════════════════════════════ */

const STYLE_RENDERERS: Record<string, (props: StyleRendererProps) => React.ReactElement> = {
  "neon-intelligence": NeonIntelligenceMockup,
  "human-contrast": HumanContrastMockup,
  "rebellious-editorial": RebelliousEditorialMockup,
  "data-as-power": DataAsPowerMockup,
  "digital-rebellion": DigitalRebellionMockup,
  "minimal-authority": MinimalAuthorityMockup,
  "system-ui": SystemUIMockup,
};

/** Returns true if the visual style has a dedicated renderer. */
export function hasStyleRenderer(visualStyle?: string): boolean {
  return !!visualStyle && visualStyle in STYLE_RENDERERS;
}

/** Render a mockup using the visual-style-specific renderer.
 *  Returns null if no renderer exists for the style. */
export function renderVisualStyle(
  visualStyle: string,
  props: StyleRendererProps,
): React.ReactElement | null {
  const Renderer = STYLE_RENDERERS[visualStyle];
  if (!Renderer) return null;
  return <Renderer {...props} />;
}

/** Render a multi-card mockup (carousel or document) if the variant has cards data.
 *  Returns null if the format doesn't support multi-card or no cards exist. */
export function renderMultiCard(
  adFormat: string | undefined,
  props: StyleRendererProps,
): React.ReactElement | null {
  const { variant } = props;
  if (!variant.cards || variant.cards.length === 0) return null;

  if (adFormat === "carousel") {
    return <CarouselMockup {...props} />;
  }
  if (adFormat === "document") {
    return <DocumentMockup {...props} />;
  }
  return null;
}

/** Returns the appropriate format wrapper for an ad_format.
 *  For carousel/document with cards data, the multi-card renderer
 *  replaces the wrapper entirely. For other formats or when no cards
 *  exist, wraps children with platform chrome. */
export function wrapForFormat(
  adFormat: string | undefined,
  variant: Variant,
  children: React.ReactNode,
): React.ReactNode {
  // Carousel/document without cards data still get simple chrome wrappers
  switch (adFormat) {
    case "carousel":
      return <CarouselWrapper>{children}</CarouselWrapper>;
    case "document":
      return <DocumentWrapper>{children}</DocumentWrapper>;
    case "article-newsletter":
      return <ArticleWrapper variant={variant}>{children}</ArticleWrapper>;
    case "thought-leader":
      return <ThoughtLeaderWrapper variant={variant}>{children}</ThoughtLeaderWrapper>;
    default:
      return children;
  }
}
