---
name: data-chunks
description: Structured data chunks powering the RAG system: resume (work, skills, education), portfolio projects, interview Q&A, behavioral stories, Topic enum categorization, and vector store sync. Use when adding/editing content or changing retrieval.
---

# Data Chunks Skill

This skill provides context for the portfolio data chunks.

## Queries

- Add resume section: "Find resume chunks with Topic WorkExperience Skills Education Document metadata"
- Add portfolio project: "Find portfolio project chunks with Projects Topic"
- Add interview Q&A: "Find interview Q&A chunks with Topic"
- Add behavioral story: "Find behavioral story chunks with Topic"
- Change topic filtering: "Trace getInfoTool Topic filter in vector store similarity search"
- Re-sync vector store: "Find sync-db route with indexWithEmbeddings for all chunk types"

## Key Files

- `backend/data-chunks/resume.ts` - Professional info with Topic tags
- `backend/data-chunks/portfolio.ts` - Project information
- `backend/data-chunks/interview-QnA.ts` - Interview questions/answers
- `backend/data-chunks/behavioral-stories.ts` - Behavioral interview stories
- `backend/enums.ts` - Topic enum (GeneralInfo, Contact, WorkExperience, Skills, Education, Projects, Achievements)
- `backend/tools.ts` - getInfoTool uses Topic for filtering
- `backend/vector-store.ts` - indexWithEmbeddings() syncs chunks
- `app/api/sync-db/route.ts` - PUT endpoint to re-sync all chunks