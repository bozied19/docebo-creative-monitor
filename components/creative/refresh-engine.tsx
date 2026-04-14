"use client";

import { useState, useEffect } from "react";
import type { FatigueRow } from "./health-tables";

/* ══════════════════════════════════════════════════════════════════
   UTM TAXONOMY — derived from Creative Refresh Engine UTM Key PDF
   ══════════════════════════════════════════════════════════════════ */

/* ── Publishing Platform ───────────────────────────────────────── */
interface PlatformOption {
  id: string;
  label: string;
}

const PLATFORM_OPTIONS: PlatformOption[] = [
  { id: "linkedin", label: "LinkedIn" },
  { id: "reddit", label: "Reddit" },
  { id: "facebook", label: "Facebook" },
  { id: "instagram", label: "Instagram" },
];

/* ── Visual Style (7 styles from PDF) ──────────────────────────── */
interface VisualStyleOption {
  id: string;
  label: string;
  desc: string;
  coreIdea: string;
  swatch: string;
  /** Maps to ad-canvas theme names for rendering */
  themes: string[];
}

const VISUAL_STYLE_OPTIONS: VisualStyleOption[] = [
  {
    id: "neon-intelligence",
    label: "Neon Intelligence",
    desc: "High-conversion performance meets future-forward energy",
    coreIdea: "Bold, high-contrast creative that feels like intelligence turned electric. Dark base with neon accents.",
    swatch: "linear-gradient(135deg, #0A0A0A, #7E2EE9, #54FA77)",
    themes: ["navy-white", "navy-green", "navy-pink", "navy-lavender"],
  },
  {
    id: "human-contrast",
    label: "Human Contrast",
    desc: "Soft humanity vs sharp intelligence",
    coreIdea: "Blend emotional relatability with sharp, modern design. Light neutral backgrounds, real human imagery.",
    swatch: "linear-gradient(135deg, #F6F5F2, #EBE6DD, #7E2EE9)",
    themes: ["beige-navy", "beige-purple", "beige-wave"],
  },
  {
    id: "rebellious-editorial",
    label: "Rebelliously Editorial",
    desc: "Magazine meets manifesto",
    coreIdea: "High-end editorial spread with attitude. Asymmetrical layouts, overlapping text + imagery, cropped typography.",
    swatch: "linear-gradient(135deg, #2A2923, #FF5DD8, #E6DACB)",
    themes: ["quote-gradient", "beige-wave"],
  },
  {
    id: "data-as-power",
    label: "Data As Power",
    desc: "Make intelligence visible",
    coreIdea: "Turn analytics, insights, and outcomes into visually compelling assets. Graph-inspired, modular UI blocks.",
    swatch: "linear-gradient(135deg, #0057FF, #54FA77, #131E29)",
    themes: ["white-purple", "navy-white"],
  },
  {
    id: "digital-rebellion",
    label: "Digital Rebellion",
    desc: "Break the system visually",
    coreIdea: "Glitch effects, pixel distortions, broken grids, fragmented layouts. High contrast neon clashes.",
    swatch: "linear-gradient(135deg, #131E29, #FF5DD8, #54FA77, #0057FF)",
    themes: ["gradient-pink", "navy-pink"],
  },
  {
    id: "minimal-authority",
    label: "Minimal Authority",
    desc: "Confidence without noise",
    coreIdea: "Stripped-down, ultra-clean visuals that signal premium confidence. Extreme whitespace, one strong statement.",
    swatch: "linear-gradient(135deg, #FFFFFF, #0A0A0A)",
    themes: ["white-purple"],
  },
  {
    id: "system-ui",
    label: "System UI Aesthetic",
    desc: "Feels like the product is already in their hands",
    coreIdea: "Blend product UI with storytelling. Interface mockups, layered dashboards, cursor interactions.",
    swatch: "linear-gradient(135deg, #0033A0, #4C8DFF, #E3FFAB)",
    themes: ["navy-white", "navy-green"],
  },
];

/* ── Brand Voice (5 voices from PDF) ───────────────────────────── */
export interface VoicePillar {
  name: string;
  desc: string;
  insteadOf: string;
  say: string;
}

export interface ToneContext {
  context: string;
  mix: string;
}

export interface VoiceExample {
  format: string;
  text: string;
}

export interface VoicePrinciple {
  name: string;
  desc: string;
}

export interface BrandVoiceOption {
  id: string;
  label: string;
  stage: string;
  coreEnergy: string;
  desc: string;
  toneMix: string;
  /** Full guide fields — optional until all guides are populated */
  positioning?: { from: string; to: string };
  voicePillars?: VoicePillar[];
  toneSpectrum?: ToneContext[];
  examples?: VoiceExample[];
  donts?: string[];
  principles?: VoicePrinciple[];
  taglines?: string[];
  promise?: string;
}

