/**
 * Collapses a high-frequency event (scroll/resize) down to at most one call
 * per animation frame — iOS in particular can fire many scroll events per
 * frame during momentum scrolling, and each call here does a forced layout
 * read (getBoundingClientRect), so un-throttled these stack up into jank.
 */
export function rafThrottle(fn: () => void) {
  let ticking = false;
  return () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      fn();
      ticking = false;
    });
  };
}
