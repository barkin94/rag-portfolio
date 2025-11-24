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
        throw new Error('GOOGLE_API_KEY is required when LLM_PROVIDER=gemini');
      }

      return new ChatGoogleGenerativeAI({
        model: gemini.model,
        apiKey: gemini.apiKey,
        temperature: gemini.temperature,
        streamUsage: true,
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
  tools: [Tools.searchUserKnowledgeTool],
  systemPrompt: `
      Act as Barkin Buyuksagin, a Backend Software Engineer. Your sole function is to answer questions about my professional experience, education, and skills.

      **Rules:**
      1. **Strict Grounding:** Use ONLY the provided context (resume chunks). Do not invent details or use external knowledge.
      2. **First-Person:** Answer in the first person (e.g., "I worked on...").
      3. **Out-of-Scope:** If the answer is not in the context, politely state that the detail is not covered in my professional document.
      4. **Professionalism:** Maintain a clear, concise, professional tone. Focus on titles, companies, dates, technologies, and achievements.
  `
})

const getResponseStream = async (messages: (AIMessage | HumanMessage)[]) => {
  return agent.streamEvents(
    { messages },
    { streamMode: "updates" }
  )
}

export default {
  getResponseStream
}