
import { AIMessage, HumanMessage } from "langchain";
import { v7 } from 'uuid'

import agent from "@/backend/agent"
import redis from "@/backend/redis";
import messageMapper from '@/backend/message-mapper'
import utils from '@/backend/utils'

const textEncoder = new TextEncoder();

export async function POST(request: Request) {
  let messages: (HumanMessage | AIMessage)[] = []

  let userId = await utils.getUserIdFromCookie()
  
  // If userId exists in cookies, check redis and load previous messages
  if(userId) {
    const redisMessages = await redis.getMessages(userId)

    messages.push(
      ...messageMapper.redisToLangchain(redisMessages)
    )
  }
  // If not, just create userId and skip redis check
  else {
    userId = v7();
    utils.setUserIdInCookie(userId)
  }

  const { prompt } = await request.json()

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

          // persist the full chat on redis when response is fully generated
          if (chunk['event'] === "on_chat_model_end") {
            const { type, text } = chunk.data.output;

            // if text is '' then a network error likely happened so skip saving response to redis
            if(text) {
              await redis.storeMessages(userId,
                [
                  ...messageMapper.langchainToRedis(messages),
                  { type, content: text }
                ]
              )
            }
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

