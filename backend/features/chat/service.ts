import { cookies } from "next/headers";
import { HumanMessage } from "langchain";

import agent from './agent';
import { createThreadIdString } from '@/backend/shared/mongodb';
import { getMessages } from '@/backend/shared/mongodb/thread-repo';
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

  // Phase 1: Query Contextualization - concatenate last N user turns
  const history = await getMessages(threadId);
  const contextualizedPrompt = buildContextualizedPrompt(prompt, history ?? []);

  const asyncStream = await agent.stream(
    {
      messages: [new HumanMessage(contextualizedPrompt)],
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

function buildContextualizedPrompt(currentPrompt: string, history: { role: string; content: string }[]): string {
  const contextTurns = config.CONTEXT_TURNS ?? 2;
  
  // Get last N user messages from history (excluding the current prompt which isn't saved yet)
  const userMessages = history
    .filter(m => m.role === 'user')
    .slice(-contextTurns)
    .map(m => m.content);

  if (userMessages.length === 0) {
    return currentPrompt;
  }

  // Concatenate: "Previous user msg 1 | Previous user msg 2 | Current prompt"
  return [...userMessages, currentPrompt].join(' | ');
}