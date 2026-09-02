import Image from "next/image";
import { ART, ArtSlotName } from "@/lib/artwork";

/**
 * Renders one manifest slot. Two modes:
 *  - "band" (default): aspect-ratio-locked full-width band — the art's top
 *    and bottom edge pixels stay visible at every viewport width, which is
 *    what makes flat-color seam stitching reliable.
 *  - "fill": the parent owns sizing/cropping (used by sticky full-viewport
 *    sections like the temple pan, where safe zones absorb the crop).
 *
 * While `src` is null the same wrapper shows the placeholder gradient plus
 * a small spec label so missing art is obvious in screenshots.
 */
export default function ArtSlot({
  slot,
  mode = "band",
  preload = false,
  className = "",
}: {
  slot: ArtSlotName;
  mode?: "band" | "fill";
  preload?: boolean;
  className?: string;
}) {
  const art = ART[slot];
  const isBand = mode === "band";

  if (!art.src) {
    return (
      <div
        aria-hidden
        className={`relative w-full ${isBand ? "" : "h-full"} ${className}`}
        style={{
          background: art.placeholder,
          ...(isBand ? { aspectRatio: `${art.width} / ${art.height}` } : {}),
        }}
      >
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded border border-dashed border-black/25 px-2 py-1 text-[10px] tracking-wide text-black/40">
          {slot} {art.width}×{art.height}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full ${isBand ? "" : "h-full"} ${className}`}
      style={isBand ? { aspectRatio: `${art.width} / ${art.height}` } : undefined}
    >
      <Image
        src={art.src}
        alt={art.alt}
        width={art.width}
        height={art.height}
        unoptimized
        preload={preload}
        loading={preload ? undefined : "lazy"}
        className={isBand ? "block w-full h-auto" : "block w-full h-full object-cover"}
      />
    </div>
  );
}
