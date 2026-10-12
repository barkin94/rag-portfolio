# Phase 3: Retrieval Eval Set

**Goal**: 25 labeled queries with chunk IDs + eval script for measuring vector search recall@6

---

## Steps

| Step | Action | Status | Files Created | Files Modified |
|------|--------|--------|---------------|----------------|
| 3.1 | Create `backend/eval/` directory | ⏳ Pending | `backend/eval/` | - |
| 3.2 | Create `retrieval-eval.ts` with 25 labeled queries | ⏳ Pending | `backend/eval/retrieval-eval.ts` | - |
| 3.3 | Create `run-eval.ts` (single run, no alpha sweep) | ⏳ Pending | `backend/eval/run-eval.ts` | - |
| 3.4 | **Verify**: Script runs, outputs recall@6 | ⏳ Pending | | |

---

## Implementation Details

### `backend/eval/retrieval-eval.ts`

```typescript
export const retrievalEvalSet = [
  { query: "What is Barkin's email?", relevantChunkIds: ["resume-contact"] },
  { query: "What is Barkin's location?", relevantChunkIds: ["resume-summary"] },
  { query: "Tell me about the Getir caching bug", relevantChunkIds: ["interview-performance-bottleneck", "story-getir-microservice-scaling"] },
  { query: "How did you implement rate limiting?", relevantChunkIds: ["interview-typescript-backend"] },
  { query: "What's your experience with TypeScript?", relevantChunkIds: ["interview-typescript-backend", "resume-skills"] },
  { query: "Describe the BFF pattern you built at Getir", relevantChunkIds: ["story-getir-bff-pattern"] },
  { query: "What projects have you worked on?", relevantChunkIds: ["rag-portfolio-overview", "rag-portfolio-features", "rag-portfolio-tech-stack", "rag-portfolio-rag-implementation", "rag-portfolio-architecture-decisions"] },
  { query: "What is your tech stack?", relevantChunkIds: ["resume-skills", "rag-portfolio-tech-stack"] },
  { query: "What are your achievements at Getir?", relevantChunkIds: ["interview-performance-bottleneck", "interview-aws-environment", "interview-postgresql-bigquery", "story-getir-microservice-scaling", "story-getir-data-pipeline-ai-search", "story-getir-bff-pattern", "story-getir-component-library", "story-getir-testing-refactor"] },
  { query: "Tell me about the Mockoon self-service tool", relevantChunkIds: ["interview-mockoon-self-service"] },
  { query: "What was the AWS environment at Getir?", relevantChunkIds: ["interview-aws-environment"] },
  { query: "How did you optimize the product listing service?", relevantChunkIds: ["interview-performance-bottleneck"] },
  { query: "What is your experience with BigQuery?", relevantChunkIds: ["interview-postgresql-bigquery"] },
  { query: "Describe the cost optimization at Cubicl", relevantChunkIds: ["story-cubicl-cost-optimization"] },
  { query: "What is your education background?", relevantChunkIds: ["resume-education-0", "resume-education-1", "resume-education-2"] },
  { query: "How did you build the data pipeline at Getir?", relevantChunkIds: ["story-getir-data-pipeline-ai-search"] },
  { query: "What microservices did you scale at Getir?", relevantChunkIds: ["story-getir-microservice-scaling"] },
  { query: "Tell me about the component library you built", relevantChunkIds: ["story-getir-component-library"] },
  { query: "How did you improve testing at Getir?", relevantChunkIds: ["story-getir-testing-refactor"] },
  { query: "What is your work preference?", relevantChunkIds: ["resume-summary"] },
  { query: "What is your LinkedIn?", relevantChunkIds: ["resume-contact"] },
  { query: "Describe the event aggregation service", relevantChunkIds: ["interview-typescript-backend"] },
  { query: "What frontend experience do you have?", relevantChunkIds: ["interview-frontend-collaboration", "resume-skills"] },
  { query: "How did you handle cloud-native environments?", relevantChunkIds: ["interview-cloud-native-containerization"] },
];
```

### `backend/eval/run-eval.ts`

```typescript
import { retrievalEvalSet } from './retrieval-eval';
import { findChunks } from '@/backend/shared/repositories/chunk';

async function runEval() {
  let totalRecall = 0;
  for (const { query, relevantChunkIds } of retrievalEvalSet) {
    const results = await findChunks(query, { k: 6 });
    const found = results.filter(r => relevantChunkIds.includes(r._id)).length;
    totalRecall += found / relevantChunkIds.length;
  }
  console.log(`recall@6 = ${(totalRecall / retrievalEvalSet.length * 100).toFixed(1)}%`);
}

main().catch(console.error);
```

**Note**: Uses `findChunks()` from chunk repository (pure vector search via `similaritySearch()`). Returns `ChunkResult[]` with `_id` field (not `id`).

---

## Verification

```bash
# Run eval
npx tsx backend/eval/run-eval.ts

# Expected output:
# recall@6 = XX.X%
```

**Approval Gate**: Script runs without errors, outputs recall@6 for vector search. Baseline established for future retrieval improvements.