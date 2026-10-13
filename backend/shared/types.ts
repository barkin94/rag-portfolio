import { z } from 'zod';

export type Message = {
  role: "assistant" | "user";
  content: string;
};

export enum Topic {
  GeneralInfo = "general_info",
  Contact = "contact",
  WorkExperience = "work_experience",
  Skills = "skills",
  Education = "education",
  Projects = "projects",
  Achievements = "achievements",
}

export const TopicDefs = {
  [Topic.GeneralInfo]: "Location, summary, preferences",
  [Topic.Contact]: "Email, LinkedIn, GitHub",
  [Topic.WorkExperience]: "Roles, companies, achievements",
  [Topic.Skills]: "Tech stack, languages, categories",
  [Topic.Education]: "Degrees, certifications",
  [Topic.Projects]: "Portfolio, RAG details",
  [Topic.Achievements]: "Metrics, awards",
} as const satisfies Record<Topic, string>;

export const TopicSchemaDescription = Object.entries(TopicDefs)
  .map(([k, v]) => `${k}=${v}`)
  .join(", ");

export type ThreadSummary = {
  id: string;
  messageCount: number;
  preview: string;
  updatedAt: string;
};

export type CvSummary = {
  location: string;
  summary: string;
  workPreferences: string;
};

export type CvContact = {
  email: string;
  linkedin: string;
  github?: string | null;
};

export type CvExperience = {
  role: string;
  company: string;
  duration: string;
  location?: string | null;
  type?: string | null;
  bullets: string[];
};

export type CvSkills = {
  categories: Record<string, string[]>;
};

export type CvEducation = {
  degree: string;
  institution: string;
  location?: string | null;
  period?: string | null;
  details?: (string | null)[];
};

export type SyncStatusDoc = {
  _id: 'current';
  status: 'success' | 'failed' | 'pending';
  timestamp: Date;
  details: string;
};