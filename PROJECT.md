# Lakefront Capital and Development

**Document type:** Master product and delivery specification  
**Version:** 0.2 — implementation baseline  
**Planning date:** 25 September 2026  
**Implementation status:** In progress — public site, shared packages, and lead-capture API built and verified  
**Approval status:** Approved for development (`APPROVED - START DEVELOPMENT` received); individual content claims still require review

> This document defined the proposed platform and gated the start of implementation. Implementation has now begun against the approved direction. Business facts, ownership evidence, coordinates, contact details, and launch providers remain unconfirmed and must not be published until approved.

### Implementation snapshot

Verified on 26 September 2026 with `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build`, plus a live `npm run test:e2e` run against both servers.

| Area                                                                 | State                                                                          |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Public routes (15) and dynamic location/journal pages                | Complete, statically generated, smoke-tested                                   |
| Shared contracts and content model                                   | Complete; 22 tests passing                                                     |
| Lead capture, site visits, newsletter, early access                  | Complete; consent, idempotency, honeypot, and rate limiting in place           |
| Lead notifications and aggregate analytics                           | Complete; 13 API tests passing                                                 |
| SEO, accessibility, responsive design                                | Complete; per-route canonicals, sitemap, robots, OG image, JSON-LD             |
| Content QA guardrails                                                | Complete; automated scan for placeholders, coordinates, and unsupported claims |
| CI, formatting, environment validation, smoke automation             | Complete                                                                       |
| Light and dark themes                                                | Complete; token-driven, no flash, choice persists across visits                |
| Admin CMS, authentication, and media workspace                       | **Pending — intentionally deferred**                                           |
| Business content confirmation, domain, hosting, and launch providers | **Pending — requires business input**                                          |

## Project control

### Approval gate

An implementation phase may begin only after the owner confirms the direction in writing. A suitable approval phrase is:

`APPROVED — START DEVELOPMENT`

Approval of this document approves the planning direction, not the accuracy of future business facts. Individual content claims still require the review workflow described below.

### Document set

- `PROJECT.md` — master requirements, scope, content rules, acceptance criteria, and delivery plan.
- `docs/research.md` — reference research and technical research notes.
- `docs/ux-plan.md` — audience, journeys, information architecture, and conversion design.
- `docs/architecture.md` — technical architecture, data model, API, security, testing, and deployment plan.

### Planning principles

- Truthfulness over persuasion.
- Destination identity over generic property branding.
- Clear project status over ambiguous sales language.
- Progressive enhancement over unnecessary complexity.
- Evidence and approval for material claims.
- Accessible, mobile-first experiences by default.
- No implementation before explicit approval.

---

## 1. Project overview

Lakefront Capital and Development is a destination-development and lead-generation platform centred on Tarbela Lake. The platform introduces the destination, explains the company’s development vision, presents three distinct Lakefront locations, builds qualified enquiries, and creates a controlled path for future resort discovery.

The first release is not a public reservation system and does not promise investment returns. It is a credibility-focused destination platform with an editorial and lead-management foundation that can later support a future resort booking experience if the business approves the required commercial and operational rules.

### Product outcomes

The platform should help a visitor:

1. Understand the Lakefront and Tarbela destination proposition.
2. Distinguish the three locations and their current stages.
3. See only approved facts and clearly labelled future concepts.
4. Find the right next action for their intent.
5. Contact the business or request a site visit without unnecessary friction.
6. Return for verified development and destination updates.

### Non-goals for the first release

- A general property-listing marketplace.
- A broker or agent directory.
- A public investment-return calculator.
- A guarantee of appreciation, rental income, ROI, or resale value.
- A functioning resort booking engine.
- Online payment or reservation deposits.
- A public customer account area unless separately approved.
- A user-uploaded property or review system.
- A claim of completed facilities, approvals, or infrastructure that has not been verified.
- Publishing exact coordinates, land measurements, prices, payment plans, or legal claims without business confirmation.

---

## 2. Business background

The current business brief describes Lakefront Capital and Development as a premium destination and resort development company around Tarbela Lake. The brand is intended to express a relationship with the lake, landscape, architecture, and responsible destination creation rather than only transact land or rooms.

The initial brief identifies three locations described by the business as self-owned:

- **Location 1:** ready to sell as-is as a land opportunity.
- **Location 2:** active development, with land preparation reported as already underway.
- **Location 3:** a future resort concept.

The business brief is the starting point for these statuses. Exact names, ownership/title evidence, legal descriptions, physical characteristics, commercial terms, and current progress must be confirmed before publication. Public ownership, title, approval, or entitlement wording must be supported by appropriate documentation.

The platform must communicate the company as a development and destination brand. It should not be positioned as a generic property dealer, a guaranteed-return investment product, or an operating resort unless the business later confirms those facts.

---

## 3. Objectives

### 3.1 Primary objectives

- Establish a distinctive and credible Lakefront/Tarbela destination identity.
- Present three locations with unmistakable, accurate status.
- Generate qualified enquiries for land details, site visits, and project conversations.
- Build a content and lead system the internal team can operate without a developer for routine updates.
- Create a scalable foundation for a future resort experience without enabling premature booking claims.
- Support organic search through useful, server-rendered destination and project content.

### 3.2 Secondary objectives

- Provide clear pathways for visitors, prospective buyers, development followers, and future-resort early-access subscribers.
- Establish a reusable editorial vocabulary for facts, concepts, progress updates, and proof.
- Make mobile, keyboard, screen-reader, and low-bandwidth use cases part of the definition of quality.
- Capture consented, actionable leads with source and project attribution.
- Create an auditable process for public claims, media rights, publication, and lead handling.

### 3.3 Measurement principles

Instrumentation should measure qualified outcomes, not vanity metrics. Initial measures may include:

