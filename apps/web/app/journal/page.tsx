import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedJournalEntries } from "@lakefront/content-model";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Journal",
  description: "Destination notes and development updates from Lakefront.",
  path: "/journal",
});

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

export default function JournalPage() {
  const entries = getPublishedJournalEntries();

  return (
    <>
      <section className="page-hero">
        <div className="container-shell page-hero__grid">
          <div>
            <p className="eyebrow">The journal</p>
            <h1>Notes from the lake.</h1>
          </div>
          <div className="page-hero__aside">
            <p>
              Destination context, development notes, and considered explanations for people who want to
              understand the story behind the locations.
            </p>
            <p>Entries move from draft to review to published, and only published entries appear here.</p>
          </div>
        </div>
      </section>
      <section className="journal-section">
        <div className="container-shell">
          <div className="journal-list">
            {entries.map((entry) => (
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
    </>
  );
}
