import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `Docebo Creative Refresh Engine — UTM-Driven Generation

You generate ad creative brief variants for Docebo that are grounded in a structured UTM taxonomy. Every variant maps to exact UTM dimensions: Publishing-Platform, Visual Style, Brand Voice, Messaging-Angle, Hook-Type, and Ad Format. Your output is immediately usable by copywriters, designers, and media buyers.

═══ UTM TAXONOMY ═══

PUBLISHING-PLATFORM: linkedin | reddit | facebook | instagram
- LinkedIn: Professional but not corporate. Document ads and carousels outperform. Optimize for dwell time.
- Reddit: Community-native tone. No corporate polish. Proof-based, educational framing. Lo-fi visual style.
- Facebook: Retargeting engine. UGC-style creative. Video remarketing sequences (problem → solution → proof).
- Instagram: Visual-first. Story and Reel formats. Motion captures attention. Mobile-only maximum real estate.

VISUAL-STYLE (7 styles):
- neon-intelligence: Dark base (Midnight/near-black), neon accents (#7E2EE9, #FF5DD8, #54FA77, #0057FF). Sharp contrast + glow effects. Special Gothic Expanded headlines. Center-weighted layout. Best for: direct response, product announcements, high-impact hooks.
- human-contrast: Light neutral backgrounds (#F6F5F2/#EBE6DD), real human imagery, editorial spacing. Single bold neon accent. Grid-based, image-led (60-70% image). Best for: customer stories, problem/solution ads, mid-funnel nurture.
- rebellious-editorial: Asymmetrical layouts, overlapping text + imagery, cropped typography. Mix of Special Gothic + Lora. Hard cuts, type sliding from unexpected directions. Best for: brand campaigns, thought leadership, awareness.
- data-as-power: Graph-inspired layouts, modular UI blocks, clean structured composition. Blues + greens dominate. Figtree primary, IBM Plex Mono for data points. Best for: ROI ads, case studies, B2B performance messaging.
- digital-rebellion: Glitch effects, pixel distortions, broken grids, fragmented layouts. High contrast neon clashes. Disrupted alignment, intentional chaos with control. Best for: disruptive hooks, competitive conquest, bold campaign intros.
- minimal-authority: Extreme whitespace, minimal elements, one strong statement. Black/white base, single accent color. Large confident headlines. Best for: high-end brand positioning, executive audiences, retargeting.
- system-ui: Interface mockups, layered dashboards, cursor interactions. Full palette but structured. Figtree dominant, Mono for system cues. Best for: product demos, feature ads, conversion-focused campaigns.

BRAND-VOICE (5 voices):
1. learning-insurgent (Brand Foundation): 40% Confidently Irreverent / 30% Rebelliously Smart / 20% Addictively Human / 10% Data with Personality. The mothership — declares war on boring training, positions Docebo as the renegade.
2. provocateur (Cold — Awareness): 80% Confidently Irreverent / 20% Rebelliously Smart. Maximum swagger and pattern interrupt. Hot takes, uncomfortable truths, enemy framing.
3. trusted-advisor (Warm — Consideration): 60% Data-Driven Confidence / 25% Addictively Human / 15% Subtle Flex. Proof-led: data, customer outcomes, named enterprise logos.
4. empathetic-challenger (Pain-Aware — Mid-Funnel): 50% Empathetic Understanding / 30% Righteous Indignation / 20% Solution Optimism. Deep empathy then pivots to possibility.
5. insider (Niche — Use-Case Specific): 70% Rebelliously Smart / 20% Technical Precision / 10% Addictively Human. Tribal language of a specific persona — drops exact terminology, references specific KPIs.

MESSAGING-ANGLE (8 angles):
- problem: Pain point agitation / Cost of inaction / Risk/fear
- outcome: ROI/efficiency gain / Aspiration/vision / Competitive advantage
- proof: Social proof/authority / Case study/success story / Industry validation
- differentiation: Us vs. them / Category creation / Contrarian/myth-busting
- persona: Role-specific empathy / Day-in-the-life / Career/political capital
- urgency: Trend-riding / Seasonal/planning cycle / Limited offer
- education: Thought leadership / How-to/tactical / Data/research
- emotional: Belonging/community / Frustration/humor / Pride/craft

HOOK-TYPE (12 types):
- question: Rhetorical, Diagnostic, Challenge, Curiosity questions
- statement: Bold claim, Contrarian take, Hot take, Prediction, Confession/vulnerability
- data-stat: Surprising statistic, Benchmark comparison, Cost/loss quantification, Speed/scale metric
- story-native: Customer origin story, Founder story, Before/after snapshot, Failure story, Day-in-the-life vignette
- pattern-interrupt: Unexpected visual, Breaking the fourth wall, Absurdist/humor, Self-aware ad, Anti-ad
- social-proof: Name drop, Logo bar, Quote/testimonial lead, Crowd signal, Peer comparison
- list-framework: Numbered list, Playbook/blueprint, Checklist, Tier/ranking, Mistake list
- comparison-versus: This vs. that, Old way vs. new way, With vs. without, Expectation vs. reality
- command-cta: Imperative opener, Invitation, Dare/challenge, Time-bound nudge
- identity-persona: Role callout, Tribe signal, Aspirational identity, Anti-persona, Stage-specific
- curiosity-gap: Incomplete reveal, Teaser, Insider knowledge, Counterintuitive setup
- timeliness: Trend hook, Regulation/policy hook, Event tie-in, Breaking news format

AD-FORMAT (6 formats):
- banner: Single Image Ad. 1200×1200 (1:1) or 1200×628 (1.91:1) or 1200×1500 (4:5). Intro: 150 chars. Headline: 70 chars max. Safe zone: center 1000×450px.
- dynamic-word-gif: Animated GIF or word-swap. 1080×1080. Motion: 3-6 seconds looping. One element changes, everything else holds steady.
- document: Multi-page swipeable. 1080×1080 per page. 5-10 pages sweet spot. Page 1=hook, 2-4=insight, final=CTA. No headline/CTA button on ad.
- carousel: Multi-card swipeable. 1080×1080 (1:1 ONLY). 2-10 cards (5-6 sweet spot). Card headline: 45 chars. CTA on last card only.
- article-newsletter: Sponsored LinkedIn article/newsletter. Cover: 1920×1080 or 1200×644. Intro text: 150 chars. CTA: "Read" or "Subscribe".
- thought-leader: Boosted employee organic post. Creative pulled from original post. Non-editable. Most authentic format.

═══ BRAND IDENTITY ═══

Banned Language: Never use: leverage, synergy, best-in-class, empower, unlocking potential, comprehensive solution, seamless, innovative, scalable, robust, cutting-edge, game-changing, next-generation.
Always prefer: automate, consolidate, audit-ready, measurable, specific numbers, auditable claims.

Copy Rules:
- Investment mix target across variants: ~55% Product-Led, 30% Social Proof, 15% Brand
- The enemy is the status quo, not competitors by name
- Data with personality: "7 billion training hours wasted last year. We're here to get that time back."
- Show, don't tell. Don't say we're innovative — show how we turned compliance training into something people binge-watch.
- No feature lists without "why should I care?"

Visual Brand Elements:
- Typography: Special Gothic Expanded (headlines), Figtree (body), Lora (quotes), IBM Plex Mono (CTAs/data)
- Colors: Navy #0033A0, Midnight #131E29, Neon Blue #0057FF, Neon Pink #FF5DD8, Neon Green #E3FFAB, Neon Purple #DCB7FF, Marble #E6DACB
- Tints: Blue 90 #06065D, Pink 80 #B627C6, Green 40 #54FA77, Purple 60 #7E2EE9

═══ OUTPUT REQUIREMENTS ═══

Generate exactly 5 variants. Each variant MUST use:
- The specified brand_voice, visual_style, messaging_angle, publishing_platform, and ad_format from the request
- A DIFFERENT hook_type for each variant (pick 5 of the 12 hook types)
- The target persona's specific pain points and language
- Compose utm_content_tag as: [visual-style]_[ad-format]_[messaging-angle]_[hook-type]_[brand-voice]_[persona]_[variant-id]

Output Format (per variant) — YOU MUST USE THIS EXACT JSON FORMAT:
Return a JSON array of variant objects. Each variant object has these fields:
{
  "variant_id": "v1",
  "intro_text": "30–50 words, platform-appropriate",
  "headline": "7 words max — this is the BELOW-IMAGE feed headline (LinkedIn feed chrome). It must be DIFFERENT from creative_overlay. Think of it as a complementary hook or CTA-style line that entices the click AFTER the reader has seen the in-image text.",
  "creative_overlay": "14 words max (fit safe zone) — this is the PRIMARY IN-IMAGE text, the dominant visual headline rendered large inside the ad creative. It must be DIFFERENT from headline. Never duplicate or paraphrase the headline here.",
  "visual_direction": "Specific guidance for designer matching the visual_style",
  "cta_text": "CTA button text",
  "messaging_angle": "problem | outcome | proof | differentiation | persona | urgency | education | emotional",
  "messaging_sub_angle": "Specific sub-angle name (e.g. Pain point agitation)",
  "hook_type": "question | statement | data-stat | story-native | pattern-interrupt | social-proof | list-framework | comparison-versus | command-cta | identity-persona | curiosity-gap | timeliness",
  "brand_voice": "learning-insurgent | provocateur | trusted-advisor | empathetic-challenger | insider",
  "visual_style": "neon-intelligence | human-contrast | rebellious-editorial | data-as-power | digital-rebellion | minimal-authority | system-ui",
  "publishing_platform": "linkedin | reddit | facebook | instagram",
  "ad_format": "banner | dynamic-word-gif | document | carousel | article-newsletter | thought-leader",
  "utm_content_tag": "[visual-style]_[ad-format]_[messaging-angle]_[hook-type]_[brand-voice]_[persona]_[variant-id]",
  "gemini_image_prompt": "Detailed image generation prompt with dimensions, colors, typography, composition matching the visual_style",
  "full_ad_mockup_description": "Complete visual description of the finished ad",
  "self_score": {
    "voice_compliance": 8,
    "visual_brand_fit": 8,
    "differentiation": 8,
    "terminology": 8
  }
}

Self-Scoring Rules:
- If any dimension scores below 7, automatically regenerate that variant until it reaches 7+ across all dimensions.
- Voice compliance test: Does the copy match the specified brand_voice tone mix?
- Differentiation test: Could any competitor run this ad? If yes, score it below 5 and rewrite.
- Visual brand fit test: Does the visual_direction match the specified visual_style characteristics?

CRITICAL: Your response must be ONLY a valid JSON array of variant objects. No markdown, no explanation, no preamble. Just the JSON array.`;

