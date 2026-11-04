// Plain <picture>/<img> on purpose: ImageKit already serves sized AVIF/WebP,
// and next/image would re-process the images and drop the AVIF srcset.
import { ProductsRoot } from "@/components/home/products-root";
import {
  DEMO_SIZES,
  DEMOS,
  demoSrc,
  type DemoId,
} from "@/content/product-demos";

/** The phone with its first screen; the walkthrough adds the rest. */
function AppDemo({ demo }: { demo: DemoId }) {
  const first = DEMOS[demo][0];
  const src = (width: 360 | 720, ext: "avif" | "webp") =>
    demoSrc(demo, first.file, width, ext);
  return (
    <div className="app-demo" data-demo={demo}>
      <div className="phone-float">
        <div className="phone">
          <div className="phone-screen">
            <picture className="screen is-active">
              <source
                type="image/avif"
                srcSet={`${src(360, "avif")} 360w, ${src(720, "avif")} 720w`}
                sizes={DEMO_SIZES}
              />
              <img
                src={src(360, "webp")}
                srcSet={`${src(360, "webp")} 360w, ${src(720, "webp")} 720w`}
                sizes={DEMO_SIZES}
                width={720}
                height={1620}
                alt={first.alt}
                loading="lazy"
                decoding="async"
              />
            </picture>
          </div>
        </div>
      </div>
    </div>
  );
}

/** "04 / What's taking shape": the Tend spotlight with its phone walkthrough. */
export function ProductsSection() {
  return (
    <ProductsRoot>
      <div className="ts-section-label">
        <span>04 / WHAT’S TAKING SHAPE</span>
        <span>PRODUCTS WITH A PRACTICAL PURPOSE</span>
      </div>
      <div className="section-heading">
        <h2>
          Everyday friction.
          <br />
          <em>New possibilities.</em>
        </h2>
        <p>
          New ventures begin with specific experiences
          <br className="desktop" />
          {" that can be simpler, smoother, and more useful."}
        </p>
      </div>
      <div className="product-list">
        <article className="product tend">
          <div className="product-copy">
            <div className="product-top">
              <span className="product-index">01</span>
              <span className="status">IN DEVELOPMENT</span>
            </div>
            <span className="product-name">tend</span>
            <h3>
              More time enjoying.
              <br />
              Less time waiting.
            </h3>
            <p>
              A restaurant ordering experience being built around browsing the
              menu, placing an order, and paying from your phone.
            </p>
            <ul className="product-tags">
              <li>RESTAURANTS</li>
              <li>ORDERING</li>
              <li>GUEST EXPERIENCE</li>
            </ul>
            <details>
              <summary>
                Explore the idea <span aria-hidden="true">+</span>
              </summary>
              <div>
                <p>
                  The aim is to connect the guest’s experience with a clear
                  ordering flow: discover the restaurant, choose food and
                  drinks, review the order, and pay. A more convenient
                  experience for guests starts with a workflow that makes sense
                  for the restaurant.
                </p>
              </div>
            </details>
          </div>
          <AppDemo demo="tend" />
        </article>
      </div>
      <p className="development-note">
        Tend is in development. Availability and launch details will be shared
        when confirmed.
      </p>
    </ProductsRoot>
  );
}
