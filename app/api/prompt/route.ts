
import { cookies } from "next/headers";
import { HumanMessage } from "langchain";

import agent from "@/backend/agent"
import mongodb from '@/backend/mongodb'
import config from "@/backend/config";
import pushNotification from "@/backend/push-notification";

const textEncoder = new TextEncoder();

export async function POST(request: Request) {
  const { prompt } = await request.json()

  if (typeof prompt !== "string" || prompt.trim().length === 0) {
    return new Response("Prompt must be a non-empty string.", { status: 400 });
  }

  const { threadId, isNewThread } = await getThreadId();

  return new Response(
    new ReadableStream({
      async start(controller) {
        try {
          const asyncStream = await agent.stream(
            {
              messages: [new HumanMessage(prompt)],
              threadId,
            } as any, // used any because zod.optional() in schema isn't working. langchain issue,
            {
              streamMode: "messages",
              timeout: config.TIMEOUT,
              configurable: {
                thread_id: threadId
              },
            }
          )

          if (isNewThread) pushNotification.notifyAdminDevices(threadId, prompt);

          for await (const [token, metadata] of asyncStream) {
            if (token.content && metadata.langgraph_node === 'model_request') {
              controller.enqueue(textEncoder.encode(token.content as string));
            }
          }
        } catch (err) {
          controller.enqueue(textEncoder.encode("\n[Error: Connection lost]"));
        } finally {
          controller.close();
        }
      }
    }),
    { headers: { 'Content-Type': 'text/plain' } }
  );
}

const getThreadId = async () => {
  const cookieStore = await cookies();
  let threadId = cookieStore.get('t_id')?.value;

  if (!threadId) {
    threadId = mongodb.createThreadIdString();
    cookieStore.set('t_id', threadId, {
      secure: config.NODE_ENV === 'production',
      sameSite: "lax"
    });
    return { threadId, isNewThread: true };
  }

  return { threadId, isNewThread: false };
}
