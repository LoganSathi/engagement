import Image from "next/image";
import RevealSection from "@/components/RevealSection";
import { ART } from "@/lib/artwork";

/**
 * S8 — maroon story section. Ornate red/gold arch borders are a transparent
 * overlay (T5) sitting on the flat maroon, so no raster seams exist; the
 * couple photo lives in a gold frame.
 */
export default function StorySection() {
  const orn = ART.storyOrnaments;
  return (
    <section className="relative -mt-px bg-[var(--maroon)] px-4 py-20 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={
          orn.src
            ? undefined
            : { background: orn.placeholder }
        }
      >
        {orn.src && (
          <Image
            src={orn.src}
            alt=""
            fill
            unoptimized
            loading="lazy"
            className="object-contain object-center opacity-90"
          />
        )}
      </div>

      <RevealSection as="div" className="relative z-10 mx-auto max-w-xl text-center">
        <h2 className="font-heading text-3xl text-[var(--gold-sun)] mb-1">
          Our Story
        </h2>
        <p className="text-[var(--cream)]/80 text-sm tracking-wide mb-8">
          A moment to remember
        </p>

        <div className="mx-auto max-w-xs rounded-[6px] border-[6px] border-[var(--gold)] shadow-[0_0_0_2px_var(--gold-sun),0_18px_44px_rgba(0,0,0,0.4)] bg-[var(--cream)] aspect-[3/4] flex items-center justify-center text-sm text-[var(--gold)] p-6">
          Add your favourite photo here ❁
        </div>

        <p className="mt-8 text-sm leading-relaxed text-[var(--cream)]/85 max-w-md mx-auto">
          Through every smile and every shared moment, their love only grew
          deeper. Today, with hearts full of love and gratitude, Logan &amp;
          Venolia invite you to witness the beginning of their forever.
        </p>
      </RevealSection>

      {/* maroon → deep maroon into the venue showcase */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[8vh]"
        style={{
          background:
            "linear-gradient(180deg, transparent, var(--maroon-deep))",
        }}
      />
    </section>
  );
}
