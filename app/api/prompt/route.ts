import { streamChat } from '@/backend/features/chat';

export async function POST(request: Request) {
  const { prompt } = await request.json()

  if (typeof prompt !== "string" || prompt.trim().length === 0) {
    return new Response("Prompt must be a non-empty string.", { status: 400 });
  }

  try {
    const { stream } = await streamChat({ prompt });

    return new Response(stream, { headers: { 'Content-Type': 'text/plain' } });
  } catch {
    return new Response("Internal server error", { status: 500 });
  }
}