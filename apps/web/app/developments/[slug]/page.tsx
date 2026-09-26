import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, getProjects } from "../../../lib/content";
import { EnquiryForm } from "../../../components/enquiry-form";
import { FactStateBadge } from "../../../components/fact-state-badge";
import { FaqSection } from "../../../components/faq-section";
import { LakeVisual } from "../../../components/lake-visual";
import { MediaGallery } from "../../../components/media-gallery";
import { ProjectCard } from "../../../components/project-card";
import { StatusBadge } from "../../../components/status-badge";
import { projects as seedProjects } from "@lakefront/content-model";
import { pageMetadata } from "../../../lib/metadata";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return seedProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) {
    return { title: "Location not found" };
  }
  return pageMetadata({
    title: `${project.title} / ${project.statusLabel}`,
    description: project.shortDescription,
    path: `/developments/${project.slug}`,
  });
}

const toneByLocation = {
  1: "deep",
  2: "warm",
  3: "mist",
} as const;

const formKindByStatus = {
  LAND_OPPORTUNITY: "LOCATION_DETAILS",
  ACTIVE_DEVELOPMENT: "DEVELOPMENT_UPDATES",
  FUTURE_RESORT: "EARLY_ACCESS",
} as const;

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) {
    notFound();
  }

  const allProjects = await getProjects();
  const related = allProjects.filter((item) => item.slug !== project.slug);
  const formKind = formKindByStatus[project.status];
  const isFutureResort = project.status === "FUTURE_RESORT";

  return (
    <>
      <section className="location-hero">
        <LakeVisual
          tone={toneByLocation[project.locationNumber as keyof typeof toneByLocation]}
          label={project.heroCaption}
        />
        <div className="container-shell location-hero__inner">
          <div className="location-hero__top">
            <p className="eyebrow">{project.eyebrow}</p>
            <StatusBadge status={project.status} />
          </div>
          <div className="location-hero__bottom">
            <div>
              <h1 className="location-hero__title">{project.title}</h1>
              <p className="location-hero__description">{project.shortDescription}</p>
            </div>
            <span className="location-hero__status">0{project.locationNumber} / 03</span>
          </div>
        </div>
      </section>

      <section className="location-content">
        <div className="container-shell location-content__grid">
          <div className="location-content__main">
            <p className="eyebrow">The current context</p>
            <h2>{isFutureResort ? "A future, kept honest." : "Context before commitment."}</h2>
            <p>{project.description}</p>
            <div className="status-callout">
              <strong>Status note</strong>
              <p>{project.statusNote}</p>
            </div>
            {isFutureResort ? (
              <div className="status-callout status-callout--strong">
                <strong>Not currently open or bookable</strong>
                <p>
                  There is no reservation, availability calendar, room or villa inventory, or payment route
                  for this location. Any early-access sign-up is an update list only.
                </p>
              </div>
            ) : null}
          </div>
          <aside className="fact-panel" aria-label={`${project.title} facts`}>
            <div className="fact-panel__heading">At a glance</div>
            {project.facts.map((fact) => (
              <div className="fact-panel__item" key={fact.label}>
                <span className="fact-panel__label">{fact.label}</span>
                <span className="fact-panel__value">{fact.value}</span>
                <FactStateBadge state={fact.state} />
              </div>
            ))}
          </aside>
        </div>
      </section>

      <section className="location-context">
        <div className="container-shell location-context__grid">
          <div className="location-context__heading">
            <p className="eyebrow">Media and documents</p>
            <h2>What is available, and what is not yet.</h2>
            <p>
              Approved imagery and documents are labelled by type and rights status. Placeholders are shown
              until the business approves the asset, so nothing implies coverage or access that does not
              exist.
            </p>
          </div>
          <MediaGallery projectSlug={project.slug} />
        </div>
      </section>

      <section className="process-section">
        <div className="container-shell process-section__grid">
          <div className="process-section__copy">
            <p className="eyebrow">The document and enquiry process</p>
            <h2>What happens after you enquire.</h2>
            <p>
              An enquiry creates a record with a reference code, not a commitment. The team reviews what you
              need, responds through the contact details you provide, and confirms what can actually be
              shared.
            </p>
          </div>
          <ol className="process-list">
            <li className="process-list__item">
              <span className="process-list__number">01</span>
              <div>
                <strong>You send an enquiry</strong>
                <p>Choose a location if it matters, and describe what you need.</p>
              </div>
            </li>
            <li className="process-list__item">
              <span className="process-list__number">02</span>
              <div>
                <strong>The team reviews it</strong>
                <p>Your enquiry is recorded and routed to the responsible person.</p>
              </div>
            </li>
            <li className="process-list__item">
              <span className="process-list__number">03</span>
              <div>
                <strong>Approved information is shared</strong>
                <p>Details, documents, and site access are confirmed before anything is arranged.</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <FaqSection
        projectSlug={project.slug}
        eyebrow={`${project.title} questions`}
        title="Status, availability, and process."
        description={`The questions we are asked most about ${project.title.toLowerCase()}, answered without overstating what is confirmed.`}
      />

      <section className="location-lower">
        <div className="container-shell location-lower__grid">
          <div className="location-lower__copy">
            <p className="eyebrow">The next step</p>
            <h2>
              {isFutureResort ? "Follow the idea from the beginning." : "Ask for the details that matter."}
            </h2>
            <p>
              {isFutureResort
                ? "Join the early-access list for approved updates. This is not a reservation, booking, or availability guarantee."
                : "Send a considered enquiry and the team can share the approved information relevant to your question."}
            </p>
          </div>
          <EnquiryForm kind={formKind} projectSlug={project.slug} projectTitle={project.title} compact />
        </div>
      </section>

      <section className="project-section">
        <div className="container-shell">
          <div className="project-section__intro">
            <div className="section-heading">
              <p className="eyebrow">Continue exploring</p>
              <h2>Two other chapters.</h2>
            </div>
            <Link className="text-link" href="/developments">
              All developments <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="project-grid">
            {related.map((item) => (
              <ProjectCard key={item.slug} project={item} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
