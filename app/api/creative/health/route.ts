import { NextResponse } from "next/server";

const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY;
const PROJECT_ID = 41745;
const POSTHOG_HOST = "https://us.posthog.com";

async function runHogQLQuery(query: string) {
  const res = await fetch(`${POSTHOG_HOST}/api/projects/${PROJECT_ID}/query/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${POSTHOG_API_KEY}`,
    },
    body: JSON.stringify({
      query: { kind: "HogQLQuery", query },
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PostHog query failed (${res.status}): ${text}`);
  }
  return res.json();
}

const FATIGUE_QUERY = `WITH launch_dates AS (
  SELECT campaign_name, platform, MIN(toDate(report_date)) AS launch_date
  FROM cross_platform_campaign_stats
  GROUP BY campaign_name, platform
),
baseline AS (
  SELECT c.campaign_name, c.platform,
    AVG(c.clicks * 100.0 / NULLIF(c.impressions, 0)) AS baseline_ctr,
    AVG(c.spend_usd / NULLIF(c.impressions, 0) * 1000) AS baseline_cpm
  FROM cross_platform_campaign_stats c
  JOIN launch_dates ld ON c.campaign_name = ld.campaign_name AND c.platform = ld.platform
  WHERE dateDiff('day', ld.launch_date, toDate(c.report_date)) BETWEEN 3 AND 8
  GROUP BY c.campaign_name, c.platform
),
current_period AS (
  SELECT campaign_name, platform,
    AVG(clicks * 100.0 / NULLIF(impressions, 0)) AS current_ctr,
    AVG(spend_usd / NULLIF(impressions, 0) * 1000) AS current_cpm
  FROM cross_platform_campaign_stats
  WHERE toDate(report_date) >= now() - INTERVAL 7 DAY
  GROUP BY campaign_name, platform
)
SELECT b.campaign_name, b.platform, ld.launch_date,
  ROUND(b.baseline_ctr, 2) AS baseline_ctr,
  ROUND(c.current_ctr, 2) AS current_ctr,
  ROUND(b.baseline_cpm, 2) AS baseline_cpm,
  ROUND(c.current_cpm, 2) AS current_cpm,
  ROUND(0.50 * LEAST(c.current_ctr / NULLIF(b.baseline_ctr, 0), 1)
    + 0.50 * LEAST(b.baseline_cpm / NULLIF(c.current_cpm, 0), 1), 3) AS fatigue_score,
  CASE
    WHEN ROUND(0.50 * LEAST(c.current_ctr / NULLIF(b.baseline_ctr, 0), 1)
      + 0.50 * LEAST(b.baseline_cpm / NULLIF(c.current_cpm, 0), 1), 3) >= 0.85 THEN 'HEALTHY'
    WHEN ROUND(0.50 * LEAST(c.current_ctr / NULLIF(b.baseline_ctr, 0), 1)
      + 0.50 * LEAST(b.baseline_cpm / NULLIF(c.current_cpm, 0), 1), 3) >= 0.70 THEN 'WATCH'
    WHEN ROUND(0.50 * LEAST(c.current_ctr / NULLIF(b.baseline_ctr, 0), 1)
      + 0.50 * LEAST(b.baseline_cpm / NULLIF(c.current_cpm, 0), 1), 3) >= 0.55 THEN 'REFRESH'
    ELSE 'PAUSE'
  END AS status
FROM baseline b
JOIN current_period c ON b.campaign_name = c.campaign_name AND b.platform = c.platform
JOIN launch_dates ld ON b.campaign_name = ld.campaign_name AND b.platform = ld.platform
ORDER BY fatigue_score ASC`;

const QUALIFIED_QUERY = `SELECT campaign_name, platform,
  SUM(impressions) AS total_impressions,
  SUM(clicks) AS total_clicks,
  ROUND(SUM(spend_usd), 2) AS total_spend,
  MIN(toDate(report_date)) AS first_delivery,
  MAX(toDate(report_date)) AS last_delivery,
  dateDiff('day', MIN(toDate(report_date)), MAX(toDate(report_date))) AS active_days,
  ROUND(SUM(clicks) * 100.0 / NULLIF(SUM(impressions), 0), 2) AS ctr_pct,
  ROUND(SUM(spend_usd) / NULLIF(SUM(impressions), 0) * 1000, 2) AS cpm
FROM cross_platform_campaign_stats
WHERE toDate(report_date) >= now() - INTERVAL 90 DAY
GROUP BY campaign_name, platform
HAVING total_impressions >= 1000 AND active_days >= 7
ORDER BY total_impressions DESC`;

const FRESHNESS_QUERY = `SELECT platform,
  MAX(toDate(report_date)) AS last_data_date,
  dateDiff('day', MAX(toDate(report_date)), today()) AS days_since_sync
FROM cross_platform_campaign_stats
GROUP BY platform
ORDER BY days_since_sync DESC`;

export async function GET() {
  if (!POSTHOG_API_KEY) {
    return NextResponse.json(
      { error: "POSTHOG_API_KEY not configured" },
      { status: 500 }
    );
  }

  try {
    const [fatigueRes, qualifiedRes, freshnessRes] = await Promise.all([
      runHogQLQuery(FATIGUE_QUERY),
      runHogQLQuery(QUALIFIED_QUERY),
      runHogQLQuery(FRESHNESS_QUERY),
    ]);

    const fatigue = (fatigueRes.results || []).map((row: (string | number | null)[]) => ({
      campaign_name: row[0],
      platform: row[1],
      launch_date: row[2],
      baseline_ctr: row[3],
      current_ctr: row[4],
      baseline_cpm: row[5],
      current_cpm: row[6],
      fatigue_score: row[7],
      status: row[8],
    }));

    const qualified = (qualifiedRes.results || []).map((row: (string | number | null)[]) => ({
      campaign_name: row[0],
      platform: row[1],
      total_impressions: row[2],
      total_clicks: row[3],
      total_spend: row[4],
      first_delivery: row[5],
      last_delivery: row[6],
      active_days: row[7],
      ctr_pct: row[8],
      cpm: row[9],
    }));

    const freshness = (freshnessRes.results || []).map((row: (string | number | null)[]) => ({
      platform: row[0],
      last_data_date: row[1],
      days_since_sync: row[2],
    }));

    return NextResponse.json({ fatigue, qualified, freshness });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
