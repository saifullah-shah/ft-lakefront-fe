import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  allowedPublicationTransitions,
  analyticsEventSchema,
  canTransitionPublication,
  faqItemSchema,
  isPubliclyVisible,
  journalEntrySchema,
  mediaAssetSchema,
  publicProjectSchema,
  type PublicationState,
} from "../src/index.js";

describe("publication workflow", () => {
  it("allows only the documented transitions", () => {
    assert.equal(canTransitionPublication("DRAFT", "IN_REVIEW"), true);
    assert.equal(canTransitionPublication("DRAFT", "PUBLISHED"), false);
    assert.equal(canTransitionPublication("IN_REVIEW", "PUBLISHED"), true);
    assert.equal(canTransitionPublication("PUBLISHED", "DRAFT"), false);
    assert.equal(canTransitionPublication("PUBLISHED", "IN_REVIEW"), true);
    assert.equal(canTransitionPublication("ARCHIVED", "PUBLISHED"), false);
    assert.equal(canTransitionPublication("ARCHIVED", "DRAFT"), true);
  });

  it("treats only published content as publicly visible", () => {
    const states: PublicationState[] = ["DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"];
    assert.deepEqual(states.filter(isPubliclyVisible), ["PUBLISHED"]);
  });

  it("keeps every transition target inside the state list", () => {
    const states: PublicationState[] = ["DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"];
    for (const targets of Object.values(allowedPublicationTransitions)) {
      for (const target of targets) {
        assert.ok(states.includes(target));
      }
    }
  });
});

describe("public project rules", () => {
  const baseProject = {
    slug: "location-test",
    locationNumber: 1,
    status: "LAND_OPPORTUNITY" as const,
    statusLabel: "Land opportunity",
    statusNote: "Current status requires confirmation.",
    title: "Location 1",
    shortDescription: "Short description.",
    description: "Longer description.",
    eyebrow: "Location 1 / Land opportunity",
    heroCaption: "Caption.",
    facts: [
      {
        label: "Current brief",
        value: "Reported as ready to sell as-is",
        state: "PENDING_CONFIRMATION" as const,
      },
    ],
    primaryCta: "Request location details",
    secondaryCta: "Request a site visit",
    audience: "For qualified visitors.",
  };

  it("requires booking to stay disabled", () => {
    assert.equal(publicProjectSchema.safeParse({ ...baseProject, bookingEnabled: false }).success, true);
    assert.equal(publicProjectSchema.safeParse({ ...baseProject, bookingEnabled: true }).success, false);
    assert.equal(publicProjectSchema.safeParse(baseProject).success, false);
  });

  it("rejects a fact with an unknown state", () => {
    const result = publicProjectSchema.safeParse({
      ...baseProject,
      bookingEnabled: false,
      facts: [{ label: "Status", value: "Value", state: "ALMOST_SURE" }],
    });
    assert.equal(result.success, false);
  });

  it("keeps status note length bounded", () => {
    const result = publicProjectSchema.safeParse({
      ...baseProject,
      bookingEnabled: false,
      statusNote: "x".repeat(501),
    });
    assert.equal(result.success, false);
  });
});

describe("editorial and media schemas", () => {
  it("requires an ISO publication date", () => {
    const baseEntry = {
      slug: "entry",
      title: "Title",
      dek: "Dek",
      category: "DESTINATION" as const,
      publishedOn: "2026-09-18",
      lastReviewedOn: "2026-09-18",
      authorRole: "Lakefront editorial",
      relatedProjectSlugs: [],
      body: [{ type: "PARAGRAPH" as const, text: "Body text." }],
      publicationState: "PUBLISHED" as const,
    };
    assert.equal(journalEntrySchema.safeParse(baseEntry).success, true);
    assert.equal(journalEntrySchema.safeParse({ ...baseEntry, publishedOn: "18-09-2026" }).success, false);
  });

  it("requires alt text and a rights state on media", () => {
    const baseAsset = {
      id: "asset",
      projectSlug: null,
      kind: "PLACEHOLDER" as const,
      title: "Title",
      alt: "Descriptive alternative text.",
      caption: null,
      credit: null,
      rights: "PENDING" as const,
      isRendering: false,
      publicationState: "PUBLISHED" as const,
    };
    assert.equal(mediaAssetSchema.safeParse(baseAsset).success, true);
    assert.equal(mediaAssetSchema.safeParse({ ...baseAsset, alt: "" }).success, false);
    assert.equal(mediaAssetSchema.safeParse({ ...baseAsset, rights: "UNKNOWN" }).success, false);
  });

  it("requires an answer and a topic on FAQ items", () => {
    const baseItem = {
      id: "item",
      topic: "BOOKING" as const,
      question: "Can I book?",
      answer: "No.",
      projectSlug: null,
      publicationState: "PUBLISHED" as const,
    };
    assert.equal(faqItemSchema.safeParse(baseItem).success, true);
    assert.equal(faqItemSchema.safeParse({ ...baseItem, answer: "" }).success, false);
  });
});

describe("analytics payload rules", () => {
  it("allows only the agreed event names", () => {
    assert.equal(analyticsEventSchema.safeParse({ name: "PAGE_VIEW", path: "/" }).success, true);
    assert.equal(
      analyticsEventSchema.safeParse({ name: "TRACKED_WITHOUT_CONSENT", path: "/" }).success,
      false,
    );
  });

  it("rejects unexpected payload fields", () => {
    const result = analyticsEventSchema.safeParse({
      name: "PAGE_VIEW",
      path: "/",
      email: "visitor@example.com",
    });
    assert.equal(result.success, false);
  });
});
