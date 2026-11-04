import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/deployment";
import { routes } from "@/content/routes";

export const dynamic = "force-static";

const BUILD_DATE = new Date().toISOString().slice(0, 10);

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    // The static export is rebuilt for every content change, so the build
    // date is the page's last-modified date.
    lastModified: BUILD_DATE,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
