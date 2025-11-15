import { streamChatModelMessage } from "@/backend/agent"

export async function POST(request: Request) {
  const { prompt } = await request.json()

  const stream = streamChatModelMessage(prompt);

  return new Response(
    stream,
    {
      headers: {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked',
      }
    }
  )
}