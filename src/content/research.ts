/**
 * Published industry findings behind the estimator, with the source each one
 * cites. Copied verbatim from the original Tend restaurant site; check every
 * citation before the site is opened to search engines.
 */

export type ResearchStat = {
  value: string;
  label: string;
  detail: string;
  source: string;
};

export const researchStats: ResearchStat[] = [
  {
    value: "+15–30%",
    label: "Larger ticket size with self-ordering",
    detail:
      "Across multiple operator surveys and case studies, restaurants moving guests to self-ordering kiosks or QR menus consistently report 15–30% bigger orders.",
    source: "CKitchen industry analysis · Toast platform data",
  },
  {
    value: "+15%",
    label: "Faster table turnover with QR payments",
    detail:
      "Restaurants adopting QR code-based payments saw a 15% lift in table turnover in a Square-published study, driven by faster check closeouts.",
    source: "Square / Juniper Research",
  },
  {
    value: "−27%",
    label: "Order errors with digital ordering",
    detail:
      "A Toast-published study found restaurants using digital order capture (tablets / mobile) reduced order entry errors by 27% versus handwritten tickets.",
    source: "Toast / Zenchef analysis",
  },
  {
    value: "Up to 20%",
    label: "Higher checks vs. in-person ordering",
    detail:
      "The National Restaurant Association notes that orders placed through digital ordering platforms can run up to 20% larger than orders taken in person by a server.",
    source: "National Restaurant Association",
  },
  {
    value: "36.5%",
    label: "Of full-service revenue goes to labor",
    detail:
      "Per the NRA’s 2025 Restaurant Operations Data Abstract, full-service restaurants spent a median 36.5% of sales on labor in 2024 — well above the historical ~33%. Profitable operators averaged 34.2%.",
    source: "NRA 2025 Operations Data Abstract",
  },
  {
    value: "70%",
    label: "Of operators have unfilled job openings",
    detail:
      "70% of restaurant operators report job openings that are tough to fill, and 45% say they don’t have enough staff to meet customer demand. Self-ordering helps existing staff cover more guests.",
    source: "NRA via NetSuite",
  },
];
