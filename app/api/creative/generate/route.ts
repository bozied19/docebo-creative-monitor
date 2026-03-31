import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `Docebo Creative Refresh Engine — The Learning Insurgent

You generate ad creative brief variants that embody Docebo's brand voice and are grounded in real persona pain points and proof. Your output is immediately usable by copywriters, designers, and media buyers.

Brand Voice: "The Learning Insurgent"
- Rebelliously Smart: PhD in ripped jeans. Brilliant but never boring.
- Confidently Irreverent: Call BS on outdated training. Burn down the compliance checkbox mentality.
- Addictively Human: Enterprise software that doesn't feel like enterprise software.

Tone Calibration
- Feature announcements: 70% confident swagger, 20% playful provocation, 10% technical precision
- Pain points: 60% empathetic understanding, 30% righteous indignation at the status quo, 10% solution-focused optimism
- ROI/results: 70% data-driven confidence, 15% subtle flex, 15% "told you so" energy

Banned Language
Never use: leverage, synergy, best-in-class, empower, unlocking potential, comprehensive solution, seamless, innovative, scalable, robust, cutting-edge, game-changing, next-generation.
Always prefer: automate, consolidate, audit-ready, measurable, specific numbers, auditable claims.

Copy Rules
- Investment mix target across variants: ~55% Product-Led, 30% Social Proof, 15% Brand.
- The enemy is the status quo, not competitors by name.
- Data with personality: "7 billion training hours wasted last year. We're here to get that time back."
- Show, don't tell. Don't say we're innovative — show how we turned compliance training into something people binge-watch.
- No feature lists without "why should I care?"

Visual Brand Fit
Use Docebo's signature elements: navy/purple gradients, neon-lit environments, floating UI overlays on lifestyle photography, green CTA buttons. Vary composition thoughtfully. At least one variant must test a different visual style.

Platform-Specific Guidance
- LinkedIn: Professional but not corporate. Document ads and carousels outperform. Optimize for dwell time.
- Reddit: Community-native tone. No corporate polish. Proof-based, educational framing. Lo-fi visual style.
- YouTube: First 5 seconds are everything. Lead with the hook. Provide recommended 6s/15s/30s cuts in Visual direction if video is requested.
- Meta: Retargeting engine. UGC-style creative. Video remarketing sequences (problem → solution → proof).

Output Requirements (per request)
- Generate exactly 3–5 variants.
- Each variant must use a different message angle or hook type.
- At least one variant must test a different visual style than the others.
- Reference the target persona's specific pain points by name.

Accepted hook types: question / statistic / provocative statement / direct callout / story opener

Output Format (per variant) — YOU MUST USE THIS EXACT JSON FORMAT:
Return a JSON array of variant objects. Each variant object has these fields:
{
  "variant_id": "v1",
  "intro_text": "30–50 words, platform-appropriate",
  "headline": "7 words max",
  "creative_overlay": "14 words max (fit 1000x450px safe zone)",
  "visual_direction": "Specific guidance for designer",
  "cta_text": "CTA button text",
  "ad_type": "pain | benefit | proof | brand | thought-leader",
  "hook_type": "question | statistic | provocative statement | direct callout | story opener",
  "utm_content_tag": "[visual-style][ad-format][message-angle][persona][use-case]_[variant-id]",
  "gemini_image_prompt": "Detailed image generation prompt with dimensions, colors, typography, composition",
  "full_ad_mockup_description": "Complete visual description of the finished ad",
  "self_score": {
    "voice_compliance": 8,
    "visual_brand_fit": 8,
    "differentiation": 8,
    "terminology": 8
  }
}

Self-Scoring Rules
- If any dimension scores below 7, automatically regenerate that variant until it reaches 7+ across all dimensions.
- Voice compliance test: Would this make a Cornerstone ad writer uncomfortable? Good.
- Differentiation test: Could any competitor run this ad? If yes, score it below 5 and rewrite.
- Visual brand fit test: Uses Docebo's signature elements unless this is the designated visual-style test variant.

CRITICAL: Your response must be ONLY a valid JSON array of variant objects. No markdown, no explanation, no preamble. Just the JSON array.`;

