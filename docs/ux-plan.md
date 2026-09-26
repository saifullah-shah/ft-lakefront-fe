# UX and Information Architecture Plan

**Project:** Lakefront Capital and Development  
**Status:** Planning proposal — awaiting business approval  
**Related documents:** `PROJECT.md`, `research.md`, `architecture.md`

## 1. UX north star

The website should make a visitor feel:

> “I understand where this is, what stage each development is in, why it matters, and what I can confidently do next.”

The experience is a destination narrative with a disciplined conversion layer. It is not a generic real-estate catalogue and not a conventional booking site.

## 2. Experience principles

1. **Status before sales language.** A visitor should learn what is available, in development, or future-facing before encountering a call to action.
2. **Place before plot.** The lake, landscape, access context, and development vision establish meaning before details.
3. **One clear next step.** Each page has a primary action appropriate to its stage and audience.
4. **Facts have confidence states.** Confirmed facts, concepts, proposed experiences, and missing information are distinguishable in the editorial system.
5. **Editorial restraint.** Premium does not mean slow, vague, or over-animated. Every effect must support orientation, emotion, or comprehension.
6. **Progressive disclosure.** Visitors can scan a concise summary, then explore proof, detail, FAQs, or a form.
7. **Mobile is the primary design context.** Large touch targets, compressed navigation, readable forms, and low-bandwidth fallbacks are required.
8. **No dark patterns.** No fake scarcity, countdowns, forced pop-ups, misleading urgency, or hidden cancellation of an enquiry.
9. **Accessible by default.** The visual experience must have a complete keyboard, screen-reader, reduced-motion, caption, and text alternative.
10. **The business remains in control.** Draft, review, approval, publish, and archive states protect public accuracy.

## 3. Audience definitions

### 3.1 Prospective land buyer

**Need:** Understand what the land opportunity is, its verified attributes, location context, and how to request details or request a site visit.

**Questions:** What is being offered? Where is it relative to the lake? What is confirmed? What documents or terms will be provided? Who should I contact?

**Best route:** Homepage → Location 1 → facts and media → site visit or details request.

**Primary CTA:** `Request location details`  
**Secondary CTA:** `Request a site visit`

### 3.2 Development follower

**Need:** Follow progress of Location 2 and understand what “active development” currently means.

**Questions:** What is happening now? What is confirmed? When will more information be available? Can I speak with the team?

**Best route:** Journal or development update → Location 2 → site visit/update subscription.

**Primary CTA:** `Follow development updates`  
**Secondary CTA:** `Talk to the development team`

### 3.3 Future-resort guest or early-access visitor

**Need:** Understand the future concept, likely experiences, and how to receive approved updates. If a later booking phase is approved, visitors can then be notified about that separate phase.

**Questions:** Is it operating? What is proposed? If a future stay becomes possible, how will I receive updates?

**Proposed route:** Destination → Location 3 → concept and FAQ → early access, if the early-access feature is enabled.

**Proposed primary CTA (if early access is approved):** `Join the early-access list`  
**Secondary CTA:** `Explore the destination`

### 3.4 Local visitor or future resident

**Need:** Find credible local information and a direct contact route without navigating an investment funnel.

**Best route:** Destination → experiences/journal → contact or newsletter.

**Primary CTA:** `Plan a conversation`  
**Secondary CTA:** `Read the destination guide`

### 3.5 Internal team member

**Need:** Publish accurate project information, respond to leads, schedule visits, and maintain an audit trail.

**Best route:** Admin workspace → projects/content → review → publish → lead/site-visit queues.

## 4. Information architecture

### 4.1 Public sitemap

```text
/
├── developments/
│   ├── location-1-land-opportunity
│   ├── location-2-active-development
│   └── location-3-future-resort
├── destination/
├── vision/
├── masterplan/
├── experiences/
│   ├── [confirmed-experience]
│   └── [approved-experience-index]
├── journal/
│   ├── [category]
│   └── [article-slug]
├── about/
├── contact/
├── site-visit/
└── legal/
    ├── privacy
    └── terms
```

### 4.2 Admin sitemap

