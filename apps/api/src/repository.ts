import { MongoClient, type Collection, type Db } from "mongodb";
import { randomUUID } from "node:crypto";
import type { InquiryKind } from "@lakefront/contracts";

export type InquiryPayload = {
  name: string;
  email: string;
  phone?: string;
  preferredContact?: "email" | "phone" | "whatsapp";
  projectSlug?: string;
  message?: string;
  preferredDate?: string;
  visitorCount?: number;
  sourcePage?: string;
  consent: true;
};

export type StoredInquiry = InquiryPayload & {
  id: string;
  kind: InquiryKind;
  status: "NEW";
  idempotencyKey?: string;
  createdAt: Date;
};

export interface InquiryRepository {
  init(): Promise<void>;
  createInquiry(payload: InquiryPayload, kind: InquiryKind, idempotencyKey?: string): Promise<StoredInquiry>;
  close(): Promise<void>;
}

function createRecord(payload: InquiryPayload, kind: InquiryKind, idempotencyKey?: string): StoredInquiry {
  return {
    ...payload,
    id: randomUUID(),
    kind,
    status: "NEW",
    idempotencyKey,
    createdAt: new Date(),
  };
}

class MemoryInquiryRepository implements InquiryRepository {
  private readonly inquiries = new Map<string, StoredInquiry>();

  async init(): Promise<void> {
    return Promise.resolve();
  }

  async createInquiry(
    payload: InquiryPayload,
    kind: InquiryKind,
    idempotencyKey?: string,
  ): Promise<StoredInquiry> {
    if (idempotencyKey) {
      const existing = [...this.inquiries.values()].find(
        (inquiry) => inquiry.idempotencyKey === idempotencyKey,
      );
      if (existing) {
        return existing;
      }
    }

    const record = createRecord(payload, kind, idempotencyKey);
    this.inquiries.set(record.id, record);
    return record;
  }

  async close(): Promise<void> {
    return Promise.resolve();
  }
}

type InquiryDocument = Omit<StoredInquiry, "createdAt"> & { createdAt: Date };

class MongoInquiryRepository implements InquiryRepository {
  private client: MongoClient | undefined;
  private database: Db | undefined;
  private collection: Collection<InquiryDocument> | undefined;

  constructor(
    private readonly uri: string,
    private readonly databaseName: string,
  ) {}

  async init(): Promise<void> {
    const client = new MongoClient(this.uri);
    await client.connect();
    this.client = client;
    this.database = client.db(this.databaseName);
    this.collection = this.database.collection<InquiryDocument>("inquiries");
    await this.collection.createIndex({ idempotencyKey: 1 }, { unique: true, sparse: true });
    await this.collection.createIndex({ createdAt: -1 });
    await this.collection.createIndex({ status: 1, createdAt: -1 });
  }

  async createInquiry(
    payload: InquiryPayload,
    kind: InquiryKind,
    idempotencyKey?: string,
  ): Promise<StoredInquiry> {
    if (!this.collection) {
      throw new Error("MongoDB repository is not initialized");
    }

    if (idempotencyKey) {
      const existing = await this.collection.findOne({ idempotencyKey });
      if (existing) {
        return existing;
      }
    }

    const record = createRecord(payload, kind, idempotencyKey);
    try {
      await this.collection.insertOne(record);
      return record;
    } catch (error) {
      if (idempotencyKey && error instanceof Error && "code" in error && error.code === 11000) {
        const existing = await this.collection.findOne({ idempotencyKey });
        if (existing) {
          return existing;
        }
      }
      throw error;
    }
  }

  async close(): Promise<void> {
    await this.client?.close();
  }
}

export function createRepository(config: {
  nodeEnv: "development" | "test" | "production";
  mongodbUri?: string;
  mongodbDb: string;
}): InquiryRepository {
  if (config.mongodbUri) {
    return new MongoInquiryRepository(config.mongodbUri, config.mongodbDb);
  }

  if (config.nodeEnv === "production") {
    throw new Error("MONGODB_URI is required in production");
  }

  return new MemoryInquiryRepository();
}
