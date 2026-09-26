import type { Metadata } from "next";
import { pageMetadata } from "../../../lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description:
    "How Lakefront Capital and Development handles enquiry, site-visit, and update-request information.",
  path: "/legal/privacy",
});

export default function PrivacyPage() {
  return (
    <section className="page-hero">
      <div className="container-shell page-hero__grid">
        <div>
          <p className="eyebrow">Legal</p>
          <h1>Privacy notice.</h1>
        </div>
        <div className="page-hero__aside">
          <p>This notice is a planning placeholder and must be reviewed by the business before launch.</p>
          <p>
            The final notice will explain what information is collected, why it is used, how long it is
            retained, and how a visitor can request access or deletion.
          </p>
          <div className="status-callout">
            <strong>Planned approach</strong>
            <p>
              Enquiry and site-visit details are used only to respond to the request. Marketing updates are a
              separate, opt-in consent. Measurement is first-party and aggregate: page and event counts with
              no cookies, no advertising identifiers, and no personal data attached.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
