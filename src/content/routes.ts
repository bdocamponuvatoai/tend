import type { MetadataRoute } from "next";

type SitemapEntry = MetadataRoute.Sitemap[number];

/** Every public page. The sitemap is built from this list. */
export const routes: {
  path: string;
  changeFrequency: SitemapEntry["changeFrequency"];
  priority: number;
}[] = [{ path: "/", changeFrequency: "monthly", priority: 1 }];
