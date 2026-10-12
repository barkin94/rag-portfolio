# Retrieval Quality Improvement Plan

## Overview
6 phases covering highest-impact, lowest-effort improvements to RAG retrieval and generation quality. Focus on zero-LLM-call context enrichment, hybrid search, minimal prompt fixes, and evaluation foundation.

---

## Target File Structure

```
backend/
├── shared/
│   ├── config.ts              # + CONTEXT_TURNS, HYBRID_SEARCH_ALPHA
│   └── types.ts               # + TopicDefs, TopicSchema (SSOT)
├── features/
│   └── chat/
│       ├── service.ts         # + query contextualization (concat last N user turns)
│       ├── agent.ts           # + citation rule + 2 examples in systemPrompt
│       └── retrieval.ts       # + hybridSearch, TopicSchema, minimal description
├── eval/
│   ├── retrieval-eval.ts      # 25 labeled queries with chunk IDs
│   └── run-eval.ts            # Alpha sweep script
```

---

## Workflow

**Follow `docs/EXECUTION_WORKFLOW.md` strictly.** Read it first before starting any phase work.

---

## Phase Status

| Phase | Description | Status | Approval |
|-------|-------------|--------|----------|
| 0 | Shared Topic Definitions (SSOT) | `✅ Complete` | `✅` |
| 1 | Query Contextualization (Zero-LLM-Call) | `✅ Complete` | `✅` |
| — | **Vector Store Migration (Upstash → MongoDB Atlas)** | `🔄 In Progress` | `⬜` |
| 2 | Hybrid Search (MongoDB Atlas Native) | `⏳ Blocked` | `⬜` |
| 3 | Retrieval Eval Set | `⏳ Pending` | `⬜` |
| 4 | Generation Quality (Minimal Tokens) | `⏳ Pending` | `⬜` |
| 5 | Tool Description (Minimal) | `⏳ Pending` | `⬜` |

---

## Migration Phases

- Phase 0: Reference `docs/retrieval-improvements/phase-0.md` when required
- Phase 1: Reference `docs/retrieval-improvements/phase-1.md` when required
- **Prerequisite**: Vector Store Migration (Upstash → MongoDB Atlas) — Reference `docs/vector-store-migration/implementation.md`
- Phase 2: Reference `docs/retrieval-improvements/phase-2.md` when required
- Phase 3: Reference `docs/retrieval-improvements/phase-3.md` when required
- Phase 4: Reference `docs/retrieval-improvements/phase-4.md` when required
- Phase 5: Reference `docs/retrieval-improvements/phase-5.md` when required

---

## Key Decisions

1. **Zero-LLM-call concat** over LLM query rewrite — no added latency, no token cost, 60-70% follow-up coverage
2. **Hybrid search before reranking** — Upstash native, zero infra, 10-20% recall gain, alpha tunable via config
3. **SSOT TopicDefs** — single object derives enum, type, and Zod schema with descriptions; adding topic = one entry
4. **Minimal prompt additions** — ~60 tokens for citations + 2 examples; free model token budget
5. **Eval set first** — 25 queries before alpha tuning; enables data-driven decisions for all future retrieval work
6. **Improved tool description over specialized tools** — guides LLM topic usage without 7-tool complexity

---

## Config Defaults

| Key | Default | Range |
|-----|---------|-------|
| `CONTEXT_TURNS` | 2 | 0-10 |
| `HYBRID_SEARCH_ALPHA` | 0.5 | 0.0-1.0 |

*Managed in `docs/vector-store-migration/implementation.md`*

---

## Verification Criteria

| Phase | Verify |
|-------|--------|
| 0 | `TopicDefs` exports work; adding entry auto-updates Zod schema description |
| 1 | Follow-up "What about the second one?" retrieves relevant context from history |
| Migration | Atlas hybrid search works; `HYBRID_SEARCH_ALPHA` tunable via env var |
| 2 | Hybrid search eval runs; alpha sweep outputs recall@6 per alpha |
| 3 | `npx tsx backend/eval/run-eval.ts` runs, outputs recall@6 per alpha |
| 4 | Responses include `[Source: ...]` citations; format matches examples |
| 5 | LLM uses `topics` parameter correctly (check tool call logs) |

---

## Deferred Items (Not in Current Plan)

| Suggestion | Why Deferred | When to Revisit |
|------------|--------------|-----------------|
| Reranking | Higher latency/cost; hybrid search first | After eval shows hybrid insufficient |
| Parent-child chunking | Requires re-indexing; one-time effort | If chunk granularity causes issues |
| Semantic chunking | Same as above | Same |
| LLM Query Rewrite | Phase 1 (concat) is zero-cost alternative | If concat fails on pronouns |
| Specialized tools | Replaced by improved topic guidance (Phase 0+5) | If topic misuse persists |