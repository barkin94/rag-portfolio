import { tool } from 'langchain';
import { z } from 'zod';
import { vectorStore } from './vector-store';

// Helper function to expand queries for better retrieval
const expandQuery = (query: string, context: string): string[] => {
  const baseQuery = query.toLowerCase();
  const expansions: string[] = [query]; // Always include original
  
  // Add common variations
  if (context === 'info') {
    
    if (baseQuery.includes('contact') || baseQuery.includes('email') || baseQuery.includes('linkedin')) {
      expansions.push('contact information email linkedin');
    }
    if (baseQuery.includes('summary') || baseQuery.includes('about') || baseQuery.includes('overview')) {
      expansions.push('summary professional background expertise');
    }
    if (baseQuery.includes('location') || baseQuery.includes('where')) {
      expansions.push('location address');
    }
  } else if (context === 'work_experience') {
    if (baseQuery.includes('technology') || baseQuery.includes('tech') || baseQuery.includes('stack')) {
      expansions.push('technologies skills programming languages');
    }
    if (baseQuery.includes('company') || baseQuery.includes('work')) {
      expansions.push('companies employers jobs roles');
    }
    if (baseQuery.includes('project')) {
      expansions.push('projects achievements accomplishments');
    }
  } else if (context === 'education') {
    if (baseQuery.includes('degree') || baseQuery.includes('university')) {
      expansions.push('degrees universities education academic');
    }
    if (baseQuery.includes('certificate') || baseQuery.includes('certification')) {
      expansions.push('certificates certifications courses');
    }
  }
  
  return expansions;
};

const getInfoTool = tool(async ({ query }) => {
  // Try multiple query variations for better retrieval
  const queryVariations = expandQuery(query, 'info');
  const allResults: Set<string> = new Set();
  
  for (const q of queryVariations.slice(0, 2)) { // Limit to avoid too many searches
    const results = await vectorStore.similaritySearch(
      q,
      3,
      (doc) => doc.metadata.category === 'info'
    );
    
    results.forEach(doc => {
      if (doc.pageContent) {
        allResults.add(doc.pageContent);
      }
    });
  }
  
  if (allResults.size === 0) {
    return "No general information found.";
  }
  
  // Return all unique results, prioritizing contact info if query is about contact
  const resultsArray = Array.from(allResults);
  const queryLower = query.toLowerCase();
  
  // Reorder based on relevance
  if (queryLower.includes('contact') || queryLower.includes('email') || queryLower.includes('linkedin')) {
    resultsArray.sort((a, b) => {
      const aIsContact = a.includes('E-MAIL') || a.includes('LINKEDIN');
      const bIsContact = b.includes('E-MAIL') || b.includes('LINKEDIN');
      if (aIsContact && !bIsContact) return -1;
      if (!aIsContact && bIsContact) return 1;
      return 0;
    });
  }
  
  return resultsArray.join("\n\n");
}, {
  name: 'get_info',
  description: `Use this to recall general information about yourself - contact details (email, LinkedIn, location), your professional summary, expertise, and background.
  Use when asked about: your contact information, email, LinkedIn, location, or when someone asks you to tell them about yourself or your background.`,
  schema: z.object({
    query: z.string().describe("What the person is asking about regarding your general information, contact details, or background")
  })
});

