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

AD-FORMAT (7 formats):
- banner: Single Image Ad. 1200×1200 (1:1) or 1200×628 (1.91:1) or 1200×1500 (4:5). Intro: 150 chars. Headline: 70 chars max. Safe zone: center 1000×450px.
- dynamic-word-gif-square: Animated GIF, 1080×1080 (1:1). Mobile-first LinkedIn/IG feed. 3-6s loop. One element changes.
- dynamic-word-gif-feed: Animated GIF, 1200×627 (1.91:1). LinkedIn desktop feed + email hero. 3-6s loop. One element changes.
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

Composition rules (apply to every variant — these are NOT optional):
- creative_overlay must fill the canvas like a poster. Think Nike billboard, not PowerPoint slide. If the phrase is shorter than ~5 words, it renders HUGE (10-14% of canvas width per character row). If you write 10+ words, it shrinks into a sub-headline and the ad looks unfinished.
- Target 4-7 words. Break into 2-3 lines at natural phrase breaks (the renderer will split the last 2 words into an accent color automatically). Example: 'We killed death by PowerPoint.' (5 words, 2 lines) NOT 'We are revolutionizing enterprise training with AI-powered adaptive learning' (10 words, wraps awkwardly).
- Never write creative_overlay as a full sentence with subject+verb+object+modifier. Trim everything. Use fragments. End on punchy nouns.
- The below-image headline (the 'headline' field) carries the argument. The creative_overlay carries the slap. They are different jobs.
- When in doubt, WRITE LESS. Every word you delete from creative_overlay makes the remaining words render bigger.

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
  "creative_overlay": "4–7 words. HARD CAP at 8 words. This is the PRIMARY IN-IMAGE text, set in a heavy italic display face (Special Gothic Expanded) and rendered huge inside the canvas. Longer copy shrinks; shorter copy dominates. Write like a poster headline, not a sentence. Examples of the right scale: 'Training that people finish.' / 'Stop proving completions. Prove impact.' / 'The Netflix of enterprise training.' It must be DIFFERENT from headline, intro_text, and overlay_subtext. Never duplicate or paraphrase any of them.",
  "overlay_subtext": "6–12 words. This is the SMALLER supporting line rendered inside the canvas, directly under creative_overlay. Its job is to complete the thought the creative_overlay started — add the specific outcome, number, or twist. It must be DIFFERENT from creative_overlay (which delivers the slap) and DIFFERENT from headline (which does the arguing below the image). Think of it as the 'because' line. Example: creative_overlay='We killed death by PowerPoint.' → overlay_subtext='94% completion rates. Zero begging required.' Do not repeat phrases or paraphrase.",
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

═══ CAROUSEL & DOCUMENT FORMAT — MULTI-CARD CONTENT ═══

When ad_format is "carousel" or "document", each variant MUST include a "cards" array
with per-card/per-page content. The creative_overlay and overlay_subtext still represent
the hook card (card 0), but the cards array provides the full narrative sequence.

For carousel: 5-6 cards. Card 1 = hook (matches creative_overlay). Cards 2-4 = insight/proof. Last card = CTA.
For document: 6-8 pages. Page 1 = hook. Pages 2-5 = narrative arc. Pages 6-7 = trust/scale. Last page = CTA.

Each card object:
{
  "card_overlay": "4-7 words. The primary text for this card/page.",
  "card_subtext": "8-15 words. Supporting line for this card/page.",
  "card_cta": "CTA text. Only include on the LAST card/page.",
  "card_visual_note": "Brief visual direction for this card (e.g. 'Proof card: customer logo')"
}

Card narrative rules:
- Card 1 = the HOOK. Must stop the scroll. Use creative_overlay as the text.
- Card 2-3 = build the ARGUMENT. Escalate tension, add specifics.
- Card 4-5 = provide PROOF. Named customers, specific metrics, real outcomes.
- Last card = the ASK. Clean CTA, low friction. Only card with card_cta.
- Each card must advance the story — no card should repeat the previous card's point.
- Design each card to work as a standalone social card (readable at thumbnail size).

