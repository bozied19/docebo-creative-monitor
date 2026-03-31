"use client";

import { useState } from "react";

export interface FatigueRow {
  campaign_name: string;
  platform: string;
  launch_date: string;
  baseline_ctr: number;
  current_ctr: number;
  baseline_cpm: number;
  current_cpm: number;
  fatigue_score: number;
  status: "HEALTHY" | "WATCH" | "REFRESH" | "PAUSE";
}

export interface QualifiedRow {
  campaign_name: string;
  platform: string;
  total_impressions: number;
  total_clicks: number;
  total_spend: number;
  first_delivery: string;
  last_delivery: string;
  active_days: number;
  ctr_pct: number;
  cpm: number;
}

export interface FreshnessRow {
  platform: string;
  last_data_date: string;
  days_since_sync: number;
}

interface HealthTablesProps {
  fatigue: FatigueRow[];
  qualified: QualifiedRow[];
  freshness: FreshnessRow[];
  loading: boolean;
  onCampaignClick: (row: FatigueRow) => void;
}

const STATUS_COLORS: Record<string, string> = {
  HEALTHY: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  WATCH: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  REFRESH: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  PAUSE: "bg-red-500/20 text-red-400 border-red-500/30",
};

const PLATFORM_BADGE: Record<string, string> = {
  linkedin: "bg-blue-500/20 text-blue-400",
  reddit: "bg-orange-500/20 text-orange-400",
  meta: "bg-indigo-500/20 text-indigo-400",
  youtube: "bg-red-500/20 text-red-400",
};

function truncate(s: string, len: number) {
  return s.length > len ? s.slice(0, len) + "..." : s;
}

function formatNum(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

export default function HealthTables({
  fatigue,
  qualified,
  freshness,
  loading,
  onCampaignClick,
}: HealthTablesProps) {
  const [activeTab, setActiveTab] = useState<"fatigue" | "qualified">("fatigue");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredFatigue =
    statusFilter === "ALL"
      ? fatigue
      : fatigue.filter((r) => r.status === statusFilter);

  const statusCounts = {
    ALL: fatigue.length,
    PAUSE: fatigue.filter((r) => r.status === "PAUSE").length,
    REFRESH: fatigue.filter((r) => r.status === "REFRESH").length,
    WATCH: fatigue.filter((r) => r.status === "WATCH").length,
    HEALTHY: fatigue.filter((r) => r.status === "HEALTHY").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading PostHog data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Freshness bar */}
      <div className="flex items-center gap-4 px-4 py-2 bg-gray-800/50 border-b border-gray-700/50 text-xs">
        <span className="text-gray-500 font-medium">SYNC</span>
        {freshness.map((f) => (
          <span key={f.platform} className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${f.days_since_sync <= 1 ? "bg-emerald-400" : f.days_since_sync <= 3 ? "bg-amber-400" : "bg-red-400"}`}
            />
            <span className="text-gray-400">
              {f.platform}: {f.last_data_date}
            </span>
          </span>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700/50">
        <button
          onClick={() => setActiveTab("fatigue")}
          className={`px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === "fatigue" ? "text-cyan-400 border-b-2 border-cyan-400" : "text-gray-400 hover:text-gray-200"}`}
        >
          Fatigue Scores ({fatigue.length})
        </button>
        <button
          onClick={() => setActiveTab("qualified")}
          className={`px-4 py-2.5 text-sm font-medium transition-colors ${activeTab === "qualified" ? "text-cyan-400 border-b-2 border-cyan-400" : "text-gray-400 hover:text-gray-200"}`}
        >
          Qualified Creatives ({qualified.length})
        </button>
      </div>

      {activeTab === "fatigue" && (
        <>
          {/* Status filter pills */}
          <div className="flex gap-2 px-4 py-2 border-b border-gray-700/30 flex-wrap">
            {(["ALL", "PAUSE", "REFRESH", "WATCH", "HEALTHY"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === s
                    ? s === "ALL"
                      ? "bg-gray-600 text-white"
                      : STATUS_COLORS[s]
                    : "bg-gray-800 text-gray-500 hover:text-gray-300"
                }`}
              >
                {s} ({statusCounts[s]})
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-gray-900/95 backdrop-blur">
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                  <th className="px-4 py-2">Campaign</th>
                  <th className="px-3 py-2">Platform</th>
                  <th className="px-3 py-2 text-right">Score</th>
                  <th className="px-3 py-2 text-right">CTR</th>
                  <th className="px-3 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filteredFatigue.map((row, i) => (
                  <tr
                    key={i}
                    onClick={() => onCampaignClick(row)}
                    className={`hover:bg-gray-800/50 transition-colors ${
                      row.status !== "HEALTHY" ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    <td className="px-4 py-2 text-gray-300 max-w-[240px]">
                      <span
                        title={row.campaign_name}
                        className="block break-words leading-snug text-xs"
                      >
                        {row.campaign_name}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${PLATFORM_BADGE[row.platform] || "bg-gray-700 text-gray-300"}`}
                      >
                        {row.platform}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right font-mono text-gray-300">
                      {row.fatigue_score}
                    </td>
                    <td className="px-3 py-2 text-right font-mono">
                      <span
                        className={
                          row.current_ctr < row.baseline_ctr
                            ? "text-red-400"
                            : "text-emerald-400"
                        }
                      >
                        {row.current_ctr}%
                      </span>
                      <span className="text-gray-600 text-xs ml-1">
                        / {row.baseline_ctr}%
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`px-2 py-0.5 rounded border text-xs font-semibold ${STATUS_COLORS[row.status]}`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === "qualified" && (
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-900/95 backdrop-blur">
              <tr className="text-left text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-2">Campaign</th>
                <th className="px-3 py-2">Platform</th>
                <th className="px-3 py-2 text-right">Impressions</th>
                <th className="px-3 py-2 text-right">Clicks</th>
                <th className="px-3 py-2 text-right">Spend</th>
                <th className="px-3 py-2 text-right">CTR</th>
                <th className="px-3 py-2 text-right">CPM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {qualified.map((row, i) => (
                <tr key={i} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-2 text-gray-300 max-w-[220px]">
                    <span title={row.campaign_name}>
                      {truncate(row.campaign_name, 45)}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${PLATFORM_BADGE[row.platform] || "bg-gray-700 text-gray-300"}`}
                    >
                      {row.platform}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-gray-300">
                    {formatNum(row.total_impressions)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-gray-300">
                    {formatNum(row.total_clicks)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-gray-300">
                    ${formatNum(row.total_spend)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-cyan-400">
                    {row.ctr_pct}%
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-gray-300">
                    ${row.cpm}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
