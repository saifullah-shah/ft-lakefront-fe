# Lakefront Capital and Development

Public-facing website and lead-capture API for a lakeside destination project in
Pakistan, presented across three distinct stages: a land opportunity, an active
development, and a future resort.

The repository is an npm-workspaces monorepo containing a Next.js site, an Express
API, and two shared packages.

> **Status:** the public platform is complete and verified. The admin CMS,
> authentication, and media workspace are intentionally not included. Production
> deployment additionally requires the environment values listed under
> [Environment](#environment) plus business sign-off on content, ownership and
> title wording, contact details, coordinates, and media rights.

## Stack

| Workspace                | Package                    | Purpose                                      |
| ------------------------ | -------------------------- | -------------------------------------------- |
| `apps/web`               | `@lakefront/web`           | Next.js 16 App Router site, React 19         |
| `apps/api`               | `@lakefront/api`           | Express API for leads, visits, and analytics |
| `packages/contracts`     | `@lakefront/contracts`     | Shared Zod request/response schemas          |
| `packages/content-model` | `@lakefront/content-model` | Public content and content rules             |

- **Node.js** `>= 20.9.0` (CI runs on Node 24)
- **Package manager** npm, using workspaces
- **Styling** hand-written CSS with custom-property design tokens. Tailwind is
  installed and its PostCSS plugin is wired up, but no utility classes are used.
- **Animation** CSS only, with native scroll-driven animations where supported.
  No animation library and no client-side animation JavaScript.

## Quick start

```bash
npm install
cp .env.example .env      # optional for local work; sensible defaults apply
npm run dev:api           # API on http://localhost:4000
npm run dev:web           # site on http://localhost:3000
```

Both services run without any environment configuration. With no `MONGODB_URI`
the API stores inquiries in memory, which is intended for local development only.

## Environment

Copy `.env.example` to `.env`. Every value is optional in development.

| Variable                        | Default                            | Notes                                                                 |
| ------------------------------- | ---------------------------------- | --------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`          | `https://lakefrontcapital.example` | Canonical origin used for metadata, sitemap, and JSON-LD              |
| `NEXT_PUBLIC_API_URL`           | `http://localhost:4000`            | API origin the browser calls                                          |
| `API_PORT`                      | `4000`                             | API listen port                                                       |
| `WEB_ORIGIN`                    | `http://localhost:3000`            | Allowed CORS origin                                                   |
| `MONGODB_URI`                   | _unset_                            | **Required in production.** Without it the API uses in-memory storage |
| `MONGODB_DB`                    | `lakefront`                        | Database name                                                         |
| `LEAD_NOTIFICATION_WEBHOOK_URL` | _unset_                            | Optional. Receives contact details; otherwise leads are logged only   |
| `OPS_API_KEY`                   | _unset_                            | **Required in production.** Guards `GET /api/v1/ops/summary`          |

Production additionally requires `MONGODB_URI` and `OPS_API_KEY`; the API refuses
to start without them when `NODE_ENV=production`.

## Scripts

Run from the repository root.

| Command                | What it does                                       |
| ---------------------- | -------------------------------------------------- |
| `npm run dev:web`      | Next.js dev server on port 3000                    |
| `npm run dev:api`      | API with reload on port 4000                       |
| `npm run build`        | Typecheck shared packages, then build API and site |
| `npm run lint`         | ESLint across all workspaces                       |
| `npm run typecheck`    | `tsc --noEmit` across all workspaces               |
| `npm run test`         | Unit and integration tests, 39 in total            |
| `npm run test:e2e`     | Smoke test against running servers; needs both up  |
| `npm run format`       | Rewrite files with Prettier                        |
| `npm run format:check` | Verify formatting without writing                  |

`npm run test:e2e` walks every public route plus `robots.txt` and `sitemap.xml`,
asserts unknown routes return 404, verifies sitemap entries use the configured
site URL, checks API health and the projects endpoints, submits a lead and
confirms a reference code comes back, posts an analytics event, and asserts the
ops endpoint rejects an unauthenticated request. Point it elsewhere with
`WEB_ORIGIN` and `API_PORT`.

## Public routes

Fifteen statically generated routes:

`/` `/about` `/contact` `/destination` `/developments` `/developments/[slug]`
`/experiences` `/journal` `/journal/[slug]` `/legal/privacy` `/legal/terms`
`/masterplan` `/site-visit` `/vision`

Plus `sitemap.xml`, `robots.txt`, `icon.svg`, `apple-icon.png`, and a generated
Open Graph image.

## API

All public endpoints are prefixed `/api/v1`.

| Method | Path                          | Notes                                     |
| ------ | ----------------------------- | ----------------------------------------- |
| `GET`  | `/health`                     | Liveness and storage-mode check           |
| `GET`  | `/public/projects`            | Development listings                      |
| `GET`  | `/public/projects/:slug`      | Single development                        |
| `GET`  | `/public/destination`         | Destination overview                      |
| `GET`  | `/public/masterplan`          | Masterplan data                           |
| `POST` | `/public/leads`               | General enquiries                         |
| `POST` | `/public/site-visit-requests` | Visit requests                            |
| `POST` | `/public/newsletter`          | Newsletter signups                        |
| `POST` | `/public/early-access`        | Early-access registrations                |
| `POST` | `/public/events`              | Analytics events                          |
| `GET`  | `/ops/summary`                | **Requires `x-ops-key`**; 404s when unset |

Protections in place: per-IP rate limiting at 60 requests per minute, a honeypot
field that silently drops bot submissions, idempotency keys on writes, zod
validation on every payload, and security headers including `nosniff`,
`X-Frame-Options: DENY`, and a restrictive `Permissions-Policy`.

Analytics are cookieless and first-party: aggregate event counts only, no
identifiers, capped at 500 tracked keys. Lead notifications write a redacted
envelope to stdout; contact details are only sent onward when
`LEAD_NOTIFICATION_WEBHOOK_URL` is configured.

The ops endpoint compares the supplied key in constant time and returns `404`
rather than `403` when the key is missing or wrong, so it does not confirm its
own existence.

## Theming

The site ships light and dark themes. The default follows the visitor's
`prefers-color-scheme`, and the header toggle overrides it.

A choice persists in `localStorage` under `lf-theme` and is applied by a small
blocking script in `<head>`, so the correct palette paints on the first frame
with no flash of the wrong theme.

Both themes come from one token layer in `apps/web/app/globals.css`. Dark mode
overrides tokens under `:root[data-theme="dark"]` rather than restyling
components, so new UI inherits both modes for free. Decorative artwork is re-keyed
through `--art-*` tokens instead of being filtered, which keeps the illustration
colours deliberate in each mode.

To add themed UI, use the `--surface-*`, `--text-*`, `--line*`, and `--accent*`
tokens. Do not hard-code a background or text colour, and do not introduce
`!important` outside the existing reduced-motion block.

## Content policy

The three project stages are modelled as distinct statuses and must not be
conflated in copy:

- `LAND_OPPORTUNITY` — land available to purchase
- `ACTIVE_DEVELOPMENT` — work under way
- `FUTURE_RESORT` — a later aspiration, not a current offering

`packages/content-model` enforces this, and its tests fail the build on
placeholders, draft content leaking into public routes, and unsupported claims.
Automated tests guard the content, but they cannot verify that a true statement is
still accurate, so published claims remain a business responsibility.

Two publication gates are explicit in `apps/web/lib/site-config.ts`:

```ts
contactReady: false,
coordinatesPublished: false,
```

Flip these only once the underlying detail is approved. `PROJECT.md` lists the
language the project avoids, including unapproved pricing, land sizes,
facilities, ROI figures, ownership or title claims, and booking availability.

## Testing

```bash
npm run typecheck
npm run test
npm run build
npm run test:e2e     # with both servers running
```

| Suite                    | Tests | Covers                                            |
| ------------------------ | ----- | ------------------------------------------------- |
| `apps/api`               | 13    | Leads, honeypot, idempotency, analytics, ops auth |
| `apps/web`               | 4     | Canonical URLs, metadata, content QA              |
| `packages/content-model` | 11    | Statuses, placeholders, draft leakage             |
| `packages/contracts`     | 11    | Schema acceptance and rejection                   |

## Continuous integration

`.github/workflows/ci.yml` runs on every push to `main` and on pull requests,
with concurrency cancellation. It installs with `npm ci`, then runs the
formatting check, lint, typecheck, tests, build, and `npm audit --audit-level=high`.

The build produces 25 static pages. `npm audit` currently reports one low-severity
`esbuild` advisory affecting the Windows dev server only, which is below the CI
threshold.

## Deployment notes

- Build the site with `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_API_URL` set to
  production origins. They are inlined at build time, so changing them requires
  a rebuild, not just a restart.
- The API reads configuration at startup and validates it with zod, failing fast
  on missing or malformed values.
- Set `WEB_ORIGIN` to the exact site origin; CORS is checked against it.
- `apps/web/public/images/` holds the served hero assets. The unoptimized source
  image is gitignored, so the committed WebP and JPEG are the only copies in the
  repository.
- The hero photograph is AI-generated and labelled in the UI as an illustrative
  reference rather than a photograph of the locations. Replace it with licensed
  photography before launch.

## Repository layout

```
apps/web/            Next.js site
  app/               routes, metadata, sitemap, icons
  components/        server and client components
  lib/               site config, metadata, content, analytics client
  public/images/     served image assets
  test/              content QA tests
apps/api/            Express API
  src/               app, server, config, repository, notifier, analytics
  test/              API integration tests
packages/contracts/  shared Zod schemas
packages/content-model/ public content and content rules
docs/                architecture, UX plan, research
scripts/smoke.mjs    dependency-free end-to-end smoke test
```

## Documentation

- [`PROJECT.md`](PROJECT.md) — project brief, brand direction, content rules,
  approval gate, and implementation status
- [`docs/architecture.md`](docs/architecture.md) — system design and data flow
- [`docs/ux-plan.md`](docs/ux-plan.md) — information architecture and UI direction
- [`docs/research.md`](docs/research.md) — market and competitor research

## Not included

Deliberately out of scope for this repository:

- Admin CMS and content editing interface
- Authentication and authorization for staff
- Media upload, storage, and transformation pipeline
- Payments, booking, or reservation functionality
