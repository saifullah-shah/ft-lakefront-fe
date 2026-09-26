import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "../../components/section-heading";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Vision",
  description: "The long-term destination-development vision behind Lakefront Capital and Development.",
  path: "/vision",
});

export default function VisionPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container-shell page-hero__grid">
          <div>
            <p className="eyebrow">The vision</p>
            <h1>Make room for the next chapter.</h1>
          </div>
          <div className="page-hero__aside">
            <p>
              Lakefront is a long-term destination-development vision built around distinct locations and a
              clear relationship with place.
            </p>
            <p>Vision can be ambitious while the public status remains precise.</p>
          </div>
        </div>
      </section>
      <section className="vision-section">
        <div className="container-shell vision-section__grid">
          <div className="vision-section__copy">
            <SectionHeading
              eyebrow="The approach"
              title="A destination with a point of view."
              description="The platform is designed to introduce the lake, the locations, and the future without collapsing them into one generic sales story."
            />
            <Link className="text-link" href="/masterplan">
              See the relationship view <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="principle-list">
            <div className="principle-list__item">
              <span className="principle-list__number">01</span>
              <div>
                <strong>Place-led</strong>
                <p>The lake and landscape are part of every introduction.</p>
              </div>
            </div>
            <div className="principle-list__item">
              <span className="principle-list__number">02</span>
              <div>
                <strong>Distinct</strong>
                <p>Each location has its own status, audience, and next step.</p>
              </div>
            </div>
            <div className="principle-list__item">
              <span className="principle-list__number">03</span>
              <div>
                <strong>Progressive</strong>
                <p>Future content can mature as facts, plans, and operations are approved.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
