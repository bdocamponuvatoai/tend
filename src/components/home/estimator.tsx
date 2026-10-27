import { EstimatorForm } from "@/components/home/estimator-form";
import {
  SERVICE_NIGHTS_PER_MONTH,
  TEND_PRICING,
  VENDOR_SAVINGS_PER_LOCATION,
} from "@/lib/estimator";

export function Estimator() {
  return (
    <section
      className="estimator section"
      id="estimator"
      aria-labelledby="estimator-title"
    >
      <div className="estimator-heading">
        <div className="section-label">INDUSTRY-DATA ESTIMATOR</div>
        <h2 id="estimator-title">
          What could Tend
          <br />
          <em>add to your operation?</em>
        </h2>
        <p>
          Drag the sliders to match your venue, then set a ticket-lift
          assumption. Industry research puts the range at 15–30% for
          self-ordering — we default to the conservative end.
        </p>
      </div>
      <EstimatorForm />
      <p className="estimator-method">
        <strong>How this estimate works.</strong>
        {` Monthly revenue is locations × covers per night × average ticket × ${SERVICE_NIGHTS_PER_MONTH} service nights. Revenue lift uses the ticket-lift % you set. Industry sources put self-ordering ticket lift at 15–30% (CKitchen industry analysis, Toast platform data, NRA — see the research above). We default to 15%, the low end. Vendor consolidation is estimated at $${VENDOR_SAVINGS_PER_LOCATION}/mo per location, reflecting typical pricing for a separate POS + reservations + loyalty + SMS stack. Tend cost uses list pricing: $${TEND_PRICING.singleLocation}/mo for one location, $${TEND_PRICING.growthPerLocation}/mo per location for 2–14 locations, and $${TEND_PRICING.scalePerLocation}/mo per location for 15 or more. Card-processing fees are not included. `}
        <strong>This is an estimate, not a promise.</strong>
        {
          " Your actual outcome depends on your concept, market, menu, execution, and how aggressively guests adopt the QR/self-order flow."
        }
      </p>
    </section>
  );
}
