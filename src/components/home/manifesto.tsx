import { LinkArrow } from "@/components/ui/glyph";

export function Manifesto() {
  return (
    <section
      className="manifesto section"
      id="manifesto"
      aria-labelledby="manifesto-title"
    >
      <span className="section-label">TECHNOLOGY THAT KNOWS ITS PLACE</span>

      <div className="manifesto-layout">
        <h2 id="manifesto-title">
          At the table,
          <br />
          the connection that matters
          <br />
          is <em>the human one.</em>
        </h2>

        <div className="manifesto-note">
          <p>
            That’s the idea behind Tend. Less friction between wanting and
            enjoying. More time for food, conversation, and the moments worth
            staying for.
          </p>
          <a href="#experience" className="btn btn-ink manifesto-link">
            Discover the Tend experience
            <LinkArrow />
          </a>
        </div>
      </div>
    </section>
  );
}
