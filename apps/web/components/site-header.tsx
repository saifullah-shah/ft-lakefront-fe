import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

const navigation = [
  { href: "/developments", label: "Developments" },
  { href: "/destination", label: "The Destination" },
  { href: "/vision", label: "Vision" },
  { href: "/masterplan", label: "Masterplan" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand-mark" href="/" aria-label="Lakefront Capital and Development home">
          <span className="brand-mark__symbol" aria-hidden="true">
            LF
          </span>
          <span className="brand-mark__words">
            <strong>Lakefront</strong>
            <span>Capital &amp; Development</span>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-header__actions">
          <ThemeToggle />
          <Link className="button button--small button--dark" href="/contact">
            Inquire <span aria-hidden="true">↗</span>
          </Link>
          <details className="mobile-nav">
            <summary aria-label="Open navigation">
              <span className="mobile-nav__bars" aria-hidden="true" />
              <span>Menu</span>
            </summary>
            <nav aria-label="Mobile navigation">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
              <Link href="/contact">Inquire</Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