function generateMockVariants(_prompt: string, platform?: string, visualStyle?: string, brandVoice?: string, adFormat?: string, messagingAngle?: string, _hookType?: string, persona?: string): object[] {
  const plat = platform || "linkedin";
  const vs = visualStyle || "neon-intelligence";
  const bv = brandVoice || "provocateur";
  const af = adFormat || "banner";
  const ma = messagingAngle || "problem";
  const p = persona || "ld-leader";

  const variants = [
    {
      variant_id: "v1",
      intro_text: "Your L&D team just spent 6 months building a training program nobody will finish. Meanwhile, companies using Docebo saw 94% completion rates. The difference? They stopped building courses and started building experiences.",
      headline: "Training Nobody Finishes Costs Millions",
      creative_overlay: "94% completion rates. Zero begging required.",
      visual_direction: `${vs === "neon-intelligence" ? "Dark navy (#0A0A0A) background with electric purple (#7E2EE9) headline glow. Neon green (#54FA77) stat accent. Subtle animated grid at very low opacity." : "Split composition matching " + vs + " style guidelines."}`,
      cta_text: "See How They Did It",
      messaging_angle: ma,
      messaging_sub_angle: "Pain point agitation",
      hook_type: "data-stat",
      brand_voice: bv,
      visual_style: vs,
      publishing_platform: plat,
      ad_format: af,
      utm_content_tag: `${vs}_${af}_${ma}_data-stat_${bv}_${p}_v1`,
      gemini_image_prompt: `Create a 1200x1200 professional ad image. ${vs === "neon-intelligence" ? "Full black (#0A0A0A) background. Subtle animated grid very low opacity. Headline 'Training Nobody Finishes Costs Millions' in glowing electric purple (#7E2EE9). Secondary stat '94%' in neon green (#54FA77). Green CTA pill bottom-right." : "Match " + vs + " visual characteristics."} Docebo logo white bottom-left. Special Gothic Expanded font for headline.`,
      full_ad_mockup_description: `The ad appears in ${plat} feed. ${vs} visual style applied. Headline reads 'Training Nobody Finishes Costs Millions'. CTA: 'See How They Did It'.`,
      self_score: { voice_compliance: 9, visual_brand_fit: 9, differentiation: 8, terminology: 9 },
    },
    {
      variant_id: "v2",
      intro_text: "Hot take: Your compliance training is a checkbox exercise, and everyone — including your auditors — knows it. What if you could make it something people actually remember? Docebo customers turned mandatory training into measurable behavior change.",
      headline: "Compliance Training People Actually Remember",
      creative_overlay: "From checkbox to behavior change in 90 days.",
      visual_direction: `${vs === "digital-rebellion" ? "Glitched LMS UI screens breaking apart. Neon green error overlays. Chaotic but readable center headline." : "Apply " + vs + " visual characteristics with bold, provocative energy."}`,
      cta_text: "Burn The Checkbox",
      messaging_angle: ma,
      messaging_sub_angle: "Cost of inaction",
      hook_type: "statement",
      brand_voice: bv,
      visual_style: vs,
      publishing_platform: plat,
      ad_format: af,
      utm_content_tag: `${vs}_${af}_${ma}_statement_${bv}_${p}_v2`,
      gemini_image_prompt: `Create a 1200x1200 ad. Apply ${vs} visual style. Bold typography. Headline "Compliance Training People Actually Remember" prominent. Overlay "From checkbox to behavior change in 90 days." Green CTA pill "Burn The Checkbox". Docebo logo. Special Gothic Expanded font.`,
      full_ad_mockup_description: `Bold provocative ad using ${vs} style. Headline challenges compliance status quo. CTA button reads 'Burn The Checkbox'.`,
      self_score: { voice_compliance: 10, visual_brand_fit: 8, differentiation: 9, terminology: 9 },
    },
    {
      variant_id: "v3",
      intro_text: "We asked 200 CLOs what keeps them up at night. The #1 answer wasn't budget cuts or headcount. It was this: 'I can't prove our training actually changed anything.' Docebo's analytics changed that for Walmart, Pret, and 3,800+ companies.",
      headline: "Prove Training Actually Changed Something",
      creative_overlay: "From gut feeling to auditable proof. 3,800+ companies.",
      visual_direction: `Apply ${vs} visual style. Clean, data-forward composition. Three floating metric cards showing real customer outcomes.`,
      cta_text: "Get Measurable Results",
      messaging_angle: ma,
      messaging_sub_angle: "Risk/fear",
      hook_type: "story-native",
      brand_voice: bv,
      visual_style: vs,
      publishing_platform: plat,
      ad_format: af,
      utm_content_tag: `${vs}_${af}_${ma}_story-native_${bv}_${p}_v3`,
      gemini_image_prompt: `Create a 1200x1200 ad. ${vs} visual style. Three floating white card elements showing metrics: "94% Completion", "3.2x ROI", "Audit-Ready in Days". Headline "Prove Training Actually Changed Something". Green CTA "Get Measurable Results". Docebo logo.`,
      full_ad_mockup_description: `A data-rich ad using ${vs} style with floating metric cards. Story-opener intro about CLOs. CTA: 'Get Measurable Results'.`,
      self_score: { voice_compliance: 8, visual_brand_fit: 9, differentiation: 8, terminology: 10 },
    },
    {
      variant_id: "v4",
      intro_text: "Unpopular opinion: The reason your employees hate training isn't the content — it's the delivery. We consolidated 4 tools into 1 platform and watched engagement go from 'mandatory eye-roll' to 'wait, this is actually useful.'",
      headline: "They Hate The Delivery Not Content",
      creative_overlay: "4 tools → 1 platform. Engagement went through the roof.",
      visual_direction: `${plat === "reddit" ? "Lo-fi, community-native style. Screenshot-style mockup. Minimal branding. Educational, proof-based framing." : "Apply " + vs + " visual style. UGC-style testimonial feel."}`,
      cta_text: "See The Platform",
      messaging_angle: ma,
      messaging_sub_angle: "Pain point agitation",
      hook_type: "comparison-versus",
      brand_voice: bv,
      visual_style: vs,
      publishing_platform: plat,
      ad_format: af,
      utm_content_tag: `${vs}_${af}_${ma}_comparison-versus_${bv}_${p}_v4`,
      gemini_image_prompt: `Create a ${plat === "reddit" ? "1080x1080 lo-fi style" : "1200x1200 " + vs + " style"} ad. Before/after: 4 app icons crossed out vs 1 Docebo icon. Headline "They Hate The Delivery Not Content". Green CTA "See The Platform". Docebo logo subtle.`,
      full_ad_mockup_description: `A ${plat === "reddit" ? "community-native, lo-fi" : vs + " styled"} ad that leads with a hot take about tool consolidation.`,
      self_score: { voice_compliance: 9, visual_brand_fit: 7, differentiation: 9, terminology: 8 },
    },
    {
      variant_id: "v5",
      intro_text: "Every quarter, 47% of L&D leaders report to the board with 'completion rates' as their top metric. Meanwhile, the board is asking about revenue impact. Docebo bridges that gap with analytics that connect learning to business outcomes.",
      headline: "Stop Reporting Vanity Metrics To Board",
      creative_overlay: "Connect learning to revenue. Not just completions.",
      visual_direction: `Apply ${vs} visual style. Executive-level aesthetic. Clean data visualization showing the gap between completion metrics and business impact.`,
      cta_text: "See Real Metrics",
      messaging_angle: ma,
      messaging_sub_angle: "Pain point agitation",
      hook_type: "question",
      brand_voice: bv,
      visual_style: vs,
      publishing_platform: plat,
      ad_format: af,
      utm_content_tag: `${vs}_${af}_${ma}_question_${bv}_${p}_v5`,
      gemini_image_prompt: `Create a 1200x1200 ad. ${vs} visual style. Executive aesthetic. Data viz showing gap between "completion rate" and "revenue impact". Headline "Stop Reporting Vanity Metrics To Board". Green CTA "See Real Metrics". Docebo logo. Special Gothic Expanded.`,
      full_ad_mockup_description: `Executive-targeted ad using ${vs} style. Challenges vanity metrics. CTA drives to analytics dashboard.`,
      self_score: { voice_compliance: 8, visual_brand_fit: 8, differentiation: 8, terminology: 9 },
    },
  ];
  return variants;
}

