import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "../../components/section-heading";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Masterplan",
  description: "A relationship view of the three Lakefront locations.",
  path: "/masterplan",
});

export default function MasterplanPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container-shell page-hero__grid">
          <div>
            <p className="eyebrow">The masterplan view</p>
            <h1>Three locations, one context.</h1>
          </div>
          <div className="page-hero__aside">
            <p>
              This is a relationship diagram, not a final engineering or investment plan. Exact coordinates
              and private plan layers remain unpublished until approved.
            </p>
            <p>Use the location pages for current status.</p>
          </div>
        </div>
      </section>
      <section className="project-section">
        <div className="container-shell destination-section__grid">
          <div className="destination-section__copy">
            <SectionHeading
              eyebrow="Orientation first"
              title="A map can wait. The relationships cannot."
              description="The first map experience is intentionally restrained: a public-safe diagram with text alternatives, followed by approved interactive layers only when the business is ready."
            />
            <Link className="text-link" href="/developments">
              Explore the three locations <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div
            className="map-placeholder"
            aria-label="Abstract relationship diagram for the three Lakefront locations"
          >
            <span className="map-placeholder__label">
              Public-safe relationship view / coordinates not published
            </span>
            <span className="map-placeholder__marker map-placeholder__marker--one">01</span>
            <span className="map-placeholder__marker map-placeholder__marker--two">02</span>
            <span className="map-placeholder__marker map-placeholder__marker--three">03</span>
          </div>
        </div>
      </section>
    </>
  );
}