export const BRAND_VOICE_OPTIONS: BrandVoiceOption[] = [
  {
    id: "learning-insurgent",
    label: "The Learning Insurgent",
    stage: "Brand Foundation",
    coreEnergy: "Provocative movement-builder",
    desc: "The mothership. Declares war on boring, checkbox-driven corporate training. PhD in ripped jeans.",
    toneMix: "40% Confidently Irreverent / 30% Rebelliously Smart / 20% Addictively Human / 10% Data with Personality",
    positioning: {
      from: "Another LMS vendor speaking in corporate platitudes",
      to: "The learning provocateur that makes enterprise training addictive",
    },
    voicePillars: [
      {
        name: "Rebelliously Smart",
        desc: "We're the PhD who shows up in ripped jeans. Brilliant but never boring. We drop knowledge bombs, not jargon bombs.",
        insteadOf: "Our comprehensive learning management solution enables organizational capability building through scalable digital transformation initiatives.",
        say: "Your people are brilliant. Your training shouldn't insult their intelligence. Let's build learning that actually sticks.",
      },
      {
        name: "Confidently Irreverent",
        desc: "We call BS on outdated training methods. We're here to burn down the compliance checkbox mentality and build something people actually want to use.",
        insteadOf: "Docebo provides industry-leading compliance training modules.",
        say: "Remember death by PowerPoint? We killed it. Your compliance training just became the content your teams actually open.",
      },
      {
        name: "Addictively Human",
        desc: "We make enterprise software that doesn't feel like enterprise software. Think Netflix met your learning platform and had a brilliant baby.",
        insteadOf: "User-friendly interface with intuitive navigation.",
        say: "So smooth, your teams will forget they're learning. So powerful, you'll forget it's software.",
      },
    ],
    toneSpectrum: [
      { context: "Announcing features", mix: "70% Confident swagger / 20% Playful provocation / 10% Technical precision" },
      { context: "Addressing pain points", mix: "60% Empathetic understanding / 30% Righteous indignation / 10% Solution-focused optimism" },
      { context: "Talking ROI/results", mix: "70% Data-driven confidence / 15% Subtle flex / 15% 'Told you so' energy" },
    ],
    examples: [
      { format: "Homepage Hero", text: "Your competitors are still forcing death by PowerPoint. You're about to turn learning into your unfair advantage." },
      { format: "Product Description", text: "AI that reads the room. Analytics that predict the future. Learning that people actually finish. This isn't your dad's LMS." },
      { format: "Customer Success Story", text: "Acme Corp went from 12% training completion to 94% in 6 months. Not because we forced it. Because their people couldn't stop clicking 'next episode.'" },
      { format: "Social Post", text: "Hot take: If your training needs forced attendance, your training sucks. @ us." },
      { format: "Sales Messaging", text: "Look, we could tell you about our 'synergistic learning ecosystems' but we respect you too much for that. Here's the truth: Your people will actually use this. Your metrics will actually matter. Your CEO will actually notice." },
    ],
    donts: [
      "No empty corporate speak ('leverage,' 'synergy,' 'best-in-class')",
      "No apologizing for being different",
      "No feature lists without the 'why should I care?'",
      "No humble-bragging. Just bragging.",
    ],
    principles: [
      { name: "Make them feel something", desc: "Boredom is the enemy. Every line should spark curiosity, relief, or excitement." },
      { name: "Show, don't tell", desc: "Don't say we're innovative. Say we turned compliance training into something people binge-watch." },
      { name: "Enemy is the status quo", desc: "We're not fighting other LMS platforms. We're fighting boring, ineffective training everywhere." },
      { name: "Confidence without arrogance", desc: "We know we're good. We don't need to put others down to prove it." },
      { name: "Data with personality", desc: "Numbers tell the story, but make them memorable. '7 billion training hours wasted last year. We're here to get that time back.'" },
    ],
    taglines: [
      "Learning that doesn't suck.",
      "Make training the perk, not the punishment.",
      "Enterprise learning. Human experience.",
      "Finally. Learning worth finishing.",
    ],
    promise: "We promise to never sound like an LMS company. We promise to make enterprise learning feel less like enterprise and more like learning. We promise your people will thank you instead of avoiding you.",
  },
  {
    id: "provocateur",
    label: "The Provocateur",
    stage: "Cold — Awareness",
    coreEnergy: "Maximum pattern interrupt",
    desc: "Learning Insurgent turned up to 11. Maximum swagger. Hot takes and uncomfortable truths.",
    toneMix: "80% Confidently Irreverent / 20% Rebelliously Smart",
    positioning: {
      from: "A forgettable brand awareness ad that gets scrolled past in 0.3 seconds",
      to: "The pattern-interrupt that makes a VP of L&D stop mid-scroll and think 'who the hell said that?'",
    },
    voicePillars: [
      {
        name: "Unapologetically Confrontational",
        desc: "We name the broken thing out loud — the thing everyone in L&D knows but no vendor has the guts to say in an ad. We don't hint. We don't hedge.",
        insteadOf: "Improve your training outcomes with our award-winning platform.",
        say: "Your 40% completion rate isn't a training problem. It's a respect problem. You're boring your best people into leaving.",
      },
      {
        name: "Enemy-Forward",
        desc: "Every Provocateur ad has a villain — and it's never a competitor. It's the status quo. Death by PowerPoint. The compliance checkbox. The LMS that makes people dread Tuesdays.",
        insteadOf: "Docebo is a better alternative to legacy LMS platforms.",
        say: "Your LMS was built in 2012. Your workforce was not. Something has to give.",
      },
      {
        name: "Viscerally Specific",
        desc: "We describe the exact moment of pain — the Monday morning when no one shows up to the live training, the QBR where the CLO can't prove ROI. Specificity is what makes someone whisper 'this is about me.'",
        insteadOf: "Address learning challenges across your organization.",
        say: "Your new hires Google the answer because your onboarding takes 47 clicks to find it. That's not a people problem.",
      },
    ],
    toneSpectrum: [
      { context: "Awareness ads (cold audience)", mix: "80% Confrontational swagger / 15% Visceral specificity / 5% Brand resolve" },
      { context: "Pain-focused ads", mix: "60% Enemy-forward aggression / 30% Specific pain language / 10% Implied solution" },
      { context: "Scroll-stop hooks (first 5 words)", mix: "90% Pattern-interrupt / 10% Tribal identity callout" },
    ],
    examples: [
      { format: "LinkedIn Body Text", text: "Every year, enterprises waste $300B on training nobody finishes. Not because people are lazy. Because the training is lazy. Docebo built AI that makes learning addictive — not mandatory." },
      { format: "Creative Overlay (14 words max)", text: "Your LMS has a 40% completion rate. Your Netflix has 94%." },
      { format: "Headline (7 words max)", text: "Training people actually finish" },
      { format: "Social Post", text: "Hot take: If your training needs a mandatory attendance policy, your training is the problem. Not your people. @ us." },
      { format: "Ad Hook", text: "Stop training. Start addicting." },
    ],
    donts: [
      "No soft openings — if the first line doesn't provoke, rewrite it",
      "No feature lists — this voice sells the problem, not the solution",
      "No competitor mentions — the enemy is the status quo, not another vendor",
      "No hedging language ('might,' 'could,' 'consider') — this voice is certain",
      "No stock-photo energy — creative should feel like a poster, not a brochure",
      "No asking permission to be bold — The Provocateur doesn't apologize",
    ],
    principles: [
      { name: "The 1-Second Rule", desc: "If someone can't tell who this ad is for and why they should care within one second of scrolling, the ad fails." },
      { name: "Name The Pain, Not The Product", desc: "Earn attention by articulating pain better than the prospect can. Docebo appears as the implied answer, not the headline." },
      { name: "Make The Status Quo The Villain", desc: "We're not fighting Cornerstone or Absorb. We're fighting boredom, wasted budgets, and the 'good enough' mentality." },
      { name: "Discomfort Before Comfort", desc: "The best Provocateur ads make the viewer slightly uncomfortable — they see themselves in the pain — before offering a way forward." },
      { name: "Earn The Brand Search", desc: "The ultimate KPI is someone typing 'Docebo' into Google after seeing this ad. That only happens if we made them feel something." },
    ],
    taglines: [
      "Your training sucks. Fix it.",
      "Stop boring your best people.",
      "The LMS your people won't hate.",
      "Learning that doesn't need a mandate.",
    ],
    promise: "We promise to never run an ad that blends in. We promise to say the thing every L&D leader is thinking but no vendor will say out loud. We promise that every scroll-stop earns its interruption with truth, not tricks.",
  },
  {
    id: "trusted-advisor",
    label: "The Trusted Advisor",
    stage: "Warm — Consideration",
    coreEnergy: "Proof-led authority",
    desc: "Same intelligence, swagger softens into earned authority. Leads with proof — data, customer outcomes, logos.",
    toneMix: "60% Data-Driven Confidence / 25% Addictively Human / 15% Subtle Flex",
    positioning: {
      from: "Another vendor making promises in an ad",
      to: "The authority who shows receipts — proof-first, jargon-never, and so confident in the data that the swagger is quiet",
    },
    voicePillars: [
      {
        name: "Proof Over Promise",
        desc: "Every claim comes with evidence. Named customers, specific metrics, real timelines. The Trusted Advisor has earned the right to be believed because it never asks you to just trust it.",
        insteadOf: "Docebo drives measurable business results for enterprise organizations.",
        say: "Zoom cut onboarding time by 60%. La-Z-Boy scaled partner training to 14 countries. What would that look like for you?",
      },
      {
        name: "Quiet Confidence",
        desc: "Where The Provocateur shouts, The Trusted Advisor leans in. It sounds like the smartest person at the boardroom table — the one who speaks last, says the least, and moves the room. No exclamation points. No hype words. Just undeniable clarity.",
        insteadOf: "We're the #1 AI-powered learning platform revolutionizing enterprise training!",
        say: "3,800 enterprise customers. 40+ languages. One platform that connects learning to business outcomes. See why they stay.",
      },
      {
        name: "Consultative Generosity",
        desc: "The Trusted Advisor gives value before asking for anything. It teaches. It shares frameworks. It offers benchmarks the reader can use even if they never buy Docebo. This generosity is what earns the click, the download, and eventually the demo.",
        insteadOf: "Download our whitepaper to learn more about AI in learning.",
        say: "We analyzed 50M learning sessions to find what actually drives completion. Here's what we found — no form required.",
      },
    ],
    toneSpectrum: [
      { context: "Retargeting ads (warm audience)", mix: "70% Data-driven confidence / 20% Consultative generosity / 10% Subtle flex" },
      { context: "Case study ads", mix: "60% Proof-led storytelling / 25% Quiet confidence / 15% Outcome specificity" },
      { context: "Benchmark / thought leadership content", mix: "50% Generous teaching / 30% Data authority / 20% Earned swagger" },
    ],
    examples: [
      { format: "LinkedIn Body Text", text: "When Zoom needed to onboard 2,000 partners across 6 regions in 90 days, they didn't lower the bar. They used Docebo's AI to personalize every learning path — by role, by region, by product line. Result: 60% faster time-to-productivity. 3x partner certification rates." },
      { format: "Creative Overlay (14 words max)", text: "60% faster onboarding. 3x certification. One platform." },
      { format: "Headline (7 words max)", text: "See how Zoom scales learning" },
      { format: "Social Post", text: "We studied 50M learning sessions across 3,800 enterprise customers. The #1 predictor of training completion wasn't content quality. It was personalization. Here's the data." },
      { format: "Ad Hook", text: "The numbers speak. We just amplify them." },
    ],
    donts: [
      "No unsubstantiated claims — if you can't name the customer or cite the metric, don't run it",
      "No hype language ('revolutionary,' 'game-changing,' 'best-in-class') — the data does the bragging",
      "No aggressive pain language — this voice is past the pain; it's in the proof",
      "No gating valuable content behind long forms — generosity earns trust, friction kills it",
      "No generic 'enterprise' stats — always name a real company, a real number, a real timeline",
      "No exclamation points — confidence doesn't yell",
    ],
    principles: [
      { name: "Receipts, Not Claims", desc: "Every Trusted Advisor ad could survive a fact-check. Named customers, specific percentages, real timeframes. If it can't be verified, it can't be said." },
      { name: "Teach Before You Sell", desc: "The ad itself should deliver value. A benchmark, a framework, an insight the reader can use today. Generosity creates reciprocity." },
      { name: "Let The Customer Be The Hero", desc: "Docebo is the enabler, not the protagonist. Samsung's success story is about Samsung. Zoom's transformation is about Zoom. We built the stage; they performed." },
      { name: "Assume Intelligence", desc: "This audience has been researching platforms for weeks. Don't explain what an LMS is. Meet them where they are — comparing vendors, building business cases, seeking validation." },
      { name: "The Quiet Close", desc: "The CTA is never 'Buy Now.' It's 'See the data.' 'Read the case study.' 'Explore the platform.' Let curiosity do the closing." },
    ],
    taglines: [
      "Enterprise learning. Proven at scale.",
      "3,800 customers chose us. Here's why they stayed.",
      "Don't take our word for it. Take their numbers.",
      "The platform behind the proof.",
    ],
    promise: "We promise to never make a claim we can't back up. We promise to lead with what our customers achieved, not what our product does. We promise to be the vendor that makes a CLO look smart for choosing us — not just to their team, but to their board.",
  },
  {
    id: "empathetic-challenger",
    label: "The Empathetic Challenger",
    stage: "Pain-Aware — Mid-Funnel",
    coreEnergy: "Deep recognition + door to possibility",
    desc: "Speaks to the VP who knows training is broken but feels stuck. Deep empathy then pivots to possibility.",
    toneMix: "50% Empathetic Understanding / 30% Righteous Indignation / 20% Solution Optimism",
    positioning: {
      from: "A vendor that talks about your problems without understanding them",
      to: "The voice that describes your Monday morning so accurately you check if they've been reading your Slack — then shows you the exit",
    },
    voicePillars: [
      {
        name: "Deeply Seen",
        desc: "This voice knows the prospect's life — not just their job title. It knows they spent 3 hours last Tuesday manually pulling completion reports for a board deck that nobody read. The specificity of the empathy is what makes it land.",
        insteadOf: "We understand the challenges facing today's L&D leaders.",
        say: "You spent all week building that training report. Your CFO spent 30 seconds on it. We know the feeling. Let's make those 30 seconds count.",
      },
      {
        name: "Righteous On Their Behalf",
        desc: "The Empathetic Challenger is angry — but not at the prospect. It's angry at the systems, budgets, and legacy tools that have made their job harder than it needs to be. It validates the frustration without wallowing in it.",
        insteadOf: "Legacy LMS platforms can create workflow inefficiencies.",
        say: "You were hired to transform learning. Instead, you're fighting a platform that was built before the iPhone existed. That's not your failure. That's your tool's failure.",
      },
      {
        name: "The Door, Not The Push",
        desc: "After naming the pain with precision and validating it with warmth, this voice opens a door — but never shoves the prospect through it. The CTA feels like an invitation, not a demand. It says 'when you're ready' instead of 'act now.'",
        insteadOf: "Request a demo today to see how Docebo solves your training challenges.",
        say: "There's a version of your job where the data tells the story for you. Where completion rates make the board deck themselves. Whenever you're ready to see it — we'll be here.",
      },
    ],
    toneSpectrum: [
      { context: "Pain-aware ads (mid-funnel)", mix: "50% Deep empathy / 30% Righteous indignation (at the status quo) / 20% Possibility painting" },
      { context: "Persona-specific ads", mix: "60% 'I see you' specificity / 25% Validating frustration / 15% Gentle invitation" },
      { context: "Retargeting after engagement", mix: "40% Warm recognition / 35% Solution visualization / 25% Soft CTA" },
    ],
    examples: [
      { format: "LinkedIn Body Text", text: "You didn't get into L&D to fight with spreadsheets. You got into it because you believe learning changes lives. Somewhere between the compliance deadlines and the budget freezes, that mission got buried under admin work. Docebo gives you back the part of your job you actually love — building learning experiences that matter. And the analytics to prove they do." },
      { format: "Creative Overlay (14 words max)", text: "You were hired to transform learning. Not to babysit an LMS." },
      { format: "Headline (7 words max)", text: "Get back to the work that matters" },
      { format: "Social Post", text: "To every VP of L&D who's been asked 'what's the ROI of training?' and didn't have a dashboard to point to: it's not your fault. It's your platform's fault. And it's fixable." },
      { format: "Ad Hook", text: "Your job shouldn't feel this hard." },
    ],
    donts: [
      "No condescension — empathy that sounds like pity kills credibility instantly",
      "No blame on the prospect — frustration is always directed at systems, tools, and status quo, never at the person",
      "No urgency pressure ('limited time,' 'act now,' 'don't miss out') — this voice respects the buyer's timeline",
      "No feature-first language — lead with the feeling, not the functionality",
      "No generic pain ('challenges,' 'pain points,' 'inefficiencies') — name the SPECIFIC scenario",
      "No toxic positivity — don't minimize real frustration with 'but look on the bright side!'",
    ],
    principles: [
      { name: "Describe Their Monday", desc: "The most powerful empathy is specificity. Don't say 'your training could be better.' Say 'your best performer just spent 20 minutes looking for a course and gave up.'" },
      { name: "Validate Before You Solve", desc: "Acknowledge the frustration fully before pivoting to possibility. Skipping straight to the solution feels dismissive. Sitting in the pain for a beat earns the right to offer a way out." },
      { name: "Anger At The Right Target", desc: "The prospect isn't the problem. Their tools are. Their budget constraints are. The industry's low standards are. Direct the indignation outward — never inward at the reader." },
      { name: "Paint The After", desc: "Don't just remove pain — paint what life looks like on the other side. The board meeting where the data speaks for itself. The team that asks for MORE training." },
      { name: "Invitation, Not Extraction", desc: "The CTA should feel like a door opening, not a form demanding. 'See what's possible' over 'Request a demo.' 'Explore' over 'Submit.' Respect earns conversion." },
    ],
    taglines: [
      "You deserve better tools than this.",
      "L&D is hard enough. Your platform shouldn't make it harder.",
      "Built for the leaders who believe learning matters.",
      "The job you signed up for. Finally possible.",
    ],
    promise: "We promise to never pretend we don't know how hard your job is. We promise to name your frustrations with the precision of someone who's lived them. And we promise that when we show you what's possible, it won't be hype — it'll be a future you can actually see yourself in.",
  },
  {
    id: "insider",
    label: "The Insider",
    stage: "Niche — Use-Case Specific",
    coreEnergy: "Tribal language fluency",
    desc: "Speaks the tribal language of a specific persona. Drops exact terminology, references specific KPIs.",
    toneMix: "70% Rebelliously Smart / 20% Technical Precision / 10% Addictively Human",
    positioning: {
      from: "A platform ad that speaks to 'learning professionals' in generic terms",
      to: "The ad that uses your exact job title, your exact KPIs, and your exact Tuesday afternoon problem — so precisely that you check the targeting settings",
    },
    voicePillars: [
      {
        name: "Tribal Fluency",
        desc: "The Insider speaks each persona's native language. For a VP of Customer Education, it says 'time-to-value' and 'support ticket deflection.' For a Director of Partner Enablement, it says 'channel certification rates' and 'partner-sourced revenue.' The vocabulary IS the credibility.",
        insteadOf: "Docebo helps you train your external audiences more effectively.",
        say: "Your partners close 40% fewer deals without certification. Docebo cuts time-to-certification by half. Do the math on your channel revenue.",
      },
      {
        name: "KPI-Native",
        desc: "Every persona measures success differently. The Insider knows which dashboard they open first thing Monday morning. For Customer Success leaders, it's NRR and CSAT. For Sales Enablement, it's ramp time and quota attainment. We reference them the way a colleague would.",
        insteadOf: "Track learning metrics that matter to your business.",
        say: "Your NRR dropped 3 points last quarter. Your onboarding completion rate dropped 12 points the quarter before. Coincidence? Your CS team doesn't think so.",
      },
      {
        name: "Day-In-The-Life Precision",
        desc: "The Insider doesn't describe a persona's 'challenges.' It describes their 2pm on a Wednesday — the Slack message from the CRO asking why partner deal registration is down, the scramble to pull certification data from three different systems.",
        insteadOf: "Streamline your partner training operations.",
        say: "Your CRO just Slacked you asking why partner deal reg is down 15%. You know it's because 60% of new partners never finished certification. But you can't prove it because your data lives in three systems. Sound familiar?",
      },
    ],
    toneSpectrum: [
      { context: "Customer Education ads", mix: "70% KPI-native (NRR, CSAT, time-to-value) / 20% Tribal fluency / 10% Outcome proof" },
      { context: "Partner Enablement ads", mix: "60% Channel revenue language / 25% Day-in-the-life specificity / 15% Competitive urgency" },
      { context: "Sales Enablement ads", mix: "65% Ramp time and quota language / 25% CRO-pressure empathy / 10% Platform proof" },
      { context: "Employee L&D ads", mix: "55% Skill gap and transformation language / 30% CLO-to-board narrative / 15% AI differentiation" },
      { context: "Member Training ads", mix: "60% Certification revenue and compliance / 25% Scalability proof / 15% Learner experience" },
    ],
    examples: [
      { format: "LinkedIn Body Text", text: "If you're a VP of Customer Education, you already know: your onboarding program IS your retention strategy. Every customer who doesn't complete training is 3x more likely to churn in the first year. Docebo connects your education data to Gainsight, Salesforce, and your product analytics — so you can finally show the board that your academy isn't a cost center. It's a retention engine." },
      { format: "Creative Overlay (14 words max)", text: "Customer ed leaders: Your academy IS your retention strategy." },
      { format: "Headline (7 words max)", text: "Connect learning to NRR" },
      { format: "Social Post", text: "To every Director of Partner Enablement who's been asked to 'do more with less' while managing certifications across 14 countries in 6 languages: We see you. And we built this for exactly that." },
      { format: "Ad Hook", text: "Built for how you actually work." },
    ],
    donts: [
      "No generic audience language ('learning professionals,' 'business leaders,' 'organizations') — always name the SPECIFIC role",
      "No cross-persona ads — The Insider speaks to ONE persona per ad, never two",
      "No explaining basic concepts the persona already knows — they live this every day; don't patronize",
      "No Docebo-first language — the persona's world comes first, Docebo enters as the answer to their specific problem",
      "No made-up metrics — only reference KPIs the persona actually tracks in their real dashboards",
      "No industry-generic pain — the pain must be specific to their USE CASE (customer ed vs. partner enablement vs. sales enablement vs. employee L&D vs. member training)",
    ],
    principles: [
      { name: "One Persona Per Ad", desc: "The Insider never tries to speak to two audiences at once. A Customer Education ad and a Partner Enablement ad are completely different creatives, different copy, different KPIs, different pain. Specificity is the entire strategy." },
      { name: "Speak Their Dashboard", desc: "Reference the metrics they actually report on. Not 'engagement' in the abstract — but the exact metric name their platform uses. NRR for CS leaders. Quota attainment for Sales Enablement." },
      { name: "Describe The Slack Message", desc: "The most compelling pain isn't a business challenge — it's a notification. The Slack from the CRO. The email from the CHRO. The board deck request from the CFO. Put the reader inside a moment they've lived." },
      { name: "Integrations Are Identity", desc: "For this audience, the tools they use define their workflow. Mentioning Gainsight, Salesforce, Workday, or their AMS by name signals 'we live in your ecosystem.' Generic 'integrates with your tools' is invisible." },
      { name: "Show The Specific Dream", desc: "Don't paint a generic 'better future.' Paint THEIR better future. For a Customer Ed leader: 'Your quarterly deck builds itself from live data.' For a Partner Enablement VP: 'Your channel managers stop asking you for certification reports.'" },
    ],
    taglines: [
      "Built for customer education leaders who measure in NRR.",
      "Partner enablement that speaks revenue, not completions.",
      "Sales ramp time measured in weeks, not quarters.",
      "The learning platform that lives where you work.",
    ],
    promise: "We promise to never run an ad that could be for anyone. Every Insider ad is built for one persona, one use case, one set of KPIs, one version of Tuesday afternoon. If you can swap the job title and the ad still works, it's not an Insider ad.",
  },
];

