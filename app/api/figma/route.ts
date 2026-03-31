import { NextRequest, NextResponse } from "next/server";

// Extract file key from various Figma URL formats
function extractFileKey(url: string): string | null {
  // https://www.figma.com/design/ABC123/File-Name
  // https://www.figma.com/file/ABC123/File-Name
  const match = url.match(/figma\.com\/(?:design|file)\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

export async function POST(req: NextRequest) {
  const token = process.env.FIGMA_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "FIGMA_ACCESS_TOKEN not configured" },
      { status: 500 }
    );
  }

  try {
    const { figma_url, variants } = await req.json();

    if (!figma_url || !variants || !Array.isArray(variants) || variants.length === 0) {
      return NextResponse.json(
        { error: "figma_url and variants[] are required" },
        { status: 400 }
      );
    }

    const fileKey = extractFileKey(figma_url);
    if (!fileKey) {
      return NextResponse.json(
        { error: "Invalid Figma URL. Use a link like: https://www.figma.com/design/ABC123/..." },
        { status: 400 }
      );
    }

    // Build a formatted comment with all approved variant briefs
    const commentLines = [
      `🎨 Creative Refresh — ${variants.length} approved variant${variants.length > 1 ? "s" : ""}\n`,
    ];

    for (const v of variants) {
      commentLines.push(`━━━ ${v.variant_id} | ${v.ad_type} | ${v.hook_type} ━━━`);
      commentLines.push(`Headline: ${v.headline}`);
      commentLines.push(`Overlay: ${v.creative_overlay}`);
      commentLines.push(`CTA: ${v.cta_text}`);
      commentLines.push(`\nIntro text:\n${v.intro_text}`);
      commentLines.push(`\nVisual direction:\n${v.visual_direction}`);
      if (v.gemini_image_prompt) {
        commentLines.push(`\nImage prompt:\n${v.gemini_image_prompt}`);
      }
      if (v.full_ad_mockup_description) {
        commentLines.push(`\nFull mockup description:\n${v.full_ad_mockup_description}`);
      }
      commentLines.push(`\nUTM: ${v.utm_content_tag}`);
      commentLines.push(`Scores — Voice: ${v.self_score?.voice_compliance} | Brand: ${v.self_score?.visual_brand_fit} | Diff: ${v.self_score?.differentiation} | Term: ${v.self_score?.terminology}`);
      commentLines.push("");
    }

    const message = commentLines.join("\n");

    // Post comment to the Figma file
    const figmaRes = await fetch(
      `https://api.figma.com/v1/files/${fileKey}/comments`,
      {
        method: "POST",
        headers: {
          "X-Figma-Token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          // Pin comment at top-left of canvas
          client_meta: { x: 0, y: 0 },
        }),
      }
    );

    if (!figmaRes.ok) {
      const err = await figmaRes.text();
      return NextResponse.json(
        { error: `Figma API error: ${figmaRes.status} — ${err}` },
        { status: figmaRes.status }
      );
    }

    const result = await figmaRes.json();

    return NextResponse.json({
      success: true,
      comment_id: result.id,
      file_key: fileKey,
      figma_url: `https://www.figma.com/design/${fileKey}`,
      variants_sent: variants.length,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
