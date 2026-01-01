// import { tool } from 'langchain';
// import { z } from 'zod';
// import { Category, EducationChunkType, InfoChunkType, vectorStore, WorkExperienceChunkType } from './vector-store';

// const getInfoTool = tool(async ({ query, chunkType }) => {
//   const results = await vectorStore.similaritySearch(
//     query,
//     3,
//     (doc) => doc.metadata.category === Category.INFO
//       && chunkType.includes(doc.metadata.chunkType)
//   );
  
//   if (results.length = 0) {
//     return "No general information found.";
//   }
  
//   return results.map(chunk => chunk.pageContent).join("\n\n---\n\n");
// }, {
//   name: 'get_info',
//   description: `Use this to recall general information about yourself - contact details (email, LinkedIn, location), your professional summary, expertise, and background.
//   Use when asked about: your contact information, email, LinkedIn, location, or when someone asks you to tell them about yourself or your background.`,
//   schema: z.object({
//     //chunkTypeSet: z.set(z.nativeEnum(InfoChunkType)).describe(`Set of info chunk types to retrieve.`), 
//     chunkType: z.array(z.nativeEnum(InfoChunkType)).describe(`Type of info chunk to retrieve.`),
//     query: z.string().describe("What the person is asking about regarding your general information, contact details, or background")
//   })
// });

// const getWorkExperienceTool = tool(async ({ query, companyNameLoweredCase, chunkType }) => {  
//   const results = await vectorStore.similaritySearch(
//       query,
//       6, // Get more results to filter and deduplicate
//       (doc) => {
//         let cond = doc.metadata.category === Category.WORK_EXPERIENCE
//           && chunkType.includes(doc.metadata.chunkType)

//         if (companyNameLoweredCase) {
//           cond = cond && doc.metadata.company === companyNameLoweredCase;
//         }

//         return cond;
//       }
//     );
  
//   if (results.length === 0) {
//     return "No work experience information found.";
//   }
  
//   return results.map(chunk => chunk.pageContent).join("\n\n---\n\n")
// }, {
//   name: 'get_work_experience',
//   description: `Use this to recall your work history - past jobs, companies you worked at, your roles, projects you worked on, technologies you've used, and your career progression.
//   Use when asked about: your work experience, past jobs, companies, specific roles, projects, technologies you know, or your career history.`,
//   schema: z.object({
//     query: z.string().describe("What the person is asking about regarding your work experience, past roles, companies, projects, or technologies"),
//     companyNameLoweredCase: z.string().optional().describe("Specifically asked company name in lower case. If not specifically asked, should be undefined."),
//     chunkType: z.array(z.nativeEnum(WorkExperienceChunkType)).describe(`Type of info chunk to retrieve.`),
//   })
// });

// const getEducationTool = tool(async ({ query, chunkType }) => {  
//   const results = await vectorStore.similaritySearch(
//       query,
//       4, // Get more results
//       (doc) => doc.metadata.category === Category.EDUCATION
//         && chunkType.includes(doc.metadata.chunkType)
//     );
//   if (results.length === 0) {
//     return "No education information found.";
//   }
  
//   return results.map(chunk => chunk.pageContent).join("\n\n---\n\n");
// }, {
//   name: 'get_education',
//   description: `Use this to recall your education - degrees, universities you attended, certifications, courses, or your academic background.
//   Use when asked about: where you studied, your education, your degree, certifications, where you went to school, or your academic background.`,
//   schema: z.object({
//     query: z.string().describe("What the person is asking about regarding your education, degrees, universities, or certifications"),
//     chunkType: z.array(z.nativeEnum(EducationChunkType)).describe(`Type of info chunk to retrieve.`),
//   })
// });

// export default {
//   getInfoTool,
//   getWorkExperienceTool,
//   getEducationTool
// }



import { tool } from 'langchain';
import { z } from 'zod';
import { vectorStore } from './vector-store';


// ============================================
// SIMPLIFIED SECTION TYPES
// ============================================

enum Section {
  OVERVIEW = 'overview',
  WORK = 'work',
  SKILLS = 'skills',
  EDUCATION = 'education',
  ACHIEVEMENTS = 'achievements'
}

// ============================================
// TOOL 1: GET GENERAL INFO
// ============================================

export const getInfoTool = () => tool(
  async ({ query, includeContact }) => {
    const results = await vectorStore.similaritySearch(
      query,
      3,
      (doc) => {
        // Always include overview section
        if (doc.metadata.section === Section.OVERVIEW) return true;
        
        // Optionally include contact info
        if (includeContact && doc.metadata.topics?.includes('contact')) return true;
        
        return false;
      }
    );

    if (results.length === 0) {
      return "No information found.";
    }
    return results.map(chunk => chunk.pageContent).join("\n\n---\n\n");
  },
  {
    name: 'get_info',
    description: `
    Retrieves general information about Barkin - professional summary, background, expertise, and contact details.
    
    Use when asked about:
    - "Tell me about yourself"
    - Professional background or summary
    - Contact information (email, LinkedIn, location)
    - Work preferences or availability
    - General introduction
    `,
    schema: z.object({
      query: z.string().describe("What the person is asking about general information or background"),
      includeContact: z.boolean().default(false).describe("Set to true if specifically asking for contact information (email, LinkedIn, location)"),
    })
  }
);