function generateMockVariants(prompt: string, platform?: string): object[] {
  const plat = platform || (prompt.toLowerCase().includes("reddit") ? "reddit" : prompt.toLowerCase().includes("youtube") ? "youtube" : "linkedin");
  const variants = [
    {
      variant_id: "v1",
      intro_text: "Your L&D team just spent 6 months building a training program nobody will finish. Meanwhile, companies using Docebo saw 94% completion rates. The difference? They stopped building courses and started building experiences.",
      headline: "Training Nobody Finishes Costs Millions",
      creative_overlay: "94% completion rates. Zero begging required.",
      visual_direction: "Split composition: left side shows a dusty, abandoned LMS dashboard in muted grays. Right side shows Docebo's UI with vibrant engagement metrics. Navy-to-purple gradient background with neon green data points floating between the two sides.",
      cta_text: "See How They Did It",
      ad_type: "proof",
      hook_type: "statistic",
      utm_content_tag: `gradient-split_banner-ad_completion-proof_ld-leader_engagement_v1`,
      gemini_image_prompt: `Create a 1200x627 professional ad image. Left-right split composition. Left side: faded, grayscale mockup of an old LMS with 12% completion shown. Right side: vibrant Docebo UI showing 94% completion with confetti. Background: gradient from #0033A0 (navy) to #6B21A8 (purple). Headline "Training Nobody Finishes Costs Millions" in white bold sans-serif, top-center. Overlay text "94% completion rates. Zero begging required." in lighter weight below. Green (#00D4AA) CTA pill button bottom-right reading "See How They Did It". Docebo logo small white bottom-left. No stock photography.`,
      full_ad_mockup_description: "The ad appears in LinkedIn feed with intro text about L&D teams above a gradient navy-to-purple image. The image shows a dramatic before/after split of LMS dashboards. The headline below reads 'Training Nobody Finishes Costs Millions' with docebo.com link. CTA button says 'See How They Did It'.",
      self_score: { voice_compliance: 9, visual_brand_fit: 9, differentiation: 8, terminology: 9 },
    },
    {
      variant_id: "v2",
      intro_text: "Hot take: Your compliance training is a checkbox exercise, and everyone — including your auditors — knows it. What if you could make it something people actually remember? Docebo customers turned mandatory training into measurable behavior change.",
      headline: "Compliance Training People Actually Remember",
      creative_overlay: "From checkbox to behavior change in 90 days.",
      visual_direction: "Dark, moody aesthetic with a single neon green checkbox being dramatically crossed out. Docebo UI elements float in the background with real compliance metrics. Bold typography on dark navy background.",
      cta_text: "Burn The Checkbox",
      ad_type: "pain",
      hook_type: "provocative statement",
      utm_content_tag: `dark-neon_banner-ad_compliance-pain_compliance-leader_checkbox_v2`,
      gemini_image_prompt: `Create a 1200x627 ad image with dark navy (#0033A0) background. Center: a large neon green (#00D4AA) checkbox being dramatically X'd out with a red slash. Floating UI elements showing compliance dashboards with real metrics (98% audit-ready, 3.2x engagement). Headline "Compliance Training People Actually Remember" in white bold, upper area. Overlay "From checkbox to behavior change in 90 days." below in semi-transparent white. Green pill CTA "Burn The Checkbox" bottom-center. Docebo logo white, bottom-right. Cinematic lighting, no corporate clip art.`,
      full_ad_mockup_description: "Bold provocative ad with a destroyed checkbox visual. The intro text challenges the status quo of compliance. Below the dark moody image, the headline reads 'Compliance Training People Actually Remember' with a green CTA button.",
      self_score: { voice_compliance: 10, visual_brand_fit: 8, differentiation: 9, terminology: 9 },
    },
    {
      variant_id: "v3",
      intro_text: "We asked 200 CLOs what keeps them up at night. The #1 answer wasn't budget cuts or headcount. It was this: 'I can't prove our training actually changed anything.' Docebo's analytics changed that for Walmart, Pret, and 3,800+ companies.",
      headline: "Prove Training Actually Changed Something",
      creative_overlay: "From gut feeling to auditable proof. 3,800+ companies.",
      visual_direction: "Clean, data-forward design. White/light elements on navy background. Three floating metric cards showing real customer outcomes. Professional but not sterile — subtle neon green accents and a slight camera-tilt to the composition.",
      cta_text: "Get Measurable Results",
      ad_type: "benefit",
      hook_type: "story opener",
      utm_content_tag: `data-forward_banner-ad_proof-benefit_clo_analytics_v3`,
      gemini_image_prompt: `Create a 1200x627 ad. Clean, modern design on #0033A0 navy background. Three floating white card elements showing metrics: "94% Completion", "3.2x ROI", "Audit-Ready in Days". Cards have subtle shadows and neon green (#00D4AA) accent borders. Headline "Prove Training Actually Changed Something" in white bold sans-serif, left-aligned upper portion. Overlay text "From gut feeling to auditable proof. 3,800+ companies." below. Green pill CTA "Get Measurable Results" lower-left. Docebo logo white, bottom-right. Slight 2-degree tilt on the card arrangement for dynamism.`,
      full_ad_mockup_description: "A clean, data-rich ad with floating metric cards on navy. The story-opener intro text about CLOs appears above. The headline 'Prove Training Actually Changed Something' and CTA 'Get Measurable Results' appear below the image in LinkedIn format.",
      self_score: { voice_compliance: 8, visual_brand_fit: 9, differentiation: 8, terminology: 10 },
    },
    {
      variant_id: "v4",
      intro_text: "Unpopular opinion: The reason your employees hate training isn't the content — it's the delivery. We consolidated 4 tools into 1 platform and watched engagement go from 'mandatory eye-roll' to 'wait, this is actually useful.'",
      headline: "They Hate The Delivery Not Content",
      creative_overlay: "4 tools → 1 platform. Engagement went through the roof.",
      visual_direction: plat === "reddit" ? "Lo-fi, community-native style. Screenshot-style mockup of a Reddit comment thread with upvotes. Minimal branding. Educational, proof-based framing. No corporate polish." : "UGC-style testimonial format. Phone screen showing a real employee reaction. Casual, authentic feel. Docebo UI visible in the background but not hero'd.",
      cta_text: "See The Platform",
      ad_type: "thought-leader",
      hook_type: "direct callout",
      utm_content_tag: `${plat === "reddit" ? "lofi-reddit" : "ugc-style"}_banner-ad_consolidation-thought_ld-leader_delivery_v4`,
      gemini_image_prompt: `Create a ${plat === "reddit" ? "1080x1080 square" : "1200x627"} ad. ${plat === "reddit" ? "Lo-fi style mimicking educational Reddit content. Light background, minimal design. Show a simple before/after: 4 app icons crossed out vs 1 Docebo icon. Hand-drawn arrow style." : "UGC-style with phone screen mockup showing Docebo learner dashboard. Warm, authentic lighting."} Headline "They Hate The Delivery Not Content" prominent. Overlay "4 tools → 1 platform. Engagement went through the roof." Green CTA pill "See The Platform". Docebo logo subtle, bottom corner.`,
      full_ad_mockup_description: `A ${plat === "reddit" ? "community-native, lo-fi" : "UGC-style authentic"} ad that leads with a hot take. The visual shows tool consolidation. The headline and CTA drive to platform demo.`,
      self_score: { voice_compliance: 9, visual_brand_fit: 7, differentiation: 9, terminology: 8 },
    },
  ];
  return variants;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  try {
    const { prompt, campaign_context } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "prompt is required" },
        { status: 400 }
      );
    }

    // Mock mode when no API key
    if (!apiKey) {
      const mockVariants = generateMockVariants(prompt, campaign_context?.platform);
      return NextResponse.json({ variants: mockVariants, raw_text: null, mock: true });
    }

    let userMessage = prompt;
    if (campaign_context) {
      userMessage = `Campaign Context (from PostHog Creative Health Monitor):
- Campaign: ${campaign_context.campaign_name}
- Platform: ${campaign_context.platform}
- Status: ${campaign_context.status}
- Fatigue Score: ${campaign_context.fatigue_score}
- Baseline CTR: ${campaign_context.baseline_ctr}%
- Current CTR: ${campaign_context.current_ctr}%
- Baseline CPM: $${campaign_context.baseline_cpm}
- Current CPM: $${campaign_context.current_cpm}

This campaign needs a creative refresh. ${userMessage}`;
    }

    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    let variants;
    try {
      const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      variants = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ raw_text: text, variants: null });
    }

    return NextResponse.json({ variants, raw_text: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