Self-Scoring Rules:
- If any dimension scores below 7, automatically regenerate that variant until it reaches 7+ across all dimensions.
- Voice compliance test: Does the copy match the specified brand_voice tone mix?
- Differentiation test: Could any competitor run this ad? If yes, score it below 5 and rewrite.
- Visual brand fit test: Does the visual_direction match the specified visual_style characteristics?

═══ DYNAMIC-WORD-GIF FORMAT — ADDITIONAL REQUIREMENTS (MOTION SPEC v1) ═══

When ad_format starts with "dynamic-word-gif" (either -square or -feed), the variant renders as a looping animated GIF governed by the motion spec in MOTION.md. Compliance is NOT optional — non-compliant variants will be rejected at QA.

THE ONE-ELEMENT RULE:
Only ONE element animates. Everything else is perfectly still. No background shimmer, no CTA pulse, no gradient drift. This is the single rule that separates gold-standard motion from stock-template motion.

REQUIRED FIELDS (in addition to the standard variant fields):

- "animation_strategy": Exactly one of "word-swap", "stat-pulse", or "type-on". Tied to hook_type:
    * data-stat hook → stat-pulse
    * statement, curiosity-gap, pattern-interrupt → type-on
    * comparison-versus, identity-persona → word-swap
    * any other hook → word-swap (safe default)

- "stat_value": REQUIRED for stat-pulse. A specific number (e.g. "94%", "3.2x", "$2.4M", "3,800+"). 2-6 characters. Never vague ("fast", "better" are forbidden). OMIT for word-swap.
  * IMPORTANT: In stat-pulse variants, the stat_value renders as the HERO headline (very large, pulsing). Do NOT duplicate it in creative_overlay or overlay_subtext — the renderer will quiet the headline slot so the stat is the single focal point.
  * overlay_subtext (which renders UNDER the pulsing stat) is the "because" line — it explains what the stat measures in complementary language. Example: stat_value="94%", overlay_subtext="Completion rates. Zero begging required." NOT "94% completion rates" (that would repeat the number).

- "animation_frames": Array describing the loop. Rules:
    * Total duration (sum of duration_ms) MUST be between 4000 and 5500 ms.
    * Every rest frame has duration_ms between 1800 and 2400 (minimum 1800 — the reader must have time to comprehend).
    * Each frame has "duration_ms": integer.

  For word-swap: 2-4 frames, each with "overlay_text" set to that frame's creative_overlay variant.
    * All overlay_text phrases must be tonally consistent (same voice, same rhythm, 4-7 words each).
    * Each phrase is a complete thought.
    * duration_ms per frame: 1800-2200 (reader needs time).
    * The first frame's overlay_text should match creative_overlay exactly (serves as static fallback).

  For stat-pulse: exactly 2 or 4 frames alternating rest and pulse.
    * Rest frame: duration_ms 1800-2400, "stat_pulse": false.
    * Pulse frame: duration_ms 1200, "stat_pulse": true. (The 1200ms = 500ms swell + 700ms settle; the renderer handles the breathing curve.)
    * The stat is PERSISTENT on both rest and pulse frames — never "appears" or "disappears". The pulse is rhythm, not reveal.
    * stat_value stays constant across frames unless you're doing a count-up (rare; urgency ads only).

- "loop_count": Always -1 (infinite) for advertising GIFs.

FIRST-FRAME FALLBACK (Outlook desktop, corporate firewalls, slow connections show only frame 1):
- Frame 1 must independently communicate the full ad message: logo + creative_overlay + CTA all visible and readable.
- Never put key information only in middle or later frames.
- For word-swap: first frame's overlay_text IS creative_overlay.
- For stat-pulse: first frame is a rest frame with stat visible at rest state.

