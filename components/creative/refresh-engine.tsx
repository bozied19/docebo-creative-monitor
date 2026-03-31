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

/* ── Persona options (single-select) ─────────────────────────── */
const PERSONA_OPTIONS = [
  { id: "brand", label: "Brand", desc: "Big bold statements. Broad appeal across all Docebo audiences." },
  { id: "ld-leader", label: "L&D Leader", desc: "CLO, VP/Director of L&D. Learning ROI, workforce readiness, vendor consolidation." },
  { id: "hr-leader", label: "HR Leader", desc: "CHRO, CPO, VP of HR. People strategy, HRIS integration, retention, compliance." },
  { id: "enablement", label: "Revenue & Enablement", desc: "CRO, CSO, Sales Enablement. Pipeline, win rates, Salesforce, rep ramp." },
  { id: "customer-ed", label: "Customer Education", desc: "Monetization, support deflection, time-to-value, NRR." },
  { id: "partnerships", label: "Partner Enablement", desc: "Partner certification, revenue attribution, ecosystem growth." },
  { id: "pro-dev", label: "Professional Development", desc: "Skills frameworks, Kirkpatrick measurement, career pathing." },
  { id: "franchise", label: "Franchise & Frontline", desc: "Device policy, offline learning, brand consistency at scale." },
  { id: "compliance", label: "Compliance", desc: "Audit readiness, automated assignment, regulatory defensibility." },
  { id: "finance", label: "Finance", desc: "CFO, VP Finance. TCO transparency, ROI defensibility, AI spend governance." },
  { id: "it-leader", label: "IT", desc: "CIO, CTO, VP IT. Security, SSO, API architecture, AI governance." },
  { id: "operations", label: "Operations", desc: "COO, Head of Ops. Scalability, frontline readiness, time-to-productivity." },
];

/* ── Messaging hooks: 12 thematic categories ─────────────────── */
interface MessagingHook {
  headline: string;
  detail: string;
}

interface MessagingCategory {
  id: string;
  label: string;
  hooks: MessagingHook[];
}

