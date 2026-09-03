"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { ART } from "@/lib/artwork";
import { rafThrottle } from "@/lib/rafThrottle";

/**
 * S1+S2 — the signature move. A 280vh scroll runway pins a 100svh viewport;
 * inside it the tall (1:3) temple artwork translates upward so scrolling
 * reads as a camera panning from the sky (names) down the temple to its
 * base. The art's bottom edge fades to --wall-cream, which the next
 * section continues, so there is no seam.
 */
export default function TemplePanHero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // Width-locked pan on desktop. Below 640px the image is width-fitted too
  // (whole temple visible, no side crop) and bottom-anchored; the gap above
  // is the flat --sky color the art's top edge shares, so it reads as one
  // surface. With the image shorter than the viewport the pan travel
  // clamps to 0 — the mobile hero is a static full-temple view with the
  // name cascade, over a shorter scroll runway.
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- matchMedia is browser-only; must sync after mount to avoid SSR mismatch
    setMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Progress and travel are driven by our own passive scroll listener into
  // a plain MotionValue. Deliberately NOT useScroll: motion v12 hands
  // useScroll-driven styles off to the browser's native ScrollTimeline,
  // where keyframes that end before 100% gain an implicit final keyframe
  // at the underlying style value — names/cue faded out and then back IN,
  // and the pan's transform silently unbound after travel re-measured.
  const progress = useMotionValue(0);
  const travelMV = useMotionValue(0);
  // mobile-only zoom-out: starts at 1.35 (temple enlarged, lower half past
  // the viewport bottom, crown right under the names) and settles at 1
  // (whole temple in view). Scaling from the top edge is what keeps the
  // crown pinned while the base rises into view.
  const scaleMV = useMotionValue(1);
  // start offset of the pan, derived each update from the measured names
  // block so the crown always begins just below the names
  const liftMV = useMotionValue(0);
  const panRef = useRef<HTMLDivElement>(null);
  const namesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    function update() {
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = -el.getBoundingClientRect().top;
      progress.set(total > 0 ? Math.min(Math.max(scrolled / total, 0), 1) : 0);
      const panH = panRef.current?.offsetHeight ?? 0;
      // pan always ends with the image's cream bottom edge flush with the
      // viewport bottom (negative on desktop where the image is taller,
      // positive on phones where it is shorter)
      travelMV.set(window.innerHeight - panH);
      // start position is derived from the MEASURED names block so the
      // gopuram crown (~22% into the artwork) begins just below the names
      // on every device — phones, tablets and desktops alike — instead of
      // trusting per-breakpoint constants that overlapped on iPad/Surface
      const CROWN_FRAC = 0.22;
      const startScale = mobile ? 1.35 : 1;
      const namesBottom =
        namesRef.current?.getBoundingClientRect().bottom ??
        window.innerHeight * 0.4;
      liftMV.set(namesBottom + 14 - CROWN_FRAC * panH * startScale);
      const p = total > 0 ? Math.min(Math.max(scrolled / total, 0), 1) : 0;
      scaleMV.set(mobile ? 1.35 - 0.35 * p : 1);
    }
    const onTick = rafThrottle(update);
    update();
    window.addEventListener("scroll", onTick, { passive: true });
    window.addEventListener("resize", onTick);
    return () => {
      window.removeEventListener("scroll", onTick);
      window.removeEventListener("resize", onTick);
    };
  }, [progress, travelMV, liftMV, scaleMV, mobile, reduced]);

  // pan runs from lift (slightly up) to full travel (image bottom edge)
  const y = useTransform(
    () => liftMV.get() + progress.get() * (travelMV.get() - liftMV.get())
  );
  // staggered exit as the temple rises: tagline melts first, then the
  // bride's name, then the groom's — bottom-to-top cascade
  const taglineOpacity = useTransform(progress, [0.02, 0.1, 1], [1, 0, 0]);
  const taglineY = useTransform(progress, [0.02, 0.1, 1], [0, -30, -30]);
  const brideOpacity = useTransform(progress, [0.08, 0.17, 1], [1, 0, 0]);
  const brideY = useTransform(progress, [0.08, 0.17, 1], [0, -34, -34]);
  const groomOpacity = useTransform(progress, [0.15, 0.25, 1], [1, 0, 0]);
  const groomY = useTransform(progress, [0.15, 0.25, 1], [0, -38, -38]);
  const cueOpacity = useTransform(progress, [0, 0.08, 1], [1, 0, 0]);

  const art = ART.templePan;

  const artwork = art.src ? (
    <Image
      src={art.src}
      alt={art.alt}
      width={art.width}
      height={art.height}
      unoptimized
      preload
      className="block w-full h-full"
    />
  ) : (
    <div
      aria-hidden
      className="w-full h-full"
      style={{ background: art.placeholder }}
    />
  );

  const staticNames = (
    <div className="flex flex-col items-center px-4 pt-[5svh] sm:pt-[10svh] text-center">
      <h1 className="font-heading text-[var(--ink)] tracking-[0.18em] text-[clamp(2.2rem,9vw,4rem)] leading-tight">
        LOGAN
      </h1>
      <div className="font-script italic text-[var(--maroon)] text-xl my-1">
        and
      </div>
      <h1 className="font-heading text-[var(--ink)] tracking-[0.18em] text-[clamp(2.2rem,9vw,4rem)] leading-tight">
        VENOLIA
      </h1>
      <p className="mt-4 text-xs sm:text-sm uppercase tracking-[0.3em] text-[var(--ink)]/70">
        are getting engaged
      </p>
    </div>
  );

  const staggeredNames = (
    <div className="flex flex-col items-center px-4 pt-[5svh] sm:pt-[10svh] text-center">
      <motion.div style={{ opacity: groomOpacity, y: groomY }}>
        <h1 className="font-heading text-[var(--ink)] tracking-[0.18em] text-[clamp(2.2rem,9vw,4rem)] leading-tight">
          LOGAN
        </h1>
      </motion.div>
      <motion.div style={{ opacity: brideOpacity, y: brideY }}>
        <div className="font-script italic text-[var(--maroon)] text-xl my-1">
          and
        </div>
        <h1 className="font-heading text-[var(--ink)] tracking-[0.18em] text-[clamp(2.2rem,9vw,4rem)] leading-tight">
          VENOLIA
        </h1>
      </motion.div>
      <motion.p
        style={{ opacity: taglineOpacity, y: taglineY }}
        className="mt-4 text-xs sm:text-sm uppercase tracking-[0.3em] text-[var(--ink)]/70"
      >
        are getting engaged
      </motion.p>
    </div>
  );

  if (reduced) {
    return (
      <section className="relative -mt-px h-[100svh] overflow-hidden bg-[var(--sky)]">
        <div className="absolute inset-0">
          {art.src ? (
            <Image
              src={art.src}
              alt={art.alt}
              fill
              unoptimized
              preload
              className="object-cover object-top"
            />
          ) : (
            <div
              aria-hidden
              className="w-full h-full"
              style={{ background: art.placeholder }}
            />
          )}
        </div>
        <div className="relative z-10">{staticNames}</div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="relative -mt-px bg-[var(--sky)]"
      style={{ height: mobile ? "200vh" : "280vh" }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* items-start: flex stretch would force the art to viewport height,
            overriding its aspect-ratio and zeroing the pan travel;
            items-end on mobile keeps the art's cream bottom edge flush with
            the next section while the flat sky fills the space above */}
        <div className="absolute inset-0 flex items-start justify-center overflow-visible">
          <motion.div
            ref={panRef}
            className="shrink-0 will-change-transform"
            style={{
              y,
              scale: scaleMV,
              transformOrigin: "top center",
              width: "100vw",
              height: "auto",
              aspectRatio: `${art.width} / ${art.height}`,
            }}
          >
            {artwork}
          </motion.div>
        </div>

        <div ref={namesRef} className="absolute inset-x-0 top-0 z-10 pointer-events-none">
          {staggeredNames}
        </div>

        <motion.div
          className="absolute inset-x-0 bottom-5 z-10 flex flex-col items-center gap-1.5 text-[var(--ink)]/70 pointer-events-none"
          style={{ opacity: cueOpacity }}
        >
          <span className="text-[10px] uppercase tracking-[0.25em]">
            Scroll
          </span>
          <span className="text-lg animate-pulse-soft">↓</span>
        </motion.div>
      </div>
    </section>
  );
}
