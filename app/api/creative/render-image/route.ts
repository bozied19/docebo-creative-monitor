import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const maxDuration = 60;

const REFERENCE_DIR = path.join(process.cwd(), "data", "reference-examples");
const BRAND_DNA_FILE = "BRAND_DNA.md";
const MAX_REFERENCES = 4;
const ALLOWED_EXT = new Set([".png", ".jpg", ".jpeg", ".webp"]);

interface RenderImageRequest {
  prompt: string;
  visual_style?: string;
  archetype_hint?: string;
  aspect_ratio?: "1:1" | "16:9" | "9:16" | "4:3" | "3:4" | "4:5";
  variant_id?: string;
}

interface ReferenceFile {
  filename: string;
  archetype: string;
  visualStyle: string;
}

function parseRefName(filename: string): ReferenceFile | null {
  const ext = path.extname(filename).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) return null;
  const base = filename.slice(0, -ext.length);
  const parts = base.split("__");
  if (parts.length < 2) {
    return { filename, archetype: parts[0] || "", visualStyle: "" };
  }
  return { filename, archetype: parts[0], visualStyle: parts[1] };
}

function rankReferences(
  refs: ReferenceFile[],
  visualStyle?: string,
  archetypeHint?: string,
): ReferenceFile[] {
  const scored = refs.map((r) => {
    let score = 0;
    if (visualStyle && r.visualStyle === visualStyle) score += 10;
    if (archetypeHint && r.archetype === archetypeHint) score += 5;
    return { r, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.r);
}

async function loadReferenceImages(
  visualStyle?: string,
  archetypeHint?: string,
): Promise<Array<{ mimeType: string; data: string }>> {
  let entries: string[] = [];
  try {
    entries = await readdir(REFERENCE_DIR);
  } catch {
    return [];
  }
  const refs = entries
    .map(parseRefName)
    .filter((r): r is ReferenceFile => r !== null);
  const ranked = rankReferences(refs, visualStyle, archetypeHint).slice(
    0,
    MAX_REFERENCES,
  );
  const images: Array<{ mimeType: string; data: string }> = [];
  for (const ref of ranked) {
    try {
      const buf = await readFile(path.join(REFERENCE_DIR, ref.filename));
      const ext = path.extname(ref.filename).toLowerCase();
      const mime =
        ext === ".png"
          ? "image/png"
          : ext === ".webp"
            ? "image/webp"
            : "image/jpeg";
      images.push({ mimeType: mime, data: buf.toString("base64") });
    } catch (err) {
      console.warn(`[render-image] failed to read ${ref.filename}:`, err);
    }
  }
  return images;
}

async function loadBrandDNA(): Promise<string> {
  try {
    const file = path.join(REFERENCE_DIR, BRAND_DNA_FILE);
    const buf = await readFile(file, "utf8");
    return buf;
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "GOOGLE_API_KEY not set. Add it to .env.local. Get a key at https://aistudio.google.com/app/apikey",
      },
      { status: 500 },
    );
  }

  let body: RenderImageRequest;
  try {
    body = (await req.json()) as RenderImageRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.prompt || typeof body.prompt !== "string") {
    return NextResponse.json(
      { error: "prompt is required" },
      { status: 400 },
    );
  }

  const aspectRatio = body.aspect_ratio || "1:1";

  const [refImages, brandDna] = await Promise.all([
    loadReferenceImages(body.visual_style, body.archetype_hint),
    loadBrandDNA(),
  ]);

  const composedPrompt = [
    "You are generating a finished Docebo advertising creative.",
    "The output must look like a publishable ad, NOT a mood board, sketch, or concept art.",
    "",
    brandDna ? "═══ BRAND SYSTEM (FOLLOW EXACTLY) ═══\n" + brandDna : "",
    "",
    "═══ THIS VARIANT ═══",
    body.prompt,
    "",
    "═══ HARD REQUIREMENTS ═══",
    "- Render ALL text exactly as written. Do not paraphrase, abbreviate, or invent new words.",
    "- The 'docebo' wordmark must appear once, lowercase, white, in a single corner.",
    "- No watermarks, no captions outside the canvas, no rulers or guides.",
    "- Solid edge-to-edge composition. No white margins around the design.",
    "- Square 1:1 unless aspect_ratio says otherwise.",
    refImages.length > 0
      ? `- The ${refImages.length} reference image${refImages.length === 1 ? "" : "s"} attached show the brand style. Match palette, type weight, layout density, and photographic treatment. Do NOT copy any specific text from the references.`
      : "- No reference images attached; rely on the brand system above.",
  ]
    .filter(Boolean)
    .join("\n");

  const ai = new GoogleGenAI({ apiKey });

  const contents: Array<
    { text: string } | { inlineData: { mimeType: string; data: string } }
  > = [{ text: composedPrompt }];
  for (const img of refImages) {
    contents.push({ inlineData: img });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents,
      config: { imageConfig: { aspectRatio } },
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    let imageBase64: string | null = null;
    let imageMime = "image/png";
    let textResponse = "";
    for (const part of parts) {
      if (part.inlineData?.data) {
        imageBase64 = part.inlineData.data;
        if (part.inlineData.mimeType) imageMime = part.inlineData.mimeType;
      } else if (part.text) {
        textResponse += part.text;
      }
    }

    if (!imageBase64) {
      return NextResponse.json(
        {
          error: "Gemini returned no image",
          model_text: textResponse || null,
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      data_url: `data:${imageMime};base64,${imageBase64}`,
      mime_type: imageMime,
      reference_count: refImages.length,
      variant_id: body.variant_id || null,
      model_text: textResponse || null,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[render-image] Gemini error:", msg);
    return NextResponse.json(
      { error: "Image generation failed", details: msg },
      { status: 502 },
    );
  }
}
