"use client";

import { useMusic } from "@/context/MusicContext";

export default function SoundToggle() {
  const { muted, ready, toggle } = useMusic();

  return (
    <button
      onClick={toggle}
      disabled={!ready}
      aria-label="Toggle background music"
      className="fixed bottom-[18px] right-[18px] z-50 w-12 h-12 rounded-full bg-[var(--navy)]/85 border border-[var(--gold)] text-[var(--gold-light)] text-xl flex items-center justify-center backdrop-blur-sm disabled:opacity-60"
    >
      {muted ? "🔇" : "🔊"}
    </button>
  );
}
