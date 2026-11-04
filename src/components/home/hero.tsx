import { HeroPicture } from "@/components/home/hero-picture";
import { AsteriskMark, LinkArrow } from "@/components/ui/glyph";
import { site } from "@/config/site";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <div className="eyebrow">
          <span className="line"></span>
          {" Dine   ·   Order   ·   Enjoy"}
        </div>
        <h1>
          A better meal.
          <br />A thoughtful gesture.
          <br />
          <em>All in Tend.</em>
        </h1>
        <p>
          Find your next happy hour. Send a round to another table. Order dinner
          for someone you love—even when you’re somewhere else. Tend brings more
          possibilities to every meal.
        </p>
        <div className="actions">
          <a className="btn btn-gold" href="#restaurants">
            Bring Tend to your restaurant <LinkArrow />
          </a>
        </div>
        <div className="launch-note">
          A new dining experience. Preparing to launch.
        </div>
      </div>
      <div className="hero-photo">
        <HeroPicture alt="Fresh pasta, burrata and a cocktail shared across a restaurant table" />
        <div className="photo-caption">
          <span>DINE · ORDER · ENJOY</span>
          <span className="caption-mark">Tend</span>
        </div>
      </div>
      <div className="hero-bottom">
        <span>{site.tagline}</span>
        <span>
          MADE FOR THE TABLE <AsteriskMark />
        </span>
      </div>
    </section>
  );
}
