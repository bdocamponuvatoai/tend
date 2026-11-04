import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** True when the visitor asks for reduced motion (false while prerendering). */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

/**
 * Eases a set of displayed numbers toward their new values (ease-out, about
 * half a second), so a change reads as movement rather than a jump. Instant
 * with reduced motion. For display only: announce final values separately.
 */
export function useTweened<T extends Record<string, number>>(
  target: T,
  duration = 450,
): T {
  const reduce = usePrefersReducedMotion();
  const [shown, setShown] = useState(target);
  const current = useRef(target);
  const key = JSON.stringify(target);

  useEffect(() => {
    if (reduce) {
      // Keep the start point current, so turning motion back on later eases
      // from the figure on screen.
      current.current = JSON.parse(key) as T;
      return;
    }
    const from = current.current;
    if (JSON.stringify(from) === key) return;
    const to = JSON.parse(key) as T;
    const start = performance.now();
    let frame = requestAnimationFrame(function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const next = Object.fromEntries(
        Object.keys(to).map((name) => [
          name,
          from[name] + (to[name] - from[name]) * eased,
        ]),
      ) as T;
      current.current = next;
      setShown(next);
      if (progress < 1) frame = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(frame);
  }, [key, duration, reduce]);

  return reduce ? target : shown;
}
