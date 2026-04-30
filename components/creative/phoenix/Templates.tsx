"use client";

import {
  Wordmark,
  HeroHeadline,
  PillCTA,
  Rock,
  type PillCTAMode,
} from "./PhoenixBanner";

/* All templates render into a fixed 1080x1080 art board. The PhoenixRenderer
   wraps them in a container that scales the board to fit the card width. */

export interface TemplatePalette {
  /** Background color or gradient. */
  bg: string;
  /** Primary foreground / headline color. */
  fg: string;
  /** Muted foreground for subtext. */
  fgMuted: string;
  /** Accent color used for one decorative element per composition. */
  accent: string;
  /** True when bg is dark, drives CTA mode and overlay tints. */
  bgIsDark: boolean;
}

export interface PhoenixTemplateProps {
  /** Hero headline text — primary in-image overlay. */
  overlay: string;
  /** Supporting line under the headline. */
  subtext?: string;
  /** Call-to-action label (the "→" is appended automatically). */
  cta?: string;
  /** Numeric stat for stat-led layouts. */
  stat?: string;
  /** Partner name for co-brand layouts. */
  partner?: string;
  /** Color palette — supplied by the renderer with compat fallbacks. */
  palette: TemplatePalette;
}

const FRAME: React.CSSProperties = {
  position: "relative",
  width: 1080,
  height: 1080,
  overflow: "hidden",
};

const SUBTEXT_SIZE = 38;

function ctaModeFor(palette: TemplatePalette, preferOutline = false): PillCTAMode {
  if (preferOutline) return palette.bgIsDark ? "outline-light" : "outline-dark";
  if (!palette.bgIsDark) return "solid-navy";
  // Pick a solid fill matching the accent on dark bg.
  const a = palette.accent.toUpperCase();
  if (a === "#FF5DD8" || a === "#B627C6") return "solid-pink";
  if (a === "#54FA77" || a === "#E3FFAB") return "solid-green";
  if (a === "#7E2EE9" || a === "#DCB7FF") return "solid-purple";
  return "solid-pink";
}

/* ── 1. WebinarNavyPink — bg with full-bleed rock + headline ────── */
export function WebinarNavyPink({
  overlay,
  subtext,
  cta,
  palette,
}: PhoenixTemplateProps) {
  const heroSize = pickHeroSize(overlay, { short: 96, medium: 76, long: 60 });
  return (
    <div style={{ ...FRAME, background: palette.bg }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: palette.bgIsDark
            ? "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)"
            : "radial-gradient(rgba(6,6,93,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div style={{ position: "absolute", right: -180, top: 0 }}>
        <Rock width={780} height={1080} fill={palette.accent} />
      </div>
      <div style={{ position: "absolute", left: 88, top: 88 }}>
        <Wordmark color={palette.fg} size={56} />
      </div>
      <div style={{ position: "absolute", left: 88, top: 280, width: 540 }}>
        <HeroHeadline
          color={palette.fg}
          size={heroSize}
          style={{ overflowWrap: "break-word" }}
        >
          {overlay}
        </HeroHeadline>
        {subtext && (
          <div
            style={{
              marginTop: 36,
              fontFamily: "var(--ff-body)",
              fontWeight: 500,
              fontSize: SUBTEXT_SIZE,
              color: palette.fgMuted,
              lineHeight: 1.35,
              maxWidth: 540,
            }}
          >
            {subtext}
          </div>
        )}
      </div>
      <div style={{ position: "absolute", left: 88, bottom: 88 }}>
        <PillCTA mode={ctaModeFor(palette, true)}>{cta ?? "Register now"}</PillCTA>
      </div>
    </div>
  );
}

/* ── 2. DULiveSpeakers — light bg + diagonal accent slash ────── */
export function DULiveSpeakers({
  overlay,
  subtext,
  cta,
  palette,
}: PhoenixTemplateProps) {
  const heroSize = pickHeroSize(overlay, { short: 110, medium: 92, long: 72 });
  return (
    <div style={{ ...FRAME, background: palette.bg }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: 720,
          height: 220,
          background: palette.accent,
          clipPath: "polygon(0 100%, 0 60%, 100% 0, 100% 100%)",
        }}
      />
      <div style={{ position: "absolute", left: 88, top: 88 }}>
        <Wordmark color={palette.fg} size={48} />
      </div>
      <div style={{ position: "absolute", left: 88, top: 240, width: 900 }}>
        <HeroHeadline
          color={palette.fg}
          size={heroSize}
          style={{ overflowWrap: "break-word" }}
        >
          {overlay}
        </HeroHeadline>
        {subtext && (
          <div
            style={{
              marginTop: 36,
              fontFamily: "var(--ff-body)",
              fontWeight: 500,
              fontSize: SUBTEXT_SIZE,
              color: palette.fgMuted,
              lineHeight: 1.35,
              maxWidth: 880,
            }}
          >
            {subtext}
          </div>
        )}
      </div>
      <div style={{ position: "absolute", right: 88, bottom: 88 }}>
        <PillCTA mode={ctaModeFor(palette)}>{cta ?? "Discover how"}</PillCTA>
      </div>
    </div>
  );
}

