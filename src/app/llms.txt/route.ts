import { siteUrl } from "@/config/deployment";
import { site } from "@/config/site";
import { faq } from "@/content/faq";
import { featureDirectory, restaurantBenefits } from "@/content/home";
import { researchStats } from "@/content/research";
import {
  SERVICE_NIGHTS_PER_MONTH,
  TEND_PRICING,
  VENDOR_SAVINGS_PER_LOCATION,
} from "@/lib/estimator";

export const dynamic = "force-static";

/**
 * llms.txt (https://llmstxt.org): a plain-language summary for answer engines,
 * built from the same content modules as the page so it can't drift.
 */
export function GET() {
  const home = `${siteUrl}/`;
  const body = `# ${site.name}

> ${site.description}

${site.name} is part of ${site.parent.name} (${site.parent.url}). Status: preparing to launch. Launch locations and participating restaurants have not been announced, and this website does not place orders or take payments.

## Key pages

- [Home](${home}): what Tend does for diners and restaurants
- [Why Tend](${home}#benefits)
- [App features](${home}#features)
- [For restaurants](${home}#restaurants)
- [What the research shows](${home}#research)
- [Industry-data estimator](${home}#estimator)
- [Good to know (FAQ)](${home}#questions)

## Features

${featureDirectory.map((f) => `- ${f.title} ${f.body}`).join("\n")}

## For restaurants

${restaurantBenefits.map((b) => `- ${b.title} ${b.body}`).join("\n")}

## Industry research cited by Tend

${researchStats.map((s) => `- ${s.value}: ${s.label}. ${s.detail} (Source: ${s.source})`).join("\n")}

These are industry-wide findings, not Tend customer results.

## How the estimator works

Monthly revenue = locations × covers per night × average ticket × ${SERVICE_NIGHTS_PER_MONTH} service nights. Revenue lift applies a ticket-lift assumption (default 15%; research range 15–30%). Vendor consolidation is estimated at $${VENDOR_SAVINGS_PER_LOCATION}/mo per location. Tend cost uses list pricing per location: $${TEND_PRICING.starterPerLocation}/mo for 1–4 locations, $${TEND_PRICING.growthPerLocation}/mo for 5–14, $${TEND_PRICING.scalePerLocation}/mo for 15–24; ${TEND_PRICING.quoteFromLocations} or more locations are quoted separately. Card-processing fees are not included. It is an estimate, not a promise.

## FAQ

${faq.map((item) => `### ${item.question}\n\n${item.answer}`).join("\n\n")}
`;
  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
