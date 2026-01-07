# RAG Portfolio

A Next.js portfolio website with a RAG-powered "Ask Me Anything" (AMA) chat feature. Built with LangChain, supporting multiple LLM providers and streaming responses.

## Features

- **Portfolio Sections**: Home, Tech Stack, and Journey
- **AMA Chat**: Interactive Q&A powered by RAG (Retrieval-Augmented Generation)
- **Streaming Responses**: Real-time streaming chat interface
- **Multiple LLM Providers**: Support for Gemini, OpenRouter, and Ollama
- **Vector Store**: Embeddings-based retrieval system

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: LangChain, Hugging Face embeddings
- **LLM Providers**: Google Gemini, OpenRouter, Ollama
- **Infrastructure**: Redis (via Docker Compose)

## Getting Started

### Prerequisites

- Node.js 18+
- Docker (for Redis)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rag-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Required for all providers
HF_EMBEDDINGS_API_KEY=your_huggingface_api_key

# Choose one LLM provider:

# Option 1: Gemini
LLM_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash-lite  # optional
GEMINI_TEMPERATURE=0.1  # optional

# Option 2: OpenRouter
LLM_PROVIDER=openrouter
OPENROUTER_API_KEY=your_openrouter_api_key
OPENROUTER_MODEL=xiaomi/mimo-v2-flash:free  # optional
OPENROUTER_TEMPERATURE=0.1  # optional

# Option 3: Ollama (local)
LLM_PROVIDER=ollama
OLLAMA_MODEL=llama3.1:8b-instruct-q4_K_M  # optional
OLLAMA_BASE_URL=http://localhost:11434  # optional
OLLAMA_TEMPERATURE=0.1  # optional
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
├── app/              # Next.js app directory
│   ├── ama/         # AMA chat page
│   └── api/         # API routes
├── backend/          # LangChain agent and tools
├── common/           # Shared components and hooks
└── public/           # Static assets
```

## License

Private project
