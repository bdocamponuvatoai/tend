/**
 * Phone walkthroughs for the "What's taking shape" section, from ojisak.com.
 * Each screen: file in `<app>-screens/` on ImageKit, step label, alt text, and
 * optional tap/pulse positions on the screen in % (where a guest presses / a
 * status to pulse). `enter: "up"` rises as a sheet; the default pushes in from
 * the right.
 */

export type DemoScreen = {
  file: string;
  label: string;
  alt: string;
  tap?: [number, number];
  pulse?: [number, number];
  enter?: "up";
};

export type DemoId = "tend";

export const DEMOS: Record<DemoId, DemoScreen[]> = {
  tend: [
    {
      file: "01-splash",
      label: "Welcome",
      alt: "Tend welcome screen: Great food shouldn’t keep you waiting.",
      tap: [50, 76.9],
    },
    {
      file: "02-menu",
      label: "Browse the menu",
      alt: "Maple and Ash menu in Tend, with Chef’s Specials and a View Cart bar.",
      tap: [91.3, 78.5],
    },
    {
      file: "03-item-detail",
      label: "Choose a dish",
      alt: "Truffle Gnocchi detail screen with quantity and Add to Order.",
      tap: [50, 94.8],
    },
    {
      file: "04-cart",
      label: "Review the order",
      alt: "Your Order cart with items, totals and Send to Kitchen.",
      tap: [50, 93.7],
    },
    {
      file: "05-order-sent",
      label: "Sent to the kitchen",
      alt: "Order Sent confirmation with live preparation status.",
      tap: [50, 85.1],
      enter: "up",
      pulse: [49, 19.6],
    },
    {
      file: "06-pay-bill",
      label: "Pay from the table",
      alt: "Pay Bill screen with tip, split bill and Pay Now.",
      tap: [50, 93.6],
    },
  ],
};

export const DEMO_NAMES: Record<DemoId, string> = {
  tend: "Tend",
};

/** ImageKit folder that serves every screen, and the screens' version stamp. */
export const DEMO_CDN = "https://ik.imagekit.io/isakglobalventures/ojisak";
export const DEMO_ASSETS_V = "075e3f7394";
export const DEMO_SIZES = "(max-width: 760px) 240px, 290px";

/** `01-splash`, 360 → full ImageKit URL for one size and format. */
export function demoSrc(
  demo: DemoId,
  file: string,
  width: 360 | 720,
  ext: "avif" | "webp",
): string {
  return `${DEMO_CDN}/${demo}-screens/${file}-${width}.${ext}?v=${DEMO_ASSETS_V}`;
}
