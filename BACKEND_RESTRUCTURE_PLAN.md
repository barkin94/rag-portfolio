# Backend Restructure Plan: Feature-Based Architecture

## Target Structure

```
backend/
├── features/
│   ├── chat/                    # AMA chat feature
│   │   ├── index.ts             # Barrel: chatService, agent
│   │   ├── service.ts           # Business logic (streaming, thread mgmt)
│   │   ├── agent.ts             # LangChain agent (OpenRouter model)
│   │   ├── retrieval.ts         # getInfoTool, search logic
│   │   ├── state-schema.ts      # Agent state
│   │   └── middlewares/
│   │       ├── index.ts
│   │       ├── conversation-saver.ts
│   │       └── summarization.ts
│   │
│   ├── cv-sync/                 # CV sync pipeline
│   │   ├── index.ts             # Barrel: syncCv
│   │   ├── service.ts           # Orchestrates: fetch → parse → index
│   │   ├── agent.ts             # LangChain agent (NVIDIA Nemotron model)
│   │   ├── parser.ts            # LLM parsing logic
│   │   ├── google-drive.ts      # Google Drive client
│   │   └── document-builders.ts # Chunk creation from parsed CV
│   │
│   ├── admin/                   # Admin features
│   │   ├── index.ts             # Barrel: adminService
│   │   ├── service.ts           # Thread listing, maintenance, sync status
│   │   └── types.ts
│   │
│   └── notifications/           # Push notifications
│       ├── index.ts
│       └── firebase.ts          # Firebase messaging
│
├── shared/
│   ├── config.ts                # Env validation (Zod)
│   ├── logger.ts                # Pino logger
│   ├── mongodb/                 # Reusable MongoDB repos
│   │   ├── index.ts
│   │   ├── client.ts
│   │   ├── thread-repo.ts
│   │   ├── cv-repo.ts
│   │   └── config-repo.ts
│   ├── vector/                  # Reusable vector access
│   │   ├── index.ts
│   │   ├── upstash-repo.ts
│   │   └── embeddings.ts
│   └── types.ts                 # Message, ThreadSummary, etc.
│
├── index.ts                     # Public API barrel
└── config.ts                    # Re-exports shared/config (for compatibility)
```

---

## Migration Phases (Incremental, Approval After Each)

### Phase 1: Foundation - Shared Infrastructure
**Goal**: Extract reusable infrastructure, no feature logic changes

| Step | Action | Files Created | Files Modified |
|------|--------|---------------|----------------|
| 1.1 | Create `backend/shared/` structure | `shared/config.ts`, `shared/logger.ts`, `shared/types.ts` | - |
| 1.2 | Move `config.ts` → `shared/config.ts` | - | `config.ts` |
| 1.3 | Move `logger.ts` → `shared/logger.ts` | - | `logger.ts` (root) |
| 1.4 | Move `common/types.ts` → `shared/types.ts` | - | `common/types.ts` |
| 1.5 | Create `shared/mongodb/` with repos | `client.ts`, `thread-repo.ts`, `cv-repo.ts`, `config-repo.ts` | `mongodb.ts` |
| 1.6 | Create `shared/vector/` with repos | `upstash-repo.ts`, `embeddings.ts` | `vector-store.ts` |
| 1.7 | Add `backend/index.ts` barrel | `index.ts` | - |
| 1.8 | Add `shared/index.ts` barrel | `shared/index.ts` | - |
| 1.9 | **Verify**: Build passes, all imports resolve | | |

**Approval Gate**: Review shared layer, confirm no behavior change.

---

### Phase 2: Chat Feature Extraction
**Goal**: Isolate chat/AMA logic into `features/chat/`

| Step | Action | Files Created | Files Modified |
|------|--------|---------------|----------------|
| 2.1 | Create `features/chat/` structure | `service.ts`, `agent.ts`, `retrieval.ts`, `state-schema.ts`, `middlewares/*` | - |
| 2.2 | Move agent logic: `backend/agent/index.ts` → `features/chat/agent.ts` | | `agent/index.ts` |
| 2.3 | Move tool: `backend/tools.ts` → `features/chat/retrieval.ts` | | `tools.ts` |
| 2.4 | Move schemas: `backend/agent/schemas.ts` → `features/chat/state-schema.ts` | | `agent/schemas.ts` |
| 2.5 | Move middleware: `backend/agent/middlewares/` → `features/chat/middlewares/` | | `agent/middlewares/` |
| 2.6 | Create `features/chat/service.ts` - extract logic from `app/api/prompt/route.ts` | `service.ts` | `app/api/prompt/route.ts` |
| 2.7 | Create `features/chat/index.ts` barrel | `index.ts` | - |
| 2.8 | Update `app/api/prompt/route.ts` to use `chatService` | | `app/api/prompt/route.ts` |
| 2.9 | **Verify**: Chat works end-to-end | | |

**Approval Gate**: Test AMA chat, confirm streaming + persistence works.

---

### Phase 3: CV Sync Feature Extraction
**Goal**: Isolate CV pipeline into `features/cv-sync/`

