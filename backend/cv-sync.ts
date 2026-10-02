import { Document } from 'langchain';
import { Topic } from '@/backend/shared/types';
import { fetchResume } from './google-drive';
import { parseCvWithLlm } from './cv-parser';
import * as mongodb from '@/backend/shared/mongodb';
import { vectorStore } from '@/backend/shared/vector';
import logger from '@/backend/shared/logger';

export interface SyncResult {
  success: boolean;
  experienceCount: number;
  skillsCategories: number;
  error?: string;
}

function createSummaryChunk(summary: { location: string; summary: string; workPreferences: string }): Document {
  return new Document({
    pageContent: `Location: ${summary.location}
Summary: ${summary.summary}
Work Preferences: ${summary.workPreferences}`,
    metadata: {
      tags: [Topic.GeneralInfo],
      source: 'resume summary section',
    },
    id: 'resume-summary',
  });
}

function createContactChunk(contact: { email: string; linkedin: string; github?: string | null }): Document {
  return new Document({
    pageContent: `Email: ${contact.email}
LinkedIn: ${contact.linkedin}`,
    metadata: {
      tags: [Topic.Contact],
      source: 'resume contact section',
    },
    id: 'resume-contact',
  });
}

function createExperienceChunks(experience: Array<{ role: string; company: string; duration: string; location?: string | null; type?: string | null; bullets: string[] }>): Document[] {
  return experience.map((exp, i) => new Document({
    pageContent: `Role: ${exp.role}
Company: ${exp.company}
Duration: ${exp.duration}
Location: ${exp.location ?? ''}
Type: ${exp.type ?? ''}

Details:
${exp.bullets.map(b => `• ${b}`).join('\n')}`,
    metadata: {
      tags: [Topic.WorkExperience, Topic.Achievements],
      source: 'resume work experience section',
    },
    id: `resume-work-${exp.company.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}`,
  }));
}

function createSkillsChunk(skills: { categories: Record<string, string[]> }): Document {
  const content = Object.entries(skills.categories)
    .map(([cat, techs]) => `${cat}: ${techs.join(', ')}`)
    .join('\n');

  return new Document({
    pageContent: content,
    metadata: {
      tags: [Topic.Skills],
      source: 'resume skills section',
    },
    id: 'resume-skills',
  });
}

function createEducationChunks(education: Array<{ degree: string; institution: string; location?: string | null; period?: string | null }>): Document[] {
  return education.map((edu, i) => new Document({
    pageContent: `${edu.degree}
${edu.institution}${edu.location ? `, ${edu.location}` : ''}
${edu.period ?? ''}`.trim(),
    metadata: {
      tags: [Topic.Education],
      source: 'resume education and certifications section',
    },
    id: `resume-education-${i}`,
  }));
}

async function updateVectorStore(parsed: {
  summary: { location: string; summary: string; workPreferences: string };
  contact: { email: string; linkedin: string; github?: string | null };
  experience: Array<{ role: string; company: string; duration: string; location?: string | null; type?: string | null; bullets: string[] }>;
  skills: { categories: Record<string, string[]> };
  education: Array<{ degree: string; institution: string; location?: string | null; period?: string | null; details?: (string | null)[] }>;
}): Promise<void> {
  const chunks = [
    createSummaryChunk(parsed.summary),
    createContactChunk(parsed.contact),
    ...createExperienceChunks(parsed.experience),
    createSkillsChunk(parsed.skills),
    ...createEducationChunks(parsed.education),
  ];

  // Upsert by ID - addDocuments with same IDs will replace existing vectors
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