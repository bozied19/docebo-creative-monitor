/**
 * Landing Page URL builder
 *
 * Composes a Lovable.dev landing page URL from a variant, parameterized so the
 * LP can render evidence matching the ad. The base URL is read from
 * NEXT_PUBLIC_LOVABLE_LP_BASE_URL — set it in .env.local to the deployed
 * Lovable preview / publish URL (NOT the lovable.dev/projects/<id> editor URL).
 *
 * Empty / missing base URL → returns null. Callers should hide the link.
 */

import type { Variant } from "@/components/creative/refresh-engine";

export interface LpUrlInputs {
  persona: string;
  messaging_angle?: string;
  hook_type?: string;
  competitive_switch?: string;
  use_case?: string;
  utm_content?: string;
}

/** Trim a potential trailing slash so we don't produce double-slashes. */
function normalizeBase(raw: string): string {
  return raw.replace(/\/+$/, "");
}

/**
 * Compose the LP URL from raw inputs. Base URL is read from
 * NEXT_PUBLIC_LOVABLE_LP_BASE_URL (Next.js inlines this at build time, so it
 * works in client components).
 */
export function buildLpUrl(inputs: LpUrlInputs): string | null {
  const base = process.env.NEXT_PUBLIC_LOVABLE_LP_BASE_URL?.trim();
  if (!base) return null;

  const params = new URLSearchParams();
  params.set("persona", inputs.persona);
  if (inputs.messaging_angle) params.set("messaging_angle", inputs.messaging_angle);
  if (inputs.hook_type) params.set("hook_type", inputs.hook_type);
  if (inputs.competitive_switch) params.set("competitive_switch", inputs.competitive_switch);
  if (inputs.use_case) params.set("use_case", inputs.use_case);
  if (inputs.utm_content) params.set("utm_content", inputs.utm_content);

  return `${normalizeBase(base)}/?${params.toString()}`;
}

/** Convenience wrapper: derive inputs from a Variant. */
export function buildLpUrlForVariant(variant: Variant): string | null {
  if (!variant.persona) return null;
  return buildLpUrl({
    persona: variant.persona,
    messaging_angle: variant.messaging_angle,
    hook_type: variant.hook_type,
    utm_content: variant.utm_content_tag,
  });
}

/** True when the env var is set. UI can use this to hide the link entirely
 *  (vs render a disabled button) when no LP base URL has been configured. */
export function isLpUrlConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_LOVABLE_LP_BASE_URL?.trim());
}
