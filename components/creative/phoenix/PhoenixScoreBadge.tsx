"use client";

import type { ScoreResult } from "./score";
import { SCORE_THRESHOLD } from "./score";

const SEVERITY_META = {
  error: { color: "text-docebo-pink", icon: "✕" },
  warning: { color: "text-amber-400", icon: "!" },
  info: { color: "text-docebo-light-blue", icon: "i" },
} as const;

function tierFor(score: number) {
  if (score >= 8) {
    return {
      label: "ship-ready",
      chip:
        "bg-docebo-bright-green/20 text-docebo-bright-green border-docebo-bright-green/40",
      dot: "bg-docebo-bright-green",
    };
  }
  if (score >= SCORE_THRESHOLD) {
    return {
      label: "passing",
      chip: "bg-amber-400/15 text-amber-400 border-amber-400/30",
      dot: "bg-amber-400",
    };
  }
  return {
    label: "below threshold",
    chip: "bg-docebo-pink/15 text-docebo-pink border-docebo-pink/40",
    dot: "bg-docebo-pink",
  };
}

interface PhoenixScoreBadgeProps {
  result: ScoreResult;
  expanded: boolean;
  onToggle: () => void;
}

export function PhoenixScoreBadge({
  result,
  expanded,
  onToggle,
}: PhoenixScoreBadgeProps) {
  const { score, issues, passing } = result;
  const tier = tierFor(score);
  const hasIssues = issues.length > 0;

  return (
    <button
      type="button"
      onClick={hasIssues ? onToggle : undefined}
      title={
        hasIssues
          ? `${issues.length} issue${issues.length === 1 ? "" : "s"} — click to expand`
          : passing
          ? "All Phoenix checks pass"
          : ""
      }
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-xs font-mono ${tier.chip} ${hasIssues ? "cursor-pointer hover:brightness-110" : "cursor-default"}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${tier.dot}`} />
      <span>{score.toFixed(1)}/10</span>
      {hasIssues && (
        <span className="text-[10px] opacity-80">
          {issues.length}
          <span className="ml-0.5">{expanded ? "▾" : "▸"}</span>
        </span>
      )}
    </button>
  );
}

interface PhoenixScoreIssuesProps {
  result: ScoreResult;
}

export function PhoenixScoreIssues({ result }: PhoenixScoreIssuesProps) {
  const { score, issues } = result;
  if (issues.length === 0) return null;
  const tier = tierFor(score);

  return (
    <div className="px-3 py-2 bg-docebo-card/40 border-b border-docebo-border/40 space-y-1.5">
      <div className="text-[10px] uppercase tracking-wide text-docebo-muted font-mono">
        Phoenix score · {tier.label}
      </div>
      {issues.map((issue, i) => {
        const meta = SEVERITY_META[issue.severity];
        return (
          <div key={i} className="flex items-start gap-2 text-xs">
            <span
              className={`flex-shrink-0 w-4 h-4 rounded-full border border-current flex items-center justify-center font-mono text-[10px] ${meta.color}`}
            >
              {meta.icon}
            </span>
            <div className="flex-1 leading-snug">
              <div className="text-white">{issue.message}</div>
              {issue.field && (
                <div className="text-[10px] text-docebo-muted mt-0.5 font-mono">
                  {issue.field}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
