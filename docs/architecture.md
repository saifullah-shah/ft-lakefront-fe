# Technical Architecture and Delivery Plan

**Project:** Lakefront Capital and Development  
**Status:** Planning proposal — no implementation has started  
**Related documents:** `PROJECT.md`, `research.md`, `ux-plan.md`

## 1. Architecture decision summary

### Recommended stack

- **Public web:** Next.js App Router with React and TypeScript.
- **Styling:** Tailwind CSS with a small design-token layer and accessible component primitives.
- **Business API:** Node.js with Express and TypeScript.
- **Database:** MongoDB accessed through a data-access layer using the official driver or a carefully selected ODM.
- **Media:** Cloudinary with private originals and responsive transformed delivery.
- **Maps:** Mapbox GL JS behind an adapter, loaded progressively, with an accessible non-map fallback.
- **Validation:** Shared runtime schemas for API boundaries and form payloads; compile-time types do not replace runtime validation.
- **Hosting:** A Node-compatible host for the API, a Next-compatible host for the web app, managed MongoDB, and managed media.
- **Email and messaging:** An approved transactional email provider first; WhatsApp Cloud API only after business account, templates, consent, and operational ownership are confirmed.
- **Observability:** Structured logs, error reporting, uptime checks, and privacy-safe product analytics.

### Why not a single client-side SPA?

The public site has an SEO and shareability requirement, including location pages, journal articles, metadata, fast first content, and future public availability. Next.js server rendering and static regeneration provide a better default than a client-only React application. The separate Express service keeps the MERN business/API capability requested and leaves room for admin workflows, lead processing, media signing, and future booking integrations without coupling them to page rendering.

## 2. System context

```text
Visitor
  │
  ▼
CDN / WAF / rate limiting
  │
  ├── Next.js public web
  │     ├── static and server-rendered public content
  │     ├── metadata, sitemap, robots, image optimisation
  │     └── progressive Mapbox client island
  │
  └── Express API
        ├── content and published project reads
        ├── lead and site-visit writes
        ├── admin authentication and authorization
        ├── media signing and metadata
        └── optional email/WhatsApp integrations

Next.js web ───────► Express API
Express API ───────► MongoDB
Express API ───────► Cloudinary
Express API ───────► Approved email/WhatsApp providers
Media CDN ─────────► Visitor/admin clients
Mapbox CDN ────────► Interactive map client, only when requested
```

The browser never receives database credentials, Cloudinary secrets, provider tokens, or unrestricted admin data.

## 3. Repository and ownership boundaries

The exact repository and deployment split should be approved before scaffolding. A practical initial boundary is:

```text
lakefront-capital-development/
├── apps/
│   ├── web/                 Next.js public site and future admin UI if approved
│   └── api/                 Express API, workers, and API tests
├── packages/
│   ├── contracts/           Shared types and runtime schemas
│   ├── content-model/       Shared editorial/status definitions
│   └── config/              Lint, TypeScript, and environment conventions
├── docs/
│   ├── research.md
│   ├── ux-plan.md
│   └── architecture.md
├── PROJECT.md
└── README.md
```

If deployment cost or team capacity is too high for two applications, the API can be deployed as a separate service from the web app while retaining a single monorepo. The API should not be inlined into client bundles merely to avoid a boundary.

## 4. Frontend responsibilities

The web application owns:

- Public routes, layouts, metadata, canonical URLs, sitemap, robots policy, and error states.
- Server-rendered or statically generated public content where freshness permits.
- Progressive enhancement for galleries, maps, video, and form validation.
- Client-side interaction state for navigation, filters, lightboxes, and map controls.
- Public form UX and request lifecycle feedback.
- Admin UI only after authentication and API authorization are ready; it must not rely on hiding links as access control.

The web application does not own:

- Database credentials.
- Authoritative lead state or publication state.
- Secret-bearing media transformations.
- Business rules that determine whether a resort is bookable.

## 5. API responsibilities

The API owns:

