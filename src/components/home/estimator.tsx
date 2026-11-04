import { Calculator, ShieldCheck } from "lucide-react";

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
      <aside className="estimator-method" aria-labelledby="method-title">
        <div className="estimator-method-main">
          <div className="estimator-method-heading">
            <span className="estimator-method-icon" aria-hidden="true">
              <Calculator size={21} strokeWidth={1.6} />
            </span>
            <div>
              <span className="estimator-method-kicker">METHODOLOGY</span>
              <h3 id="method-title">How this estimate works.</h3>
            </div>
          </div>

          <span className="estimator-equation-title">MONTHLY REVENUE</span>
          {/* Read as one sentence by screen readers (role="img"): a
              plain div's aria-label is ignored. */}
          <div
            className="estimator-equation"
            role="img"
            aria-label={`Locations times covers per night times average ticket times ${SERVICE_NIGHTS_PER_MONTH} service nights`}
          >
            <span>
              <strong>Locations</strong>
              <small>Your venues</small>
            </span>
            <span>
              <strong>Covers</strong>
              <small>Per night</small>
            </span>
            <span>
              <strong>Ticket</strong>
              <small>Average</small>
            </span>
            <span className="estimator-equation-accent">
              <strong>{SERVICE_NIGHTS_PER_MONTH}</strong>
              <small>Service nights</small>
            </span>
          </div>

          <div className="estimator-method-copy">
            <p>
              Revenue lift uses the ticket-lift percentage you set. Industry
              sources put self-ordering ticket lift at 15–30% (CKitchen industry
              analysis, Toast platform data, NRA — see the research above). We
              default to 15%, the low end.
            </p>
            <p>
              Vendor consolidation is estimated at $
              {VENDOR_SAVINGS_PER_LOCATION}/mo per location, reflecting typical
              pricing for a separate POS + reservations + loyalty + SMS stack.
              Tend cost uses list pricing per location: $
              {TEND_PRICING.starterPerLocation}/mo for 1–4 locations, $
              {TEND_PRICING.growthPerLocation}/mo for 5–14, and $
              {TEND_PRICING.scalePerLocation}/mo for 15–24;{" "}
              {TEND_PRICING.quoteFromLocations} or more locations are quoted
              separately. Card-processing fees are not included.
            </p>
          </div>
        </div>

        <div className="estimator-caveat">
          <div className="estimator-caveat-label">
            <ShieldCheck size={18} strokeWidth={1.7} aria-hidden="true" />
            <span>OUTCOME NOTE</span>
          </div>
          <h3>
            This is an estimate,
            <br />
            <em>not a promise.</em>
          </h3>
          <p>
            Your actual outcome depends on your concept, market, menu,
            execution, and how aggressively guests adopt the QR/self-order flow.
          </p>
          <div className="estimator-caveat-rule" aria-hidden="true">
            <span />
          </div>
        </div>
      </aside>
    </section>
  );
}