/* ── Messaging Angle (8 angles from PDF, replacing old 12 categories) ── */
interface MessagingSubAngle {
  name: string;
  desc: string;
}

interface MessagingAngleOption {
  id: string;
  label: string;
  subAngles: MessagingSubAngle[];
}

const MESSAGING_ANGLE_OPTIONS: MessagingAngleOption[] = [
  {
    id: "problem",
    label: "Problem",
    subAngles: [
      { name: "Pain point agitation", desc: "Highlights a specific frustration your audience already feels" },
      { name: "Cost of inaction", desc: "Quantifies what doing nothing is costing them" },
      { name: "Risk/fear", desc: "Emphasizes what could go wrong without a solution (compliance, security, falling behind)" },
    ],
  },
  {
    id: "outcome",
    label: "Outcome",
    subAngles: [
      { name: "ROI / efficiency gain", desc: "Leads with measurable results (e.g., 'Cut onboarding time by 60%')" },
      { name: "Aspiration / vision", desc: "Paints a picture of the ideal future state" },
      { name: "Competitive advantage", desc: "Positions the product as a way to outperform peers" },
    ],
  },
  {
    id: "proof",
    label: "Proof",
    subAngles: [
      { name: "Social proof / authority", desc: "Leads with logos, customer names, or stats" },
      { name: "Case study / success story", desc: "Tells a specific customer's transformation story" },
      { name: "Industry validation", desc: "Analyst rankings, awards, G2 scores" },
    ],
  },
  {
    id: "differentiation",
    label: "Differentiation",
    subAngles: [
      { name: "Us vs. them", desc: "Direct or indirect comparison to alternatives or the status quo" },
      { name: "Category creation", desc: "Positions you as defining a new space entirely" },
      { name: "Contrarian / myth-busting", desc: "Challenges a widely held belief" },
    ],
  },
  {
    id: "persona",
    label: "Persona",
    subAngles: [
      { name: "Role-specific empathy", desc: "Speaks directly to a job title's unique challenges" },
      { name: "Day-in-the-life", desc: "Mirrors the daily workflow frustrations of the buyer" },
      { name: "Career / political capital", desc: "Appeals to what makes the buyer look good internally" },
    ],
  },
  {
    id: "urgency",
    label: "Urgency",
    subAngles: [
      { name: "Trend-riding", desc: "Ties the message to a current event or macro trend" },
      { name: "Seasonal / planning cycle", desc: "Aligns with budget season, Q1 planning, etc." },
      { name: "Limited offer", desc: "Scarcity-based (events, pilots, early access)" },
    ],
  },
  {
    id: "education",
    label: "Education",
    subAngles: [
      { name: "Thought leadership", desc: "Leads with an insight or framework, not a pitch" },
      { name: "How-to / tactical", desc: "Offers genuinely useful advice that naturally leads to the product" },
      { name: "Data / research", desc: "Leads with a surprising stat from original research" },
    ],
  },
  {
    id: "emotional",
    label: "Emotional",
    subAngles: [
      { name: "Belonging / community", desc: "'Join 10,000 modern finance teams'" },
      { name: "Frustration / humor", desc: "Uses relatable memes or sarcasm about broken workflows" },
      { name: "Pride / craft", desc: "Appeals to professionals who take their work seriously" },
    ],
  },
];

