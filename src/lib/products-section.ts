import {
  DEMO_NAMES,
  DEMO_SIZES,
  DEMOS,
  demoSrc,
  type DemoId,
  type DemoScreen,
} from "@/content/product-demos";

/**
 * Behaviour for the "What's taking shape" section, ported from ojisak.com's
 * site.js with the same logic and timings: spotlights fade up as they scroll
 * into view, and each phone autoplays its walkthrough (tap ripple, then the
 * next screen). Autoplay pauses off-screen, on mouse hover or keyboard focus
 * and when the tab is hidden, and never starts for reduced-motion visitors.
 * Step buttons jump to any screen; on touch screens a swipe across the phone
 * goes forward or back.
 *
 * Everything is scoped to `root`. Returns a cleanup function that disconnects
 * observers, clears timers, removes listeners and undoes every DOM change, so
 * mounting twice (React development mode) leaves no duplicates.
 */

const STEP = 3600;
const TAP_LEAD = 950;
const MOVE = 800;

/** Escapes text interpolated into the markup built below. */
const esc = (text: string) =>
  text.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );

type Mode = "push" | "back" | "up" | "fade";
const FROM: Record<Mode, string> = {
  push: "translateX(100%)",
  back: "translateX(-30%)",
  up: "translateY(100%)",
  fade: "scale(1.08)",
};
const TO: Record<Mode, string> = {
  push: "translateX(-26%)",
  back: "translateX(100%)",
  up: "scale(.94)",
  fade: "scale(.96)",
};

export function initProductsSection(root: HTMLElement): () => void {
  const cleanups: (() => void)[] = [];
  const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reduced = reducedQuery.matches;
  const hasIO = "IntersectionObserver" in window;

  // Spotlights fade up as they scroll into view (only those still below the
  // fold, so nothing on screen flickers).
  if (!reduced && hasIO) {
    const show = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            show.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    const prime = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        prime.unobserve(el);
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) continue;
        const siblings = [...(el.parentElement?.children ?? [])];
        el.style.setProperty("--d", `${(siblings.indexOf(el) % 4) * 0.09}s`);
        el.classList.add("reveal");
        show.observe(el);
      }
    });
    const revealed = [
      ...root.querySelectorAll<HTMLElement>(".section-heading, .product"),
    ];
    revealed.forEach((el) => prime.observe(el));
    cleanups.push(() => {
      prime.disconnect();
      show.disconnect();
      revealed.forEach((el) => {
        el.classList.remove("reveal", "is-in");
        el.style.removeProperty("--d");
      });
    });
  }

  if (hasIO) {
    root
      .querySelectorAll<HTMLElement>(".app-demo[data-demo]")
      .forEach((demo) => cleanups.push(initDemo(demo, reduced, reducedQuery)));
  }

  return () => cleanups.forEach((fn) => fn());
}

