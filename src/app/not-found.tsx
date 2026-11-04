import type { Metadata } from "next";
import { SmartLink } from "@/components/ui/smart-link";

export const metadata: Metadata = {
  title: { absolute: "Page not found — Tend" },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main id="main">
      <section className="manifesto section">
        <span className="section-label">404 / PAGE NOT FOUND</span>
        <h1>
          This table
          <br />
          <em>isn’t set.</em>
        </h1>
        <p>The page you’re looking for doesn’t exist or has moved.</p>
        <SmartLink href="/" className="text-link">
          Back to Tend <span aria-hidden="true">↗</span>
        </SmartLink>
      </section>
    </main>
  );
}
