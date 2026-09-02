"use client";

import { useEffect, useRef, useState } from "react";
import { useMusic } from "@/context/MusicContext";

const PLAY_SECONDS = 7;

export default function IntroVideo() {
  const { play: playMusic } = useMusic();
  const videoRef = useRef<HTMLVideoElement>(null);
  const bgVideoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [skip, setSkip] = useState(false);
  const [opened, setOpened] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [visible, setVisible] = useState(true);
  const [origin, setOrigin] = useState({ x: "50%", y: "50%" });
  const [rippleKey, setRippleKey] = useState(0);

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem("lv_visited")) {
      setSkip(true);
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = !skip && visible ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [skip, visible]);

  // Force the browser to paint the first frame so the video shows a static
  // preview instead of a blank/black box before playback starts.
  useEffect(() => {
    const videos = [videoRef.current, bgVideoRef.current].filter(
      (v): v is HTMLVideoElement => !!v
    );
    function showFirstFrame(this: HTMLVideoElement) {
      this.currentTime = 0.05;
    }
    videos.forEach((v) => v.addEventListener("loadedmetadata", showFirstFrame));
    return () =>
      videos.forEach((v) => v.removeEventListener("loadedmetadata", showFirstFrame));
  }, []);

  function handleOpen(e: React.MouseEvent<HTMLDivElement>) {
    if (opened) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin({ x: `${x}%`, y: `${y}%` });
    setRippleKey((k) => k + 1);
    sessionStorage.setItem("lv_visited", "1");
    setOpened(true);

    const video = videoRef.current;
    const bgVideo = bgVideoRef.current;
    [video, bgVideo].forEach((v) => {
      if (v) {
        v.currentTime = 0;
        v.play().catch(() => {});
      }
    });

    setTimeout(() => {
      video?.pause();
      bgVideo?.pause();
      setRevealing(true);
      playMusic();
    }, PLAY_SECONDS * 1000);
    setTimeout(() => setVisible(false), PLAY_SECONDS * 1000 + 1400);
  }

  if (skip || !mounted) return null;

  return (
    <div
      onClick={handleOpen}
      className={`fixed inset-0 z-[2000] overflow-hidden cursor-pointer bg-[var(--navy-deep)] transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{
        clipPath: revealing
          ? `circle(0px at ${origin.x} ${origin.y})`
          : `circle(150vmax at ${origin.x} ${origin.y})`,
        transition: "clip-path 1.2s cubic-bezier(.4,0,.2,1)",
      }}
    >
      {/* ambient blurred backdrop — fills wide desktop screens instead of
          leaving empty bars around the portrait video */}
      <video
        ref={bgVideoRef}
        src="/videos/intro.mp4"
        muted
        playsInline
        preload="auto"
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl brightness-[0.55] saturate-125"
      />

      {/* sharp foreground video, always shown at its true aspect ratio so it
          never looks stretched or over-cropped on any screen shape */}
      <div className="absolute inset-0 flex items-center justify-center p-0 sm:p-8">
        <video
          ref={videoRef}
          src="/videos/intro.mp4"
          muted
          playsInline
          preload="auto"
          className="max-w-full max-h-full object-contain sm:rounded-2xl sm:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
        />
      </div>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/45" />

      {!opened && (
        <div className="absolute inset-x-0 bottom-16 flex flex-col items-center gap-3 px-4">
          <span className="px-6 py-3 rounded-full bg-[var(--cream)]/90 border border-[var(--gold)] text-[var(--ink)] font-heading tracking-wide shadow-lg animate-pulse-soft">
            ✦ Tap to Enter ✦
          </span>
        </div>
      )}

      {revealing && (
        <div
          key={rippleKey}
          className="absolute pointer-events-none"
          style={{ left: origin.x, top: origin.y }}
        >
          {[0, 0.18, 0.36].map((d) => (
            <div
              key={d}
              className="absolute rounded-full border-[var(--gold-light)]"
              style={{
                width: 500,
                height: 500,
                left: 0,
                top: 0,
                animation: "ripple-ring 1.2s ease-out forwards",
                animationDelay: `${d}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
