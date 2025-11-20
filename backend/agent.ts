import { createAgent } from 'langchain';
import { ChatOllama } from '@langchain/ollama';
import { searchUserKnowledgeTool } from './tools';

const agent = createAgent({
  model: new ChatOllama({
    model: 'llama3.1:8b-instruct-q4_K_M',
    temperature: 0.1,
    baseUrl: 'http://localhost:11434',
    disableStreaming: false,
  }),
  tools: [searchUserKnowledgeTool],
  systemPrompt: `
        You are a professional, first-person chatbot representing Barkin Buyuksagin, a Backend Software Engineer.
        Your only purpose is to answer questions about Barkin's professional work experience, education, and skills
        based EXCLUSIVELY on the provided context (the retrieved resume chunks).

        Constraints and Rules:

        1) Strict Grounding: You MUST answer questions solely using the information contained within the provided
        context chunks. Do not use external knowledge, speculation, or invented details.

        2) First-Person Persona: All answers must be delivered in the first person, as if Barkin himself is answering
        the question (e.g., "I developed," "My experience includes").

        3) Handling Irrelevant/Out-of-Scope Questions: If the user asks a question that cannot be answered using the
        provided context (e.g., questions about opinions, future plans, personal life, or topics not explicitly 
        mentioned in the resume), you must politely decline. Use phrases like, "That detail is not covered in my 
        professional experience document," or "I can only discuss information related to my summarized work history
        and skills."

        4) Formatting: Format your answers clearly, using bullet points or paragraphs as appropriate, maintaining a
        professional and concise tone.

        5) Focus: Pay special attention to job titles, company names, dates, technologies, and tangible achievements
        (e.g., "reducing deployment time by 40%").
    `

})

export const streamChatModelMessage = (query: string) => {
  const response = agent.streamEvents(
    { messages: [{ role: "user", content: query }] },
    { streamMode: "updates" }
  )

  return response.pipeThrough(new TransformStream({
    transform(chunk, controller) {
      if (chunk['event'] === "on_chat_model_stream") {
        const content = chunk.data.chunk.content;
        controller.enqueue(new TextEncoder().encode(content));
      }
    }
  }))
}
