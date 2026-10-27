import { faq } from "@/content/faq";

export function FaqSection() {
  return (
    <section className="faq section" id="questions">
      <div>
        <div className="section-label">03 / GOOD TO KNOW</div>
        <h2>
          A few things
          <br />
          <em>you might be wondering.</em>
        </h2>
      </div>
      <div className="faq-list">
        {faq.map((item, index) => (
          <details key={item.question} open={index === 0}>
            <summary>
              {item.question}
              <span>+</span>
            </summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
