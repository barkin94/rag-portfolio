# Project TODOs

## Predictability Improvements (Deferred - After Restructure)

- [ ] Add backend/data-chunks/index.ts barrel export
- [ ] Add backend/index.ts top-level barrel export
- [ ] Add @backend/* path alias to tsconfig.json
- [ ] Standardize config.ts to named export
- [ ] Standardize vector-store.ts to named export
- [ ] Standardize push-notification.ts to named exports
- [ ] Fix duplicate import in mongodb.ts
- [ ] Rename interview-QnA.ts → interview-qna.ts
- [ ] Convert mongodb.ts to named exports
- [ ] Update all consumers to use barrel exports

## Backend Restructure (In Progress - Feature-Based Architecture)

See `BACKEND_RESTRUCTURE_PLAN.md` and `RESTRUCTURE_PROGRESS.md` for detailed plan.

### Phase 1: Foundation - Shared Infrastructure
- [ ] Create `backend/shared/` structure (config, logger, types)
- [ ] Move `config.ts` → `shared/config.ts`
- [ ] Move `logger.ts` → `shared/logger.ts`
- [ ] Move `common/types.ts` → `shared/types.ts`
- [ ] Create `shared/mongodb/` with repos (client, thread-repo, cv-repo, config-repo)
- [ ] Create `shared/vector/` with repos (upstash-repo, embeddings)
- [ ] Add `backend/index.ts` barrel
- [ ] Add `shared/index.ts` barrel
- [ ] Verify build passes

### Phase 2: Chat Feature Extraction
- [ ] Create `features/chat/` structure
- [ ] Move agent logic to `features/chat/agent.ts`
- [ ] Move tool to `features/chat/retrieval.ts`
- [ ] Move schemas to `features/chat/state-schema.ts`
- [ ] Move middlewares to `features/chat/middlewares/`
- [ ] Create `features/chat/service.ts`
- [ ] Create `features/chat/index.ts` barrel
- [ ] Update `app/api/prompt/route.ts` to use `chatService`
- [ ] Verify chat works end-to-end

### Phase 3: CV Sync Feature Extraction
- [ ] Create `features/cv-sync/` structure
- [ ] Move `cv-sync.ts` logic to `service.ts` + `document-builders.ts`
- [ ] Move `cv-parser.ts` to `parser.ts`
- [ ] Move `google-drive.ts`
- [ ] Create CV sync agent (`agent.ts`) with Nemotron config
- [ ] Create `features/cv-sync/index.ts` barrel
- [ ] Update sync API routes
- [ ] Verify CV sync works end-to-end

### Phase 4: Admin Feature Extraction
- [ ] Create `features/admin/` structure
- [ ] Extract admin logic to `service.ts`
- [ ] Create `features/admin/index.ts` barrel
- [ ] Update admin API routes
- [ ] Verify admin pages work

### Phase 5: Notifications Feature
- [ ] Create `features/notifications/` structure
- [ ] Move `push-notification.ts` to `firebase.ts`
- [ ] Create barrel
- [ ] Update push-subscribe route
- [ ] Verify push notifications work

### Phase 6: Knowledge/Retrieval Shared Assets
- [ ] Create `shared/knowledge/` with chunks
- [ ] Add knowledge barrel
- [ ] Update chat/retrieval and cv-sync/service
- [ ] Verify both agents retrieve correctly

### Phase 7: Cleanup & Compatibility
- [ ] Remove old flat files
- [ ] Update `backend/config.ts` compatibility re-export
- [ ] Update `proxy.ts` imports
- [ ] Update remaining internal imports
- [ ] Full verification

---

## Architecture & Structural Improvements (Deferred)

### Retrieval Enhancements
- [ ] Add hybrid search (BM25 + vector)
- [ ] Implement reranking (cross-encoder or LLM-based)
- [ ] Add query expansion / multi-query retrieval
- [ ] Support multiple retrieval strategies per topic

### LLM Provider Abstraction
- [ ] Define LLMProvider interface
- [ ] Implement OpenRouterProvider, GeminiProvider, OllamaProvider
- [ ] Config-driven provider selection

### Caching Layer
- [ ] Add Redis/Upstash for embedding cache
- [ ] Add query cache
- [ ] Add LLM response cache
- [ ] Cache invalidation on CV sync

### Observability & Evaluation
- [ ] Add LangSmith or OpenTelemetry tracing
- [ ] Structured logging with correlation IDs
- [ ] Continuous evaluation (correctness, hallucination, relevance)
- [ ] Metrics dashboard

### Security & Rate Limiting
- [ ] Per-IP rate limits on /api/prompt
- [ ] Auth for admin endpoints
- [ ] Input validation/sanitization

### Testing Strategy
- [ ] Unit tests for domain logic (Vitest)
- [ ] Integration tests for API routes
- [ ] E2E tests for chat flow (Playwright)
- [ ] Golden dataset for retrieval eval

### CV Sync Improvements
- [ ] Versioned vector store (namespace by version)
- [ ] Diff-based updates instead of full replace
- [ ] Rollback capability
- [ ] Scheduled sync with cron (Vercel Cron or Upstash Queue)

### Error Handling
- [ ] Structured error types
- [ ] Consistent error responses
- [ ] Better error messages for debugging

---

## Notes

- Predictability improvements must NOT alter any behavior
- Backend restructure takes priority; predictability improvements after restructure
- All other improvements deferred until explicitly requested
- Focus on making codebase navigable and predictable first