import type { Metadata } from "next";
import Link from "next/link";
import { LakeVisual } from "../../components/lake-visual";
import { SectionHeading } from "../../components/section-heading";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "The Destination",
  description: "The destination perspective behind Lakefront Capital and Development.",
  path: "/destination",
});

export default function DestinationPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container-shell page-hero__grid">
          <div>
            <p className="eyebrow">The destination</p>
            <h1>Let the lake set the pace.</h1>
          </div>
          <div className="page-hero__aside">
            <p>
              Tarbela Lake is the starting point for a more considered relationship with place, development,
              and arrival.
            </p>
            <p>This preview keeps destination context separate from unconfirmed project claims.</p>
          </div>
        </div>
      </section>
      <section className="destination-section">
        <div className="container-shell destination-section__grid">
          <div className="destination-section__copy">
            <SectionHeading
              eyebrow="A place before a plan"
              title="The landscape carries the first idea."
              description="Lakefront Capital and Development begins with the water and the surrounding landscape, then introduces each development according to what is actually known."
            />
            <Link className="text-link" href="/vision">
              Read the vision <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="destination-section__visual">
            <LakeVisual tone="mist" label="Tarbela Lake / place first" />
          </div>
        </div>
      </section>
      <section className="vision-section">
        <div className="container-shell vision-section__grid">
          <div className="vision-section__copy">
            <p className="eyebrow">A simple editorial rule</p>
            <h2>Context is part of trust.</h2>
            <p>
              A visitor should be able to understand what is active, what is available to explore, and what
              remains a future idea without needing a sales conversation to decode it.
            </p>
          </div>
          <div className="placeholder-panel">
            <div className="placeholder-panel__visual lake-visual lake-visual--warm" aria-hidden="true" />
            <h3>Destination notes are coming into focus.</h3>
            <p>
              Field notes, local context, and useful destination guidance will be added as approved material
              becomes available.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
