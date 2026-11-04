import { Benefits } from "@/components/home/benefits";
import { Closing } from "@/components/home/closing";
import { Estimator } from "@/components/home/estimator";
import { Experience } from "@/components/home/experience";
import { FaqSection } from "@/components/home/faq-section";
import { FeatureDirectory } from "@/components/home/feature-directory";
import { FeatureShowcase } from "@/components/home/feature-showcase";
import { Hero } from "@/components/home/hero";
import { Manifesto } from "@/components/home/manifesto";
import { ProductsSection } from "@/components/home/products-section";
import { Research } from "@/components/home/research";
import { Restaurants } from "@/components/home/restaurants";
import { JsonLd } from "@/components/seo/json-ld";
import { siteUrl } from "@/config/deployment";
import { site } from "@/config/site";
import { faq } from "@/content/faq";
import { pageMetadata } from "@/lib/metadata";
import { homeStructuredData } from "@/lib/structured-data";

export const metadata = pageMetadata({ title: site.title, path: "/" });

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeStructuredData({ siteUrl, faq })} />
      <main id="main">
        <Hero />
        <Benefits />
        <Experience />
        <FeatureShowcase />
        <FeatureDirectory />
        <Restaurants />
        <Research />
        <Estimator />
        <Manifesto />
        <FaqSection />
        <ProductsSection />
        <Closing />
      </main>
    </>
  );
}
