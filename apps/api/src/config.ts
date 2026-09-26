import { z } from "zod";

const optionalMongoUri = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().url().optional(),
);

const optionalUrl = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().url().optional(),
);

const optionalSecret = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().min(16).optional(),
);

const environmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  WEB_ORIGIN: z.string().url().default("http://localhost:3000"),
  MONGODB_URI: optionalMongoUri,
  MONGODB_DB: z.string().trim().min(1).default("lakefront"),
  LEAD_NOTIFICATION_WEBHOOK_URL: optionalUrl,
  OPS_API_KEY: optionalSecret,
});

export type AppConfig = z.infer<typeof environmentSchema>;

export function readConfig(environment: NodeJS.ProcessEnv = process.env): AppConfig {
  const config = environmentSchema.parse(environment);
  if (config.NODE_ENV === "production" && !config.OPS_API_KEY) {
    throw new Error("OPS_API_KEY is required in production");
  }
  return config;
}