- Qualified lead rate by location and source.
- Site-visit request volume and response time.
- Early-access and newsletter signups with consent.
- Organic impressions, clicks, and engaged visits to project pages.
- Core Web Vitals and accessibility results.
- Content freshness, review completion, and lead follow-up time.

Numeric targets are intentionally deferred until baseline traffic, team capacity, and business priorities are confirmed.

---

## 4. The three locations

| Location   | Working status     | Core message                                                                  | Primary audience                                                    | Primary CTA                | Restrictions                                                                                             |
| ---------- | ------------------ | ----------------------------------------------------------------------------- | ------------------------------------------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------- |
| Location 1 | Land opportunity   | A land opportunity currently described by the business as ready to sell as-is | Prospective land buyer                                              | Request location details   | Do not publish size, price, boundaries, documents, utilities, access, or legal claims until verified     |
| Location 2 | Active development | Land preparation is reported to be underway                                   | Development follower, buyer, local visitor                          | Follow development updates | Do not show completion percentages, dates, equipment, ownership claims, or availability without approval |
| Location 3 | Future resort      | A future-facing resort concept around the lake destination                    | Future guest, early-access visitor, prospective development contact | Join the early-access list | Not operating, not bookable, and not a confirmed facility list; label renderings and concepts explicitly |

Status categories are controlled records rather than hard-coded page labels. Each project stores an effective date, last-reviewed date, and review-required flag so that “ready,” “active,” or “future” cannot remain public without a current business review. If a status becomes stale, the admin workflow must require confirmation before the affected claim is republished.

### 4.1 Location 1: Land opportunity

The page must distinguish a land sale from a resort stay or generic development listing. It should explain what is known, what requires a request, and how approved document information is handled.

Potential content includes:

- Approved location name or neutral `Location 1` label.
- A concise offer summary.
- Verified land attributes and boundaries.
- Access and surrounding context.
- Approved media.
- Price or transaction information only after commercial approval.
- Document-request and site-visit process.
- A concise FAQ.

The business brief’s “ready to sell as-is” statement is not enough to infer that a particular parcel, title, price, or booking appointment exists. The editorial checklist must distinguish this from a published availability promise.

### 4.2 Location 2: Active development

The page must communicate meaningful progress without manufacturing certainty. Dated updates, verified imagery, and approved narrative can demonstrate activity. Unverified progress percentages, milestone dates, and infrastructure promises must not be presented as facts.

The page may explain the intended role of the development in the wider destination vision, but intended role is separate from current status.

### 4.3 Location 3: Future resort

The page must communicate ambition without misrepresenting current availability. It can show approved renderings, intended experiences, and a future-facing vision if each is clearly labelled. It must not show a booking calendar, room inventory, confirmed restaurant/spa/pool, guaranteed opening date, or reservation call to action.

The initial CTA may be early access, newsletter registration, or a general conversation, depending on approved feature flags. Booking is a later, separately approved feature.

---

## 5. Target users and personas

### 5.1 Prospective land buyer

**Goal:** Understand the offer, location context, verified attributes, and next step.

**Needs:** Clear facts, honest status, direct contact, media, FAQ, site-visit option, and a way to request documents.

**Potential objections:** “What exactly is being sold?”, “Is the information reliable?”, “Can I visit?”, “What happens after I enquire?”

**Primary path:** Home → Location 1 → facts/media/FAQ → details or site visit.

### 5.2 Development follower

**Goal:** Monitor Location 2 and understand whether the project is progressing.

**Needs:** Dated updates, evidence of work, approved milestones, and a low-pressure contact route.

**Primary path:** Journal or Location 2 → update → follow updates/contact.

### 5.3 Future-resort guest

**Goal:** Understand the future concept and know when relevant information will become available.

**Needs:** Clear future status, attractive but labelled visuals, useful FAQ, and early access.

**Primary path:** Destination → Location 3 → concept → early access, if enabled.

### 5.4 Local visitor or future resident

**Goal:** Learn about the lake, destination, and local context.

**Needs:** Editorial content, credible imagery, location context, and a direct contact route.

**Primary path:** Destination → experiences/journal → contact.

### 5.5 Internal team member

**Goal:** Keep the public experience accurate and respond to demand.

**Needs:** Structured content, draft/review/publish workflow, media rights, lead queues, site-visit management, roles, and audit history.

---

## 6. Brand positioning

### Positioning statement

Lakefront Capital and Development is a destination-development company creating a connected relationship with Tarbela Lake through distinct locations, thoughtful land and resort development, and a long-term destination vision.

### Brand pillars

- **Place-led:** The lake and surrounding environment lead the story.
- **Intentional:** Development decisions are presented with clarity and restraint.
- **Distinct:** Each location has its own status, audience, and story.
- **Considered:** The site uses premium design without noise, false urgency, or unsupported promises.
- **Progressive:** The platform can move from land opportunity to development updates to future resort discovery as facts mature.

### Tone

- Calm, confident, knowledgeable, and welcoming.
- Specific rather than hyperbolic.
- Visual and sensory without becoming vague.
- Helpful to a first-time visitor and credible to a serious enquirer.

### Language to avoid

- Guaranteed returns, guaranteed appreciation, assured ROI, passive income, or rental guarantees.
- Unverified “best,” “number one,” award-winning, exclusive, or landmark claims.
- False urgency such as fake countdowns or “last chance.”
- Pressure-based copy that obscures project status.
- Claims that a concept facility is complete, open, or bookable.

---

## 7. Competitor and reference research

The research review in `docs/research.md` covers international and Pakistani references. The most relevant patterns are:

- Aman: destination hierarchy, separate residences path, restrained navigation, clear future states.
- Peninsula Papagayo: destination, stay, homes, experiences, and masterplan in one coherent story.
- Varko Bay: explicit future opening and concept/status discipline.
- The Lakes by Yoo: separate stay, lifestyle, ownership, and activity pathways.
- MOLO Lipno: lake, architecture, landscape, and mixed-use destination storytelling.
- Sobha Sanctuary, Mira Hills, and SIORA: masterplan, phase, and place-led destination communication.
- Above Zero: a strong nature-led destination thesis and a single founding-access route.
- Tarbela Resort: local relevance and direct WhatsApp/contact path.
- MGH Pakistan: precinct and water-oriented development framing.
- Jabal Resorts & Residencia: importance of project facts, masterplan, FAQ, and clear enquiry.
- Wirasat Real Estate: project discovery, map, journal, testimonials, and lead capture.

These references inform principles only. Their commercial, legal, pricing, ownership, sustainability, availability, and investment claims must not be transferred to Lakefront.

The research conclusion is to build a cinematic destination brand with three status-aware development paths, a custom editorial/lead layer, and a deliberately postponed booking system.

---

## 8. UX principles

1. Show status before sales language.
2. Lead with place, then project, then proof.
3. Give each context one clear primary action.
4. Make uncertainty visible internally and safe publicly.
5. Use motion only to orient, explain, or create emotional context.
6. Make the first viewport useful without a video or map.
7. Keep all critical content accessible without hover, animation, or map interaction.
8. Design mobile-first and test on mid-range hardware.
9. Use honest scarcity and transparent availability.
10. Let internal reviewers control publication and claims.

Detailed journeys, form states, and page behavior are in `docs/ux-plan.md`.

---

## 9. UI design direction

### Visual language

The interface should combine:

- Large, carefully selected landscape and architectural imagery.
- Modern minimal typography with a clear hierarchy: one variable sans (Geist) at weight 500,
  tight tracking on large headings, generous leading on body copy, and 11px uppercase accent
  labels. No serif display face and no synthetic italics.
- Glass surfaces for depth: translucent panels with backdrop blur, a hairline top highlight, and
  a soft shadow, with an opaque fallback where `backdrop-filter` is unsupported.
- An animated hero scene of Tarbela Lake: layered ridges, moving light on the water, drifting mist,
  and birds. It is a stylised vector illustration, never presented as photography of the real sites.
- Deep lake-inspired neutrals, stone, muted green, and restrained metallic accents.
- Generous negative space.
- Thin rules, precise grids, and small status labels.
- Image captions, source/credit handling, and visible concept/rendering labels.
- All motion respects `prefers-reduced-motion`; hero parallax uses scroll-driven animation only
  where the browser supports `animation-timeline`.

### Layout principles

- Use a strong editorial opening and clear section rhythm.
- Avoid repetitive property cards and dense dashboard-like public pages.
- Use cards only for navigation, comparison, or a genuinely useful collection.
- Keep conversion panels visually subordinate to the story until the visitor reaches a relevant decision point.
- Use a consistent status badge and CTA system across all three locations.

### Component direction

The first approved component set should include:

- Responsive header and menu.
- Status badge.
- Editorial hero.
- Media gallery with captions.
- Fact panel.
- Location relationship card.
- Development update card.
- Inquiry form.
- FAQ accordion.
- Alert/status callout.
- Footer with legal and approved contact links.

Components must be built only after design and technical direction approval.

---

## 10. Animation strategy

Motion is optional enhancement. It must not block reading, form completion, or access to a primary action.

### Appropriate uses

- Slow, subtle image parallax where performance permits.
- Cross-fade between approved hero images.
- Map camera transitions after user intent.
- Small scroll-triggered reveals for editorial sections.
- Progress/status indicators for internal workflows.

### Prohibited or restricted uses

- Autoplay video with sound.
- Full-screen effects on every page.
- WebGL or heavy canvas scenes on the initial public route.
- Fake loading delays.
- Motion that changes the meaning of a status or CTA.
- Motion that ignores reduced-motion preferences.

### Accessibility and performance rules

- Respect `prefers-reduced-motion` and provide a static equivalent.
- Never hide critical copy behind an animation.
- Use transforms and opacity where practical, but profile rather than assume.
- Keep initial JavaScript and media within the agreed performance budget.
- Provide captions, transcripts, and non-video alternatives for meaningful media.

### Colour modes

- The site ships both a light and a dark theme. The default follows the visitor's
  `prefers-color-scheme`; an explicit choice in the header toggle overrides it.
- A choice persists in `localStorage` under `lf-theme` and is applied by a small
  blocking script in `<head>`, so the correct palette paints on the first frame
  and there is no flash of the wrong theme.
- Both themes are driven by the same token layer in `globals.css`. Dark mode
  overrides tokens under `:root[data-theme="dark"]` rather than restyling
  components, so new UI inherits both modes without extra work.
- Decorative artwork is re-keyed through `--art-*` tokens instead of being
  filtered, which keeps the illustration colours deliberate in both modes.
- Do not introduce components that hard-code a light background or text colour;
  use `--surface-*`, `--text-*`, `--line*`, and `--accent*` so both modes work.
- No JavaScript is required to read the site: the theme script is wrapped in
  `try/catch` and falls back to light when storage is unavailable.

---

## 11. Information architecture

### Primary navigation

- Developments
- The Destination
- Vision
- Masterplan
- Journal
- About
- Contact

Persistent actions:

- `Inquire`
- Approved `WhatsApp` link when available
- Mobile menu

### Public routes

