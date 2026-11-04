import Image from "next/image";

import moreTimeAtTheTable from "@/assets/images/benefits/more-time-at-the-table.webp";
import { BenefitVisual } from "@/components/home/benefit-visual";
import { Icon } from "@/components/ui/icon";
import { benefits } from "@/content/home";

/** Tile fill for each benefit, in order (styles/design/bento.css): light and
    dark alternate on the diagonal. */
const FILLS = ["champagne", "ink", "sand", "gold"] as const;

const pad = (n: number) => String(n).padStart(2, "0");

export function Benefits() {
  return (
    <section
      className="benefits section"
      id="benefits"
      aria-labelledby="benefits-title"
    >
      <div className="benefits-heading">
        <div>
          <div className="section-label">WHY DINE WITH TEND</div>
          <h2 id="benefits-title">
            Your meal.
            <br />
            Your pace.
            <br />
            <em>More time for you.</em>
          </h2>
        </div>
        <div className="benefits-intro">
          <p className="large-copy">
            A great night out should revolve around you and your company.
          </p>
          <p>
            Tend is being built to put the everyday details of dining in your
            hands. Choose comfortably, check your order, and move through your
            meal with fewer interruptions.
          </p>
        </div>
      </div>
      <ol className="benefits-journey" aria-label="The Tend dining flow">
        {[
          ["01", "Browse"],
          ["02", "Choose"],
          ["03", "Review"],
          ["04", "Settle"],
        ].map(([number, label]) => (
          <li key={number}>
            <span>{number}</span>
            <strong>{label}</strong>
          </li>
        ))}
      </ol>
      <div className="benefit-grid">
        {benefits.map((item, index) => (
          <article
            key={item.label}
            className={`tile tile--tabbed tile--${FILLS[index % FILLS.length]}`}
          >
            <span className="tile-tab benefit-label">{item.label}</span>
            <div className="benefit-card-meta">
              {item.icon && <Icon name={item.icon} />}
              <span className="benefit-number" aria-hidden="true">
                {pad(index + 1)} / {pad(benefits.length)}
              </span>
            </div>
            <div className="benefit-text">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
            {item.screen && <BenefitVisual screen={item.screen} />}
          </article>
        ))}
        <figure className="benefits-moment tile">
          <Image
            src={moreTimeAtTheTable}
            alt=""
            fill
            sizes="(max-width: 700px) 88vw, (max-width: 1000px) 90vw, 86vw"
            placeholder="blur"
          />
          <figcaption>
            <span className="benefits-moment-label">THE REAL BENEFIT</span>
            <blockquote>
              More attention for the people <em>across the table.</em>
            </blockquote>
            <p>Fewer interruptions. More room for the evening to unfold.</p>
          </figcaption>
        </figure>
      </div>
      <p className="benefits-availability">
        Planned experience at participating restaurants when Tend launches.
      </p>
    </section>
  );
}
