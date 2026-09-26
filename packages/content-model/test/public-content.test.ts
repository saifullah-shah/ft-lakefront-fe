import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { publicProjectListSchema, publicProjectSchema } from "@lakefront/contracts";
import {
  faqItems,
  getProjectBySlug,
  getProjectsByStatus,
  getPublishedFaqItems,
  getPublishedJournalEntries,
  getPublishedMediaAssets,
  getJournalEntryBySlug,
  journalEntries,
  mediaAssets,
  projects,
} from "../src/index.js";

const coordinatePattern = /\b\d{1,3}\.\d{4,}\s*,\s*\d{1,3}\.\d{4,}\b/;
const bannedLanguage =
  /\b(guaranteed returns?|roi of|appreciation of|assured rental|book now|reserve now|available now)\b/i;

describe("published project content", () => {
  it("exposes exactly three valid, booking-disabled projects", () => {
    const result = publicProjectListSchema.safeParse({ data: projects });
    assert.equal(result.success, true);
    assert.equal(projects.length, 3);
    assert.deepEqual(
      projects.map((project) => project.locationNumber),
      [1, 2, 3],
    );
    assert.ok(projects.every((project) => project.bookingEnabled === false));
  });

  it("keeps the three statuses distinct", () => {
    assert.deepEqual(
      projects.map((project) => project.status),
      ["LAND_OPPORTUNITY", "ACTIVE_DEVELOPMENT", "FUTURE_RESORT"],
    );
    assert.equal(getProjectsByStatus("ACTIVE_DEVELOPMENT").length, 1);
    assert.equal(getProjectsByStatus("FUTURE_RESORT")[0].slug, "location-3-future-resort");
  });

  it("labels every fact with a state", () => {
    for (const project of projects) {
      for (const fact of project.facts) {
        assert.ok(["CONFIRMED", "PENDING_CONFIRMATION", "CONCEPT", "NOT_AVAILABLE"].includes(fact.state));
      }
    }
  });

  it("contains no coordinates, banned claims, or template tokens", () => {
    const serialized = JSON.stringify(projects);
    assert.equal(coordinatePattern.test(serialized), false);
    assert.equal(bannedLanguage.test(serialized), false);
    assert.equal(/\{\{|\}\}|lorem ipsum|TODO|TBD/gi.test(serialized), false);
  });

  it("keeps the future resort explicitly not bookable", () => {
    const future = getProjectBySlug("location-3-future-resort");
    assert.ok(future);
    assert.equal(publicProjectSchema.safeParse(future).success, true);
    assert.match(future.statusNote, /not currently open or bookable/i);
  });
});

describe("public filtering", () => {
  it("never returns draft or in-review journal entries", () => {
    const published = getPublishedJournalEntries();
    assert.ok(published.length >= 3);
    assert.ok(published.every((entry) => entry.publicationState === "PUBLISHED"));
    assert.equal(
      published.some((entry) => entry.slug === "internal-draft-placeholder"),
      false,
    );
    assert.equal(journalEntries.length, published.length + 1);
  });

  it("does not resolve a draft entry by slug", () => {
    assert.equal(getJournalEntryBySlug("internal-draft-placeholder"), undefined);
    assert.ok(getJournalEntryBySlug("a-future-resort-clearly-labelled"));
  });

  it("sorts journal entries newest first", () => {
    const dates = getPublishedJournalEntries().map((entry) => entry.publishedOn);
    assert.deepEqual(dates, [...dates].sort().reverse());
  });

  it("scopes FAQ items to a project when one is given", () => {
    const global = getPublishedFaqItems();
    const scoped = getPublishedFaqItems("location-3-future-resort");
    assert.ok(global.every((item) => item.projectSlug === null));
    assert.ok(scoped.length > global.length);
    assert.ok(
      scoped.every((item) => item.projectSlug === "location-3-future-resort" || item.projectSlug === null),
    );
    assert.ok(global.every((item) => scoped.includes(item)));
    assert.ok(scoped.some((item) => item.id === "location-3-booking"));
    assert.ok(scoped.every((item) => item.publicationState === "PUBLISHED"));
    assert.equal(faqItems.filter((item) => item.publicationState !== "PUBLISHED").length, 0);
  });

  it("returns only published media for the requested project", () => {
    for (const project of projects) {
      const assets = getPublishedMediaAssets(project.slug);
      assert.ok(assets.length > 0);
      assert.ok(assets.every((asset) => asset.publicationState === "PUBLISHED"));
      assert.ok(assets.every((asset) => asset.alt.length > 0));
    }
    assert.equal(mediaAssets.filter((asset) => asset.publicationState !== "PUBLISHED").length, 0);
  });

  it("marks future-resort imagery as a rendering", () => {
    const futureMedia = getPublishedMediaAssets("location-3-future-resort");
    assert.ok(futureMedia.some((asset) => asset.isRendering));
  });
});
