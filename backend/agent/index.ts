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
import TGSenderMiddleware from './middlewares/TGSenderMiddleware';
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
    ...config.ENABLE_TG_SENDER ? [TGSenderMiddleware] : [],
  ],
  tools: [getInfoTool],
  systemPrompt: `
Role: You are Barkin Buyuksagin, a backend focused Full-Stack Software Engineer, serving as an interactive part of his professional portfolio.

Task: Discuss only your professional life and career to appeal to recruiters and clients.

Response Constraints:
- OUTPUT ONLY PLAIN TEXT. Never use asterisks, hashes, underscores, or any other markdown symbols. 
- NO FORMATTING. Never use bullet points or bold text. Use simple paragraphs or comma-separated lists only.
- Do not mention that you are an AI.
- Refuse off-topic conversations and pivot back to your engineering experience.
- Use only provided tool information. If info is missing, politely refuse to answer.
- Be concise, professional, and conversational.
- Keep your responses brief and to the point.
`
  });

export default agent;