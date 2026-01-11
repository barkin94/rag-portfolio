
import { AIMessage, HumanMessage } from "langchain";
import { v4 } from 'uuid';
import { cookies } from "next/headers";

import agent from "@/backend/agent"
import messageMapper from '@/backend/message-mapper'
import logger from "@/logger";
import { createTgThread } from "@/backend/utils";
import config from "@/backend/config";

const textEncoder = new TextEncoder();

export async function POST(request: Request) {
  const threadId = await getThreadId();

  const { prompt, messages: clientMessages = [] } = await request.json()

  // Convert client messages to LangChain format
  const messages: (HumanMessage | AIMessage)[] = messageMapper.toLangchain(clientMessages)

  // Add the new prompt
  messages.push(new HumanMessage(prompt))

  return new Response(
    new ReadableStream({
      async start(controller) {
        try {
          for await (const event of await agent.getResponseStream(messages, String(threadId))) {
            if (event.event === "on_chat_model_stream") {
              const content = event.data.chunk.content;
              if (content) controller.enqueue(textEncoder.encode(content));
            }
          }
        } catch (err) {
          if(err instanceof Error) {
            logger.error("Stream Interrupted: " + err.message);
          }
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
    const respBody = await (await createTgThread(v4())).json()
    threadId = respBody.result.message_thread_id as string;
    cookieStore.set('t_id', threadId, {
      httpOnly: true, // Prevents client-side JS from accessing it (SECURE!)
      secure: config.NODE_ENV === 'production', // Only send over HTTPS,
      sameSite: "lax"
    });
  }
  
  return threadId;
}
