import type { Metadata } from "next";
import { pageMetadata } from "../../../lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Terms",
  description: "Terms governing use of the Lakefront Capital and Development website.",
  path: "/legal/terms",
});

export default function TermsPage() {
  return (
    <section className="page-hero">
      <div className="container-shell page-hero__grid">
        <div>
          <p className="eyebrow">Legal</p>
          <h1>Website terms.</h1>
        </div>
        <div className="page-hero__aside">
          <p>These terms are a planning placeholder and must be reviewed before launch.</p>
          <p>
            Final terms will distinguish general website information, location enquiries, site-visit requests,
            and any separately approved future booking terms.
          </p>
        </div>
      </div>
    </section>
  );
}