| Route                                         | Purpose                                                 | Primary action                |
| --------------------------------------------- | ------------------------------------------------------- | ----------------------------- |
| `/`                                           | Destination introduction and three-location overview    | Explore developments          |
| `/developments`                               | Optional location index; may be folded into homepage    | Choose a location             |
| `/developments/location-1-land-opportunity`   | Land opportunity details                                | Request details               |
| `/developments/location-2-active-development` | Current development and updates                         | Follow updates                |
| `/developments/location-3-future-resort`      | Future resort concept                                   | Join early access, if enabled |
| `/destination`                                | Tarbela destination story                               | Explore the destination       |
| `/vision`                                     | Company and long-term development philosophy            | Understand the vision         |
| `/masterplan`                                 | Relationship between locations and approved plan layers | Explore the locations         |
| `/experiences`                                | Approved and clearly labelled proposed experiences      | Plan a conversation           |
| `/journal`                                    | Destination and development editorial content           | Read journal                  |
| `/journal/[slug]`                             | Individual editorial or update                          | Follow related updates        |
| `/about`                                      | Company information and responsible contact context     | Contact Lakefront             |
| `/contact`                                    | General enquiry and approved contact details            | Send an enquiry               |
| `/site-visit`                                 | Site-visit request flow                                 | Request a visit               |
| `/legal/privacy`                              | Privacy notice                                          | Review policy                 |
| `/legal/terms`                                | Website terms                                           | Review terms                  |

Draft, admin, error, and private media routes must not be indexable.

---

## 12. Sitemap

The sitemap is the canonical content structure. It may be implemented as a static list in the navigation and later as CMS-driven routes, but the public hierarchy must remain stable.

### Content hierarchy

1. Home
2. Developments
   - Location 1: Land opportunity
   - Location 2: Active development
   - Location 3: Future resort
3. The Destination
4. Vision
5. Masterplan
6. Experiences
7. Journal
8. About
9. Contact / site visit
10. Legal

### URL and naming rules

- Use lowercase, hyphenated, stable slugs.
- Do not put prices, coordinates, or mutable status in URLs.
- Keep redirects for any approved URL changes.
- Use canonical URLs for syndicated or duplicated content.
- Use an approved location reference in internal data even if the public page uses a friendly name later.

---

## 13. User journeys

### 13.1 Land buyer journey

1. Discover the destination through search, referral, social, or the homepage.
2. Scan the three status-labelled location choices.
3. Open Location 1 and understand what is being offered.
4. Review only verified facts, approved media, and a clear availability explanation.
5. Request details or a site visit.
6. Receive a neutral submission confirmation and a reference code.
7. Receive a staff follow-up according to the approved lead process.
8. Move through internal lead statuses without a public self-service account.

### 13.2 Development follower journey

1. Arrive through a journal update, social link, or Location 2.
2. See the current status and dated evidence.
3. Distinguish confirmed progress from planned work.
4. Read related context or the development vision.
5. Follow updates or contact the team.
6. Receive future updates only after the appropriate consent.

### 13.3 Future-resort early-access journey

1. See the project explicitly marked as a future resort.
2. Review the concept, labelled renderings, and intended experiences.
3. Read the not-open/not-bookable FAQ.
4. Join the early-access list or send a general enquiry.
5. Receive approved announcements after consent and operational readiness.

### 13.4 Site-visit journey

1. Select a location and request a preferred window.
2. Submit the request with required contact and consent information.
3. Receive “request received,” not “appointment confirmed.”
4. Staff review availability, safety, access, and staffing.
5. Staff confirm, reschedule, or decline with a human-readable response.
6. Both request and confirmation states remain auditable internally.

### 13.5 Internal content journey

1. Editor creates a draft.
2. Required fields identify fact state and source.
3. Editor requests review.
4. Reviewer approves, rejects, or requests changes.
5. Owner or authorised reviewer publishes.
6. Public API and CDN cache update.
7. Audit log records the transition and actor.

---

## 14. Homepage specification

The homepage must be a destination story with a clear commercial path.

### Required sections

1. **Hero:** lake/development image, short headline, supporting line, primary CTA, secondary CTA.
2. **Introduction:** explain Lakefront Capital and Development in plain language.
3. **Three locations:** each with status, concise proposition, and a unique CTA.
4. **Destination story:** explain the lake and setting using approved information.
5. **Vision preview:** link to the full vision page.
6. **Masterplan preview:** relationship diagram or approved plan crop.
7. **Experiences preview:** confirmed experiences first; proposed items clearly separated.
8. **Journal preview:** recent destination and development updates.
9. **Trust and responsibility:** only approved proof, process, or contact facts.
10. **FAQ:** status, enquiry process, and availability boundaries.
11. **Contact CTA:** tailored enquiry or approved direct contact.
12. **Footer:** navigation, legal, contact, consent-aware newsletter route.

### Homepage rules

- Do not show a generic “property listings” grid as the dominant visual.
- Do not imply all three locations are currently for sale.
- Do not use exact coordinates, prices, land sizes, or unverified claims.
- Do not autoplay a heavy video.
- Make the primary CTA usable with keyboard and reduced motion.
- The first viewport must remain meaningful if imagery fails.

---

## 15. Location 1 specification — land opportunity

### Purpose

Explain a currently described land opportunity to qualified visitors and collect a details or site-visit enquiry without overstating certainty.

### Page order

1. Status-aware hero.
2. Offer summary.
3. Confirmed facts panel.
4. Landscape and location context.
5. Masterplan/relationship context.
6. Media gallery with image type and caption.
7. Document-request process.
8. Availability and enquiry FAQ.
9. Site-visit CTA.
10. Related journal and destination links.

### Content requirements

- Approved location name/reference.
- Verified land attributes.
- Approved price or “details on request” treatment.
- Approved access and surrounding context.
- Approved transaction/document process.
- Contact owner and response expectation only if confirmed.
- Explicit distinction between land purchase, future resort interest, and general enquiry.

### Forbidden assumptions

- Do not infer title, registry status, zoning, utilities, road access, dimensions, or payment terms.
- Do not imply a viewing appointment exists until staff can actually schedule it.
- Do not call the offer a guaranteed investment.

