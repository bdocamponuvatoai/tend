"use client";

import { useEffect } from "react";
import { initReveal } from "@/lib/reveal";

// Cards and headings that fade up into view (the product section has its own).
const REVEAL = [
  ".benefits-heading",
  ".benefit-grid > article",
  ".benefits-bottom",
  ".intro-grid",
  ".steps > article",
  ".showcase-heading",
  ".directory-heading",
  ".feature-directory-grid > article",
  ".restaurant-heading",
  ".restaurant-grid > article",
  ".research-heading",
  ".research-grid > article",
  ".estimator-heading",
  ".estimator-grid > *",
  ".manifesto > *",
  ".faq-list > details",
  ".closing",
].join(", ");

export function ScrollReveal() {
  useEffect(() => initReveal(REVEAL), []);
  return null;
}
