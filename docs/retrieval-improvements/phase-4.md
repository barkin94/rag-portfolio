# Phase 4: Generation Quality (Minimal Tokens)

**Goal**: Add citation enforcement and 2 compact examples to system prompt — ~60 tokens

---

## Steps

| Step | Action | Status | Files Created | Files Modified |
|------|--------|--------|---------------|----------------|
| 4.1 | Append citation rule to `systemPrompt` in `agent.ts` | ⏳ Pending | - | `backend/features/chat/agent.ts` |
| 4.2 | Append 2 compact examples to `systemPrompt` | ⏳ Pending | - | `backend/features/chat/agent.ts` |
| 4.3 | **Verify**: Responses include `[Source: ...]`; format matches examples | ⏳ Pending | | |

---

## Implementation Details

### `backend/features/chat/agent.ts` — Append to `systemPrompt` (after line 57)

```typescript
CITATIONS: Every factual claim needs [Source: ...]. No source = "I don't have that."

EXAMPLES:
Q: Email? A: barkin@example.com [Source: resume contact]
Q: Getir caching bug? A: Cache stampede fixed with jitter + Redis locks [Source: interview performance] [Source: story microservice scaling]
```

---

## Verification

```bash
# Test via chat
# 1. Ask: "What's your email?"
#    → Should include [Source: resume contact]
# 2. Ask: "Tell me about the Getir caching bug"
#    → Should include [Source: interview performance] [Source: story microservice scaling]
# 3. Ask: "What's your favorite color?"
#    → Should say "I don't have that information."
```

**Approval Gate**: Citations appear consistently; "I don't have that" for unknown queries.