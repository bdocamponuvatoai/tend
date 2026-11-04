"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Floating "Back to top" button. Appears after about one screen of scrolling;
 * its gold ring fills with reading progress. Scrolls smoothly (instantly with
 * reduced motion) and moves keyboard focus to the start of the content.
 * Styles: styles/design/system.css (.to-top).
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const ring = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      setVisible(window.scrollY > window.innerHeight * 0.8);
      // pathLength is 1, so the offset is the unfilled share of the ring.
      ring.current?.style.setProperty("stroke-dashoffset", `${1 - progress}`);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    window.scrollTo({ top: 0, behavior: reduce.matches ? "auto" : "smooth" });
    // Keyboard and screen-reader users continue from the top too.
    const main = document.getElementById("main");
    if (main) {
      if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: true });
    }
  };

  return (
    <button
      type="button"
      className="to-top"
      aria-label="Back to top"
      data-visible={visible ? "" : undefined}
      onClick={toTop}
    >
      <svg className="to-top-ring" viewBox="0 0 52 52" aria-hidden="true">
        <circle className="to-top-track" cx="26" cy="26" r="24" />
        <circle
          ref={ring}
          className="to-top-progress"
          cx="26"
          cy="26"
          r="24"
          pathLength={1}
        />
      </svg>
      <ArrowUp size={18} strokeWidth={1.75} aria-hidden="true" />
    </button>
  );
}
