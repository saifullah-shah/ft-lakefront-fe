import Link from "next/link";
import { getPublishedJournalEntries } from "@lakefront/content-model";
import { FactStateBadge } from "../components/fact-state-badge";
import { FaqSection } from "../components/faq-section";
import { HomeStructuredData } from "../components/home-structured-data";
import { LakeVisual } from "../components/lake-visual";
import { ProjectCard } from "../components/project-card";
import { SectionHeading } from "../components/section-heading";
import { HeroImage } from "../components/hero-image";
import { getProjects } from "../lib/content";

const categoryLabels = {
  DESTINATION: "Destination",
  DEVELOPMENT: "Development",
  FUTURE: "Future",
} as const;

const experiencePreview = [
  {
    title: "Time at the water",
    state: "CONCEPT" as const,
    note: "A future direction for unhurried lakeside time. Not an operating facility.",
  },
  {
    title: "Development progress",
    state: "CONFIRMED" as const,
    note: "Location 2 is the active chapter today, with verified updates as they are approved.",
  },
];

const trustPoints = [
  {
    title: "Status before sales language",
    body: "Each location states what stage it is actually at, with the unknowns named rather than smoothed over.",
  },
  {
    title: "Claims before persuasion",
    body: "Facts carry a state, and anything unconfirmed is labelled as awaiting confirmation or as concept material.",
  },
  {
    title: "A real next step",
    body: "Enquiries, details requests, and site-visit requests create an auditable record instead of a vague promise.",
  },
];

function formatDate(value: string): string {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function HomePage() {
  const projects = await getProjects();
  const journalPreview = getPublishedJournalEntries().slice(0, 3);

  return (
    <>
      <HomeStructuredData />
      <section className="hero-section">
        <HeroImage />
        <div className="hero-section__inner">
          <div className="hero-section__copy">
            <p className="eyebrow">Lakefront Capital &amp; Development / Tarbela Lake</p>
            <h1 className="display-title">
              A considered relationship with <em>water.</em>
            </h1>
            <p className="lede">
              Three distinct locations. One destination context. A slower, clearer way to explore land,
              development, and the future of a lake-side resort.
            </p>
            <div className="hero-section__actions">
              <Link className="button button--light" href="/developments">
                Explore the locations <span aria-hidden="true">↗</span>
              </Link>
              <Link className="button button--outline" href="/destination">
                Discover the destination
              </Link>
            </div>
            <ul className="hero-section__facts">
              <li className="glass-chip">
                <span className="glass-chip__dot" aria-hidden="true" />
                Land opportunity
              </li>
              <li className="glass-chip">
                <span className="glass-chip__dot" aria-hidden="true" />
                Active development
              </li>
              <li className="glass-chip">
                <span className="glass-chip__dot" aria-hidden="true" />
                Future resort
              </li>
            </ul>
          </div>
          <span className="hero-section__index">01 / Destination development</span>
        </div>
      </section>

      <section className="project-section">
        <div className="container-shell">
          <div className="project-section__intro">
            <SectionHeading
              eyebrow="The Lakefront locations"
              title="Three places. Different chapters."
              description="Each location has its own status, purpose, and next step. The distinction is the point."
            />
            <Link className="text-link" href="/developments">
              View all developments <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="project-grid">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>

      <section className="destination-section">
        <div className="container-shell destination-section__grid">
          <div className="destination-section__copy">
            <p className="eyebrow">The destination</p>
            <h2>Begin with the place, not the promise.</h2>
            <p>
              Lakefront is a destination-development story rooted in Tarbela Lake. The approach is to make
              room for the landscape first, then introduce each development with the clarity it deserves.
            </p>
            <Link className="text-link" href="/destination">
              Read the destination perspective <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="destination-section__visual">
            <LakeVisual tone="mist" label="Landscape / water / context" />
          </div>
        </div>
      </section>

      <section className="vision-section">
        <div className="container-shell vision-section__grid">
          <div className="vision-section__copy">
            <p className="eyebrow">The Lakefront vision</p>
            <h2>Build a destination people can understand.</h2>
            <p>
              The goal is a clear relationship between place, development, and the people who may want to be
              part of it. That means honest status, considered language, and enough room for the future to
              remain a future.
            </p>
          </div>
          <div className="principle-list">
            <div className="principle-list__item">
              <span className="principle-list__number">01</span>
              <div>
                <strong>Place before product</strong>
                <p>
                  The lake and its landscape lead the narrative before any offer or facility is introduced.
                </p>
              </div>
            </div>
            <div className="principle-list__item">
              <span className="principle-list__number">02</span>
              <div>
                <strong>Status before sales language</strong>
                <p>
                  Land, active development, and future resort are separate paths with separate next steps.
                </p>
              </div>
            </div>
            <div className="principle-list__item">
              <span className="principle-list__number">03</span>
              <div>
                <strong>Progress with context</strong>
                <p>Updates arrive when they are supported, not when a page needs to fill a gap.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="journal-section">
        <div className="container-shell">
          <div className="journal-section__header">
            <div>
              <p className="eyebrow">The journal</p>
              <h2>Notes from the lake.</h2>
            </div>
            <Link className="text-link" href="/journal">
              Read the journal <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="journal-list">
            {journalPreview.map((entry) => (
              <Link className="journal-list__item" href={`/journal/${entry.slug}`} key={entry.slug}>
                <span className="journal-list__date">{formatDate(entry.publishedOn)}</span>
                <span className="journal-list__title">{entry.title}</span>
                <span className="journal-list__description">{entry.dek}</span>
                <span className="journal-list__arrow" aria-hidden="true">
                  ↗
                </span>
                <span className="journal-list__category">{categoryLabels[entry.category]}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="project-section">
        <div className="container-shell destination-section__grid">
          <div className="destination-section__copy">
            <SectionHeading
              eyebrow="Experiences"
              title="Confirmed first. Proposed, clearly marked."
              description="Experience material is separated by status so an idea is never mistaken for something operating today."
            />
            <Link className="text-link" href="/experiences">
              See the experience direction <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="experience-list">
            {experiencePreview.map((experience) => (
              <article className="experience-list__item" key={experience.title}>
                <div className="experience-list__heading">
                  <h3>{experience.title}</h3>
                  <FactStateBadge state={experience.state} />
                </div>
                <p>{experience.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="trust-section">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Trust and responsibility"
            title="What you can hold us to."
            description="No return promises, no invented progress, and no ambiguity about what is confirmed."
          />
          <div className="trust-grid">
            {trustPoints.map((point) => (
              <div className="trust-card" key={point.title}>
                <h3>{point.title}</h3>
                <p>{point.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqSection
        eyebrow="Status and process"
        title="The boundaries, up front."
        description="What the locations are, what is not yet confirmed, and what happens when you enquire."
      />

      <section className="contact-band">
        <div className="container-shell contact-band__grid">
          <div>
            <p className="eyebrow">A conversation, not a hard sell</p>
            <h2>Bring a question. Leave with context.</h2>
          </div>
          <div>
            <p>
              Tell us which location or idea brought you here. The team can share the right next step, without
              pretending that every detail is already confirmed.
            </p>
            <Link className="button button--light" href="/contact">
              Start a conversation <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
