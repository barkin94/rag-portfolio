
import { AIMessage, HumanMessage } from "langchain";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from 'next/headers';
import { v7 } from "uuid";

import Agent from "@/backend/agent"
import Redis from "@/backend/redis";
import MessageMapper from '@/backend/message-mapper'

const COOKIE_OPTIONS: Partial<ResponseCookie> = {
  httpOnly: true, // Prevents client-side JS from accessing it (SECURE!)
  secure: process.env.NODE_ENV === 'production', // Only send over HTTPS,
  path: '/api/prompt',
  sameSite: "lax"
}

const SESSION_ID_COOKIE_KEY = 'session_id';

export async function POST(request: Request) {
  const cookieStore = await cookies();

  let sessionID: string
  let messages: (HumanMessage | AIMessage)[] = []

  if (cookieStore.has(SESSION_ID_COOKIE_KEY)) {
    sessionID = cookieStore.get(SESSION_ID_COOKIE_KEY)!.value
    messages.push(
      ...MessageMapper.redisToLangchain(await Redis.getMessages(sessionID))
    )
  }
  else {
    sessionID = v7()
  }

  const { prompt } = await request.json()

  messages.push(new HumanMessage(prompt))

  const stream = await Agent.getResponseStream(messages);

  cookieStore.set(SESSION_ID_COOKIE_KEY, sessionID, COOKIE_OPTIONS)

  return new Response(
    stream
      .pipeThrough(new TransformStream({
        transform: async (chunk, controller) => {
          if (chunk['event'] === "on_chat_model_stream") {
            const content = chunk.data.chunk.content;
            controller.enqueue(new TextEncoder().encode(content));
          }

          if (chunk['event'] === "on_chat_model_end") {
            const { type, content } = chunk.data.output
            await Redis.storeMessages(sessionID,
              [
                ...MessageMapper.langchainToRedis(messages),
                { type, content }
              ]
            )
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

