"use client";

import type { CSSProperties, ReactNode } from "react";

export const phoenixGradient =
  "linear-gradient(160deg, #0057FF 0%, #7E2EE9 45%, #B627C6 100%)";

interface WordmarkProps {
  /** Fill color for the wordmark glyphs. */
  color?: string;
  /** Rendered height in px (width derives from the 355:72 viewBox). */
  size?: number;
  style?: CSSProperties;
}

/* Official Docebo wordmark SVG paths (from brand assets, 355x72 viewBox).
   Rendered with fill="currentColor" so the `color` prop drives the fill. */
export function Wordmark({ color = "#fff", size = 36, style }: WordmarkProps) {
  const width = (size * 355) / 72;
  return (
    <svg
      viewBox="0 0 355 72"
      width={width}
      height={size}
      fill="currentColor"
      role="img"
      aria-label="Docebo"
      style={{ color, display: "inline-block", flexShrink: 0, ...style }}
    >
      <path d="M117.54,43.8c0,13.85-9.03,27.7-27.26,27.7s-27.26-13.85-27.26-27.7,9.12-27.87,27.26-27.87,27.26,13.94,27.26,27.87ZM77.04,43.71c0,7.63,4.38,15.16,13.24,15.16s13.24-7.54,13.24-15.16-4.38-15.16-13.24-15.16-13.24,7.63-13.24,15.16Z" />
      <path d="M150.36,71.5c-18.23,0-27.26-13.85-27.26-27.7s9.12-27.87,27.26-27.87c12.45,0,20.6,6.57,24.54,15.16l-13.15,4.47c-2.1-4.03-5.87-7.01-11.4-7.01-8.85,0-13.24,7.63-13.24,15.16s4.38,15.16,13.24,15.16c5.52,0,9.38-2.98,11.4-7.1l13.24,4.47c-3.86,8.68-12.1,15.25-24.63,15.25Z" />
      <path d="M205.49,71.5c-18.23,0-27.26-13.85-27.26-27.7s9.12-27.87,27.26-27.87,26.38,13.85,26.38,27.7c0,1.75-.09,3.59-.44,5.35h-38.48c1.58,5.52,5.78,9.9,12.53,9.9,5.52,0,9.38-2.98,11.4-7.1l13.24,4.47c-3.86,8.68-12.1,15.25-24.63,15.25ZM217.23,36.35c-1.93-4.47-5.87-7.8-11.75-7.8s-9.82,3.33-11.75,7.8h23.49Z" />
      <path d="M252.1.5v22.09c3.68-4.03,8.77-6.66,15.6-6.66,15.78,0,24.89,13.94,24.89,27.87s-9.03,27.7-24.89,27.7c-6.84,0-11.92-2.54-15.6-6.57v5.7h-13.5V.5h13.5ZM265.34,58.88c8.85,0,13.24-7.54,13.24-15.16s-4.38-15.16-13.24-15.16-13.24,7.63-13.24,15.16,4.38,15.16,13.24,15.16Z" />
      <path d="M56.25.5v70.12h-13.5v-5.7c-3.68,4.03-8.77,6.57-15.6,6.57-15.87,0-24.89-13.85-24.89-27.7,0-13.94,9.12-27.87,24.89-27.87,6.84,0,11.92,2.63,15.6,6.66V.5h13.5ZM42.75,43.71c0-7.54-4.38-15.16-13.24-15.16s-13.24,7.63-13.24,15.16c0,7.63,4.38,15.16,13.24,15.16s13.24-7.54,13.24-15.16Z" />
      <path d="M352.75,43.8c0,13.85-9.03,27.7-27.26,27.7s-27.26-13.85-27.26-27.7,9.12-27.87,27.26-27.87,27.26,13.94,27.26,27.87ZM312.25,43.71c0,7.63,4.38,15.16,13.24,15.16s13.24-7.54,13.24-15.16-4.38-15.16-13.24-15.16-13.24,7.63-13.24,15.16Z" />
    </svg>
  );
}

interface EyebrowProps {
  children: ReactNode;
  color?: string;
  style?: CSSProperties;
}

