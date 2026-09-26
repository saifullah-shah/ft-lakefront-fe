import { readConfig } from "./config.js";
import { createApp } from "./app.js";
import { createRepository } from "./repository.js";
import { createNotifier } from "./notifier.js";
import { createAnalyticsStore } from "./analytics.js";

const config = readConfig();
const repositoryMode = config.MONGODB_URI ? "mongodb" : "memory";

if (config.NODE_ENV === "production" && !config.MONGODB_URI) {
  throw new Error("MONGODB_URI is required in production");
}

const repository = createRepository({
  nodeEnv: config.NODE_ENV,
  mongodbUri: config.MONGODB_URI,
  mongodbDb: config.MONGODB_DB,
});

await repository.init();
const app = createApp({
  config,
  repository,
  repositoryMode,
  notifier: createNotifier(config.LEAD_NOTIFICATION_WEBHOOK_URL),
  analytics: createAnalyticsStore(),
});
const server = app.listen(config.API_PORT, () => {
  process.stdout.write(`Lakefront API listening on port ${config.API_PORT}\n`);
});

async function shutdown(signal: string): Promise<void> {
  process.stdout.write(`Lakefront API received ${signal}; shutting down\n`);
  server.close(async () => {
    await repository.close();
    process.exit(0);
  });
}

process.once("SIGINT", () => void shutdown("SIGINT"));
process.once("SIGTERM", () => void shutdown("SIGTERM"));
