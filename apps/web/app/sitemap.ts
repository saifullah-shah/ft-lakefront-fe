import type { MetadataRoute } from "next";
import { getPublishedJournalEntries, projects } from "@lakefront/content-model";
import { siteConfig } from "../lib/site-config";

const siteUrl = siteConfig.siteUrl;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const publishedJournalEntries = getPublishedJournalEntries();

  const staticRoutes = [
    "",
    "/destination",
    "/vision",
    "/masterplan",
    "/developments",
    "/experiences",
    "/journal",
    "/about",
    "/contact",
    "/site-visit",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...projects.map((project) => ({
      url: `${siteUrl}/developments/${project.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...publishedJournalEntries.map((entry) => ({
      url: `${siteUrl}/journal/${entry.slug}`,
      lastModified: new Date(entry.lastReviewedOn),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
