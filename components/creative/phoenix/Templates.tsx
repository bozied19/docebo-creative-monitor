"use client";

import {
  Wordmark,
  Eyebrow,
  HeroHeadline,
  PillCTA,
  Rock,
  DateChip,
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
  /** Optional eyebrow text override. */
  eyebrow?: string;
  /** Partner name for co-brand layouts. */
  partner?: string;
}

const FRAME: React.CSSProperties = {
  position: "relative",
  width: 1080,
  height: 1080,
  overflow: "hidden",
};

/* ── 1. WebinarNavyPink — navy + pink rock + circuit grid ────────── */
export function WebinarNavyPink({
  overlay,
  subtext,
  cta,
  eyebrow,
}: PhoenixTemplateProps) {
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
      <div style={{ position: "absolute", left: 88, top: 280, width: 720 }}>
        <Eyebrow color="#FF5DD8" style={{ marginBottom: 28 }}>
          {eyebrow ?? "— WEBINAR · LIVE EVENT"}
        </Eyebrow>
        <HeroHeadline size={92}>{overlay}</HeroHeadline>
        {subtext && (
          <div
            style={{
              marginTop: 36,
              fontFamily: "var(--ff-body)",
              fontWeight: 500,
              fontSize: 28,
              color: "rgba(255,255,255,0.78)",
              lineHeight: 1.35,
              maxWidth: 680,
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
  eyebrow,
}: PhoenixTemplateProps) {
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
        <Eyebrow color="#7E2EE9" style={{ marginBottom: 28 }}>
          {eyebrow ?? "— EDITORIAL · ON BRAND"}
        </Eyebrow>
        <HeroHeadline color="#06065D" size={104}>
          {overlay}
        </HeroHeadline>
        {subtext && (
          <div
            style={{
              marginTop: 36,
              fontFamily: "var(--ff-body)",
              fontWeight: 500,
              fontSize: 28,
              color: "rgba(6,6,93,0.72)",
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
  eyebrow,
}: PhoenixTemplateProps) {
  const heroStat = stat ?? extractStat(overlay) ?? "94%";
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
      <div style={{ position: "absolute", left: 88, top: 230, width: 920 }}>
        <Eyebrow color="#54FA77" style={{ marginBottom: 28 }}>
          {eyebrow ?? "— THE DATA"}
        </Eyebrow>
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
            fontSize: 60,
            color: "#fff",
            marginTop: 24,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
        >
          {overlay}
        </div>
        {subtext && (
          <div
            style={{
              fontFamily: "var(--ff-body)",
              fontSize: 26,
              color: "rgba(255,255,255,0.65)",
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

/* ── 4. RebelliousEditorial — marble dark + uppercase + asterisk ── */
export function RebelliousEditorial({
  overlay,
  subtext,
  cta,
}: PhoenixTemplateProps) {
  return (
    <div style={{ ...FRAME, background: "#2A2923", color: "#fff" }}>
      <div style={{ position: "absolute", left: 88, top: 88 }}>
        <Wordmark color="#fff" size={44} />
      </div>
      <div
        style={{
          position: "absolute",
          right: -40,
          top: 20,
          fontFamily: "var(--ff-display)",
          fontStyle: "italic",
          fontSize: 540,
          color: "#FF5DD8",
          lineHeight: 1,
          letterSpacing: "-0.05em",
          userSelect: "none",
        }}
      >
        *
      </div>
      <div style={{ position: "absolute", left: 88, top: 280, width: 920 }}>
        <h1
          style={{
            fontFamily: "var(--ff-display)",
            fontStyle: "italic",
            fontWeight: 400,
            textTransform: "uppercase",
            fontSize: 140,
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            whiteSpace: "pre-line",
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
            bottom: 220,
            width: 760,
            fontFamily: "var(--ff-serif)",
            fontStyle: "italic",
            fontSize: 26,
            color: "rgba(255,255,255,0.7)",
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
  eyebrow,
  partner,
}: PhoenixTemplateProps) {
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
      <div style={{ position: "absolute", left: 88, top: 280, width: 720 }}>
        <Eyebrow color="#7E2EE9" style={{ marginBottom: 28 }}>
          {eyebrow ?? (partner ? "— PARTNER" : "— EDITORIAL")}
        </Eyebrow>
        <HeroHeadline color="#06065D" size={96}>
          {overlay}
        </HeroHeadline>
        {subtext && (
          <div
            style={{
              marginTop: 36,
              fontFamily: "var(--ff-body)",
              fontWeight: 500,
              fontSize: 26,
              color: "rgba(6,6,93,0.72)",
              lineHeight: 1.4,
              maxWidth: 700,
            }}
          >
            {subtext}
          </div>
        )}
      </div>
      <div style={{ position: "absolute", left: 88, bottom: 88 }}>
        <PillCTA mode="solid-navy">{cta ?? "Discover how"}</PillCTA>
      </div>
      <div style={{ position: "absolute", right: 88, bottom: 88 }}>
        <DateChip date="" time={undefined} color="#06065D" />
      </div>
    </div>
  );
}

/* Try to find a stat-shaped substring (e.g. "3.2x", "94%") in the overlay
   so DataAsPower has something compelling to render when stat_value is
   not provided by the variant. */
function extractStat(text: string): string | null {
  if (!text) return null;
  const m = text.match(/(\d+(?:\.\d+)?(?:x|%))/i);
  return m?.[1] ?? null;
}
