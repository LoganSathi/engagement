"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { useMusic } from "@/context/MusicContext";
import { unlockAudio } from "@/lib/chime";

/**
 * Full-screen envelope intro (modelled on the reference video): the entire
 * viewport is a cream paper envelope — four fold panels meeting at the
 * center in an X of creases, subtle embossed damask, and an irregular
 * maroon wax seal with the couple's monogram. Tapping the seal pops it,
 * the panels peel open in 3D over a warm golden interior glow, the LoVe
 * logo card blooms in the middle, then everything lifts away to the site.
 * Music starts on the tap (user gesture → unmuted autoplay allowed).
 *
 * Revert path: swap <EnvelopeIntro /> back to <IntroVideo /> in page.tsx.
 */

// timeline (seconds after tap) — a golden light blooms around the seal
// first, then the envelope peels open slowly
const T_GLOW = 0.05; // gold light blooms behind the seal
const T_SEAL_OUT = 0.55; // seal melts away
const T_TOP = 0.8; // top flap starts peeling
const T_REST = 1.35; // remaining panels follow
const PANEL_DUR = 1.6; // each panel's peel duration
const T_LOGO = 2.3; // logo card blooms
const T_LIFT = 4.4; // scene lifts away
const T_DONE = 5.5; // overlay unmounts

// near-circular wax blob — soft undulating rim like a real pressed seal
// (round overall, no star points)
const WAX_PATH =
  "M188.7,100.0L190.7,104.8L191.3,109.6L191.4,114.5L190.1,119.2L187.1,123.3L184.1,127.3L182.0,131.5L178.3,134.9L175.9,138.6L174.9,143.2L172.7,147.2L171.7,152.1L169.6,156.4L167.5,160.7L163.9,163.9L160.5,167.2L156.3,169.5L151.2,170.5L146.7,171.9L142.2,173.1L137.7,174.0L134.3,177.1L130.6,179.7L126.7,182.3L122.7,184.8L118.8,188.2L114.1,189.1L109.4,189.7L104.7,189.3L100.0,187.8L95.5,186.5L91.1,184.4L86.7,184.2L82.3,183.5L77.4,184.4L72.5,184.7L67.8,183.8L62.9,183.2L58.3,181.8L53.8,180.1L50.6,176.0L47.5,172.3L45.0,167.9L42.2,164.2L39.3,160.7L36.0,157.6L32.0,155.1L28.0,152.3L23.8,149.5L20.7,145.8L17.9,141.8L16.4,137.2L15.7,132.4L16.3,127.2L17.4,122.1L16.7,117.7L16.3,113.3L15.5,108.9L14.6,104.5L12.8,100.0L12.1,95.4L10.4,90.6L11.0,85.9L12.7,81.4L15.1,77.3L16.9,73.0L19.6,69.1L23.4,65.9L24.7,61.6L26.8,57.7L28.3,53.4L29.2,48.6L30.1,43.4L32.0,38.8L35.7,35.7L38.8,32.0L43.6,30.3L47.6,27.9L52.5,26.9L56.6,24.8L60.7,22.8L64.8,21.0L68.4,17.6L72.5,15.4L76.7,12.9L80.9,10.0L85.7,9.6L90.5,9.3L95.3,9.9L100.0,11.3L104.5,13.8L108.9,15.7L113.3,15.7L117.6,17.1L122.4,16.3L127.2,16.3L131.8,17.2L136.6,17.9L141.0,19.6L145.0,22.1L148.3,25.7L151.1,29.7L153.7,33.7L156.6,37.1L159.2,40.8L162.5,43.8L166.6,46.0L170.2,49.0L174.3,51.7L178.7,54.6L181.0,58.8L182.8,63.1L183.0,68.1L183.8,72.8L183.9,77.5L183.2,82.3L184.6,86.6L185.8,91.0L186.6,95.5Z";

// embossed floral sprig repeated across the envelope paper (tone-on-tone,
// reads as premium letterpress texture)
const FLORAL_MOTIF = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Cg fill='none' stroke='%23a98a52' stroke-opacity='.13' stroke-width='1.3'%3E%3Cpath d='M38 38C34 31 34 24 38 20C42 24 42 31 38 38'/%3E%3Cpath d='M38 38C34 45 34 52 38 56C42 52 42 45 38 38'/%3E%3Cpath d='M38 38C31 34 24 34 20 38C24 42 31 42 38 38'/%3E%3Cpath d='M38 38C45 34 52 34 56 38C52 42 45 42 38 38'/%3E%3Ccircle cx='38' cy='38' r='3'/%3E%3Cpath d='M112 112C109.6 107.8 109.6 103.6 112 101.2C114.4 103.6 114.4 107.8 112 112'/%3E%3Cpath d='M112 112C109.6 116.2 109.6 120.4 112 122.8C114.4 120.4 114.4 116.2 112 112'/%3E%3Cpath d='M112 112C107.8 109.6 103.6 109.6 101.2 112C103.6 114.4 107.8 114.4 112 112'/%3E%3Cpath d='M112 112C116.2 109.6 120.4 109.6 122.8 112C120.4 114.4 116.2 114.4 112 112'/%3E%3Ccircle cx='112' cy='112' r='2'/%3E%3C/g%3E%3C/svg%3E")`;