// ============================================
// TOOL 2: GET WORK EXPERIENCE
// ============================================

export const getWorkExperienceTool = () => tool(
  async ({ query, company }) => {
    const results = await vectorStore.similaritySearch(
      query,
      company ? 2 : 4, // Fewer results if filtering by company
      (doc) => {
        if (doc.metadata.section !== Section.WORK) return false;
        
        // Filter by company if specified
        if (company && doc.metadata.company) {
          return doc.metadata.company.toLowerCase().includes(company.toLowerCase());
        }
        
        return true;
      }
    );

    if (results.length === 0) {
      return "No information found.";
    }
    return results.map(chunk => chunk.pageContent).join("\n\n---\n\n");
  },
  {
    name: 'get_work_experience',
    description: `
    Retrieves work experience and career history - past jobs, companies, roles, projects, technologies used, and achievements.
    
    Use when asked about:
    - Work history or career progression
    - Specific companies or roles
    - Projects worked on
    - Technologies and tools used professionally
    - Job responsibilities and achievements
    - Experience with specific tech stacks
    `,
    schema: z.object({
      query: z.string().describe("What the person is asking about work experience, roles, companies, projects, or technologies"),
      company: z.string().optional().describe("Specific company name if asking about a particular employer (e.g., 'Getir', 'Cubicl')"),      
    })
  }
);

// ============================================
// TOOL 3: GET TECHNICAL SKILLS
// ============================================

export const getTechnicalSkillsTool = () => tool(
  async ({ query }) => {
    const results = await vectorStore.similaritySearch(
      query,
      2,
      (doc) => doc.metadata.section === Section.SKILLS
    );

    if (results.length === 0) {
      return "No information found.";
    }
    return results.map(chunk => chunk.pageContent).join("\n\n---\n\n");
  },
  {
    name: 'get_technical_skills',
    description: `
    Retrieves technical skills, technologies, programming languages, frameworks, and tools expertise.
        
    Use when asked about:
    - Technical skills or stack
    - Programming languages known
    - Frameworks and libraries
    - Databases and infrastructure
    - DevOps tools
    - Specific technology expertise
    `,
    schema: z.object({
      query: z.string().describe("What the person is asking about technical skills, technologies, or tools"),
    })
  }
);

// ============================================
// TOOL 4: GET EDUCATION
// ============================================

export const getEducationTool = () => tool(
  async ({ query }) => {
    const results = await vectorStore.similaritySearch(
      query,
      2,
      (doc) => doc.metadata.section === Section.EDUCATION
    );

    if (results.length === 0) {
      return "No information found.";
    }
    return results.map(chunk => chunk.pageContent).join("\n\n---\n\n");
  },
  {
    name: 'get_education',
    description: `
    Retrieves education background - degrees, universities, certifications, and academic achievements.
    
    Use when asked about:
    - Education or academic background
    - University or college attended
    - Degree obtained
    - Certifications or courses
    - Where studied

    `,
    schema: z.object({
      query: z.string().describe("What the person is asking about education, degrees, universities, or certifications"),
    })
  }
);

// ============================================
// TOOL 5: GET ACHIEVEMENTS
// ============================================

export const getAchievementsTool = () => tool(
  async ({ query }) => {
    const results = await vectorStore.similaritySearch(
      query,
      2,
      (doc) => doc.metadata.section === Section.ACHIEVEMENTS
    );

    if (results.length === 0) {
      return "No information found.";
    }
    return results.map(chunk => chunk.pageContent).join("\n\n---\n\n");
  },
  {
    name: 'get_achievements',
    description: `
    Retrieves notable achievements, project highlights, and significant contributions.
        
    Use when asked about:
    - Notable achievements or accomplishments
    - Project highlights
    - Performance improvements made
    - Impact and results delivered
    - Success stories
    `,
    schema: z.object({
      query: z.string().describe("What the person is asking about achievements, accomplishments, or impact"),
    })
  }
);

// ============================================
// TOOL FACTORY & EXPORT
// ============================================

/**
 * Creates all tools with the given vector store
 */
export function createRAGTools() {
  return {
    getInfoTool: getInfoTool(),
    getWorkExperienceTool: getWorkExperienceTool(),
    getTechnicalSkillsTool: getTechnicalSkillsTool(),
    getEducationTool: getEducationTool(),
    getAchievementsTool: getAchievementsTool()
  };
}

/**
 * Get all tools as an array (useful for LangChain agent)
 */
export function getToolsArray() {
  const tools = createRAGTools();
  return Object.values(tools);
}