import type { FaqItem } from "@/content/faq";
import { site } from "@/config/site";

/**
 * schema.org graph for the home page: the organisation, the website, the page
 * itself and its FAQ. Only facts that appear on the page are included.
 */
export function homeStructuredData({
  siteUrl,
  faq,
}: {
  siteUrl: string;
  faq: FaqItem[];
}) {
  const home = `${siteUrl}/`;
  const orgId = `${home}#organization`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: site.name,
        url: home,
        slogan: site.tagline,
        parentOrganization: {
          "@type": "Organization",
          name: site.parent.name,
          url: site.parent.url,
        },
      },
      {
        "@type": "WebSite",
        "@id": `${home}#website`,
        url: home,
        name: site.name,
        description: site.description,
        inLanguage: "en",
        publisher: { "@id": orgId },
      },
      {
        "@type": "WebPage",
        "@id": `${home}#webpage`,
        url: home,
        name: site.title,
        description: site.description,
        inLanguage: "en",
        isPartOf: { "@id": `${home}#website` },
        about: { "@id": orgId },
      },
      {
        "@type": "WebApplication",
        "@id": `${home}#estimator`,
        name: "Tend industry-data estimator",
        url: `${home}#estimator`,
        description:
          "Estimates a restaurant’s annual gain from Tend, net of subscription, from locations, covers per night, average ticket and a ticket-lift assumption.",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        isAccessibleForFree: true,
        isPartOf: { "@id": `${home}#webpage` },
        provider: { "@id": orgId },
      },
      {
        "@type": "FAQPage",
        "@id": `${home}#faq`,
        url: home,
        isPartOf: { "@id": `${home}#website` },
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}
