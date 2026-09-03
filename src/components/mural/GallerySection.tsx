import type { CSSProperties } from "react";
import Image from "next/image";
import RevealSection from "@/components/RevealSection";
import Parallax from "@/components/Parallax";
import ChimeTrigger from "@/components/ChimeTrigger";

const POLAROIDS = [
  { rotate: "-7deg", x: "-14%", y: "6%", speed: 0.07, src: "/gallery/photo-5.png" },
  { rotate: "5deg", x: "12%", y: "-4%", speed: -0.06, src: "/gallery/photo-4.png" },
  { rotate: "-3deg", x: "-2%", y: "2%", speed: 0.09, src: "/gallery/photo-3.png" },
  { rotate: "9deg", x: "18%", y: "8%", speed: -0.08, src: "/gallery/photo-1.png" },
  { rotate: "-11deg", x: "-20%", y: "-6%", speed: 0.06, src: "/gallery/photo-2.png" },
];

/**
 * S11 — embossed-cream gallery with scattered polaroids.
 */
export default function GallerySection() {
  return (
    <section className="relative -mt-px bg-[var(--cream-emboss)] px-4 py-20 overflow-hidden">
      {/* embossed corner motifs — same-color shadows read as debossing */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            "radial-gradient(circle at 4% 8%, rgba(169,118,31,0.12) 0, transparent 22%), radial-gradient(circle at 96% 12%, rgba(169,118,31,0.12) 0, transparent 22%), radial-gradient(circle at 6% 92%, rgba(169,118,31,0.1) 0, transparent 20%), radial-gradient(circle at 94% 88%, rgba(169,118,31,0.1) 0, transparent 20%)",
        }}
      />

      <RevealSection as="div" className="relative z-10 mx-auto max-w-xl text-center">
        <ChimeTrigger kind="sparkle" />
        <p className="font-script italic text-[var(--maroon)] text-lg mb-10">
          A few of our favourite moments
        </p>

        <div className="relative mx-auto flex max-w-md flex-wrap items-center justify-center">
          {POLAROIDS.map((p, i) => (
            <Parallax key={i} speed={p.speed} className="polaroid-slot">
              <div
                tabIndex={0}
                className="polaroid -m-3 w-32 sm:w-36 bg-white p-2 pb-6 shadow-[0_10px_28px_rgba(44,26,16,0.25)] focus:outline-none"
                style={
                  {
                    "--r": p.rotate,
                    "--tx": p.x,
                    "--ty": p.y,
                  } as CSSProperties
                }
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={p.src}
                    alt={`Logan & Venolia — moment ${i + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              </div>
            </Parallax>
          ))}
        </div>

        <p className="mt-10 text-xs text-[var(--ink)]/50">
          ❁ more memories being framed ❁
        </p>
      </RevealSection>
    </section>
  );
}