| Step | Action | Files Created | Files Modified |
|------|--------|---------------|----------------|
| 3.1 | Create `features/cv-sync/` structure | `service.ts`, `agent.ts`, `parser.ts`, `google-drive.ts`, `document-builders.ts` | - |
| 3.2 | Move `cv-sync.ts` logic → `service.ts` + `document-builders.ts` | | `cv-sync.ts` |
| 3.3 | Move `cv-parser.ts` → `parser.ts` (update model config) | | `cv-parser.ts` |
| 3.4 | Move `google-drive.ts` → `google-drive.ts` | | `google-drive.ts` |
| 3.5 | Create CV sync agent (`agent.ts`) with Nemotron config | `agent.ts` | - |
| 3.6 | Create `features/cv-sync/index.ts` barrel | `index.ts` | - |
| 3.7 | Update `app/api/queues/sync-cv/route.ts` and `app/api/admin/sync-cv/route.ts` | | 2 API routes |
| 3.8 | **Verify**: CV sync works end-to-end | | |

**Approval Gate**: Test CV sync, confirm parsing + indexing works.

---

### Phase 4: Admin Feature Extraction
**Goal**: Isolate admin logic into `features/admin/`

| Step | Action | Files Created | Files Modified |
|------|--------|---------------|----------------|
| 4.1 | Create `features/admin/` structure | `service.ts`, `types.ts` | - |
| 4.2 | Extract thread listing, maintenance, sync status from `app/api/admin/*` | `service.ts` | 5 API routes |
| 4.3 | Create `features/admin/index.ts` barrel | `index.ts` | - |
| 4.4 | Update admin API routes to use `adminService` | | 5 API routes |
| 4.5 | **Verify**: Admin pages work | | |

**Approval Gate**: Test admin thread viewer, maintenance toggle.

---

### Phase 5: Notifications Feature
**Goal**: Isolate push notifications

| Step | Action | Files Created | Files Modified |
|------|--------|---------------|----------------|
| 5.1 | Create `features/notifications/` | `firebase.ts` | - |
| 5.2 | Move `push-notification.ts` → `firebase.ts` | | `push-notification.ts` |
| 5.3 | Create barrel | `index.ts` | - |
| 5.4 | Update `app/api/admin/push-subscribe/route.ts` | | 1 API route |
| 5.5 | **Verify**: Push notifications work | | |

**Approval Gate**: Test push subscription.

---

### Phase 6: Knowledge/Retrieval Shared Assets
**Goal**: Move static knowledge chunks to shared location accessible by both agents

| Step | Action | Files Created | Files Modified |
|------|--------|---------------|----------------|
| 6.1 | Create `shared/knowledge/` | `portfolio-chunks.ts`, `interview-qna-chunks.ts`, `behavioral-story-chunks.ts` | `data-chunks/*` |
| 6.2 | Add barrel exporting `allChunks`, individual chunk arrays | `index.ts` | - |
| 6.3 | Update `chat/retrieval.ts` and `cv-sync/service.ts` to import from knowledge barrel | | 2 files |
| 6.4 | **Verify**: Both agents retrieve correctly | | |

**Approval Gate**: Test retrieval in both chat and CV sync.

---

### Phase 7: Cleanup & Compatibility
**Goal**: Remove old structure, ensure smooth transition

| Step | Action |
|------|--------|
| 7.1 | Remove old flat files: `tools.ts`, `cv-sync.ts`, `cv-parser.ts`, `google-drive.ts`, `push-notification.ts`, `mongodb.ts`, `vector-store.ts`, `enums.ts`, `agent/` (old), `data-chunks/` |
| 7.2 | Update `backend/config.ts` to re-export `shared/config` (compatibility) |
| 7.3 | Update `proxy.ts` imports to use new paths |
| 7.4 | Update any remaining internal imports |
| 7.5 | **Verify**: Full build, all features work |

---

## Import Mapping (Old → New)

| Old Import | New Import |
|------------|------------|
| `@/backend/config` | `@/backend/shared/config` |
| `@/backend/mongodb` | `@/backend/shared/mongodb` |
| `@/backend/vector-store` | `@/backend/shared/vector` |
| `@/backend/tools` | `@/backend/features/chat/retrieval` |
| `@/backend/agent` | `@/backend/features/chat/agent` |
| `@/backend/cv-sync` | `@/backend/features/cv-sync` |
| `@/backend/push-notification` | `@/backend/features/notifications` |
| `@/backend/enums` | `@/backend/shared/types` (Topic moved) |
| `@/backend/data-chunks/*` | `@/backend/shared/knowledge` |

---

## Key Decisions

1. **Agents**: Separate per feature (chat=OpenRouter, cv-sync=Nemotron)
2. **API routes**: Stay in `app/api/` as controllers; services in `backend/features/*`
3. **Shared repos**: `shared/mongodb/`, `shared/vector/` used by multiple features
4. **Knowledge**: `shared/knowledge/` single source for both agents
5. **Migration**: Incremental, phase-gated, approval after each

---

## Session Plan

| Session | Phases | Checkpoint |
|---------|--------|------------|
| 1 | Phase 1 | Shared infra complete, build passes |
| 2 | Phase 2 | AMA chat works end-to-end |
| 3 | Phase 3 | CV sync works end-to-end |
| 4 | Phases 4-5 | Admin + push work |
| 5 | Phases 6-7 | Full cleanup, all green |