import type { Metadata } from "next";
import { EnquiryForm } from "../../components/enquiry-form";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Request a Site Visit",
  description: "Request a Lakefront site visit; confirmation follows after review.",
  path: "/site-visit",
});

export default function SiteVisitPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container-shell page-hero__grid">
          <div>
            <p className="eyebrow">Site visits</p>
            <h1>See the context in person.</h1>
          </div>
          <div className="page-hero__aside">
            <p>
              Share your preferred location, date, and contact details. Your request will be reviewed before a
              visit is confirmed.
            </p>
            <p>Submitting this form does not create a confirmed appointment.</p>
          </div>
        </div>
      </section>
      <section className="enquiry-section">
        <div className="container-shell enquiry-section__grid">
          <div className="enquiry-section__copy">
            <p className="eyebrow">Request, then confirm</p>
            <h2>Plan the right visit.</h2>
            <p>
              Access, safety, staffing, and timing will be confirmed by the team before an appointment is
              finalized.
            </p>
          </div>
          <EnquiryForm kind="SITE_VISIT" />
        </div>
      </section>
    </>
  );
}
