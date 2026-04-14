"use client";

import { useState, useEffect, useCallback } from "react";
import HealthTables, {
  type FatigueRow,
  type QualifiedRow,
  type FreshnessRow,
} from "@/components/creative/health-tables";
import RefreshEngine, {
  type Variant,
  type CanvasRenderContext,
} from "@/components/creative/refresh-engine";
import AdCanvas from "@/components/creative/ad-canvas";
import ThemeToggle from "@/components/theme-toggle";

export default function CreativeMonitor() {
  const [fatigue, setFatigue] = useState<FatigueRow[]>([]);
  const [qualified, setQualified] = useState<QualifiedRow[]>([]);
  const [freshness, setFreshness] = useState<FreshnessRow[]>([]);
  const [healthLoading, setHealthLoading] = useState(true);
  const [healthError, setHealthError] = useState<string | null>(null);

  const [selectedCampaign, setSelectedCampaign] = useState<FatigueRow | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [renderContext, setRenderContext] = useState<CanvasRenderContext | undefined>(undefined);

  const loadHealth = useCallback(async () => {
    setHealthLoading(true);
    setHealthError(null);
    try {
      const res = await fetch("/api/creative/health");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFatigue(data.fatigue);
      setQualified(data.qualified);
      setFreshness(data.freshness);
    } catch (err) {
      setHealthError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setHealthLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHealth();
  }, [loadHealth]);

  function handleCampaignClick(row: FatigueRow) {
    if (row.status === "HEALTHY") return;
    setSelectedCampaign(row);
  }

  function handleVariantsGenerated(newVariants: Variant[], ctx: CanvasRenderContext) {
    setVariants(newVariants);
    setRenderContext(ctx);
  }

  return (
    <div className="min-h-screen lg:h-screen flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-docebo-border bg-docebo-midnight/90 backdrop-blur shrink-0">
        <div className="flex items-center gap-3">
          <div
            role="img"
            aria-label="Docebo"
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_4px_10px_rgba(0,87,255,0.35)]"
            style={{ backgroundColor: "#0057FF" }}
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="w-4 h-4 text-white">
              <path
                d="M13.5 2.5v7.8a6 6 0 1 1-2.2-4.65V2.5h2.2zm-5.7 13.3a3.8 3.8 0 1 0 0-7.6 3.8 3.8 0 0 0 0 7.6z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold text-white font-headline tracking-tight">
              Creative Health Monitor
            </h1>
            <p className="text-xs text-docebo-muted">
              PostHog fatigue data + Creative Refresh Engine
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {healthError && (
            <span className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded">
              {healthError}
            </span>
          )}
          <button
            onClick={loadHealth}
            disabled={healthLoading}
            className="text-xs px-3 py-1.5 rounded-lg bg-docebo-card border border-docebo-border text-docebo-muted hover:text-white hover:border-docebo-blue/50 disabled:opacity-50 transition-colors inline-flex items-center gap-1.5"
          >
            {healthLoading && (
              <svg
                aria-hidden="true"
                className="w-3 h-3 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
                <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            )}
            {healthLoading ? "Refreshing…" : "Refresh Data"}
          </button>
          <div className="flex items-center gap-1.5 text-xs text-docebo-muted">
            <span className="w-2 h-2 rounded-full bg-docebo-bright-green" />
            PostHog Live
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-docebo-border/30 border-b border-docebo-border shrink-0">
        {[
          {
            label: "Total Campaigns",
            value: fatigue.length,
            color: "text-white",
            hint: "All campaigns currently tracked by PostHog",
          },
          {
            label: "Healthy",
            value: fatigue.filter((r) => r.status === "HEALTHY").length,
            color: "text-docebo-bright-green",
            hint: "Fatigue score below threshold, CTR holding",
          },
          {
            label: "Watch List",
            value: fatigue.filter((r) => r.status === "WATCH").length,
            color: "text-amber-400",
            hint: "Early signs of fatigue — CTR softening",
          },
          {
            label: "Needs Refresh",
            value: fatigue.filter(
              (r) => r.status === "PAUSE" || r.status === "REFRESH"
            ).length,
            color: "text-docebo-pink",
            hint: "Paused or flagged for refresh — CTR collapsed or CPM spiking",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            title={stat.hint}
            className="bg-docebo-midnight px-4 py-2.5 text-center cursor-help"
          >
            <p className={`text-xl font-semibold font-mono tabular-nums ${stat.color}`}>
              {healthLoading ? "—" : stat.value}
            </p>
            <p className="text-[13px] text-docebo-muted/90 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Three-panel layout — stacks on mobile, 3 cols on lg+
          Center is primary (lighter surface). Left/right sit on the
          darker midnight background so the eye lands on center. */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_420px_1fr] lg:min-h-0">
        {/* Left: Health Tables (supporting — entry point) */}
        <div className="border-b lg:border-b-0 lg:border-r border-docebo-border overflow-hidden flex flex-col">
          <HealthTables
            fatigue={fatigue}
            qualified={qualified}
            freshness={freshness}
            loading={healthLoading}
            onCampaignClick={handleCampaignClick}
          />
        </div>

        {/* Center: Refresh Engine (primary action — elevated surface) */}
        <div className="border-b lg:border-b-0 lg:border-r border-docebo-border bg-docebo-card/40 overflow-hidden flex flex-col">
          <RefreshEngine
            selectedCampaign={selectedCampaign}
            onVariantsGenerated={handleVariantsGenerated}
          />
        </div>

        {/* Right: Ad Canvas / Brand voice reference (supporting) */}
        <div className="overflow-hidden flex flex-col">
          <AdCanvas variants={variants} renderContext={renderContext} />
        </div>
      </div>
    </div>
  );
}