const MESSAGING_CATEGORIES: MessagingCategory[] = [
  {
    id: "ai-first",
    label: "AI-First Differentiation",
    hooks: [
      { headline: "AI-powered learning, not bolted on", detail: "Docebo's early and deep integration of AI features like AI Authoring and Virtual Coach creates a competitive moat." },
      { headline: "Build courses in seconds, not weeks", detail: "Docebo lets organizations create content in minutes with virtual coaching, plus an AI copilot for smarter search and admin support." },
      { headline: "Your AI copilot for learning", detail: "Position Harmony AI as the always-on admin assistant that eliminates busywork." },
    ],
  },
  {
    id: "multi-audience",
    label: "Multi-Audience / Extended Enterprise",
    hooks: [
      { headline: "One platform, every audience", detail: "Seamlessly manage employees, customers, partners, and more in a centralized platform." },
      { headline: "Stop paying for three LMSs", detail: "Consolidation hook targeting enterprises juggling separate tools for internal, customer, and partner training." },
      { headline: "From employees to ecosystems", detail: "For organizations prioritizing customer education, partner enablement, and global scalability." },
    ],
  },
  {
    id: "customer-ed-revenue",
    label: "Customer Education as Revenue Driver",
    hooks: [
      { headline: "Educated customers don't churn", detail: "Training programs reduce churn by accelerating onboarding, increasing adoption, and decreasing support dependency." },
      { headline: "Turn your academy into a profit center", detail: "Docebo lets organizations turn customer education into a revenue driver through ecommerce capabilities." },
      { headline: "Scale without scaling your CS team", detail: "\"Without Docebo, our CSMs would go back to having the same conversations five times a day.\"" },
    ],
  },
  {
    id: "partner-enablement",
    label: "Partner Enablement & Channel Revenue",
    hooks: [
      { headline: "From onboarding to revenue, faster", detail: "Take partners from awareness to revenue with unified training across products, regions, and partner tiers." },
      { headline: "Make every partner your MVP", detail: "Increase product knowledge and brand loyalty — make every partner a most valued player." },
      { headline: "Certify, track, and scale your channel", detail: "Automate certification, renewal, and compliance so you can focus on strategy instead of chasing spreadsheets." },
    ],
  },
  {
    id: "sales-enablement",
    label: "Sales Enablement",
    hooks: [
      { headline: "Stop the 440-hour content hunt", detail: "Sales reps spend an average of 440 hours each year searching for the right content to share with prospects." },
      { headline: "Bridge the sales-marketing gap", detail: "The backbone of successful B2B sales enablement is alignment between sales and marketing teams." },
      { headline: "Knowledge that sticks", detail: "B2B sales reps forget 70% of information within a week of training. Continuous learning is critical." },
    ],
  },
  {
    id: "roi",
    label: "Measurable Business Impact / ROI",
    hooks: [
      { headline: "Connect learning to revenue", detail: "Integrate with CRM or HRIS to see direct relationships between training and seller performance." },
      { headline: "Prove training ROI, don't guess", detail: "$1.5M saved (KCF Technologies), 119% ROI (PowerDMS), -80% admin time (Booking.com)." },
      { headline: "Data-driven L&D", detail: "Pre-built dashboards, custom report builders, and BI integrations that correlate training data with business outcomes." },
    ],
  },
  {
    id: "global-scale",
    label: "Global Scale & Enterprise Readiness",
    hooks: [
      { headline: "Go global in a click", detail: "Train customers, partners, and employees from a single platform, then translate and go global." },
      { headline: "50+ languages, one platform", detail: "Support more than 50 languages to help localize learning programs." },
      { headline: "FedRAMP authorized for government", detail: "FedRAMP Moderate Authorization achieved May 2025, unlocking the $2.7B U.S. federal market." },
    ],
  },
  {
    id: "integrations",
    label: "Integration Ecosystem",
    hooks: [
      { headline: "Fits your stack, not the other way around", detail: "Access to over 400 third-party tools through Docebo Integrations." },
      { headline: "Learning that lives where work happens", detail: "Integrations with Salesforce, HubSpot, Marketo, Intercom, and BI tools." },
      { headline: "CRM + LMS = pipeline intelligence", detail: "Connect with Marketo to create leads from registrations and build custom workflows." },
    ],
  },
  {
    id: "ease-of-use",
    label: "Ease of Use & Speed to Value",
    hooks: [
      { headline: "It just works", detail: "\"Once it's set up, I don't have to do anything. It just works.\"" },
      { headline: "Endlessly customizable", detail: "\"The amount of customization that you can do within the platform is endless.\" — Booking.com" },
      { headline: "Beautiful, branded learning experiences", detail: "Branded environments, SSO, and mobile-friendly design make training simple to access." },
    ],
  },
  {
    id: "skills",
    label: "Skills Intelligence & Talent Development",
    hooks: [
      { headline: "See real capability, not just completions", detail: "Skills intelligence helps see real capability, move talent faster, and keep learning focused." },
      { headline: "Close skill gaps before they cost you", detail: "Positioning learning as a strategic workforce planning tool, not just compliance." },
    ],
  },
  {
    id: "social",
    label: "Social & Community Learning",
    hooks: [
      { headline: "Learning is better together", detail: "Q&A, personalized discussions, and real-time messaging transform the platform into a dynamic community." },
      { headline: "Tap your in-house experts", detail: "Peer-to-peer knowledge sharing, SME access, and collaborative learning features." },
    ],
  },
  {
    id: "competitive-advantage",
    label: "Learning as Competitive Advantage",
    hooks: [
      { headline: "Make learning your competitive advantage", detail: "Personalized and automated experiences that turn learning and retention into competitive advantages." },
      { headline: "The companies that learn fastest, win", detail: "Aspirational hook for C-suite buyers." },
      { headline: "Future-proof your learning program", detail: "Expand learning use cases and future-proof your learning program for mid-market and up." },
    ],
  },
];

