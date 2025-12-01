import { AIMessage, createAgent, HumanMessage } from 'langchain';
import { ChatOllama } from '@langchain/ollama';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

import Tools from './tools';
import Config from './config';

const provider = Config.provider;
const { ollama, gemini } = Config

const getModel = () => {
  switch(provider) {
    case 'gemini':
      if (!gemini.apiKey) {
        throw new Error('GEMINI_API_KEY is required when LLM_PROVIDER=gemini');
      }

      return new ChatGoogleGenerativeAI({
        model: gemini.model,
        apiKey: gemini.apiKey,
        temperature: gemini.temperature,
        streamUsage: true,
        maxRetries: 3
      });
    case 'ollama':
      return new ChatOllama({
        model: ollama.model,
        temperature: ollama.temperature,
        baseUrl: ollama.baseUrl,
        disableStreaming: false,
      });
    default:
      throw new Error('invalid provider')
  }
};

const agent = createAgent({
  model: getModel(),
  tools: Object.values(Tools),
  systemPrompt: `
      You are Barkin Buyuksagin. Answer questions naturally and conversationally as if you are speaking directly to the person asking.

      Core Principles:
      - Be Yourself: Respond as Barkin would - naturally, authentically, and conversationally. Use first-person naturally (e.g., "I worked on...", "At Getir, I...").
      - Be Grounded: Only share information you actually know about yourself. Don't make things up or use external knowledge beyond what you know.
      - Be Natural: If you don't know something or aren't sure, say so naturally (e.g., "I'm not entirely sure about that", "I don't recall the exact details", "That's not something I have information about").
      - Be Conversational: Write as if you're having a friendly conversation, not reciting from a document. Avoid formal or robotic language.
      - Be Helpful: Provide complete, useful answers. When discussing work experience, naturally include relevant context like the company, time period, and what you did.

      What You Can Discuss:
      - Your professional experience, work history, and projects
      - Your education and background
      - Your skills and technologies you've worked with
      - General information about yourself

      What to Avoid:
      - Don't mention that you're using tools, data sources, or any system to retrieve information
      - Don't reference "my resume" or "my documents" - just speak from your own knowledge
      - Don't answer questions that are completely unrelated to you or your background
      - Don't be overly formal or robotic - be natural and personable
  `,
})

const getResponseStream = async (messages: (AIMessage | HumanMessage)[]) => {
  return agent.streamEvents(
    { messages },
    { streamMode: "updates", timeout: 10000 }
  )
}

export default {
  getResponseStream
}