import {
  isPubliclyVisible,
  type FaqItem,
  type JournalEntry,
  type MediaAsset,
  type PublicProject,
} from "@lakefront/contracts";

export const projects: PublicProject[] = [
  {
    slug: "location-1-land-opportunity",
    locationNumber: 1,
    status: "LAND_OPPORTUNITY",
    statusLabel: "Land opportunity",
    statusNote:
      "The business brief describes Location 1 as ready to sell as-is; current offer details still require confirmation.",
    title: "Location 1",
    shortDescription: "A land opportunity ready for a considered next step.",
    description:
      "Lakefront Capital and Development presents Location 1 as a land opportunity. Verified parcel attributes, commercial terms, and supporting information are shared through the approved enquiry process.",
    eyebrow: "Location 1 / Land opportunity",
    heroCaption: "A place for what comes next.",
    facts: [
      {
        label: "Current brief",
        value: "Land opportunity — ready to sell as-is",
        state: "PENDING_CONFIRMATION",
      },
      {
        label: "Commercial details",
        value: "Shared through an approved enquiry",
        state: "NOT_AVAILABLE",
      },
      {
        label: "Location context",
        value: "Confirmed before public publication",
        state: "PENDING_CONFIRMATION",
      },
    ],
    primaryCta: "Request location details",
    secondaryCta: "Request a site visit",
    audience: "For people exploring a land opportunity around the lake.",
    bookingEnabled: false,
  },
  {
    slug: "location-2-active-development",
    locationNumber: 2,
    status: "ACTIVE_DEVELOPMENT",
    statusLabel: "Active development",
    statusNote:
      "The business brief reports that land preparation is underway. Progress updates will be published only when supported by approved evidence.",
    title: "Location 2",
    shortDescription: "A development story still being shaped on the ground.",
    description:
      "Location 2 is an active development. The current brief reports land preparation underway; the page will grow with dated, verified updates as the work progresses.",
    eyebrow: "Location 2 / Active development",
    heroCaption: "Progress, with context.",
    facts: [
      {
        label: "Current brief",
        value: "Active development — land preparation underway",
        state: "PENDING_CONFIRMATION",
      },
      {
        label: "Progress updates",
        value: "Published as they are verified",
        state: "CONFIRMED",
      },
      {
        label: "Completion percentage",
        value: "Not published without an approved measure",
        state: "NOT_AVAILABLE",
      },
    ],
    primaryCta: "Follow development updates",
    secondaryCta: "Talk to the development team",
    audience: "For people following the work and its next chapters.",
    bookingEnabled: false,
  },
  {
    slug: "location-3-future-resort",
    locationNumber: 3,
    status: "FUTURE_RESORT",
    statusLabel: "Future resort",
    statusNote:
      "Location 3 is a future resort concept. It is not currently open or bookable, and no accommodation or facility claims are published as confirmed.",
    title: "Location 3",
    shortDescription: "A future resort concept shaped by the lake and its landscape.",
    description:
      "Location 3 is a future-facing resort concept around Tarbela Lake. Approved ideas and renderings may be presented as concept material; booking remains unavailable until a separate future phase is approved.",
    eyebrow: "Location 3 / Future resort",
    heroCaption: "A future shaped by place.",
    facts: [
      {
        label: "Current status",
        value: "Future resort concept",
        state: "CONFIRMED",
      },
      {
        label: "Guest experience",
        value: "Planned material will be labelled as concept",
        state: "CONCEPT",
      },
      {
        label: "Booking",
        value: "Not currently open or bookable",
        state: "NOT_AVAILABLE",
      },
    ],
    primaryCta: "Join the early-access list",
    secondaryCta: "Explore the destination",
    audience: "For people who want to follow a future resort idea from the beginning.",
    bookingEnabled: false,
  },
];

export function getProjectBySlug(slug: string): PublicProject | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getProjectsByStatus(status: PublicProject["status"]): PublicProject[] {
  return projects.filter((project) => project.status === status);
}