---

## 16. Location 2 specification — active development

### Purpose

Show the current state and approved progress of the active development while giving visitors a credible follow-up path.

### Page order

1. Active-development status hero.
2. Current phase statement.
3. Dated update feed.
4. Verified progress media.
5. Approved current site information.
6. Planned next steps with fact state.
7. Safety/access information if approved.
8. Site-visit or team-contact CTA.
9. Related vision/masterplan links.
10. FAQ.

### Content requirements

- Update dates and media rights.
- Clear distinction between observed work and planned work.
- No invented percentage complete, date, equipment, worker, or infrastructure claim.
- A “last updated” field for factual progress content.

### Editorial rule

An update can be published when the visual is approved and the statement is supported. A rendering cannot be used as evidence of current construction or completion.

---

## 17. Location 3 specification — future resort

### Purpose

Present a credible future-resort vision and capture early interest without creating a false sense of availability.

### Page order

1. Explicit future-resort status hero.
2. Concept statement.
3. Approved renderings labelled as renderings.
4. Intended experience narrative, clearly marked planned/concept.
5. Relationship to the lake and other locations.
6. Approved phase information, if any.
7. “Not currently open or bookable” callout.
8. FAQ covering dates, facilities, availability, and enquiry handling.
9. Early-access CTA.
10. Destination and journal links.

### Forbidden assumptions

- No room or villa inventory.
- No confirmed restaurant, spa, pool, marina, event space, or facility.
- No published opening date unless the business approves it as a current plan and labels it correctly.
- No booking, reservation, payment, or availability calendar.
- No claim that a rendering depicts a completed facility.

### Conversion rule

The primary action is early access or general enquiry. Booking remains disabled until the future-readiness phase is approved.

---

## 18. Masterplan and mapping specification

The masterplan should explain how the three locations relate to the destination. It should be a visual and editorial system, not a claim that an unapproved plan is final.

### Required content

- Location relationship diagram.
- Approved plan layers or diagrams.
- Water, landscape, access, and destination context where verified.
- Status and phase legend.
- Captions and source notes.
- A clear disclaimer that plans and concepts may change, where legally and editorially appropriate.

### Map behaviour

- Static fallback first.
- Progressive Mapbox GL JS enhancement.
- Approved GeoJSON and safe coordinates only.
- Text list alternative.
- Keyboard-accessible marker/list interaction.
- No exact coordinates until public exposure is approved.

### Privacy and security

Coordinates, internal planning layers, and private documents remain access-controlled. Public map links use only approved location data.

---

## 19. Lead-generation strategy

### Lead types

- General enquiry.
- Location details request.
- Site-visit request.
- Development update subscription.
- Future-resort early access.
- Newsletter.
- Contact request.

### Lead capture principles

- Ask for the minimum information needed to respond.
- Make project interest selectable but not misleading.
- Record source page, location interest, and campaign attribution where available.
- Keep marketing consent separate from service-contact consent.
- Do not require account creation for a first enquiry.
- Show a confirmation state that does not promise a response time unless approved.
- Route high-intent enquiries to the responsible staff queue.

### Lead statuses

`NEW → CONTACTED → QUALIFIED → SITE_VISIT_REQUESTED → FOLLOW_UP → CLOSED`

Status changes are internal and auditable. The public visitor does not see a fabricated customer portal or sales progress tracker.

### Spam and abuse controls

- Rate limits by IP and route.
- Bot challenge only when necessary and privacy-compatible.
- Honeypot or equivalent low-friction signal where appropriate.
- Idempotency keys to prevent duplicate submissions.
- No sensitive information in error messages or analytics payloads.

---

## 20. Site-visit and contact flow

### Site-visit request fields

- Name.
- Preferred contact method.
- Email or phone, depending on selected method.
- Location of interest.
- Preferred date or window, if scheduling is approved.
- Number of visitors, only if operationally needed.
- Message or accessibility/safety note.
- Required privacy consent.

### Behaviour

- A form submission is a request, not a confirmed booking.
- Show an honest “what happens next” explanation.
- Staff can accept, decline, or propose another time.
- Confirmations and reminders are sent only through approved channels.
- Do not promise a site visit before access and staff capacity are confirmed.

### General contact

Provide approved email, phone, WhatsApp, and business address when available. Missing contact details should be filled in before launch; placeholder contact information must not be published.

---

## 21. WhatsApp integration strategy

WhatsApp is a useful direct-contact channel for the Pakistani market, but it is not automatically part of the first technical release.

### Initial approach

- Use an approved business number as a plain link with a prefilled, non-sensitive message.
- Keep the enquiry form as the structured record.
- Do not send document or identity data through WhatsApp.
- Make the third-party nature of WhatsApp clear where required.

### Future API approach

Only after approval:

- Verify a WhatsApp Business account and messaging prerequisites.
- Use approved message templates where required.
- Validate webhook signatures.
- Respect opt-in/opt-out, delivery status, rate limits, and quiet hours.
- Store message references without exposing unnecessary personal data.
- Provide a human handoff and fallback email/phone route.

---

## 22. Admin CMS and operations

The admin system is a structured editorial and lead workspace, not a generic page builder.

### Modules

- Overview and review queue.
- Projects and location facts.
- Pages, vision, destination, and masterplan.
- Experiences.
- Journal and development updates.
- FAQs and callouts.
- Media library and rights metadata.
- Leads and communication status.
- Site-visit requests.
- Users and roles.
- Audit log.
- Settings and feature flags.

### Editorial workflow

`DRAFT → IN_REVIEW → PUBLISHED → ARCHIVED`

A reviewer can request changes. Public content requires an explicit publish action. Editing a published page creates a revision or otherwise preserves the prior approved state.

### Admin usability

