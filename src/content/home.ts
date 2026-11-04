/**
 * Copy for the home page sections. Kept verbatim from the original site;
 * edit here rather than in components.
 */

import type { IconName } from "@/components/ui/icon";

export type Card = {
  label: string;
  title: string;
  body: string;
  /** Decorative icon shown with the card. */
  icon?: IconName;
  /** Tend app screen shown in the card (file name in content/product-demos). */
  screen?: string;
};

export const benefits: Card[] = [
  {
    label: "MORE CONVENIENCE",
    icon: "phone",
    screen: "02-menu",
    title: "Order when you’re ready.",
    body: "Browse and choose from your phone, without needing to catch someone’s attention just to start your order.",
  },
  {
    label: "MORE CONFIDENCE",
    icon: "menu",
    screen: "03-item-detail",
    title: "Know what you’re choosing.",
    body: "Explore the restaurant’s menu and prices at your own pace. Take a moment to find what you actually want.",
  },
  {
    label: "MORE CONTROL",
    icon: "checklist",
    screen: "04-cart",
    title: "Check it before you send it.",
    body: "See your food, drinks, and dessert together. Review your selections and subtotal before moving ahead.",
  },
  {
    label: "LESS BACK-AND-FORTH",
    icon: "card",
    screen: "06-pay-bill",
    title: "Make checkout feel simple.",
    body: "With payment in the same flow, settling up is designed to feel as straightforward as choosing your meal.",
  },
];

export const experienceSteps: Card[] = [
  {
    label: "01",
    title: "Find your next favorite.",
    body: "Explore a restaurant’s menu at your own pace. Go from “what looks good?” to “that’s the one.”",
  },
  {
    label: "02",
    title: "Make it your meal.",
    body: "Choose your food, add a drink, and leave a little room for something sweet. Review your choices in one place.",
  },
  {
    label: "03",
    title: "Settle in. Enjoy.",
    body: "Move through ordering and payment in a connected flow, with more attention left for your table.",
  },
];

export const featureDirectory: Card[] = [
  {
    label: "DISCOVER",
    icon: "pin",
    title: "Find your place. Find your dish.",
    body: "Explore venues and locations, search the menu, discover chef’s specials, and save favorites for next time.",
  },
  {
    label: "MAKE IT YOURS",
    icon: "options",
    title: "Order the way you like it.",
    body: "Choose available sizes and options, add special instructions, and leave a note for the kitchen before sending your order.",
  },
  {
    label: "CHOOSE WITH CLARITY",
    icon: "leaf",
    title: "Your preferences, in view.",
    body: "Use dietary filters and read restaurant-provided allergen information. For allergies, always confirm preparation and cross-contact with staff.",
  },
  {
    label: "SET THE PACE",
    icon: "pace",
    title: "Let dinner unfold.",
    body: "Request meal pacing so mains can follow your starters, instead of having everything arrive together.",
  },
  {
    label: "STAY IN THE KNOW",
    icon: "updates",
    title: "Less wondering. More enjoying.",
    body: "Follow your order’s progress, receive updates, and keep a clear view of your open tab as the meal continues.",
  },
  {
    label: "KEEP THE HUMAN TOUCH",
    icon: "service",
    title: "Help, when you need it.",
    body: "Send a waiter request from your table. Technology makes it easier to ask; your restaurant team brings the personal service.",
  },
  {
    label: "SHARE THE BILL",
    icon: "split",
    title: "Good company. Easier math.",
    body: "Split evenly or by item, and share a bill code so guests can join and pay their own share. Review totals and add a tip in the same flow.",
  },
  {
    label: "MAKE VISITS COUNT",
    icon: "rewards",
    title: "A little more to come back for.",
    body: "Track loyalty points and progress toward rewards, and apply eligible promo codes when you check out.",
  },
  {
    label: "KEEP YOUR FAVORITES CLOSE",
    icon: "favorite",
    title: "Loved it? Have it again.",
    body: "View order history, share a receipt, reorder favorites, and leave feedback about your experience.",
  },
];

export const restaurantBenefits: Card[] = [
  {
    label: "01",
    title: "Put your offers in the moment.",
    body: "Show happy-hour offers, eligible drinks, and chef’s specials where guests are choosing. Give people more reasons to explore your menu.",
  },
  {
    label: "02",
    title: "Let your team focus on service.",
    body: "Let guests browse and review their own selections, reducing routine back-and-forth so staff can focus on questions, recommendations, and a warm welcome.",
  },
  {
    label: "03",
    title: "Welcome orders beyond the table.",
    body: "Let guests send drinks to another table, and let someone outside the restaurant treat a diner to a meal. Create more occasions for people to order and connect.",
  },
  {
    label: "04",
    title: "Make it easy to come back.",
    body: "Keep favorites, rewards, and order history close at hand. Give guests a familiar way to return to the dishes and experiences they enjoyed.",
  },
];
