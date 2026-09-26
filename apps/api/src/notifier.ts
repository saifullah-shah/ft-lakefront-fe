import type { InquiryKind } from "@lakefront/contracts";
import type { StoredInquiry } from "./repository.js";

export type NotificationEnvelope = {
  kind: InquiryKind;
  referenceCode: string;
  projectSlug?: string;
  sourcePage?: string;
  receivedAt: string;
};

export type Notifier = {
  notifyInquiry(record: StoredInquiry, referenceCode: string): Promise<void>;
};

function toEnvelope(record: StoredInquiry, referenceCode: string): NotificationEnvelope {
  return {
    kind: record.kind,
    referenceCode,
    ...(record.projectSlug ? { projectSlug: record.projectSlug } : {}),
    ...(record.sourcePage ? { sourcePage: record.sourcePage } : {}),
    receivedAt: record.createdAt.toISOString(),
  };
}

export function createNotifier(webhookUrl?: string): Notifier {
  return {
    async notifyInquiry(record, referenceCode) {
      const envelope = toEnvelope(record, referenceCode);
      process.stdout.write(`${JSON.stringify({ channel: "lead", ...envelope })}\n`);

      if (!webhookUrl) {
        return;
      }

      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            ...envelope,
            contact: {
              name: record.name,
              email: record.email,
              ...(record.phone ? { phone: record.phone } : {}),
            },
            ...(record.message ? { message: record.message } : {}),
          }),
          signal: AbortSignal.timeout(4000),
        });
      } catch (error) {
        const reason = error instanceof Error ? error.message : "unknown error";
        process.stderr.write(`lead notification failed: ${reason}\n`);
      }
    },
  };
}
