import ArtSlot from "./ArtSlot";
import RevealSection from "@/components/RevealSection";
import { buildWhatsAppUrl } from "@/lib/event";

/**
 * S10 — RSVP. Gold temples flank a clear cream center (per the art spec's
 * center-40% safe zone) where the WhatsApp deep link lives.
 */
export default function RsvpWhatsApp() {
  return (
    <section className="relative -mt-px bg-[var(--cream-emboss)]">
      <ArtSlot slot="rsvpTemples" />
      <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
        <RevealSection as="div" className="text-center max-w-sm">
          <h2 className="font-heading text-[clamp(1.5rem,4vw,2.2rem)] text-[var(--maroon)] mb-2">
            Will you join us?
          </h2>
          <p className="text-xs sm:text-sm text-[var(--ink)]/75 mb-5">
            We would be truly honoured to celebrate this day with you. Kindly
            respond by September 1, 2026 — your presence is the only gift we
            need.
          </p>
          <a
            className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-bold text-white shadow-[0_8px_22px_rgba(37,211,102,0.45)] transition-transform active:scale-95"
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
              <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.11 3.22 5.11 4.51.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z" />
              <path d="M12.05 2a9.94 9.94 0 0 0-8.6 14.94L2 22l5.2-1.36A9.94 9.94 0 1 0 12.05 2zm0 18.18c-1.5 0-2.97-.4-4.25-1.16l-.3-.18-3.09.81.82-3.01-.2-.31a8.26 8.26 0 1 1 7.02 3.85z" />
            </svg>
            RSVP on WhatsApp
          </a>
        </RevealSection>
      </div>
    </section>
  );
}