- Clear status badges and required-field indicators.
- Preview before publish.
- Fact-state selector with source/reference field.
- Alt-text and rights checks before media can be used in critical public sections.
- Search/filtering for leads and site-visit requests.
- Assignment, notes, and timestamps for follow-up.
- No secret values in the UI or ordinary database fields.

---

## 23. Database and content model

MongoDB is the recommended operational database because the requested MERN direction fits document content and evolving editorial structures. The model must still be normalized enough to enforce unique slugs, workflow states, and project relationships.

### Core collections

- `projects`
- `contentPages`
- `journalEntries`
- `mediaAssets`
- `leads`
- `siteVisitRequests`
- `users`
- `roles`
- `auditLogs`
- `settings`
- `subscriptions` or consent records, if separated from leads
- `notifications` or delivery events, if integrations are enabled

### Required controls

- Unique indexes for slugs, public IDs, and idempotency keys.
- Server-side validation for every write.
- Explicit publication and fact states.
- Redaction of secrets and unnecessary personal data.
- Retention and deletion policy.
- Encrypted connections and restricted database network access.
- Backup and restore testing.

Detailed field guidance is in `docs/architecture.md`.

---

## 24. API specification

### Public read API

- `GET /api/v1/public/projects`
- `GET /api/v1/public/projects/:slug`
- `GET /api/v1/public/pages/:slug`
- `GET /api/v1/public/journal`
- `GET /api/v1/public/journal/:slug`
- `GET /api/v1/public/destination`
- `GET /api/v1/public/masterplan`

Responses must contain only published, public-safe DTOs.

### Public write API

- `POST /api/v1/public/leads`
- `POST /api/v1/public/site-visit-requests`
- `POST /api/v1/public/newsletter`
- `POST /api/v1/public/early-access`

All write endpoints require schema validation, request IDs, consent handling where relevant, rate limiting, and idempotency.

### Admin API

- Project, page, journal, media, FAQ, lead, site-visit, user, audit-log, and settings CRUD routes.
- Server-side role enforcement.
- Audit events for every sensitive mutation.
- Pagination and filtering for collections.
- Safe pagination tokens and bounded limits.

### Error format

Use a consistent machine-readable error code plus a safe public message. Do not expose stack traces, database errors, provider secrets, or internal IDs that facilitate enumeration.

---

## 25. Frontend specification

### Public frontend

- Next.js App Router.
- React and TypeScript.
- Tailwind CSS plus design tokens.
- Server-rendered or statically generated public content where possible.
- Route-level metadata and structured data generated from approved fields.
- Progressive enhancement for maps, galleries, video, and forms.
- Image optimisation through the chosen image/media strategy.

### Admin frontend

- Authenticated route group with server-side access enforcement.
- Server/client component split based on data sensitivity and interaction needs.
- Table, filter, editor, preview, and review primitives designed for internal use rather than marketing aesthetics.
- No sensitive data prefetched into unauthorised clients.

### Content safety

- Raw placeholder tokens are not public UI.
- Publication validation blocks required missing fields.
- Public content must have an approved source or explicit concept state.
- A future resort page cannot expose booking UI while booking is disabled.

---

## 26. Authentication and role security

Recommended initial roles:

- Owner.
- Admin/manager.
- Editor.
- Sales.
- Viewer.

Controls include secure HTTP-only sessions, MFA for privileged accounts, rate-limited login, session revocation, password recovery, server-side authorization, no public admin registration, and audit logs for access and publication.

Role permissions must be enforced by the API. Hiding a button in the admin UI is not authorization.

---

## 27. Media and asset management

Use Cloudinary for approved media delivery, transformations, responsive formats, and private originals. The media library must track:

- Asset type and dimensions.
- Alt text, caption, and credit.
- Rights, licence, and expiry where relevant.
- Project and usage relation.
- Approval/publication state.
- Uploader and timestamps.

Renderings, drone imagery, development photos, and documentary images must be visually or textually distinguishable where misidentification is possible.

Video needs a poster image, captions/transcript, audio-description consideration, compression strategy, and a non-video content alternative. Large media should never block the initial route.

---

## 28. SEO strategy

### Technical SEO

- Server-rendered or statically generated public content.
- Unique title, description, canonical URL, and Open Graph metadata for each indexable page.
- XML sitemap generated from published content.
- Robots rules that exclude admin, drafts, and private routes.
- Clean redirects and stable slugs.
- Correct language and locale metadata if multilingual content is added.
- No indexable “thank you,” error, or internal search states.

### Content SEO

- Target the real destination and project intent rather than generic high-volume investment keywords.
- Build useful destination, local-context, project-update, and FAQ content.
- Use structured data only for verified facts.
- Avoid thin pages generated solely for search volume.
- Keep future-resort content truthful and clearly future-facing.

### Local discovery

- Consistent business name and approved location context.
- NAP information only when verified.
- External map links only when the public location is approved.
- Local citations and social profiles require business approval.

### Measurement

Track search impressions, landing pages, engaged sessions, qualified leads, and conversions by project without collecting unnecessary personal data.

---

## 29. Accessibility requirements

Target WCAG 2.2 AA.

- Semantic landmarks and logical heading structure.
- Skip link and visible keyboard focus.
- Persistent form labels and associated errors.
- Useful alt text and decorative-image handling.
- Captions, transcripts, and non-video alternatives for meaningful media.
- Text/list fallback for the map.
- Contrast-compliant text, controls, overlays, and focus states.
- Reduced-motion and non-animated alternatives.
- Touch targets and zoom/reflow support.
- No critical content dependent on hover, autoplay, or pointer gestures.
- Language and reading order tested for any added language.
- Automated checks supplemented by keyboard and screen-reader review.

---

## 30. Performance requirements

### Core Web Vitals

