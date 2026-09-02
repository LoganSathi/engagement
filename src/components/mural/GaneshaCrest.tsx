import RevealSection from "@/components/RevealSection";

type LampSpec = { cord: number; flame: string; duration: string; delay: string };

// tapering toran cascade — longest/biggest lamp nearest the deity, shorter
// toward the outer edge on each side
const CASCADE: LampSpec[] = [
  { cord: 10, flame: "text-base sm:text-lg", duration: "3.4s", delay: "-0.1s" },
  { cord: 18, flame: "text-lg sm:text-xl", duration: "3.6s", delay: "-0.4s" },
  { cord: 32, flame: "text-xl sm:text-2xl", duration: "4.2s", delay: "-1.6s" },
  { cord: 50, flame: "text-2xl sm:text-3xl", duration: "3.9s", delay: "-2.4s" },
];

function Lamp({ cord, flame, duration, delay }: LampSpec) {
  return (
    <div
      aria-hidden
      className="animate-swing-lamp flex flex-col items-center"
      style={{
        transformOrigin: "top center",
        animationDuration: duration,
        animationDelay: delay,
      }}
    >
      <span
        className="block w-px bg-[var(--gold)]/60"
        style={{ height: cord }}
      />
      <span className={`animate-flicker leading-none ${flame}`}>🪔</span>
    </div>
  );
}

/**
 * Top-of-page crest — Ganesha (remover of obstacles) traditionally opens an
 * invitation, flanked by a toran-style cascade of hanging oil lamps swinging
 * from their hinge. Reuses the swing-lamp/flicker keyframes in globals.css.
 */
export default function GaneshaCrest() {
  return (
    <div className="relative bg-[var(--sky)]">
      <RevealSection
        as="div"
        className="flex items-start justify-center gap-1.5 sm:gap-4 py-6 sm:py-10"
      >
        {[...CASCADE].reverse().map((l, i) => (
          <Lamp key={`l${i}`} {...l} />
        ))}

        {/* line-art PNG recolored via CSS mask (see .mask-fill) so the black
            artwork renders in the site's gold, not flat black */}
        <div
          role="img"
          aria-label="Lord Ganesha"
          className="mask-fill w-20 sm:w-28 aspect-square shrink-0 mx-4 sm:mx-8 drop-shadow-[0_6px_20px_rgba(184,134,47,0.5)]"
          style={{
            maskImage: "url(/art/ganesha-crest.png)",
            WebkitMaskImage: "url(/art/ganesha-crest.png)",
            background:
              "linear-gradient(160deg, #f3d98b 10%, #b8862f 55%, #8a641f 100%)",
          }}
        />

        {CASCADE.map((l, i) => (
          <Lamp key={`r${i}`} {...l} />
        ))}
      </RevealSection>
    </div>
  );
}
