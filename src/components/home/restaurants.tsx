import { restaurantBenefits } from "@/content/home";

export function Restaurants() {
  return (
    <section className="restaurants section" id="restaurants">
      <div className="section-label">02 / FOR THE PEOPLE BEHIND THE PLATE</div>
      <div className="restaurant-heading">
        <h2>
          Better for your guests.
          <br />
          <em>Better for your restaurant.</em>
        </h2>
        <p>
          Give guests an easier way to order while creating more room for your
          team to deliver great service. Tend is designed to make the everyday
          steps of dining work better for everyone.
        </p>
      </div>
      <div className="restaurant-grid">
        {restaurantBenefits.map((item) => (
          <article key={item.label}>
            <span className="outline-icon" aria-hidden="true">
              {item.label}
            </span>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
      <div className="partner-note">
        <b>Designed for smoother service. Built around your guests.</b>
        <span>
          Restaurant participation and launch details will be announced here.
        </span>
        <a className="btn btn-gold" href="#estimator">
          Estimate the impact for your venue <span aria-hidden="true">↓</span>
        </a>
      </div>
    </section>
  );
}