export function Eyebrow({ children, color = "#FF5DD8", style }: EyebrowProps) {
  return (
    <div
      style={{
        fontFamily: "var(--ff-mono)",
        fontWeight: 600,
        fontSize: 14,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

interface HeroHeadlineProps {
  children: ReactNode;
  color?: string;
  accent?: string;
  accentColor?: string;
  size?: number;
  style?: CSSProperties;
}

export function HeroHeadline({
  children,
  color = "#fff",
  accent,
  accentColor = "#FF5DD8",
  size = 96,
  style,
}: HeroHeadlineProps) {
  return (
    <h1
      style={{
        fontFamily: "var(--ff-display)",
        fontStyle: "italic",
        fontWeight: 400,
        fontSize: size,
        lineHeight: 0.95,
        letterSpacing: "-0.025em",
        color,
        margin: 0,
        whiteSpace: "pre-line",
        ...style,
      }}
    >
      {children}
      {accent && (
        <>
          <br />
          <span style={{ color: accentColor }}>{accent}</span>
        </>
      )}
    </h1>
  );
}

interface SubMetaProps {
  children: ReactNode;
  color?: string;
  size?: number;
  style?: CSSProperties;
}

export function SubMeta({
  children,
  color = "rgba(255,255,255,0.85)",
  size = 22,
  style,
}: SubMetaProps) {
  return (
    <div
      style={{
        fontFamily: "var(--ff-body)",
        fontWeight: 500,
        fontSize: size,
        lineHeight: 1.35,
        color,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export type PillCTAMode =
  | "outline-light"
  | "outline-dark"
  | "solid-pink"
  | "solid-green"
  | "solid-navy"
  | "solid-purple";

interface PillCTAProps {
  children: ReactNode;
  mode?: PillCTAMode;
  size?: number;
  style?: CSSProperties;
}

export function PillCTA({
  children,
  mode = "outline-light",
  size = 22,
  style,
}: PillCTAProps) {
  const base: CSSProperties = {
    fontFamily: "var(--ff-body)",
    fontWeight: 700,
    fontSize: size,
    padding: `${Math.round(size * 0.9)}px ${Math.round(size * 2)}px`,
    borderRadius: 999,
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    border: "none",
    letterSpacing: "-0.005em",
  };
  const modes: Record<PillCTAMode, CSSProperties> = {
    "outline-light": {
      ...base,
      background: "transparent",
      color: "#fff",
      border: "1.8px solid rgba(255,255,255,0.85)",
    },
    "outline-dark": {
      ...base,
      background: "transparent",
      color: "#06065D",
      border: "1.8px solid rgba(6,6,93,0.65)",
    },
    "solid-pink": { ...base, background: "#FF5DD8", color: "#06065D" },
    "solid-green": { ...base, background: "#E3FFAB", color: "#106D24" },
    "solid-navy": { ...base, background: "#0033A0", color: "#fff" },
    "solid-purple": { ...base, background: "#7E2EE9", color: "#fff" },
  };
  return (
    <span style={{ ...modes[mode], ...style }}>
      {children}
      <span style={{ marginLeft: 4 }}>→</span>
    </span>
  );
}

interface RockProps {
  width?: number;
  height?: number;
  fill?: string;
  style?: CSSProperties;
}

export function Rock({
  width = 1080,
  height = 1080,
  fill = "#FF5DD8",
  style,
}: RockProps) {
  return (
    <svg viewBox="0 0 1080 1080" width={width} height={height} style={style}>
      <path
        d="M 734.4 0 L 1080 0 L 1080 1080 L 172.8 1080 L 11.653 838.279 C 4.2 827.1 1.56 813.391 4.328 800.244 L 172.8 0 L 734.4 0 Z"
        fill={fill}
      />
    </svg>
  );
}

interface StatProps {
  value: ReactNode;
  label: ReactNode;
  color?: string;
  size?: number;
}

export function Stat({ value, label, color = "#54FA77", size = 84 }: StatProps) {
  return (
    <div>
      <div
        style={{
          fontFamily: "var(--ff-display)",
          fontStyle: "italic",
          fontSize: size,
          lineHeight: 0.95,
          color,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: "var(--ff-mono)",
          fontWeight: 600,
          fontSize: 13,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.7)",
          marginTop: 6,
        }}
      >
        {label}
      </div>
    </div>
  );
}

interface DateChipProps {
  date: ReactNode;
  time?: ReactNode;
  color?: string;
}

export function DateChip({ date, time, color = "#fff" }: DateChipProps) {
  return (
    <div
      style={{
        fontFamily: "var(--ff-body)",
        fontWeight: 600,
        fontSize: 22,
        color,
        lineHeight: 1.4,
      }}
    >
      <div>{date}</div>
      {time && (
        <div style={{ color: "rgba(255,255,255,0.7)", fontWeight: 400 }}>
          {time}
        </div>
      )}
    </div>
  );
}
