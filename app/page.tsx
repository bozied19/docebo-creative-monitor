"use client";

import { useState, useEffect, useCallback } from "react";
import HealthTables, {
  type FatigueRow,
  type QualifiedRow,
  type FreshnessRow,
} from "@/components/creative/health-tables";
import RefreshEngine, {
  type Variant,
} from "@/components/creative/refresh-engine";
import AdCanvas from "@/components/creative/ad-canvas";

export default function CreativeMonitor() {
  const [fatigue, setFatigue] = useState<FatigueRow[]>([]);
  const [qualified, setQualified] = useState<QualifiedRow[]>([]);
  const [freshness, setFreshness] = useState<FreshnessRow[]>([]);
  const [healthLoading, setHealthLoading] = useState(true);
  const [healthError, setHealthError] = useState<string | null>(null);

  const [selectedCampaign, setSelectedCampaign] = useState<FatigueRow | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);

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

  function handleVariantsGenerated(newVariants: Variant[]) {
    setVariants(newVariants);
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-700/50 bg-gray-900/80 backdrop-blur shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "#00D4AA" }}
          >
            <span className="text-white font-bold text-sm">d</span>
          </div>
          <div>
            <h1 className="text-base font-semibold text-white">
              Creative Health Monitor
            </h1>
            <p className="text-xs text-gray-500">
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
            className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600 disabled:opacity-50 transition-colors"
          >
            {healthLoading ? "Refreshing..." : "Refresh Data"}
          </button>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            PostHog Live
          </div>
        </div>
      </header>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-px bg-gray-700/30 border-b border-gray-700/50 shrink-0">
        {[
          {
            label: "Total Campaigns",
            value: fatigue.length,
            color: "text-white",
          },
          {
            label: "Healthy",
            value: fatigue.filter((r) => r.status === "HEALTHY").length,
            color: "text-emerald-400",
          },
          {
            label: "Watch List",
            value: fatigue.filter((r) => r.status === "WATCH").length,
            color: "text-amber-400",
          },
          {
            label: "Needs Refresh",
            value: fatigue.filter(
              (r) => r.status === "PAUSE" || r.status === "REFRESH"
            ).length,
            color: "text-red-400",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-900 px-4 py-2.5 text-center"
          >
            <p className={`text-xl font-bold font-mono ${stat.color}`}>
              {healthLoading ? "—" : stat.value}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Three-panel layout */}
      <div className="flex-1 grid grid-cols-[1fr_380px_1fr] min-h-0">
        {/* Left: Health Tables */}
        <div className="border-r border-gray-700/50 overflow-hidden flex flex-col">
          <HealthTables
            fatigue={fatigue}
            qualified={qualified}
            freshness={freshness}
            loading={healthLoading}
            onCampaignClick={handleCampaignClick}
          />
        </div>

        {/* Center: Refresh Engine */}
        <div className="border-r border-gray-700/50 overflow-hidden flex flex-col">
          <RefreshEngine
            selectedCampaign={selectedCampaign}
            onVariantsGenerated={handleVariantsGenerated}
          />
        </div>

        {/* Right: Ad Canvas */}
        <div className="overflow-hidden flex flex-col">
          <AdCanvas variants={variants} />
        </div>
      </div>
    </div>
  );
}
