import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const webRoot = path.resolve(import.meta.dirname, "..");
const sourceRoots = [
  "app",
  "components",
  "lib",
  "../../packages/content-model/src",
  "../../packages/contracts/src",
];

const bannedPatterns = [
  { name: "unresolved template token", pattern: /\{\{\s*[a-z_][a-z0-9_]*\s*\}\}/i },
  { name: "lorem ipsum filler", pattern: /lorem ipsum/i },
  { name: "TODO marker", pattern: /\bTODO\b/ },
  { name: "TBD marker", pattern: /\bTBD\b/ },
  { name: "FIXME marker", pattern: /\bFIXME\b/ },
  { name: "example email address", pattern: /[a-z._%+-]+@(example|test)\.(com|org|net)/i },
  { name: "exact coordinate pair", pattern: /\b\d{1,3}\.\d{4,}\s*[,;]\s*\d{1,3}\.\d{4,}\b/ },
  {
    name: "guaranteed return language",
    pattern: /\b(guaranteed (returns?|appreciation|income)|assured returns?|roi of \d|appreciation of \d)/i,
  },
  { name: "live booking language", pattern: /\b(book now|reserve now|available now|check availability)\b/i },
  {
    name: "unconfirmed facility claim",
    pattern: /\b(our (restaurant|spa|marina)|fully operational|24\/7 (power|security|water))\b/i,
  },
];

async function collectFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") {
        continue;
      }
      files.push(...(await collectFiles(fullPath)));
      continue;
    }
    if (/\.(ts|tsx|js|mjs|json)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

describe("public content QA", () => {
  it("finds no banned tokens, claims, or placeholders in public source", async () => {
    const failures: string[] = [];

    for (const root of sourceRoots) {
      const directory = path.resolve(webRoot, root);
      for (const file of await collectFiles(directory)) {
        const contents = await readFile(file, "utf8");
        const relative = path.relative(webRoot, file);

        for (const { name, pattern } of bannedPatterns) {
          if (pattern.test(contents)) {
            failures.push(`${relative}: ${name}`);
          }
        }
      }
    }

    assert.deepEqual(failures, []);
  });

  it("keeps booking disabled in every location payload", async () => {
    const contentModel = await readFile(
      path.resolve(webRoot, "../../packages/content-model/src/index.ts"),
      "utf8",
    );
    const disabledCount = (contentModel.match(/bookingEnabled: false/g) ?? []).length;
    assert.equal(disabledCount, 3);
    assert.equal(/bookingEnabled: true/.test(contentModel), false);
  });

  it("keeps internal draft content out of public queries", async () => {
    const contentModel = await readFile(
      path.resolve(webRoot, "../../packages/content-model/src/index.ts"),
      "utf8",
    );
    assert.match(contentModel, /isPubliclyVisible/);
    assert.match(contentModel, /publicationState: "DRAFT"/);
  });

  it("declares a canonical for every indexable page", async () => {
    const files = (await collectFiles(path.resolve(webRoot, "app"))).filter(
      (file) => path.basename(file) === "page.tsx",
    );
    const failures: string[] = [];

    for (const file of files) {
      const contents = await readFile(file, "utf8");
      const relative = path.relative(webRoot, file);
      // Pages that export no metadata of their own inherit the root layout canonical.
      const declaresOwnMetadata = /export const metadata: Metadata\s*=\s*\{/.test(contents);

      if (declaresOwnMetadata && !/pageMetadata\(/.test(contents)) {
        failures.push(`${relative}: own metadata does not use pageMetadata (no canonical)`);
      }
    }

    assert.deepEqual(failures, []);
  });
});
