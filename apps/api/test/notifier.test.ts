import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createNotifier } from "../src/notifier.js";
import type { StoredInquiry } from "../src/repository.js";

function makeRecord(overrides: Partial<StoredInquiry> = {}): StoredInquiry {
  return {
    id: "11111111-2222-3333-4444-555555555555",
    kind: "LOCATION_DETAILS",
    status: "NEW",
    name: "Visitor Name",
    email: "visitor@example.com",
    consent: true,
    createdAt: new Date("2026-09-26T10:00:00.000Z"),
    ...overrides,
  };
}

async function captureStdout(run: () => Promise<void>): Promise<string> {
  const chunks: string[] = [];
  const original = process.stdout.write.bind(process.stdout);
  process.stdout.write = ((chunk: string | Uint8Array) => {
    chunks.push(typeof chunk === "string" ? chunk : Buffer.from(chunk).toString());
    return true;
  }) as typeof process.stdout.write;

  try {
    await run();
  } finally {
    process.stdout.write = original;
  }

  return chunks.join("");
}

describe("lead notifications", () => {
  it("logs a redacted envelope without contact details", async () => {
    const notifier = createNotifier();
    const output = await captureStdout(() =>
      notifier.notifyInquiry(
        makeRecord({ phone: "+000000000", projectSlug: "location-1-land-opportunity", message: "Hello" }),
        "LF-ABC12345",
      ),
    );

    const parsed = JSON.parse(output.trim()) as Record<string, unknown>;
    assert.equal(parsed.kind, "LOCATION_DETAILS");
    assert.equal(parsed.referenceCode, "LF-ABC12345");
    assert.equal(parsed.projectSlug, "location-1-land-opportunity");
    assert.equal(output.includes("visitor@example.com"), false);
    assert.equal(output.includes("Visitor Name"), false);
    assert.equal(output.includes("Hello"), false);
  });

  it("does not throw when no webhook is configured", async () => {
    const notifier = createNotifier();
    await captureStdout(() => notifier.notifyInquiry(makeRecord(), "LF-DEF67890"));
  });

  it("swallows webhook failures so enquiries are never lost", async () => {
    const notifier = createNotifier("http://127.0.0.1:9/unreachable");
    await captureStdout(async () => {
      await notifier.notifyInquiry(makeRecord(), "LF-GHI12345");
    });
  });
});
