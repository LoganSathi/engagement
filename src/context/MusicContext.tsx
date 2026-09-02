"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";

const VIDEO_ID = "tQ0aAZcFkew";
const PLAYER_ELEMENT_ID = "bg-music-player";

interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setVolume: (volume: number) => void;
  getVolume: () => number;
}

interface YTNamespace {
  Player: new (
    elementId: string,
    options: {
      videoId: string;
      playerVars: Record<string, number | string>;
      events: {
        onReady: (event: { target: YTPlayerInstance }) => void;
      };
    }
  ) => YTPlayerInstance;
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface MusicContextValue {
  ready: boolean;
  muted: boolean;
  play: () => void;
  toggle: () => void;
  duck: (amount?: number, durationMs?: number) => void;
}

const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const playerRef = useRef<YTPlayerInstance | null>(null);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function createPlayer() {
      playerRef.current = new window.YT!.Player(PLAYER_ELEMENT_ID, {
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 0,
          mute: 1,
          loop: 1,
          playlist: VIDEO_ID,
          controls: 0,
          playsinline: 1,
          modestbranding: 1,
          start: 1,
        },
        events: {
          onReady: () => {
            setReady(true);
          },
        },
      });
    }

    if (window.YT?.Player) {
      createPlayer();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prevCallback?.();
        createPlayer();
      };
      if (!document.getElementById("youtube-iframe-api")) {
        const script = document.createElement("script");
        script.id = "youtube-iframe-api";
        script.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(script);
      }
    }
  }, []);

  function play() {
    const player = playerRef.current;
    if (!player) return;
    player.unMute();
    player.playVideo();
    setMuted(false);
  }

  function toggle() {
    const player = playerRef.current;
    if (!player) return;
    if (muted) {
      play();
    } else {
      player.mute();
      setMuted(true);
    }
  }

  // briefly lowers bg music volume for a scroll-triggered chime, then restores it
  function duck(amount = 35, durationMs = 900) {
    const player = playerRef.current;
    if (!player || muted) return;
    const original = player.getVolume();
    player.setVolume(Math.max(original - amount, 15));
    window.setTimeout(() => player.setVolume(original), durationMs);
  }

  return (
    <MusicContext.Provider value={{ ready, muted, play, toggle, duck }}>
      {children}
      <div
        id={PLAYER_ELEMENT_ID}
        aria-hidden
        style={{
          position: "fixed",
          width: 1,
          height: 1,
          top: 0,
          left: 0,
          opacity: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      />
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used within MusicProvider");
  return ctx;
}
