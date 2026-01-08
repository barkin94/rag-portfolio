import { tool } from 'langchain';
import { z } from 'zod';
import vectorStore from './vector-store';

// ============================================
// SIMPLIFIED SECTION TYPES
// ============================================

enum Section {
  OVERVIEW = 'overview',
  WORK = 'work',
  SKILLS = 'skills',
  EDUCATION = 'education',
  ACHIEVEMENTS = 'achievements',
  PROJECTS = 'projects'
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Checks if any of the provided technologies match technologies in the document's metadata.
 * Checks both the technologies array and topics array for flexible matching.
 * Returns true if any provided technology matches, or if no technologies are provided.
 */
const matchesTechnologies = (
  doc: { metadata: Record<string, any> },
  technologies: string[]
): boolean => {
  // Check if any of the provided technologies match
  return technologies.some((technology) => {
    const techLower = technology.toLowerCase();

    return doc.metadata.technologies.some((tech: string) =>
      tech.toLowerCase().includes(techLower)
    )
  });
};

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
// TOOL 6: GET PROJECTS
// ============================================

export const getProjectsTool = () => tool(
  async ({ query, projectName, technologies }) => {
    const results = await vectorStore.similaritySearch(
      query,
      projectName ? 2 : 4,
      (doc) => {
        if (doc.metadata.section !== Section.PROJECTS) return false;
        
        // Filter by project name if specified
        if (projectName && doc.metadata.projectName) {
          return doc.metadata.projectName.toLowerCase().includes(projectName.toLowerCase());
        }
        
        // Filter by technologies if specified
        if (technologies.length > 0) {
          return technologies.some((technology) => {
            const techLower = technology.toLowerCase();
        
            return doc.metadata.technologies.some((tech: string) =>
              tech.toLowerCase().includes(techLower)
            )
          });
        }
        
        return true;
      }
    );

    if (results.length === 0) {
      return "No project information found.";
    }
    return results.map(chunk => chunk.pageContent).join("\n\n---\n\n");
  },
  {
    name: 'get_projects',
    description: `
    Retrieves information about portfolio projects, personal projects, and side projects.
    
    Use when asked about:
    - Portfolio projects or personal projects
    - Side projects or hobby projects
    - Projects built outside of work
    - Open source contributions
    - Project details, features, or architecture
    - Technologies used in specific projects
    - The RAG portfolio website itself
    `,
    schema: z.object({
      query: z.string().describe("What the person is asking about projects, features, or implementations"),
      projectName: z.string().optional().describe("Specific project name if asking about a particular project (e.g., 'rag-portfolio', 'rag portfolio')"),
      technologies: z.array(z.string()).describe("Array of technologies to filter by (e.g., ['React', 'Next.js'], ['RAG', 'LangChain'])"),
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
    getAchievementsTool: getAchievementsTool(),
    getProjectsTool: getProjectsTool()
  };
}

/**
 * Get all tools as an array (useful for LangChain agent)
 */
export function getTools() {
  const tools = createRAGTools();
  return Object.values(tools);
}