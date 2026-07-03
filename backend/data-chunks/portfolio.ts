import { Topic } from "@/backend/enums";
import { Document } from "langchain";

const portfolioProjectChunks: Document[] = [
  new Document({
    pageContent: `
  A Next.js portfolio website with a RAG-powered "Ask Me Anything" chat feature that allows visitors to ask questions about my experience, projects, and background.
  
  Project Type: Personal Portfolio
  Status: Active
  
  The portfolio showcases my work and includes an interactive AMA chat powered by RAG (Retrieval-Augmented Generation), enabling natural conversations about my professional background. The chat uses semantic search to retrieve relevant information from a vector store and generates responses using multiple LLM providers.`,
    metadata: {
      tags: [Topic.Projects],
      source: "rag portfolio docs - overview",
    },
    id: "rag-portfolio-overview",
  }),

  new Document({
    pageContent: `
  • Portfolio Sections: Home page, Tech Stack showcase, and Journey timeline displaying work experience
  • AMA Chat: Interactive Q&A powered by RAG with semantic search capabilities
  • Streaming Responses: Real-time streaming chat interface for better user experience
  • Multiple LLM Providers: Flexible support for Gemini, OpenRouter, and Ollama
  • Vector Store: Embeddings-based retrieval system using Hugging Face embeddings
  • Dark Mode: Modern UI with dark mode support and responsive design
  
  The AMA chat feature allows visitors to ask questions about my portfolio, experience, or projects, with the agent providing accurate, context-aware responses based on the vector store data.`,
    metadata: {
      tags: [Topic.Projects],
      source: "rag portfolio docs - key features",
    },
    id: "rag-portfolio-features",
  }),

  new Document({
    pageContent: `
  Frontend:
  • Next.js 16 with App Router for server-side rendering and routing
  • React 19 for the user interface
  • Tailwind CSS for styling and responsive design
  
  Backend & AI:
  • LangChain for agent orchestration and tool management
  • Hugging Face Inference API for embeddings and semantic search
  • Upstash Vector Store for document storage and retrieval
  • Multiple LLM providers: Google Gemini, OpenRouter, and Ollama for flexibility
  
  Infrastructure:
  • MongoDB for conversation persistence and checkpoints
  • TypeScript for type safety across the codebase
  • Zod for environment variable validation`,
    metadata: {
      tags: [Topic.Projects],
      source: "rag portfolio docs - technology stack",
    },
    id: "rag-portfolio-tech-stack",
  }),

  new Document({
    pageContent: `
  The RAG (Retrieval-Augmented Generation) system architecture:
  
  • Vector Store: Uses Upstash Vector Store with Hugging Face Inference API embeddings
  • Document Chunking: Section-based chunking strategy with rich metadata tags (general_info, contact, work_experience, skills, education, achievements, projects)
  • Semantic Search: Similarity search with topic-based filtering to retrieve relevant context from vector store
  • Retrieval Tool: Single getInfoTool that handles all information retrieval with topic filtering for precise results
  • Streaming Responses: Real-time streaming for better user experience
  • Agent System: LangChain agent with middleware pipeline (summarization, MongoDB persistence, optional push notifications via Firebase Cloud Messaging)
  • State Management: MongoDB checkpointer for conversation state persistence
  
  The system allows the agent to answer questions about portfolio, experience, and projects by retrieving relevant information from the vector store using semantic search with topic filtering, and using it as context for the LLM.`,
    metadata: {
      tags: [Topic.Projects],
      source: "rag portfolio docs - RAG implementation",
    },
    id: "rag-portfolio-rag-implementation",
  }),

  new Document({
    pageContent: `
  Problem: Needed a way to answer questions about portfolio, experience, and projects without hardcoding responses or maintaining a static FAQ.
  
  Solution: Implemented RAG system with:
  • Structured document chunks with topic-based metadata tags for precise filtering
  • Section-based organization (general_info, contact, work_experience, skills, education, achievements, projects)
  • Upstash Vector Store for scalable document storage and retrieval
  • Single flexible retrieval tool with topic filtering for all information types
  • Multiple LLM provider support for flexibility and cost optimization
  • MongoDB for conversation persistence and state management
  • Streaming responses for real-time user feedback
  • Middleware pipeline for conversation summarization and optional monitoring
  
  Result: 
  • Natural conversation flow with context-aware responses
  • Easy to update by adding new documents to the vector store
  • Supports multiple LLM backends (Gemini, OpenRouter, Ollama)
  • Accurate retrieval through semantic search and metadata filtering`,
    metadata: {
      tags: [Topic.Projects],
      source: "rag portfolio docs - architecture decisions",
    },
    id: "rag-portfolio-architecture-decisions",
  }),

];

export default portfolioProjectChunks;
