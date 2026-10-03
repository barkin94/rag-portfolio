import { cookies } from "next/headers";
import { HumanMessage } from "langchain";

import agent from './agent';
import { createThreadIdString } from '@/backend/shared/mongodb';
import config from '@/backend/shared/config';
import { notifyAdminDevices } from '@/backend/features/notifications';

const textEncoder = new TextEncoder();

export interface StreamChatParams {
  prompt: string;
}

export interface StreamChatResult {
  stream: ReadableStream<Uint8Array>;
  threadId: string;
  isNewThread: boolean;
}

export async function streamChat({ prompt }: StreamChatParams): Promise<StreamChatResult> {
  if (typeof prompt !== "string" || prompt.trim().length === 0) {
    throw new Error("Prompt must be a non-empty string.");
  }

  const { threadId, isNewThread } = await getThreadId();

  const asyncStream = await agent.stream(
    {
      messages: [new HumanMessage(prompt)],
      threadId,
    },
    {
      streamMode: "messages",
      timeout: config.TIMEOUT,
      configurable: {
        thread_id: threadId
      },
    }
  );

  if (isNewThread) {
    notifyAdminDevices(threadId, prompt);
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const [token, metadata] of asyncStream) {
          if (token.content && metadata.langgraph_node === 'model_request') {
            controller.enqueue(textEncoder.encode(token.content as string));
          }
        }
      } catch {
        controller.enqueue(textEncoder.encode("\n[Error: Connection lost]"));
      } finally {
        controller.close();
      }
    }
  });

  return { stream, threadId, isNewThread };
}

async function getThreadId() {
  const cookieStore = await cookies();
  let threadId = cookieStore.get('t_id')?.value;

  if (!threadId) {
    threadId = createThreadIdString();
    cookieStore.set('t_id', threadId, {
      secure: config.NODE_ENV === 'production',
      sameSite: "lax"
    });
    return { threadId, isNewThread: true };
  }

  return { threadId, isNewThread: false };
}