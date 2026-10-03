# Execution Workflow

## Execution Model

When working through phased plans in `docs/<plan-name>/`:

1. Complete one step in the phase file
2. Update that step's Status to ✅ Done in `phase-N.md`
3. Move to next step
4. When all steps in a phase are complete:
   - Update phase Status to ✅ Complete in `PLAN.md`
   - Update Approval to ✅ in `PLAN.md`
   - Commit (approval gate passed)

## Status Tracking

| File | Tracks |
|------|--------|
| `PLAN.md` | Phase status (✅ Complete, 🔄 In Progress, ⏳ Pending) + Approval |
| `phase-N.md` | Step status (✅ Done, 🔄 In Progress, ⏳ Pending) per step |