- Authentication, sessions, authorization, and role checks.
- Input validation, rate limits, origin/CORS policy, and request correlation.
- Public read models that expose only publishable content.
- Lead, newsletter, early-access, and site-visit creation.
- Draft/review/publish/archive workflows.
- Media metadata, signed upload permissions, and asset approval state.
- Audit events for sensitive changes.
- Integrations with email, WhatsApp, and any future booking provider.
- Background jobs for notifications, image processing, and scheduled follow-up.

Public reads should use explicit DTOs. A database document must never be returned directly to a client.

## 6. Content and publication model

### 6.1 Fact confidence

Every material claim should have an internal fact state:

- `CONFIRMED` — business-approved and evidence-linked; ownership, title, legal, and regulatory claims also require appropriate documentary review.
- `PENDING_CONFIRMATION` — known internally but not safe to publish.
- `CONCEPT` — future intent, rendering, proposed experience, or vision.
- `NOT_AVAILABLE` — explicitly unavailable or not yet published.
- `ARCHIVED` — retained for history but excluded from public output.

A public page can render only content permitted by its fact state and publication state. A future-resort concept may be public while booking-related fields remain unavailable.

Project status categories are controlled values, but the displayed label and supporting explanation are editorial fields. Each project should store `statusEffectiveAt`, `statusReviewedAt`, and `statusReviewRequired`. When the review date passes, the admin workflow must require a fresh business confirmation before the affected status or claim is republished; a stale record must not silently continue to imply current availability.

### 6.2 Publication workflow

```text
DRAFT → IN_REVIEW → PUBLISHED → ARCHIVED
          │
          └── CHANGES_REQUESTED → DRAFT
```

Every transition records actor, timestamp, version, and a short reason. A page can be published with intentionally absent fields; it cannot silently publish an unapproved placeholder token.

### 6.3 Versioning

Project facts, masterplan layers, FAQs, legal text, and important claims should be versioned. The public page should expose the current published version and a publication date. An archive should preserve old approved material for audit but must not remain in public navigation.

## 7. Suggested data model

The names below are planning-level. Final field validation and indexes must be agreed before implementation.

### 7.1 `projects`

| Field                                                           | Purpose                                                                    |
| --------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `title`, `slug`, `shortName`                                    | Internal and public identity                                               |
| `locationNumber`                                                | 1, 2, or 3                                                                 |
| `status`                                                        | `LAND_OPPORTUNITY`, `ACTIVE_DEVELOPMENT`, `FUTURE_RESORT`                  |
| `statusEffectiveAt`, `statusReviewedAt`, `statusReviewRequired` | Date context and stale-status review gate                                  |
| `summary`, `description`                                        | Editorial copy with fact state per claim or section                        |
| `locationContext`                                               | Approved non-exact location context                                        |
| `ownershipClaim`                                                | Internal evidence-backed ownership/title state and approved public wording |
| `coordinates`                                                   | Optional, access-controlled, initially unpublished                         |
| `mediaRefs`                                                     | Ordered media references                                                   |
| `facts`                                                         | Typed fact records with evidence and state                                 |
| `availability`                                                  | Availability wording and state                                             |
| `bookingEnabled`                                                | Always false until a separate booking approval exists                      |
| `seo`                                                           | Title, description, canonical, social metadata                             |
| `publication`                                                   | Draft/review/published state and version                                   |
| `createdBy`, `updatedBy`, `createdAt`, `updatedAt`              | Audit metadata                                                             |

### 7.2 `contentPages`

Fields for route, title, sections, SEO, publication state, author, reviewer, revision, and related project references. Structured section types should include rich text, image, gallery, quote, FAQ, CTA, callout, and approved status badge.

### 7.3 `journalEntries`

Slug, title, excerpt, body, category, author, related project, hero media, publication date, update date, tags, SEO, and workflow state. Development updates can optionally target Location 2 or Location 3.

### 7.4 `mediaAssets`