const getWorkExperienceTool = tool(async ({ query }) => {
  // Expand query for better retrieval
  const queryVariations = expandQuery(query, 'work_experience');
  const allResults: Map<string, { doc: any; score: number }> = new Map();
  
  // Try original query and one variation
  for (const q of queryVariations.slice(0, 2)) {
    const results = await vectorStore.similaritySearch(
      q,
      6, // Get more results to filter and deduplicate
      (doc) => doc.metadata.category === 'work_experience'
    );
    
    results.forEach((doc, index) => {
      const key = doc.pageContent.substring(0, 100); // Use first 100 chars as key for deduplication
      if (!allResults.has(key) || allResults.get(key)!.score > index) {
        allResults.set(key, { doc, score: index });
      }
    });
  }
  
  if (allResults.size === 0) {
    return "No work experience information found.";
  }
  
  // Sort results: prioritize full chunks, then by company/role relevance
  const sortedResults = Array.from(allResults.values())
    .map(item => item.doc)
    .sort((a, b) => {
      // Prioritize full chunks over achievement chunks
      const aIsFull = a.metadata.chunkType === 'full';
      const bIsFull = b.metadata.chunkType === 'full';
      if (aIsFull && !bIsFull) return -1;
      if (!aIsFull && bIsFull) return 1;
      
      // If query mentions a company, prioritize that company
      const queryLower = query.toLowerCase();
      const aCompany = a.metadata.company?.toLowerCase() || '';
      const bCompany = b.metadata.company?.toLowerCase() || '';
      if (queryLower.includes(aCompany) && !queryLower.includes(bCompany)) return -1;
      if (!queryLower.includes(aCompany) && queryLower.includes(bCompany)) return 1;
      
      return 0;
    })
    .slice(0, 5); // Limit to top 5 most relevant
  
  // Deduplicate and format results
  const seen = new Set<string>();
  const uniqueResults: string[] = [];
  
  for (const doc of sortedResults) {
    const content = doc.pageContent;
    if (!seen.has(content)) {
      seen.add(content);
      uniqueResults.push(content);
    }
  }
  
  return uniqueResults.join("\n\n---\n\n");
}, {
  name: 'get_work_experience',
  description: `Use this to recall your work history - past jobs, companies you worked at, your roles, projects you worked on, technologies you've used, and your career progression.
  Use when asked about: your work experience, past jobs, companies, specific roles, projects, technologies you know, or your career history.`,
  schema: z.object({
    query: z.string().describe("What the person is asking about regarding your work experience, past roles, companies, projects, or technologies")
  })
});

const getEducationTool = tool(async ({ query }) => {
  // Expand query for better retrieval
  const queryVariations = expandQuery(query, 'education');
  const allResults: Set<string> = new Set();
  
  for (const q of queryVariations.slice(0, 2)) {
    const results = await vectorStore.similaritySearch(
      q,
      4, // Get more results
      (doc) => doc.metadata.category === 'education'
    );
    
    results.forEach(doc => {
      if (doc.pageContent) {
        allResults.add(doc.pageContent);
      }
    });
  }
  
  if (allResults.size === 0) {
    return "No education information found.";
  }
  
  // Prioritize full education chunk if available, then degrees, then certificates
  const resultsArray = Array.from(allResults);
  const queryLower = query.toLowerCase();
  
  // Reorder based on query intent
  if (queryLower.includes('degree') || queryLower.includes('university') || queryLower.includes('study')) {
    resultsArray.sort((a, b) => {
      const aIsDegree = a.includes('DEGREE:') || a.includes('EDUCATION:');
      const bIsDegree = b.includes('DEGREE:') || b.includes('EDUCATION:');
      if (aIsDegree && !bIsDegree) return -1;
      if (!aIsDegree && bIsDegree) return 1;
      return 0;
    });
  } else if (queryLower.includes('certificate') || queryLower.includes('certification')) {
    resultsArray.sort((a, b) => {
      const aIsCert = a.includes('CERTIFICATE:');
      const bIsCert = b.includes('CERTIFICATE:');
      if (aIsCert && !bIsCert) return -1;
      if (!aIsCert && bIsCert) return 1;
      return 0;
    });
  } else {
    // Default: prioritize full chunk
    resultsArray.sort((a, b) => {
      const aIsFull = a.includes('EDUCATION:') && a.includes('CERTIFICATES:');
      const bIsFull = b.includes('EDUCATION:') && b.includes('CERTIFICATES:');
      if (aIsFull && !bIsFull) return -1;
      if (!aIsFull && bIsFull) return 1;
      return 0;
    });
  }
  
  return resultsArray.join("\n\n---\n\n");
}, {
  name: 'get_education',
  description: `Use this to recall your education - degrees, universities you attended, certifications, courses, or your academic background.
  Use when asked about: where you studied, your education, your degree, certifications, where you went to school, or your academic background.`,
  schema: z.object({
    query: z.string().describe("What the person is asking about regarding your education, degrees, universities, or certifications")
  })
});

export default {
  getInfoTool,
  getWorkExperienceTool,
  getEducationTool
}