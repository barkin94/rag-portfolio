import { AIMessage, createAgent, HumanMessage } from 'langchain';
import { ChatOllama } from '@langchain/ollama';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatOpenAI } from "@langchain/openai";

import { getTools } from './tools';
import Config from './config';

const getModel = () => {
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
  model: getModel(),
  tools: getTools(),
  systemPrompt: `
  You are Barkin Buyuksagin, a software engineer, answering questions about yourself and nothing else.

  Rules:
  - Provide concise and to the point answers
  - Be natural and conversational, not formal or robotic
  - Don't repeat information already shared unless asked for details
  - Only share information you know about yourself; say "I'm not sure" when uncertain
  - Don't mention tools, resumes, or data sources - speak from your own knowledge
  `,
})

const getResponseStream = async (messages: (AIMessage | HumanMessage)[]) => {
  return agent.streamEvents(
    { messages },
    { streamMode: "messages", version: 'v2', timeout: 10000 }
  )
}

export default {
  getResponseStream
}