/* ── 3. DataAsPower — dark grid + oversized stat ─────────────── */
export function DataAsPower({
  overlay,
  subtext,
  cta,
  stat,
  palette,
}: PhoenixTemplateProps) {
  const heroStat = stat ?? extractStat(overlay) ?? "94%";
  const overlaySize = pickHeroSize(overlay, { short: 64, medium: 52, long: 42 });
  return (
    <div style={{ ...FRAME, background: palette.bg }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: palette.bgIsDark
            ? "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)"
            : "linear-gradient(rgba(6,6,93,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(6,6,93,0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div style={{ position: "absolute", left: 88, top: 88 }}>
        <Wordmark color={palette.fg} size={48} />
      </div>
      <div style={{ position: "absolute", left: 88, top: 240, width: 920 }}>
        <div
          style={{
            fontFamily: "var(--ff-display)",
            fontStyle: "italic",
            fontSize: 320,
            lineHeight: 0.85,
            color: palette.accent,
            letterSpacing: "-0.04em",
            textShadow: palette.bgIsDark
              ? `0 0 60px ${palette.accent}59`
              : "none",
          }}
        >
          {heroStat}
        </div>
        <div
          style={{
            fontFamily: "var(--ff-display)",
            fontStyle: "italic",
            fontSize: overlaySize,
            color: palette.fg,
            marginTop: 24,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            overflowWrap: "break-word",
          }}
        >
          {overlay}
        </div>
        {subtext && (
          <div
            style={{
              fontFamily: "var(--ff-body)",
              fontSize: SUBTEXT_SIZE,
              color: palette.fgMuted,
              marginTop: 28,
              lineHeight: 1.4,
              maxWidth: 880,
            }}
          >
            {subtext}
          </div>
        )}
      </div>
      <div style={{ position: "absolute", right: 88, bottom: 88 }}>
        <PillCTA mode={ctaModeFor(palette)}>{cta ?? "See the data"}</PillCTA>
      </div>
    </div>
  );
}

/* ── 4. RebelliousEditorial — uppercase + asterisk ────────────── */
export function RebelliousEditorial({
  overlay,
  subtext,
  cta,
  palette,
}: PhoenixTemplateProps) {
  const heroSize = pickHeroSize(overlay, { short: 110, medium: 88, long: 68 });
  return (
    <div style={{ ...FRAME, background: palette.bg, color: palette.fg }}>
      <div style={{ position: "absolute", left: 88, top: 88 }}>
        <Wordmark color={palette.fg} size={44} />
      </div>
      <div
        style={{
          position: "absolute",
          right: 60,
          top: 60,
          fontFamily: "var(--ff-display)",
          fontStyle: "italic",
          fontSize: 320,
          color: palette.accent,
          lineHeight: 1,
          letterSpacing: "-0.05em",
          userSelect: "none",
        }}
      >
        *
      </div>
      <div style={{ position: "absolute", left: 88, top: 300, width: 920 }}>
        <h1
          style={{
            fontFamily: "var(--ff-display)",
            fontStyle: "italic",
            fontWeight: 400,
            textTransform: "uppercase",
            fontSize: heroSize,
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            whiteSpace: "pre-line",
            overflowWrap: "break-word",
            margin: 0,
          }}
        >
          {overlay}
        </h1>
      </div>
      {subtext && (
        <div
          style={{
            position: "absolute",
            left: 88,
            bottom: 200,
            width: 820,
            fontFamily: "var(--ff-serif)",
            fontStyle: "italic",
            fontSize: SUBTEXT_SIZE,
            color: palette.fgMuted,
            lineHeight: 1.4,
          }}
        >
          {subtext}
        </div>
      )}
      <div style={{ position: "absolute", right: 88, bottom: 88 }}>
        <PillCTA mode={ctaModeFor(palette)}>{cta ?? "Read the truth"}</PillCTA>
      </div>
    </div>
  );
}

/* ── 5. CoBrandPartner — light + rock + partner lockup ──────── */
export function CoBrandPartner({
  overlay,
  subtext,
  cta,
  partner,
  palette,
}: PhoenixTemplateProps) {
  const heroSize = pickHeroSize(overlay, { short: 96, medium: 76, long: 60 });
  return (
    <div style={{ ...FRAME, background: palette.bg }}>
      <div style={{ position: "absolute", right: -180, top: 0 }}>
        <Rock width={780} height={1080} fill={palette.accent} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 88,
          top: 88,
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        <Wordmark color={palette.fg} size={44} />
        {partner && (
          <>
            <div
              style={{
                width: 1,
                height: 32,
                background: `${palette.fg}4d`,
              }}
            />
            <div
              style={{
                fontFamily: "var(--ff-body)",
                fontWeight: 700,
                fontSize: 26,
                color: palette.fg,
                letterSpacing: "-0.01em",
              }}
            >
              {partner}
            </div>
          </>
        )}
      </div>
      <div style={{ position: "absolute", left: 88, top: 280, width: 540 }}>
        <HeroHeadline
          color={palette.fg}
          size={heroSize}
          style={{ overflowWrap: "break-word" }}
        >
          {overlay}
        </HeroHeadline>
        {subtext && (
          <div
            style={{
              marginTop: 36,
              fontFamily: "var(--ff-body)",
              fontWeight: 500,
              fontSize: SUBTEXT_SIZE,
              color: palette.fgMuted,
              lineHeight: 1.4,
              maxWidth: 540,
            }}
          >
            {subtext}
          </div>
        )}
      </div>
      <div style={{ position: "absolute", left: 88, bottom: 88 }}>
        <PillCTA mode={ctaModeFor(palette)}>{cta ?? "Discover how"}</PillCTA>
      </div>
    </div>
  );
}

/* ── 6. PhoenixTitle — minimal hero, navy + rock + subtitle ────── */
export function PhoenixTitle({
  overlay,
  subtext,
  cta,
  palette,
}: PhoenixTemplateProps) {
  const heroSize = pickHeroSize(overlay, { short: 120, medium: 92, long: 72 });
  return (
    <div style={{ ...FRAME, background: palette.bg, color: palette.fg }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: palette.bgIsDark
            ? "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)"
            : "radial-gradient(rgba(6,6,93,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -100,
          top: -80,
        }}
      >
        <Rock width={620} height={620} fill={palette.accent} />
      </div>
      <div style={{ position: "absolute", left: 88, top: 88 }}>
        <Wordmark color={palette.fg} size={44} />
      </div>
      <div style={{ position: "absolute", left: 88, top: 380, width: 900 }}>
        <HeroHeadline
          color={palette.fg}
          size={heroSize}
          style={{ overflowWrap: "break-word" }}
        >
          {overlay}
        </HeroHeadline>
        {subtext && (
          <div
            style={{
              marginTop: 40,
              fontFamily: "var(--ff-body)",
              fontWeight: 500,
              fontSize: SUBTEXT_SIZE,
              color: palette.fgMuted,
              lineHeight: 1.4,
              maxWidth: 880,
            }}
          >
            {subtext}
          </div>
        )}
      </div>
      <div style={{ position: "absolute", left: 88, bottom: 88 }}>
        <PillCTA mode={ctaModeFor(palette, palette.bgIsDark)}>
          {cta ?? "Read the report"}
        </PillCTA>
      </div>
    </div>
  );
}

