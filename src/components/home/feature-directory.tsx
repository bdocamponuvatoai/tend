import { featureDirectory } from "@/content/home";

export function FeatureDirectory() {
  return (
    <section
      className="feature-directory section"
      aria-labelledby="directory-title"
    >
      <div className="directory-heading">
        <div className="section-label">
          THOUGHT THROUGH, FROM FIRST LOOK TO LAST BITE
        </div>
        <h2 id="directory-title">
          Everything around your meal.
          <br />
          <em>Made a little easier.</em>
        </h2>
        <p>
          From finding something you’ll love to settling up with friends, Tend
          keeps the details together.
        </p>
      </div>
      <div className="feature-directory-grid">
        {featureDirectory.map((item) => (
          <article key={item.label}>
            <span>{item.label}</span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
