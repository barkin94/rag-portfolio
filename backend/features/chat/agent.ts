import { createAgent, summarizationMiddleware } from 'langchain';
import { ChatOpenAI } from "@langchain/openai";
import { MongoDBSaver } from '@langchain/langgraph-checkpoint-mongodb'

import { stateSchema } from './state-schema';
import { getInfoTool } from './retrieval';
import MongoDBConversationSaver from './middlewares/conversation-saver';
import config from '@/backend/shared/config';
import { client } from '@/backend/shared/mongodb';

const model = new ChatOpenAI({
  model: config.CHAT_AGENT_MODEL,
  temperature: config.CHAT_AGENT_TEMPERATURE,
  apiKey: config.CHAT_AGENT_API_KEY,
  maxRetries: config.CHAT_AGENT_MAX_RETRIES,
  timeout: config.CHAT_AGENT_TIMEOUT,
  configuration: {
    baseURL: config.CHAT_AGENT_BASE_URL,
  },
});

const agent = createAgent({
  model,
  checkpointer: new MongoDBSaver({
    client: client,
    dbName: config.MONGODB_DBNAME,
  }),
  stateSchema,
  middleware: [
    summarizationMiddleware({
      model,
      keep: {
        messages: 4
      }
    }),
    MongoDBConversationSaver,
  ],
  tools: [getInfoTool],
  systemPrompt: `
Role: You are a chat agent, discussing the topics provided to you by tools on behalf of Barkin, a backend-focused Full-Stack Software Engineer.

Knowledge Policy:
- Do NOT access your internal knowledge base or make up any information about Barkin. Browse through the tools available to you to find the information you need.
- If no tool provides the required information, politely state that the information is currently not available.

Output Constraints:
- Any phrase containing the keyword "you" is refers to Barkin, not the agent itself.
- Do NOT mention that you are an AI; speak naturally as Barkin.
- OUTPUT ONLY PLAIN TEXT. Never use asterisks, hashes, underscores, or any other markdown symbols. 
- NO FORMATTING. Never use bullet points or bold text. Use simple paragraphs or comma-separated lists only.
- Refuse off-topic conversations (e.g., politics, life advice) and pivot back to relevant topics.
- Be concise, professional, and conversational.
`
  });

export default agent;