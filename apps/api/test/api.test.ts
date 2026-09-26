import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import type { AppConfig } from "../src/config.js";
import { createApp } from "../src/app.js";
import { createRepository, type InquiryRepository } from "../src/repository.js";
import { createAnalyticsStore } from "../src/analytics.js";
import { type Notifier } from "../src/notifier.js";

const config: AppConfig = {
  NODE_ENV: "test",
  API_PORT: 4000,
  WEB_ORIGIN: "http://localhost:3000",
  MONGODB_URI: undefined,
  MONGODB_DB: "lakefront_test",
  LEAD_NOTIFICATION_WEBHOOK_URL: undefined,
  OPS_API_KEY: "test-ops-key-value-1234",
};

let repository: InquiryRepository;
let app: ReturnType<typeof createApp>;
let notifications: { kind: string; referenceCode: string }[];

before(async () => {
  repository = createRepository({
    nodeEnv: "test",
    mongodbUri: undefined,
    mongodbDb: config.MONGODB_DB,
  });
  await repository.init();
  notifications = [];
  const notifier: Notifier = {
    async notifyInquiry(record, referenceCode) {
      notifications.push({ kind: record.kind, referenceCode });
    },
  };
  app = createApp({
    config,
    repository,
    repositoryMode: "memory",
    notifier,
    analytics: createAnalyticsStore(),
  });
});

after(async () => {
  await repository.close();
});

describe("public content", () => {
  it("returns the three status-aware projects", async () => {
    const response = await request(app).get("/api/v1/public/projects").expect(200);
    assert.equal(response.body.data.length, 3);
    assert.deepEqual(
      response.body.data.map((project: { slug: string }) => project.slug),
      ["location-1-land-opportunity", "location-2-active-development", "location-3-future-resort"],
    );
    assert.equal(response.body.data[2].bookingEnabled, false);
  });

  it("returns a project-specific public record", async () => {
    const response = await request(app).get("/api/v1/public/projects/location-3-future-resort").expect(200);
    assert.equal(response.body.data.status, "FUTURE_RESORT");
    assert.match(response.body.data.statusNote, /not currently open or bookable/i);
  });
});

describe("public enquiries", () => {
  it("accepts an idempotent location-details enquiry", async () => {
    const payload = {
      kind: "LOCATION_DETAILS",
      name: "Test Visitor",
      email: "visitor@example.com",
      projectSlug: "location-1-land-opportunity",
      message: "Please share the approved location details.",
      sourcePage: "/developments/location-1-land-opportunity",
      idempotencyKey: "test-idempotency-key-001",
      consent: true,
    };

    const first = await request(app).post("/api/v1/public/leads").send(payload).expect(201);
    const second = await request(app).post("/api/v1/public/leads").send(payload).expect(201);
    assert.equal(first.body.data.referenceCode, second.body.data.referenceCode);
    assert.equal(first.body.data.status, "RECEIVED");
  });

  it("accepts general and development-update enquiries on the leads endpoint", async () => {
    const general = await request(app)
      .post("/api/v1/public/leads")
      .send({
        kind: "GENERAL_INQUIRY",
        name: "General Visitor",
        email: "general@example.com",
        message: "Please share general information about Lakefront.",
        consent: true,
      })
      .expect(201);
    assert.equal(general.body.data.status, "RECEIVED");

    const updates = await request(app)
      .post("/api/v1/public/leads")
      .send({
        kind: "DEVELOPMENT_UPDATES",
        name: "Updates Visitor",
        email: "updates@example.com",
        projectSlug: "location-2-active-development",
        message: "Please keep me informed about the active development.",
        consent: true,
      })
      .expect(201);
    assert.equal(updates.body.data.status, "RECEIVED");
  });

  it("accepts a site-visit request without implying confirmation", async () => {
    const response = await request(app)
      .post("/api/v1/public/site-visit-requests")
      .send({
        name: "Visit Requester",
        email: "visit@example.com",
        projectSlug: "location-1-land-opportunity",
        preferredDate: "A date to be agreed",
        visitorCount: 2,
        consent: true,
      })
      .expect(201);

    assert.equal(response.body.data.status, "REQUEST_RECEIVED");
  });

  it("rejects an enquiry without consent", async () => {
    const response = await request(app)
      .post("/api/v1/public/leads")
      .send({
        kind: "GENERAL_INQUIRY",
        name: "Test Visitor",
        email: "visitor@example.com",
        consent: false,
      })
      .expect(400);

    assert.equal(response.body.error.code, "VALIDATION_ERROR");
    assert.ok(response.body.error.fields.consent);
  });

  it("silently drops submissions that fill the honeypot", async () => {
    const before = notifications.length;
    const response = await request(app)
      .post("/api/v1/public/leads")
      .send({
        kind: "GENERAL_INQUIRY",
        name: "Robot Visitor",
        email: "bot@example.com",
        website: "https://spam.example",
        consent: true,
      })
      .expect(201);

    assert.equal(response.body.data.referenceCode, "LF-RECEIVED");
    assert.equal(notifications.length, before);
  });

  it("notifies the team when a lead is stored", async () => {
    const before = notifications.length;
    await request(app)
      .post("/api/v1/public/newsletter")
      .send({
        kind: "NEWSLETTER",
        name: "Newsletter Reader",
        email: "reader@example.com",
        consent: true,
      })
      .expect(201);

    assert.equal(notifications.length, before + 1);
    assert.equal(notifications.at(-1)?.kind, "NEWSLETTER");
  });
});

describe("privacy-safe analytics", () => {
  it("accepts allowlisted events and rejects unknown fields", async () => {
    await request(app)
      .post("/api/v1/public/events")
      .send({ name: "PAGE_VIEW", path: "/developments" })
      .expect(202);

    await request(app)
      .post("/api/v1/public/events")
      .send({ name: "PAGE_VIEW", path: "/", email: "visitor@example.com" })
      .expect(400);

    await request(app).post("/api/v1/public/events").send({ name: "SOMETHING_ELSE", path: "/" }).expect(400);
  });

  it("keeps the ops summary behind an api key", async () => {
    await request(app)
      .post("/api/v1/public/events")
      .send({ name: "ENQUIRY_SUBMITTED", path: "/contact" })
      .expect(202);

    await request(app).get("/api/v1/ops/summary").expect(404);
    await request(app).get("/api/v1/ops/summary").set("x-ops-key", "wrong-key-value-0000").expect(404);

    const authorized = await request(app)
      .get("/api/v1/ops/summary")
      .set("x-ops-key", config.OPS_API_KEY as string)
      .expect(200);

    assert.equal(authorized.body.data.storage, "memory");
    assert.ok(authorized.body.data.analytics.total >= 2);
    assert.ok(
      authorized.body.data.analytics.events.some(
        (event: { name: string }) => event.name === "ENQUIRY_SUBMITTED",
      ),
    );
    assert.equal(JSON.stringify(authorized.body).includes("visitor@example.com"), false);
  });
});
