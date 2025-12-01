import { tool } from 'langchain';
import { z } from 'zod';
import { Category, EducationChunkType, InfoChunkType, vectorStore, WorkExperienceChunkType } from './vector-store';

const getInfoTool = tool(async ({ query, chunkType }) => {
  const results = await vectorStore.similaritySearch(
    query,
    3,
    (doc) => doc.metadata.category === Category.INFO
      && chunkType.includes(doc.metadata.chunkType)
  );
  
  if (results.length = 0) {
    return "No general information found.";
  }
  
  return results.map(chunk => chunk.pageContent).join("\n\n---\n\n");
}, {
  name: 'get_info',
  description: `Use this to recall general information about yourself - contact details (email, LinkedIn, location), your professional summary, expertise, and background.
  Use when asked about: your contact information, email, LinkedIn, location, or when someone asks you to tell them about yourself or your background.`,
  schema: z.object({
    //chunkTypeSet: z.set(z.nativeEnum(InfoChunkType)).describe(`Set of info chunk types to retrieve.`), 
    chunkType: z.array(z.nativeEnum(InfoChunkType)).describe(`Type of info chunk to retrieve.`),
    query: z.string().describe("What the person is asking about regarding your general information, contact details, or background")
  })
});

const getWorkExperienceTool = tool(async ({ query, companyNameLoweredCase, chunkType }) => {  
  const results = await vectorStore.similaritySearch(
      query,
      6, // Get more results to filter and deduplicate
      (doc) => {
        let cond = doc.metadata.category === Category.WORK_EXPERIENCE
          && chunkType.includes(doc.metadata.chunkType)

        if (companyNameLoweredCase) {
          cond = cond && doc.metadata.company === companyNameLoweredCase;
        }

        return cond;
      }
    );
  
  if (results.length === 0) {
    return "No work experience information found.";
  }
  
  return results.map(chunk => chunk.pageContent).join("\n\n---\n\n")
}, {
  name: 'get_work_experience',
  description: `Use this to recall your work history - past jobs, companies you worked at, your roles, projects you worked on, technologies you've used, and your career progression.
  Use when asked about: your work experience, past jobs, companies, specific roles, projects, technologies you know, or your career history.`,
  schema: z.object({
    query: z.string().describe("What the person is asking about regarding your work experience, past roles, companies, projects, or technologies"),
    companyNameLoweredCase: z.string().optional().describe("Specifically asked company name in lower case. If not specifically asked, should be undefined."),
    chunkType: z.array(z.nativeEnum(WorkExperienceChunkType)).describe(`Type of info chunk to retrieve.`),
  })
});

const getEducationTool = tool(async ({ query, chunkType }) => {  
  const results = await vectorStore.similaritySearch(
      query,
      4, // Get more results
      (doc) => doc.metadata.category === Category.EDUCATION
        && chunkType.includes(doc.metadata.chunkType)
    );
  if (results.length === 0) {
    return "No education information found.";
  }
  
  return results.map(chunk => chunk.pageContent).join("\n\n---\n\n");
}, {
  name: 'get_education',
  description: `Use this to recall your education - degrees, universities you attended, certifications, courses, or your academic background.
  Use when asked about: where you studied, your education, your degree, certifications, where you went to school, or your academic background.`,
  schema: z.object({
    query: z.string().describe("What the person is asking about regarding your education, degrees, universities, or certifications"),
    chunkType: z.array(z.nativeEnum(EducationChunkType)).describe(`Type of info chunk to retrieve.`),
  })
});

export default {
  getInfoTool,
  getWorkExperienceTool,
  getEducationTool
}