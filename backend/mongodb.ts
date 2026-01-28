import { MongoClient, ObjectId } from "mongodb";
import Config from "./config";
import config from "./config";
import logger from "@/logger";
import { Message } from "@/common/types";

const client = await new MongoClient(Config.MONGODB_URI).connect();

const db = client.db(config.MONGODB_DBNAME);

const threadsColl = db.collection("threads");
const checkpointsColl = db.collection("checkpoints");
const checkpointWritesColl = db.collection("checkpoint_writes");

async function persistMessages(messages: Message[], threadId: string) {
  const now = new Date();
  const result = await threadsColl.updateOne(
    { _id: new ObjectId(threadId) },
    {
      $push: { messages: { $each: messages } },
      $set: { updatedAt: now },
    } as any,
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
    // Execute all deletions in parallel for better performance
    await Promise.all([
      // 1. Delete items with ids matching threadId from threads collection
      threadsColl.deleteOne({ _id: new ObjectId(threadId) }),
      // 2. Delete items with thread_id matching threadId in checkpoints collection
      checkpointsColl.deleteMany({ thread_id: threadId }),
      // 3. Delete items with thread_id matching threadId in checkpoint_writes collection
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

export default {
  client,
  persistMessages,
  getMessages,
  getThreads,
  resetMessages,
  createThreadIdString,
};
