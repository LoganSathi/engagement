import { ReactNode } from "react";
import { ART } from "@/lib/artwork";

// the strips reach up under the gateway wall's bottom fade; a soft top fade
// makes them emerge from behind the wall (one piece) instead of overlapping
// it with a hard edge, and they dissolve out again at the bottom.
const PILLAR_MASK =
  "linear-gradient(180deg, transparent, black 20px, black calc(100% - 220px), transparent)";

function Strip({ side }: { side: "left" | "right" }) {
  const pb =
    side === "left" ? ART.pillarBorderLeft : ART.pillarBorderRight;
  return (
    <div
      aria-hidden
      className={`absolute -top-[5vw] bottom-0 z-10 ${
        side === "left" ? "left-0" : "right-0"
      } w-9 sm:w-[56px] lg:w-[88px] pointer-events-none`}
      style={{
        ...(pb.src
          ? {
              backgroundImage: `url(${pb.src})`,
              backgroundRepeat: "repeat-y",
              backgroundSize: "100% auto",
            }
          : { background: pb.placeholder, opacity: 0.5 }),
        transform: side === "right" ? "scaleX(-1)" : undefined,
        WebkitMaskImage: PILLAR_MASK,
        maskImage: PILLAR_MASK,
      }}
    />
  );
}

/**
 * Runs one continuous pair of carved-pillar borders down BOTH the
 * invitation and schedule sections, starting flush under the gateway wall.
 */
export default function PillarFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <Strip side="left" />
      <Strip side="right" />
      {children}
    </div>
  );
}
