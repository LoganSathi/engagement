"use client";

import { useEffect, useRef } from "react";
import { useMusic } from "@/context/MusicContext";
import { playChime, ChimeKind } from "@/lib/chime";

/**
 * Invisible sentinel — drop into any section to fire a synthesized chime
 * (ducking the bg music) the first time that spot scrolls into view.
 */
export default function ChimeTrigger({ kind }: { kind: ChimeKind }) {
  const ref = useRef<HTMLSpanElement>(null);
  const fired = useRef(false);
  const { muted, duck } = useMusic();
  const mutedRef = useRef(muted);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true;
          if (!mutedRef.current) {
            duck();
            playChime(kind);
          }
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [kind, duck]);

  return <span ref={ref} aria-hidden className="block h-px w-px" />;
}
