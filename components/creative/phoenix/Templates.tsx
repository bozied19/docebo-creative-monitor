"use client";

import {
  Wordmark,
  HeroHeadline,
  PillCTA,
  Rock,
} from "./PhoenixBanner";

/* All templates render into a fixed 1080x1080 art board. The PhoenixRenderer
   wraps them in a container that scales the board to fit the card width. */

export interface PhoenixTemplateProps {
  /** Hero headline text — primary in-image overlay. */
  overlay: string;
  /** Supporting line under the headline. */
  subtext?: string;
  /** Call-to-action label (the "→" is appended automatically). */
  cta?: string;
  /** Numeric stat for stat-led layouts (DataAsPower). */
  stat?: string;
  /** Partner name for co-brand layouts. */
  partner?: string;
}

const FRAME: React.CSSProperties = {
  position: "relative",
  width: 1080,
  height: 1080,
  overflow: "hidden",
};

const SUBTEXT_SIZE = 38;

/* ── 1. WebinarNavyPink — navy + pink rock + circuit grid ────────── */
export function WebinarNavyPink({
  overlay,
  subtext,
  cta,
}: PhoenixTemplateProps) {
  const heroSize = pickHeroSize(overlay, { short: 96, medium: 76, long: 60 });
  return (
    <div style={{ ...FRAME, background: "#06065D" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div style={{ position: "absolute", right: -180, top: 0 }}>
        <Rock width={780} height={1080} fill="#FF5DD8" />
      </div>
      <div style={{ position: "absolute", left: 88, top: 88 }}>
        <Wordmark color="#fff" size={56} />
      </div>
      <div style={{ position: "absolute", left: 88, top: 280, width: 540 }}>
        <HeroHeadline size={heroSize} style={{ overflowWrap: "break-word" }}>
          {overlay}
        </HeroHeadline>
        {subtext && (
          <div
            style={{
              marginTop: 36,
              fontFamily: "var(--ff-body)",
              fontWeight: 500,
              fontSize: SUBTEXT_SIZE,
              color: "rgba(255,255,255,0.85)",
              lineHeight: 1.35,
              maxWidth: 540,
            }}
          >
            {subtext}
          </div>
        )}
      </div>
      <div style={{ position: "absolute", left: 88, bottom: 88 }}>
        <PillCTA mode="outline-light">{cta ?? "Register now"}</PillCTA>
      </div>
    </div>
  );
}

/* ── 2. DULiveSpeakers — beige + lime accent slash ─────────────── */
export function DULiveSpeakers({
  overlay,
  subtext,
  cta,
}: PhoenixTemplateProps) {
  const heroSize = pickHeroSize(overlay, { short: 110, medium: 92, long: 72 });
  return (
    <div style={{ ...FRAME, background: "#E6DACB" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: 720,
          height: 220,
          background: "#E3FFAB",
          clipPath: "polygon(0 100%, 0 60%, 100% 0, 100% 100%)",
        }}
      />
      <div style={{ position: "absolute", left: 88, top: 88 }}>
        <Wordmark color="#06065D" size={48} />
      </div>
      <div style={{ position: "absolute", left: 88, top: 240, width: 900 }}>
        <HeroHeadline
          color="#06065D"
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
              color: "rgba(6,6,93,0.78)",
              lineHeight: 1.35,
              maxWidth: 880,
            }}
          >
            {subtext}
          </div>
        )}
      </div>
      <div style={{ position: "absolute", right: 88, bottom: 88 }}>
        <PillCTA mode="solid-navy">{cta ?? "Discover how"}</PillCTA>
      </div>
    </div>
  );
}

/* ── 3. DataAsPower — midnight + grid + oversized stat ─────────── */
export function DataAsPower({
  overlay,
  subtext,
  cta,
  stat,
}: PhoenixTemplateProps) {
  const heroStat = stat ?? extractStat(overlay) ?? "94%";
  const overlaySize = pickHeroSize(overlay, { short: 64, medium: 52, long: 42 });
  return (
    <div style={{ ...FRAME, background: "#131E29" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div style={{ position: "absolute", left: 88, top: 88 }}>
        <Wordmark color="#fff" size={48} />
      </div>
      <div style={{ position: "absolute", left: 88, top: 240, width: 920 }}>
        <div
          style={{
            fontFamily: "var(--ff-display)",
            fontStyle: "italic",
            fontSize: 320,
            lineHeight: 0.85,
            color: "#54FA77",
            letterSpacing: "-0.04em",
            textShadow: "0 0 60px rgba(84,250,119,0.35)",
          }}
        >
          {heroStat}
        </div>
        <div
          style={{
            fontFamily: "var(--ff-display)",
            fontStyle: "italic",
            fontSize: overlaySize,
            color: "#fff",
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
              color: "rgba(255,255,255,0.75)",
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
        <PillCTA mode="solid-green">{cta ?? "See the data"}</PillCTA>
      </div>
    </div>
  );
}

/* ── 4. RebelliousEditorial — midnight + uppercase + asterisk ──── */
export function RebelliousEditorial({
  overlay,
  subtext,
  cta,
}: PhoenixTemplateProps) {
  const heroSize = pickHeroSize(overlay, { short: 110, medium: 88, long: 68 });
  return (
    <div style={{ ...FRAME, background: "#131E29", color: "#fff" }}>
      <div style={{ position: "absolute", left: 88, top: 88 }}>
        <Wordmark color="#fff" size={44} />
      </div>
      <div
        style={{
          position: "absolute",
          right: 60,
          top: 60,
          fontFamily: "var(--ff-display)",
          fontStyle: "italic",
          fontSize: 320,
          color: "#FF5DD8",
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
            color: "rgba(255,255,255,0.78)",
            lineHeight: 1.4,
          }}
        >
          {subtext}
        </div>
      )}
      <div style={{ position: "absolute", right: 88, bottom: 88 }}>
        <PillCTA mode="solid-pink">{cta ?? "Read the truth"}</PillCTA>
      </div>
    </div>
  );
}

/* ── 5. CoBrandPartner — beige + pink rock + partner lockup ────── */
export function CoBrandPartner({
  overlay,
  subtext,
  cta,
  partner,
}: PhoenixTemplateProps) {
  const heroSize = pickHeroSize(overlay, { short: 96, medium: 76, long: 60 });
  return (
    <div style={{ ...FRAME, background: "#E6DACB" }}>
      <div style={{ position: "absolute", right: -180, top: 0 }}>
        <Rock width={780} height={1080} fill="#FF5DD8" />
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
        <Wordmark color="#06065D" size={44} />
        {partner && (
          <>
            <div
              style={{
                width: 1,
                height: 32,
                background: "rgba(6,6,93,0.3)",
              }}
            />
            <div
              style={{
                fontFamily: "var(--ff-body)",
                fontWeight: 700,
                fontSize: 26,
                color: "#06065D",
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
          color="#06065D"
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
              color: "rgba(6,6,93,0.78)",
              lineHeight: 1.4,
              maxWidth: 540,
            }}
          >
            {subtext}
          </div>
        )}
      </div>
      <div style={{ position: "absolute", left: 88, bottom: 88 }}>
        <PillCTA mode="solid-navy">{cta ?? "Discover how"}</PillCTA>
      </div>
    </div>
  );
}

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

/* Try to find a stat-shaped substring (e.g. "3.2x", "94%") in the overlay
   so DataAsPower has something compelling to render when stat_value is
   not provided by the variant. */
function extractStat(text: string): string | null {
  if (!text) return null;
  const m = text.match(/(\d+(?:\.\d+)?(?:x|%))/i);
  return m?.[1] ?? null;
}
