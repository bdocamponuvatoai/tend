import { StoryTabs, type Story } from "@/components/home/story-tabs";

const stories: Story[] = [
  {
    id: "happy",
    number: "01",
    label: "Discover happy hour",
    panel: (
      <>
        <div className="story-copy">
          <span className="story-kicker">THE RIGHT PLACE. THE RIGHT TIME.</span>
          <h3>
            Make happy hour
            <br />
            <em>your hour.</em>
          </h3>
          <p>
            See when happy hour is happening and which drinks are included.
            Explore the offers and prices before you choose, so finding your
            next round feels effortless.
          </p>
          <ul>
            <li>See the happy-hour window and time remaining.</li>
            <li>Find eligible drinks and their offer prices.</li>
            <li>Choose what you love with the deal in view.</li>
          </ul>
          <div className="story-takeaway">
            More discovery. Better value. A reason to stay for one more
            conversation.
          </div>
        </div>
        <div className="preview-stage">
          <div
            className="feature-preview happy-preview"
            role="figure"
            aria-label="Illustrative happy hour menu"
          >
            <div className="preview-top">
              <span className="preview-wordmark">Tend</span>
              <span>HAPPY HOUR</span>
            </div>
            <div className="offer-heading">
              <span>THE GOLDEN HOUR</span>
              <h4>
                A good time
                <br />
                for great company.
              </h4>
              <p>4–6 PM · Selected drinks</p>
            </div>
            <div className="offer-menu">
              {[
                [
                  "Citrus spritz",
                  "Bright citrus · sparkling finish",
                  "$12",
                  "$9",
                ],
                [
                  "House white",
                  "Crisp · refreshing · by the glass",
                  "$10",
                  "$7",
                ],
                [
                  "Garden zero-proof",
                  "Cucumber · lime · fresh herbs",
                  "$9",
                  "$6",
                ],
              ].map(([name, notes, was, now]) => (
                <div key={name}>
                  <span>
                    {name}
                    <small>{notes}</small>
                  </span>
                  <span>
                    <del>{was}</del>
                    {` ${now}`}
                  </span>
                </div>
              ))}
            </div>
            <p className="preview-caption">
              Illustrative menu, schedule, and prices.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "gift",
    number: "02",
    label: "Send a little happiness",
    panel: (
      <>
        <div className="story-copy">
          <span className="story-kicker">A ROUND WITH A REASON.</span>
          <h3>
            The next round?
            <br />
            <em>It’s on you.</em>
          </h3>
          <p>
            Celebrate friends across the room or send a thoughtful hello. Choose
            drinks for another table, add a personal message, and make the
            gesture your own.
          </p>
          <ul>
            <li>Select the drinks and the receiving table.</li>
            <li>Add a message to go with your gift.</li>
            <li>Send to different tables, with drinks on your bill.</li>
          </ul>
          <div className="story-takeaway">
            Turn a simple order into a moment someone remembers.
          </div>
        </div>
        <div className="preview-stage">
          <div
            className="feature-preview gift-preview"
            role="figure"
            aria-label="Illustrative drink gift"
          >
            <div className="preview-top">
              <span className="preview-wordmark">Tend</span>
              <span>SOCIAL ORDERING</span>
            </div>
            <div className="gift-route">
              <span>
                FROM TABLE <b>04</b>
              </span>
              <span aria-hidden="true">→</span>
              <span>
                TO TABLE <b>12</b>
              </span>
            </div>
            <div className="gift-message">
              <span>A LITTLE SOMETHING FOR YOUR TABLE</span>
              <blockquote>
                “Congratulations!
                <br />
                Here’s to your next chapter.”
              </blockquote>
              <p>2 × Citrus spritz</p>
            </div>
            <div className="preview-foot">
              <span>A personal note. A shared celebration.</span>
            </div>
            <p className="preview-caption">
              Illustrative gift example. Nothing is sent.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "remote",
    number: "03",
    label: "Treat them from anywhere",
    panel: (
      <>
        <div className="story-copy">
          <span className="story-kicker">CARE DOESN’T NEED A SEAT.</span>
          <h3>
            You don’t have to be there
            <br />
            <em>to take care of dinner.</em>
          </h3>
          <p>
            Order and pay for someone dining at a restaurant while you’re
            somewhere else. Parents can take care of a meal for their kids;
            anyone can treat a partner, friend, or colleague.
          </p>
          <ul>
            <li>Select their venue and confirm the table number.</li>
            <li>Choose their meal from the restaurant’s menu.</li>
            <li>You order and pay. They enjoy it at their table.</li>
          </ul>
          <div className="story-takeaway">
            Across town or away from home, a thoughtful meal is still within
            reach.
          </div>
        </div>
        <div className="preview-stage">
          <div
            className="feature-preview remote-preview"
            role="figure"
            aria-label="Illustrative remote meal order"
          >
            <div className="preview-top">
              <span className="preview-wordmark">Tend</span>
              <span>REMOTE ORDERING</span>
            </div>
            <div className="remote-heading">
              <span>YOU PAY. THEY EAT.</span>
              <h4>
                A little care,
                <br />
                from wherever you are.
              </h4>
            </div>
            <dl className="remote-details">
              {[
                ["For", "The kids, dining with family"],
                ["Where", "Their restaurant · Table 08"],
                ["On the menu", "Pasta, lemonade & dessert"],
              ].map(([term, detail]) => (
                <div key={term}>
                  <dt>{term}</dt>
                  <dd>{detail}</dd>
                </div>
              ))}
            </dl>
            <div className="preview-foot">
              <span>Your treat. Their table.</span>
            </div>
            <p className="preview-caption">
              Illustrative order. No order or payment is made.
            </p>
          </div>
        </div>
      </>
    ),
  },
];

export function FeatureShowcase() {
  return (
    <section
      className="feature-showcase section"
      id="features"
      aria-labelledby="feature-heading"
    >
      <div className="showcase-heading">
        <div>
          <div className="section-label">MORE THAN A WAY TO ORDER</div>
          <h2 id="feature-heading">
            Little taps.
            <br />
            <em>Bigger possibilities.</em>
          </h2>
        </div>
        <p>
          Make the most of an evening out. Turn a drink into a thoughtful
          gesture. Be there for someone’s meal, even when you can’t be there in
          person.
        </p>
      </div>
      <StoryTabs stories={stories} label="Tend feature highlights" />
      <p className="feature-availability">
        A look at the Tend experience. Live features, offers, and availability
        depend on participating restaurants at launch.
      </p>
    </section>
  );
}
