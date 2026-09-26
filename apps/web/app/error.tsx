"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (error.digest) {
      console.error("Route error", error.digest);
    }
  }, [error]);

  return (
    <section className="page-hero">
      <div className="container-shell page-hero__grid">
        <div>
          <p className="eyebrow">Something went wrong</p>
          <h1>This page could not load.</h1>
        </div>
        <div className="page-hero__aside">
          <p>The problem has been recorded. You can try again, or continue to another part of the site.</p>
          <div className="hero-section__actions">
            <button className="button button--dark" type="button" onClick={reset}>
              Try again
            </button>
            <Link className="button button--outline" href="/">
              Return home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