/* ── 7. PhoenixQuote — Phoenix gradient + Lora italic testimonial ── */
export function PhoenixQuote({
  overlay,
  subtext,
  cta,
  palette,
}: PhoenixTemplateProps) {
  const quoteSize = pickHeroSize(overlay, { short: 76, medium: 60, long: 46 });
  return (
    <div
      style={{
        ...FRAME,
        background:
          "linear-gradient(160deg, #0057FF 0%, #7E2EE9 45%, #B627C6 100%)",
        color: "#fff",
      }}
    >
      <div style={{ position: "absolute", left: 88, top: 88 }}>
        <Wordmark color="#fff" size={44} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 88,
          top: 220,
          fontFamily: "var(--ff-serif)",
          fontStyle: "italic",
          fontSize: 220,
          color: "rgba(255,255,255,0.32)",
          lineHeight: 0.85,
        }}
      >
        &ldquo;
      </div>
      <div style={{ position: "absolute", left: 88, top: 360, width: 920 }}>
        <p
          style={{
            fontFamily: "var(--ff-serif)",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: quoteSize,
            lineHeight: 1.18,
            letterSpacing: "-0.005em",
            margin: 0,
            overflowWrap: "break-word",
          }}
        >
          {overlay}
        </p>
      </div>
      {subtext && (
        <div
          style={{
            position: "absolute",
            left: 88,
            bottom: 200,
            fontFamily: "var(--ff-body)",
            fontWeight: 700,
            fontSize: 28,
            color: "#fff",
            lineHeight: 1.3,
            maxWidth: 800,
          }}
        >
          {subtext}
        </div>
      )}
      <div style={{ position: "absolute", right: 88, bottom: 88 }}>
        <PillCTA mode="outline-light">{cta ?? "Read the story"}</PillCTA>
      </div>
    </div>
  );
}

