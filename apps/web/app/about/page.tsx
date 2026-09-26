import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "../../components/section-heading";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: "About Lakefront Capital and Development.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container-shell page-hero__grid">
          <div>
            <p className="eyebrow">About Lakefront</p>
            <h1>Development with a destination in mind.</h1>
          </div>
          <div className="page-hero__aside">
            <p>
              Lakefront Capital and Development is a destination-development company focused on a considered
              relationship with Tarbela Lake.
            </p>
            <p>
              Company and ownership details will be published only after the appropriate business
              confirmation.
            </p>
          </div>
        </div>
      </section>
      <section className="vision-section">
        <div className="container-shell vision-section__grid">
          <div className="vision-section__copy">
            <SectionHeading
              eyebrow="The company perspective"
              title="Clarity is part of the experience."
              description="The public platform is designed to make each location understandable, keep future ideas visibly future, and give visitors a direct route to a real conversation."
            />
            <Link className="text-link" href="/contact">
              Talk to Lakefront <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="placeholder-panel">
            <h3>Business information is being prepared.</h3>
            <p>
              Approved company details, contact channels, and supporting documentation will be added to this
              page when they are confirmed.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
