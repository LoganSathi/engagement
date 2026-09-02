import ArtSlot from "./ArtSlot";

/**
 * S9 — dark-maroon showcase banner (gold temple, peacocks, lotuses) naming
 * the venue, echoing the ref's "MEENAKSHI TEMPLE" plate.
 */
export default function VenueShowcase() {
  return (
    <section className="relative -mt-px bg-[var(--maroon-deep)]">
      <ArtSlot slot="venueShowcase" />
      <div className="absolute inset-x-0 bottom-[6%] z-10 text-center px-4">
        <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--gold-sun)]/80 mb-2">
          The Venue
        </p>
        <h2 className="font-heading text-[clamp(1.3rem,4vw,2.2rem)] tracking-[0.28em] text-[var(--gold-sun)]">
          CYBER VALLEY · CYBERJAYA
        </h2>
        <div
          aria-hidden
          className="mx-auto mt-3 h-px w-40 bg-gradient-to-r from-transparent via-[var(--gold-sun)] to-transparent"
        />
      </div>
    </section>
  );
}
