"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Brand } from "@/components/ui/brand";
import { LinkArrow } from "@/components/ui/glyph";
import { SectionLink } from "@/components/ui/section-link";
import { site, type NavLink } from "@/config/site";

// Matches the stylesheet: the mobile menu only exists at max-width 700px.
const DESKTOP_QUERY = "(min-width: 701px)";

function NavLinks({
  onNavigate,
  withCta = false,
}: {
  onNavigate?: () => void;
  withCta?: boolean;
}) {
  return site.nav.map((link: NavLink) => (
    <SectionLink
      key={link.href}
      href={link.href}
      onClick={onNavigate}
      className={withCta && link.cta ? "nav-cta" : undefined}
    >
      {link.label}
    </SectionLink>
  ));
}

export function SiteHeader() {
  const pathname = usePathname();
  // Remember which page the menu was opened on, so a route change closes it
  // without an effect.
  const [openOnPath, setOpenOnPath] = useState<string | null>(null);
  const open = openOnPath === pathname;
  const close = () => setOpenOnPath(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  // Compact, frosted header once the page has scrolled.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpenOnPath(null);
      toggleRef.current?.focus();
    };
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const onViewportChange = () => {
      if (desktop.matches) setOpenOnPath(null);
    };
    // The open menu covers the page: stop the page scrolling underneath and
    // take it out of the tab order and accessibility tree until it closes.
    const behind = [...document.querySelectorAll<HTMLElement>("main, footer")];
    const root = document.documentElement;
    behind.forEach((el) => (el.inert = true));
    root.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onViewportChange);
    return () => {
      behind.forEach((el) => (el.inert = false));
      root.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onViewportChange);
    };
  }, [open]);

  return (
    <>
      <header
        data-scrolled={scrolled ? "" : undefined}
        data-menu-open={open ? "" : undefined}
      >
        <Brand />
        <nav aria-label="Main navigation">
          <NavLinks withCta />
        </nav>
        <button
          ref={toggleRef}
          id="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpenOnPath(open ? null : pathname)}
        >
          {/* Two lines that turn into a cross (styles/design/header.css). */}
          <span className="menu-icon" aria-hidden="true" />
        </button>
      </header>
      <nav id="mobile-nav" aria-label="Mobile navigation" hidden={!open}>
        <div className="mobile-nav-links">
          <NavLinks onNavigate={close} />
        </div>
        <div className="mobile-nav-foot">
          <p>{site.tagline}</p>
          <SectionLink
            className="btn btn-gold"
            href="#restaurants"
            onClick={close}
          >
            Bring Tend to your restaurant <LinkArrow />
          </SectionLink>
        </div>
        {/* Large decorative wordmark closing the menu. */}
        <p className="mobile-nav-mark" aria-hidden="true">
          {site.name}
        </p>
      </nav>
    </>
  );
}
