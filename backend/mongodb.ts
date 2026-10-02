import { MongoClient, ObjectId } from "mongodb";
import config from "@/backend/shared/config";
import logger from "@/backend/shared/logger";
import { Message } from "@/backend/shared/types";

const client = await new MongoClient(config.MONGODB_URI).connect();

const db = client.db(config.MONGODB_DBNAME);

const threadsColl = db.collection("threads");
const checkpointsColl = db.collection("checkpoints");
const checkpointWritesColl = db.collection("checkpoint_writes");
const configColl = db.collection("config");
const cvColl = db.collection("cv_data");
const cvSyncStatusColl = db.collection("cv_sync_status");

async function persistMessages(messages: Message[], threadId: string) {
  const now = new Date();
  const result = await threadsColl.updateOne(
    { _id: new ObjectId(threadId) },
    {
      $push: { messages: { $each: messages } } as any,
      $set: { updatedAt: now },
    },
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
    { _id: "current" as any },
    { $set: { ...data, updatedAt: now } },
    { upsert: true },
  );
}

async function getResume(): Promise<CvData | null> {
  const doc = await cvColl.findOne({ _id: 'current' as any });
  return doc as CvData | null;
}

async function recordSyncStatus(
  status: 'success' | 'failed' | 'pending',
  details: string
): Promise<void> {
  await cvSyncStatusColl.updateOne(
    { _id: 'current' as any },
    { $set: { status, timestamp: new Date(), details } },
    { upsert: true }
  );
}

async function getLastSyncStatus(): Promise<SyncStatusDoc | null> {
  const doc = await cvSyncStatusColl.findOne({ _id: 'current' as any });
  return doc as SyncStatusDoc | null;
}

export default {
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