Measure LCP, INP, and CLS at the 75th percentile in production and during release testing. The final numeric performance budget must be confirmed with real media and hosting, but the following are required:

- Optimized, responsive hero media.
- No render-blocking video or map.
- Minimal initial JavaScript.
- Font fallback without layout shift.
- Route-level code splitting.
- Lazy loading for below-the-fold galleries, video, and map.
- Modern image formats where appropriate.
- Representative mobile testing.
- Performance monitoring and alerting after launch.

A cinematic visual should not make the location facts, status, or primary CTA inaccessible to a visitor on a modest connection.

---

## 31. Security and privacy requirements

Before launch, perform a threat model and security review covering OWASP Top 10 risks, including:

- Injection and unsafe database queries.
- Broken authentication and session management.
- Broken object-level authorization.
- XSS in rich text and media metadata.
- CSRF on admin actions.
- Open redirects.
- SSRF or unsafe integrations.
- Sensitive-data exposure in logs and client bundles.
- Spamming and lead enumeration.
- Dependency vulnerabilities.
- Insecure media access.
- Backup and deletion weaknesses.

Required controls:

- HTTPS everywhere.
- Secure HTTP-only, same-site cookies.
- MFA for privileged roles.
- Rate limits and bot controls.
- Runtime input validation.
- Secret manager usage.
- Security headers and a reviewed CSP.
- Encrypted database connections and restricted network access.
- Audit logs with redaction.
- Privacy notice, consent records, retention/deletion policy, and data-subject request workflow.
- No exact coordinates or private documents in public caches.

---

## 32. Responsive design requirements

The site must be designed mobile-first and remain usable from narrow phones through desktop and large screens.

- No horizontal page scroll at supported widths.
- Readable type and line lengths.
- Touch-friendly navigation and forms.
- Collapsible menus with correct focus and escape behaviour.
- Media that scales without cropping away important context.
- Map/list switching rather than a tiny map-only layout.
- Sticky actions that do not obscure content or browser controls.
- Tables in admin are responsive or card-based without losing semantic meaning.
- Print styles for useful enquiry or policy pages if required.

---

## 33. Deployment and environment plan

### Environments

- Development: local and preview-safe data only.
- Staging: sanitized or approved test data, production-like integrations where safe.
- Production: real content, private secrets, protected database, and monitored delivery.

### Initial hosting model

- Next.js public app on a Node-compatible host with preview deployments.
- Express API as a separately managed service or clear service boundary.
- Managed MongoDB with backups and network restrictions.
- Cloudinary for media.
- CDN/WAF or hosting-level rate limiting.
- Approved email provider for transactional notifications.
- Mapbox token restricted to approved origins and scopes.

### Deployment checks

- Lint and typecheck.
- Unit, integration, and end-to-end tests as applicable.
- Build and route smoke tests.
- Accessibility checks.
- Dependency/security scan.
- Environment and secret verification.
- Public form and lead-notification test.
- Cache and metadata check.
- Rollback plan.

---

## 34. Testing requirements

### Unit tests

- Status and fact-state rules.
- Public/private content filtering.
- Form schemas and validation.
- Role/permission checks.
- Consent and idempotency behavior.
- SEO metadata and canonical generation.
- Media visibility and transformation selection.

### Integration tests

- API and test database.
- Lead, site-visit, newsletter, and early-access creation.
- Admin draft/review/publish/archive flow.
- Audit event generation.
- Signed media upload policy.
- Public cache invalidation.
- Provider failure and retry behavior.
- Rate limits and abuse responses.

### End-to-end tests

- Home → each location → appropriate enquiry.
- Journal → related development → follow-up.
- Future resort → early access with no booking action.
- Site-visit request → admin queue → staff response.
- Mobile menu, keyboard navigation, reduced motion, and map fallback.

### Content QA

Before each release, check for:

- Unapproved facts or numbers.
- Placeholder tokens.
- Broken status language.
- Incorrect project links.
- Missing alt text or captions.
- Incorrect public coordinates.
- Broken or expired media rights.
- Incorrect contact information.
- Unsupported structured data.

---

## 35. Delivery phases and roadmap

### Phase 0 — Approval and readiness

- Approve the master plan and architecture direction.
- Confirm naming, status wording, audience, CTAs, and content ownership.
- Gather approved facts, documents, media, and rights.
- Confirm domain, hosting, email, analytics, privacy, and language requirements.
- Decide whether admin is included in the initial release or follows the public release.

### Phase 1 — Foundation

- Scaffold the approved monorepo and environments.
- Establish TypeScript, lint, formatting, environment validation, and CI.
- Define design tokens and accessible primitives.
- Define content schemas, fact states, and publication states.
- Prepare approved content inventory and media pipeline.

### Phase 2 — Public destination experience

- Build home, destination, vision, about, contact, and legal routes.
- Build the three location pages with separate status and CTA treatment.
- Build editorial, gallery, FAQ, and journal foundations.
- Add SEO, sitemap, responsive behaviour, and accessible fallbacks.
- Validate every public claim before release.

### Phase 3 — Enquiry and lead management

- Add lead, details request, site visit, newsletter, and early-access flows.
- Add API validation, rate limits, consent, idempotency, notifications, and CRM/admin queues.
- Add privacy-safe analytics and operational reporting.

### Phase 4 — Admin CMS and media

- Add authenticated admin workspace.
- Add content, project, media, FAQ, journal, user, and audit workflows.
- Add Cloudinary signed uploads, rights metadata, and approval gates.
- Test permissions, recovery, backups, and publishing.

### Phase 5 — Masterplan and interactive map

- Add approved masterplan layers and map adapter.
- Add lazy Mapbox enhancement, static fallback, and accessible location list.
- Add development update feeds and destination journal refinements.
- Run performance, privacy, and map-cost review.

