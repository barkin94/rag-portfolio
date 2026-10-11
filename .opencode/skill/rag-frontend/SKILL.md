---
name: rag-frontend
description: AMA chat UI: streaming responses via Vercel AI SDK, chat state management (useReducer), message components (input, history, header, individual messages), loading states, and Suspense boundaries. Use when modifying the chat interface, streaming behavior, or message rendering.
---

# RAG Frontend (Chat UI)

## Mental Model

```
app/ama/page.tsx (server) → Chat/index.tsx (client, useReducer)
    │
    ├── ChatInput → streamText (Vercel AI SDK) → /api/prompt/route.ts
    ├── MessageHistory → Message (role, content, streaming cursor)
    └── Header (thread title, actions)
```

## Key Queries (intent → entry point)

| Task | Search For |
|------|------------|
| Streaming implementation | `ChatInput` `streamText` `useChat` `Chat/index.tsx` |
| Message rendering | `MessageHistory` `Message` `role` `content` |
| State / reducer | `chatReducer` `ChatAction` `ChatState` `Chat/index.tsx` |
| Loading / Suspense | `loading.tsx` `Suspense` fallback `app/ama/page.tsx` |

## File Map

| Component | File |
|-----------|------|
| **Core state & reducer** | `app/ama/_components/Chat/index.tsx` |
| **Streaming input** | `app/ama/_components/Chat/ChatInput/index.tsx` |
| **Message list** | `app/ama/_components/Chat/MessageHistory/index.tsx` |
| **Single message** | `app/ama/_components/Chat/MessageHistory/Message/index.tsx` |
| **Header** | `app/ama/_components/Chat/Header/index.tsx` |
| **Page & loading** | `app/ama/page.tsx`, `app/ama/loading.tsx` |
| **API contract** | `app/api/prompt/route.ts` (POST → ReadableStream) |

## Critical Patterns

- **State shape**: `{ messages: Message[], input: string, isStreaming: boolean, error, threadId }`
- **Stream flow**: `SEND_MESSAGE` (optimistic) → fetch `/api/prompt` → `STREAM_CHUNK` per chunk → `STREAM_END`
- **Add action**: Add case to `chatReducer` in `Chat/index.tsx`, dispatch from component

## Env Vars

None directly (uses backend env via API)