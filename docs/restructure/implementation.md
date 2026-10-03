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

## Workflow

### Execution Model

**Immediate status updates — mark the moment you start/finish.**

| Action | Mark Now | File |
|--------|----------|------|
| Start phase | Phase → `🔄 In Progress` | `implementation.md` |
| Start step | Step → `🔄 In Progress` | `phase-N.md` |
| Finish step | Step → `✅ Complete` + files | `phase-N.md` |
| All steps done | Phase → `✅ Complete` | `implementation.md` |
| Phase approved | Approval → `✅` | `implementation.md` |

Default state: `⏳ Pending` (requires no action — just don't mark yet).

No waiting. No batching. Update instantly.

---

## Phase Status

| Phase | Description | Status | Approval |
|-------|-------------|--------|----------|
| 1 | Foundation - Shared Infrastructure | ✅ Complete | ✅ |
| 2 | Chat Feature Extraction | ✅ Complete | ✅ |
| 3 | CV Sync Feature Extraction | ✅ Complete | ✅ |
| 4 | Admin Feature Extraction | ✅ Complete | ✅ |
| 5 | Notifications Feature | ✅ Complete | ✅ |
| 6 | Knowledge/Retrieval Shared Assets | ⏳ Pending | ⬜ |
| 7 | Cleanup & Compatibility | ⏳ Pending | ⬜ |

---

## Migration Phases (Incremental, Approval After Each)

- Phase 1: Reference `docs/restructure/phase-1.md` when required
- Phase 2: Reference `docs/restructure/phase-2.md` when required
- Phase 3: Reference `docs/restructure/phase-3.md` when required
- Phase 4: Reference `docs/restructure/phase-4.md` when required
- Phase 5: Reference `docs/restructure/phase-5.md` when required
- Phase 6: Reference `docs/restructure/phase-6.md` when required
- Phase 7: Reference `docs/restructure/phase-7.md` when required

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
4. **Migration**: Incremental, phase-gated, approval after each
