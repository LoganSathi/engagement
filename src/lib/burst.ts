export const BURST_EVENT = "lv:burst";

export interface BurstDetail {
  x?: number;
  y?: number;
  count?: number;
}

/** Fires a confetti/petal burst from PetalsOverlay at a screen point (defaults to center). */
export function fireBurst(detail: BurstDetail = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<BurstDetail>(BURST_EVENT, { detail }));
}
