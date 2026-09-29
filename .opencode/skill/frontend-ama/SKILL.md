---
name: frontend-ama
description: AMA chat UI including streaming responses, chat components (input, history, header), message rendering, and loading states. Use when modifying the chat interface, streaming, or message display.
---

# Frontend AMA Chat Skill

This skill provides context for the AMA chat interface.

## Queries

- Modify streaming: "Find ChatInput streaming with Chat useReducer and streamText"
- Change message rendering: "Find MessageHistory Message Chat role content rendering"
- Add new chat feature: "Find Chat state reducer ChatAction ChatState"
- Fix loading state: "Find AMA loading Suspense fallback"

## Key Files

- `app/ama/page.tsx` - Main AMA chat page
- `app/ama/loading.tsx` - Loading UI
- `app/ama/_components/Chat/index.tsx` - Main Chat component (state, reducer)
- `app/ama/_components/Chat/ChatInput/index.tsx` - Chat input with streaming
- `app/ama/_components/Chat/MessageHistory/index.tsx` - Message list
- `app/ama/_components/Chat/MessageHistory/Message/index.tsx` - Individual message
- `app/ama/_components/Chat/Header/index.tsx` - Chat header
- `app/api/prompt/route.ts` - POST endpoint that streams agent responses