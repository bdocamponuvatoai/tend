import Link from "next/link";
import type { ComponentProps } from "react";

type SmartLinkProps = ComponentProps<"a"> & { href: string };

/**
 * Internal routes (`/…`) use next/link for client-side navigation; hash,
 * `tel:`, `mailto:` and external links stay plain anchors with their
 * attributes untouched.
 */
export function SmartLink({ href, ...rest }: SmartLinkProps) {
  if (href.startsWith("/")) return <Link href={href} {...rest} />;
  return <a href={href} {...rest} />;
}
