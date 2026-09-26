"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { trackEvent } from "../lib/analytics-client";

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackEvent("PAGE_VIEW", pathname);
  }, [pathname]);

  return null;
}