// shared paper finish: embossed damask dots + soft sheen
const PAPER_PATTERN =
  "radial-gradient(circle at 50% 50%, rgba(178,138,88,0.07) 0 5px, transparent 6px), radial-gradient(circle at 0 0, rgba(178,138,88,0.05) 0 4px, transparent 5px)";
const PAPER_PATTERN_SIZE = "36px 36px, 36px 36px";

type Panel = {
  key: string;
  clip: string;
  origin: string;
  rotate: { rotateX?: number; rotateY?: number };
  shade: string;
  delay: number;
};

// four fold panels meeting at center (top flap reaches a bit past center,
// like a real envelope); each peels outward on its own hinge
const PANELS: Panel[] = [
  {
    key: "top",
    clip: "polygon(0 0, 100% 0, 50% 54%)",
    origin: "top center",
    rotate: { rotateX: 155 },
    shade: "linear-gradient(180deg, #f7ecd6 0%, #f1e2c4 70%, #e9d6b2 100%)",
    delay: T_TOP,
  },
  {
    key: "left",
    clip: "polygon(0 0, 50% 50%, 0 100%)",
    origin: "left center",
    rotate: { rotateY: -155 },
    shade: "linear-gradient(90deg, #f5e9d1 0%, #ecdcbc 100%)",
    delay: T_REST,
  },
  {
    key: "right",
    clip: "polygon(100% 0, 50% 50%, 100% 100%)",
    origin: "right center",
    rotate: { rotateY: 155 },
    shade: "linear-gradient(270deg, #f5e9d1 0%, #ecdcbc 100%)",
    delay: T_REST,
  },
  {
    key: "bottom",
    clip: "polygon(0 100%, 50% 46%, 100% 100%)",
    origin: "bottom center",
    rotate: { rotateX: -155 },
    shade: "linear-gradient(0deg, #f8eed9 0%, #efe0c2 100%)",
    delay: T_REST + 0.15,
  },
];

