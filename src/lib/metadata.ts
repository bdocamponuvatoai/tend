import type { Metadata } from "next";
import heroImage from "@/assets/images/hero-table.jpg";
import { site } from "@/config/site";

type PageMetadataInput = {
  /** Full document title; used as-is (not templated). */
  title: string;
  /** Route path starting with `/`, e.g. `/` or `/about/`. */
  path: string;
  description?: string;
};

/**
 * Per-page metadata: absolute title, description, canonical URL and Open
 * Graph/Twitter cards using the hero photo. Relative URLs resolve against
 * `metadataBase` from the root layout.
 */
export function pageMetadata({
  title,
  path,
  description = site.description,
}: PageMetadataInput): Metadata {
  const image = {
    url: heroImage.src,
    width: heroImage.width,
    height: heroImage.height,
    alt: "Fresh pasta, burrata and a cocktail shared across a restaurant table",
  };
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: site.locale,
      url: path,
      title,
      description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}
