import type { Metadata } from "next";
import { EnquiryForm } from "../../components/enquiry-form";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Start a conversation with Lakefront Capital and Development.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container-shell page-hero__grid">
          <div>
            <p className="eyebrow">Contact Lakefront</p>
            <h1>Start with a real question.</h1>
          </div>
          <div className="page-hero__aside">
            <p>
              Tell us which location or idea brought you here. The team can respond with the approved
              information relevant to your enquiry.
            </p>
            <p>Booking is not available through this form.</p>
          </div>
        </div>
      </section>
      <section className="enquiry-section">
        <div className="container-shell enquiry-section__grid">
          <div className="enquiry-section__copy">
            <p className="eyebrow">A direct route</p>
            <h2>Let’s make the context clearer.</h2>
            <p>
              Approved phone, email, WhatsApp, and address details will be added here once confirmed by the
              business.
            </p>
          </div>
          <EnquiryForm kind="GENERAL_INQUIRY" />
        </div>
      </section>
    </>
  );
}
