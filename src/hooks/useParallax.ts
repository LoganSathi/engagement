"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useReducedMotion } from "motion/react";

/**
 * Drives a translateY motion value from the element's offset from the
 * viewport center. Plain scroll/resize listeners (not useScroll) for the
 * same reason as TemplePanHero — v12's ScrollTimeline handoff mis-measures
 * elements whose travel doesn't span the full page.
 */
export function useParallax<T extends HTMLElement>(speed = 0.15) {
  const ref = useRef<T | null>(null);
  const y = useMotionValue(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    function update() {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const elCenter = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      y.set((viewportCenter - elCenter) * speed);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [speed, y, reduced]);

  return { ref, y };
}