Asset ID, Cloudinary public ID, type, alt text, caption, credit, focal point, dimensions, duration, rights/expiry, approval state, project reference, uploaded by, and deletion/archival state. Original private assets are never assumed to be public.

### 7.5 `leads`

Contact details, preferred contact method, location interest, message, consent state, consent version, source page, UTM fields, status, assigned owner, timestamps, and communication history references. Use the canonical internal states `NEW → CONTACTED → QUALIFIED → SITE_VISIT_REQUESTED → FOLLOW_UP → CLOSED`, with any additional operational states explicitly documented before use. Avoid storing more data than the enquiry requires.

### 7.6 `siteVisitRequests`

Lead reference, location, preferred date/window, party size if needed, accessibility or safety notes, request status, assigned owner, confirmation timestamp, and notes. A request is not an appointment until staff confirm it.

### 7.7 `users`, `roles`, and `auditLogs`

Users have a role, status, last login, and optional team profile. Audit logs record entity, action, actor, before/after reference, timestamp, request ID, and reason. Sensitive values must be redacted from logs.

### 7.8 `settings`

Approved contact details, WhatsApp configuration status, feature flags, consent versions, maintenance mode, and default SEO settings. Secrets are stored in the deployment secret manager, never in ordinary settings documents.

## 8. API surface

All versioned endpoints should use JSON, return a consistent error envelope, and support request IDs. Public write endpoints require origin checks, rate limits, and schema validation.

### Public read endpoints

- `GET /api/v1/public/projects`
- `GET /api/v1/public/projects/:slug`
- `GET /api/v1/public/pages/:slug`
- `GET /api/v1/public/journal`
- `GET /api/v1/public/journal/:slug`
- `GET /api/v1/public/destination`
- `GET /api/v1/public/masterplan`

Only published records with public fact states are returned.

### Public write endpoints

- `POST /api/v1/public/leads`
- `POST /api/v1/public/site-visit-requests`
- `POST /api/v1/public/newsletter`
- `POST /api/v1/public/early-access`

Each write accepts an idempotency key, validates consent where required, records a request ID, and returns a safe reference code.

### Admin endpoints

- `GET/POST/PATCH /api/v1/admin/projects`
- `GET/POST/PATCH /api/v1/admin/pages`
- `GET/POST/PATCH /api/v1/admin/journal`
- `GET/POST/PATCH /api/v1/admin/media`
- `GET/POST/PATCH /api/v1/admin/faqs`
- `GET/PATCH /api/v1/admin/leads`
- `GET/PATCH /api/v1/admin/site-visits`
- `GET/POST/PATCH /api/v1/admin/users`
- `GET /api/v1/admin/audit-logs`
- `GET/PATCH /api/v1/admin/settings`

Every admin mutation must enforce role permissions server-side and create an audit event.

## 9. Authentication and authorization

### Roles

- `OWNER` — business owner; full content, user, settings, and audit access.
- `ADMIN` — operations and user/content administration within owner-approved limits.
- `EDITOR` — create and edit content, media metadata, and drafts.
- `SALES` — view and update assigned leads and site-visit requests; limited content read access.
- `VIEWER` — read-only reporting and content access.
- `SYSTEM` — narrowly scoped service identity for jobs, not a human login.

Recommended controls:

- Secure, HTTP-only, same-site session cookies.
- Password hashing with a modern adaptive algorithm supplied by the hosting/auth layer.
- MFA for owner and administrative accounts.
- Session rotation on privilege changes and inactivity timeout.
- No public admin registration.
- Login rate limits, lockout/alerting, and recovery via a controlled channel.
- Step-up authentication for user management, secret changes, and bulk publication.
- Device/session visibility and emergency revocation.
- Audit login, failed authentication, role changes, exports, and publication actions.

## 10. Forms, consent, and privacy

