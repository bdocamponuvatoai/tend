"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { initProductsSection } from "@/lib/products-section";

/**
 * The section element for "What's taking shape". The markup inside is
 * server-rendered (and works without JavaScript); this only wires up the
 * reveal and phone walkthroughs, and tears them down on unmount.
 */
export function ProductsRoot({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    return initProductsSection(ref.current);
  }, []);
  return (
    <section ref={ref} className="ts-section products" id="products">
      {children}
    </section>
  );
}
