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

### Manual Verification

```bash
# Prerequisite: Start dev server
npm run dev
```

**Test 0: PROBLEM VERIFICATION — Prove the bug exists BEFORE implementing Phase 1**
1. Open chat at `http://localhost:3000`
2. Ask: `"Tell me about Getir"`
3. Verify: Response mentions Getir work experience
4. Follow up: `"What about the caching bug?"`
5. **EXPECTED BEFORE FIX**: Response asks for clarification ("What caching bug?") or discusses unrelated caching — **this proves the bug**
6. **After Phase 1 fix**: Response should discuss Getir caching/microservice scaling

**Test 1: Basic Follow-Up (Context Carry)**
1. Ask: `"Tell me about Getir"`
2. Verify: Response mentions Getir work experience
3. Follow up: `"What about the caching bug?"`
4. **Expected**: Response discusses Getir caching/microservice scaling (from `story-getir-microservice-scaling` or `interview-performance-bottleneck`)
5. **Fail signal**: Response asks for clarification or discusses unrelated caching

**Test 2: Multi-Turn Context Stack**
1. Ask: `"What projects has Barkin built?"`
2. Follow up: `"Which one uses RAG?"`
3. Follow up: `"What's the tech stack for that?"`
4. **Expected**: Each follow-up retrieves relevant chunks (portfolio → RAG project → skills)
5. **Fail signal**: Later turns lose earlier context

**Test 3: Topic Switching (Context Reset)**
1. Ask: `"Tell me about Getir"`
2. Follow up: `"What about the caching bug?"` (should work)
3. New topic: `"What's Barkin's email?"`
4. **Expected**: Contact info retrieved (topic switch works)
5. **Fail signal**: Still returns Getir content

**Test 4: Edge Case — No History**
1. New incognito window → fresh thread
2. Ask: `"What about the second one?"`
3. **Expected**: Polite clarification request (no false context)
4. **Fail signal**: Hallucinated context

### Approval Gate
- [ ] Test 1 passes (basic follow-up retrieves correct context)
- [ ] Test 2 passes (3+ turn context stack works)
- [ ] Test 3 passes (topic switch doesn't leak)
- [ ] Test 4 passes (no history handled gracefully)
- [ ] No regression in single-turn queries