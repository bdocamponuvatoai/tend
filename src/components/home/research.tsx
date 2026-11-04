import { ChartNoAxesCombined } from "lucide-react";

import { researchStats } from "@/content/research";

export function Research() {
  return (
    <section
      className="research section"
      id="research"
      aria-labelledby="research-title"
    >
      <div className="research-heading">
        <div className="research-heading-title">
          <span className="research-heading-icon" aria-hidden="true">
            <ChartNoAxesCombined size={22} strokeWidth={1.6} />
          </span>
          <div>
            <div className="section-label">THE OPPORTUNITY</div>
            <h2 id="research-title">
              What the
              <br />
              <em>research shows.</em>
            </h2>
          </div>
        </div>
        <div className="research-intro">
          <span>PUBLISHED EVIDENCE</span>
          <p>
            Tend is built around what the restaurant industry’s own research
            says works. Every number below comes from a published industry
            source — not our marketing team.
          </p>
        </div>
      </div>
      <div className="research-grid">
        {researchStats.map((stat, index) => (
          <article key={stat.label}>
            <div className="research-card-meta" aria-hidden="true">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <b>INDUSTRY SIGNAL</b>
            </div>
            <p className="research-value">{stat.value}</p>
            <h3>{stat.label}</h3>
            <p>{stat.detail}</p>
            <p className="research-source">
              Source: <cite>{stat.source}</cite>
            </p>
          </article>
        ))}
      </div>
      <p className="research-note">
        These are industry-wide research findings. Individual results depend on
        your concept, market, menu, and execution. Tend doesn’t yet publish
        customer outcome data — we will once we have a meaningful base of
        operators on the platform.
      </p>
    </section>
  );
}
