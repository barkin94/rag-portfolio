import { tool } from 'langchain';
import { z } from 'zod';

import vectorStore from '@/backend/vector-store';
import { Topic } from '@/backend/enums';
import logger from '@/logger';

export const getInfoTool = tool(
  async ({ query, topics, expandingKeywords }) => {
    try {
      const topicFilters = topics.length > 0
        ? topics.map(t => `tags CONTAINS '${t}'`).join(' OR ')
        : undefined;

      const results = await vectorStore.similaritySearch(`${query} ${expandingKeywords}`, 6, topicFilters);

      if (results.length === 0) {
        return "No specific records found for those topics. Try a broader search.";
      }

      return results.map(chunk => {
        const source = chunk.metadata.source ? `[Source: ${chunk.metadata.source}]` : "";
        return `${source}\n${chunk.pageContent}`;
      }).join("\n\n---\n\n");

    } catch (error) {
      logger.error({ error, query }, "Error in getInfoTool");
      return "I encountered an error accessing my knowledge base.";
    }
  },
  {
    name: 'get_info',
    description: `
      Retrieves all facts regarding Barkin's professional life, including work history, tech stack, projects, and contact info.
      Use this whenever a question requires factual data about Barkin that is not in the current chat transcript.`,
    schema: z.object({
      query: z.string().describe("The semantic search string."),
      topics: z.array(z.nativeEnum(Topic)),
      expandingKeywords: z.string().describe(
        "A space-separated list of synonyms, related keywords, or acronyms to improve search recall (e.g., 'React.js javascript frontend web-development UI')."
      ),
    })
  }
);