/* ── 8. PhoenixStat — alternative stat layout: stat first, label below ── */
export function PhoenixStat({
  overlay,
  subtext,
  cta,
  stat,
  palette,
}: PhoenixTemplateProps) {
  const heroStat = stat ?? extractStat(overlay) ?? "94%";
  const labelSize = pickHeroSize(overlay, { short: 84, medium: 64, long: 48 });
  return (
    <div style={{ ...FRAME, background: palette.bg, color: palette.fg }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: palette.bgIsDark
            ? "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)"
            : "linear-gradient(rgba(6,6,93,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(6,6,93,0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div style={{ position: "absolute", left: 88, top: 88 }}>
        <Wordmark color={palette.fg} size={44} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 88,
          top: 200,
          fontFamily: "var(--ff-display)",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: 420,
          lineHeight: 0.85,
          letterSpacing: "-0.04em",
          color: palette.accent,
          textShadow: palette.bgIsDark
            ? `0 0 80px ${palette.accent}66`
            : "none",
        }}
      >
        {heroStat}
      </div>
      <div
        style={{
          position: "absolute",
          left: 88,
          top: 700,
          width: 920,
          fontFamily: "var(--ff-display)",
          fontStyle: "italic",
          fontSize: labelSize,
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          color: palette.fg,
          overflowWrap: "break-word",
        }}
      >
        {overlay}
      </div>
      {subtext && (
        <div
          style={{
            position: "absolute",
            left: 88,
            bottom: 96,
            width: 720,
            fontFamily: "var(--ff-body)",
            fontSize: 26,
            color: palette.fgMuted,
            lineHeight: 1.4,
          }}
        >
          {subtext}
        </div>
      )}
      <div style={{ position: "absolute", right: 88, bottom: 88 }}>
        <PillCTA mode={ctaModeFor(palette)}>{cta ?? "See the data"}</PillCTA>
      </div>
    </div>
  );
}

