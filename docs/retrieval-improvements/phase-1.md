# Phase 1: Query Contextualization (Zero-LLM-Call)

**Goal**: Concatenate last N user turns to current query before retrieval — zero LLM calls, ~10-20ms MongoDB read

---

## Steps

| Step | Action | Status | Files Created | Files Modified |
|------|--------|--------|---------------|----------------|
| 1.1 | Add `getMessages` import to `service.ts` | ⏳ Pending | - | `backend/features/chat/service.ts` |
| 1.2 | Add `config` import to `service.ts` | ⏳ Pending | - | `backend/features/chat/service.ts` |
| 1.3 | Add `contextualizeQuery` helper function | ⏳ Pending | - | `backend/features/chat/service.ts` |
| 1.4 | In `streamChat()`: load history via `getMessages(threadId)` | ⏳ Pending | - | `backend/features/chat/service.ts` |
| 1.5 | Build contextualized prompt, pass to agent | ⏳ Pending | - | `backend/features/chat/service.ts` |
| 1.6 | **Verify**: Follow-up "What about the second one?" retrieves relevant context | ⏳ Pending | | |

---

## Implementation Details

### `backend/features/chat/service.ts` — Add imports

```typescript
import { getMessages } from '@/backend/shared/mongodb';
import config from '@/backend/shared/config';
```

### Helper function (before `streamChat`)

```typescript
function contextualizeQuery(prompt: string, history: Message[]): string {
  const recentUserMessages = history
    .filter(m => m.role === 'user')
    .slice(-config.CONTEXT_TURNS)
    .map(m => m.content)
    .join(' | ');
  return recentUserMessages ? `${recentUserMessages} | ${prompt}` : prompt;
}
```

### In `streamChat()` — After getting `threadId` (line 26)

```typescript
const history = await getMessages(threadId) ?? [];
const contextualizedPrompt = contextualizeQuery(prompt, history);

const asyncStream = await agent.stream(
  {
    messages: [new HumanMessage(contextualizedPrompt)],
    threadId,
  },
  // ... rest unchanged
);
```

---

## Verification

```bash
# Test manually or via existing chat flow
# 1. Ask: "Tell me about Getir"
# 2. Follow up: "What about the caching bug?"
# 3. Should retrieve interview-performance-bottleneck / story-getir-microservice-scaling
```

**Approval Gate**: Confirm follow-up questions retrieve relevant context without LLM rewrite.