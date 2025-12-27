
import { AIMessage, HumanMessage } from "langchain";

import agent from "@/backend/agent"
import messageMapper from '@/backend/message-mapper'

const textEncoder = new TextEncoder();

export async function POST(request: Request) {
  const { prompt, messages: clientMessages = [] } = await request.json()

  // Convert client messages to LangChain format
  const messages: (HumanMessage | AIMessage)[] = messageMapper.toLangchain(clientMessages)

  // Add the new prompt
  messages.push(new HumanMessage(prompt))

  const stream = await agent.getResponseStream(messages);

  return new Response(
    stream
      .pipeThrough(new TransformStream({
        transform: async (chunk, controller) => {
          // stream only the text response llm streams
          if (chunk['event'] === "on_chat_model_stream") {
            controller.enqueue(textEncoder.encode(chunk.data.chunk.text));
          }
        }
      })
    ),
    {
      headers: {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked',
      }
    }
  )
}

