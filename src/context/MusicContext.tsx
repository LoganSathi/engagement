"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";

const VIDEO_ID = "RG_63ln6qkI";
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
        onStateChange?: (event: { data: number }) => void;
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
          // start unmuted at the API level (nothing plays yet — autoplay is
          // off) so the tap only has to call playVideo(), not unMute() too.
          // iOS Safari's user-activation propagates to a cross-origin
          // iframe's postMessage API very narrowly; an unMute() call after
          // the fact routinely gets dropped there, leaving playback silent.
          mute: 0,
          loop: 1,
          playlist: VIDEO_ID,
          controls: 0,
          playsinline: 1,
          modestbranding: 1,
          start: 0,
        },
        events: {
          onReady: () => {
            setReady(true);
          },
          onStateChange: (event) => {
            // reflect the player's *actual* state rather than assuming the
            // tap succeeded — if iOS blocks playback, state never reaches
            // 1 (playing), so muted stays true and the visible SoundToggle
            // remains an honest retry target
            setMuted(event.data !== 1);
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
    // playVideo() first — same-gesture call the iframe API actually honors
    // on iOS. unMute() is a defensive follow-up, not the primary unlock.
    player.playVideo();
    player.unMute();
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
