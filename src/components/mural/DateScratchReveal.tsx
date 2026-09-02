"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import RevealSection from "@/components/RevealSection";
import { EVENT_TARGET_MS } from "@/lib/event";
import { fireBurst } from "@/lib/burst";

function getParts(diffMs: number) {
  const diff = Math.max(diffMs, 0);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins: Math.floor((diff % 3600000) / 60000),
    secs: Math.floor((diff % 60000) / 1000),
  };
}

const REVEAL_AT = 0.45; // scratched fraction that auto-clears the foil
const STORAGE_KEY = "lv_date_revealed";

const SPARKS = [
  { dx: -70, dy: -46 },
  { dx: 70, dy: -52 },
  { dx: -104, dy: 8 },
  { dx: 104, dy: 2 },
  { dx: -52, dy: 54 },
  { dx: 52, dy: 60 },
  { dx: 0, dy: -70 },
  { dx: 0, dy: 74 },
];

/**
 * S5a — save-the-date moment. A gold scratch-foil card hides the date;
 * guests rub it away (pointer or keyboard fallback) and the countdown
 * ticker blooms underneath. Reveal state persists in localStorage so
 * returning guests land on the ticking card directly.
 */
export default function DateScratchReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const scratching = useRef(false);
  const strokes = useRef(0);
  const [revealed, setRevealed] = useState(false);
  const [foilGone, setFoilGone] = useState(false);
  const [parts, setParts] = useState<ReturnType<typeof getParts> | null>(null);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) {
      setRevealed(true);
      setFoilGone(true);
    }
  }, []);

  // countdown ticks only once the date is out
  useEffect(() => {
    if (!revealed) return;
    function tick() {
      setParts(getParts(EVENT_TARGET_MS - Date.now()));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [revealed]);

  // paint the gold foil; repaint on resize while unscratched
  useEffect(() => {
    if (foilGone) return;
    const canvas = canvasRef.current;
    const card = cardRef.current;
    if (!canvas || !card) return;

    function paint() {
      if (!canvas || !card) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = card.offsetWidth;
      const h = card.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "#d9a53c");
      grad.addColorStop(0.35, "#f3d27a");
      grad.addColorStop(0.55, "#c9972c");
      grad.addColorStop(0.8, "#eec45f");
      grad.addColorStop(1, "#b8862f");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      // soft sheen stripes
      ctx.fillStyle = "rgba(255,255,255,0.14)";
      for (let x = -h; x < w; x += 56) {
        ctx.beginPath();
        ctx.moveTo(x, h);
        ctx.lineTo(x + h, 0);
        ctx.lineTo(x + h + 14, 0);
        ctx.lineTo(x + 14, h);
        ctx.fill();
      }
      ctx.fillStyle = "#5a3a08";
      ctx.font = "600 15px var(--font-heading, serif)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("✨ Scratch to reveal ✨", w / 2, h / 2);
    }

    paint();
    window.addEventListener("resize", paint);
    return () => window.removeEventListener("resize", paint);
  }, [foilGone]);

  function reveal() {
    if (revealed) return;
    setRevealed(true);
    localStorage.setItem(STORAGE_KEY, "1");
    setTimeout(() => setFoilGone(true), 700);
    const rect = cardRef.current?.getBoundingClientRect();
    fireBurst({
      x: rect ? rect.left + rect.width / 2 : undefined,
      y: rect ? rect.top + rect.height / 2 : undefined,
      count: 26,
    });
  }

  function scratchAt(clientX: number, clientY: number) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = canvas.width / rect.width;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(
      (clientX - rect.left) * dpr,
      (clientY - rect.top) * dpr,
      26 * dpr,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.restore();

    // sample cleared fraction every few strokes — getImageData is pricey
    strokes.current += 1;
    if (strokes.current % 10 !== 0) return;
    const sample = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let clear = 0;
    let total = 0;
    for (let i = 3; i < sample.length; i += 64) {
      total += 1;
      if (sample[i] === 0) clear += 1;
    }
    if (clear / total > REVEAL_AT) reveal();
  }

  const display = parts ?? { days: 0, hours: 0, mins: 0, secs: 0 };

  return (
    <section className="relative -mt-px bg-[var(--invite-cream)] px-12 sm:px-6 pb-4">
      <RevealSection as="div" className="mx-auto max-w-xl text-center">
        <p className="font-script italic text-[var(--maroon)] text-lg mb-1">
          When&rsquo;s the big day?
        </p>
        <p className="text-xs text-[var(--ink)]/60 mb-6">
          {revealed ? "Mark your calendar ❁" : "Rub the gold foil to find out"}
        </p>

        {/* scratch card */}
        <div
          ref={cardRef}
          role="button"
          tabIndex={0}
          aria-label={
            revealed
              ? "Engagement date: Friday, September 11, 2026 at 7 PM"
              : "Scratch card — press Enter to reveal the engagement date"
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") reveal();
          }}
          className="relative mx-auto max-w-sm rounded-xl overflow-hidden border-2 border-[var(--gold)] shadow-[0_14px_36px_rgba(44,26,16,0.2)] select-none focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--gold-sun)]/60"
          style={{ aspectRatio: "16 / 8", touchAction: "none" }}
        >
          {/* the hidden date */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#fdf8ec] px-4">
            <span aria-hidden className="text-[var(--gold)] text-lg">
              ✦
            </span>
            <p className="mt-1 font-heading text-[clamp(1.3rem,5.5vw,1.8rem)] text-[var(--maroon)]">
              September 11, 2026
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.3em] text-[var(--ink)]/70">
              Friday · 7:10 PM ONWARDS
            </p>
          </div>

          {/* gold foil */}
          {!foilGone && (
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 h-full w-full cursor-pointer transition-opacity duration-700 ${
                revealed ? "opacity-0" : "opacity-100"
              }`}
              onPointerDown={(e) => {
                scratching.current = true;
                e.currentTarget.setPointerCapture(e.pointerId);
                scratchAt(e.clientX, e.clientY);
              }}
              onPointerMove={(e) => {
                if (scratching.current) scratchAt(e.clientX, e.clientY);
              }}
              onPointerUp={() => {
                scratching.current = false;
              }}
            />
          )}

          {/* burst when it opens */}
          {revealed && !foilGone && (
            <span className="absolute left-1/2 top-1/2 pointer-events-none">
              {SPARKS.map((s, i) => (
                <motion.span
                  key={i}
                  aria-hidden
                  className="absolute text-sm"
                  initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
                  animate={{ x: s.dx, y: s.dy, opacity: 0, scale: 1.25 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  ✨
                </motion.span>
              ))}
            </span>
          )}
        </div>

        {/* countdown blooms once revealed */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="mt-7"
            >
              <p className="font-script italic text-[var(--maroon)] text-base mb-3">
                Counting the days
              </p>
              <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
                {[
                  { label: "Days", value: display.days },
                  { label: "Hours", value: display.hours },
                  { label: "Mins", value: display.mins },
                  { label: "Secs", value: display.secs },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="cd-box !min-w-[62px] sm:!min-w-[74px]"
                  >
                    <div className="font-heading text-2xl sm:text-3xl text-[var(--maroon)]">
                      {String(item.value).padStart(2, "0")}
                    </div>
                    <div className="text-[0.62rem] uppercase tracking-wider text-[var(--ink)]/70 mt-1">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </RevealSection>
    </section>
  );
}
