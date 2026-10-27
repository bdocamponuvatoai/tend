import Image from "next/image";
import igvLogo from "@/assets/images/igv-logo.png";
import { Brand } from "@/components/ui/brand";
import { site } from "@/config/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <div className="footer-top">
        <Brand />
        <span>{site.tagline}</span>
        <a href="#main">Back to top ↑</a>
      </div>
      <div className="igv-family">
        <span>Part of the Isak Global Ventures</span>
        <a
          href={site.parent.url}
          className="igv-family-link"
          aria-label={`Visit ${site.parent.name}`}
        >
          <Image
            src={igvLogo}
            alt="IGV — Isak Global Ventures"
            loading="lazy"
          />
        </a>
      </div>
      <div className="footer-bottom">
        <span>
          © <span>{year}</span> Tend. All rights reserved.
        </span>
        <span>Thoughtfully made for a better dining experience.</span>
      </div>
    </footer>
  );
}
