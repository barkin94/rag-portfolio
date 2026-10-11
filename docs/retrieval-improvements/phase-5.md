# Phase 5: Tool Description (Minimal)

**Goal**: Replace verbose tool description with minimal version referencing TopicSchema

---

## Steps

| Step | Action | Status | Files Created | Files Modified |
|------|--------|--------|---------------|----------------|
| 5.1 | Import `TopicSchema` in `retrieval.ts` | ⏳ Pending | - | `backend/features/chat/retrieval.ts` |
| 5.2 | Update tool schema to use `TopicSchema` | ⏳ Pending | - | `backend/features/chat/retrieval.ts` |
| 5.3 | Replace tool description with minimal version | ⏳ Pending | - | `backend/features/chat/retrieval.ts` |
| 5.4 | **Verify**: LLM uses `topics` parameter correctly (check logs) | ⏳ Pending | | |

---

## Implementation Details

### `backend/features/chat/retrieval.ts` — Update imports

```typescript
import { TopicSchema } from '@/backend/shared/types';
```

### Update tool schema (lines 36-42)

```typescript
schema: z.object({
  query: z.string().describe("The semantic search string."),
  topics: z.array(TopicSchema),
  expandingKeywords: z.string().describe(
    "Space-separated synonyms/related terms for better recall (e.g., 'React.js javascript frontend')."
  ),
})
```

### Replace description (lines 33-35)

```typescript
description: `
  Retrieves facts about Barkin's background. Use for any factual question.
  Use 'topics' to filter (see field schema for values).
  Always add expandingKeywords (synonyms) for better recall.`,
```

---

## Verification

```bash
# Check tool calls in logs
# 1. Ask: "What's your email?"
#    → Should call getInfoTool with topics: ["contact"]
# 2. Ask: "Tell me about Getir"
#    → Should call getInfoTool with topics: ["work_experience", "achievements"]
# 3. Ask: "What's your tech stack?"
#    → Should call getInfoTool with topics: ["skills", "projects"]
```

**Approval Gate**: LLM correctly selects topic values via field schema (check tool call logs).