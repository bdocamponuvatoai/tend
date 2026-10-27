import localFont from "next/font/local";

// Self-hosted copies of the Google Fonts files the original site loaded
// (latin subset). Each family is one variable file declared once per weight,
// exactly as the Google Fonts stylesheet did, so weights resolve identically.
// `adjustFontFallback` is off so glyphs the files lack (→, ↗, ✳) fall through
// to the same system fonts as before.

export const dmSans = localFont({
  src: [
    { path: "../assets/fonts/dm-sans-latin.woff2", weight: "400" },
    { path: "../assets/fonts/dm-sans-latin.woff2", weight: "450" },
    { path: "../assets/fonts/dm-sans-latin.woff2", weight: "500" },
    { path: "../assets/fonts/dm-sans-latin.woff2", weight: "600" },
    { path: "../assets/fonts/dm-sans-latin.woff2", weight: "650" },
    { path: "../assets/fonts/dm-sans-latin.woff2", weight: "700" },
  ],
  variable: "--font-dm-sans",
  display: "swap",
  adjustFontFallback: false,
});

export const cormorant = localFont({
  src: [
    { path: "../assets/fonts/cormorant-garamond-latin.woff2", weight: "400" },
    { path: "../assets/fonts/cormorant-garamond-latin.woff2", weight: "500" },
    { path: "../assets/fonts/cormorant-garamond-latin.woff2", weight: "600" },
  ],
  variable: "--font-cormorant",
  display: "swap",
  adjustFontFallback: false,
});