/* ── Hook Type (12 types from PDF, replacing old 5) ────────────── */
interface HookTypeOption {
  id: string;
  label: string;
  examples: string[];
}

const HOOK_TYPE_OPTIONS: HookTypeOption[] = [
  {
    id: "question",
    label: "Question",
    examples: ["Rhetorical question", "Diagnostic question", "Challenge question", "Curiosity question"],
  },
  {
    id: "statement",
    label: "Statement",
    examples: ["Bold claim", "Contrarian take", "Hot take / spicy opinion", "Prediction", "Confession / vulnerability"],
  },
  {
    id: "data-stat",
    label: "Data / Stat",
    examples: ["Surprising statistic", "Benchmark comparison", "Cost / loss quantification", "Speed / scale metric"],
  },
  {
    id: "story-native",
    label: "Story / Native",
    examples: ["Customer origin story", "Founder story", "Before/after snapshot", "Failure story", "Day-in-the-life vignette"],
  },
  {
    id: "pattern-interrupt",
    label: "Pattern Interrupt",
    examples: ["Unexpected visual", "Breaking the fourth wall", "Absurdist / humor", "Self-aware ad", "Anti-ad"],
  },
  {
    id: "social-proof",
    label: "Social Proof",
    examples: ["Name drop", "Logo bar", "Quote / testimonial lead", "Crowd signal", "Peer comparison"],
  },
  {
    id: "list-framework",
    label: "List / Framework",
    examples: ["Numbered list", "Playbook / blueprint", "Checklist", "Tier / ranking", "Mistake list"],
  },
  {
    id: "comparison-versus",
    label: "Comparison / Versus",
    examples: ["This vs. that", "Old way vs. new way", "With vs. without", "Expectation vs. reality"],
  },
  {
    id: "command-cta",
    label: "Command / Direct CTA",
    examples: ["Imperative opener", "Invitation", "Dare / challenge", "Time-bound nudge"],
  },
  {
    id: "identity-persona",
    label: "Identity / Persona",
    examples: ["Role callout", "Tribe signal", "Aspirational identity", "Anti-persona", "Stage-specific"],
  },
  {
    id: "curiosity-gap",
    label: "Curiosity Gap",
    examples: ["Incomplete reveal", "Teaser", "Insider knowledge", "Counterintuitive setup"],
  },
  {
    id: "timeliness",
    label: "Timeliness / News",
    examples: ["Trend hook", "Regulation / policy hook", "Event tie-in", "Breaking news format"],
  },
];

