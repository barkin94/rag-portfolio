import { Document } from 'langchain';
import { FullResume } from './parser';

import { fetchResume } from './google-drive';
import { parseCvWithLlm } from './parser';
import * as mongodb from '@/backend/shared/mongodb';
import { vectorStore } from '@/backend/shared/vector';
import { createSummaryChunk, createContactChunk, createExperienceChunks, createSkillsChunk, createEducationChunks } from './document-builders';
import logger from '@/backend/shared/logger';

export interface SyncResult {
  success: boolean;
  experienceCount: number;
  skillsCategories: number;
  error?: string;
}

async function updateVectorStore(parsed: FullResume): Promise<void> {
  const chunks: Document[] = [
    createSummaryChunk(parsed.summary),
    createContactChunk(parsed.contact),
    ...createExperienceChunks(parsed.experience),
    createSkillsChunk(parsed.skills),
    ...createEducationChunks(parsed.education),
  ];

  await vectorStore.addDocuments(chunks);
  logger.info({ chunkCount: chunks.length }, 'Vector store updated with CV data');
}

export async function syncCv(): Promise<SyncResult> {
  try {
    logger.info('Starting CV sync from Google Docs');

    const rawText = await fetchResume();
    logger.info({ textLength: rawText.length }, 'Fetched Google Doc');

    const parsed = await parseCvWithLlm(rawText);
    logger.info(
      { expCount: parsed.experience.length, skillCats: Object.keys(parsed.skills.categories).length },
      'Parsed CV with LLM'
    );

    await Promise.all([
      mongodb.upsertResume(parsed),
      updateVectorStore(parsed),
    ]);

    const details = `Synced ${parsed.experience.length} roles, ${Object.keys(parsed.skills.categories).length} skill categories`;
    await mongodb.recordSyncStatus('success', details);

    logger.info({ details }, 'CV sync completed successfully');

    return {
      success: true,
      experienceCount: parsed.experience.length,
      skillsCategories: Object.keys(parsed.skills.categories).length,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error({ error }, 'CV sync failed');

    await mongodb.recordSyncStatus('failed', errorMessage);

    return {
      success: false,
      experienceCount: 0,
      skillsCategories: 0,
      error: errorMessage,
    };
  }
}