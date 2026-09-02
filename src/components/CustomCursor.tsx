"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, [data-cursor]';

/**
 * Small gold ring that trails the pointer, enlarging (and showing a label,
 * via data-cursor-label) over interactive elements. Desktop/mouse only —
 * disabled whenever the device lacks a fine hover pointer.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- matchMedia is browser-only; must sync after mount to avoid SSR mismatch
    setEnabled(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setEnabled(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const prevCursor = document.documentElement.style.cursor;
    document.documentElement.style.cursor = "none";

    function move(e: PointerEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
    }
    function over(e: PointerEvent) {
      const target = (e.target as HTMLElement)?.closest?.(
        INTERACTIVE_SELECTOR
      ) as HTMLElement | null;
      setActive(!!target);
      setLabel(target?.getAttribute("data-cursor-label") ?? null);
    }

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      document.documentElement.style.cursor = prevCursor;
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, [enabled, x, y]);

  if (!enabled || reduced) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] flex items-center justify-center rounded-full border-[1.5px] border-[var(--gold-sun)]"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        width: active ? 56 : 22,
        height: active ? 56 : 22,
        background: active
          ? "rgba(245,198,79,0.16)"
          : "rgba(245,198,79,0.08)",
        boxShadow: active
          ? "0 0 20px rgba(245,198,79,0.55)"
          : "0 0 6px rgba(245,198,79,0.25)",
        transition:
          "width 0.25s ease, height 0.25s ease, background 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      {label && (
        <span className="font-heading text-[9px] uppercase tracking-[0.15em] text-[var(--gold-sun)]">
          {label}
        </span>
      )}
    </motion.div>
  );
}
