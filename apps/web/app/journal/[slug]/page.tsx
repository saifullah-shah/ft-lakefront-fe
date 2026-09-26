import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getJournalEntryBySlug, getPublishedJournalEntries, projects } from "@lakefront/content-model";
import { ProjectCard } from "../../../components/project-card";
import { SectionHeading } from "../../../components/section-heading";
import { pageMetadata } from "../../../lib/metadata";

const categoryLabels = {
  DESTINATION: "Destination",
  DEVELOPMENT: "Development",
  FUTURE: "Future",
} as const;

function formatDate(value: string): string {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function generateStaticParams() {
  return getPublishedJournalEntries().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getJournalEntryBySlug(slug);
  if (!entry) {
    return { title: "Journal entry not found" };
  }
  return pageMetadata({
    title: entry.title,
    description: entry.dek,
    path: `/journal/${entry.slug}`,
    type: "article",
    publishedTime: entry.publishedOn,
  });
}

export default async function JournalEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getJournalEntryBySlug(slug);

  if (!entry) {
    notFound();
  }

  const related = projects.filter((project) => entry.relatedProjectSlugs.includes(project.slug));
  const more = getPublishedJournalEntries()
    .filter((item) => item.slug !== entry.slug)
    .slice(0, 2);

  return (
    <>
      <section className="page-hero">
        <div className="container-shell page-hero__grid">
          <div>
            <p className="eyebrow">
              {categoryLabels[entry.category]} / {formatDate(entry.publishedOn)}
            </p>
            <h1>{entry.title}</h1>
          </div>
          <div className="page-hero__aside">
            <p>{entry.dek}</p>
            <p>
              Last reviewed {formatDate(entry.lastReviewedOn)} by {entry.authorRole}.
            </p>
          </div>
        </div>
      </section>

      <article className="article-section">
        <div className="container-shell article-section__grid">
          <div className="article-section__body">
            {entry.body.map((block, index) =>
              block.type === "HEADING" ? <h2 key={index}>{block.text}</h2> : <p key={index}>{block.text}</p>,
            )}
          </div>
          <aside className="article-section__aside">
            <p className="footer-label">Entry details</p>
            <p className="article-section__meta">Published {formatDate(entry.publishedOn)}</p>
            <p className="article-section__meta">Last reviewed {formatDate(entry.lastReviewedOn)}</p>
            <p className="article-section__meta">By {entry.authorRole}</p>
            <Link className="text-link" href="/journal">
              All journal entries <span aria-hidden="true">↗</span>
            </Link>
          </aside>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="project-section">
          <div className="container-shell">
            <div className="project-section__intro">
              <SectionHeading
                eyebrow="Related locations"
                title="Where this applies."
                description="The locations referenced in this entry, with their current status."
              />
            </div>
            <div className="project-grid">
              {related.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {more.length > 0 ? (
        <section className="journal-section">
          <div className="container-shell">
            <div className="journal-section__header">
              <div>
                <p className="eyebrow">Keep reading</p>
                <h2>More from the journal.</h2>
              </div>
              <Link className="text-link" href="/journal">
                Read the journal <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className="journal-list">
              {more.map((item) => (
                <Link className="journal-list__item" href={`/journal/${item.slug}`} key={item.slug}>
                  <span className="journal-list__date">{formatDate(item.publishedOn)}</span>
                  <span className="journal-list__title">{item.title}</span>
                  <span className="journal-list__description">{item.dek}</span>
                  <span className="journal-list__arrow" aria-hidden="true">
                    ↗
                  </span>
                  <span className="journal-list__category">{categoryLabels[item.category]}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
