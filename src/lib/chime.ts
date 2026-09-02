export type ChimeKind = "whoosh" | "bell" | "sparkle" | "chime";

let ctx: AudioContext | null = null;

/** Creates/resumes the shared AudioContext. Call from a user-gesture handler — browsers block audio until then. */
export function unlockAudio() {
  if (typeof window === "undefined") return;
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === "suspended") ctx.resume();
}

function tone(
  c: AudioContext,
  freq: number,
  start: number,
  dur: number,
  peak: number,
  type: OscillatorType = "sine"
) {
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t0 = c.currentTime + start;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(peak, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

function whooshNoise(c: AudioContext) {
  const dur = 0.5;
  const buffer = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }
  const src = c.createBufferSource();
  src.buffer = buffer;
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 900;
  filter.Q.value = 0.7;
  const gain = c.createGain();
  const t0 = c.currentTime;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(0.16, t0 + 0.15);
  gain.gain.linearRampToValueAtTime(0, t0 + dur);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(c.destination);
  src.start();
}

/** Plays a short synthesized tone — no audio assets needed. No-op until unlockAudio() has run. */
export function playChime(kind: ChimeKind) {
  if (!ctx) return;
  const c = ctx;
  switch (kind) {
    case "bell":
      tone(c, 880, 0, 0.9, 0.05);
      tone(c, 1320, 0.05, 0.8, 0.03);
      break;
    case "whoosh":
      whooshNoise(c);
      break;
    case "sparkle":
      [1760, 2093, 2637].forEach((f, i) =>
        tone(c, f, i * 0.08, 0.35, 0.025, "triangle")
      );
      break;
    case "chime":
      tone(c, 660, 0, 1.1, 0.05);
      tone(c, 990, 0.1, 1.0, 0.035);
      tone(c, 1320, 0.2, 0.9, 0.025);
      break;
  }
}
