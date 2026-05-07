-- ═══════════════════════════════════════════════════════════════════════════
-- Persona Evidence Library — Supabase schema
--
-- Source of truth for Gong-call evidence powering both ad copy generation
-- (in-repo) and Lovable.dev landing pages (external). Synced from
-- data/persona-evidence/*.json by lib/supabase/sync-evidence.ts.
--
-- Apply: paste this whole file into the Supabase SQL editor and run.
-- Re-running is safe (DROP IF EXISTS at the top).
-- ═══════════════════════════════════════════════════════════════════════════

-- Drop in dependency order (children first) to keep re-runs clean.
DROP TABLE IF EXISTS use_case_distribution CASCADE;
DROP TABLE IF EXISTS competitive_triggers CASCADE;
DROP TABLE IF EXISTS decision_criteria CASCADE;
DROP TABLE IF EXISTS pain_quotes CASCADE;
DROP TABLE IF EXISTS personas CASCADE;

-- ─── personas (master row, one per persona) ────────────────────────────────
CREATE TABLE personas (
  persona_id                   TEXT PRIMARY KEY,
  persona_label                TEXT NOT NULL,

  -- evidence_summary block
  evidence_row_count           INTEGER,
  primary_segment              TEXT,
  primary_employee_range       TEXT,
  primary_region               TEXT,
  evidence_last_refreshed      DATE,
  evidence_source              TEXT,
  evidence_density             TEXT,

  -- headline_pain block (single per persona)
  headline_pain_summary        TEXT,
  headline_pain_confidence     TEXT,
  headline_pain_frequency      TEXT,

  -- pricing_pattern block (single per persona)
  pricing_common_mistake       TEXT,
  pricing_what_to_compare      TEXT,
  pricing_typical_sticker_shock TEXT,
  pricing_advice               TEXT,

  -- evaluation_committee block (single per persona)
  committee_size_range         TEXT,
  committee_median             INTEGER,
  committee_common_pattern     TEXT,
  committee_confidence         TEXT,

  -- Simple string arrays (no need to filter on individual rows; jsonb keeps ergonomics)
  language_they_use            JSONB NOT NULL DEFAULT '[]'::jsonb,
  headline_ready_quotes        JSONB NOT NULL DEFAULT '[]'::jsonb,
  ask_yourself_prompts         JSONB NOT NULL DEFAULT '[]'::jsonb,
  ask_next_vendor_prompts      JSONB NOT NULL DEFAULT '[]'::jsonb,
  avoid_framing                JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Audit
  created_at                   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE personas IS 'One row per Gong-evidence-backed persona. Synced from data/persona-evidence/*.json.';

-- ─── pain_quotes (verbatim quotes; filterable by use_case + incumbent) ────
CREATE TABLE pain_quotes (
  id            BIGSERIAL PRIMARY KEY,
  persona_id    TEXT NOT NULL REFERENCES personas(persona_id) ON DELETE CASCADE,
  quote         TEXT NOT NULL,
  attribution   TEXT,
  use_case      TEXT,
  incumbent     TEXT,
  tags          JSONB NOT NULL DEFAULT '[]'::jsonb,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pain_quotes_persona       ON pain_quotes(persona_id);
CREATE INDEX idx_pain_quotes_use_case      ON pain_quotes(persona_id, use_case);
CREATE INDEX idx_pain_quotes_incumbent     ON pain_quotes(persona_id, incumbent);
CREATE INDEX idx_pain_quotes_display_order ON pain_quotes(persona_id, display_order);

COMMENT ON TABLE pain_quotes IS 'Verbatim Gong-call pain quotes. Filterable by use_case / incumbent for landing-page personalization.';

-- ─── decision_criteria (what they evaluate on) ────────────────────────────
CREATE TABLE decision_criteria (
  id              BIGSERIAL PRIMARY KEY,
  persona_id      TEXT NOT NULL REFERENCES personas(persona_id) ON DELETE CASCADE,
  criterion       TEXT NOT NULL,
  frequency_label TEXT,
  display_order   INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_decision_criteria_persona       ON decision_criteria(persona_id);
CREATE INDEX idx_decision_criteria_display_order ON decision_criteria(persona_id, display_order);

COMMENT ON TABLE decision_criteria IS 'What this persona actually evaluates vendors on, with frequency label (universal / strong-pattern / common / less-common / outlier-but-loud).';

-- ─── competitive_triggers (incumbents being replaced) ─────────────────────
CREATE TABLE competitive_triggers (
  id            BIGSERIAL PRIMARY KEY,
  persona_id    TEXT NOT NULL REFERENCES personas(persona_id) ON DELETE CASCADE,
  incumbent     TEXT NOT NULL,
  switch_reason TEXT,
  row_count     INTEGER,
  display_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_competitive_triggers_persona       ON competitive_triggers(persona_id);
CREATE INDEX idx_competitive_triggers_incumbent     ON competitive_triggers(persona_id, incumbent);
CREATE INDEX idx_competitive_triggers_display_order ON competitive_triggers(persona_id, display_order);

COMMENT ON TABLE competitive_triggers IS 'Named incumbents persona is switching from, with verbatim switch reasons. Powers competitive-conquest landing pages.';

-- ─── use_case_distribution (use cases observed in this persona pool) ──────
CREATE TABLE use_case_distribution (
  id              BIGSERIAL PRIMARY KEY,
  persona_id      TEXT NOT NULL REFERENCES personas(persona_id) ON DELETE CASCADE,
  use_case        TEXT NOT NULL,
  frequency_label TEXT,
  display_order   INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_use_case_persona       ON use_case_distribution(persona_id);
CREATE INDEX idx_use_case_display_order ON use_case_distribution(persona_id, display_order);

COMMENT ON TABLE use_case_distribution IS 'Use cases observed across the persona evidence pool, with frequency labels.';

-- ─── updated_at trigger on personas ────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER personas_set_updated_at
BEFORE UPDATE ON personas
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
