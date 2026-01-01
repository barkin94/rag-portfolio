
import { AIMessage, HumanMessage } from "langchain";

import agent from "@/backend/agent"
import messageMapper from '@/backend/message-mapper'
import logger from "@/logger";

const textEncoder = new TextEncoder();

export async function POST(request: Request) {
  const { prompt, messages: clientMessages = [] } = await request.json()

  // Convert client messages to LangChain format
  const messages: (HumanMessage | AIMessage)[] = messageMapper.toLangchain(clientMessages)

  // Add the new prompt
  messages.push(new HumanMessage(prompt))

  const stream = await agent.getResponseStream(messages);

  return new Response(
    new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
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