export const journalEntries: JournalEntry[] = [
  {
    slug: "why-the-relationship-with-water-comes-first",
    title: "Why the relationship with water comes first",
    dek: "A short introduction to the ideas shaping the Lakefront destination story.",
    category: "DESTINATION",
    publishedOn: "2026-09-18",
    lastReviewedOn: "2026-09-18",
    authorRole: "Lakefront editorial",
    relatedProjectSlugs: [],
    body: [
      {
        type: "PARAGRAPH",
        text: "A destination is not a list of units or a grid of plots. It is a relationship between water, landscape, and the way people arrive. Starting there keeps the rest of the story honest.",
      },
      {
        type: "HEADING",
        text: "Place before product",
      },
      {
        type: "PARAGRAPH",
        text: "Each Lakefront location is introduced with its own status first. The lake gives the three locations a shared context, but it does not make them interchangeable, and the site never presents them as if they were.",
      },
    ],
    publicationState: "PUBLISHED",
  },
  {
    slug: "following-progress-with-context",
    title: "Following progress with context",
    dek: "How active-development updates can stay useful without pretending to know more than we do.",
    category: "DEVELOPMENT",
    publishedOn: "2026-09-22",
    lastReviewedOn: "2026-09-22",
    authorRole: "Lakefront editorial",
    relatedProjectSlugs: ["location-2-active-development"],
    body: [
      {
        type: "PARAGRAPH",
        text: "Progress updates are most useful when they say what is actually known, when it was last checked, and what is still to be confirmed. A percentage without a source is decoration, not information.",
      },
      {
        type: "HEADING",
        text: "What an update should carry",
      },
      {
        type: "PARAGRAPH",
        text: "A dated statement, an approved image or a clearly labelled rendering, and a plain statement of what has not been confirmed. Where evidence is missing, the update waits.",
      },
      {
        type: "PARAGRAPH",
        text: "Location 2 is the active development chapter. Its current status note is published with the caveat that reported progress still requires confirmation before it is treated as verified fact.",
      },
    ],
    publicationState: "PUBLISHED",
  },
  {
    slug: "a-future-resort-clearly-labelled",
    title: "A future resort, clearly labelled",
    dek: "Why concept material and current availability should never be confused.",
    category: "FUTURE",
    publishedOn: "2026-09-24",
    lastReviewedOn: "2026-09-24",
    authorRole: "Lakefront editorial",
    relatedProjectSlugs: ["location-3-future-resort"],
    body: [
      {
        type: "PARAGRAPH",
        text: "Location 3 is a future resort concept. It is not open, not operating, and not bookable, and nothing on this site should imply otherwise.",
      },
      {
        type: "HEADING",
        text: "Renderings are not evidence",
      },
      {
        type: "PARAGRAPH",
        text: "Approved renderings may be used to explain a direction, but a rendering can never stand in for a completed facility, a confirmed opening date, or an availability claim. Those require separate business approval.",
      },
    ],
    publicationState: "PUBLISHED",
  },
  {
    slug: "internal-draft-placeholder",
    title: "Internal draft placeholder",
    dek: "Exists only to prove that draft content never reaches the public site.",
    category: "DESTINATION",
    publishedOn: "2026-09-25",
    lastReviewedOn: "2026-09-25",
    authorRole: "Lakefront editorial",
    relatedProjectSlugs: [],
    body: [{ type: "PARAGRAPH", text: "This entry must never be rendered publicly." }],
    publicationState: "DRAFT",
  },
];

