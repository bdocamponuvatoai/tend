"use client";

import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

type SectionLinkProps = ComponentProps<"a"> & { href: string };

/**
 * Link to a section of the home page, e.g. `#estimator`. On the home page it
 * stays a same-page jump; anywhere else (the 404 page) a bare hash would point
 * at the current URL, so it becomes `/#estimator`, a full load of the home
 * page.
 */
export function SectionLink({ href, ...rest }: SectionLinkProps) {
  const onHome = usePathname() === "/";
  const target = href.startsWith("#") && !onHome ? `/${href}` : href;
  return <a href={target} {...rest} />;
}
