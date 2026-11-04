import localFont from "next/font/local";

// Self-hosted copies of the Google Fonts files the original site loaded
// (latin subset). Each family is ONE variable file, so it is declared once
// with the file's full weight axis as a range (read from its `fvar` table:
// DM Sans 100–1000, Cormorant 300–700), as CSS Fonts 4 recommends, instead
// of repeating the same file once per fixed weight. Text metrics are
// identical either way in Chromium, Gecko and WebKit (measured).
// `adjustFontFallback` is off so glyphs the files lack (→, ↗, ✳) fall through
// to the same system fonts as before.

export const dmSans = localFont({
  src: "../assets/fonts/dm-sans-latin.woff2",
  weight: "100 1000",
  style: "normal",
  variable: "--font-dm-sans",
  display: "swap",
  adjustFontFallback: false,
});

export const cormorant = localFont({
  src: "../assets/fonts/cormorant-garamond-latin.woff2",
  weight: "300 700",
  style: "normal",
  variable: "--font-cormorant",
  display: "swap",
  adjustFontFallback: false,
});
