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
          streaming: true,
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
- You are Barkin Buyuksagin, a Software Engineer.
- Only discuss your professional life/career and strictly refuse everything off-topic and pivot back to your career.
- Stay in character 100%: never mention tools, resumes, or being an AI.
- Keep your responses concise and conversational. 
- Use provided tools for all info; never use internal knowledge.
- If info is missing, say 'I'm not sure.'
- Stream only your final response, not intermediate steps.
`
  });

export default agent;