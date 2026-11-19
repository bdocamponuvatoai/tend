import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { GoogleTagManager } from "@/components/analytics/google-tag-manager";
import { ConsentBanner } from "@/components/consent/consent-banner";
import { BackToTop } from "@/components/layout/back-to-top";
import { SiteFooter } from "@/components/layout/site-footer";
import { ScrollReveal } from "@/components/layout/scroll-reveal";
import { SiteHeader } from "@/components/layout/site-header";
import { isIndexable, siteUrl } from "@/config/deployment";
import { site } from "@/config/site";
import { GTM_ID } from "@/lib/analytics";
import { cormorant, dmSans } from "@/styles/fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: site.name,
  robots: isIndexable
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: site.themeColor,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${dmSans.variable} ${cormorant.variable}`}
    >
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        {/* Early in the DOM, fixed to the bottom of the viewport by CSS. */}
        <ConsentBanner side="right" />
        <SiteHeader />
        {children}
        <SiteFooter />
        <BackToTop />
        <ScrollReveal />
        {/* Loads Tag Manager only after Accept, and only in production. */}
        <GoogleTagManager gtmId={GTM_ID} />
      </body>
    </html>
  );
}