function initDemo(
  demo: HTMLElement,
  reduced: boolean,
  reducedQuery: MediaQueryList,
): () => void {
  const id = demo.dataset.demo as DemoId;
  const SCREENS: DemoScreen[] | undefined = DEMOS[id];
  if (!SCREENS || SCREENS.length < 2) return () => {};
  const NAME = DEMO_NAMES[id] ?? "App";
  const screenBox = demo.querySelector<HTMLElement>(".phone-screen")!;
  const firstScreen = screenBox.querySelector<HTMLElement>(".screen")!;

  let screens: HTMLElement[] = [];
  let buttons: HTMLButtonElement[] = [];
  let caption: HTMLElement;
  let toggle: HTMLButtonElement;
  let tap: HTMLElement;
  let pulse: HTMLElement;
  let sheen: HTMLElement;
  let steps: HTMLElement | null = null;
  let idx = 0;
  let timer = 0;
  let tapTimer = 0;
  const moveTimers = new Set<number>();
  let built = false;
  let visible = false;
  let hovered = false;
  let focused = false;
  let userPaused = reduced;
  const listeners: (() => void)[] = [];
  const listen = <T extends EventTarget>(
    target: T,
    type: string,
    fn: EventListener,
    options?: AddEventListenerOptions,
  ) => {
    target.addEventListener(type, fn, options);
    listeners.push(() => target.removeEventListener(type, fn, options));
  };

  const running = () =>
    built && visible && !hovered && !focused && !userPaused && !document.hidden;
  const pictureFor = (s: DemoScreen) => {
    const p = document.createElement("picture");
    p.className = "screen";
    p.setAttribute("aria-hidden", "true");
    p.innerHTML = `<source type="image/avif" srcset="${demoSrc(id, s.file, 360, "avif")} 360w, ${demoSrc(id, s.file, 720, "avif")} 720w" sizes="${DEMO_SIZES}"><img src="${demoSrc(id, s.file, 360, "webp")}" srcset="${demoSrc(id, s.file, 360, "webp")} 360w, ${demoSrc(id, s.file, 720, "webp")} 720w" sizes="${DEMO_SIZES}" width="720" height="1620" alt="${esc(s.alt)}" decoding="async">`;
    return p;
  };
  const place = (el: HTMLElement, [x, y]: [number, number]) => {
    el.style.left = x + "%";
    el.style.top = y + "%";
  };
  const replay = (el: HTMLElement, cls: string) => {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  };
  // Restart the current step's progress bar so it always fills in step with the timer.
  const restartBar = () => {
    const bar = buttons[idx].querySelector<HTMLElement>(".bar i")!;
    bar.style.animation = "none";
    void bar.offsetWidth;
    bar.style.animation = "";
  };

  // Move from the current screen to screen i.
  function show(i: number, mode: Mode) {
    if (i === idx) return;
    const cur = screens[idx];
    const next = screens[i];
    next.style.transition = "none";
    next.style.transform = FROM[mode];
    next.style.opacity = mode === "fade" ? "0" : "1";
    next.style.zIndex = "3";
    void next.offsetWidth;
    next.style.transition = "";
    next.style.transform = "none";
    next.style.opacity = "1";
    next.classList.add("is-active");
    cur.style.zIndex = "2";
    cur.style.transform = TO[mode];
    cur.style.filter = mode === "back" ? "" : "brightness(.55)";
    if (mode === "fade") cur.style.opacity = "0";
    cur.classList.remove("is-active");
    const settle = window.setTimeout(() => {
      moveTimers.delete(settle);
      if (cur === screens[idx]) return;
      cur.style.transition = "none";
      cur.style.transform = "translateX(100%)";
      cur.style.filter = "";
      cur.style.opacity = "1";
      cur.style.zIndex = "0";
    }, MOVE + 50);
    moveTimers.add(settle);
    cur.setAttribute("aria-hidden", "true");
    next.removeAttribute("aria-hidden");
    idx = i;
    buttons.forEach((b, n) => {
      if (n === i) b.setAttribute("aria-current", "step");
      else b.removeAttribute("aria-current");
      b.classList.toggle("is-done", n < i);
    });
    restartBar();
    caption.textContent = SCREENS![i].label;
    replay(caption, "is-on");
    replay(sheen, "is-on");
    const target = SCREENS![i].pulse;
    if (target) {
      place(pulse, target);
      replay(pulse, "is-on");
    } else pulse.classList.remove("is-on");
  }

  function schedule() {
    clearTimeout(timer);
    clearTimeout(tapTimer);
    demo.classList.toggle("is-paused", !running());
    if (!running()) return;
    // Each (re)start runs a full step, so a resumed bar restarts too instead of finishing early.
    restartBar();
    const target = SCREENS![idx].tap;
    if (target)
      tapTimer = window.setTimeout(() => {
        place(tap, target);
        replay(tap, "is-on");
      }, STEP - TAP_LEAD);
    timer = window.setTimeout(() => {
      const n = (idx + 1) % SCREENS!.length;
      show(n, n === 0 ? "fade" : (SCREENS![n].enter ?? "push"));
      schedule();
    }, STEP);
  }

  function build() {
    built = true;
    screens = [firstScreen, ...SCREENS!.slice(1).map(pictureFor)];
    screens.slice(1).forEach((p) => screenBox.append(p));
    tap = document.createElement("span");
    tap.className = "demo-tap";
    pulse = document.createElement("span");
    pulse.className = "demo-pulse";
    sheen = document.createElement("span");
    sheen.className = "demo-sheen";
    screenBox.append(tap, pulse, sheen);
    steps = document.createElement("div");
    steps.className = "demo-steps";
    steps.setAttribute("role", "group");
    steps.setAttribute("aria-label", `${NAME} walkthrough steps`);
    steps.style.setProperty("--count", String(SCREENS!.length));
    demo.style.setProperty("--step", STEP / 1000 + "s");
    steps.innerHTML =
      "<ol>" +
      SCREENS!
        .map(
          (s, n) =>
            `<li><button type="button" aria-label="${String(n + 1).padStart(2, "0")} ${esc(s.label)}"><span class="n">${String(n + 1).padStart(2, "0")}</span> <span class="t">${esc(s.label)}</span><span class="bar"><i></i></span></button></li>`,
        )
        .join("") +
      '</ol><p class="demo-caption"></p><button class="demo-toggle" type="button">PAUSE</button>';
    demo.append(steps);
    buttons = [...steps.querySelectorAll<HTMLButtonElement>("li button")];
    caption = steps.querySelector<HTMLElement>(".demo-caption")!;
    toggle = steps.querySelector<HTMLButtonElement>(".demo-toggle")!;
    buttons[0].setAttribute("aria-current", "step");
    caption.textContent = SCREENS![0].label;
    buttons.forEach((b, n) =>
      b.addEventListener("click", () => {
        show(n, n > idx ? (SCREENS![n].enter ?? "push") : "back");
        schedule();
      }),
    );
    // The label names the action and the walkthrough, so the two demos' buttons are distinguishable.
    const syncToggle = () => {
      toggle.textContent = userPaused ? "PLAY" : "PAUSE";
      toggle.setAttribute(
        "aria-label",
        `${userPaused ? "Play" : "Pause"} ${NAME} walkthrough`,
      );
      demo.classList.toggle("is-static", userPaused);
    };
    toggle.addEventListener("click", () => {
      userPaused = !userPaused;
      syncToggle();
      schedule();
    });
    syncToggle();
    // Switching on reduced motion while the page is open stops autoplay.
    listen(reducedQuery, "change", (e) => {
      if ((e as MediaQueryListEvent).matches) {
        userPaused = true;
        syncToggle();
        schedule();
      }
    });
    demo.classList.add("is-live");
    // Only a mouse pauses on hover: touch fires pointerenter without a matching leave, which would stall autoplay.
    listen(demo, "pointerenter", (e) => {
      if ((e as PointerEvent).pointerType === "mouse") {
        hovered = true;
        schedule();
      }
    });
    listen(demo, "pointerleave", (e) => {
      if ((e as PointerEvent).pointerType === "mouse") {
        hovered = false;
        schedule();
      }
    });
    listen(demo, "focusin", (e) => {
      if ((e.target as Element).matches(":focus-visible")) {
        focused = true;
        schedule();
      }
    });
    listen(demo, "focusout", (e) => {
      if (!demo.contains((e as FocusEvent).relatedTarget as Node | null)) {
        focused = false;
        schedule();
      }
    });
    listen(document, "visibilitychange", schedule);
    // Swipe across the phone: left for the next screen, right for the previous one.
    let x0: number | null = null;
    let y0 = 0;
    listen(
      screenBox,
      "touchstart",
      (e) => {
        const t = (e as TouchEvent).touches[0];
        x0 = t.clientX;
        y0 = t.clientY;
      },
      { passive: true },
    );
    listen(
      screenBox,
      "touchend",
      (e) => {
        if (x0 === null) return;
        const t = (e as TouchEvent).changedTouches[0];
        const dx = t.clientX - x0;
        const dy = t.clientY - y0;
        x0 = null;
        if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
        if (dx < 0 && idx < SCREENS!.length - 1)
          show(idx + 1, SCREENS![idx + 1].enter ?? "push");
        else if (dx > 0 && idx > 0) show(idx - 1, "back");
        schedule();
      },
      { passive: true },
    );
    schedule();
  }

  const loader = new IntersectionObserver(
    (entries, io) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        build();
      }
    },
    { rootMargin: "400px 0px" },
  );
  loader.observe(demo);
  const watcher = new IntersectionObserver(
    (entries) => {
      // Several entries can queue up during a fast scroll; the last is current.
      visible = entries[entries.length - 1].isIntersecting;
      if (visible) demo.classList.add("is-in");
      if (built) schedule();
    },
    { threshold: 0.3 },
  );
  watcher.observe(demo);

  return () => {
    loader.disconnect();
    watcher.disconnect();
    clearTimeout(timer);
    clearTimeout(tapTimer);
    moveTimers.forEach((t) => clearTimeout(t));
    listeners.forEach((off) => off());
    if (!built) return;
    // Put the server-rendered markup back exactly as it was.
    screens.slice(1).forEach((p) => p.remove());
    tap.remove();
    pulse.remove();
    sheen.remove();
    steps?.remove();
    firstScreen.className = "screen is-active";
    firstScreen.removeAttribute("style");
    firstScreen.removeAttribute("aria-hidden");
    demo.classList.remove("is-live", "is-in", "is-paused", "is-static");
    demo.style.removeProperty("--step");
  };
}
