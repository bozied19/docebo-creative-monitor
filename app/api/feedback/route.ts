import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const FEEDBACK_FILE = path.join(process.cwd(), "data", "feedback.json");

interface FeedbackEntry {
  variant_id: string;
  theme: string;
  tags: string[];
  note: string;
  timestamp: string;
}

async function readFeedback(): Promise<FeedbackEntry[]> {
  try {
    const raw = await fs.readFile(FEEDBACK_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeFeedback(entries: FeedbackEntry[]): Promise<void> {
  await fs.mkdir(path.dirname(FEEDBACK_FILE), { recursive: true });
  await fs.writeFile(FEEDBACK_FILE, JSON.stringify(entries, null, 2));
}

/** GET — return all feedback entries + a summary for prompt injection */
export async function GET() {
  const entries = await readFeedback();

  // Build a summary of recurring issues by theme for the generation prompt
  const themeSummary: Record<string, { negative: string[]; positive: string[] }> = {};
  for (const entry of entries) {
    if (!themeSummary[entry.theme]) {
      themeSummary[entry.theme] = { negative: [], positive: [] };
    }
    const positiveLabels = ["Great mockup", "On brand"];
    for (const tag of entry.tags) {
      if (positiveLabels.includes(tag)) {
        themeSummary[entry.theme].positive.push(tag);
      } else {
        themeSummary[entry.theme].negative.push(tag);
      }
    }
    if (entry.note) {
      // Classify notes that sound positive vs negative
      const lowerNote = entry.note.toLowerCase();
      const isPositive = lowerNote.includes("great") || lowerNote.includes("good") || lowerNote.includes("love") || lowerNote.includes("perfect");
      if (isPositive) {
        themeSummary[entry.theme].positive.push(entry.note);
      } else {
        themeSummary[entry.theme].negative.push(entry.note);
      }
    }
  }

  return NextResponse.json({ entries, themeSummary });
}

/** POST — append a new feedback entry */
export async function POST(req: NextRequest) {
  try {
    const entry: FeedbackEntry = await req.json();

    if (!entry.variant_id || !entry.theme || !entry.timestamp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const entries = await readFeedback();
    entries.push(entry);
    await writeFeedback(entries);

    return NextResponse.json({ ok: true, total: entries.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
