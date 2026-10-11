# Phase 2: Hybrid Search (Upstash Native)

**Goal**: Replace vector-only similarity search with hybrid (vector + BM25) — alpha tunable via config

---

## Steps

| Step | Action | Status | Files Created | Files Modified |
|------|--------|--------|---------------|----------------|
| 2.1 | Add `CONTEXT_TURNS` and `HYBRID_SEARCH_ALPHA` to `BaseSchema` in `config.ts` | ⏳ Pending | - | `backend/shared/config.ts` |
| 2.2 | Import `indexWithEmbeddings` and `config` in `retrieval.ts` | ⏳ Pending | - | `backend/features/chat/retrieval.ts` |
| 2.3 | Replace `vectorStore.similaritySearch` with `indexWithEmbeddings.hybridSearch` | ⏳ Pending | - | `backend/features/chat/retrieval.ts` |
| 2.4 | Pass `alpha: config.HYBRID_SEARCH_ALPHA` | ⏳ Pending | - | `backend/features/chat/retrieval.ts` |
| 2.5 | **Verify**: Hybrid search works; alpha tunable via env var | ⏳ Pending | | |

---

## Implementation Details

### `backend/shared/config.ts` — Add to `BaseSchema` (after line 9)

```typescript
CONTEXT_TURNS: z.coerce.number().int().min(0).max(10).default(2),
HYBRID_SEARCH_ALPHA: z.coerce.number().min(0).max(1).default(0.5),
```

### `backend/features/chat/retrieval.ts` — Update imports

```typescript
import { indexWithEmbeddings } from '@/backend/shared/vector/upstash-repo';
import config from '@/backend/shared/config';
```

### Replace retrieval call (lines 11-15)

```typescript
const topicFilters = topics.length > 0
  ? topics.map(t => `tags CONTAINS '${t}'`).join(' OR ')
  : undefined;

const results = await indexWithEmbeddings.hybridSearch(
  `${query} ${expandingKeywords}`,
  {
    topK: 6,
    filter: topicFilters,
    alpha: config.HYBRID_SEARCH_ALPHA,
  }
);
```

---

## Verification

```bash
# Test with different alpha values via env
HYBRID_SEARCH_ALPHA=0.0 npm run dev  # BM25 only
HYBRID_SEARCH_ALPHA=1.0 npm run dev  # Vector only
HYBRID_SEARCH_ALPHA=0.5 npm run dev  # Balanced (default)

# Verify search returns results for keyword-heavy queries:
# "Redis token bucket rate limit"
# "Barkin email"
```

**Approval Gate**: Confirm hybrid search returns results and `HYBRID_SEARCH_ALPHA` env var changes behavior.