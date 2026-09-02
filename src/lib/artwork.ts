/**
 * Single source of truth for every large art asset in the mural.
 *
 * Placeholder-first contract: while `src` is null, ArtSlot renders a
 * gradient placeholder whose FIRST and LAST color stops equal `edgeTop`
 * and `edgeBottom` — the same seam colors the real art must fade to.
 * Seam-stitching is therefore verifiable before any artwork exists, and
 * dropping in a finished asset is a one-line change (`src: "/art/…"`).
 *
 * Edge hexes are mirrored as CSS vars in globals.css (--sky, --wall-cream,
 * --invite-cream, --maroon, --maroon-deep, --gold-sun, --cream-emboss);
 * if a generated asset's fade drifts, correct it here AND there together.
 */
export type ArtSlotDef = {
  src: string | null;
  width: number;
  height: number;
  edgeTop: string;
  edgeBottom: string;
  placeholder: string;
  alt: string;
};

export type ArtSlotName =
  | "templePan"
  | "gatewayWall"
  | "pillarBorderLeft"
  | "pillarBorderRight"
  | "garlandScene"
  | "storyOrnaments"
  | "venueShowcase"
  | "rsvpTemples"
  | "countdownGateway";

export const ART: Record<ArtSlotName, ArtSlotDef> = {
  templePan: {
    // v1 "/art/temple-pan.webp" = original photo pan
    // v2 "/art/temple-pan-v2.webp" = temple.png cutout on flat sky
    // v3 "/art/temple-pan-v3.webp" = temple-pan-latest photo, sky extended
    // all same dims/edges — swap src anytime to revert
    src: "/art/temple-pan-v3.webp",
    width: 1440,
    height: 2346,
    edgeTop: "#7fabde",
    edgeBottom: "#f6ebd3",
    placeholder:
      "linear-gradient(180deg, #8ec5ec 0%, #8ec5ec 15%, #a9c87a 30%, #7fa24e 45%, #c9972c 62%, #9c6a2a 80%, #f6ebd3 100%)",
    alt: "Tall gopuram temple flanked by green trees under a blue sky",
  },
  gatewayWall: {
    src: "/art/gateway-wall.webp",
    width: 1535,
    height: 1024,
    edgeTop: "#f6ebd3",
    edgeBottom: "#fbf3e0",
    placeholder:
      "linear-gradient(180deg, #f6ebd3 0%, #e8a33c 18%, #d5b8de 48%, #b9d8c8 70%, #fbf3e0 100%)",
    alt: "Marigold-garlanded wall with an ornate pastel gateway arch",
  },
  pillarBorderLeft: {
    src: "/art/pillar-border-gold.webp",
    width: 202,
    height: 488,
    edgeTop: "transparent",
    edgeBottom: "transparent",
    placeholder:
      "linear-gradient(90deg, #dfa62e 0%, #f9ecc8 55%, transparent 100%)",
    alt: "Carved deity pillar border in marigold gold",
  },
  pillarBorderRight: {
    src: "/art/pillar-border-green.webp",
    width: 202,
    height: 488,
    edgeTop: "transparent",
    edgeBottom: "transparent",
    placeholder:
      "linear-gradient(90deg, #8fae7e 0%, #e9f2df 55%, transparent 100%)",
    alt: "Carved deity pillar border in mint green",
  },
  garlandScene: {
    src: "/art/garland-scene.png",
    width: 1122,
    height: 1402,
    edgeTop: "#bee3f1",
    edgeBottom: "#7a1f2b",
    placeholder:
      "linear-gradient(180deg, #bee3f1 0%, #bee3f1 10%, #e8c455 35%, #d98f3c 60%, #e6a7b7 84%, #7a1f2b 100%)",
    alt: "Couple exchanging garlands before golden gopurams with banana leaves and a lotus stage",
  },
  storyOrnaments: {
    src: "/art/story-ornaments.png",
    width: 1024,
    height: 1536,
    edgeTop: "transparent",
    edgeBottom: "transparent",
    placeholder:
      "radial-gradient(ellipse at center, transparent 55%, rgba(245,198,79,0.35) 90%)",
    alt: "Ornate red and gold arch border with palm ornaments",
  },
  venueShowcase: {
    src: "/art/venue-showcase.png",
    width: 1122,
    height: 1402,
    edgeTop: "#45080e",
    edgeBottom: "#45080e",
    placeholder:
      "linear-gradient(180deg, #45080e 0%, #6b1a10 30%, #b8862f 52%, #6b1a10 74%, #45080e 100%)",
    alt: "Golden temple with peacocks and lotuses on deep maroon",
  },
  rsvpTemples: {
    src: null,
    width: 2400,
    height: 1400,
    edgeTop: "#45080e",
    edgeBottom: "#f5ebd0",
    placeholder:
      "linear-gradient(180deg, #45080e 0%, #c9972c 22%, #f5ebd0 45%, #f5ebd0 100%)",
    alt: "Cream and gold temples flanking the RSVP invitation",
  },
  countdownGateway: {
    src: null,
    width: 2400,
    height: 1600,
    edgeTop: "#f5c64f",
    edgeBottom: "#f5ebd0",
    placeholder:
      "linear-gradient(180deg, #f5c64f 0%, #f5c64f 25%, #d9a53c 55%, #a9761f 78%, #f5ebd0 100%)",
    alt: "Golden gateway arch beneath a warm gold sky",
  },
};