/* ── Ad Style options (mapped to ad-canvas themes) ───────────── */
interface AdStyleOption {
  id: string;
  label: string;
  desc: string;
  themes: string[];
  swatch: string; // CSS gradient/color for preview
}

const AD_STYLE_OPTIONS: AdStyleOption[] = [
  {
    id: "navy-bold",
    label: "Navy Bold",
    desc: "Navy background, white/neon headlines, gradient corners",
    themes: ["navy-white", "navy-green", "navy-pink", "navy-lavender"],
    swatch: "linear-gradient(135deg, #0033A0, #06065D)",
  },
  {
    id: "gradient-neon",
    label: "Gradient Neon",
    desc: "Blue-to-purple gradient, neon pink accents, cinematic",
    themes: ["gradient-pink"],
    swatch: "linear-gradient(135deg, #0057FF, #7E2EE9, #B627C6)",
  },
  {
    id: "marble-clean",
    label: "Marble Clean",
    desc: "Warm beige, navy/purple text, editorial feel",
    themes: ["beige-navy", "beige-purple", "beige-wave"],
    swatch: "linear-gradient(135deg, #E6DACB, #D4C9BA)",
  },
  {
    id: "white-minimal",
    label: "White Minimal",
    desc: "White background, blue-purple accents, clean",
    themes: ["white-purple"],
    swatch: "#FFFFFF",
  },
  {
    id: "co-brand",
    label: "Co-Brand",
    desc: "Partner logo placement, lime banner, dual branding",
    themes: ["cobrand-navy-green", "cobrand-beige"],
    swatch: "linear-gradient(135deg, #0033A0 50%, #E3FFAB 50%)",
  },
  {
    id: "quote",
    label: "Quote / Testimonial",
    desc: "Customer proof layout, attribution, gradient bg",
    themes: ["quote-gradient"],
    swatch: "linear-gradient(165deg, #0057FF, #7E2EE9, #B627C6)",
  },
];

/* ── Scoring standards (shown with prompt) ───────────────────── */
const SCORING_STANDARDS = [
  { key: "voice_compliance", label: "Voice", desc: "Docebo 'Learning Insurgent' tone — would this make a Cornerstone ad writer uncomfortable?" },
  { key: "visual_brand_fit", label: "Brand Fit", desc: "Uses Docebo signature elements: navy/purple, neon accents, floating UI overlays" },
  { key: "differentiation", label: "Differentiation", desc: "Could any competitor run this ad? If yes, score below 5" },
  { key: "terminology", label: "Terminology", desc: "Uses persona-specific language, avoids banned words (leverage, synergy, etc.)" },
];

/* ── Auto-prompt builder ─────────────────────────────────────── */
function buildAutoPrompt(
  persona: (typeof PERSONA_OPTIONS)[number],
  category: MessagingCategory,
  hookIndex: number,
  campaign: FatigueRow | null,
): string {
  const hook = category.hooks[hookIndex];
  const lines: string[] = [];

  if (campaign) {
    lines.push(
      `Refresh creative for "${campaign.campaign_name}" (${campaign.platform}).`,
      `Current status: ${campaign.status}, fatigue score ${campaign.fatigue_score}.`,
      `CTR dropped from ${campaign.baseline_ctr}% to ${campaign.current_ctr}%.`,
      "",
    );
  }

  lines.push(
    `Target Persona: ${persona.label}`,
    `${persona.desc}`,
    "",
    `Messaging Theme: ${category.label}`,
    `Lead Hook: "${hook.headline}"`,
    `Context: ${hook.detail}`,
    "",
    `Generate 5 ad variants using this messaging angle. Each variant should:`,
    `- Lead with the "${hook.headline}" hook or a close variation`,
    `- Speak directly to the ${persona.label} persona's pain points and language`,
    `- Use Docebo's "Learning Insurgent" brand voice`,
    `- Include a different hook_type per variant (question / statistic / provocative / direct callout / story opener)`,
    `- Self-score each variant on voice_compliance, visual_brand_fit, differentiation, and terminology (min 7/10 each)`,
  );

  return lines.join("\n");
}

