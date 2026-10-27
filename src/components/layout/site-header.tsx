"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Brand } from "@/components/ui/brand";
import { SmartLink } from "@/components/ui/smart-link";
import { site } from "@/config/site";

// Matches the stylesheet: the mobile menu only exists at max-width 700px.
const DESKTOP_QUERY = "(min-width: 701px)";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return site.nav.map((link) => (
    <SmartLink key={link.href} href={link.href} onClick={onNavigate}>
      {link.label}
    </SmartLink>
  ));
}

export function SiteHeader() {
  const pathname = usePathname();
  // Remember which page the menu was opened on, so a route change closes it
  // without an effect.
  const [openOnPath, setOpenOnPath] = useState<string | null>(null);
  const open = openOnPath === pathname;
  const toggleRef = useRef<HTMLButtonElement>(null);

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
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onViewportChange);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onViewportChange);
    };
  }, [open]);

  return (
    <>
      <header>
        <Brand />
        <nav aria-label="Main navigation">
          <NavLinks />
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
          {open ? "×" : "☰"}
        </button>
      </header>
      <nav id="mobile-nav" aria-label="Mobile navigation" hidden={!open}>
        <NavLinks onNavigate={() => setOpenOnPath(null)} />
      </nav>
    </>
  );
}
