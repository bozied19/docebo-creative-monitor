"use client";

import type { Ref } from "react";
import type { Variant } from "../refresh-engine";
import type { ThemeConfig } from "../ad-canvas";
import {
  CoBrandPartner,
  DataAsPower,
  DULiveSpeakers,
  RebelliousEditorial,
  WebinarNavyPink,
  type PhoenixTemplateProps,
} from "./Templates";

interface PhoenixRendererProps {
  variant: Variant;
  theme: ThemeConfig;
  mockupRef?: Ref<HTMLDivElement>;
}

type TemplateComponent = (props: PhoenixTemplateProps) => React.ReactElement;

const VISUAL_STYLE_TEMPLATE: Record<string, TemplateComponent> = {
  "data-as-power": DataAsPower,
  "rebellious-editorial": RebelliousEditorial,
  "digital-rebellion": RebelliousEditorial,
  "human-contrast": DULiveSpeakers,
  "minimal-authority": CoBrandPartner,
  "neon-intelligence": WebinarNavyPink,
  "system-ui": WebinarNavyPink,
};

function pickTemplate(
  visualStyle: string | undefined,
  theme: ThemeConfig,
): TemplateComponent {
  if (theme.layout === "cobrand") return CoBrandPartner;
  if (visualStyle && VISUAL_STYLE_TEMPLATE[visualStyle]) {
    return VISUAL_STYLE_TEMPLATE[visualStyle];
  }
  return WebinarNavyPink;
}

function buildBaseProps(variant: Variant): PhoenixTemplateProps {
  const frameZero = variant.animation_frames?.[0];
  return {
    overlay: frameZero?.overlay_text || variant.creative_overlay,
    subtext: variant.overlay_subtext,
    cta: variant.cta_text,
    stat: frameZero?.stat_value || variant.stat_value,
  };
}

function buildCardProps(
  variant: Variant,
  card: NonNullable<Variant["cards"]>[number],
): PhoenixTemplateProps {
  return {
    overlay: card.card_overlay,
    subtext: card.card_subtext,
    cta: card.card_cta || variant.cta_text,
    stat: variant.stat_value,
  };
}

export function PhoenixRenderer({
  variant,
  theme,
  mockupRef,
}: PhoenixRendererProps) {
  const Template = pickTemplate(variant.visual_style, theme);
  const cards = variant.cards?.length ? variant.cards : null;

  return (
    <div
      ref={mockupRef}
      className="phx-base"
      style={{ display: "flex", flexDirection: "column", gap: 12 }}
    >
      {cards
        ? cards.map((card, i) => (
            <PhoenixFrame key={i}>
              <Template {...buildCardProps(variant, card)} />
            </PhoenixFrame>
          ))
        : (
            <PhoenixFrame>
              <Template {...buildBaseProps(variant)} />
            </PhoenixFrame>
          )}
    </div>
  );
}

/* Wraps a 1080x1080 absolute-positioned scene and scales it to the
   container's actual width using container-query units. The inner div
   stays 1080×1080 in design coordinates so all px values are stable. */
function PhoenixFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "1 / 1",
        position: "relative",
        overflow: "hidden",
        borderRadius: 8,
        containerType: "inline-size",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1080,
          height: 1080,
          transformOrigin: "top left",
          transform: "scale(calc(100cqw / 1080px))",
        }}
      >
        {children}
      </div>
    </div>
  );
}
