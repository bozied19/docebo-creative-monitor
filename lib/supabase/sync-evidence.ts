#!/usr/bin/env tsx
/**
 * Persona Evidence Library — Supabase sync
 *
 * Reads every data/persona-evidence/*.json and upserts it into the Supabase
 * tables defined in lib/supabase/schema.sql. Idempotent: child rows are
 * deleted then bulk-inserted on every run, so removed quotes / criteria
 * disappear from the DB.
 *
 * Required env (typically set in .env.local at the repo root):
 *   SUPABASE_URL                — your project URL (e.g. https://abc.supabase.co)
 *   SUPABASE_SERVICE_ROLE_KEY   — service role key, NOT the anon key
 *
 * Usage:
 *   npm run sync:evidence:dry   — read JSONs, print what would change, no writes
 *   npm run sync:evidence       — actually upsert to Supabase
 *
 * The schema must already exist in Supabase. Run lib/supabase/schema.sql in
 * the Supabase SQL editor before the first sync.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import WebSocket from "ws";

// Load .env.local manually — this script runs outside Next.js so its env
// loading isn't automatic. Falls through gracefully if the file is missing.
async function loadDotEnvLocal(): Promise<void> {
  try {
    const envPath = path.join(process.cwd(), ".env.local");
    const raw = await fs.readFile(envPath, "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      // Strip matching surrounding quotes
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    // .env.local optional; env may be set in shell already
  }
}

// ─── Types matching data/persona-evidence/*.json ────────────────────────────
interface PainQuote {
  quote: string;
  attribution?: string;
  use_case?: string;
  incumbent?: string | null;
  tags?: string[];
}

interface DecisionCriterion {
  criterion: string;
  frequency_label?: string;
}

interface CompetitiveTrigger {
  incumbent: string;
  switch_reason?: string;
  row_count?: number;
}

interface UseCaseDistribution {
  use_case: string;
  frequency_label?: string;
}

interface PersonaEvidence {
  persona_id: string;
  persona_label: string;
  evidence_summary?: {
    row_count?: number;
    primary_segment?: string;
    primary_employee_range?: string;
    primary_region?: string;
    last_refreshed?: string;
    source?: string;
    evidence_density?: string;
  };
  headline_pain?: { summary?: string; confidence?: string; frequency_label?: string };
  pain_quotes?: PainQuote[];
  decision_criteria?: DecisionCriterion[];
  language_they_use?: string[];
  headline_ready_quotes?: string[];
  competitive_triggers?: CompetitiveTrigger[];
  use_case_distribution?: UseCaseDistribution[];
  ask_yourself_prompts?: string[];
  ask_next_vendor_prompts?: string[];
  pricing_pattern?: { common_mistake?: string; what_they_should_compare?: string; typical_sticker_shock?: string; advice?: string };
  evaluation_committee?: { size_range?: string; median?: number; common_pattern?: string; confidence?: string };
  avoid_framing?: string[];
}

// ─── Read all evidence JSONs ────────────────────────────────────────────────
async function loadAllEvidence(): Promise<PersonaEvidence[]> {
  const dir = path.join(process.cwd(), "data", "persona-evidence");
  const files = await fs.readdir(dir);
  const jsons: PersonaEvidence[] = [];
  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const raw = await fs.readFile(path.join(dir, file), "utf8");
    jsons.push(JSON.parse(raw));
  }
  return jsons;
}

// ─── Map JSON → DB row shapes ───────────────────────────────────────────────
function toPersonaRow(ev: PersonaEvidence) {
  const es = ev.evidence_summary ?? {};
  const hp = ev.headline_pain ?? {};
  const pp = ev.pricing_pattern ?? {};
  const ec = ev.evaluation_committee ?? {};
  return {
    persona_id: ev.persona_id,
    persona_label: ev.persona_label,
    evidence_row_count: es.row_count ?? null,
    primary_segment: es.primary_segment ?? null,
    primary_employee_range: es.primary_employee_range ?? null,
    primary_region: es.primary_region ?? null,
    evidence_last_refreshed: es.last_refreshed ?? null,
    evidence_source: es.source ?? null,
    evidence_density: es.evidence_density ?? null,
    headline_pain_summary: hp.summary ?? null,
    headline_pain_confidence: hp.confidence ?? null,
    headline_pain_frequency: hp.frequency_label ?? null,
    pricing_common_mistake: pp.common_mistake ?? null,
    pricing_what_to_compare: pp.what_they_should_compare ?? null,
    pricing_typical_sticker_shock: pp.typical_sticker_shock ?? null,
    pricing_advice: pp.advice ?? null,
    committee_size_range: ec.size_range ?? null,
    committee_median: ec.median ?? null,
    committee_common_pattern: ec.common_pattern ?? null,
    committee_confidence: ec.confidence ?? null,
    language_they_use: ev.language_they_use ?? [],
    headline_ready_quotes: ev.headline_ready_quotes ?? [],
    ask_yourself_prompts: ev.ask_yourself_prompts ?? [],
    ask_next_vendor_prompts: ev.ask_next_vendor_prompts ?? [],
    avoid_framing: ev.avoid_framing ?? [],
  };
}

function toPainQuoteRows(ev: PersonaEvidence) {
  return (ev.pain_quotes ?? []).map((q, i) => ({
    persona_id: ev.persona_id,
    quote: q.quote,
    attribution: q.attribution ?? null,
    use_case: q.use_case ?? null,
    incumbent: q.incumbent ?? null,
    tags: q.tags ?? [],
    display_order: i,
  }));
}

function toDecisionCriteriaRows(ev: PersonaEvidence) {
  return (ev.decision_criteria ?? []).map((d, i) => ({
    persona_id: ev.persona_id,
    criterion: d.criterion,
    frequency_label: d.frequency_label ?? null,
    display_order: i,
  }));
}

function toCompetitiveTriggerRows(ev: PersonaEvidence) {
  return (ev.competitive_triggers ?? []).map((c, i) => ({
    persona_id: ev.persona_id,
    incumbent: c.incumbent,
    switch_reason: c.switch_reason ?? null,
    row_count: c.row_count ?? null,
    display_order: i,
  }));
}

function toUseCaseRows(ev: PersonaEvidence) {
  return (ev.use_case_distribution ?? []).map((u, i) => ({
    persona_id: ev.persona_id,
    use_case: u.use_case,
    frequency_label: u.frequency_label ?? null,
    display_order: i,
  }));
}

// ─── Replace one child table for one persona (delete-then-insert). ─────────
// Cast at the boundary: the schema isn't generated for the JS client, so
// TS's strict insert types can't see our row shapes. Each caller below
// passes a homogeneous array typed by its mapper, so the cast is safe.
async function replaceChildRows(
  client: SupabaseClient,
  table: string,
  personaId: string,
  rows: ReadonlyArray<Record<string, unknown>>,
): Promise<void> {
  const { error: delErr } = await client.from(table).delete().eq("persona_id", personaId);
  if (delErr) throw new Error(`delete ${table}/${personaId}: ${delErr.message}`);

  if (rows.length > 0) {
    const { error: insErr } = await client.from(table).insert(rows as never);
    if (insErr) throw new Error(`insert ${table}/${personaId}: ${insErr.message}`);
  }
}

// ─── Sync one persona ───────────────────────────────────────────────────────
async function syncPersona(client: SupabaseClient, ev: PersonaEvidence): Promise<void> {
  // 1. Upsert master row
  const { error: upsertErr } = await client
    .from("personas")
    .upsert(toPersonaRow(ev) as never, { onConflict: "persona_id" });
  if (upsertErr) throw new Error(`upsert personas/${ev.persona_id}: ${upsertErr.message}`);

  // 2. Replace child rows (delete-then-insert is simplest idempotent strategy)
  await replaceChildRows(client, "pain_quotes",           ev.persona_id, toPainQuoteRows(ev));
  await replaceChildRows(client, "decision_criteria",     ev.persona_id, toDecisionCriteriaRows(ev));
  await replaceChildRows(client, "competitive_triggers",  ev.persona_id, toCompetitiveTriggerRows(ev));
  await replaceChildRows(client, "use_case_distribution", ev.persona_id, toUseCaseRows(ev));
}

// ─── Pretty-print dry-run summary ───────────────────────────────────────────
function printDryRunSummary(jsons: PersonaEvidence[]): void {
  console.log("\nDRY RUN — no writes will occur.\n");
  let totalQuotes = 0;
  let totalCriteria = 0;
  let totalTriggers = 0;
  let totalUseCases = 0;
  for (const ev of jsons) {
    const quotes = ev.pain_quotes?.length ?? 0;
    const criteria = ev.decision_criteria?.length ?? 0;
    const triggers = ev.competitive_triggers?.length ?? 0;
    const useCases = ev.use_case_distribution?.length ?? 0;
    totalQuotes += quotes;
    totalCriteria += criteria;
    totalTriggers += triggers;
    totalUseCases += useCases;
    console.log(`  ${ev.persona_id.padEnd(16)} ${ev.persona_label}`);
    console.log(`    pain_quotes:           ${quotes}`);
    console.log(`    decision_criteria:     ${criteria}`);
    console.log(`    competitive_triggers:  ${triggers}`);
    console.log(`    use_case_distribution: ${useCases}`);
    console.log(`    headline_ready_quotes: ${ev.headline_ready_quotes?.length ?? 0}`);
    console.log(`    language_they_use:     ${ev.language_they_use?.length ?? 0}`);
    console.log("");
  }
  console.log("TOTALS");
  console.log(`  personas:              ${jsons.length}`);
  console.log(`  pain_quotes:           ${totalQuotes}`);
  console.log(`  decision_criteria:     ${totalCriteria}`);
  console.log(`  competitive_triggers:  ${totalTriggers}`);
  console.log(`  use_case_distribution: ${totalUseCases}`);
  console.log("");
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  const dryRun = process.argv.includes("--dry-run");
  await loadDotEnvLocal();

  const jsons = await loadAllEvidence();
  console.log(`Loaded ${jsons.length} persona evidence files from data/persona-evidence/`);

  if (dryRun) {
    printDryRunSummary(jsons);
    return;
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing env: SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY.");
    console.error("Set them in .env.local at the repo root, or run with --dry-run.");
    process.exit(1);
  }

  // supabase-js v2 auto-inits a Realtime client that needs WebSocket support.
  // Node < 22 lacks native WebSocket, so we hand the ws polyfill to Realtime.
  // The script never uses Realtime; this just lets createClient succeed.
  const client = createClient(url, key, {
    auth: { persistSession: false },
    realtime: { transport: WebSocket as unknown as never },
  });

  for (const ev of jsons) {
    process.stdout.write(`syncing ${ev.persona_id}… `);
    await syncPersona(client, ev);
    console.log("ok");
  }

  console.log(`\nSynced ${jsons.length} personas to Supabase.`);
}

main().catch((err) => {
  console.error("\nSync failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
