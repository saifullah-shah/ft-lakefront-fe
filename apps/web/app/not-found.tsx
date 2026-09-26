import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-hero">
      <div className="container-shell page-hero__grid">
        <div>
          <p className="eyebrow">404 / Not found</p>
          <h1>This chapter is not here.</h1>
        </div>
        <div className="page-hero__aside">
          <p>The page may have moved, or the address may not be approved for publication yet.</p>
          <Link className="text-link" href="/">
            Return home <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
