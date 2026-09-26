import cors from "cors";
import express, {
  type ErrorRequestHandler,
  type NextFunction,
  type Request,
  type RequestHandler,
  type Response,
} from "express";
import { ZodError, type ZodSchema } from "zod";
import {
  analyticsEventSchema,
  inquirySchema,
  siteVisitRequestSchema,
  subscriptionSchema,
  type InquiryInput,
  type SiteVisitRequestInput,
  type SubscriptionInput,
} from "@lakefront/contracts";
import { getProjectBySlug } from "@lakefront/content-model";
import { timingSafeEqual } from "node:crypto";
import type { AppConfig } from "./config.js";
import type { AnalyticsStore } from "./analytics.js";
import type { Notifier } from "./notifier.js";
import type { InquiryPayload, InquiryRepository } from "./repository.js";

export type AppDependencies = {
  config: AppConfig;
  repository: InquiryRepository;
  repositoryMode: "memory" | "mongodb";
  notifier: Notifier;
  analytics: AnalyticsStore;
};

const requestBuckets = new Map<string, { count: number; resetAt: number }>();

function requestContext(request: Request, response: Response, next: NextFunction): void {
  const requestId = request.header("x-request-id")?.trim() || crypto.randomUUID();
  response.locals.requestId = requestId;
  response.setHeader("x-request-id", requestId);
  next();
}

function securityHeaders(_request: Request, response: Response, next: NextFunction): void {
  response.setHeader("x-content-type-options", "nosniff");
  response.setHeader("x-frame-options", "DENY");
  response.setHeader("referrer-policy", "strict-origin-when-cross-origin");
  response.setHeader("permissions-policy", "camera=(), microphone=(), geolocation=()");
  next();
}

function rateLimit(request: Request, response: Response, next: NextFunction): void {
  const key = request.ip || "unknown";
  const now = Date.now();
  const current = requestBuckets.get(key);

  if (!current || current.resetAt <= now) {
    requestBuckets.set(key, { count: 1, resetAt: now + 60_000 });
    next();
    return;
  }

  current.count += 1;
  if (current.count > 60) {
    response.status(429).json({
      error: {
        code: "RATE_LIMITED",
        message: "Please wait before trying again.",
        requestId: response.locals.requestId,
      },
    });
    return;
  }

  next();
}

function parseBody<T>(schema: ZodSchema<T>, body: unknown): T {
  return schema.parse(body);
}

function fieldErrors(error: ZodError): Record<string, string[]> {
  return error.flatten().fieldErrors as Record<string, string[]>;
}

function validationResponse(response: Response, error: ZodError): void {
  response.status(400).json({
    error: {
      code: "VALIDATION_ERROR",
      message: "Please check the submitted fields.",
      requestId: response.locals.requestId,
      fields: fieldErrors(error),
    },
  });
}

function toPayload(input: InquiryInput | SiteVisitRequestInput | SubscriptionInput): InquiryPayload {
  const payload: InquiryPayload = {
    name: input.name,
    email: input.email,
    consent: true,
  };

  if ("phone" in input && input.phone) {
    payload.phone = input.phone;
  }

  if ("preferredContact" in input && input.preferredContact) {
    payload.preferredContact = input.preferredContact;
  }

  if (input.projectSlug) {
    payload.projectSlug = input.projectSlug;
  }

  if ("message" in input && input.message) {
    payload.message = input.message;
  }

  if ("preferredDate" in input && input.preferredDate) {
    payload.preferredDate = input.preferredDate;
  }

  if ("visitorCount" in input && input.visitorCount) {
    payload.visitorCount = input.visitorCount;
  }

  if (input.sourcePage) {
    payload.sourcePage = input.sourcePage;
  }

  return payload;
}

function referenceCode(id: string): string {
  return `LF-${id.replaceAll("-", "").slice(0, 8).toUpperCase()}`;
}

function isBotSubmission(input: { website?: string }): boolean {
  return typeof input.website === "string" && input.website.trim().length > 0;
}

