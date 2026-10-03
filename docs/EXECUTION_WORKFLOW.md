# Execution Workflow

## Execution Model

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
