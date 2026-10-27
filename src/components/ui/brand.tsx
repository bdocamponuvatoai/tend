"use client";

import { usePathname } from "next/navigation";
import { SmartLink } from "@/components/ui/smart-link";
import { site } from "@/config/site";

/**
 * The Tend wordmark. On the home page it links to `#` (scroll to top and reset
 * keyboard focus to the start, as the original site did); elsewhere it links
 * home. A next/link to the current URL would not scroll at all.
 */
export function Brand() {
  const href = usePathname() === "/" ? "#" : "/";
  return (
    <SmartLink href={href} className="logo" aria-label={`${site.name} home`}>
      <span className="brand-name">{site.name}</span>
    </SmartLink>
  );
}