function createInquiryHandler(
  repository: InquiryRepository,
  notifier: Notifier,
  kinds: readonly InquiryInput["kind"][],
): RequestHandler {
  return async (request, response) => {
    try {
      const input = parseBody(inquirySchema, request.body);
      if (!kinds.includes(input.kind)) {
        response.status(400).json({
          error: {
            code: "KIND_MISMATCH",
            message: "The submitted enquiry type does not match this endpoint.",
            requestId: response.locals.requestId,
          },
        });
        return;
      }

      if (isBotSubmission(input)) {
        response.status(201).json({
          data: { referenceCode: "LF-RECEIVED", status: "RECEIVED" },
        });
        return;
      }

      const record = await repository.createInquiry(
        toPayload(input),
        input.kind,
        input.idempotencyKey?.trim() || undefined,
      );
      const code = referenceCode(record.id);
      await notifier.notifyInquiry(record, code);
      response.status(201).json({
        data: {
          referenceCode: code,
          status: "RECEIVED",
        },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        validationResponse(response, error);
        return;
      }
      throw error;
    }
  };
}

function createSubscriptionHandler(
  repository: InquiryRepository,
  notifier: Notifier,
  kind: "NEWSLETTER" | "EARLY_ACCESS",
): RequestHandler {
  return async (request, response) => {
    try {
      const input = parseBody(subscriptionSchema, request.body);
      if (input.kind !== kind) {
        response.status(400).json({
          error: {
            code: "KIND_MISMATCH",
            message: "The submitted subscription type does not match this endpoint.",
            requestId: response.locals.requestId,
          },
        });
        return;
      }

      if (isBotSubmission(input)) {
        response.status(201).json({
          data: { referenceCode: "LF-RECEIVED", status: "RECEIVED" },
        });
        return;
      }

      const record = await repository.createInquiry(
        toPayload(input),
        kind,
        input.idempotencyKey?.trim() || undefined,
      );
      const code = referenceCode(record.id);
      await notifier.notifyInquiry(record, code);
      response.status(201).json({
        data: {
          referenceCode: code,
          status: "RECEIVED",
        },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        validationResponse(response, error);
        return;
      }
      throw error;
    }
  };
}

function createSiteVisitHandler(repository: InquiryRepository, notifier: Notifier): RequestHandler {
  return async (request, response) => {
    try {
      const input = parseBody(siteVisitRequestSchema, request.body);

      if (isBotSubmission(input)) {
        response.status(201).json({
          data: { referenceCode: "LF-RECEIVED", status: "REQUEST_RECEIVED" },
        });
        return;
      }

      const record = await repository.createInquiry(
        toPayload(input),
        "SITE_VISIT",
        input.idempotencyKey?.trim() || undefined,
      );
      const code = referenceCode(record.id);
      await notifier.notifyInquiry(record, code);
      response.status(201).json({
        data: {
          referenceCode: code,
          status: "REQUEST_RECEIVED",
        },
      });
    } catch (error) {
      if (error instanceof ZodError) {
        validationResponse(response, error);
        return;
      }
      throw error;
    }
  };
}

function sendNotFound(response: Response): void {
  response.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: "The requested resource was not found.",
      requestId: response.locals.requestId,
    },
  });
}

function isAuthorizedOpsRequest(request: Request, expectedKey?: string): boolean {
  if (!expectedKey) {
    return false;
  }
  const provided = request.header("x-ops-key");
  if (!provided) {
    return false;
  }
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expectedKey);
  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }
  return timingSafeEqual(providedBuffer, expectedBuffer);
}

const notFound: RequestHandler = (_request, response) => {
  sendNotFound(response);
};

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  const requestId = response.locals.requestId;
  if (error instanceof ZodError) {
    validationResponse(response, error);
    return;
  }

  response.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Something went wrong. Please try again or use the approved contact route.",
      requestId,
    },
  });
};

export function createApp({ config, repository, repositoryMode, notifier, analytics }: AppDependencies) {
  const app = express();
  app.disable("x-powered-by");
  app.use(requestContext);
  app.use(securityHeaders);
  app.use(cors({ origin: config.WEB_ORIGIN, credentials: false }));
  app.use(express.json({ limit: "50kb" }));
  app.use(rateLimit);

  app.get("/health", (_request, response) => {
    response.json({ status: "ok", service: "lakefront-api", storage: repositoryMode });
  });

  app.get("/api/v1/public/projects", (_request, response) => {
    response.json({ data: requireProjects() });
  });

  app.get("/api/v1/public/projects/:slug", (request, response) => {
    const project = getProjectBySlug(request.params.slug);
    if (!project) {
      sendNotFound(response);
      return;
    }
    response.json({ data: project });
  });

  app.get("/api/v1/public/destination", (_request, response) => {
    response.json({
      data: {
        title: "A considered relationship with Tarbela Lake",
        description:
          "Lakefront Capital and Development is a destination-development company creating distinct paths around the lake.",
        bookingEnabled: false,
      },
    });
  });

  app.get("/api/v1/public/masterplan", (_request, response) => {
    response.json({
      data: {
        title: "Three locations, one destination context",
        description:
          "The public masterplan is a relationship view. Approved layers and coordinates will be added only after business approval.",
        exactCoordinatesPublished: false,
        bookingEnabled: false,
      },
    });
  });

  app.post(
    "/api/v1/public/leads",
    createInquiryHandler(repository, notifier, [
      "LOCATION_DETAILS",
      "DEVELOPMENT_UPDATES",
      "GENERAL_INQUIRY",
    ]),
  );
  app.post("/api/v1/public/site-visit-requests", createSiteVisitHandler(repository, notifier));
  app.post("/api/v1/public/newsletter", createSubscriptionHandler(repository, notifier, "NEWSLETTER"));
  app.post("/api/v1/public/early-access", createSubscriptionHandler(repository, notifier, "EARLY_ACCESS"));

  app.post("/api/v1/public/events", (request, response) => {
    try {
      const event = parseBody(analyticsEventSchema, request.body);
      analytics.record(event);
      response.status(202).json({ data: { accepted: true } });
    } catch (error) {
      if (error instanceof ZodError) {
        validationResponse(response, error);
        return;
      }
      throw error;
    }
  });

  app.get("/api/v1/ops/summary", (request, response) => {
    if (!isAuthorizedOpsRequest(request, config.OPS_API_KEY)) {
      response.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "The requested resource was not found.",
          requestId: response.locals.requestId,
        },
      });
      return;
    }

    response.json({ data: { storage: repositoryMode, analytics: analytics.summary() } });
  });

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

function requireProjects() {
  return [
    getProjectBySlug("location-1-land-opportunity"),
    getProjectBySlug("location-2-active-development"),
    getProjectBySlug("location-3-future-resort"),
  ].filter((project): project is NonNullable<typeof project> => Boolean(project));
}

export { notFound };
