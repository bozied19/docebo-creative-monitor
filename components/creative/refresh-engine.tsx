"use client";

import { useState } from "react";
import type { FatigueRow } from "./health-tables";

export interface Variant {
  variant_id: string;
  intro_text: string;
  headline: string;
  creative_overlay: string;
  visual_direction: string;
  cta_text: string;
  ad_type: string;
  hook_type: string;
  utm_content_tag: string;
  gemini_image_prompt: string;
  full_ad_mockup_description: string;
  self_score: {
    voice_compliance: number;
    visual_brand_fit: number;
    differentiation: number;
    terminology: number;
  };
}

interface RefreshEngineProps {
  selectedCampaign: FatigueRow | null;
  onVariantsGenerated: (variants: Variant[]) => void;
}

const CONVERSATION_STARTERS = [
  { label: "LinkedIn variants for L&D leaders (AI skills academy)", icon: "LI" },
  { label: "YouTube 15s compliance ad for manufacturing", icon: "YT" },
  { label: "Reddit CLO persona ad creation", icon: "RE" },
  { label: "Dead Bait & Switch", icon: "DB" },
  { label: "Persona Ads For Deal Acceleration", icon: "PA" },
  { label: "Skills Ad Refresh For New Visual Style", icon: "SK" },
];

export default function RefreshEngine({
  selectedCampaign,
  onVariantsGenerated,
}: RefreshEngineProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawOutput, setRawOutput] = useState<string | null>(null);
  const [generatedVariants, setGeneratedVariants] = useState<Variant[] | null>(null);

  async function handleGenerate(text?: string) {
    const finalPrompt = text || prompt;
    if (!finalPrompt.trim()) return;

    setLoading(true);
    setError(null);
    setRawOutput(null);
    setGeneratedVariants(null);

    try {
      const body: Record<string, unknown> = { prompt: finalPrompt };
      if (selectedCampaign) {
        body.campaign_context = selectedCampaign;
      }

      const res = await fetch("/api/creative/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Generation failed");
      }

      if (data.variants) {
        setGeneratedVariants(data.variants);
        onVariantsGenerated(data.variants);
      } else if (data.raw_text) {
        setRawOutput(data.raw_text);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function handleStarterClick(label: string) {
    setPrompt(label);
    handleGenerate(label);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700/50">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 pulse-glow" />
          Creative Refresh Engine
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Docebo &quot;The Learning Insurgent&quot; voice
        </p>
      </div>

      {/* Campaign context banner */}
      {selectedCampaign && (
        <div className="mx-4 mt-3 px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-orange-400 font-medium">
              Refreshing: {selectedCampaign.campaign_name.slice(0, 50)}...
            </span>
            <span className="text-orange-300 font-mono">
              {selectedCampaign.status} ({selectedCampaign.fatigue_score})
            </span>
          </div>
          <p className="text-orange-300/60 mt-1">
            {selectedCampaign.platform} | CTR dropped from{" "}
            {selectedCampaign.baseline_ctr}% to {selectedCampaign.current_ctr}%
          </p>
        </div>
      )}

      {/* Conversation starters */}
      {!generatedVariants && !loading && !rawOutput && (
        <div className="px-4 py-4 flex-1">
          <p className="text-sm text-gray-400 mb-3">Conversation starters</p>
          <div className="grid grid-cols-1 gap-2">
            {CONVERSATION_STARTERS.map((s) => (
              <button
                key={s.label}
                onClick={() => handleStarterClick(s.label)}
                className="text-left px-3 py-2.5 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-cyan-500/30 hover:bg-gray-800 transition-all text-sm text-gray-300 hover:text-white"
              >
                <span className="text-cyan-400 font-mono text-xs mr-2">{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-400">Generating creative variants...</p>
            <p className="text-xs text-gray-600 mt-1">3-5 variants with self-scoring</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mx-4 mt-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Raw output fallback */}
      {rawOutput && (
        <div className="flex-1 overflow-auto px-4 py-3">
          <p className="text-xs text-gray-500 mb-2">Raw output (JSON parsing failed):</p>
          <pre className="text-xs text-gray-300 whitespace-pre-wrap bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
            {rawOutput}
          </pre>
        </div>
      )}

      {/* Generated variants list */}
      {generatedVariants && (
        <div className="flex-1 overflow-auto px-4 py-3 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              {generatedVariants.length} variants generated
            </p>
            <button
              onClick={() => {
                setGeneratedVariants(null);
                setPrompt("");
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300"
            >
              New request
            </button>
          </div>
          {generatedVariants.map((v, i) => (
            <div
              key={v.variant_id || i}
              className="rounded-lg bg-gray-800/50 border border-gray-700/50 p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400">
                  {v.variant_id}
                </span>
                <div className="flex gap-2">
                  <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">
                    {v.ad_type}
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">
                    {v.hook_type}
                  </span>
                </div>
              </div>
              <h3 className="text-white font-semibold">{v.headline}</h3>
              <p className="text-sm text-gray-300">{v.creative_overlay}</p>
              <p className="text-xs text-gray-500">{v.intro_text}</p>
              <div className="flex items-center gap-3 pt-1 border-t border-gray-700/30">
                <span className="text-xs text-gray-500">
                  Voice: <span className="text-emerald-400 font-mono">{v.self_score.voice_compliance}</span>
                </span>
                <span className="text-xs text-gray-500">
                  Brand: <span className="text-emerald-400 font-mono">{v.self_score.visual_brand_fit}</span>
                </span>
                <span className="text-xs text-gray-500">
                  Diff: <span className="text-emerald-400 font-mono">{v.self_score.differentiation}</span>
                </span>
                <span className="text-xs text-gray-500">
                  Term: <span className="text-emerald-400 font-mono">{v.self_score.terminology}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-700/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="Describe the ad you need..."
            className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
            disabled={loading}
          />
          <button
            onClick={() => handleGenerate()}
            disabled={loading || !prompt.trim()}
            className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}
