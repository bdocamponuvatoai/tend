import { experienceSteps } from "@/content/home";

export function Experience() {
  return (
    <section className="intro section" id="experience">
      <div className="section-label">01 / THE TEND EXPERIENCE</div>
      <div className="intro-grid">
        <h2>
          The best part of dining
          <br />
          isn’t the ordering.
          <br />
          <em>It’s everything after.</em>
        </h2>
        <div>
          <p className="large-copy">
            The first bite. The catch-up that runs long. The spontaneous “let’s
            get dessert.”
          </p>
          <p>
            Tend is being built to make the practical parts of dining feel
            simple, so the good parts have more room. From discovering dishes to
            reviewing your order, it all comes together in one thoughtful
            experience.
          </p>
        </div>
      </div>
      <div className="steps">
        {experienceSteps.map((step) => (
          <article key={step.label}>
            <span className="step-number">{step.label}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
