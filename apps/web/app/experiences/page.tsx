import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "../../components/section-heading";
import { FactStateBadge } from "../../components/fact-state-badge";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Experiences",
  description: "Destination and future experience concepts from Lakefront, clearly labelled by status.",
  path: "/experiences",
});

const experiences = [
  {
    title: "Time at the water",
    state: "CONCEPT" as const,
    description:
      "A future direction for unhurried lakeside time. This is concept material, not a description of an operating facility.",
  },
  {
    title: "Landscape arrival",
    state: "CONCEPT" as const,
    description:
      "An idea for how a visit might begin. Access routes and final design are still being confirmed.",
  },
  {
    title: "Development progress",
    state: "CONFIRMED" as const,
    description:
      "Location 2 is the active chapter today. Verified progress notes will appear here as evidence is approved for publication.",
  },
];

export default function ExperiencesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container-shell page-hero__grid">
          <div>
            <p className="eyebrow">Experiences</p>
            <h1>What the destination could hold.</h1>
          </div>
          <div className="page-hero__aside">
            <p>
              Experience material is separated by status so a future idea is never mistaken for something
              operating today.
            </p>
            <p>Nothing on this page is a booking promise.</p>
          </div>
        </div>
      </section>
      <section className="project-section">
        <div className="container-shell destination-section__grid">
          <div className="destination-section__copy">
            <SectionHeading
              eyebrow="Clearly labelled"
              title="Concepts stay labelled as concepts."
              description="Each experience carries its own status. Confirmed operational details will only be added when the business approves them for publication."
            />
            <Link className="text-link" href="/site-visit">
              Request a site visit <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="experience-list">
            {experiences.map((experience) => (
              <article className="experience-list__item" key={experience.title}>
                <div className="experience-list__heading">
                  <h3>{experience.title}</h3>
                  <FactStateBadge state={experience.state} />
                </div>
                <p>{experience.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
