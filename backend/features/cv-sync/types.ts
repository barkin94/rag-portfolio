export type CvData = {
  _id: 'current';
  summary: CvSummary;
  contact: CvContact;
  experience: CvExperience[];
  skills: CvSkills;
  education: CvEducation[];
  updatedAt: Date;
};

export type SyncStatusDoc = {
  _id: 'current';
  status: 'success' | 'failed' | 'pending';
  timestamp: Date;
  details: string;
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