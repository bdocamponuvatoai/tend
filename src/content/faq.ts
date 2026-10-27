/**
 * "Good to know" questions. Rendered as <details> on the page and reused for
 * the FAQPage structured data, so the two never drift apart.
 */

export type FaqItem = { question: string; answer: string };

export const faq: FaqItem[] = [
  {
    question: "What is Tend?",
    answer:
      "Tend brings restaurant discovery, menus, ordering, happy-hour offers, social gifting, remote ordering, and payment into one dining experience. The app also includes tools for meal pacing, bill splitting, rewards, and more. This website introduces the experience ahead of launch.",
  },
  {
    question: "Can I send drinks to another table?",
    answer:
      "Yes—that is part of Tend’s social ordering experience. Select drinks, choose the receiving table, and add a message. The gift is added to your bill. Availability and alcohol service remain subject to the restaurant’s rules and age verification.",
  },
  {
    question: "Can I order for someone when I’m not there?",
    answer:
      "Tend’s remote ordering flow lets you select the venue and enter the diner’s table number, then order and pay from elsewhere. Parents can order meals for their kids, or anyone can treat a partner, friend, or colleague at a participating restaurant. Confirm the venue and table with the diner before ordering.",
  },
  {
    question: "How do happy-hour offers work?",
    answer:
      "See a restaurant’s happy-hour window, eligible drinks, and offer prices in the app. Offers are set by each restaurant and apply during its stated times. The examples on this website are illustrative.",
  },
  {
    question: "How does Tend make dining easier?",
    answer:
      "Tend is designed to let you browse the menu, choose at your own pace, review your selections, and pay in one flow. The goal is less time managing the details and more time enjoying your meal.",
  },
  {
    question: "What is the benefit for my restaurant?",
    answer:
      "Tend brings menu discovery, happy-hour offers, guest ordering, table-to-table gifts, remote purchases, and rewards into one experience. These features create more opportunities for guests to engage with your restaurant while supporting smoother service. Results depend on your restaurant and how Tend is used.",
  },
  {
    question: "How does the Tend estimator work?",
    answer:
      "Set your number of locations, covers per night, and average ticket, then choose a ticket-lift assumption. Industry research puts self-ordering ticket lift at 15–30%, and the estimator defaults to 15%. It adds an estimated $250 per location per month for vendor consolidation and subtracts Tend’s list price. It is an estimate, not a promise: results depend on your concept, market, menu, execution, and guest adoption.",
  },
  {
    question: "Can I place an order today?",
    answer:
      "Live ordering will become available when Tend launches with participating restaurants. This website introduces the app’s features and benefits; it does not place orders or take payments.",
  },
  {
    question: "Is Tend for diners or restaurants?",
    answer:
      "Both. Tend is designed to make dining simpler for guests while supporting the restaurants and teams who make the experience possible.",
  },
  {
    question: "Where will Tend be available?",
    answer:
      "Launch locations and participating restaurants have not been announced. We’ll share availability here as the rollout is confirmed.",
  },
];
