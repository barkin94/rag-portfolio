import { createAgent, summarizationMiddleware } from 'langchain';
import { ChatOllama } from '@langchain/ollama';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatOpenAI } from "@langchain/openai";
import { MongoDBSaver } from '@langchain/langgraph-checkpoint-mongodb'

import Mongodb from '../mongodb';
import { getInfoTool } from '../tools';
import Config from '../config';
import config from '../config';
import { stateSchema } from './schemas';
import MongoDBCoversationSaver from './middlewares/MongoDBCoversationSaver';

const getModelFromConfig = () => {
  switch(Config.LLM_PROVIDER) {
    case 'gemini':
      return new ChatGoogleGenerativeAI({
        model: Config.GEMINI_MODEL,
        apiKey: Config.GEMINI_API_KEY,
        temperature: Config.GEMINI_TEMPERATURE,
        streamUsage: true,
        maxRetries: 3
      });
    case 'openrouter':
      return new ChatOpenAI(
        {
          model: Config.OPENROUTER_MODEL,
          temperature: Config.OPENROUTER_TEMPERATURE,      
          apiKey: Config.OPENROUTER_API_KEY,
          maxRetries: 3,
          configuration: {
            baseURL: 'https://openrouter.ai/api/v1',
          },
          // verbose: true,
          // cache: false,
        },
        
      );
    case 'ollama':
      return new ChatOllama({
        model: Config.OLLAMA_MODEL,
        temperature: Config.OLLAMA_TEMPERATURE,
        baseUrl: Config.OLLAMA_BASE_URL,
        disableStreaming: false,
      });
    default:
      throw new Error('invalid provider')
  }
};


const agent = createAgent({
  model: getModelFromConfig(),
  checkpointer: new MongoDBSaver({
    client: Mongodb.client,
    dbName: config.MONGODB_DBNAME,
  }),
  stateSchema,
  middleware: [
    summarizationMiddleware({
      model: getModelFromConfig(),
      keep: {
        messages: 4
      }
    }),
    MongoDBCoversationSaver,
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