FORBIDDEN PATTERNS:
- Stat appearing/disappearing (amateurish; breath is correct)
- Hold times under 1800ms (reader can't comprehend)
- Total loop under 3500ms (frantic) or over 6000ms (kills re-impression)
- Multiple animated elements in one variant
- Linear easing (the renderer applies easing; you don't specify it, but don't describe motion as "linear" or "constant speed" in visual_direction either)

EXAMPLE (word-swap, 3 phrases, 5400ms total):
  "animation_strategy": "word-swap",
  "animation_frames": [
    { "duration_ms": 2000, "overlay_text": "Training people finish." },
    { "duration_ms": 1800, "overlay_text": "Training people remember." },
    { "duration_ms": 1600, "overlay_text": "Training people repeat." }
  ],
  "loop_count": -1

EXAMPLE (stat-pulse, single breath, 5200ms total):
  "stat_value": "94%",
  "animation_strategy": "stat-pulse",
  "animation_frames": [
    { "duration_ms": 2200, "stat_pulse": false },
    { "duration_ms": 1200, "stat_pulse": true  },
    { "duration_ms": 1800, "stat_pulse": false }
  ],
  "loop_count": -1

EXAMPLE (stat-pulse, double breath, 5200ms total):
  "stat_value": "3.2x",
  "animation_strategy": "stat-pulse",
  "animation_frames": [
    { "duration_ms": 1800, "stat_pulse": false },
    { "duration_ms": 1200, "stat_pulse": true  },
    { "duration_ms": 1000, "stat_pulse": false },
    { "duration_ms": 1200, "stat_pulse": true  }
  ],
  "loop_count": -1

═══ TYPE-ON STRATEGY (additional rules) ═══

type-on animates creative_overlay character-by-character with a classic thin "|" cursor, then holds the typed text, fades it out, and reappears the complete message as a confident final beat before looping.

For type-on variants:
- creative_overlay is the ONLY message. It types once per loop. Keep it 25–40 characters (the sweet spot — types in 1200–1800ms). Over 50 chars the typing phase dominates the loop and reader fatigues.
- animation_frames is a SINGLE frame with duration_ms set to the desired TOTAL LOOP duration (the renderer internally allocates typing, hold, fade, reappear, and final-hold beats). 4500–5500ms is the right range.
- animation_frames[0] does NOT carry overlay_text or stat_* fields. Just duration_ms.
- stat_value must NOT be set.

EXAMPLE (type-on, 5000ms total loop):
  "creative_overlay": "Training people actually finish.",
  "animation_strategy": "type-on",
  "animation_frames": [
    { "duration_ms": 5000 }
  ],
  "loop_count": -1

EXAMPLE (type-on, shorter message, 4500ms loop):
  "creative_overlay": "Burn the checkbox.",
  "animation_strategy": "type-on",
  "animation_frames": [
    { "duration_ms": 4500 }
  ],
  "loop_count": -1

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
      creative_overlay: "Training people actually finish.",
      overlay_subtext: "94% completion rates. Zero begging required.",
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
      creative_overlay: "Burn the compliance checkbox.",
      overlay_subtext: "From checkbox to real behavior change in 90 days.",
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
      creative_overlay: "Prove the learning worked.",
      overlay_subtext: "From gut feeling to auditable proof. 3,800+ companies trust it.",
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
      creative_overlay: "Four tools become one.",
      overlay_subtext: "Engagement went from mandatory eye-roll to actually useful.",
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
      creative_overlay: "Stop reporting vanity metrics.",
      overlay_subtext: "Connect learning to revenue. Not just completions.",
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

  // Inject GIF animation metadata when format is any GIF surface.
  // Timings comply with MOTION.md: rest ≥1800ms, pulse=1200ms,
  // total loop 4000–5500ms, stat persistent (never appear/disappear).
  if (af.startsWith("dynamic-word-gif")) {
    type MockVariant = typeof variants[number] & {
      stat_value?: string;
      animation_strategy?: "word-swap" | "stat-pulse" | "type-on";
      animation_frames?: Array<{ duration_ms: number; overlay_text?: string; stat_value?: string; stat_pulse?: boolean }>;
      loop_count?: number;
    };

    // v1: data-stat hook → stat-pulse, single breath, 5200ms
    const v1 = variants[0] as MockVariant;
    v1.stat_value = "94%";
    v1.animation_strategy = "stat-pulse";
    v1.animation_frames = [
      { duration_ms: 2200, stat_pulse: false },
      { duration_ms: 1200, stat_pulse: true },
      { duration_ms: 1800, stat_pulse: false },
    ];
    v1.loop_count = -1;

    // v2: statement hook → type-on, single 5000ms loop
    const v2 = variants[1] as MockVariant;
    v2.animation_strategy = "type-on";
    v2.animation_frames = [{ duration_ms: 5000 }];
    v2.loop_count = -1;

    // v3: data-stat hook → stat-pulse, double breath, 5200ms
    const v3 = variants[2] as MockVariant;
    v3.stat_value = "3,800+";
    v3.animation_strategy = "stat-pulse";
    v3.animation_frames = [
      { duration_ms: 1800, stat_pulse: false },
      { duration_ms: 1200, stat_pulse: true },
      { duration_ms: 1000, stat_pulse: false },
      { duration_ms: 1200, stat_pulse: true },
    ];
    v3.loop_count = -1;

    // v4: comparison-versus hook → word-swap, 3 phrases, 5400ms
    const v4 = variants[3] as MockVariant;
    v4.animation_strategy = "word-swap";
    v4.animation_frames = [
      { duration_ms: 2000, overlay_text: "Four tools become one." },
      { duration_ms: 1800, overlay_text: "Four logins become one." },
      { duration_ms: 1600, overlay_text: "Four dashboards become one." },
    ];
    v4.loop_count = -1;

    // v5: question hook (treat as word-swap by default), 2 phrases, 4000ms
    const v5 = variants[4] as MockVariant;
    v5.animation_strategy = "word-swap";
    v5.animation_frames = [
      { duration_ms: 2200, overlay_text: "Reporting vanity metrics?" },
      { duration_ms: 1800, overlay_text: "Report revenue instead." },
    ];
    v5.loop_count = -1;
  }

  // Inject multi-card content for carousel and document formats.
  if (af === "carousel" || af === "document") {
    type CardVariant = typeof variants[number] & {
      cards?: Array<{
        card_overlay: string;
        card_subtext?: string;
        card_cta?: string;
        card_visual_note?: string;
      }>;
    };

    const cardSets: Array<Array<{ card_overlay: string; card_subtext?: string; card_cta?: string; card_visual_note?: string }>> = [
      // v1: data narrative — stat progression
      [
        { card_overlay: "Training people actually finish.", card_subtext: "The completion crisis costs enterprises $300B/year.", card_visual_note: "Hook card: bold statement, dark bg" },
        { card_overlay: "12% average completion.", card_subtext: "That's the industry benchmark. It's embarrassing.", card_visual_note: "Problem card: large red stat" },
        { card_overlay: "94% with Docebo.", card_subtext: "Because AI personalizes every path.", card_visual_note: "Solution card: large green stat" },
        { card_overlay: "60% faster onboarding.", card_subtext: "Zoom cut ramp time in half.", card_visual_note: "Proof card: customer logo" },
        { card_overlay: "3,800+ enterprises agree.", card_subtext: "See why they switched.", card_cta: "See the data →", card_visual_note: "CTA card: logo bar + button" },
      ],
      // v2: provocative challenge
      [
        { card_overlay: "Burn the compliance checkbox.", card_subtext: "Your team deserves better than mandatory tedium.", card_visual_note: "Hook: confrontational, bold italic" },
        { card_overlay: "What if they wanted to learn?", card_subtext: "Not because HR said so. Because the content was good.", card_visual_note: "Reframe: question, lighter tone" },
        { card_overlay: "Content they binge.", card_subtext: "AI-curated paths that adapt to each learner.", card_visual_note: "Feature: product UI mockup" },
        { card_overlay: "Proof, not promises.", card_subtext: "La-Z-Boy: 6x engagement. Pret: 94% completion.", card_visual_note: "Proof: metric cards" },
        { card_overlay: "Your move.", card_cta: "See it live →", card_visual_note: "CTA: minimal, confident" },
      ],
      // v3: authority + proof
      [
        { card_overlay: "Prove the learning worked.", card_subtext: "Your board wants revenue impact, not completion rates.", card_visual_note: "Hook: executive pain" },
        { card_overlay: "Connect learning to NRR.", card_subtext: "Docebo ties education data to Salesforce + Gainsight.", card_visual_note: "Integration: product screenshot" },
        { card_overlay: "From gut feeling to proof.", card_subtext: "Real-time dashboards your CFO will actually read.", card_visual_note: "Dashboard: data viz" },
        { card_overlay: "3.2x ROI. Auditable.", card_subtext: "Conservative assumptions. Real customer data.", card_visual_note: "Stat card: green accent" },
        { card_overlay: "See the numbers.", card_cta: "Get the benchmark →", card_visual_note: "CTA: data-forward" },
      ],
      // v4: tool consolidation story
      [
        { card_overlay: "Four tools become one.", card_subtext: "Your team juggles an LMS, CMS, analytics tool, and authoring suite.", card_visual_note: "Hook: 4 icons → 1" },
        { card_overlay: "One login. One truth.", card_subtext: "No more exporting CSVs between platforms.", card_visual_note: "Simplification: clean UI" },
        { card_overlay: "AI does the routing.", card_subtext: "Right content, right person, right moment.", card_visual_note: "Feature: AI flow diagram" },
        { card_overlay: "From eye-roll to engaged.", card_subtext: "Engagement up 6x after consolidation.", card_visual_note: "Proof: before/after metric" },
        { card_overlay: "See the platform.", card_cta: "Take the tour →", card_visual_note: "CTA: product-forward" },
      ],
      // v5: vanity metrics challenge
      [
        { card_overlay: "Stop reporting vanity metrics.", card_subtext: "Completion rates tell you nothing about business impact.", card_visual_note: "Hook: provocation" },
        { card_overlay: "What does your board want?", card_subtext: "Revenue. Retention. Readiness. Not clicks.", card_visual_note: "Reframe: boardroom context" },
        { card_overlay: "Analytics that matter.", card_subtext: "Skills gaps, revenue attribution, behavioral change.", card_visual_note: "Feature: dashboard" },
        { card_overlay: "47% of CLOs can't prove ROI.", card_subtext: "Be in the other 53%.", card_visual_note: "Stat: urgency" },
        { card_overlay: "Real metrics. Real proof.", card_cta: "See the dashboard →", card_visual_note: "CTA: confident" },
      ],
    ];

    // Add extra pages for document format (pages 6-8)
    const extraPages = [
      { card_overlay: "Built for enterprise scale.", card_subtext: "SOC 2 · ISO 27001 · SSO · 40+ languages.", card_visual_note: "Trust: security badges" },
      { card_overlay: "Implementation in weeks.", card_subtext: "Not quarters. Dedicated CSM from day one.", card_visual_note: "Timeline: simple visual" },
      { card_overlay: "See it yourself.", card_cta: "Book a walkthrough →", card_visual_note: "Final CTA: warm, inviting" },
    ];

    for (let i = 0; i < variants.length; i++) {
      const v = variants[i] as CardVariant;
      const baseCards = cardSets[i] || cardSets[0];
      v.cards = af === "document"
        ? [...baseCards, ...extraPages]
        : baseCards;
    }
  }

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