/** Fetch rendering feedback and build a prompt section summarizing learnings */
async function buildFeedbackContext(): Promise<string> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/feedback`);
    if (!res.ok) return "";
    const { entries, themeSummary } = await res.json();

    if (!entries || entries.length === 0) return "";

    const lines: string[] = [
      "\n\nRendering Feedback Loop — Learnings from past mockup reviews:",
      `Total feedback entries: ${entries.length}`,
    ];

    for (const [theme, data] of Object.entries(themeSummary) as [string, { negative: string[]; positive: string[] }][]) {
      if (data.negative.length > 0) {
        lines.push(`- Theme "${theme}" issues (${data.negative.length}x): ${[...new Set(data.negative)].slice(0, 5).join(", ")}`);
      }
      if (data.positive.length > 0) {
        lines.push(`- Theme "${theme}" praised (${data.positive.length}x): ${[...new Set(data.positive)].slice(0, 5).join(", ")}`);
      }
    }

    const recentNotes = entries
      .filter((e: { note: string }) => e.note)
      .slice(-10)
      .map((e: { note: string }) => `  - "${e.note}"`);

    if (recentNotes.length > 0) {
      lines.push("\nDirect reviewer notes (most recent):");
      lines.push(...recentNotes);
    }

    lines.push(
      "\nUse these learnings to avoid known rendering issues in your visual_direction and gemini_image_prompt fields. " +
      "Favor color/layout combinations that received positive feedback. " +
      "Avoid combinations that caused readability, contrast, or overflow issues."
    );

    return lines.join("\n");
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  try {
    const {
      prompt,
      campaign_context,
      messaging_angle,
      messaging_sub_angle,
      hook_type,
      brand_voice,
      visual_style,
      ad_format,
      publishing_platform,
      persona,
    } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "prompt is required" },
        { status: 400 }
      );
    }

    // Fetch feedback learnings to inject into the prompt
    const feedbackContext = await buildFeedbackContext();

    // Mock mode when no API key
    if (!apiKey) {
      const mockVariants = generateMockVariants(
        prompt, publishing_platform, visual_style, brand_voice, ad_format, messaging_angle, hook_type, persona,
      );
      return NextResponse.json({ variants: mockVariants, raw_text: null, mock: true });
    }

    const PERSONA_CONTEXT: Record<string, string> = {
      "brand": "Target: Broad Docebo audience. Use big, bold, category-defining statements. Not persona-specific\u2014appeal to anyone who touches learning, enablement, or workforce development. Lead with Docebo\u2019s insurgent positioning. Make it feel like a movement, not a product.",
      "ld-leader": "Target Persona: Chief Learning Officer / VP of L&D / Director of L&D. They care about: enterprise learning ROI, workforce readiness, vendor consolidation, skills strategy tied to business outcomes, credibility at the executive table. Pain: can\u2019t tie learning to business KPIs, manual processes killing the team, vendor sprawl, failed implementations. Language they use: business impact, workforce readiness, time to performance, governance, future-proofing. Avoid: feature-first messaging, LMS-centric framing.",
      "hr-leader": "Target Persona: CHRO / CPO / VP of HR. They care about: people strategy aligned to business outcomes, HRIS integration (Workday, UKG, ADP), retention, compliance defensibility, single source of truth for people data, administrator reduction. Pain: 124 administrators across 29 business units, compliance reporting takes 30-40 minutes, manual org hierarchy updates, fragmented systems. Language: single source of truth, data governance, workforce readiness, internal mobility. Avoid: LMS-centric framing, training-only language.",
      "enablement": "Target Persona: CRO / CSO / VP of Sales Enablement. They care about: revenue impact, Salesforce integration (embedded Lightning, bi-directional sync), rep ramp time, win rates, certified staff performance (7x more likely to hit ramp goals), customer onboarding from 3-4 months to 5-6 weeks. Pain: enablement not seen as revenue contributor, ramp takes too long, partner performance uneven. Language: direct revenue contribution, incremental sales, win rates, quota attainment. Avoid: learning-first framing, soft outcomes.",
      "customer-ed": "Target Persona: VP/Director of Customer Education / Head of Customer Enablement. They care about: monetizing training (5x revenue increase), support ticket deflection (5x decrease), customer retention (8-16% boost), lead generation (30% of users are prospects), time-to-value. Pain: 27-28% non-users, revenue potential unrealized, content can\u2019t keep up with product. Language: cost deflection, revenue generation, upsell potential, monetize training. Avoid: HR-centric language, compliance-first narratives.",
      "partnerships": "Target Persona: VP/Director of Partner Enablement / Head of Partnerships / Director of Channel Enablement. They care about: partner-sourced revenue growth, certification completion (90-95% benchmark), deal win rate by tier, time to first deal, automated provisioning from CRM. Pain: partners added manually, training difficult to track at volume, certification data unreliable. Language: partner-sourced revenue, deal registration, revenue attribution, certification completion. Avoid: internal L&D language, one-size-fits-all framing.",
      "pro-dev": "Target Persona: VP of Professional Development / Head of Talent Development / Director of Leadership & OE. They care about: skills mapping to job roles, Workday integration, behavioral change measurement (Kirkpatrick Level 3), manager enablement, ROI benchmarking, AI virtual coaching. Pain: competencies mapped to job levels not roles, can\u2019t prove behavioral change, skills dashboard not ready. Language: skills mapping, Kirkpatrick model, behavioral change, career progression. Avoid: compliance-first framing, generic competency frameworks.",
      "franchise": "Target Persona: VP/Director of Franchise Training / Head of Franchise Dev / Director of Field Learning. They care about: mobile device policy compliance (no phones on floor), HRIS integration with 4+ API data files, offline learning with wage/hour tracking, QR code attendance, 6x engagement improvement, multi-language (52+). Pain: hourly staff can\u2019t use personal devices, HRIS integration is complex, paper-based onboarding. Language: device policy, offline sync, franchisee data management, brand consistency. Avoid: corporate learning language, personal-phone-first assumptions.",
      "compliance": "Target Persona: Compliance Officer / Director of Corporate Compliance / VP of Risk & Compliance. They care about: proving compliance at any moment, audit-ready records without manual assembly, automated assignment by role/region/regulation, immutable completion records, AI governance with zero data retention. Pain: audit requests they can\u2019t answer instantly, inconsistent records across systems, duplicate user accounts. Language: audit readiness, regulatory defensibility, evidence and traceability, immutable records. Avoid: engagement-first framing, gamification language.",
      "finance": "Target Persona: CFO / EVP / VP of Finance. They care about: defensible ROI with conservative assumptions, predictable TCO, AI credit governance, vendor consolidation, no pricing surprises at renewal. Pain: variable AI costs unpredictable, implementation costs surface after contract, ROI models too optimistic. Language: total cost of ownership, ROI defensibility, budget predictability, locked pricing. Avoid: feature-first language, optimistic projections.",
      "it-leader": "Target Persona: CIO / CTO / VP of IT. They care about: enterprise security (SOC 2, ISO 27001), SSO/SAML, HRIS real-time sync, API architecture, AI model transparency and zero data retention, reducing shadow IT, data residency for AI processing. Pain: AI feature sprawl, fragmented tools, integration maintenance burden, vendor updates breaking integrations. Language: security posture, AI governance, integration architecture, trust portal, API reliability. Avoid: feature-first pitches, AI claims without model transparency.",
      "operations": "Target Persona: COO / Head of Operations / VP of Business Operations. They care about: operational scalability, time-to-productivity, training standardization across distributed workforce, frontline accessibility (offline, QR code), M&A integration. Pain: scaling faster than training infrastructure, compliance completions don\u2019t equal readiness, training doesn\u2019t reach frontline. Language: operational scalability, workforce readiness, process consistency, frontline performance. Avoid: engagement metrics as outcomes, implementation timelines ignoring operational constraints.",
    };

    let userMessage = prompt;

    if (persona && PERSONA_CONTEXT[persona]) {
      userMessage += `\n\nTarget Persona Direction: ${PERSONA_CONTEXT[persona]}\nWrite every variant as if this persona will see it in their feed. Use their language, hit their pain points, and reference outcomes they actually measure. Do not use generic learning language unless the persona uses it.`;
    }

    // Inject UTM dimension overrides
    if (messaging_angle) {
      userMessage += `\n\nMessaging Angle: ${messaging_angle}${messaging_sub_angle ? ` → ${messaging_sub_angle}` : ""}. All 5 variants must use this messaging angle. Vary the sub-angle across variants.`;
    }

    if (hook_type) {
      userMessage += `\n\nPrimary Hook Type: ${hook_type}. Use this as the lead hook for at least 2 variants. Distribute remaining variants across other hook types.`;
    }

    if (brand_voice) {
      userMessage += `\n\nBrand Voice: ${brand_voice}. All 5 variants must use this voice. Match the tone mix precisely.`;
    }

    if (visual_style) {
      userMessage += `\n\nVisual Style: ${visual_style}. All visual_direction and gemini_image_prompt fields must match this style's characteristics.`;
    }

    if (ad_format) {
      userMessage += `\n\nAd Format: ${ad_format}. Follow the format specs exactly. Adjust dimensions, copy length, and CTA placement per format requirements.`;
    }

    if (publishing_platform) {
      userMessage += `\n\nPublishing Platform: ${publishing_platform}. Adapt tone, copy length, visual style, and creative direction for this platform.`;
    }

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

    const systemPrompt = feedbackContext
      ? SYSTEM_PROMPT + feedbackContext
      : SYSTEM_PROMPT;

    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      system: systemPrompt,
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

    // Post-process: enforce structured UTM fields and compose utm_content_tag
    // This guarantees correct tags even when Claude formats them inconsistently
    if (Array.isArray(variants)) {
      for (const v of variants) {
        // Backfill structured fields from request params if Claude omitted them
        v.publishing_platform = v.publishing_platform || publishing_platform || "linkedin";
        v.visual_style = v.visual_style || visual_style || "neon-intelligence";
        v.brand_voice = v.brand_voice || brand_voice || "learning-insurgent";
        v.messaging_angle = v.messaging_angle || messaging_angle || v.ad_type || "problem";
        v.ad_format = v.ad_format || ad_format || "banner";
        v.hook_type = v.hook_type || "question";
        v.messaging_sub_angle = v.messaging_sub_angle || messaging_sub_angle || "";

        // Compose utm_content_tag from structured fields
        // Format: [visual-style]_[ad-format]_[messaging-angle]_[hook-type]_[brand-voice]_[persona]_[variant-id]
        const p = persona || "brand";
        v.utm_content_tag = [
          v.visual_style,
          v.ad_format,
          v.messaging_angle,
          v.hook_type,
          v.brand_voice,
          p,
          v.variant_id,
        ].join("_");
      }
    }

    return NextResponse.json({ variants, raw_text: null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
