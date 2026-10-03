import { MongoClient, ObjectId, type Filter, type UpdateFilter, type Document } from "mongodb";
import config from "@/backend/shared/config";
import logger from "@/backend/shared/logger";
import { Message } from "@/backend/shared/types";

const client = await new MongoClient(config.MONGODB_URI).connect();

const db = client.db(config.MONGODB_DBNAME);

const threadsColl = db.collection("threads");
const checkpointsColl = db.collection("checkpoints");
const checkpointWritesColl = db.collection("checkpoint_writes");
const configColl = db.collection("config");
const cvColl = db.collection<CvData>("cv_data");
const cvSyncStatusColl = db.collection<SyncStatusDoc>("cv_sync_status");

const CURRENT_CV_FILTER: Filter<CvData> = { _id: "current" };
const CURRENT_SYNC_FILTER: Filter<SyncStatusDoc> = { _id: "current" };

async function persistMessages(messages: Message[], threadId: string) {
  const now = new Date();
  const update = {
    $push: { messages: { $each: messages } },
    $set: { updatedAt: now },
  } as unknown as UpdateFilter<Document>;
  const result = await threadsColl.updateOne(
    { _id: new ObjectId(threadId) },
    update,
    { upsert: true }
  );

  return result.modifiedCount > 0 || result.upsertedCount > 0 ? threadId : null;
}

const getMessages = async (threadId: string): Promise<Message[] | undefined> => {
  const result = await threadsColl.findOne({
    _id: new ObjectId(threadId),
  });

  return result?.messages;
};

type ThreadSummary = {
  id: string;
  messageCount: number;
  preview: string;
  updatedAt: string;
};

const getThreads = async (limit = 100): Promise<ThreadSummary[]> => {
  const docs = await threadsColl
    .find({})
    .sort({ updatedAt: -1, _id: -1 })
    .limit(limit)
    .toArray();

  return docs.map((d) => {
    const messages = (d.messages ?? []) as { role: string; content: string }[];
    const firstUser = messages.find((m) => m.role === "user");
    const doc = d as { _id: ObjectId; updatedAt: Date };

    return {
      id: doc._id.toHexString(),
      messageCount: messages.length,
      preview: (firstUser?.content ?? "").slice(0, 80),
      updatedAt: doc.updatedAt.toISOString(),
    };
  });
};

const resetMessages = async (threadId: string) => {
  try {
    await Promise.all([
      threadsColl.deleteOne({ _id: new ObjectId(threadId) }),
      checkpointsColl.deleteMany({ thread_id: threadId }),
      checkpointWritesColl.deleteMany({ thread_id: threadId }),
    ]);
  } catch (error) {
    logger.error(
      error,
      "Failed to reset messages in database for threadId: " + threadId
    );
  }
};

const createThreadIdString = () => new ObjectId().toHexString();

async function isInMaintenance(): Promise<boolean> {
  const doc = await configColl.findOne({ key: "maintenance" });
  return doc?.value === true;
}

async function setMaintenanceMode(enabled: boolean): Promise<void> {
  await configColl.updateOne(
    { key: "maintenance" },
    { $set: { value: enabled, updatedAt: new Date() } },
    { upsert: true }
  );
}

type CvSummary = {
  location: string;
  summary: string;
  workPreferences: string;
};

type CvContact = {
  email: string;
  linkedin: string;
  github?: string | null;
};

type CvExperience = {
  role: string;
  company: string;
  duration: string;
  location?: string | null;
  type?: string | null;
  bullets: string[];
};

type CvSkills = {
  categories: Record<string, string[]>;
};

type CvEducation = {
  degree: string;
  institution: string;
  location?: string | null;
  period?: string | null;
  details?: (string | null)[];
};

type CvData = {
  _id: 'current';
  summary: CvSummary;
  contact: CvContact;
  experience: CvExperience[];
  skills: CvSkills;
  education: CvEducation[];
  updatedAt: Date;
};

type SyncStatusDoc = {
  _id: 'current';
  status: 'success' | 'failed' | 'pending';
  timestamp: Date;
  details: string;
};

async function upsertResume(data: Omit<CvData, '_id' | 'updatedAt'>): Promise<void> {
  const now = new Date();
  await cvColl.updateOne(
    CURRENT_CV_FILTER,
    { $set: { ...data, updatedAt: now } },
    { upsert: true },
  );
}

async function getResume(): Promise<CvData | null> {
  const doc = await cvColl.findOne(CURRENT_CV_FILTER);
  return doc;
}

async function recordSyncStatus(
  status: 'success' | 'failed' | 'pending',
  details: string
): Promise<void> {
  await cvSyncStatusColl.updateOne(
    CURRENT_SYNC_FILTER,
    { $set: { status, timestamp: new Date(), details } },
    { upsert: true }
  );
}

async function getLastSyncStatus(): Promise<SyncStatusDoc | null> {
  const doc = await cvSyncStatusColl.findOne(CURRENT_SYNC_FILTER);
  return doc;
}

const mongodb = {
  client,
  persistMessages,
  getMessages,
  getThreads,
  resetMessages,
  createThreadIdString,
  isInMaintenance,
  setMaintenanceMode,
  upsertResume,
  getResume,
  recordSyncStatus,
  getLastSyncStatus,
};

export default mongodb;