- Separate service inquiry, marketing subscription, early access, and visit-request purposes.
- Store consent version, timestamp, source, and withdrawal state.
- Provide a clear privacy notice and a simple unsubscribe path.
- Minimize sensitive data and define retention/deletion rules before launch.
- Do not send sensitive documents through ordinary contact forms.
- If WhatsApp is used, disclose that the conversation moves to a third-party service and obtain consent where required.
- Add CSRF protection or an equivalent anti-forgery strategy for cookie-authenticated admin requests.
- Set a restrictive Content Security Policy and review it when approved media/map domains are known.

## 11. Media architecture

### Upload flow

1. Admin requests a signed upload policy from the API.
2. Browser uploads directly to the restricted Cloudinary folder.
3. API records asset metadata and an `UPLOADED` state.
4. Editor adds alt text, caption, credit, rights, and project relation.
5. Reviewer approves the asset before it can be used in a published critical section.
6. Public delivery uses transformations appropriate to the placement and viewport.

### Delivery rules

- Preserve source files privately.
- Generate AVIF/WebP where supported, with a safe fallback.
- Use responsive `srcset`/`sizes` semantics and avoid oversized hero assets.
- Use video posters and captions; do not force a large video download on initial page load.
- Set width, height, or aspect-ratio metadata to prevent layout shift.
- Record rights and expiry for commissioned or licensed media.
- Never place credentials, private documents, or unapproved renders in a public media path.

## 12. Map architecture

- Keep a provider adapter so Mapbox can be replaced without changing editorial records.
- Store approved GeoJSON and coordinates separately from public visibility flags.
- Use a static fallback image or text relationship diagram in the initial release.
- Load Mapbox GL JS only when the map is needed; keep the map island isolated from the page’s server-rendered content.
- Preserve attribution and keyboard-accessible list alternatives.
- Use a low-detail style appropriate to the brand; do not add unnecessary 3D or visual effects.
- Do not expose exact coordinates until the business approves public location details.
- If directions are available, link to a reputable map provider rather than embedding a user-generated location claim.

## 13. SEO and rendering

### Public indexable content

- Server-render or statically generate the homepage, destination, project pages, journal index, and article pages.
- Generate metadata from approved CMS fields.
- Produce canonical URLs, Open Graph images, and structured data only for truthful content.
- Use a clean sitemap segmented by content type and updated on publication.
- Use `noindex` for drafts, admin routes, internal search results, and pages without approved public content.
- Keep future-resort pages indexable only if their future status is explicit and the page is useful beyond a sales funnel.

### Structured data

Use schema.org types only when the corresponding data is verified. Do not emit `Product`, `Offer`, `Hotel`, `Room`, `Restaurant`, `Event`, or rating data for concepts that do not exist. A future resort may use an appropriate organization or place description without invented availability.

### Rendering and caching

- Static or incremental content for stable pages.
- Short revalidation for journal/development updates.
- On-demand revalidation after an approved publication event.
- Server-side public reads for authoritative status and lead-related pages where needed.
- Avoid client-only loading of the primary page body.

## 14. Performance budget

Initial targets should be confirmed with real media and hosting, but the following are acceptance principles:

- LCP, INP, and CLS are measured at the 75th percentile and monitored in production.
- Critical hero media has a bounded optimized size and a responsive source set.
- Map, video, and analytics do not block the primary content or CTA.
- Fonts are self-hosted or otherwise controlled, with a defined fallback and minimal layout shift.
- Route-level code splitting is used for admin, maps, video, and heavy gallery interactions.
- Images use modern formats where browser support and quality checks permit.
- Public content remains useful with JavaScript disabled where feasible; forms may require JavaScript but must fail safely.
- Performance budgets are tested on representative mid-range mobile devices, not only development laptops.

## 15. Security and privacy controls

Before launch, perform a threat model and dependency/security review covering:

- Injection and unsafe query construction.
- Broken object-level authorization between projects, leads, users, and media.
- Insecure direct object references in media and private documents.
- Cross-site scripting in rich text and media metadata.
- Cross-site request forgery on authenticated admin actions.
- Open redirects in return URLs.
- Rate-limit abuse, spam, and lead enumeration.
- Session theft and insecure cookies.
- Secret leakage in logs, source control, client bundles, and error reports.
- Dependency and supply-chain risk.
- Backups, restore testing, and deletion workflows.
- Personal-data retention and breach response.

Security headers should include a reviewed Content Security Policy, HSTS where the deployment supports it, `frame-ancestors`, `X-Content-Type-Options`, and an appropriate Referrer-Policy. Third-party scripts must be allowlisted deliberately.

## 16. Reliability, backups, and operations

- Managed MongoDB with encrypted backups and tested restore procedures.
- API health and readiness checks.
- Error reporting with PII redaction.
- Structured logs with request IDs and no secret values.
- Rate-limit dashboards and alerts for abnormal form or login traffic.
- Deployment health checks and rollback plan.
- Content backup through versioned publishing, not only database snapshots.
- Documented owner for content, media rights, leads, privacy requests, and provider billing.
- A maintenance state that is explicit and does not silently serve stale booking information.

## 17. Testing strategy

### Unit and contract tests

- Fact-state and status rules.
- Public DTO filtering.
- Form and API schemas.
- Role/permission matrix.
- Consent and idempotency behavior.
- SEO and serialization helpers.
- Media visibility and signing policy.

### Integration tests

- API against a disposable test database.
- Lead, site-visit, newsletter, and early-access flows.
- Admin publication transitions and audit events.
- Media upload/signing and transformed delivery.
- Public cache invalidation after publish.
- Rate limiting and abuse responses.

### End-to-end tests

- Home → each location → relevant enquiry form.
- Development article → Location 2 update subscription.
- Future resort → early access, with no booking action.
- Site-visit request → admin queue → staff status update.
- Mobile navigation, keyboard navigation, reduced motion, and no-map fallback.

### Quality gates

- Lint.
- Typecheck.
- Unit and integration tests.
- Accessibility checks and manual review.
- Build and route smoke test.
- Security dependency audit.
- Performance test against agreed budgets.
- Content review for placeholders and unsupported claims.

Exact commands depend on the chosen package manager and test runner and must be agreed before scaffolding.

## 18. Environments and secrets

Use separate development, staging, and production environments. Each environment has its own:

- Database and storage namespace.
- OAuth/session secrets.
- Cloudinary credentials or signed-upload policy.
- Email and messaging credentials.
- Map provider token scope.
- Analytics and error-reporting keys.

Secrets are supplied through the hosting platform’s secret manager or an equivalent protected mechanism. No secrets are committed to the repository, placed in `.env` files that are tracked, or exposed in client-side environment variables.

## 19. Deployment approach

### Initial recommendation

- Deploy the public Next.js application through a Node-compatible platform with preview deployments for approved branches.
- Deploy the Express API separately or as a service boundary in the same monorepo, with a separate process and health check.
- Use managed MongoDB with network restrictions and least-privilege credentials.
- Use Cloudinary’s signed upload restrictions and a CDN delivery policy.
- Use a CDN/WAF or hosting-level rate limits for public writes and authentication.

### Release process

1. Pull request review and automated checks.
2. Preview deployment for content and UI changes.
3. Content preview for non-technical review.
4. Staging smoke test.
5. Production deployment.
6. Post-deploy health, route, form, and cache checks.
7. Rollback if critical checks fail.

No production booking or messaging integration is enabled without a separate feature review.

## 20. Delivery phases

### Phase 0 — Approval and content readiness

- Approve brand, location naming, status language, audience, CTAs, contact details, and claims policy.
- Gather source documents, media rights, and approved facts.
- Decide whether the site is English-only at launch.
- Confirm deployment, domain, email, analytics, and privacy requirements.

### Phase 1 — Foundation and design system

- Scaffold the approved web/API structure.
- Establish TypeScript, linting, environment validation, and CI.
- Build tokens, typography, layout, accessible primitives, status badges, forms, and media placeholders.
- Establish content schemas and mock data only after approval; mock content must not be treated as publishable copy.