/* ── Ad Format (6 formats from PDF) ────────────────────────────── */
interface AdFormatOption {
  id: string;
  label: string;
  desc: string;
  /** Primary recommended dimensions */
  dimensions: { width: number; height: number; label: string };
  /** Aspect ratio as CSS value */
  aspectRatio: string;
  specs: string;
}

const AD_FORMAT_OPTIONS: AdFormatOption[] = [
  {
    id: "banner",
    label: "Banner",
    desc: "Single static image ad. The workhorse for brand awareness.",
    dimensions: { width: 1200, height: 1200, label: "1200×1200 (1:1)" },
    aspectRatio: "1 / 1",
    specs: "Intro: 150 chars. Headline: 70 chars max. Safe zone: center 1000×450px on horizontal.",
  },
  {
    id: "dynamic-word-gif",
    label: "Dynamic Word / GIF",
    desc: "Animated GIF or rotating text. Pattern interrupt that stops mid-scroll.",
    dimensions: { width: 1080, height: 1080, label: "1080×1080 (1:1)" },
    aspectRatio: "1 / 1",
    specs: "Motion: 3–6 seconds looping. One element changes, everything else holds steady.",
  },
  {
    id: "document",
    label: "Document",
    desc: "Multi-page swipeable content. Design each page like a social card.",
    dimensions: { width: 1080, height: 1080, label: "1080×1080 (1:1)" },
    aspectRatio: "1 / 1",
    specs: "5–10 pages sweet spot. Page 1 = hook. Pages 2-4 = insight. Final = CTA. No headline/CTA button on ad itself.",
  },
  {
    id: "carousel",
    label: "Carousel",
    desc: "Multi-card swipeable ad. Sequential storytelling with natural narrative momentum.",
    dimensions: { width: 1080, height: 1080, label: "1080×1080 (1:1)" },
    aspectRatio: "1 / 1",
    specs: "2–10 cards (5–6 sweet spot). Card headline: 45 chars. Design at 2x (2160×2160). CTA on last card only.",
  },
  {
    id: "article-newsletter",
    label: "Article / Newsletter",
    desc: "Sponsored LinkedIn-native article or newsletter. The long game.",
    dimensions: { width: 1200, height: 644, label: "1200×644 (1.91:1)" },
    aspectRatio: "1.91 / 1",
    specs: "Cover image: 1920×1080 or 1200×644. Intro text: 150 chars. CTA: 'Read' or 'Subscribe'.",
  },
  {
    id: "thought-leader",
    label: "Thought Leader",
    desc: "Boosted organic post from an employee's profile. Most authentic format on LinkedIn.",
    dimensions: { width: 1200, height: 1200, label: "1200×1200 (1:1)" },
    aspectRatio: "1 / 1",
    specs: "Source: existing organic post. Non-editable creative. Best for brand awareness that doesn't feel like it.",
  },
];

/* ══════════════════════════════════════════════════════════════════
   VARIANT INTERFACE — structured UTM fields
   ══════════════════════════════════════════════════════════════════ */

export interface Variant {
  variant_id: string;
  intro_text: string;
  headline: string;
  creative_overlay: string;
  visual_direction: string;
  cta_text: string;
  /** Messaging angle from the 8-angle taxonomy */
  messaging_angle: string;
  /** Messaging sub-angle (e.g. "Pain point agitation") */
  messaging_sub_angle: string;
  /** Hook type from the 12-type taxonomy */
  hook_type: string;
  /** Brand voice used for this variant */
  brand_voice: string;
  /** Visual style from the 7-style taxonomy */
  visual_style: string;
  /** Publishing platform */
  publishing_platform: string;
  /** Ad format from the 6-format taxonomy */
  ad_format: string;
  /** Composed UTM tag: [visual-style]_[ad-format]_[messaging-angle]_[hook-type]_[brand-voice]_[persona]_[variant-id] */
  utm_content_tag: string;
  gemini_image_prompt: string;
  full_ad_mockup_description: string;
  self_score: {
    voice_compliance: number;
    visual_brand_fit: number;
    differentiation: number;
    terminology: number;
  };
  /** Legacy compat — keep ad_type derived from messaging_angle */
  ad_type?: string;
}

/** Props passed to the canvas for format-aware rendering */
export interface CanvasRenderContext {
  ad_format: string;
  visual_style: string;
  publishing_platform: string;
  aspectRatio: string;
  dimensions: { width: number; height: number; label: string };
}

interface RefreshEngineProps {
  selectedCampaign: FatigueRow | null;
  onVariantsGenerated: (variants: Variant[], renderContext: CanvasRenderContext) => void;
}

/* ── Persona options (unchanged) ───────────────────────────────── */
const PERSONA_OPTIONS = [
  { id: "brand", label: "Brand", group: "Brand & Learning", desc: "Big bold statements. Broad appeal across all Docebo audiences." },
  { id: "ld-leader", label: "L&D Leader", group: "Brand & Learning", desc: "CLO, VP/Director of L&D. Learning ROI, workforce readiness, vendor consolidation." },
  { id: "pro-dev", label: "Professional Development", group: "Brand & Learning", desc: "Skills frameworks, Kirkpatrick measurement, career pathing." },
  { id: "hr-leader", label: "HR Leader", group: "Brand & Learning", desc: "CHRO, CPO, VP of HR. People strategy, HRIS integration, retention, compliance." },
  { id: "enablement", label: "Revenue & Enablement", group: "Go-to-market", desc: "CRO, CSO, Sales Enablement. Pipeline, win rates, Salesforce, rep ramp." },
  { id: "customer-ed", label: "Customer Education", group: "Go-to-market", desc: "Monetization, support deflection, time-to-value, NRR." },
  { id: "partnerships", label: "Partner Enablement", group: "Go-to-market", desc: "Partner certification, revenue attribution, ecosystem growth." },
  { id: "franchise", label: "Franchise & Frontline", group: "Operations & Compliance", desc: "Device policy, offline learning, brand consistency at scale." },
  { id: "compliance", label: "Compliance", group: "Operations & Compliance", desc: "Audit readiness, automated assignment, regulatory defensibility." },
  { id: "finance", label: "Finance", group: "Operations & Compliance", desc: "CFO, VP Finance. TCO transparency, ROI defensibility, AI spend governance." },
  { id: "it-leader", label: "IT", group: "Operations & Compliance", desc: "CIO, CTO, VP IT. Security, SSO, API architecture, AI governance." },
  { id: "operations", label: "Operations", group: "Operations & Compliance", desc: "COO, Head of Ops. Scalability, frontline readiness, time-to-productivity." },
];

const PERSONA_GROUPS = ["Brand & Learning", "Go-to-market", "Operations & Compliance"] as const;