```text
/admin
├── overview
├── developments
│   ├── location-1
│   ├── location-2
│   └── location-3
├── pages
├── destination
├── masterplan
├── experiences
├── journal
├── media
├── leads
├── site-visits
├── users
├── audit-log
└── settings
```

### 4.3 Navigation model

Desktop primary navigation:

- Developments
- The Destination
- Vision
- Masterplan
- Journal
- About
- Contact

Persistent utility actions:

- `Inquire`
- `WhatsApp` (only when the approved business number exists)
- Mobile menu trigger

The primary navigation must not include a generic “Investment” or “Book now” label. Future-resort booking becomes a contextual action only after the booking system is approved and enabled.

Footer navigation:

- All three locations with status labels
- Destination, Vision, Masterplan, Journal, About, Contact
- Privacy, Terms
- Approved social links
- Optional WhatsApp link, subject to consent and contact approval

### 4.4 Location status labels

Use consistent labels across cards, page headers, metadata, and admin:

- **Land opportunity** — currently ready to sell as-is according to the business brief; verify offer details before publication.
- **Active development** — land preparation is in progress according to the business brief; do not show completion percentages or equipment claims without approval.
- **Future resort** — concept/future-facing; not operating, not bookable, and not a completed amenity list.

Status values are controlled categories, while labels, explanations, effective dates, review dates, and review flags are editorial fields. Editorial users must be able to update the record without a code release; if a review date expires, the admin workflow must require a fresh business confirmation before the status is republished.

## 5. Primary user journeys

### Journey A: land buyer

1. Visitor sees a destination-led homepage with three clearly differentiated development cards.
2. Visitor selects Location 1.
3. Page explains the offer, status, confirmed facts, and unresolved details without visual clutter.
4. Visitor reviews imagery, location context, FAQ, and document-request process.
5. Visitor selects `Request location details`.
6. Form captures name, contact method, preferred location, message, and consent.
7. Submission creates a lead with source, project, timestamp, consent, and consent-version metadata.
8. Visitor receives a neutral confirmation; the sales team receives a task in the admin workspace.
9. Follow-up can move the lead through `NEW → CONTACTED → QUALIFIED → SITE_VISIT_REQUESTED → FOLLOW_UP → CLOSED`, without exposing a public tracker.

### Journey B: development follower

1. Visitor enters through a journal update, social share, or Location 2 page.
2. Page states current status and distinguishes confirmed work from planned work.
3. Visitor reviews dated updates and media.
4. Visitor chooses `Follow development updates` or `Talk to the development team`.
5. Consent-based subscription is recorded separately from a sales lead where appropriate.
6. Internal owner can publish a new update, which appears in the journal and optionally on Location 2.

### Journey C: future-resort early-access visitor

1. Visitor sees `Future resort` before any accommodation or availability UI.
2. Page explains the concept, intended relationship to the destination, and what is not yet available.
3. Visitor reads a concise FAQ: no booking, no confirmed opening date, no guaranteed facilities.
4. Visitor joins the early-access list with explicit consent.
5. When booking is later approved, the same content record can gain an inventory and booking action without changing the project’s identity.

### Journey D: site visit

1. Visitor chooses a location and preferred date/window if the business confirms scheduling.
2. Form validates required fields and explains what happens next.
3. Submission becomes a site-visit request, not a confirmed appointment.
4. Admin team assigns an owner, notes, status, and communication history.
5. A staff member confirms availability separately.
6. Public confirmation uses “request received” until staff confirmation is sent.

### Journey E: internal publication

1. Editor creates or updates a page, project fact, media item, FAQ, or journal entry.
2. Required fields identify evidence, source, and fact state.
3. Editor saves draft and requests review.
4. Owner or authorised reviewer approves, rejects, or requests changes.
5. Only published content is exposed through the public API.
6. Publication and later changes are recorded in the audit log.

## 6. Homepage design

The homepage is a narrative landing page, not a property catalogue.

### Recommended order