### Phase 2 — Public destination experience

- Build homepage, destination, vision, about, and contact routes.
- Build the three status-aware location templates.
- Add metadata, sitemap, robots, responsive layouts, and fallback states.
- Validate claims and mobile/accessibility behavior.

### Phase 3 — Enquiry and CRM

- Build lead, newsletter, early-access, and site-visit flows.
- Add public API validation, rate limits, consent records, notifications, and admin queues.
- Add idempotency, spam controls, and analytics events.

### Phase 4 — Editorial and media admin

- Build authenticated admin workspace.
- Add content, facts, projects, journal, FAQ, media, publication, users, and audit-log workflows.
- Add Cloudinary signed uploads, rights metadata, and approval states.
- Test role permissions and recovery paths.

### Phase 5 — Interactive destination layer

- Add approved masterplan layers, progressive Mapbox map, text fallback, and mobile interaction tests.
- Add destination journal/editorial modules and performance monitoring.

### Phase 6 — Future resort booking readiness

Only after the business approves inventory, rates, availability, payment provider, terms, cancellation/refund rules, taxes, customer support, and operational ownership.

- Add booking/inventory domain.
- Add payment provider and webhook verification.
- Add customer accounts or guest checkout only if required.
- Add refunds, reconciliation, notifications, staff calendar, and operational reporting.
- Add security, legal, accessibility, and end-to-end booking review.

## 21. Architecture risks and mitigations

| Risk                                                   | Impact                                        | Mitigation                                                                                                   |
| ------------------------------------------------------ | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| High-end visuals consume the entire performance budget | Slow LCP/INP and poor mobile conversion       | Set media budgets, use responsive delivery, reserve motion for enhancement, measure representative devices   |
| Future resort copy reads as an operating property      | Trust and legal risk                          | Status schema, separate templates, publishing checklist, explicit “not currently open/bookable” treatment    |
| Unsupported land or investment claims                  | Misrepresentation and lead-quality problems   | Fact confidence states, evidence links, owner approval, audit log, content linting for banned claim patterns |
| Public coordinates are exposed too early               | Privacy or operational risk                   | Admin-only coordinates, visibility flag, text fallback, approval gate                                        |
| Admin grows into a generic CMS                         | Scope and maintenance cost                    | Start with project/content/lead workflows; add modules only when a concrete need is approved                 |
| MERN API and Next.js create duplicate logic            | Drift and inconsistent content                | Shared contracts, API-owned DTOs, integration tests, no direct database access from the web app              |
| WhatsApp integration is activated prematurely          | Consent, deliverability, and support problems | Early access/contact links first; API integration only after account and template approval                   |
| Map provider becomes a hard dependency                 | Cost, privacy, or performance issue           | Map adapter, static fallback, lazy load, provider budget review                                              |
| Placeholder tokens leak to public pages                | Poor trust and unfinished appearance          | CMS field visibility, publication validation, pre-publish checks, safe public fallback copy                  |
| Lead data is over-collected                            | Privacy and operational risk                  | Minimal schema, explicit consent, retention policy, access controls, deletion workflow                       |

## 22. Decisions needed before scaffolding

1. Confirm Next.js + Express + MongoDB as the MERN-compatible architecture.
2. Confirm deployment provider or constraints.
3. Confirm English-only launch versus multilingual scope.
4. Confirm analytics and consent requirements.
5. Confirm whether admin is part of the first release or a later phase.
6. Confirm email provider and whether transactional messages are required at launch.
7. Confirm Cloudinary and Mapbox account ownership and budget.
8. Confirm data retention, privacy contact, and lead handoff process.
9. Confirm whether any booking, payment, or reservation behaviour is in scope now; the plan assumes it is not.
10. Confirm the review owner for all public claims and project status changes.

Until these decisions and the project plan are approved, no application scaffolding should begin.
