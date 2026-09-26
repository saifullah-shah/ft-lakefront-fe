import { z } from "zod";

export const projectStatusSchema = z.enum(["LAND_OPPORTUNITY", "ACTIVE_DEVELOPMENT", "FUTURE_RESORT"]);

export type ProjectStatus = z.infer<typeof projectStatusSchema>;

export const inquiryKindSchema = z.enum([
  "LOCATION_DETAILS",
  "DEVELOPMENT_UPDATES",
  "EARLY_ACCESS",
  "NEWSLETTER",
  "GENERAL_INQUIRY",
  "CONTACT_REQUEST",
  "SITE_VISIT",
]);

export type InquiryKind = z.infer<typeof inquiryKindSchema>;

export const contactMethodSchema = z.enum(["email", "phone", "whatsapp"]);

const optionalString = (max: number) => z.union([z.string().trim().max(max), z.literal("")]).optional();

export const inquirySchema = z.object({
  kind: inquiryKindSchema,
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: optionalString(40),
  preferredContact: contactMethodSchema.default("email"),
  projectSlug: optionalString(120),
  message: optionalString(3000),
  sourcePage: optionalString(500),
  idempotencyKey: z.union([z.string().trim().min(10).max(200), z.literal("")]).optional(),
  website: optionalString(200),
  consent: z.boolean().refine((value) => value, {
    message: "Consent is required",
  }),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

export const siteVisitRequestSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: optionalString(40),
  preferredContact: contactMethodSchema.default("email"),
  projectSlug: z.string().trim().min(1).max(120),
  preferredDate: optionalString(80),
  visitorCount: z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z.coerce.number().int().min(1).max(50).optional(),
  ),
  message: optionalString(3000),
  sourcePage: optionalString(500),
  idempotencyKey: z.union([z.string().trim().min(10).max(200), z.literal("")]).optional(),
  website: optionalString(200),
  consent: z.boolean().refine((value) => value, {
    message: "Consent is required",
  }),
});

export type SiteVisitRequestInput = z.infer<typeof siteVisitRequestSchema>;

export const subscriptionSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  kind: z.enum(["NEWSLETTER", "EARLY_ACCESS"]),
  projectSlug: optionalString(120),
  consent: z.boolean().refine((value) => value, {
    message: "Consent is required",
  }),
  sourcePage: optionalString(500),
  idempotencyKey: z.union([z.string().trim().min(10).max(200), z.literal("")]).optional(),
  website: optionalString(200),
});

export type SubscriptionInput = z.infer<typeof subscriptionSchema>;

export const factStateSchema = z.enum(["CONFIRMED", "PENDING_CONFIRMATION", "CONCEPT", "NOT_AVAILABLE"]);

export type FactState = z.infer<typeof factStateSchema>;

export const projectFactSchema = z.object({
  label: z.string().trim().min(1).max(80),
  value: z.string().trim().min(1).max(300),
  state: factStateSchema,
});

export type ProjectFact = z.infer<typeof projectFactSchema>;

export const publicProjectSchema = z.object({
  slug: z.string().min(1).max(120),
  locationNumber: z.number().int().min(1).max(3),
  status: projectStatusSchema,
  statusLabel: z.string().min(1).max(60),
  statusNote: z.string().min(1).max(500),
  title: z.string().min(1).max(120),
  shortDescription: z.string().min(1).max(300),
  description: z.string().min(1).max(1500),
  eyebrow: z.string().min(1).max(120),
  heroCaption: z.string().min(1).max(180),
  facts: z.array(projectFactSchema).max(12),
  primaryCta: z.string().min(1).max(80),
  secondaryCta: z.string().min(1).max(80),
  audience: z.string().min(1).max(200),
  bookingEnabled: z.literal(false),
});

export type PublicProject = z.infer<typeof publicProjectSchema>;

export const publicProjectListSchema = z.object({
  data: z.array(publicProjectSchema),
});

export const apiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    requestId: z.string().optional(),
    fields: z.record(z.string(), z.array(z.string())).optional(),
  }),
});

export type ApiError = z.infer<typeof apiErrorSchema>;

export const publicationStateSchema = z.enum(["DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"]);

export type PublicationState = z.infer<typeof publicationStateSchema>;

export const allowedPublicationTransitions: Record<PublicationState, readonly PublicationState[]> = {
  DRAFT: ["IN_REVIEW", "ARCHIVED"],
  IN_REVIEW: ["DRAFT", "PUBLISHED", "ARCHIVED"],
  PUBLISHED: ["IN_REVIEW", "ARCHIVED"],
  ARCHIVED: ["DRAFT"],
};

export function canTransitionPublication(from: PublicationState, to: PublicationState): boolean {
  return allowedPublicationTransitions[from].includes(to);
}

export function isPubliclyVisible(state: PublicationState): boolean {
  return state === "PUBLISHED";
}

export const mediaAssetSchema = z.object({
  id: z.string().min(1).max(120),
  projectSlug: z.string().min(1).max(120).nullable(),
  kind: z.enum(["RENDERING", "SITE_PHOTO", "DRONE", "DOCUMENT", "VIDEO", "PLACEHOLDER"]),
  title: z.string().min(1).max(160),
  alt: z.string().min(1).max(300),
  caption: z.string().max(400).nullable(),
  credit: z.string().max(200).nullable(),
  rights: z.enum(["APPROVED", "PENDING", "RESTRICTED"]),
  isRendering: z.boolean(),
  publicationState: publicationStateSchema,
});

export type MediaAsset = z.infer<typeof mediaAssetSchema>;

export const journalBlockSchema = z.object({
  type: z.enum(["PARAGRAPH", "HEADING"]),
  text: z.string().min(1).max(2000),
});

export type JournalBlock = z.infer<typeof journalBlockSchema>;

export const journalEntrySchema = z.object({
  slug: z.string().min(1).max(140),
  title: z.string().min(1).max(180),
  dek: z.string().min(1).max(400),
  category: z.enum(["DESTINATION", "DEVELOPMENT", "FUTURE"]),
  publishedOn: z.iso.date(),
  lastReviewedOn: z.iso.date(),
  authorRole: z.string().min(1).max(120),
  relatedProjectSlugs: z.array(z.string().min(1).max(120)).max(6),
  body: z.array(journalBlockSchema).min(1).max(40),
  publicationState: publicationStateSchema,
});

export type JournalEntry = z.infer<typeof journalEntrySchema>;

export const faqItemSchema = z.object({
  id: z.string().min(1).max(120),
  topic: z.enum(["STATUS", "ENQUIRY", "AVAILABILITY", "BOOKING", "LOCATION"]),
  question: z.string().min(1).max(200),
  answer: z.string().min(1).max(1200),
  projectSlug: z.string().min(1).max(120).nullable(),
  publicationState: publicationStateSchema,
});

export type FaqItem = z.infer<typeof faqItemSchema>;

export const analyticsEventSchema = z
  .object({
    name: z.enum([
      "PAGE_VIEW",
      "ENQUIRY_STARTED",
      "ENQUIRY_SUBMITTED",
      "SITE_VISIT_REQUESTED",
      "EARLY_ACCESS_JOINED",
      "NEWSLETTER_JOINED",
    ]),
    path: z.string().min(1).max(200),
    projectSlug: z.string().min(1).max(120).optional(),
  })
  .strict();

export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>;