export const faqItems: FaqItem[] = [
  {
    id: "status-difference",
    topic: "STATUS",
    question: "What is the difference between the three locations?",
    answer:
      "Location 1 is presented as a land opportunity, Location 2 is an active development, and Location 3 is a future resort concept. Each has its own status, audience, and next step, and they are not interchangeable.",
    projectSlug: null,
    publicationState: "PUBLISHED",
  },
  {
    id: "location-3-booking",
    topic: "BOOKING",
    question: "Can I book a stay or reserve a place at Location 3?",
    answer:
      "No. Location 3 is a future concept and is not currently open or bookable. There is no reservation, availability calendar, or payment route on this site. Early access is an update list only.",
    projectSlug: "location-3-future-resort",
    publicationState: "PUBLISHED",
  },
  {
    id: "location-1-details",
    topic: "AVAILABILITY",
    question: "How do I request details about the land opportunity?",
    answer:
      "Use the location details enquiry form and tell us what you need. Commercial terms, land attributes, and supporting documents are shared only through the approved enquiry process, and availability is confirmed by the team rather than implied by the site.",
    projectSlug: "location-1-land-opportunity",
    publicationState: "PUBLISHED",
  },
  {
    id: "location-2-progress",
    topic: "STATUS",
    question: "How current is the development information?",
    answer:
      "Progress information is published only when it is supported by approved evidence, and each update carries its own review date. Where something is not yet confirmed, the site says so rather than estimating.",
    projectSlug: "location-2-active-development",
    publicationState: "PUBLISHED",
  },
  {
    id: "site-visit-confirmation",
    topic: "AVAILABILITY",
    question: "Does a site-visit request confirm a visit?",
    answer:
      "No. A site-visit request is a request only. Access, safety, staffing, and timing are confirmed by the team before any appointment is finalized, and nothing is confirmed automatically.",
    projectSlug: null,
    publicationState: "PUBLISHED",
  },
  {
    id: "enquiry-information",
    topic: "ENQUIRY",
    question: "What information do you need from me, and what happens next?",
    answer:
      "A name, a way to contact you, and enough context to answer your question. Your enquiry is recorded with a reference code so the team can continue the conversation with the right person.",
    projectSlug: null,
    publicationState: "PUBLISHED",
  },
  {
    id: "coordinates-and-maps",
    topic: "LOCATION",
    question: "Why are exact coordinates and detailed maps not published?",
    answer:
      "Public location disclosure is an approval decision rather than a design choice. Until it is approved, the site shows a relationship view and an accessible list of the three locations instead of precise coordinates.",
    projectSlug: null,
    publicationState: "PUBLISHED",
  },
  {
    id: "investment-returns",
    topic: "ENQUIRY",
    question: "Does the site promise returns or appreciation?",
    answer:
      "No. Nothing here is an investment offer, guarantee, or forecast. Any commercial discussion happens through the approved enquiry process with the responsible team.",
    projectSlug: null,
    publicationState: "PUBLISHED",
  },
];

export const mediaAssets: MediaAsset[] = [
  {
    id: "location-1-land-context",
    projectSlug: "location-1-land-opportunity",
    kind: "PLACEHOLDER",
    title: "Land context",
    alt: "Placeholder for an approved image of the Location 1 land context.",
    caption: "Approved land context imagery will appear here once rights are confirmed.",
    credit: null,
    rights: "PENDING",
    isRendering: false,
    publicationState: "PUBLISHED",
  },
  {
    id: "location-1-document-set",
    projectSlug: "location-1-land-opportunity",
    kind: "DOCUMENT",
    title: "Supporting documents",
    alt: "Placeholder indicating documents available through the approved enquiry process.",
    caption: "Documents are shared through the enquiry process, not published on the site.",
    credit: null,
    rights: "PENDING",
    isRendering: false,
    publicationState: "PUBLISHED",
  },
  {
    id: "location-2-site-progress",
    projectSlug: "location-2-active-development",
    kind: "PLACEHOLDER",
    title: "Verified site progress",
    alt: "Placeholder for an approved site photograph of Location 2 progress.",
    caption: "Verified progress photography will appear here once approved and dated.",
    credit: null,
    rights: "PENDING",
    isRendering: false,
    publicationState: "PUBLISHED",
  },
  {
    id: "location-3-concept-rendering",
    projectSlug: "location-3-future-resort",
    kind: "RENDERING",
    title: "Future resort direction",
    alt: "Placeholder for an approved rendering of the future resort concept.",
    caption: "Rendering only. This is concept material and does not depict a completed facility.",
    credit: null,
    rights: "PENDING",
    isRendering: true,
    publicationState: "PUBLISHED",
  },
];

export function getJournalEntryBySlug(slug: string): JournalEntry | undefined {
  return journalEntries.find((entry) => entry.slug === slug && isPubliclyVisible(entry.publicationState));
}

export function getPublishedJournalEntries(): JournalEntry[] {
  return journalEntries
    .filter((entry) => isPubliclyVisible(entry.publicationState))
    .sort((a, b) => b.publishedOn.localeCompare(a.publishedOn));
}

export function getPublishedFaqItems(projectSlug?: string): FaqItem[] {
  return faqItems.filter(
    (item) =>
      isPubliclyVisible(item.publicationState) &&
      (item.projectSlug === null || (projectSlug ? item.projectSlug === projectSlug : false)),
  );
}

export function getPublishedMediaAssets(projectSlug: string): MediaAsset[] {
  return mediaAssets.filter(
    (asset) => asset.projectSlug === projectSlug && isPubliclyVisible(asset.publicationState),
  );
}
