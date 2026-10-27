import { benefits } from "@/content/home";

export function Benefits() {
  return (
    <section
      className="benefits section"
      id="benefits"
      aria-labelledby="benefits-title"
    >
      <div className="section-label">WHY DINE WITH TEND</div>
      <div className="benefits-heading">
        <h2 id="benefits-title">
          Your meal.
          <br />
          Your pace.
          <br />
          <em>More time for you.</em>
        </h2>
        <div>
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
      <div className="benefit-grid">
        {benefits.map((item) => (
          <article key={item.label}>
            <span className="benefit-label">{item.label}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
      <div className="benefits-bottom">
        <p>
          <strong>The real benefit?</strong> More attention for the people
          across the table.
        </p>
      </div>
      <p className="benefits-availability">
        Planned experience at participating restaurants when Tend launches.
      </p>
    </section>
  );
}
