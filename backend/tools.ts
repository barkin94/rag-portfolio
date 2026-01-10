import { tool } from 'langchain';
import { z } from 'zod';
import { Document } from 'langchain';

import vectorStore from './vector-store';
import { Topic } from './enums';

// const TOPIC_K_MAP: Record<Topic, number> = {
//   [Topic.GeneralInfo]: 2,
//   [Topic.Contact]: 1,
//   [Topic.Education]: 2,
//   [Topic.Skills]: 4,
//   [Topic.WorkExperience]: 5,
//   [Topic.Projects]: 6,
//   [Topic.Achievements]: 3,
// };

// function kFromTopics(topics?: Topic[]) {
//   if (!topics || topics.length === 0) return 4;

//   return 20;
//   //return Math.max(...topics.map(topic => TOPIC_K_MAP[topic]));
// }

export const getInfoTool = tool(
  async ({ query, topics, subjects }) => {
    const results = await vectorStore.similaritySearch(
      query,
      20, // overfetch and filter later due to MemoryVectorStore limitation
      (doc: Document) => (doc.metadata.tags as string[]).some(tag => {
        return topics?.includes(tag as Topic)
      })
    )

    if (results.length === 0) {
      return "No information found.";
    }

    return results.map(chunk => chunk.pageContent).join("\n\n---\n\n");
  },
  {
    name: 'get_info',
    description: `
      Retrieves information about yourself from the knowledge base.
      
      Use this when you require information about yourself.
    `,
    schema: z.object({
      query: z.string().describe("The full prompt from the user."),
      topics: z.array(z.nativeEnum(Topic)).describe(`
        High-level categories to filter the search. Map the user's intent to one or more of these predefined categories.
      `),
      subjects: z.array(z.string()).describe(`
        Specific entities, technologies, or keywords mentioned in the prompt (e.g., 'React', 'University of Toronto', 'AWS').
      `),
    })
  }
);
