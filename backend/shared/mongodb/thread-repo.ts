import { ObjectId } from "mongodb";
import client from './client';
import config from '../config';
import type { Message, ThreadSummary } from '../types';

const db = client.db(config.MONGODB_DBNAME);
const threadsColl = db.collection("threads");
const checkpointsColl = db.collection("checkpoints");
const checkpointWritesColl = db.collection("checkpoint_writes");

export async function persistMessages(messages: Message[], threadId: string): Promise<string | null> {
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

export async function getMessages(threadId: string): Promise<Message[] | undefined> {
  const result = await threadsColl.findOne({
    _id: new ObjectId(threadId),
  });

  return result?.messages;
}

export async function getThreads(limit = 100): Promise<ThreadSummary[]> {
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
}

export async function resetMessages(threadId: string): Promise<void> {
  try {
    await Promise.all([
      threadsColl.deleteOne({ _id: new ObjectId(threadId) }),
      checkpointsColl.deleteMany({ thread_id: threadId }),
      checkpointWritesColl.deleteMany({ thread_id: threadId }),
    ]);
  } catch (error) {
    console.error("Failed to reset messages in database for threadId: " + threadId, error);
  }
}

export function createThreadIdString(): string {
  return new ObjectId().toHexString();
}