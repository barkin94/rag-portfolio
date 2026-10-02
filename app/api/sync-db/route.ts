import { Document } from 'langchain';
import { Topic } from '@/backend/shared/types';
import portfolioChunks from '@/backend/data-chunks/portfolio';
import interviewQnAChunks from '@/backend/data-chunks/interview-QnA';
import behavioralStoryChunks from '@/backend/data-chunks/behavioral-stories';
import * as mongodb from '@/backend/shared/mongodb';
import { vectorStore } from '@/backend/shared/vector';
import logger from '@/backend/shared/logger';

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

export async function PUT() {
  const resume = await mongodb.getResume();

  if (!resume) {
    return new Response('No CV data found in database', { status: 500 });
  }

  const resumeChunks = [
    createSummaryChunk(resume.summary),
    createContactChunk(resume.contact),
    ...createExperienceChunks(resume.experience),
    createSkillsChunk(resume.skills),
    ...createEducationChunks(resume.education),
  ];

  const documents = [
    ...resumeChunks,
    ...portfolioChunks,
    ...interviewQnAChunks,
    ...behavioralStoryChunks,
  ];

  try {
    // Upsert by ID - addDocuments with same IDs will replace existing vectors
    await vectorStore.addDocuments(documents);
  } catch (error) {
    logger.error(error, 'Failed to sync database');
    return new Response('Failed to sync database', { status: 500 });
  }

  return new Response('Database synced successfully', { status: 200 });
}