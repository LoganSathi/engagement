"use client";

import { useEffect } from "react";
import { useInViewOnce } from "@/hooks/useInView";
import { fireBurst } from "@/lib/burst";
import ChimeTrigger from "@/components/ChimeTrigger";

/**
 * S12 — closing family credit. The countdown ticker lives up in
 * DateScratchReveal and the gateway-art farewell banner was cut; this is
 * now just the footer. A confetti burst + chime fire once when it first
 * scrolls into view — the send-off moment.
 */
export default function CountdownFinale() {
  const { ref, inView } = useInViewOnce<HTMLElement>(0.4);

  useEffect(() => {
    if (inView) fireBurst({ count: 36 });
  }, [inView]);

  return (
    <section ref={ref} className="relative -mt-px bg-[var(--cream-emboss)]">
      <ChimeTrigger kind="chime" />
      <footer className="relative bg-[var(--cream-emboss)] px-4 pb-12 pt-8 text-center">
        <p className="font-heading text-lg text-[var(--maroon)] mb-3">
          With love and gratitude,
          <br />
          The Families of Logan &amp; Venolia
        </p>
        <p className="text-sm text-[var(--ink)]/75">
          ❁ We look forward to celebrating this joyous occasion with you ❁
        </p>
        <small className="mt-4 block text-xs text-[var(--ink)]/45">
          Made with love for Logan &amp; Venolia · September 11, 2026
        </small>
      </footer>
    </section>
  );
}
