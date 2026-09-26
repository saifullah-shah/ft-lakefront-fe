#!/usr/bin/env node
/**
 * Dependency-free end-to-end smoke check.
 *
 * Usage:
 *   npm run build
 *   npm run dev:api   # terminal 1
 *   npm run dev:web   # terminal 2
 *   npm run test:e2e
 *
 * Override targets with WEB_ORIGIN / API_PORT if needed.
 */

const webOrigin = process.env.WEB_ORIGIN ?? "http://localhost:3000";
const apiOrigin = process.env.API_ORIGIN ?? `http://localhost:${process.env.API_PORT ?? 4000}`;

const webRoutes = [
  "/",
  "/developments",
  "/developments/location-1-land-opportunity",
  "/developments/location-2-active-development",
  "/developments/location-3-future-resort",
  "/destination",
  "/vision",
  "/masterplan",
  "/experiences",
  "/journal",
  "/about",
  "/contact",
  "/site-visit",
  "/legal/privacy",
  "/legal/terms",
  "/sitemap.xml",
  "/robots.txt",
];

const failures = [];

async function expectOk(label, url, { method = "GET", body, headers = {} } = {}) {
  try {
    const response = await fetch(url, {
      method,
      headers: body ? { "content-type": "application/json", ...headers } : headers,
      body: body ? JSON.stringify(body) : undefined,
      redirect: "manual",
    });

    if (response.status >= 400) {
      failures.push(`${label} -> HTTP ${response.status}`);
      return null;
    }

    return response;
  } catch (error) {
    failures.push(`${label} -> ${error.message}`);
    return null;
  }
}

async function expectNotFound(label, url) {
  try {
    const response = await fetch(url, { redirect: "manual" });
    if (response.status !== 404) {
      failures.push(`${label} -> expected 404, got ${response.status}`);
      return;
    }
    console.log(`  ok   404 ${label}`);
  } catch (error) {
    failures.push(`${label} -> ${error.message}`);
  }
}

async function main() {
  console.log(`smoke: web=${webOrigin} api=${apiOrigin}\n`);

  for (const route of webRoutes) {
    const response = await expectOk(`web ${route}`, `${webOrigin}${route}`);
    if (response) {
      console.log(`  ok   ${response.status} ${route}`);
    }
  }

  const sitemap = await expectOk("web /sitemap.xml", `${webOrigin}/sitemap.xml`);
  if (sitemap) {
    const xml = await sitemap.text();
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://lakefrontcapital.example").replace(
      /\/$/,
      "",
    );
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

    if (urls.length === 0) {
      failures.push("sitemap -> no <loc> entries found");
    }

    for (const url of urls) {
      if (!url.startsWith(siteUrl)) {
        failures.push(`sitemap -> ${url} does not use the configured site URL ${siteUrl}`);
        continue;
      }
      const path = url.slice(siteUrl.length) || "/";
      // The sitemap carries production URLs, so verify the same path locally.
      const response = await expectOk(`sitemap ${path}`, `${webOrigin}${path}`);
      if (response) {
        console.log(`  ok   sitemap entry ${path}`);
      }
    }
  }

  await expectNotFound("web unknown route", `${webOrigin}/this-route-does-not-exist`);

  const health = await expectOk("api health", `${apiOrigin}/health`);
  if (health) {
    const body = await health.json();
    if (body?.status !== "ok" || body?.service !== "lakefront-api") {
      failures.push("api health -> unexpected payload");
    }
    console.log(`  ok   health (storage: ${body?.storage})`);
  }

  const projects = await expectOk("api projects", `${apiOrigin}/api/v1/public/projects`);
  if (projects) {
    const body = await projects.json();
    const count = Array.isArray(body?.data) ? body.data.length : 0;
    if (count !== 3) {
      failures.push(`api projects -> expected 3 records, got ${count}`);
    }
    for (const project of body?.data ?? []) {
      if (project.bookingEnabled !== false) {
        failures.push(`api project ${project.slug} -> bookingEnabled must be false`);
      }
    }
    console.log(`  ok   projects (${count} records, booking disabled)`);
  }

  await expectNotFound("api unknown project", `${apiOrigin}/api/v1/public/projects/does-not-exist`);

  for (const route of ["destination", "masterplan"]) {
    const response = await expectOk(`api ${route}`, `${apiOrigin}/api/v1/public/${route}`);
    if (response) {
      const body = await response.json();
      if (body?.data?.bookingEnabled !== false) {
        failures.push(`api ${route} -> bookingEnabled must be false`);
      }
      console.log(`  ok   ${route} (booking disabled)`);
    }
  }

  const lead = await expectOk("api lead submission", `${apiOrigin}/api/v1/public/leads`, {
    method: "POST",
    body: {
      kind: "GENERAL_INQUIRY",
      name: "Smoke Test",
      email: "smoke@test.invalid",
      consent: true,
      idempotencyKey: "smoke-test-key-0001",
    },
  });
  if (lead) {
    const body = await lead.json();
    if (!body?.data?.referenceCode) {
      failures.push("api lead submission -> missing referenceCode");
    }
    console.log(`  ok   lead stored (${body?.data?.referenceCode})`);
  }

  const event = await expectOk("api analytics event", `${apiOrigin}/api/v1/public/events`, {
    method: "POST",
    body: { name: "PAGE_VIEW", path: "/smoke" },
  });
  if (event) {
    console.log(`  ok   analytics event accepted (${event.status})`);
  }

  await expectNotFound("ops summary without key", `${apiOrigin}/api/v1/ops/summary`);

  console.log("");
  if (failures.length > 0) {
    console.error(`smoke FAILED (${failures.length})`);
    for (const failure of failures) {
      console.error(`  - ${failure}`);
    }
    process.exit(1);
  }

  console.log("smoke passed: all checks green");
}

await main();
