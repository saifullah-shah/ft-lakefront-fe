import { siteConfig } from "./site-config";

const apiBase = siteConfig.apiUrl;

export type TrackableEvent =
  | "PAGE_VIEW"
  | "ENQUIRY_STARTED"
  | "ENQUIRY_SUBMITTED"
  | "SITE_VISIT_REQUESTED"
  | "EARLY_ACCESS_JOINED"
  | "NEWSLETTER_JOINED";

export function trackEvent(name: TrackableEvent, path: string, projectSlug?: string): void {
  if (!apiBase || typeof window === "undefined") {
    return;
  }

  const payload = JSON.stringify({
    name,
    path: path.slice(0, 200),
    ...(projectSlug ? { projectSlug } : {}),
  });

  if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
    navigator.sendBeacon(
      `${apiBase}/api/v1/public/events`,
      new Blob([payload], { type: "application/json" }),
    );
    return;
  }

  void fetch(`${apiBase}/api/v1/public/events`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => undefined);
}