### Phase 6 — Future resort booking readiness

Begin only after approval of inventory, rates, availability, payment provider, terms, taxes, refunds, support, staffing, and operational reporting. Then design and test:

- Inventory and availability calendar.
- Guest or customer booking flow.
- Payment and webhook verification.
- Confirmation, cancellation, refund, and reconciliation.
- Staff calendar and customer communications.
- Booking-specific legal, privacy, security, and accessibility review.

### Post-launch iteration

- Content and SEO improvements based on measured behaviour.
- Lead handoff and response-time improvements.
- Additional confirmed destination/editorial content.
- Performance and accessibility maintenance.
- Future-resort concept updates as facts mature.
- No automatic launch of booking or investment features.

---

## 36. Future roadmap

Potential later opportunities include:

- Additional journal categories and destination guides.
- Multilingual English/Urdu content after translation review.
- Saved early-access preferences with explicit consent.
- CRM integration after lead handoff and data-retention rules are approved.
- Email journeys for development updates, subject to consent and frequency controls.
- Virtual tour or 3D content only after performance, accessibility, and media review.
- Client portal for site-visit documents, if business requirements justify the complexity.
- Inventory and booking platform for Location 3, if approved.
- Analytics dashboards that aggregate business outcomes without exposing personal data.
- Additional Lakefront locations, using the same status and fact-governance model.

Any future feature must preserve the core truthfulness and status model.

---

## 37. Open questions and missing inputs

The following must be resolved before the affected content or feature is implemented:

### Brand and business

- What is the exact legal/display brand name?
- What is the approved short name for navigation and mobile UI?
- Who owns final approval of public claims?
- What is the business’s preferred response time and lead handoff process?
- Which contact channels are approved for launch?

### Locations

- What are the approved names and references for Locations 1, 2, and 3?
- What documentary evidence supports the business-provided “self-owned” description, and what ownership/title wording may be published?
- What is the confirmed location context for each project?
- What are the approved media assets and usage rights?
- What is the current verified status and date of each update?
- When must each project status be reviewed, and who may approve a stale-status correction?
- Which land attributes, prices, terms, and documents may be published?
- May exact coordinates or a public map be shown?
- Which facilities, phases, experiences, and opening plans are approved as concepts versus facts?

### Platform

- Is the first release English-only?
- Is admin required at launch or can it follow the public site?
- Which hosting, email, analytics, CRM, and media accounts are approved?
- What staffing model, launch deadline, hosting budget, and third-party media/provider budget should the delivery estimate use?
- What privacy notice, retention period, and data-subject process apply?
- Are any payments, reservations, deposits, or customer accounts in scope now? The default answer is no.
- Is WhatsApp a link-only channel initially, or is API integration required later?

### Measurement

- What baseline period should be used?
- Which lead statuses and source fields are operationally useful?
- What is an acceptable response time and site-visit capacity?
- Which business outcomes matter most over the first 90 days after launch?

Missing information is not a reason to invent content. It is a reason to use internal placeholders, omit unapproved public fields, and keep the relevant feature behind a review gate.

---

## 38. Acceptance criteria

### Planning acceptance criteria

The planning phase is complete when:

- `PROJECT.md` and all linked planning documents exist.
- The three locations have distinct status, audience, and conversion treatment.
- The sitemap covers destination, developments, vision, masterplan, journal, contact, and site-visit journeys.
- The architecture defines the MERN-compatible web/API boundary, data model, API, auth, media, SEO, security, accessibility, performance, and deployment approach.
- The content rules prohibit unsupported claims and premature booking/investment language.
- Missing business inputs are explicitly documented.
- The owner has received a concise summary and an explicit request for approval.

### Future public-release acceptance criteria

A public release is acceptable only when:

- The three routes never misrepresent one another’s status.
- Location 1 presents only approved land details and a truthful enquiry process.
- Location 2 presents dated, supported development updates.
- Location 3 is clearly future-facing, not operating, and not bookable.
- No raw placeholder token, unsupported number, exact coordinate, ROI promise, or facility claim is publicly visible.
- Every meaningful image has appropriate alternative text; meaningful video has captions/transcript and a non-video alternative.
- Keyboard, screen-reader, mobile, reduced-motion, and no-map paths are tested.
- Public forms validate input, handle errors, record consent where required, prevent duplicates, and create an auditable lead/site-visit record.
- Metadata, canonical URLs, sitemap, robots rules, Open Graph assets, and structured data match verified content.
- LCP, INP, CLS, and route performance meet the agreed budget on representative mobile devices.
- Public and admin APIs enforce authorization, rate limits, safe errors, and secret redaction.
- Approved content has gone through draft, review, and publish states.
- Contact details, domain, email, privacy notice, and operational ownership are live and correct.
- A rollback, backup, and incident-response process exists.

### Future booking-release acceptance criteria

Booking must not be enabled merely because the website is live. It requires separate approval and evidence that:

- Inventory, rates, availability, taxes, payment provider, terms, refunds, and customer support are defined.
- Payment and webhook flows are secured and tested.
- Staff can reconcile, modify, cancel, and support bookings.
- Legal, privacy, accessibility, security, and end-to-end tests pass.
- The public status remains truthful during outages or partial availability.

---

## Recommended approval decision

The recommended next step is to approve the planning direction and then answer the open questions in Section 37 before scaffolding. The recommended technical direction is:

- Next.js App Router + React/TypeScript + Tailwind CSS for the public experience.
- Node.js/Express + MongoDB for the MERN business API and editorial/lead layer.
- Cloudinary for approved media.
- Progressive Mapbox GL JS for an approved masterplan/map phase.
- Inquiries and site visits now; proposed early access for Location 3; booking only in a separately approved future phase.

**No implementation has started. Stop here and request explicit owner approval before development.**