/* ── Flow steps ──────────────────────────────────────────────── */
type FlowStep = "select" | "prompt" | "styles" | "generating" | "results";

export default function RefreshEngine({
  selectedCampaign,
  onVariantsGenerated,
}: RefreshEngineProps) {
  // Flow state
  const [step, setStep] = useState<FlowStep>("select");

  // Selection state
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedHookIndex, setSelectedHookIndex] = useState<number>(0);

  // Prompt state
  const [editablePrompt, setEditablePrompt] = useState("");

  // Style state
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [isMixMode, setIsMixMode] = useState(false);

  // Generation state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawOutput, setRawOutput] = useState<string | null>(null);
  const [generatedVariants, setGeneratedVariants] = useState<Variant[] | null>(null);

  /* ── Derived data ─────────────────────────────────────────── */
  const persona = PERSONA_OPTIONS.find((p) => p.id === selectedPersona);
  const category = MESSAGING_CATEGORIES.find((c) => c.id === selectedCategory);
  const canGeneratePrompt = selectedPersona && selectedCategory;

  /* ── Auto-generate prompt when both selections are made ──── */
  function handleGeneratePrompt() {
    if (!persona || !category) return;
    const prompt = buildAutoPrompt(persona, category, selectedHookIndex, selectedCampaign);
    setEditablePrompt(prompt);
    setStep("prompt");
  }

  /* ── Style selection logic ────────────────────────────────── */
  function handleStyleToggle(styleId: string) {
    if (styleId === "mix") {
      setIsMixMode(true);
      setSelectedStyles([]);
      return;
    }
    if (isMixMode) {
      setSelectedStyles((prev) =>
        prev.includes(styleId)
          ? prev.filter((s) => s !== styleId)
          : prev.length < 3 ? [...prev, styleId] : prev
      );
    } else {
      setIsMixMode(false);
      setSelectedStyles([styleId]);
    }
  }

  function handleSelectSingleStyle(styleId: string) {
    setIsMixMode(false);
    setSelectedStyles([styleId]);
  }

  const canProceedFromStyles = isMixMode
    ? selectedStyles.length >= 2
    : selectedStyles.length === 1;

  /* ── Generate variants ────────────────────────────────────── */
  async function handleGenerate() {
    setStep("generating");
    setLoading(true);
    setError(null);
    setRawOutput(null);
    setGeneratedVariants(null);

    try {
      const body: Record<string, unknown> = {
        prompt: editablePrompt,
        persona: selectedPersona,
        messaging_hook: selectedCategory,
        ad_styles: isMixMode ? selectedStyles : selectedStyles,
        campaign_context: selectedCampaign || undefined,
      };

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
        setStep("results");
      } else if (data.raw_text) {
        setRawOutput(data.raw_text);
        setStep("results");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStep("results");
    } finally {
      setLoading(false);
    }
  }

  /* ── Reset ────────────────────────────────────────────────── */
  function handleReset() {
    setStep("select");
    setSelectedPersona(null);
    setSelectedCategory(null);
    setSelectedHookIndex(0);
    setEditablePrompt("");
    setSelectedStyles([]);
    setIsMixMode(false);
    setError(null);
    setRawOutput(null);
    setGeneratedVariants(null);
  }

  /* ── Step indicator ───────────────────────────────────────── */
  const steps: { key: FlowStep; label: string }[] = [
    { key: "select", label: "Select" },
    { key: "prompt", label: "Prompt" },
    { key: "styles", label: "Styles" },
    { key: "generating", label: "Generate" },
  ];

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

        {/* Step indicator */}
        <div className="flex items-center gap-1 mt-2">
          {steps.map((s, i) => {
            const stepIndex = steps.findIndex((x) => x.key === step);
            const isActive = s.key === step || (step === "results" && s.key === "generating");
            const isDone = i < stepIndex || step === "results";
            return (
              <div key={s.key} className="flex items-center gap-1">
                {i > 0 && (
                  <div className={`w-4 h-px ${isDone ? "bg-cyan-500/50" : "bg-gray-700/50"}`} />
                )}
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded ${
                    isActive
                      ? "bg-cyan-500/20 text-cyan-300"
                      : isDone
                        ? "bg-gray-700/50 text-gray-400"
                        : "text-gray-600"
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
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

      {/* ═══ STEP 1: SELECT PERSONA + MESSAGING HOOK ═══ */}
      {step === "select" && (
        <div className="flex-1 overflow-auto px-4 py-3 space-y-4">
          {/* Persona picker (single select) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-400">
                1. Target Persona
              </p>
              {selectedPersona && (
                <button
                  onClick={() => setSelectedPersona(null)}
                  className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {PERSONA_OPTIONS.map((p) => {
                const active = selectedPersona === p.id;
                const isBrand = p.id === "brand";
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPersona(active ? null : p.id)}
                    className={`text-left px-2.5 py-2 rounded-lg border transition-all cursor-pointer ${
                      isBrand && !active
                        ? "col-span-2 border-dashed border-purple-500/30 bg-purple-500/5 hover:border-purple-400/50 hover:bg-purple-500/10"
                        : ""
                    } ${
                      active
                        ? isBrand
                          ? "col-span-2 border-purple-500/50 bg-purple-500/15 shadow-[0_0_8px_rgba(168,85,247,0.15)]"
                          : "border-cyan-500/50 bg-cyan-500/15 shadow-[0_0_8px_rgba(6,182,212,0.15)]"
                        : !isBrand
                          ? "border-gray-700/50 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/60"
                          : ""
                    }`}
                  >
                    <p className={`text-xs font-medium ${
                      active
                        ? isBrand ? "text-purple-300" : "text-cyan-300"
                        : "text-gray-300"
                    }`}>
                      {p.label}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">
                      {p.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Messaging Hook picker (single select category, then hook) */}
          <div>
            <p className="text-xs font-medium text-gray-400 mb-2">
              2. Messaging Hook
            </p>

            {/* Category list */}
            <div className="space-y-1">
              {MESSAGING_CATEGORIES.map((cat) => {
                const isExpanded = selectedCategory === cat.id;
                return (
                  <div key={cat.id}>
                    <button
                      onClick={() => {
                        if (isExpanded) {
                          setSelectedCategory(null);
                          setSelectedHookIndex(0);
                        } else {
                          setSelectedCategory(cat.id);
                          setSelectedHookIndex(0);
                        }
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg border transition-all cursor-pointer ${
                        isExpanded
                          ? "border-cyan-500/50 bg-cyan-500/10"
                          : "border-gray-700/50 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className={`text-xs font-medium ${isExpanded ? "text-cyan-300" : "text-gray-300"}`}>
                          {cat.label}
                        </p>
                        <span className={`text-[10px] ${isExpanded ? "text-cyan-400" : "text-gray-600"}`}>
                          {cat.hooks.length} hooks {isExpanded ? "▼" : "▶"}
                        </span>
                      </div>
                    </button>

                    {/* Expanded hooks */}
                    {isExpanded && (
                      <div className="ml-3 mt-1 space-y-1">
                        {cat.hooks.map((hook, hi) => {
                          const hookActive = selectedHookIndex === hi;
                          return (
                            <button
                              key={hi}
                              onClick={() => setSelectedHookIndex(hi)}
                              className={`w-full text-left px-2.5 py-1.5 rounded border transition-all cursor-pointer ${
                                hookActive
                                  ? "border-cyan-500/40 bg-cyan-500/10"
                                  : "border-gray-700/30 bg-gray-800/20 hover:bg-gray-800/40"
                              }`}
                            >
                              <p className={`text-[11px] font-medium ${hookActive ? "text-cyan-300" : "text-gray-300"}`}>
                                &ldquo;{hook.headline}&rdquo;
                              </p>
                              <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">
                                {hook.detail}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══ STEP 2: PROMPT PREVIEW & EDIT ═══ */}
      {step === "prompt" && (
        <div className="flex-1 overflow-auto px-4 py-3 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-400">
              Auto-Generated Prompt
            </p>
            <button
              onClick={() => setStep("select")}
              className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors"
            >
              ← Back
            </button>
          </div>

          {/* Editable prompt */}
          <textarea
            value={editablePrompt}
            onChange={(e) => setEditablePrompt(e.target.value)}
            rows={12}
            className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-xs text-gray-200 font-mono leading-relaxed focus:outline-none focus:border-cyan-500/50 resize-none"
          />

          {/* Scoring standards */}
          <div className="rounded-lg bg-gray-800/50 border border-gray-700/50 p-3">
            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2">
              Scoring Standards (each variant scored 1-10, minimum 7)
            </p>
            <div className="space-y-1.5">
              {SCORING_STANDARDS.map((s) => (
                <div key={s.key} className="flex items-start gap-2">
                  <span className="text-[10px] font-mono text-cyan-400 w-20 shrink-0 pt-0.5">
                    {s.label}
                  </span>
                  <span className="text-[10px] text-gray-500 leading-snug">
                    {s.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Selection summary */}
          <div className="rounded-lg bg-gray-800/30 border border-gray-700/30 p-2">
            <div className="flex flex-wrap gap-2 text-[10px]">
              <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">
                {persona?.label}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400">
                {category?.label}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-gray-700/50 text-gray-400">
                &ldquo;{category?.hooks[selectedHookIndex]?.headline}&rdquo;
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ═══ STEP 3: AD STYLE SELECTION ═══ */}
      {step === "styles" && (
        <div className="flex-1 overflow-auto px-4 py-3 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-400">
              Ad Styles (5 variants)
            </p>
            <button
              onClick={() => setStep("prompt")}
              className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors"
            >
              ← Back
            </button>
          </div>

          {/* Mix mode toggle */}
          <button
            onClick={() => {
              if (isMixMode) {
                setIsMixMode(false);
                setSelectedStyles([]);
              } else {
                setIsMixMode(true);
                setSelectedStyles([]);
              }
            }}
            className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all cursor-pointer ${
              isMixMode
                ? "border-purple-500/50 bg-purple-500/15"
                : "border-dashed border-gray-600 bg-gray-800/30 hover:border-gray-500"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs font-medium ${isMixMode ? "text-purple-300" : "text-gray-300"}`}>
                  Mix Styles
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  {isMixMode
                    ? `Select 2-3 styles (${selectedStyles.length} selected)`
                    : "Distribute 5 variants across multiple styles"
                  }
                </p>
              </div>
              <div className="flex gap-0.5">
                {AD_STYLE_OPTIONS.slice(0, 3).map((s) => (
                  <div
                    key={s.id}
                    className="w-3 h-3 rounded-sm"
                    style={{ background: s.swatch }}
                  />
                ))}
              </div>
            </div>
          </button>

          {/* Style options */}
          <div className="space-y-1.5">
            {AD_STYLE_OPTIONS.map((style) => {
              const isSelected = selectedStyles.includes(style.id);
              const isDisabled = isMixMode && selectedStyles.length >= 3 && !isSelected;
              return (
                <button
                  key={style.id}
                  onClick={() => {
                    if (isDisabled) return;
                    if (isMixMode) {
                      handleStyleToggle(style.id);
                    } else {
                      handleSelectSingleStyle(style.id);
                    }
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all ${
                    isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
                  } ${
                    isSelected
                      ? "border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_8px_rgba(6,182,212,0.1)]"
                      : "border-gray-700/50 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-md border border-gray-600/50 shrink-0"
                      style={{ background: style.swatch }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium ${isSelected ? "text-cyan-300" : "text-gray-300"}`}>
                        {style.label}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {style.desc}
                      </p>
                    </div>
                    {isMixMode && (
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "border-cyan-400 bg-cyan-500/20"
                          : "border-gray-600"
                      }`}>
                        {isSelected && (
                          <span className="text-[10px] text-cyan-300">✓</span>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mix mode count hint */}
          {isMixMode && selectedStyles.length > 0 && selectedStyles.length < 2 && (
            <p className="text-[10px] text-amber-400/70">
              Select at least 2 styles for mix mode
            </p>
          )}
        </div>
      )}

      {/* ═══ STEP 4: GENERATING ═══ */}
      {step === "generating" && loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-400">Generating 5 creative variants...</p>
            <p className="text-xs text-gray-600 mt-1">
              {isMixMode
                ? `Across ${selectedStyles.length} styles: ${selectedStyles.map((s) => AD_STYLE_OPTIONS.find((o) => o.id === s)?.label).join(", ")}`
                : `Style: ${AD_STYLE_OPTIONS.find((o) => o.id === selectedStyles[0])?.label}`
              }
            </p>
            <div className="mt-3 space-y-0.5">
              {SCORING_STANDARDS.map((s) => (
                <p key={s.key} className="text-[10px] text-gray-600 font-mono">
                  {s.label}: scoring...
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ STEP 5: RESULTS ═══ */}
      {step === "results" && (
        <div className="flex-1 overflow-auto px-4 py-3 space-y-3">
          {/* Error */}
          {error && (
            <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Raw output fallback */}
          {rawOutput && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Raw output (JSON parsing failed):</p>
              <pre className="text-xs text-gray-300 whitespace-pre-wrap bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                {rawOutput}
              </pre>
            </div>
          )}

          {/* Generated variants */}
          {generatedVariants && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  {generatedVariants.length} variants generated
                </p>
                <button
                  onClick={handleReset}
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
            </>
          )}
        </div>
      )}

      {/* ═══ BOTTOM ACTION BAR ═══ */}
      <div className="p-4 border-t border-gray-700/50">
        {step === "select" && (
          <button
            onClick={handleGeneratePrompt}
            disabled={!canGeneratePrompt}
            className="w-full px-4 py-2.5 rounded-lg bg-cyan-600 text-white text-sm font-medium hover:bg-cyan-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {canGeneratePrompt
              ? "Generate Prompt →"
              : "Select persona & messaging hook"
            }
          </button>
        )}

        {step === "prompt" && (
          <button
            onClick={() => setStep("styles")}
            disabled={!editablePrompt.trim()}
            className="w-full px-4 py-2.5 rounded-lg bg-cyan-600 text-white text-sm font-medium hover:bg-cyan-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Approve Prompt → Select Styles
          </button>
        )}

        {step === "styles" && (
          <button
            onClick={handleGenerate}
            disabled={!canProceedFromStyles}
            className="w-full px-4 py-2.5 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {canProceedFromStyles
              ? `Generate 5 Variants${isMixMode ? ` (${selectedStyles.length} styles)` : ""}`
              : isMixMode
                ? "Select 2-3 styles"
                : "Select an ad style"
            }
          </button>
        )}

        {step === "results" && !error && !generatedVariants && !rawOutput && (
          <button
            onClick={handleReset}
            className="w-full px-4 py-2.5 rounded-lg bg-gray-700 text-white text-sm font-medium hover:bg-gray-600 transition-colors"
          >
            Start Over
          </button>
        )}
      </div>
    </div>
  );
}