/* ── 9. PhoenixComparison — "this not that" stacked cards ─────── */
export function PhoenixComparison({
  overlay,
  subtext,
  cta,
  palette,
}: PhoenixTemplateProps) {
  const parts = splitComparison(overlay);
  return (
    <div style={{ ...FRAME, background: palette.bg, color: palette.fg }}>
      <div style={{ position: "absolute", left: 88, top: 88 }}>
        <Wordmark color={palette.fg} size={44} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 88,
          top: 180,
          width: 900,
          fontFamily: "var(--ff-display)",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: 84,
          lineHeight: 0.95,
          letterSpacing: "-0.025em",
          color: palette.fg,
        }}
      >
        This, not that.
      </div>
      <div
        style={{
          position: "absolute",
          left: 88,
          top: 340,
          width: 904,
          padding: "32px 40px",
          background: palette.bgIsDark ? "rgba(255,255,255,0.06)" : "#EBE6DD",
          borderRadius: 14,
        }}
      >
        <div
          style={{
            fontFamily: "var(--ff-mono)",
            fontWeight: 600,
            fontSize: 16,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: palette.fgMuted,
          }}
        >
          — BEFORE
        </div>
        <div
          style={{
            fontFamily: "var(--ff-display)",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: 52,
            marginTop: 16,
            letterSpacing: "-0.02em",
            color: palette.fg,
            lineHeight: 1.05,
          }}
        >
          {parts.before}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 88,
          top: 600,
          width: 904,
          padding: "32px 40px",
          background: "#06065D",
          color: "#fff",
          borderRadius: 14,
        }}
      >
        <div
          style={{
            fontFamily: "var(--ff-mono)",
            fontWeight: 600,
            fontSize: 16,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: palette.accent,
          }}
        >
          — WITH DOCEBO
        </div>
        <div
          style={{
            fontFamily: "var(--ff-display)",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: 52,
            marginTop: 16,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
        >
          {parts.after}
        </div>
      </div>
      {subtext && (
        <div
          style={{
            position: "absolute",
            left: 88,
            bottom: 96,
            width: 700,
            fontFamily: "var(--ff-body)",
            fontSize: 22,
            color: palette.fgMuted,
            lineHeight: 1.4,
          }}
        >
          {subtext}
        </div>
      )}
      <div style={{ position: "absolute", right: 88, bottom: 88 }}>
        <PillCTA mode={ctaModeFor(palette)}>{cta ?? "See the difference"}</PillCTA>
      </div>
    </div>
  );
}

/* ── 10. PhoenixCTA — punchline-as-hero with rock + prominent CTA ── */
export function PhoenixCTA({
  overlay,
  subtext,
  cta,
  palette,
}: PhoenixTemplateProps) {
  const heroSize = pickHeroSize(overlay, { short: 140, medium: 108, long: 80 });
  return (
    <div style={{ ...FRAME, background: palette.bg, color: palette.fg }}>
      <div style={{ position: "absolute", right: -120, bottom: -120 }}>
        <Rock width={620} height={620} fill={palette.accent} />
      </div>
      <div style={{ position: "absolute", left: 88, top: 88 }}>
        <Wordmark color={palette.fg} size={48} />
      </div>
      <div style={{ position: "absolute", left: 88, top: 320, width: 820 }}>
        <HeroHeadline
          color={palette.fg}
          size={heroSize}
          style={{ overflowWrap: "break-word" }}
        >
          {overlay}
        </HeroHeadline>
        {subtext && (
          <div
            style={{
              marginTop: 36,
              fontFamily: "var(--ff-body)",
              fontWeight: 500,
              fontSize: SUBTEXT_SIZE,
              color: palette.fgMuted,
              lineHeight: 1.4,
              maxWidth: 760,
            }}
          >
            {subtext}
          </div>
        )}
      </div>
      <div style={{ position: "absolute", left: 88, bottom: 88 }}>
        <PillCTA mode={ctaModeFor(palette)} size={26}>
          {cta ?? "Book a demo"}
        </PillCTA>
      </div>
    </div>
  );
}

/* ───────────────── helpers ───────────────── */

/* Pick a hero font size based on character count so long headlines
   don't overflow the content box at the chosen display weight. */
function pickHeroSize(
  text: string,
  sizes: { short: number; medium: number; long: number },
): number {
  const len = (text ?? "").length;
  if (len <= 18) return sizes.short;
  if (len <= 32) return sizes.medium;
  return sizes.long;
}

/* Split a "this vs that" overlay into before/after halves for the
   Comparison template. Accepts " vs ", " not ", " — ", or splits at
   the midpoint as a fallback. */
function splitComparison(text: string): { before: string; after: string } {
  const t = text || "";
  const seps = [/\s+vs\.?\s+/i, /\s+not\s+/i, /\s+—\s+/, /\.\s+/];
  for (const re of seps) {
    const m = t.split(re);
    if (m.length === 2) return { before: m[0], after: m[1] };
  }
  const mid = Math.floor(t.length / 2);
  const space = t.indexOf(" ", mid);
  if (space > 0) return { before: t.slice(0, space), after: t.slice(space + 1) };
  return { before: t, after: "Outcomes." };
}

/* Try to find a stat-shaped substring (e.g. "3.2x", "94%") in the overlay
   so stat templates have something compelling to render when stat_value
   is not provided by the variant. */
function extractStat(text: string): string | null {
  if (!text) return null;
  const m = text.match(/(\d+(?:\.\d+)?(?:x|%))/i);
  return m?.[1] ?? null;
}