/* ── Scoring standards ─────────────────────────────────────────── */
const SCORING_STANDARDS = [
  { key: "voice_compliance", label: "Voice", desc: "Docebo 'Learning Insurgent' tone — would this make a Cornerstone ad writer uncomfortable?" },
  { key: "visual_brand_fit", label: "Brand Fit", desc: "Uses Docebo signature elements: navy/purple, neon accents, floating UI overlays" },
  { key: "differentiation", label: "Differentiation", desc: "Could any competitor run this ad? If yes, score below 5" },
  { key: "terminology", label: "Terminology", desc: "Uses persona-specific language, avoids banned words (leverage, synergy, etc.)" },
];

/* ── Auto-prompt builder (updated for UTM taxonomy) ────────────── */
function buildAutoPrompt(
  persona: (typeof PERSONA_OPTIONS)[number],
  angle: MessagingAngleOption,
  subAngleIndex: number,
  hookType: HookTypeOption,
  brandVoice: BrandVoiceOption,
  visualStyle: VisualStyleOption,
  adFormat: AdFormatOption,
  platform: PlatformOption,
  campaign: FatigueRow | null,
): string {
  const subAngle = angle.subAngles[subAngleIndex];
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
    `═══ UTM DIMENSIONS ═══`,
    `Publishing Platform: ${platform.label}`,
    `Visual Style: ${visualStyle.label} — ${visualStyle.coreIdea}`,
    `Brand Voice: ${brandVoice.label} (${brandVoice.stage}) — ${brandVoice.toneMix}`,
    `Messaging Angle: ${angle.label} → ${subAngle.name}`,
    `  Context: ${subAngle.desc}`,
    `Hook Type: ${hookType.label} (e.g., ${hookType.examples.slice(0, 3).join(", ")})`,
    `Ad Format: ${adFormat.label} — ${adFormat.desc}`,
    `  Specs: ${adFormat.specs}`,
    `  Dimensions: ${adFormat.dimensions.label}`,
    "",
    `═══ TARGET PERSONA ═══`,
    `${persona.label}: ${persona.desc}`,
    "",
    `═══ BRAND VOICE GUIDE: ${brandVoice.label.toUpperCase()} ═══`,
    ...(brandVoice.positioning
      ? [`From: ${brandVoice.positioning.from}`, `To: ${brandVoice.positioning.to}`, ``]
      : [`Tone mix: ${brandVoice.toneMix}`, ``]),
    ...(brandVoice.voicePillars
      ? brandVoice.voicePillars.flatMap((p) => [
          `Voice Pillar — ${p.name}: ${p.desc}`,
          `  Instead of: "${p.insteadOf}"`,
          `  Say: "${p.say}"`,
        ])
      : []),
    ...(brandVoice.toneSpectrum
      ? [``, `Tone Spectrum:`, ...brandVoice.toneSpectrum.map((t) => `  ${t.context}: ${t.mix}`)]
      : []),
    ...(brandVoice.examples
      ? [``, `Voice Examples:`, ...brandVoice.examples.map((e) => `  ${e.format}: "${e.text}"`)]
      : []),
    ...(brandVoice.donts
      ? [``, `Voice Don'ts:`, ...brandVoice.donts.map((d) => `  - ${d}`)]
      : []),
    ...(brandVoice.principles
      ? [``, `Voice Principles:`, ...brandVoice.principles.map((p) => `  - ${p.name}: ${p.desc}`)]
      : []),
    ...(brandVoice.promise ? [``, `Brand Promise: ${brandVoice.promise}`] : []),
    ``,
    `═══ GENERATION INSTRUCTIONS ═══`,
    `Generate 5 ad variants using these exact UTM dimensions. Each variant must:`,
    `- Use the "${brandVoice.label}" brand voice with tone mix: ${brandVoice.toneMix}`,
    `- Apply the "${visualStyle.label}" visual style in visual_direction and gemini_image_prompt`,
    `- Lead with the "${angle.label} → ${subAngle.name}" messaging angle`,
    `- Each variant uses a DIFFERENT hook_type from the 12-type taxonomy`,
    `- Target the "${platform.label}" platform — adapt copy length, tone, and visual direction accordingly`,
    `- Follow "${adFormat.label}" format specs: ${adFormat.specs}`,
    `- Compose utm_content_tag as: [visual-style]_[ad-format]_[messaging-angle]_[hook-type]_[brand-voice]_[persona]_[variant-id]`,
    `- Speak directly to the ${persona.label} persona's pain points and language`,
    `- Self-score each variant (min 7/10 each dimension)`,
  );

  return lines.join("\n");
}

/* ── Flow steps ──────────────────────────────────────────────────── */
type FlowStep = "select" | "prompt" | "styles" | "generating" | "results";

