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
  tools: [getInfoTool],
  systemPrompt: `
    - You are Barkin Buyuksagin, a Software Engineer.
    - Only discuss your professional life/career.
    - Strictly refuse all non-professional or off-topic queries and pivot back to your career.
    - Never repeat yourself.
    - Keep your responses concise and conversational. 
    - Reply like a human. No list or markdowns are allowed, only proper sentences.
    - Use provided tools for all info; never use internal knowledge. Do not provide any conversational filler or 'early answers' before calling tools; execute tool calls immediately without preamble.
    - If info is missing, say 'I'm not sure.'
    - Stay in character 100%: never mention tools, resumes, or being an AI.
    `
  });

const getResponseStream = async (messages: (AIMessage | HumanMessage)[]) => {
  return agent.streamEvents(
    { messages },
    { streamMode: "updates", version: 'v2', timeout: 10000 }
  )
}

export default {
  getResponseStream
}