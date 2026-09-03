"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";

// native <audio> element — no cross-origin iframe, no external API script
// to load, no postMessage round-trip. play()/pause() run synchronously in
// the same document as the tap that calls them, which is the one pattern
// iOS Safari reliably honors as a real user gesture.
const TRACK_SRC = "/audio/theme.mp3";

interface MusicContextValue {
  ready: boolean;
  muted: boolean;
  play: () => void;
  toggle: () => void;
  duck: (amount?: number, durationMs?: number) => void;
}

const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.readyState >= 3) setReady(true);
  }, []);

  function play() {
    audioRef.current?.play().catch(() => {
      // blocked (autoplay policy / not a genuine gesture) — the visible
      // SoundToggle stays an honest retry target since onPlay never fires
    });
  }

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      play();
    } else {
      audio.pause();
    }
  }

  // briefly lowers bg music volume for a scroll-triggered chime, then restores it
  function duck(amount = 35, durationMs = 900) {
    const audio = audioRef.current;
    if (!audio || muted) return;
    const original = audio.volume;
    audio.volume = Math.max(original - amount / 100, 0.15);
    window.setTimeout(() => {
      if (audioRef.current) audioRef.current.volume = original;
    }, durationMs);
  }

  return (
    <MusicContext.Provider value={{ ready, muted, play, toggle, duck }}>
      {children}
      <audio
        ref={audioRef}
        src={TRACK_SRC}
        loop
        preload="auto"
        onCanPlay={() => setReady(true)}
        onPlay={() => setMuted(false)}
        onPause={() => setMuted(true)}
        aria-hidden
        style={{ display: "none" }}
      />
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used within MusicProvider");
  return ctx;
}