export default function RefreshEngine({
  selectedCampaign,
  onVariantsGenerated,
}: RefreshEngineProps) {
  // Flow state
  const [step, setStep] = useState<FlowStep>("select");

  // Selection state — Ad Ingredients (all selections in one step)
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [selectedAngle, setSelectedAngle] = useState<string | null>(null);
  const [selectedSubAngleIndex, setSelectedSubAngleIndex] = useState<number>(0);

  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [selectedHookType, setSelectedHookType] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [selectedVisualStyle, setSelectedVisualStyle] = useState<string | null>(null);

  // Prompt state
  const [editablePrompt, setEditablePrompt] = useState("");

  // Generation state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawOutput, setRawOutput] = useState<string | null>(null);
  const [generatedVariants, setGeneratedVariants] = useState<Variant[] | null>(null);

  // Auto-default platform from campaign
  useEffect(() => {
    if (selectedCampaign?.platform && !selectedPlatform) {
      const plat = selectedCampaign.platform.toLowerCase();
      const match = PLATFORM_OPTIONS.find(
        (p) => plat.includes(p.id) || p.id.includes(plat)
      );
      if (match) setSelectedPlatform(match.id);
    }
  }, [selectedCampaign, selectedPlatform]);

  /* ── Derived data ─────────────────────────────────────────── */
  const persona = PERSONA_OPTIONS.find((p) => p.id === selectedPersona);
  const angle = MESSAGING_ANGLE_OPTIONS.find((a) => a.id === selectedAngle);
  const platform = PLATFORM_OPTIONS.find((p) => p.id === selectedPlatform);
  const voice = BRAND_VOICE_OPTIONS.find((v) => v.id === selectedVoice);
  const hookType = HOOK_TYPE_OPTIONS.find((h) => h.id === selectedHookType);
  const adFormat = AD_FORMAT_OPTIONS.find((f) => f.id === selectedFormat);
  const visualStyle = VISUAL_STYLE_OPTIONS.find((s) => s.id === selectedVisualStyle);

  const canGeneratePrompt = selectedPersona && selectedAngle && platform && voice && hookType && adFormat && visualStyle;

  /* ── Auto-generate prompt when all selections are made ──── */
  function handleGeneratePrompt() {
    if (!persona || !angle || !platform || !voice || !hookType || !adFormat || !visualStyle) return;
    const prompt = buildAutoPrompt(
      persona, angle, selectedSubAngleIndex, hookType, voice, visualStyle, adFormat, platform, selectedCampaign,
    );
    setEditablePrompt(prompt);
    setStep("prompt");
  }

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
        messaging_angle: selectedAngle,
        messaging_sub_angle: angle?.subAngles[selectedSubAngleIndex]?.name,
        hook_type: selectedHookType,
        brand_voice: selectedVoice,
        visual_style: selectedVisualStyle,
        ad_format: selectedFormat,
        publishing_platform: selectedPlatform,
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
        const fmt = AD_FORMAT_OPTIONS.find((f) => f.id === selectedFormat)!;
        onVariantsGenerated(data.variants, {
          ad_format: selectedFormat!,
          visual_style: selectedVisualStyle!,
          publishing_platform: selectedPlatform!,
          aspectRatio: fmt.aspectRatio,
          dimensions: fmt.dimensions,
        });
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
    setSelectedAngle(null);
    setSelectedSubAngleIndex(0);
    setSelectedPlatform(null);
    setSelectedVoice(null);
    setSelectedHookType(null);
    setSelectedFormat(null);
    setSelectedVisualStyle(null);
    setEditablePrompt("");
    setError(null);
    setRawOutput(null);
    setGeneratedVariants(null);
  }

  /* ── Step indicator ───────────────────────────────────────── */
  const steps: { key: FlowStep; label: string }[] = [
    { key: "select", label: "Ad Ingredients" },
    { key: "prompt", label: "Prompt" },
    { key: "generating", label: "Generate" },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-docebo-border">
        <h2 className="text-base font-semibold text-white font-headline flex items-center gap-2 tracking-tight">
          <span className="w-2 h-2 rounded-full bg-docebo-bright-green pulse-glow" />
          Creative Refresh Engine
        </h2>
        <p className="text-xs text-docebo-muted mt-0.5">
          AI-powered creative generation
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
                  <div className={`w-4 h-px ${isDone ? "bg-docebo-blue/50" : "bg-docebo-border"}`} />
                )}
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded ${
                    isActive
                      ? "bg-docebo-blue/20 text-docebo-light-blue"
                      : isDone
                        ? "bg-docebo-card text-docebo-muted"
                        : "text-docebo-muted/50"
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
        <div className="mx-4 mt-3 px-3 py-2 rounded-lg bg-docebo-pink/8 border border-docebo-pink/20 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-docebo-pink font-medium">
              Refreshing: {selectedCampaign.campaign_name.slice(0, 50)}...
            </span>
            <span className="text-docebo-pink/80 font-mono">
              {selectedCampaign.status} ({selectedCampaign.fatigue_score})
            </span>
          </div>
          <p className="text-docebo-pink/50 mt-1">
            {selectedCampaign.platform} | CTR dropped from{" "}
            {selectedCampaign.baseline_ctr}% to {selectedCampaign.current_ctr}%
          </p>
        </div>
      )}

      {/* ═══ STEP 1: CHOOSE YOUR AD INGREDIENTS ═══ */}
      {step === "select" && (
        <div className="flex-1 overflow-auto px-4 py-3 space-y-4">
          {/* Persona picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-docebo-muted">
                Target Persona
              </p>
              {selectedPersona && (
                <button
                  onClick={() => setSelectedPersona(null)}
                  className="text-[10px] text-docebo-muted/50 hover:text-docebo-muted transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-3">
              {PERSONA_GROUPS.map((group) => (
                <div key={group}>
                  <p className="text-[10px] uppercase tracking-wider text-docebo-muted/60 font-mono mb-1.5">
                    {group}
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {PERSONA_OPTIONS.filter((p) => p.group === group).map((p) => {
                      const active = selectedPersona === p.id;
                      const isBrand = p.id === "brand";
                      return (
                        <button
                          key={p.id}
                          onClick={() => setSelectedPersona(active ? null : p.id)}
                          className={`text-left px-2.5 py-2 rounded-lg border transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-docebo-blue ${
                            isBrand && !active
                              ? "col-span-2 border-dashed border-docebo-electric-purple/30 bg-docebo-electric-purple/5 hover:border-docebo-electric-purple/50 hover:bg-docebo-electric-purple/10"
                              : ""
                          } ${
                            active
                              ? isBrand
                                ? "col-span-2 border-docebo-electric-purple/50 bg-docebo-electric-purple/15 shadow-[0_0_8px_rgba(126,46,233,0.15)]"
                                : "border-docebo-blue/50 bg-docebo-blue/15 shadow-[0_0_8px_rgba(0,87,255,0.15)]"
                              : !isBrand
                                ? "border-docebo-border bg-docebo-card/30 hover:border-docebo-muted/40 hover:bg-docebo-card/60"
                                : ""
                          }`}
                        >
                          <p className={`text-xs font-medium ${
                            active
                              ? isBrand ? "text-docebo-purple" : "text-docebo-light-blue"
                              : "text-white/80"
                          }`}>
                            {p.label}
                          </p>
                          <p className="text-[10px] text-docebo-muted mt-0.5 leading-snug">
                            {p.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Messaging Angle picker */}
          <div>
            <p className="text-xs font-medium text-docebo-muted mb-2">
              Messaging Angle
            </p>
            <div className="space-y-1">
              {MESSAGING_ANGLE_OPTIONS.map((a) => {
                const isExpanded = selectedAngle === a.id;
                return (
                  <div key={a.id}>
                    <button
                      onClick={() => {
                        if (isExpanded) {
                          setSelectedAngle(null);
                          setSelectedSubAngleIndex(0);
                        } else {
                          setSelectedAngle(a.id);
                          setSelectedSubAngleIndex(0);
                        }
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg border transition-all cursor-pointer ${
                        isExpanded
                          ? "border-docebo-blue/50 bg-docebo-blue/10"
                          : "border-docebo-border bg-docebo-card/30 hover:border-docebo-muted/40 hover:bg-docebo-card/60"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className={`text-xs font-medium ${isExpanded ? "text-docebo-light-blue" : "text-white/80"}`}>
                          {a.label}
                        </p>
                        <span className={`text-[10px] ${isExpanded ? "text-docebo-blue" : "text-docebo-muted/50"}`}>
                          {a.subAngles.length} angles {isExpanded ? "▼" : "▶"}
                        </span>
                      </div>
                    </button>

                    {/* Sub-angles */}
                    {isExpanded && (
                      <div className="ml-3 mt-1 space-y-1">
                        {a.subAngles.map((sub, si) => {
                          const subActive = selectedSubAngleIndex === si;
                          return (
                            <button
                              key={si}
                              onClick={() => setSelectedSubAngleIndex(si)}
                              className={`w-full text-left px-2.5 py-1.5 rounded border transition-all cursor-pointer ${
                                subActive
                                  ? "border-docebo-blue/40 bg-docebo-blue/10"
                                  : "border-docebo-border/30 bg-docebo-card/20 hover:bg-docebo-card/40"
                              }`}
                            >
                              <p className={`text-[11px] font-medium ${subActive ? "text-docebo-light-blue" : "text-white/80"}`}>
                                {sub.name}
                              </p>
                              <p className="text-[10px] text-docebo-muted mt-0.5 leading-snug">
                                {sub.desc}
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

          {/* Platform */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-docebo-muted mb-1.5 font-mono">Publishing Platform</p>
            <div className="grid grid-cols-4 gap-1.5">
              {PLATFORM_OPTIONS.map((p) => {
                const active = selectedPlatform === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlatform(active ? null : p.id)}
                    className={`px-2 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                      active
                        ? "border-docebo-blue/50 bg-docebo-blue/15 text-docebo-light-blue"
                        : "border-docebo-border bg-docebo-card/30 text-docebo-muted hover:border-docebo-muted/40"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brand Voice */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-docebo-muted mb-1.5 font-mono">Brand Voice</p>
            <div className="space-y-1">
              {BRAND_VOICE_OPTIONS.map((v) => {
                const active = selectedVoice === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVoice(active ? null : v.id)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg border transition-all cursor-pointer ${
                      active
                        ? "border-docebo-electric-purple/50 bg-docebo-electric-purple/10"
                        : "border-docebo-border bg-docebo-card/30 hover:border-docebo-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-medium ${active ? "text-docebo-purple" : "text-white/80"}`}>
                        {v.label}
                      </p>
                      <span className={`text-[10px] ${active ? "text-docebo-electric-purple" : "text-docebo-muted/50"}`}>
                        {v.stage}
                      </span>
                    </div>
                    <p className="text-[10px] text-docebo-muted mt-0.5">{v.coreEnergy}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hook Type */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-docebo-muted mb-1.5 font-mono">Hook Type</p>
            <div className="grid grid-cols-2 gap-1">
              {HOOK_TYPE_OPTIONS.map((h) => {
                const active = selectedHookType === h.id;
                return (
                  <button
                    key={h.id}
                    onClick={() => setSelectedHookType(active ? null : h.id)}
                    className={`text-left px-2 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      active
                        ? "border-docebo-blue/50 bg-docebo-blue/10"
                        : "border-docebo-border bg-docebo-card/30 hover:border-docebo-muted/40"
                    }`}
                  >
                    <p className={`text-[11px] font-medium ${active ? "text-docebo-light-blue" : "text-white/80"}`}>
                      {h.label}
                    </p>
                    <p className="text-[9px] text-docebo-muted/50 mt-0.5 truncate">
                      {h.examples[0]}, {h.examples[1]}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ad Format */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-docebo-muted mb-1.5 font-mono">Ad Format</p>
            <div className="space-y-1">
              {AD_FORMAT_OPTIONS.map((f) => {
                const active = selectedFormat === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFormat(active ? null : f.id)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg border transition-all cursor-pointer ${
                      active
                        ? "border-docebo-bright-green/50 bg-docebo-bright-green/10"
                        : "border-docebo-border bg-docebo-card/30 hover:border-docebo-muted/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-medium ${active ? "text-docebo-neon-green" : "text-white/80"}`}>
                        {f.label}
                      </p>
                      <span className={`text-[10px] font-mono ${active ? "text-docebo-bright-green" : "text-docebo-muted/50"}`}>
                        {f.dimensions.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-docebo-muted mt-0.5">{f.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Visual Style */}
          <div>
            <p className="text-[10px] uppercase tracking-wider text-docebo-muted mb-1.5 font-mono">Visual Style</p>
            <div className="space-y-1">
              {VISUAL_STYLE_OPTIONS.map((s) => {
                const active = selectedVisualStyle === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedVisualStyle(active ? null : s.id)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg border transition-all cursor-pointer ${
                      active
                        ? "border-docebo-pink/50 bg-docebo-pink/10"
                        : "border-docebo-border bg-docebo-card/30 hover:border-docebo-muted/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-md border border-docebo-border shrink-0"
                        style={{ background: s.swatch }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium ${active ? "text-docebo-pink" : "text-white/80"}`}>
                          {s.label}
                        </p>
                        <p className="text-[10px] text-docebo-muted mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══ STEP 3: PROMPT PREVIEW & EDIT ═══ */}
      {step === "prompt" && (
        <div className="flex-1 overflow-auto px-4 py-3 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-docebo-muted">
              Auto-generated prompt
            </p>
            <button
              onClick={() => setStep("select")}
              className="text-[10px] text-docebo-muted/50 hover:text-docebo-muted transition-colors"
            >
              ← Back
            </button>
          </div>

          {/* Editable prompt */}
          <textarea
            value={editablePrompt}
            onChange={(e) => setEditablePrompt(e.target.value)}
            rows={14}
            className="w-full px-3 py-2 rounded-lg bg-docebo-card border border-docebo-border text-xs text-white/80 font-mono leading-relaxed focus:outline-none focus:border-docebo-blue/50 resize-none"
          />

          {/* Scoring standards */}
          <div className="rounded-lg bg-docebo-card/50 border border-docebo-border p-3">
            <p className="text-[10px] font-medium text-docebo-muted uppercase tracking-wider mb-2 font-mono">
              Scoring standards (each variant scored 1-10, minimum 7)
            </p>
            <div className="space-y-1.5">
              {SCORING_STANDARDS.map((s) => (
                <div key={s.key} className="flex items-start gap-2">
                  <span className="text-[10px] font-mono text-docebo-blue w-20 shrink-0 pt-0.5">
                    {s.label}
                  </span>
                  <span className="text-[10px] text-docebo-muted leading-snug">
                    {s.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Selection summary */}
          <div className="rounded-lg bg-docebo-card/30 border border-docebo-border/30 p-2">
            <div className="flex flex-wrap gap-1.5 text-[10px]">
              <span className="px-1.5 py-0.5 rounded bg-docebo-blue/20 text-docebo-light-blue">{platform?.label}</span>
              <span className="px-1.5 py-0.5 rounded bg-docebo-electric-purple/20 text-docebo-purple">{persona?.label}</span>
              <span className="px-1.5 py-0.5 rounded bg-docebo-pink/20 text-docebo-pink">{visualStyle?.label}</span>
              <span className="px-1.5 py-0.5 rounded bg-docebo-bright-green/15 text-docebo-bright-green">{adFormat?.label}</span>
              <span className="px-1.5 py-0.5 rounded bg-docebo-magenta/15 text-docebo-purple">{voice?.label}</span>
              <span className="px-1.5 py-0.5 rounded bg-docebo-navy/20 text-docebo-light-blue">{hookType?.label}</span>
              <span className="px-1.5 py-0.5 rounded bg-docebo-card text-docebo-muted">
                {angle?.label} → {angle?.subAngles[selectedSubAngleIndex]?.name}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ═══ STEP 4: GENERATING ═══ */}
      {step === "generating" && loading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-docebo-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-docebo-muted">Generating 5 creative variants...</p>
            <div className="mt-2 flex flex-wrap gap-1.5 justify-center text-[10px]">
              <span className="px-1.5 py-0.5 rounded bg-docebo-blue/20 text-docebo-light-blue">{platform?.label}</span>
              <span className="px-1.5 py-0.5 rounded bg-docebo-pink/20 text-docebo-pink">{visualStyle?.label}</span>
              <span className="px-1.5 py-0.5 rounded bg-docebo-bright-green/15 text-docebo-bright-green">{adFormat?.label}</span>
              <span className="px-1.5 py-0.5 rounded bg-docebo-electric-purple/15 text-docebo-purple">{voice?.label}</span>
            </div>
            <div className="mt-3 space-y-0.5">
              {SCORING_STANDARDS.map((s) => (
                <p key={s.key} className="text-[10px] text-docebo-muted/50 font-mono">
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
          {error && (
            <div className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
              {error}
            </div>
          )}

          {rawOutput && (
            <div>
              <p className="text-xs text-docebo-muted mb-2">Raw output (JSON parsing failed):</p>
              <pre className="text-xs text-white/80 whitespace-pre-wrap bg-docebo-card/50 rounded-lg p-3 border border-docebo-border">
                {rawOutput}
              </pre>
            </div>
          )}

          {generatedVariants && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-docebo-muted">
                  {generatedVariants.length} variants generated
                </p>
                <button
                  onClick={handleReset}
                  className="text-xs text-docebo-blue hover:text-docebo-light-blue"
                >
                  New request
                </button>
              </div>
              {generatedVariants.map((v, i) => (
                <div
                  key={v.variant_id || i}
                  className="rounded-lg bg-docebo-card/50 border border-docebo-border p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-docebo-blue">
                      {v.variant_id}
                    </span>
                    <div className="flex gap-1.5 flex-wrap">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-docebo-electric-purple/20 text-docebo-purple">
                        {v.messaging_angle || v.ad_type}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-docebo-navy/20 text-docebo-light-blue">
                        {v.hook_type}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-docebo-magenta/15 text-docebo-purple">
                        {v.brand_voice}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-docebo-pink/15 text-docebo-pink">
                        {v.visual_style}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-white font-semibold">{v.headline}</h3>
                  <p className="text-sm text-white/70">{v.creative_overlay}</p>
                  <p className="text-xs text-docebo-muted">{v.intro_text}</p>
                  <div className="flex items-center gap-3 pt-1 border-t border-docebo-border/30">
                    <span className="text-xs text-docebo-muted">
                      Voice: <span className="text-docebo-bright-green font-mono">{v.self_score.voice_compliance}</span>
                    </span>
                    <span className="text-xs text-docebo-muted">
                      Brand: <span className="text-docebo-bright-green font-mono">{v.self_score.visual_brand_fit}</span>
                    </span>
                    <span className="text-xs text-docebo-muted">
                      Diff: <span className="text-docebo-bright-green font-mono">{v.self_score.differentiation}</span>
                    </span>
                    <span className="text-xs text-docebo-muted">
                      Term: <span className="text-docebo-bright-green font-mono">{v.self_score.terminology}</span>
                    </span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* ═══ BOTTOM ACTION BAR ═══ */}
      <div className="p-4 border-t border-docebo-border">
        {step === "select" && (
          <button
            onClick={handleGeneratePrompt}
            disabled={!canGeneratePrompt}
            className="w-full px-4 py-2.5 rounded-lg bg-docebo-blue text-white text-sm font-medium hover:bg-docebo-light-blue disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {canGeneratePrompt
              ? "Generate prompt →"
              : `Select: ${[
                  !selectedPersona && "persona",
                  !selectedAngle && "messaging angle",
                  !selectedPlatform && "platform",
                  !selectedVoice && "voice",
                  !selectedHookType && "hook",
                  !selectedFormat && "format",
                  !selectedVisualStyle && "visual style",
                ].filter(Boolean).join(", ")}`
            }
          </button>
        )}

        {step === "prompt" && (
          <button
            onClick={handleGenerate}
            disabled={!editablePrompt.trim()}
            className="w-full px-4 py-2.5 rounded-lg bg-docebo-bright-green text-docebo-midnight text-sm font-semibold hover:bg-docebo-neon-green disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Generate 5 variants
          </button>
        )}

        {step === "results" && !error && !generatedVariants && !rawOutput && (
          <button
            onClick={handleReset}
            className="w-full px-4 py-2.5 rounded-lg bg-docebo-card text-white text-sm font-medium hover:bg-docebo-border transition-colors"
          >
            Start over
          </button>
        )}
      </div>
    </div>
  );
}