1. **Hero:** lake landscape, restrained headline, clear status-aware CTA, quiet secondary link.
2. **Positioning statement:** what Lakefront Capital and Development is building and why.
3. **Three-location chapter:** horizontally distinct cards with status, short proposition, and one action.
4. **Destination story:** water, landscape, access context, and approved local facts.
5. **Vision and masterplan preview:** editorial image or diagram with link to the full explanation.
6. **Confirmed versus future experiences:** only approved content in the primary list; proposed items separately labelled.
7. **Development journal preview:** latest three or four updates.
8. **Trust/proof block:** only supplied, verifiable material; no invented awards or guarantees.
9. **FAQ:** location status, enquiry process, and what is not yet available.
10. **Contact/inquiry panel:** tailored to the visitor’s selected context where possible.
11. **Footer:** legal, navigation, approved contact details, and newsletter consent link.

### Homepage acceptance notes

- The first viewport communicates the brand and offers a usable next action without requiring a video to load.
- No unsupported numeric claims appear in hero or cards.
- Cards do not imply that all locations are currently for sale.
- On mobile, the sequence and meaning remain intact without hover-dependent interactions.

## 7. Location page pattern

All three pages use a shared skeleton but never a shared misleading status.

### Shared sections

1. Status-aware hero.
2. One-sentence context and audience-appropriate CTA.
3. Overview narrative.
4. Confirmed facts panel.
5. Location context and map fallback.
6. Masterplan/relationship explainer.
7. Media gallery with captions and media type labels.
8. Availability/status explanation.
9. FAQ.
10. Contact or site-visit CTA.
11. Related journal entries and nearby destination content.

### Location 1: Land opportunity

Required content slots:

- Approved location name and reference.
- Offer summary.
- Land area, boundaries, legal description, and access route — only after business verification.
- Utilities, road access, services, and infrastructure — only after verification.
- Price/asking structure, payment terms, and transaction process — only after legal/business approval.
- Document-request process, only after the business confirms which documents may be discussed or shared.
- Land-use or planning references — only when the source and wording are approved.

Default public treatment for missing fields:

- Omit the field from the facts panel.
- Use “Details available on request” only where the business has approved that language.
- Keep internal placeholder tokens in the CMS, not on the public page.

### Location 2: Active development

Required content slots:

- Current phase description.
- Dated progress update and verified media.
- Current site-preparation narrative without a completion percentage.
- Public access/safety information if applicable.
- Planned next steps with confidence state.
- Site-visit or development-contact route.

Do not label Location 2 as complete, open, occupied, or available for immediate purchase unless the business confirms it.

### Location 3: Future resort

Required content slots:

- Concept statement and approved renderings labelled as renderings.
- Intended guest experience, clearly marked as planned.
- Relationship to the lake and other Lakefront locations.
- Development phases, if approved.
- Early-access CTA, if the early-access feature is approved and enabled.
- Explicit “not currently open/bookable” status and a link to the FAQ.

No room, villa, restaurant, spa, marina, pool, or opening date may appear as confirmed without a source and business approval.

## 8. Masterplan and map experience

The map is a wayfinding and context tool, not the entire experience.

### Required layers

- Lake and geographic context.
- Approved location markers or relationship diagram.
- Public-safe roads/access context.
- Optional future phase overlays.
- Clear legend and source/attribution.

### Interaction model

- Initial view uses a lightweight static image or diagram.
- Interactive Mapbox view loads only when requested or when the user chooses it.
- Markers open a text panel with status, summary, and link.
- Keyboard users can move through a list of locations without interacting with the map canvas.
- Directions link opens a third-party map only after an approved public location or address is available.
- Exact coordinates remain hidden until the business approves public exposure.

## 9. Conversion and lead system

### Lead types

- `GENERAL_INQUIRY`
- `LOCATION_DETAILS`
- `SITE_VISIT`
- `DEVELOPMENT_UPDATES`
- `EARLY_ACCESS`
- `NEWSLETTER`
- `CONTACT_REQUEST`

The lead record must retain the source page, source campaign when available, selected location, UTM fields when present, consent state, and user-agent/device metadata only where necessary and lawful.

### Form principles

- Ask only for information needed for the next action.
- Use clear labels, examples only when safe, and inline validation.
- Make required consent explicit and separate from marketing consent where required.
- Show a success state and reference code without exposing internal IDs.
- Retry safely after a network failure without creating duplicate leads.
- Provide a non-form route: approved phone, WhatsApp, email, or contact page.
- Do not use a contact form as a substitute for emergency or on-site assistance instructions.

### CTA matrix

