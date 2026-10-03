# Phase 2: Chat Feature Extraction

**Goal**: Isolate chat/AMA logic into `features/chat/`

| Step | Action | Status | Files Created | Files Modified |
|------|--------|--------|---------------|----------------|
| 2.1 | Create `features/chat/` structure | ⏳ Pending | `service.ts`, `agent.ts`, `retrieval.ts`, `state-schema.ts`, `middlewares/*` | - |
| 2.2 | Move agent logic: `backend/agent/index.ts` → `features/chat/agent.ts` | ⏳ Pending | | `agent/index.ts` |
| 2.3 | Move tool: `backend/tools.ts` → `features/chat/retrieval.ts` | ⏳ Pending | | `tools.ts` |
| 2.4 | Move schemas: `backend/agent/schemas.ts` → `features/chat/state-schema.ts` | ⏳ Pending | | `agent/schemas.ts` |
| 2.5 | Move middleware: `backend/agent/middlewares/` → `features/chat/middlewares/` | ⏳ Pending | | `agent/middlewares/` |
| 2.6 | Create `features/chat/service.ts` - extract logic from `app/api/prompt/route.ts` | ⏳ Pending | `service.ts` | `app/api/prompt/route.ts` |
| 2.7 | Create `features/chat/index.ts` barrel | ⏳ Pending | `index.ts` | - |
| 2.8 | Update `app/api/prompt/route.ts` to use `chatService` | ⏳ Pending | | `app/api/prompt/route.ts` |
| 2.9 | **Verify**: Chat works end-to-end | ⏳ Pending | | |

**Approval Gate**: Test AMA chat, confirm streaming + persistence works.