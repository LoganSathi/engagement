import RevealSection from "@/components/RevealSection";
import Parallax from "@/components/Parallax";

/**
 * S4 — the formal invitation. The text block is pulled up into the arch
 * opening of the GatewayWall art above (both share --invite-cream), so the
 * words appear "inside" the gateway.
 */
export default function ArchInvitation() {
  return (
    // pt-px stops the child's negative margin collapsing through the
    // section (which would drag the cream background up over the arch)
    <section className="relative -mt-px bg-[var(--invite-cream)] px-12 sm:px-4 pt-px pb-8">
      <RevealSection
        as="div"
        className="relative z-10 mx-auto max-w-xl -mt-[16vw] sm:-mt-[24vw] text-center"
      >
        <Parallax speed={0.12} className="text-3xl mb-4">
          <div aria-hidden>✦</div>
        </Parallax>
        <p className="font-script italic text-[var(--maroon)] text-lg">
          With the blessings of our families
        </p>
        <p className="mt-6 text-sm leading-relaxed text-[var(--ink)]/80">
          Together with their parents,
        </p>
        <h2 className="mt-4 font-heading text-[clamp(1.9rem,6vw,2.8rem)] tracking-[0.12em] text-[var(--gold)]">
          LOGAN
        </h2>
        <div className="font-script italic text-[var(--maroon)] text-xl my-1">
          &amp;
        </div>
        <h2 className="font-heading text-[clamp(1.9rem,6vw,2.8rem)] tracking-[0.12em] text-[var(--gold)]">
          VENOLIA
        </h2>
        <p className="mt-6 text-sm leading-relaxed text-[var(--ink)]/80 max-w-md mx-auto">
          cordially invite you to grace their engagement ceremony and shower
          the couple with your blessings.
        </p>
        {/* the date itself stays hidden here — guests scratch it out of the
            gold foil card in the next section */}
        {/* <p className="mt-8 text-sm text-[var(--ink)]/70">
          Cyber Valley, Cyberjaya, Selangor, Malaysia
        </p> */}
      </RevealSection>
    </section>
  );
}
