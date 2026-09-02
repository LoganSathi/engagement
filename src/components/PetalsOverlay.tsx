"use client";

import { useEffect, useRef } from "react";
import { BURST_EVENT, BurstDetail } from "@/lib/burst";

const PETAL_CHARS = ["❀", "✿", "❁", "🌸"];

export default function PetalsOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function spawn(initial: boolean) {
      if (!container) return;
      const p = document.createElement("span");
      p.className = "petal";
      p.textContent =
        PETAL_CHARS[Math.floor(Math.random() * PETAL_CHARS.length)];
      const left = Math.random() * 100;
      const duration = 8 + Math.random() * 10;
      const drift = `${Math.random() * 80 - 40}px`;
      const delay = initial ? Math.random() * duration : 0;
      p.style.left = `${left}vw`;
      p.style.setProperty("--drift", drift);
      p.style.animationDuration = `${duration}s`;
      p.style.animationDelay = `-${delay}s`;
      p.style.fontSize = `${0.8 + Math.random() * 0.8}rem`;
      container.appendChild(p);
      setTimeout(() => p.remove(), (duration + delay + 1) * 1000);
    }

    // occasional butterfly gliding across, mixed in with the petals
    function spawnButterfly() {
      if (!container) return;
      const wrap = document.createElement("span");
      const duration = 14 + Math.random() * 8;
      wrap.className = `bfly${Math.random() < 0.5 ? " rtl" : ""}`;
      wrap.style.top = `${8 + Math.random() * 55}vh`;
      wrap.style.setProperty("--dur", `${duration}s`);
      wrap.style.fontSize = `${0.9 + Math.random() * 0.5}rem`;
      const inner = document.createElement("span");
      inner.className = "bfly-inner";
      inner.textContent = "🦋";
      wrap.appendChild(inner);
      container.appendChild(wrap);
      setTimeout(() => wrap.remove(), (duration + 1) * 1000);
    }

    // radiating burst — used for celebratory moments (date reveal, finale)
    function spawnBurstPetal(cx: number, cy: number) {
      if (!container) return;
      const p = document.createElement("span");
      p.className = "petal-burst";
      p.textContent =
        PETAL_CHARS[Math.floor(Math.random() * PETAL_CHARS.length)];
      const angle = Math.random() * Math.PI * 2;
      const dist = 90 + Math.random() * 160;
      const duration = 0.9 + Math.random() * 0.7;
      p.style.left = `${cx}px`;
      p.style.top = `${cy}px`;
      p.style.setProperty("--bx", `${Math.cos(angle) * dist}px`);
      p.style.setProperty("--by", `${Math.sin(angle) * dist}px`);
      p.style.setProperty("--bdur", `${duration}s`);
      p.style.fontSize = `${0.9 + Math.random() * 0.9}rem`;
      container.appendChild(p);
      setTimeout(() => p.remove(), (duration + 0.1) * 1000);
    }

    function onBurst(e: Event) {
      const detail = (e as CustomEvent<BurstDetail>).detail ?? {};
      const cx = detail.x ?? window.innerWidth / 2;
      const cy = detail.y ?? window.innerHeight / 2;
      const count = detail.count ?? 24;
      for (let i = 0; i < count; i++) spawnBurstPetal(cx, cy);
    }

    for (let i = 0; i < 18; i++) spawn(true);
    const interval = setInterval(() => spawn(false), 1400);
    spawnButterfly();
    const bflyInterval = setInterval(spawnButterfly, 9000);
    window.addEventListener(BURST_EVENT, onBurst);
    return () => {
      clearInterval(interval);
      clearInterval(bflyInterval);
      window.removeEventListener(BURST_EVENT, onBurst);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="fixed inset-0 pointer-events-none z-[5] overflow-hidden"
    />
  );
}
