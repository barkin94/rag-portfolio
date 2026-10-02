import { z } from 'zod';
import { ChatOpenAI } from "@langchain/openai";

import config from '@/backend/shared/config';
import logger from '@/backend/shared/logger';

const FullResumeSchema = z.object({
  summary: z.object({
    location: z.string(),
    summary: z.string(),
    workPreferences: z.string(),
  }),
  contact: z.object({
    email: z.string().email(),
    linkedin: z.string().url(),
    github: z.string().url().nullable(),
  }),
  experience: z.array(z.object({
    role: z.string(),
    company: z.string(),
    duration: z.string(),
    location: z.string().optional().nullable(),
    type: z.string().optional().nullable(),
    bullets: z.array(z.string()),
  })),
  skills: z.object({
    categories: z.record(z.array(z.string())),
  }),
  education: z.array(z.object({
    degree: z.string(),
    institution: z.string(),
    location: z.string().optional().nullable(),
    period: z.string().optional().nullable(),
  })),
});

type FullResume = z.infer<typeof FullResumeSchema>;

const PARSE_PROMPT = `Extract structured resume data from the text below. Return JSON matching the schema.

Sections to extract:
1. SUMMARY (top): location, summary paragraph, workPreferences paragraph
2. CONTACT (top): email, linkedin, github (optional)
3. EXPERIENCE (starts with "Experience"): role, company, duration, location, type, bullets[]
4. SKILLS (starts with "Skills"): categories object { "Category": ["tech1", "tech2"] }
5. EDUCATION (starts with "Education"): degree, institution, location, period

Rules:
- Contact at top before "Experience"
- Extract all bullet points (•/-/*)
- Duration: "Month Year - Month Year" or "Present"
- Missing location/type → empty string
- Skills: "Category: tech1, tech2"


RESUME TEXT:
{text}`;

function getStructuredLlm() {
  const baseLlm = new ChatOpenAI({
    model: config.RESUME_PARSER_MODEL,
    apiKey: config.RESUME_PARSER_API_KEY,
    maxRetries: config.RESUME_PARSER_MAX_RETRIES,
    timeout: config.RESUME_PARSER_TIMEOUT,
    configuration: {
      baseURL: "https://integrate.api.nvidia.com/v1",
    },
  });

  return baseLlm.withStructuredOutput(FullResumeSchema);
}

export async function parseCvWithLlm(rawText: string): Promise<FullResume> {
  try {
    const prompt = PARSE_PROMPT.replace('{text}', rawText);
    const result = await getStructuredLlm().invoke(prompt);
    return result as FullResume;
  } catch (error) {
    logger.error({ error, textLength: rawText.length }, 'LLM CV parsing failed');
    throw new Error(`CV parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}