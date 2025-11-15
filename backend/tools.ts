import { tool } from 'langchain';
import { vectorStore } from './vector-store';

export const searchUserKnowledgeTool = tool(async (query) => {
    const results = await vectorStore.similaritySearch(query, 3)

    return results.map((doc) => `- ${doc.pageContent}`).join("\n")
}, {
    name: 'search_user_knowledge',
    description: `
        Searches and returns specific sections of a user's resume
        Use this ONLY for questions about the user's own work experience.
    `,
})