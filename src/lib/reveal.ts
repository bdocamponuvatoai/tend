/**
 * Scroll reveal: elements matching `selector` that start below the fold fade
 * up as they enter the viewport, staggered within their row. Elements already
 * on screen are left alone, so nothing visible flickers. Does nothing for
 * reduced-motion visitors or without IntersectionObserver; without JavaScript
 * everything is simply shown. Returns a cleanup that undoes every change.
 */
export function initReveal(selector: string): () => void {
  if (
    !("IntersectionObserver" in window) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return () => {};

  const targets = [...document.querySelectorAll<HTMLElement>(selector)];
  const show = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-revealed");
        show.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
  );
  const prime = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const el = entry.target as HTMLElement;
      prime.unobserve(el);
      if (entry.isIntersecting || entry.boundingClientRect.top < 0) continue;
      const siblings = [...(el.parentElement?.children ?? [])];
      el.style.setProperty(
        "--reveal-delay",
        `${(siblings.indexOf(el) % 4) * 70}ms`,
      );
      el.classList.add("scroll-reveal");
      show.observe(el);
    }
  });
  targets.forEach((el) => prime.observe(el));

  return () => {
    prime.disconnect();
    show.disconnect();
    targets.forEach((el) => {
      el.classList.remove("scroll-reveal", "is-revealed");
      el.style.removeProperty("--reveal-delay");
    });
  };
}
