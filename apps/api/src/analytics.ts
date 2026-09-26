import type { AnalyticsEvent } from "@lakefront/contracts";

export type EventCount = {
  name: AnalyticsEvent["name"];
  path: string;
  projectSlug?: string;
  count: number;
};

export type AnalyticsSummary = {
  total: number;
  events: EventCount[];
  firstSeenAt: string;
  lastSeenAt: string;
};

export type AnalyticsStore = {
  record(event: AnalyticsEvent): void;
  summary(): AnalyticsSummary;
};

const MAX_TRACKED_KEYS = 500;

export function createAnalyticsStore(): AnalyticsStore {
  const counts = new Map<string, EventCount>();
  let total = 0;
  let firstSeenAt: Date | undefined;
  let lastSeenAt: Date | undefined;

  return {
    record(event) {
      const now = new Date();
      const key = `${event.name}|${event.path}|${event.projectSlug ?? ""}`;
      const existing = counts.get(key);

      if (existing) {
        existing.count += 1;
      } else {
        if (counts.size >= MAX_TRACKED_KEYS) {
          const oldestKey = counts.keys().next().value;
          if (oldestKey !== undefined) {
            counts.delete(oldestKey);
          }
        }
        counts.set(key, {
          name: event.name,
          path: event.path,
          ...(event.projectSlug ? { projectSlug: event.projectSlug } : {}),
          count: 1,
        });
      }

      total += 1;
      firstSeenAt = firstSeenAt ?? now;
      lastSeenAt = now;
    },

    summary() {
      const events = [...counts.values()].sort((a, b) => b.count - a.count);
      return {
        total,
        events,
        firstSeenAt: (firstSeenAt ?? new Date()).toISOString(),
        lastSeenAt: (lastSeenAt ?? new Date()).toISOString(),
      };
    },
  };
}
