"use client";

import RevealSection from "@/components/RevealSection";
import ChimeTrigger from "@/components/ChimeTrigger";
import EventCard from "./EventCard";
import {
  buildGoogleCalendarUrl,
  buildIcsBlobUrl,
  MAP_DIRECTIONS_URL,
  MAP_EMBED_SRC,
} from "@/lib/event";

const EVENTS = [
  // { time: "6:30 PM", title: "Welcome & Lamp Lighting", icon: "🪔" },
  { time: "7:10 PM", title: "Nichayathartham Ceremony", icon: "🌸" },
  { time: "8:00 PM", title: "Ring Exchange", icon: "💍" },
  { time: "8:30 PM", title: "Blessings from Elders", icon: "🙏" },
  { time: "9:00 PM", title: "Dinner & Celebration", icon: "🍽️" },
];

/**
 * S5 — schedule cards plus the "Getting There" logistics card (calendar +
 * map); the carved-pillar side borders come from the PillarFrame wrapper.
 * Ends in a haze gradient that hands cream over to the garland scene's sky.
 */
export default function EventPillars() {
  function handleDownloadIcs() {
    const url = buildIcsBlobUrl();
    const a = document.createElement("a");
    a.href = url;
    a.download = "Logan-Venolia-Engagement.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="relative -mt-px bg-[var(--invite-cream)]">
      <div className="relative mx-auto max-w-xl px-12 sm:px-10 pt-4 pb-14">
        <ChimeTrigger kind="bell" />
        <h2 className="text-center font-heading text-3xl text-[var(--maroon)] mb-1">
          Schedule of Events
        </h2>
        <p className="text-center text-[var(--gold)] text-sm tracking-wide mb-9">
          {/* Friday, September 11, 2026 */}
        </p>

        <div className="flex flex-col gap-7">
          {EVENTS.map((item) => (
            <RevealSection as="div" key={item.title}>
              <EventCard icon={item.icon} title={item.title} time={item.time} />
            </RevealSection>
          ))}

          <RevealSection as="div">
            <EventCard icon="🗺️" title="Getting There">
              <p className="mt-3 text-sm text-[var(--ink)]/80">
                No 9, Jalan CV 4B/1, Cyber Valley,
                <br />
                63300 Cyberjaya, Selangor, Malaysia
              </p>
              <div className="flex flex-wrap gap-3 justify-center mt-5">
                <a
                  className="btn"
                  href={buildGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  + Google Calendar
                </a>
                <button className="btn btn-outline" onClick={handleDownloadIcs}>
                  + Apple / Outlook
                </button>
              </div>
              <div className="mt-5 rounded-lg overflow-hidden border-2 border-[var(--gold)]">
                <iframe
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={MAP_EMBED_SRC}
                  className="w-full h-56 border-0 block [filter:sepia(.15)_saturate(1.1)]"
                  allowFullScreen
                />
              </div>
              <div className="flex justify-center mt-5">
                <a
                  className="btn btn-outline"
                  href={MAP_DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get Directions →
                </a>
              </div>
            </EventCard>
          </RevealSection>
        </div>
      </div>

      {/* cream → embossed cream into the gallery */}
      <div
        aria-hidden
        className="h-[8vw] max-h-28"
        style={{
          background:
            "linear-gradient(180deg, var(--invite-cream), var(--cream-emboss))",
        }}
      />
    </section>
  );
}
