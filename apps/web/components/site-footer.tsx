import Link from "next/link";
import { EnquiryForm } from "./enquiry-form";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__top">
        <div>
          <p className="eyebrow">Lakefront Capital &amp; Development</p>
          <p className="site-footer__statement">A considered relationship with Tarbela Lake.</p>
        </div>
        <Link className="button button--small button--light" href="/contact">
          Start a conversation <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <div className="site-footer__grid">
        <div>
          <p className="footer-label">Explore</p>
          <Link href="/developments">Developments</Link>
          <Link href="/destination">The Destination</Link>
          <Link href="/vision">Vision</Link>
          <Link href="/masterplan">Masterplan</Link>
        </div>
        <div>
          <p className="footer-label">Discover</p>
          <Link href="/journal">Journal</Link>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/site-visit">Request a site visit</Link>
        </div>
        <div>
          <p className="footer-label">Notes</p>
          <EnquiryForm kind="NEWSLETTER" inline />
        </div>
      </div>
      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} Lakefront Capital &amp; Development</span>
        <div>
          <Link href="/legal/privacy">Privacy</Link>
          <Link href="/legal/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