| Context     | Primary action                         | Secondary action            | Forbidden implication             |
| ----------- | -------------------------------------- | --------------------------- | --------------------------------- |
| Location 1  | Request location details               | Request a site visit        | Implying guaranteed availability  |
| Location 2  | Follow development updates             | Talk to the team            | Implying completion or occupancy  |
| Location 3  | Join the early-access list, if enabled | Explore the destination     | Implying booking is available     |
| Destination | Explore the locations                  | Plan a conversation         | Implying a resort is operating    |
| Masterplan  | Explore the locations                  | Contact the team            | Implying approved plans are final |
| Journal     | Read the full story                    | Follow updates              | Implying investment return        |
| Contact     | Send an enquiry                        | Use approved direct contact | Collecting unnecessary data       |

## 10. Form and error-state requirements

Every form has states for:

- Initial, focused, invalid, submitting, success, duplicate-submit, network error, rate-limited, and expired-link cases.
- Screen-reader-readable errors linked to their fields.
- No silent failure after a successful server response.
- Neutral, factual error copy.
- Privacy notice and consent version recorded server-side.
- A fallback contact route when the form is unavailable.

## 11. Responsive behaviour

### Mobile-first baseline

- Single-column content and a compact, keyboard-accessible menu.
- Sticky or persistent inquiry action only if it does not obscure content or controls.
- Full-width but readable media; captions and controls remain reachable.
- Forms use appropriate input types, one-column layout, and large tap targets.
- Map/list toggle is explicit.
- Video is muted until the visitor chooses to play, unless the business supplies a captitled, accessible experience and performance budget allows autoplay.

### Tablet

- Preserve hierarchy while allowing paired cards where space permits.
- Avoid squeezing three-column dense layouts.

### Desktop

- Use negative space and editorial sequencing rather than excessive panels.
- Keep the primary action visible without allowing a sticky bar to dominate.
- Treat large media as optional enhancement, not a layout dependency.

## 12. Accessibility requirements

- Target WCAG 2.2 AA.
- Semantic landmarks, logical heading order, skip link, and descriptive page titles.
- Color contrast checked for text, controls, overlays, and focus states.
- Visible keyboard focus with sufficient contrast and no focus trap except in modal components with an intentional escape path.
- All meaningful images have useful alt text; decorative images use empty alt text.
- Video has captions, audio description where needed, transcript or equivalent text, and a non-video alternative.
- Map has a text/list equivalent.
- Forms have persistent labels, instructions, error association, and accessible names.
- Time-limited or motion-heavy content respects `prefers-reduced-motion`.
- Language and reading order are checked for any multilingual content.
- No critical meaning is communicated by colour alone.

## 13. Measurement plan

Instrumentation must be privacy-conscious and approved before launch. Proposed event names are planning labels, not an instruction to collect everything by default:

- `location_viewed`
- `location_cta_selected`
- `lead_form_started`
- `lead_form_submitted`
- `lead_form_failed`
- `site_visit_requested`
- `whatsapp_link_selected`
- `early_access_joined`
- `newsletter_joined`
- `journal_article_viewed`
- `map_loaded`
- `map_marker_opened`
- `video_started`
- `outbound_link_selected`

Primary measures:

- Qualified leads by location and source.
- Site-visit requests and confirmed visits.
- Lead response time.
- Early-access and newsletter signups.
- Organic search impressions, clicks, and landing-page engagement.
- Accessibility and Core Web Vitals.
- Content freshness and review completion.

Do not set numeric business targets until baseline data and team capacity are confirmed.

## 14. UX decisions requiring approval

1. Confirm whether the public brand name is “Lakefront Capital and Development” or a shorter approved display name.
2. Confirm approved location names, references, and whether the public should use “Location 1/2/3” labels.
3. Confirm the primary CTA wording for each location.
4. Confirm whether a newsletter/early-access list is available at launch.
5. Confirm whether Urdu is a launch language or a later content phase.
6. Confirm whether a public map is permitted before exact coordinates are approved.
7. Confirm the approved business phone, email, WhatsApp number, address, and social profiles.
8. Confirm the content review owner and publishing roles.

Until these are answered, the proposed copy and interactions should be treated as planning content, not production copy.
