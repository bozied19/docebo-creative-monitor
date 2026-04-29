"use client";

import type { CSSProperties, ReactNode } from "react";

export const phoenixGradient =
  "linear-gradient(160deg, #0057FF 0%, #7E2EE9 45%, #B627C6 100%)";

interface WordmarkProps {
  color?: string;
  size?: number;
  style?: CSSProperties;
}

export function Wordmark({ color = "#fff", size = 36, style }: WordmarkProps) {
  return (
    <span
      style={{
        fontFamily: "var(--ff-display)",
        fontStyle: "italic",
        fontWeight: 400,
        fontSize: size,
        color,
        letterSpacing: "-0.025em",
        lineHeight: 1,
        display: "inline-block",
        ...style,
      }}
    >
      docebo
    </span>
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
