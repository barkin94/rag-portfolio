
import { cookies } from "next/headers";
import { HumanMessage } from "langchain";

import agent from "@/backend/agent"
import logger from "@/logger";
import mongodb from '@/backend/mongodb'
import config from "@/backend/config";

const textEncoder = new TextEncoder();

export async function POST(request: Request) {
  const { prompt } = await request.json()

  const threadId = await getThreadId();

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

  return new Response(
    new ReadableStream({
      async start(controller) {
        try {
          for await (const [token, metadata] of await asyncStream) {
            if(token.content && metadata.langgraph_node === 'model_request') {
              controller.enqueue(token.content);
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
  
  if(!threadId) {
    threadId = mongodb.createThreadIdString();
    
    cookieStore.set('t_id', threadId, {
      secure: config.NODE_ENV === 'production', // Only send over HTTPS,
      sameSite: "lax"
    });
  }
  
  return threadId;
}
