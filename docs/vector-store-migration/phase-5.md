# Phase 5: Verification & Alpha Tuning

**Goal**: Verify hybrid search works end-to-end and tune `HYBRID_SEARCH_ALPHA`

---

## Steps

| Step | Action | Status | Files Created | Files Modified |
|------|--------|--------|---------------|----------------|
| 5.1 | Start dev server with default alpha (0.5) | ⏳ Pending | | |
| 5.2 | Test keyword-heavy queries (BM25 should help) | ⏳ Pending | | |
| 5.3 | Test semantic queries (vector should help) | ⏳ Pending | | |
| 5.4 | Sweep alpha: 0.0 (BM25 only), 0.5 (balanced), 1.0 (vector only) | ⏳ Pending | | |
| 5.5 | Confirm no regressions in retrieval tool | ⏳ Pending | | |

---

## Verification Tests

### Test Commands

```bash
# Default (balanced)
HYBRID_SEARCH_ALPHA=0.5 npm run dev

# BM25 only - keyword heavy queries should work better
HYBRID_SEARCH_ALPHA=0.0 npm run dev

# Vector only - semantic queries should work better  
HYBRID_SEARCH_ALPHA=1.0 npm run dev
```

### Test Queries

| Query Type | Example | Expected Best Alpha |
|------------|---------|---------------------|
| Keyword-heavy | "Barkin email" | 0.0 (BM25) |
| Keyword-heavy | "Redis token bucket rate limit" | 0.0-0.3 |
| Semantic | "Tell me about Getir work experience" | 0.5-1.0 |
| Semantic | "How does Barkin approach system design?" | 0.7-1.0 |
| Mixed | "Getir microservice caching bug" | 0.3-0.5 |

### Verification Checklist

- [ ] `HYBRID_SEARCH_ALPHA=0.0` returns results for "Barkin email"
- [ ] `HYBRID_SEARCH_ALPHA=1.0` returns results for "Getir work experience"
- [ ] `HYBRID_SEARCH_ALPHA=0.5` works for both query types
- [ ] Topic filtering works: `topics: ["work"]` returns only work-tagged chunks
- [ ] No errors in console during retrieval
- [ ] Citations `[Source: ...]` still appear in responses
- [ ] Phase 1 contextualization still works (follow-up questions)

---

## Approval Gate

- [ ] All test queries return relevant results at some alpha value
- [ ] Alpha tuning changes result ranking observably
- [ ] No TypeScript errors
- [ ] No runtime errors in retrieval tool
- [ ] Ready for Retrieval Improvements Phase 2 (Hybrid Search eval)