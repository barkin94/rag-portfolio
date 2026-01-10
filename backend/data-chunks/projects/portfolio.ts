import { Topic } from "@/backend/enums";
import { Document } from "langchain";

const PROJECT_NAME = "rag-portfolio";
const RAG_PORTFOLIO_TECHNOLOGIES: string[] = [
  "Next.js",
  "React",
  "Tailwind",
  "TypeScript",
  "LangChain",
  "Hugging Face",
  "RAG",
  "Gemini",
  "OpenRouter",
  "Ollama",
];

const portfolioProjectChunks: Document[] = [
  new Document({
    pageContent: `RAG PORTFOLIO WEBSITE
  
  A Next.js portfolio website with a RAG-powered "Ask Me Anything" chat feature that allows visitors to ask questions about my experience, projects, and background.
  
  Project Type: Personal Portfolio
  Status: Active
  
  The portfolio showcases my work and includes an interactive AMA chat powered by RAG (Retrieval-Augmented Generation), enabling natural conversations about my professional background. The chat uses semantic search to retrieve relevant information from a vector store and generates responses using multiple LLM providers.`,
    metadata: {
      tags: [Topic.Projects],
    },
  }),

  new Document({
    pageContent: `RAG PORTFOLIO - KEY FEATURES
  
  • Portfolio Sections: Home page, Tech Stack showcase, and Journey timeline displaying work experience
  • AMA Chat: Interactive Q&A powered by RAG with semantic search capabilities
  • Streaming Responses: Real-time streaming chat interface for better user experience
  • Multiple LLM Providers: Flexible support for Gemini, OpenRouter, and Ollama
  • Vector Store: Embeddings-based retrieval system using Hugging Face embeddings
  • Dark Mode: Modern UI with dark mode support and responsive design
  
  The AMA chat feature allows visitors to ask questions about my portfolio, experience, or projects, with the agent providing accurate, context-aware responses based on the vector store data.`,
    metadata: {
      tags: [Topic.Projects],
    },
  }),

  new Document({
    pageContent: `RAG PORTFOLIO - TECHNOLOGY STACK
  
  Frontend:
  • Next.js 16 with App Router for server-side rendering and routing
  • React 19 for the user interface
  • Tailwind CSS for styling and responsive design
  
  Backend & AI:
  • LangChain for agent orchestration and tool management
  • Hugging Face embeddings for vectorization and semantic search
  • Multiple LLM providers: Google Gemini, OpenRouter, and Ollama for flexibility
  • MemoryVectorStore for document storage and retrieval
  
  Infrastructure:
  • TypeScript for type safety across the codebase`,
    metadata: {
      tags: [Topic.Projects],
    },
  }),

  new Document({
    pageContent: `RAG PORTFOLIO - RAG IMPLEMENTATION
  
  The RAG (Retrieval-Augmented Generation) system architecture:
  
  • Vector Store: Uses Hugging Face Inference API embeddings with MemoryVectorStore
  • Document Chunking: Section-based chunking strategy with rich metadata (overview, work, skills, education, achievements, projects)
  • Semantic Search: Similarity search to retrieve relevant context from vector store
  • Multiple Tools: 5 specialized retrieval tools for different data types (info, work experience, technical skills, education, achievements, projects)
  • Streaming Responses: Real-time streaming for better user experience
  • Agent System: LangChain agent that orchestrates tool calls and generates responses
  
  The system allows the agent to answer questions about portfolio, experience, and projects by retrieving relevant information from the vector store and using it as context for the LLM.`,
    metadata: {
      tags: [Topic.Projects],
    },
  }),

  new Document({
    pageContent: `RAG PORTFOLIO - ARCHITECTURE DECISIONS
  
  Problem: Needed a way to answer questions about portfolio, experience, and projects without hardcoding responses or maintaining a static FAQ.
  
  Solution: Implemented RAG system with:
  • Structured document chunks with metadata for precise filtering
  • Section-based organization (overview, work, skills, education, achievements, projects)
  • Multiple LLM provider support for flexibility and cost optimization
  • Streaming responses for real-time user feedback
  • Specialized tools for different information types
  
  Result: 
  • Natural conversation flow with context-aware responses
  • Easy to update by adding new documents to the vector store
  • Supports multiple LLM backends (Gemini, OpenRouter, Ollama)
  • Accurate retrieval through semantic search and metadata filtering`,
    metadata: {
      tags: [Topic.Projects],
    },
  }),

  // new Document({
  //   pageContent: `RAG PORTFOLIO - PROJECT STRUCTURE
  
  // The project is organized as follows:
  
  // • app/ - Next.js app directory containing pages and API routes
  //   - ama/ - AMA chat page with interactive chat interface
  //   - api/ - API routes for handling chat requests
  //   - _components/ - React components for portfolio sections
  
  // • backend/ - LangChain agent and tools
  //   - agent.ts - Main agent configuration and streaming
  //   - tools.ts - RAG tools for retrieving information
  //   - vector-store.ts - Vector store setup and document chunks
  //   - config.ts - Configuration for LLM providers and embeddings
  
  // • common/ - Shared components and hooks
  //   - components/ - Reusable UI components
  //   - hooks/ - Custom React hooks
  //   - utils/ - Utility functions
  
  // • public/ - Static assets`,
  //   metadata: {
  //     section: "projects",
  //     projectName: PROJECT_NAME,
  //     topics: ["project-structure", "organization"],
  //     technologies: RAG_PORTFOLIO_TECHNOLOGIES,
  //   },
  // }),
];

export default portfolioProjectChunks;
