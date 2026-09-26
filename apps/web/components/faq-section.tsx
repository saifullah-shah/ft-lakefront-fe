import { getPublishedFaqItems } from "@lakefront/content-model";
import { SectionHeading } from "./section-heading";

export function FaqSection({
  projectSlug,
  eyebrow = "Questions, answered",
  title = "Before you get in touch.",
  description = "Status, availability, and process questions that come up most often.",
}: {
  projectSlug?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  const items = getPublishedFaqItems(projectSlug);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="faq-section">
      <div className="container-shell faq-section__grid">
        <div className="faq-section__intro">
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        </div>
        <div className="faq-list">
          {items.map((item) => (
            <details className="faq-list__item" key={item.id}>
              <summary className="faq-list__question">
                <span>{item.question}</span>
                <span className="faq-list__marker" aria-hidden="true">
                  +
                </span>
              </summary>
              <p className="faq-list__answer">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
