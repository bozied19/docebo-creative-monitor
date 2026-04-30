import type { Variant } from "../refresh-engine";
import type { ThemeConfig } from "../ad-canvas";

export const SCORE_THRESHOLD = 7;

export type IssueSeverity = "error" | "warning" | "info";

export interface ScoreIssue {
  severity: IssueSeverity;
  message: string;
  field?: keyof Variant;
}

export interface ScoreResult {
  score: number;
  issues: ScoreIssue[];
  passing: boolean;
}

/* Picks the same template the renderer would, returning the
   visual_style key (or "cobrand" if the theme overrides). */
function pickTemplateKey(variant: Variant, theme: ThemeConfig): string {
  if (theme.layout === "cobrand") return "cobrand";
  return variant.visual_style ?? "neon-intelligence";
}

/* Content-box widths the templates render into. Mirrors Templates.tsx. */
const TEMPLATE_CONTENT_WIDTH: Record<string, number> = {
  "data-as-power": 920,
  "rebellious-editorial": 920,
  "digital-rebellion": 920,
  "human-contrast": 900,
  "minimal-authority": 540,
  "neon-intelligence": 540,
  "system-ui": 540,
  cobrand: 540,
};

/* Mirrors the pickHeroSize() heuristic in Templates.tsx so the scorer
   uses the same font size the template will actually render at. */
function predictHeroSize(overlay: string, templateKey: string): number {
  const len = overlay.length;
  const sizes =
    templateKey === "rebellious-editorial" || templateKey === "digital-rebellion"
      ? { short: 110, medium: 88, long: 68 }
      : templateKey === "human-contrast"
      ? { short: 110, medium: 92, long: 72 }
      : { short: 96, medium: 76, long: 60 };
  if (len <= 18) return sizes.short;
  if (len <= 32) return sizes.medium;
  return sizes.long;
}

/* Heuristic glyph-width estimate. Special Gothic Expanded italic averages
   ~0.55x font size per character; spaces narrower. Good enough to predict
   line wrapping within ~10%. */
function estimateLineCount(text: string, fontSize: number, boxWidth: number): number {
  if (!text) return 0;
  const tokens = text.split(/(\s+)/);
  let lines = 1;
  let cursor = 0;
  for (const tok of tokens) {
    const w = tok.length * fontSize * (tok.trim() === "" ? 0.3 : 0.55);
    if (cursor + w > boxWidth) {
      lines++;
      cursor = w;
    } else {
      cursor += w;
    }
  }
  return lines;
}

const EMOJI_RE = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u;
const STAT_RE = /(\d+(?:\.\d+)?)(x|%|m|b|k)\b/i;

export function scoreVariant(variant: Variant, theme: ThemeConfig): ScoreResult {
  const issues: ScoreIssue[] = [];
  const overlay = variant.creative_overlay ?? "";
  const subtext = variant.overlay_subtext ?? "";
  const cta = variant.cta_text ?? "";
  const templateKey = pickTemplateKey(variant, theme);
  const contentWidth = TEMPLATE_CONTENT_WIDTH[templateKey] ?? 540;

  /* 1. Headline fit — predict line count at the font size the template
        will pick, error if it would wrap >4 lines. */
  const heroSize = predictHeroSize(overlay, templateKey);
  const lines = estimateLineCount(overlay, heroSize, contentWidth);
  if (lines > 4) {
    issues.push({
      severity: "error",
      message: `Headline likely wraps to ${lines} lines — too long for the template`,
      field: "creative_overlay",
    });
  } else if (lines > 3) {
    issues.push({
      severity: "warning",
      message: `Headline may wrap to ${lines} lines — consider shortening`,
      field: "creative_overlay",
    });
  }

  /* 2. Headline word count — Phoenix README: hero headlines are 3–8 words,
        max 12. */
  const words = overlay.trim().split(/\s+/).filter(Boolean).length;
  if (words > 12) {
    issues.push({
      severity: "error",
      message: `Headline is ${words} words (Phoenix max: 12)`,
      field: "creative_overlay",
    });
  } else if (words > 8) {
    issues.push({
      severity: "warning",
      message: `Headline is ${words} words (Phoenix prefers 3–8)`,
      field: "creative_overlay",
    });
  } else if (words > 0 && words < 2) {
    issues.push({
      severity: "info",
      message: `Headline is only ${words} word — Phoenix prefers 3–8 for impact`,
      field: "creative_overlay",
    });
  }

  /* 3. Subtext length. */
  if (subtext.length > 140) {
    issues.push({
      severity: "warning",
      message: `Subtext is ${subtext.length} chars (≤140 recommended)`,
      field: "overlay_subtext",
    });
  }

  /* 4. CTA quality. */
  if (cta.length > 24) {
    issues.push({
      severity: "warning",
      message: `CTA is ${cta.length} chars (≤24 fits the pill cleanly)`,
      field: "cta_text",
    });
  }
  if (cta.endsWith(".")) {
    issues.push({
      severity: "warning",
      message: 'CTA ends in a period — Phoenix CTAs end with the auto-appended →',
      field: "cta_text",
    });
  }
  if (EMOJI_RE.test(cta)) {
    issues.push({
      severity: "error",
      message: "CTA contains emoji — Phoenix is post-emoji",
      field: "cta_text",
    });
  }

  /* 5. Brand invariants — emoji and capitalized "Docebo" are wrong. */
  if (EMOJI_RE.test(overlay)) {
    issues.push({
      severity: "error",
      message: "Headline contains emoji — Phoenix is post-emoji",
      field: "creative_overlay",
    });
  }
  if (subtext && EMOJI_RE.test(subtext)) {
    issues.push({
      severity: "error",
      message: "Subtext contains emoji — Phoenix is post-emoji",
      field: "overlay_subtext",
    });
  }
  if (/\bDocebo\b/.test(overlay) || /\bDocebo\b/.test(subtext)) {
    issues.push({
      severity: "warning",
      message: 'Brand name appears as "Docebo" — wordmark is always lowercase "docebo"',
    });
  }

  /* 6. Stat present (DataAsPower only). */
  if (templateKey === "data-as-power") {
    const stat = variant.stat_value ?? overlay.match(STAT_RE)?.[0];
    if (!stat) {
      issues.push({
        severity: "warning",
        message:
          'DataAsPower template has no stat to render — set stat_value or include a stat (e.g. "94%", "3.2x") in the headline',
        field: "stat_value",
      });
    }
  }

  /* Score: 10 → −2 per error → −1 per warning → −0.5 per info → floor 0. */
  let score = 10;
  for (const issue of issues) {
    if (issue.severity === "error") score -= 2;
    else if (issue.severity === "warning") score -= 1;
    else score -= 0.5;
  }
  score = Math.max(0, Math.round(score * 10) / 10);

  return {
    score,
    issues,
    passing: score >= SCORE_THRESHOLD,
  };
}