export default function EnvelopeIntro() {
  const { play: playMusic } = useMusic();
  const reduced = useReducedMotion();
  const [skip, setSkip] = useState(false);
  const [opened, setOpened] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // sessionStorage access throws in some private-browsing/locked-down
    // configurations (strict cookie-blocking settings) rather than just
    // being unavailable — treat that the same as "not visited yet"
    try {
      if (sessionStorage.getItem("lv_visited")) setSkip(true);
    } catch {
      // ignore — session storage isn't available here
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = !skip && visible ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [skip, visible]);

  function handleOpen() {
    if (opened) return;
    // guarded, and after the state that actually opens the envelope: a
    // throw here (private-browsing/cookie-blocked configs) must not stop
    // the envelope from opening or the body scroll-lock from clearing
    try {
      sessionStorage.setItem("lv_visited", "1");
    } catch {
      // ignore — the site still works, it just won't skip the intro next visit
    }
    setOpened(true);
    playMusic();
    unlockAudio();
    if (reduced) {
      setVisible(false);
      return;
    }
    setTimeout(() => setVisible(false), T_DONE * 1000);
  }

  if (skip) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[2000] overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* scene lifts away at the end */}
          <motion.div
            className="absolute inset-0"
            style={{ perspective: 1300 }}
            animate={
              opened && !reduced
                ? {
                    y: "-112%",
                    transition: { delay: T_LIFT, duration: 0.9, ease: [0.5, 0, 0.6, 1] },
                  }
                : {}
            }
          >
            {/* interior revealed behind the panels: deep maroon with a warm
                golden glow, like light spilling out of the envelope */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 85% 70% at 50% 50%, #f0c060 0%, #b06a24 38%, #5d1420 72%, var(--maroon-deep) 100%)",
              }}
            />

            {/* logo card blooming out of the open envelope */}
            <motion.div
              className="absolute left-1/2 top-1/2 z-10 w-[min(74vw,340px)] -translate-x-1/2 -translate-y-1/2 rounded-xl border-2 border-[var(--gold)] shadow-[0_30px_90px_rgba(0,0,0,0.5)] overflow-hidden"
              style={{ aspectRatio: "1" , background: "#fdf8ec" }}
              initial={{ opacity: 0, scale: 0.55 }}
              animate={
                opened && !reduced
                  ? {
                      opacity: 1,
                      scale: 1,
                      transition: { delay: T_LOGO, duration: 0.9, ease: [0.2, 0.9, 0.3, 1] },
                    }
                  : {}
              }
            >
              <Image
                src="/art/logan-venolio-logo.png"
                alt="Logan & Venolia"
                fill
                unoptimized
                className="object-contain p-3"
              />
            </motion.div>

            {/* the four envelope panels */}
            {PANELS.map((p) => (
              <motion.div
                key={p.key}
                aria-hidden
                className="absolute inset-0 z-20"
                style={{
                  clipPath: p.clip,
                  transformOrigin: p.origin,
                  backfaceVisibility: "hidden",
                  background: `${FLORAL_MOTIF}, ${PAPER_PATTERN}, ${p.shade}`,
                  backgroundSize: `150px 150px, ${PAPER_PATTERN_SIZE}, auto`,
                }}
                animate={
                  opened && !reduced
                    ? {
                        ...p.rotate,
                        transition: {
                          delay: p.delay,
                          duration: PANEL_DUR,
                          ease: [0.5, 0, 0.35, 1],
                        },
                      }
                    : {}
                }
              >
                {/* crease shading along the diagonal edges */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      p.key === "top"
                        ? "linear-gradient(180deg, transparent 55%, rgba(120,80,30,0.10) 97%, rgba(120,80,30,0.16) 100%)"
                        : p.key === "bottom"
                          ? "linear-gradient(0deg, transparent 60%, rgba(120,80,30,0.08) 96%, rgba(120,80,30,0.14) 100%)"
                          : p.key === "left"
                            ? "linear-gradient(90deg, transparent 62%, rgba(120,80,30,0.10) 100%)"
                            : "linear-gradient(270deg, transparent 62%, rgba(120,80,30,0.10) 100%)",
                  }}
                />
              </motion.div>
            ))}

            {/* crease lines of the closed envelope — dark fold shadow with a
                light emboss edge along each diagonal; fades as the flap
                starts to peel */}
            <motion.svg
              aria-hidden
              className="absolute inset-0 z-[21] h-full w-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              animate={
                opened && !reduced
                  ? { opacity: 0, transition: { delay: T_TOP, duration: 0.5 } }
                  : { opacity: 1 }
              }
            >
              {[
                "M0,0 L50,54",
                "M100,0 L50,54",
                "M0,100 L50,46",
                "M100,100 L50,46",
              ].map((d) => (
                <g key={d}>
                  <path
                    d={d}
                    transform="translate(0 0.45)"
                    stroke="rgba(255,252,244,0.85)"
                    strokeWidth="0.9"
                    fill="none"
                    vectorEffect="non-scaling-stroke"
                  />
                  <path
                    d={d}
                    stroke="rgba(122,82,34,0.30)"
                    strokeWidth="1.6"
                    fill="none"
                    vectorEffect="non-scaling-stroke"
                  />
                </g>
              ))}
            </motion.svg>

            {/* golden light blooming around the seal on tap (backlit look
                from the reference video) */}
            {opened && !reduced && (
              <motion.span
                aria-hidden
                className="absolute left-1/2 top-1/2 z-[25] -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
                style={{
                  width: "min(30vw, 132px)",
                  aspectRatio: "1",
                  background:
                    "radial-gradient(circle, rgba(255,214,120,0.95) 0%, rgba(245,180,80,0.55) 40%, rgba(235,150,60,0.22) 65%, transparent 78%)",
                  filter: "blur(2px)",
                }}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{
                  opacity: [0, 0.85, 0.7, 0.45, 0],
                  scale: [0.7, 1.3, 1.7, 2.0, 2.3],
                }}
                transition={{
                  delay: T_GLOW,
                  duration: 2.6,
                  ease: "easeOut",
                  times: [0, 0.25, 0.55, 0.8, 1],
                }}
              />
            )}

            {/* wax seal — uneven SVG blob, monogram, the tap target */}
            <motion.button
              type="button"
              aria-label="Open the invitation"
              data-cursor-label={opened ? undefined : "Tap"}
              onClick={handleOpen}
              className="group absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--gold-sun)]/60 rounded-full"
              style={{ width: "min(30vw, 132px)", aspectRatio: "1" }}
              whileHover={opened ? undefined : { scale: 1.14 }}
              whileTap={opened ? undefined : { scale: 0.9 }}
              animate={
                opened
                  ? reduced
                    ? {}
                    : {
                        scale: 1.22,
                        opacity: 0,
                        transition: {
                          delay: T_SEAL_OUT,
                          duration: 0.6,
                          ease: "easeIn",
                        },
                      }
                  : {
                      scale: [1, 1.04, 1],
                      transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
                    }
              }
            >
              {/* red glow ring — blooms in behind the seal on hover */}
              {!opened && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute -inset-[45%] -z-10 rounded-full opacity-0 blur-xl transition-opacity duration-500 ease-out group-hover:opacity-90"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255,90,70,0.9) 0%, rgba(220,40,30,0.55) 45%, transparent 72%)",
                  }}
                />
              )}
              <svg
                viewBox="0 0 200 200"
                className="absolute inset-0 h-full w-full transition-[filter] duration-500 ease-out group-hover:[filter:drop-shadow(0_10px_18px_rgba(60,20,15,0.55))_drop-shadow(0_0_22px_rgba(255,70,50,0.85))]"
                style={{
                  transform: "rotate(-8deg)",
                  filter: "drop-shadow(0 10px 18px rgba(60,20,15,0.55))",
                }}
                aria-hidden
              >
                <defs>
                  <radialGradient id="waxBody" cx="36%" cy="30%" r="80%">
                    <stop offset="0%" stopColor="#b64a3c" />
                    <stop offset="38%" stopColor="#8e2b28" />
                    <stop offset="68%" stopColor="#6d1b20" />
                    <stop offset="100%" stopColor="#4a0f14" />
                  </radialGradient>
                  <radialGradient id="waxSheen" cx="32%" cy="24%" r="42%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.38)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </radialGradient>
                </defs>
                {/* uneven wax body */}
                <path d={WAX_PATH} fill="url(#waxBody)" />
                {/* soft top-left sheen */}
                <path d={WAX_PATH} fill="url(#waxSheen)" />
                {/* pressed inner disc: shadowed groove + raised centre */}
                <circle
                  cx="100"
                  cy="100"
                  r="62"
                  fill="none"
                  stroke="rgba(0,0,0,0.32)"
                  strokeWidth="6"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="58"
                  fill="none"
                  stroke="rgba(255,200,150,0.16)"
                  strokeWidth="2"
                />
                {/* fine beaded ring for a premium pressed-die look */}
                <circle
                  cx="100"
                  cy="100"
                  r="50"
                  fill="none"
                  stroke="rgba(243,217,172,0.35)"
                  strokeWidth="1.4"
                  strokeDasharray="0.5 4.5"
                  strokeLinecap="round"
                />
              </svg>
              {/* molten-gold heat rising through the wax on tap — the
                  video's lit-from-within look; rim stays dark */}
              {opened && !reduced && (
                <motion.svg
                  viewBox="0 0 200 200"
                  className="absolute inset-0 h-full w-full"
                  style={{ transform: "rotate(-8deg)" }}
                  aria-hidden
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1] }}
                  transition={{ delay: 0.05, duration: 0.6, times: [0, 0.6, 1] }}
                >
                  <defs>
                    <radialGradient id="molten" cx="50%" cy="46%" r="60%">
                      <stop offset="0%" stopColor="#ffeaae" />
                      <stop offset="30%" stopColor="#f8bd58" />
                      <stop offset="58%" stopColor="#cf7526" />
                      <stop offset="82%" stopColor="rgba(140,50,30,0.35)" />
                      <stop offset="100%" stopColor="rgba(109,27,32,0)" />
                    </radialGradient>
                  </defs>
                  <path d={WAX_PATH} fill="url(#molten)" />
                </motion.svg>
              )}
              {/* script monogram — gold-foil gradient with a debossed edge */}
              <span
                aria-hidden
                className="absolute inset-0 flex flex-col items-center justify-center select-none"
              >
                <span
                  className="font-script italic leading-none"
                  style={{
                    fontSize: "min(11vw, 48px)",
                    backgroundImage:
                      "linear-gradient(170deg, #f9e7bd 8%, #ecc27c 38%, #c9924a 62%, #eed3a0 88%)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    filter:
                      "drop-shadow(0 -1px 0 rgba(0,0,0,0.55)) drop-shadow(0 1px 0.5px rgba(255,228,180,0.25))",
                  }}
                >
                  L&amp;V
                </span>
                <span
                  className="mt-1 font-heading uppercase"
                  style={{
                    fontSize: "min(2.4vw, 9px)",
                    letterSpacing: "0.42em",
                    color: "rgba(243,217,172,0.75)",
                    textShadow: "0 -1px 1px rgba(0,0,0,0.5)",
                  }}
                >
                  2026
                </span>
              </span>
            </motion.button>

            {/* hint */}
            <motion.p
              className="absolute inset-x-0 bottom-[9svh] z-30 text-center text-[11px] uppercase tracking-[0.35em] text-[#9a7340]"
              initial={{ opacity: 0 }}
              animate={{ opacity: opened ? 0 : [0.5, 1, 0.5] }}
              transition={
                opened
                  ? { duration: 0.3 }
                  : { duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }
              }
            >
              Tap the seal to open
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
