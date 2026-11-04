import { ArrowDown, ArrowUpRight } from "lucide-react";

/*
 * Decorative glyphs drawn as SVG line icons. As text characters (↗, ✳) they
 * have no glyph in the site's fonts, so phones and tablets fill them from the
 * colour emoji font (iOS shows ↗ as a blue emoji tile). Drawn icons look the
 * same on every device. Styles: styles/design/system.css.
 */

/** Arrow after a link or button label: ↗ by default, ↓ for in-page jumps. */
export function LinkArrow({ down = false }: { down?: boolean }) {
  const Icon = down ? ArrowDown : ArrowUpRight;
  return (
    <span
      className={down ? "link-arrow link-arrow--down" : "link-arrow"}
      aria-hidden="true"
    >
      <Icon size={16} strokeWidth={1.75} />
    </span>
  );
}

/** Eight-spoke asterisk, the hero's closing ornament. */
export function AsteriskMark() {
  return (
    <span className="asterisk" aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" />
      </svg>
    </span>
  );
}
